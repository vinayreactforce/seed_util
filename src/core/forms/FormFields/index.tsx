import React, {  useEffect, useMemo, useRef,Fragment } from 'react';
import { View } from 'react-native';

import { StyleSheet } from 'react-native-unistyles';
import { Controller, FieldValues, UseControllerProps, useWatch, Path, UseFormSetValue} from 'react-hook-form';
import {
  SelectionProps,
  FormInputProps,
  FormDropdownProps,
  OptionValue,
  FormDateTimePickerProps,
} from '../../../types/formComponentTypes';
// Import your existing UI components
import {
  Radio,
  CheckBox,
  AppText,
  AppInput,
  AppDropdown,
  RangeSlider,
  DateTimePicker,
} from '../../../ui';
import { moderateScale } from '../../../theme/responsiveSize';
import { getUniqueId } from '../../../utils/helperFunctions';

/**
 * TYPES
 */

/**
 * 1. SMART RADIO GROUP (Single Select)
 */
export function FormRadioGroup<T extends FieldValues>({
  name,
  control,
  options,
  label,
  title,
  direction = 'column',
}: SelectionProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={styles.container}>
          {!!title && (
            <AppText
              text={title}
              type="header"
              size="large"
              style={styles.headerTitle}
            />
          )}
          {!!label && (
            <AppText text={label} type="label" style={styles.fieldLabel} />
          )}

          <View style={[styles.listWrapper, { flexDirection: direction }]}>
            {options.map(opt => (
              <Radio
                key={opt.value.toString()}
                label={opt.label}
                isSelected={value === opt.value}
                onPress={() => onChange(opt.value)}
              />
            ))}
          </View>

          {!!error && (
            <AppText
              text={error.message || ''}
              color="error"
              size="small"
              style={styles.errorText}
            />
          )}
        </View>
      )}
    />
  );
}

/**
 * 2. SMART CHECKBOX GROUP (Multi Select)
 */
export function FormCheckboxGroup<T extends FieldValues>({
  name,
  control,
  options,
  label,
  title,
  direction = 'column',
}: SelectionProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, value = [] as (string | number)[] },
        fieldState: { error },
      }) => (
        <View style={styles.container}>
          {!!title && (
            <AppText
              text={title}
              type="header"
              size="large"
              style={styles.headerTitle}
            />
          )}
          {!!label && (
            <AppText text={label} type="label" style={styles.fieldLabel} />
          )}

          <View style={[styles.listWrapper, { flexDirection: direction }]}>
            {options.map(opt => {
              const isSelected = value?.includes(opt.value as OptionValue);
              return (
                <CheckBox
                  key={`${opt.value}`}
                  label={opt.label}
                  isSelected={isSelected}
                  onPress={() => {
                    const nextValue = isSelected
                      ? value.filter((v: string | number) => v !== opt.value)
                      : [...value, opt.value];
                    onChange(nextValue);
                  }}
                />
              );
            })}
          </View>

          {error && (
            <AppText
              text={error.message || ''}
              color="error"
              size="small"
              style={styles.errorText}
            />
          )}
        </View>
      )}
    />
  );
}

/**
 * 3. SMART INPUT GROUP (Single Line Text/Multi Line Text/ Text Area)
 */
export const FormInput = <T extends FieldValues>({
  name,
  control,
  label,
  ...rest
}: FormInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      //   rules={{ required: { value: true, message: 'This field is mandatory' } }}
      // Fix the "never" error by ensuring the default is a combined array type
      render={({
        field: { onChange, value = '' as string | number },
        fieldState: { error },
      }) => (
        <AppInput
          {...rest}
          label={label || name}
          value={value as string}
          onChangeText={onChange}
          errorMessage={error?.message}
        />
      )}
    />
  );
};

/**
 * 4. SMART DROPDOWN GROUP (Single Select/Multi Select/Searchable)
 */
export const FormDropdown = <T extends FieldValues>({
  name,
  control,
  label,
  ...rest
}: FormDropdownProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      // rules={{ required: { value: true, message: 'This field is mandatory' } }}
      // Fix the "never" error by ensuring the default is a combined array type
      render={({
        field: { onChange, value = '' as string | number },
        fieldState: { error },
      }) => (
        <AppDropdown
          {...rest}
          label={label || name}
          value={value as string | number | (string | number)[]}
          onSelect={onChange}
          errorMessage={error?.message}
        />
      )}
    />
  );
};




/**
 * 5. SMART DEPENDENT DROPDOWN GROUP (Dependent Dropdown)
 */

export const FormDependentDropdown = <T extends FieldValues>({
  name,
  control,
  dependsOn,
  options: staticOptions = [],
  setValue,
  ...rest
}: FormDropdownProps<T> & { setValue: UseFormSetValue<T> }) => {

  const parentValue = useWatch({ control, name: dependsOn as Path<T> });
  const childValue = useWatch({ control, name: name as Path<T> });

  // 1. Optimization: Index staticOptions into a Map for O(1) lookup
  // This runs only when the master options list changes.
  const optionsMap = useMemo(() => {
    const map = new Map<string, typeof staticOptions>();
    staticOptions.forEach(opt => {
      const pId = String(opt.parentId);
      if (!map.has(pId)) map.set(pId, []);
      map.get(pId)?.push(opt);
    });
    return map;
  }, [staticOptions]);

  // 2. Robust normalization to handle strings, objects, or arrays
  const parentKey = useMemo(() => {
    if (!parentValue) return undefined;

    if (Array.isArray(parentValue)) {
      const val = parentValue[0]?.value;
      return val !== undefined && val !== null ? String(val) : undefined;
    }

    if (typeof parentValue === 'object') {
      const obj = parentValue as Record<string, any>;
      const val = obj.value ?? obj[dependsOn as string];
      return val !== undefined && val !== null ? String(val) : undefined;
    }

    return String(parentValue);
  }, [parentValue, dependsOn]);

  // 3. Instant filtered options lookup
  const filteredOptions = useMemo(() => {
    if (!parentKey) return [];
    return optionsMap.get(parentKey) ?? [];
  }, [parentKey, optionsMap]);

  // 4. Performance Guard
  const lastParentKeyRef = useRef(parentKey);

  useEffect(() => {
    if (lastParentKeyRef.current === parentKey) return;
    lastParentKeyRef.current = parentKey;

    const isChildEmpty =
      !childValue ||
      (Array.isArray(childValue) && childValue.length === 0);

    const resetChild = () => {
      setValue(
        name as Path<T>,
        (rest.isMulti ? [] : undefined) as any,
        {
          shouldValidate: false, // Prevents persistent error UI
          shouldDirty: true,     // Correctly marks form as modified
          shouldTouch: false,    // Hides error until next user interaction
        }
      );
    };

    if (!parentKey) {
      if (!isChildEmpty) resetChild();
      return;
    }

    if (!isChildEmpty) {
      const childPrimitive =
        typeof childValue === 'object'
          ? childValue.value
          : childValue;

      // Note: we still use .some() on the filtered subset, 
      // which is now a much smaller array.
      const isValid = filteredOptions.some(
        opt => String(opt.value) === String(childPrimitive)
      );

      if (!isValid) resetChild();
    }
  }, [parentKey, filteredOptions, childValue, name, setValue, rest.isMulti]);

  return (
    <FormDropdown
      {...rest}
      name={name}
      control={control}
      options={filteredOptions}
      placeholder={
        !parentKey
          ? `Select ${ dependsOn ?? 'parent'} first`
          : rest.placeholder
      }
    />
  );
};


/**
 * 6. SMART SLIDER GROUP (Single Value/Range Value)
 */
interface FormSliderProps<T extends FieldValues> extends UseControllerProps<T> {
  label?: string;
  minimumValue: number;
  maximumValue: number;
  mode?: 'single' | 'range';
  allowDecimals?: boolean;
  style?: any;
  showValues?: boolean;
}

export const FormSlider = <T extends FieldValues>({
  name,
  control,
  label,
  showValues = true,
  ...rest
}: FormSliderProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={styles.container}>
          {!!label && <AppText text={label} type="header" />}
          {showValues && (
            <AppText
              text={value?.toString() || ''}
              style={{ marginTop: 10 }}
              type="label"
            />
          )}
          <RangeSlider
            {...rest}
            // Ensure we pass the value from React Hook Form
            // Range mode expects [number, number], Single expects [number]
            initialValues={Array.isArray(value) ? value : [value || 0]}
            onChange={vals => {
              // If single mode, just pass the number, else pass the array
              onChange(rest.mode === 'single' ? vals[0] : vals);
            }}
          />

          {error && (
            <AppText
              text={error.message || ''}
              color="error"
              style={{ marginTop: 4 }}
            />
          )}
        </View>
      )}
    />
  );
};

/**
 * 7. SMART DATE TIME PICKER GROUP (Date/Time/DateTime)
 */
export const FormDateTimePicker = <T extends FieldValues>({
  name,
  control,
  label,
  ...rest
}: FormDateTimePickerProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        // 1. Default value to null instead of an empty string
        field: { onChange, value = null },
        fieldState: { error },
      }) => (
        <DateTimePicker
          {...rest}
          // 2. Fallback label logic
          label={label || name}
          // 3. Ensure value is strictly string or null
          value={value as string | null}
          // 4. Match the prop name used in your base component
          onChange={onChange}
          errorMessage={error?.message}
        />
      )}
    />
  );
};

/**
 * 8. SMART HIDDEN GROUP (Hidden Field)
 */
export const FormHidden = ({ name, control, setValue, value, autoGenerate }: any) => {
  useEffect(() => {
    if (value) {
      setValue(name, value);
    } else if (autoGenerate) {
      setValue(name, getUniqueId());
    }
  }, [name, value, autoGenerate, setValue]);

  return (
    <Controller
      name={name}
      control={control}
      render={() => <Fragment key={name}/>} // It exists in the form tree but has no UI
    />
  );
};

/**
 * 9. SMART FILE PICKER GROUP (File/Image/Document)
 */
export { default as FormFilePicker } from './FormFilePicker';
export { default as FormAsyncDropdown } from './FormAsyncDropdown';

/**
 * STYLES
 */
const styles = StyleSheet.create(({ colors }) => ({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  headerTitle: {
    marginBottom: 4,
  },
  fieldLabel: {
    color: colors.labelText,
    marginBottom: moderateScale(10),
  },
  listWrapper: {
    flexWrap: 'wrap',
    gap: moderateScale(12), // Spacing between items
  },
  errorText: {
    color: colors.error,
    marginTop: 6,
  },
}));
