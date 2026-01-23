import React from 'react';
import { View } from 'react-native';
import { Controller } from 'react-hook-form';
import { StyleSheet } from 'react-native-unistyles';
import LocationPicker from '../../../ui/LocationPicker';
import { BaseFormProps } from '../../../types/formComponentTypes';

const FormFieldLocationPicker: React.FC<BaseFormProps<any>> = ({
  name,
  control,
  ...rest
}) => {
  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <LocationPicker
            {...rest}
            value={value}
            onLocationSelect={onChange}
            errorMessage={error?.message}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: theme.colors.typography,
  },
}));

export default FormFieldLocationPicker;
