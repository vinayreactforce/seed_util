import React from 'react';
import { Pressable } from 'react-native';
import Animated, { StretchOutX, StretchInX } from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';
import AppText from './AppText';

interface CheckBoxIconProps {
  isSelected: boolean;
  onPress: (data?: any, label?: string) => void;
  label?: string;
  data?: any;
}

export default function CheckBox({
  isSelected,
  onPress,
  label,
  data,
}: CheckBoxIconProps) {
  // Variant handles the style, Reanimated handles the movement
  styles.useVariants({ checked: isSelected });

  const handlePress = () => {
    onPress(data,label);
  };
  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <Animated.View style={[styles.checkbox]}>
        {isSelected && (
          <Animated.Text
            entering={StretchInX.duration(200)}
            exiting={StretchOutX.duration(300)}
            style={styles.checkmark}
          >
            ✓
          </Animated.Text>
        )}
      </Animated.View>
      {!!label && <AppText style={styles.label} text={label} type="label" size="medium" />}
    </Pressable>
  );
}

const styles = StyleSheet.create(({ colors, spacing }) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.inverse,
    borderColor: colors.grey400,
    transition: {
      backgroundColor: { duration: 1250 },
      borderColor: { duration: 1250 },
    },

    variants: {
      checked: {
        true: {
          backgroundColor: colors.primaryBrand,
          borderColor: colors.primaryBrand,
          transform: [{ scale: 1 }], // The target of our animation
        },
        false: {
          backgroundColor: colors.background,
          transform: [{ scale: 1 }],
        },
      },
    },
  },
  checkmark: {
    color: colors.inverse,
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    marginLeft: spacing.sm,
  },
}));
