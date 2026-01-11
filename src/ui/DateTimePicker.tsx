import React, { useState, memo } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AppText from './AppText';

interface DateInputProps {
  field: string; // Key for the form state (e.g., 'dateOfBirth')
  value: Date | null; // Support null for unselected states
  onChange: (date: Date, field: string) => void;
  mode?: 'date' | 'time' | 'datetime';
  label?: string;
  error?: string;
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
}

/**
 * AppDateInput: Enforced standard for all date/time picking across the app.
 * Optimized for React 19 concurrent rendering and RN 0.83 New Architecture.
 */
export const AppDateInput = memo(
  ({
    field,
    value,
    onChange,
    mode = 'date',
    label,
    error,
    placeholder = 'Select',
    minimumDate,
    maximumDate,
  }: DateInputProps) => {
    const [isOpen, setIsOpen] = useState(false);

    // Apply variants based on the existence of an error or a valid value

    styles.useVariants({ hasError: !!error, hasValue: !!value });

    const handleConfirm = (date: Date) => {
      setIsOpen(false);
      onChange(date, field);
    };

    const formatDisplayValue = () => {
      if (!value || !(value instanceof Date)) return placeholder;

      if (mode === 'date') return value.toLocaleDateString();
      if (mode === 'time') {
        return value.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
      }
      return value.toLocaleString();
    };

    return (
      <View style={styles.wrapper}>
        {label && <Text style={styles.label}>{label}</Text>}

        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => setIsOpen(true)}
          activeOpacity={0.7}
        >
          <AppText style={styles.inputText} text={formatDisplayValue()} />
        </TouchableOpacity>

        {!!error && <AppText style={styles.errorText} text={error} />}
        {isOpen && (
          <DateTimePickerModal
            isVisible={isOpen}
            mode={mode}
            // Safety: Ensures the picker always has a valid Date object to start with
            date={value instanceof Date ? value : new Date()}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            onConfirm={handleConfirm}
            onCancel={() => setIsOpen(false)}
            // display="default" allows the OS to choose the best native look (Calendar/Clock)
            display="default"
          />
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create(theme => ({
  wrapper: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.typography,
    marginBottom: 8,
  },
  inputContainer: {
    height: 52,
    borderRadius: 12,
    backgroundColor: theme.colors.inverse || '#F5F7FA',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'transparent', // Default state
    variants: {
      hasError: {
        true: {
          borderColor: theme.colors.error || '#FF3B30',
          backgroundColor: theme.colors.error + '10' || '#FFF5F5', // Optional: light red tint
        },
      },
      hasValue: {
        true: {
          // You can add styles for when a value is present (e.g., active border)
        },
      },
    },
  },
  inputText: {
    fontSize: 16,
    color: theme.colors.labelText || '#8E8E93', // Default/Placeholder color
    variants: {
      hasValue: {
        true: {
          color: theme.colors.typography || '#1C1C1E',
        },
      },
      hasError: {
        true: {
          color: theme.colors.error || '#FF3B30',
        },
      },
    },
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.error || '#FF3B30',
    marginTop: 4,
    fontWeight: '500',
  },
}));
