import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Controller, FieldValues,UseControllerProps } from 'react-hook-form';
import {
  SelectionProps,
  FormInputProps,
  FormDropdownProps,
  OptionValue,
} from '../../types/formComponent';
// Import your existing UI components
import { Radio, CheckBox, AppText, AppInput, AppDropdown,RangeSlider } from '../../ui';
import { moderateScale } from '../../theme/responsiveSize';

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

export const FormDropdown= <T extends FieldValues>({
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
    showValues=true,
    ...rest
  }: FormSliderProps<T>) => {
    return (
      <Controller
        name={name}
        control={control}
        render={({
          field: { onChange, value },
          fieldState: { error },
        }) => (
          <View style={styles.container}>
            {!!label && (
              <AppText text={label} type="header" />
            )}
            {showValues && (
              <AppText text={value?.toString()||""} style={{marginTop: 10 }} type="label" />
            )}
            <RangeSlider
              {...rest}
              // Ensure we pass the value from React Hook Form
              // Range mode expects [number, number], Single expects [number]
              initialValues={Array.isArray(value) ? value : [value || 0]}
              onChange={(vals) => {
                  // If single mode, just pass the number, else pass the array
                  onChange(rest.mode === 'single' ? vals[0] : vals);
              }}
            />
  
            {error && (
              <AppText text={error.message||""} color="error" style={{marginTop: 4 }} />)}
             
          </View>
        )}
      />
    );
  };

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
