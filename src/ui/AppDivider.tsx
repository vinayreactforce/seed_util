import React, { memo } from 'react';
import { View, ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface DividerProps {
  variant?: 'solid' | 'dashed' | 'dotted' | 'none';
  margin?: 'none' | 'small' | 'medium' | 'large';
  orientation?: 'horizontal' | 'vertical';
  align?: 'auto' | 'start' | 'center' | 'end';
  thickness?: 1 | 2;
  length?: 'full' | 'half' | 'icon' | number;
  style?: ViewStyle;
}

 const AppDivider = memo(({
  variant = 'solid',
  margin = 'medium',
  orientation = 'horizontal',
  align = 'auto',
  thickness = 1,
  length = 'full',
  style,
}: DividerProps) => {

  const thicknessKey = thickness.toString() as '1' | '2';

  styles.useVariants({
    variant,
    margin,
    orientation,
    align,
    thickness: thicknessKey,
  });

  const isHorizontal = orientation === 'horizontal';

  /** Length handling (runtime layout – correct place) */
  const lengthStyle: ViewStyle = (() => {
    if (typeof length === 'number') {
      return isHorizontal ? { width: length } : { height: length };
    }

    switch (length) {
      case 'half':
        return isHorizontal ? { width: '50%' } : { height: '50%' };
      case 'icon':
        return isHorizontal ? { width: 24 } : { height: 24 };
      case 'full':
      default:
        return isHorizontal ? { width: '100%' } : { height: 24 };
    }
  })();

  return (
    <View
      
      style={[styles.container, lengthStyle, style]}
    />
  );
});
export default AppDivider;
const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.border ?? '#E1E1E1',

    variants: {
      orientation: {
        horizontal: {},
        vertical: {},
      },

      thickness: {
        '1': {},
        '2': {},
      },

      align: {
        auto: {},
        start: { alignSelf: 'flex-start' },
        center: { alignSelf: 'center' },
        end: { alignSelf: 'flex-end' },
      },

      variant: {
        solid: {},
        dashed: { borderStyle: 'dashed' },
        dotted: { borderStyle: 'dotted' },
        none: { opacity: 0 },
      },

      margin: {
        none: {},
        small: {},
        medium: {},
        large: {},
      },
    },

    compoundVariants: [
      // ───── Thickness ─────
      { orientation: 'horizontal', thickness: '1', styles: { height: 1, borderTopWidth: 1 } },
      { orientation: 'horizontal', thickness: '2', styles: { height: 2, borderTopWidth: 2 } },
      { orientation: 'vertical', thickness: '1', styles: { width: 1, borderLeftWidth: 1 } },
      { orientation: 'vertical', thickness: '2', styles: { width: 2, borderLeftWidth: 2 } },

      // ───── Solid override ─────
      {
        variant: 'solid',
        orientation: 'horizontal',
        styles: {
          borderTopWidth: 0,
          backgroundColor: theme.colors.border ?? '#E1E1E1',
        },
      },
      {
        variant: 'solid',
        orientation: 'vertical',
        styles: {
          borderLeftWidth: 0,
          backgroundColor: theme.colors.border ?? '#E1E1E1',
        },
      },

      // ───── Margins ─────
      { orientation: 'horizontal', margin: 'small', styles: { marginVertical: 8 } },
      { orientation: 'horizontal', margin: 'medium', styles: { marginVertical: 16 } },
      { orientation: 'horizontal', margin: 'large', styles: { marginVertical: 24 } },
      { orientation: 'vertical', margin: 'small', styles: { marginHorizontal: 8 } },
      { orientation: 'vertical', margin: 'medium', styles: { marginHorizontal: 16 } },
      { orientation: 'vertical', margin: 'large', styles: { marginHorizontal: 24 } },
    ],
  },
}));
