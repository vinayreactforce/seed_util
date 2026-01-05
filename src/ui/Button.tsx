import React from 'react';
import { Pressable, Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { moderateScale } from '../theme/responsiveSize';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'brand' | 'neutral' | 'destructive';
  type?: 'outline' | 'solid';
  size?: 'small' | 'medium' | 'large' | 'xLarge';
  circular?: boolean;
  isDisabled?: boolean;
}

const Button = ({
  title,
  onPress,
  variant = 'brand',
  type = 'solid',
  size,
  circular = false,
  isDisabled,
}: Props) => {
  styles.useVariants({ variant, type, size, circular });
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.container,
        isDisabled && styles.disabled,
        pressed && styles.pressed,
      ]}
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
    minHeight: moderateScale(40),
    borderRadius: 4,
    
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
      circular: {
        true: {
          borderRadius: moderateScale(30),
        },
      },
      size: {
        small: {
          minHeight: moderateScale(32),
        },
        medium: {
          minHeight: moderateScale(40),
        },
        large: {
          minHeight: moderateScale(48),
        },
        xLarge: {
          minHeight: moderateScale(56),
        },
      },
      type: {
        outline: {
          backgroundColor: theme.colors.appBackground,
        },
        solid: {},
      },
    },
  },
  text: {
    fontSize: theme.textSizeVariants.bodyMedium,
    fontFamily: theme.fontFamily.semiBold,
    textTransform: 'uppercase', // Optional for buttons
    textAlign: 'center',
    variants: {
      variant: {
        brand: { color: '#FFFFFF' },
        neutral: { color: theme.colors.primaryBrand },
        destructive: { color: '#FFFFFF' },
      },
      size:{
        small:{
          fontSize: theme.textSizeVariants.bodySmall,
        },
        medium:{
          fontSize: theme.textSizeVariants.bodyMedium,
        },
        large:{
          fontSize: theme.textSizeVariants.bodyLarge,
        },
        xLarge:{
          fontSize: theme.textSizeVariants.bodyXLarge,
        },
      },
    },
    compoundVariants: [
      {
        variant: 'brand',
        type: 'outline',
        styles: {
          color: theme.colors.primaryBrand,
        },
      },
      {
        variant: 'neutral',
        type: 'outline',
        styles: {
          color: theme.colors.border,
        },
      },
      {
        variant: 'destructive',
        type: 'outline',
        styles: {
          color: theme.colors.error,
        },
      },
    ],
  },
  disabled: {
    backgroundColor: theme.colors.disabledBackground,
    borderColor: theme.colors.border,
  },
  textDisabled: {
    color: theme.colors.disabled,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.998 }],
  },
}));
