import React, { useRef, useEffect } from 'react';
import { View, TextInput } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import AppText from './AppText';
import { moderateScale } from '../theme/responsiveSize';
import { AppInputProps } from '../types/formComponentTypes';

// to add regular expression to the input
// const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
// const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
// and pass it


 function AppInput({
  label,
  errorMessage,
  isTextArea = false,
  style,
  numberOfLines,
  field,
  debounceTime = 0, // 0 means no debounce
  onChangeText,
  isCaptialized = false,
  ...props
}: AppInputProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  styles.useVariants({ hasError: !!errorMessage, isTextArea, isCaptialized });

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleChange = (value: string) => {
    if(!onChangeText){
        return;
    }
    // If no debounce is needed, act normally
    if (debounceTime === 0) {
      onChangeText(value, field);
      return;
    }

    // Otherwise, clear the previous timer and start a new one
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      onChangeText(value, field);
    }, debounceTime);
  };

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelMargin}>
          <AppText text={label} type="header" style={styles.labelText} size="small" />
        </View>
      )}

      <View style={styles.inputWrapper}>
        <TextInput
          {...props}
          style={[styles.input, style]}
          multiline={isTextArea}
          numberOfLines={numberOfLines ?? (isTextArea ? 4 : 1)}
          textAlignVertical={isTextArea ? 'top' : undefined}
          onChangeText={handleChange}
        />
      </View>

      {!!errorMessage && (
        <View style={styles.errorMargin}>
          <AppText text={errorMessage} style={styles.errorText} />
        </View>
      )}
    </View>
  );
}

export default React.memo(AppInput);
const styles = StyleSheet.create(({ colors, textSizeVariants,fontFamily }) => ({
  container: {
    width: '100%',
    marginVertical: moderateScale(8),
  },

  labelMargin: {
    marginBottom: moderateScale(6),
  },
  labelText: {
    textTransform: 'capitalize',
  },
  inputWrapper: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: colors.background,
    borderColor: colors.border,

    variants: {
      isFocused: {
        true: {
          borderColor: colors.border,
        },
      },
      hasError: {
        true: {
          borderColor: colors.error || 'red',
        },
      },
      isTextArea: {
        true: {
          minHeight: moderateScale(100),
          paddingTop: moderateScale(8),
        },
        false: {
          height: moderateScale(50),
        },
      },
    },
  },

  input: {
    flex: 1,
    paddingHorizontal: moderateScale(12),
    fontSize: textSizeVariants.bodyMedium,
    color: colors.valueText,
    placeholderTextColor: colors.placeholder,
    fontFamily: fontFamily.regular,
    variants: {
      isTextArea: {
        true: {
          paddingTop: moderateScale(10),
          paddingBottom: moderateScale(10),
        },
        false: {
          paddingVertical: 0,
        },
      },
      isCaptialized: {
        true: {
          textTransform: 'uppercase',
        },
      },
    },
  },

  errorMargin: {
    marginTop: moderateScale(4),
  },

  errorText: {
    color: colors.error || 'red',
    fontSize: moderateScale(12),
  },
}));
