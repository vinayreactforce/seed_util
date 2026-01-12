import React, { useState, memo, useMemo } from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';
import AppText from './AppText';
import { normalizeToDate, formatForDisplay } from '../utils/dateUtil';
import { DateMode } from '../constants/dateFormat';
import imagePath from '../constants/imagePath';

interface DateInputProps {
  field: string;
  value: string | null; 
  onChange: (value: string, field: string) => void;
  mode?: DateMode;
  label?: string;
  errorMessage?: string;
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
}

const DateTimePicker = memo(({
  field,
  value,
  onChange,
  mode = 'date',
  label,
  errorMessage,
  placeholder = 'Select',
  minimumDate,
  maximumDate,
}: DateInputProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const dateValue = useMemo(() => normalizeToDate(value), [value]);

  styles.useVariants({
    hasError: !!errorMessage,
    hasValue: !!dateValue,
  });

  const handleConfirm = (date: Date) => {
    setIsOpen(false);
    let output: string;

    if (mode === 'date') {
      output = format(date, 'yyyy-MM-dd'); // Neutral date for SQL/Salesforce
    } else if (mode === 'time') {
      output = format(date, 'HH:mm:ss');    // Neutral time
    } else {
      output = date.toISOString();          // UTC Datetime for Global Sync
    }

    onChange(output, field);
  };

  return (
    <View style={styles.wrapper}>
      {label && <AppText style={styles.label} text={label} />}

      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        <View style={styles.innerContainer}>
          <AppText 
            style={styles.inputText} 
            text={dateValue ? formatForDisplay(value, mode) : placeholder} 
          />
          <Image 
            source={imagePath[mode]} 
            style={styles.icon} 
            resizeMode="contain" 
          />
        </View>
      </TouchableOpacity>

      {!!errorMessage && <AppText style={styles.errorText} text={errorMessage} />}

      <DateTimePickerModal
        isVisible={isOpen}
        mode={mode}
        date={dateValue ?? new Date()}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onConfirm={handleConfirm}
        onCancel={() => setIsOpen(false)}
      />
    </View>
  );
});
export default DateTimePicker;

const styles = StyleSheet.create(theme => ({
  wrapper: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: theme.colors.typography, marginBottom: 8 },
  inputContainer: {
    height: 52,
    borderRadius: 12,
    backgroundColor: theme.colors.inverse,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    variants: {
      hasError: { true: { borderColor: theme.colors.error, backgroundColor: theme.colors.error + '10' } },
      hasValue: { true: { borderColor: theme.colors.border } },
    },
  },
  innerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  inputText: { 
    fontSize: 16,
    variants: {
      hasValue: { true: { color: theme.colors.typography }, false: { color: theme.colors.labelText } },
      hasError: { true: { color: theme.colors.error } }
    }
  },
  icon: { width: 20, height: 20, tintColor: theme.colors.typography },
  errorText: { fontSize: 12, color: theme.colors.error, marginTop: 4 },
}));