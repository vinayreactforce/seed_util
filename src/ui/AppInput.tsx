import React, { useRef, useEffect } from 'react';
import { View, TextInput, TextInputProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import AppText from './AppText';
import { moderateScale } from '../theme/responsiveSize';
import fontFamily from '../theme/fontFamily';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  isTextArea?: boolean;
  debounceTime?: number;
  field?: string;
  onChangeText?: (text: string, key?: string) => void;
}

 function AppInput({
  label,
  error,
  isTextArea = false,
  style,
  numberOfLines,
  field,
  debounceTime = 0, // 0 means no debounce
  onChangeText,
  ...props
}: AppInputProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  styles.useVariants({ hasError: !!error, isTextArea });

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

      {error && (
        <View style={styles.errorMargin}>
          <AppText text={error} style={styles.errorText} />
        </View>
      )}
    </View>
  );
}

export default React.memo(AppInput);
const styles = StyleSheet.create(({ colors, textSizeVariants }) => ({
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
