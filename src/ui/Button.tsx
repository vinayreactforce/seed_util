import React from 'react';
import { Pressable, Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'brand' | 'neutral' | 'destructive';
  isDisabled?: boolean;
}

const Button = ({ title, onPress, variant = 'brand', isDisabled }: Props) => {
  styles.useVariants({ variant });
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={[styles.container, isDisabled && styles.disabled]}
    >
      <Text style={[styles.text, isDisabled && styles.textDisabled]}>
        {title}
      </Text>
    </Pressable>
  );
};

export default Button;

// Unistyles 3 uses StyleSheet.create with a function that receives the theme
const styles = StyleSheet.create(theme => ({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    variants: {
      variant: {
        brand: {
          backgroundColor: theme.colors.primaryBrand,
          borderColor: theme.colors.primaryBrand,
        },
        neutral: {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
        destructive: {
          backgroundColor: theme.colors.error,
          borderColor: theme.colors.error,
        },
      },
    },
  },
  text: {
    fontSize: 14,
    fontFamily: theme.fontFamily.medium,
    variants: {
      variant: {
        brand: { color: '#FFFFFF' },
        neutral: { color: theme.colors.primaryBrand },
        destructive: { color: '#FFFFFF' },
      },
    },
  },
  disabled: {
    backgroundColor: theme.colors.disabledBackground,
    borderColor: theme.colors.border,
  },
  textDisabled: {
    color: theme.colors.disabled,
  },
}));
