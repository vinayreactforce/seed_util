import React from 'react';
import { 
  Pressable, 
  Image, 
  StyleProp, 
  ImageStyle, 
  ViewStyle,
  // Ensure Pressable is imported to avoid red screen
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import imagePath from '../constants/imagePath'; // Adjust path as needed

interface Props {
  onPress: () => void;
  variant?: 'primary' | 'grey' | 'danger';
  circular?: boolean;
  size?: 'small' | 'medium' | 'large';
  iconStyle?: StyleProp<ImageStyle>;
  btnContainerStyle?: StyleProp<ViewStyle>;
  inverseTint?: boolean;
}

export default function CloseBtn({
  onPress,
  variant = 'grey',
  circular = false,
  size = 'medium',
  iconStyle,
  btnContainerStyle,
  inverseTint = false,
}: Props) {
  // Trigger variants in Unistyles
  styles.useVariants({ variant, circular, size, inverseTint });

  return (
    <Pressable
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={({ pressed }) => [
        styles.container, 
        btnContainerStyle, 
        pressed && styles.pressed
      ]}
      onPress={onPress}
    >
      <Image
        source={imagePath.closeIcon}
        style={[styles.image, iconStyle]}
        resizeMode="contain"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create(({ colors }) => ({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    variants: {
      size: {
        small: { width: 24, height: 24},
        medium: { width: 36, height: 36 },
        large: { width: 48, height: 48 },
      },
      variant: {
        primary: {
          backgroundColor: 'transparent',
        },
        grey: {
          backgroundColor: 'transparent',
        },
      },
      circular: {
        true: {
          borderRadius: 99,
        },
        false: {
          borderRadius: 0,
        },
      },
    },
    compoundVariants: [
      {
        variant: 'primary',
        circular: true,
        styles: {
          backgroundColor: colors.primaryBrand + '20', 
        },
      },
      {
        variant: 'grey',
        circular: true,
        styles: {
          backgroundColor: colors.grey50 || '#F2F2F7',
        },
      },
      {
        variant: 'danger',
        circular: true,
        styles: {
          backgroundColor: colors.error5 || '#F2F2F7',
        },
      },
    ],
  },
  image: {
    variants: {
      size: {
        small: { width: 10, height: 10 },
        medium: { width: 15, height: 15 },
        large: { width: 21, height: 21 },
      },
      variant: {
        primary: {
          tintColor: colors.primaryBrand,
        },
        grey: {
          tintColor: colors.grey450,
        },
        danger: {
          tintColor: colors.error,
        },
      },
      inverseTint: {
        true: {
          tintColor: colors.inverse,
        },
      },
    },
  },
  pressed: {
    opacity: 0.7,
  },
}));