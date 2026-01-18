import { Control, FieldValues, Path } from "react-hook-form";
import { Bricks } from "../validation/bricks"; // Import your actual Bricks object
import { VisibilityConfig } from "./utils/visibility";

// 1. DYNAMIC TYPE DEFINITION
// This extracts all the keys from your Bricks object ('Email' | 'Mobile' | 'Select' etc.)
export type ValidationBrickType = keyof typeof Bricks;

export type UIType = 'text' | 'dropdown' | 'radio' | 'checkbox' | 'slider' | 'datetime';

export interface Option {
    label: string;
    value: string | number;
    parentId?: string | number;
}

// 2. THE FIELD CONFIG
export interface FormFieldConfig<T extends FieldValues> {
  name: Path<T>;
  label: string;
  ui: UIType;
  type: ValidationBrickType; // Now perfectly synced with your Bricks file
  required?: boolean;
  options?: {label:string,value:string}[];
  isMulti?: boolean;
  props?: {
    // mode?: 'numeric' | 'complex' | 'date' | 'time' | 'datetime'; // For Password brick
    message?: string;           // For Agreed brick
    [key: string]: any;
  };
  render?: (props: { control: Control<T>; name: Path<T> }) => React.ReactElement;
  visibleIf?: VisibilityConfig;
  dependsOn?: keyof T; 
  // A function or URL to fetch new options when the parent changes
  getOptions?: (parentValue: any) => Promise<Option[]> | Option[];
}

export interface FormEngineProps<T extends FieldValues> {
  config: FormFieldConfig<T>[];
  control: Control<T>;
}