import { Control, FieldValues, Path } from "react-hook-form";
import { TextInputProps } from "react-native";
import { DateMode } from '../constants/dateFormat';


/**
 * TYPES
 */
interface Option {
    label: string;
    value: string | number;
    parentId?: string | number;
  }
  
export type OptionValue = Option['value'];
  
export interface AppDropdownProps {
    label?: string;
    options: Option[];
    value?: any; // Single ID or Array of IDs
    name?: string;
    placeholder?: string;
    isMulti?: boolean;
    hasSearch?: boolean;
    onSelect: (value: any, field: string) => void;
    errorMessage?: string;
}
  
export interface AppInputProps extends TextInputProps {
    label?: string;
    errorMessage?: string;
    isTextArea?: boolean;
    debounceTime?: number;
    field?: string;
    isCaptialized?: boolean;
    onChangeText?: (text: string, key?: string) => void;
}

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
  
//=====================MASTER BASE FORM PROPS =====================

// 1. The Master Base
export interface BaseFormProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
}



// 2. FormInput - Combining Base + React Native's TextInputProps
// Note the comma used to extend multiple types
export interface FormInputProps<T extends FieldValues> 
  extends BaseFormProps<T>, AppInputProps {
    // You can add extra props specific to your AppInput here
    containerStyle?: object;
}



// 3. Radio/Select Props
export interface OptionProps<T extends FieldValues> extends BaseFormProps<T> {
  options: { label: string; value: string | number }[];
}

// 4. Checkbox Props
export interface SelectionProps<T extends FieldValues> extends BaseFormProps<T> {
  title?: string;
  options: Option[];
  direction?: 'row' | 'column';
}

export interface FormDropdownProps<T extends FieldValues> extends Omit<AppDropdownProps, 'value' | 'onSelect' | 'errorMessage'> {
    name: Path<T>;
    control: Control<T>;
    rules?: object;
    dependsOn?: string; 
    required?: boolean;
    getOptions?: (parentValue: any) => Promise<Option[]> | Option[];
}


export interface FormDateTimePickerProps<T extends FieldValues> extends BaseFormProps<T>, Omit<DateInputProps, 'value' | 'onChange' | 'errorMessage'> {
}



