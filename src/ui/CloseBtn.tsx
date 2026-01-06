import { Pressable, Image, StyleProp, ImageStyle } from 'react-native';

import React from 'react';
import imagePath from '../constants/imagePath';
import { StyleSheet } from 'react-native-unistyles';

interface Props {
  onPress: () => void;
  variant?: 'primary' | 'grey';
  circular?: boolean;
  iconStyle?: StyleProp<ImageStyle>;
}

export default function CloseBtn({
  onPress,
  variant = 'grey',
  circular = false,
  iconStyle,
}: Props) {
  // Pass the props into useStyles to trigger variants
  styles.useVariants({ variant, circular });

  return (
    <Pressable
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
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
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    variants: {
      // 1. Handle Colors
      variant: {
        primary: {
          // We define the base "primary" style here
          backgroundColor: 'transparent',
        },
        grey: {
          backgroundColor: 'transparent',
        },
      },
      // 2. Handle Shape
      circular: {
        true: {
          borderRadius: 20,
          height: 40,
          width: 40,
        },
        false: {
          borderRadius: 0,
        },
      },
    },
    // 3. Handle the "Intersection" (The Variants logic)
    compoundVariants: [
      {
        variant: 'primary',
        circular: true,
        styles: {
          backgroundColor: colors.primaryBrand + '20', // Primary with 12% opacity
        },
      },
      {
        variant: 'grey',
        circular: true,
        styles: {
          backgroundColor: colors.grey50 || '#F2F2F7',
        },
      },
    ],
  },
  image: {
    width: 16,
    height: 16,
    variants: {
      variant: {
        primary: {
          tintColor: colors.primaryBrand,
        },
        grey: {
          tintColor: colors.grey450,
        },
      },
    },
  },
  pressed: {
    opacity: 0.8,
  },
}));
