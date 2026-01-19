import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { StyleSheet, withUnistyles,UnistylesThemes } from 'react-native-unistyles';
import * as icons from 'lucide-react-native';
import Icon from './Icon';
import AppText from './AppText';

interface ActionRowProps {
  label: string;
  onPress: () => void;
  iconName?: keyof typeof icons;
  iconColor?: string;
  iconBgColor?: string;
  variant?: 'default' | 'error' | 'disabled';
  showChevron?: boolean;
  style?: ViewStyle;
  // Injected by withUnistyles
  theme: UnistylesThemes['light'] | UnistylesThemes['dark']; 
}

const ActionRowComponent: React.FC<ActionRowProps> = ({
  label,
  onPress,
  iconName,
  iconColor,
  iconBgColor,
  variant = 'default',
  showChevron = true,
  style,
  theme, // Now you have access to theme.colors
}) => {
  const isDisabled = variant === 'disabled';
  const isError = variant === 'error';

  // Dynamic Defaults based on Theme
  const finalIconColor = iconColor ?? (isError ? theme.colors.error : theme.colors.primaryBrand);
  const finalIconBgColor = iconBgColor ?? theme.colors.background;

  const variantStyleMap = {
    default: styles.variantDefault,
    error: styles.variantError,
    disabled: styles.variantDisabled,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[styles.container, variantStyleMap[variant], style]}
    >
      <View style={styles.leftContent}>
        {iconName && (
          <View style={[styles.iconContainer, { backgroundColor: finalIconBgColor }]}>
            <Icon
              name={iconName}
              color={finalIconColor}
              size={20}
            />
          </View>
        )}

        <AppText text={label} type="label" size="medium" color={isError ? 'error' : 'primary'} style={styles.label} />
      </View>

      {showChevron && !isDisabled && (
        <Icon name="ChevronRight" color={theme.colors.border} size={18} />
      )}
    </TouchableOpacity>
  );
};

// Wrap the component to inject the theme
export default withUnistyles(ActionRowComponent, (theme) => ({
  theme,
}));

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  variantDefault: {},
  variantError: {},
  variantDisabled: { opacity: 0.5 },
  leftContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.typography,
  },
}));