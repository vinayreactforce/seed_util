import React from 'react';
import { View } from 'react-native';
import { Controller, Control } from 'react-hook-form';
import { StyleSheet } from 'react-native-unistyles';
import { FilePicker, FilePickerSource } from '../../../ui/FilePicker';
import AppText from '../../../ui/AppText';

interface FormFieldFileProps {
  name: string;
  control: Control<any>; // Passed explicitly like your other components
  label?: string;
  maxFiles?: number;
  sources?: FilePickerSource[];
  btnText?: string;
  rules?: object;
}

const FormFieldFile: React.FC<FormFieldFileProps> = ({
  name,
  control,
  label,
  maxFiles = 1,
  sources,
  btnText,
  ...rest
}) => {
  return (
    <View style={styles.container}>
      {label && <AppText text={label} type="header" />}
      
      <Controller
        control={control}
        name={name}
        
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View>
            <FilePicker
              {...rest}
              files={value || []}
              onFilesChange={onChange}
              maxFiles={maxFiles}
              sources={sources}
              btnText={btnText}
              
            />
            
            {error && (
              <AppText 
                text={error.message || 'Required'} 
                style={styles.errorText} 
              />
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
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
  errorText: {
    fontSize: 12,
    color: '#FF4D4D',
    marginTop: 4,
  },
}));

export default FormFieldFile; 