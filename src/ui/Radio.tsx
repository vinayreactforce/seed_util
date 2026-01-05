import React from 'react';
import { Pressable, View } from 'react-native';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';
import AppText from './AppText';

interface RadioProps {
  isSelected: boolean;
  onPress: (data?: any, label?: string) => void;
  label?: string;
  data?: any;
}

export default function Radio({
  isSelected,
  onPress,
  label,
  data,
}: RadioProps) {
  styles.useVariants({ checked: isSelected });

  const handlePress = () => {
    onPress(data, label);
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <View style={styles.radioOuter}>
        {isSelected && (
          <Animated.View
            entering={ZoomIn.duration(200)}
            exiting={ZoomOut.duration(200)}
            style={styles.radioInner}
          />
        )}
      </View>
      {!!label && (
        <AppText
          textStyle={styles.label}
          text={label}
          type="label"
          size="medium"
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create(({ colors, spacing, textSizeVariants }) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12, // Perfectly circular
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.inverse,
    borderColor: colors.grey400,

    variants: {
      checked: {
        true: {
          borderColor: colors.primaryBrand, // Only border changes color
        },
      },
    },
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primaryBrand,
  },
  label: {
    marginLeft: spacing.sm,
    fontSize: textSizeVariants.labelLarge,
  },
}));
