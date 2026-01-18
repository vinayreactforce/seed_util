import React from 'react';
import { FieldValues } from 'react-hook-form';
import { FormEngineProps } from './FormTypes';
// Import your existing FormFields
import { 
  FormInput, 
  FormDropdown, 
  FormRadioGroup, 
  FormCheckboxGroup, 
  FormSlider, 
  FormDateTimePicker 
} from './FormFields'; 
import { ConditionalWrapper } from './components/ConditionalWrapper';

const COMPONENT_REGISTRY: Record<string, any> = {
  text: FormInput,
  dropdown: FormDropdown,
  radio: FormRadioGroup,
  checkbox: FormCheckboxGroup,
  slider: FormSlider,
  datetime: FormDateTimePicker,
};

export const FormEngine = <T extends FieldValues>({ 
    config, 
    control 
  }: FormEngineProps<T>) => {
    return (
      <>
        {config.map((field) => {
          const Component = COMPONENT_REGISTRY[field.ui] || FormInput;
  
          return (
            <ConditionalWrapper key={field.name} condition={field.visibleIf} control={control}>
              {field.render ? (
                field.render({ control, name: field.name })
              ) : (
                <Component
                  name={field.name}
                  control={control}
                  label={field.label}
                  options={field.options}
                  isMulti={field.isMulti}
                  {...field.props}
                />
              )}
            </ConditionalWrapper>
          );
        })}
      </>
    );
  };