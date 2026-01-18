import { evaluateVisibility } from "./visibility";
import { FormFieldConfig } from "../FormTypes";

type ValueTypeMap = {
    string: string;
    number: number;
    array: any[];
    boolean: boolean;
  };
  
  export function getFormMeta<T extends ReadonlyArray<any>>(config: T) {
    // Generate the Type
    type GeneratedInterface = {
      [K in T[number] as K['name']]: K['valueType'] extends keyof ValueTypeMap 
        ? ValueTypeMap[K['valueType']] 
        : any;
    };
  
    // Generate the Defaults
    const defaultValues = config.reduce((acc, field) => {
      acc[field.name] = field.defaultValue;
      return acc;
    }, {} as any) as GeneratedInterface;
  
    return {
      defaultValues,
      // We cast this back to a mutable-style array so FormEngine is happy
      mutableConfig: config as unknown as any[], 
    };
  }


  // src/core/forms/utils/FormUtils.ts
export const getCleanVisibleData = (config: FormFieldConfig<any>[], data: any) => {
  const cleanData = { ...data };
  const manualErrors: Record<string, string> = {};

  config.forEach((field) => {
    if (field.visibleIf) {
      const isVisible = evaluateVisibility(field.visibleIf, data[field.visibleIf.field]);
      
      // 1. Check for missing required data on visible fields
      if (isVisible && field.required && !data[field.name]) {
        manualErrors[field.name] = `${field.label} is required`;
      }
      
      // 2. Strip data from hidden fields (Prevents stale data in DB)
      if (!isVisible) {
        delete cleanData[field.name];
      }
    }
  });

  return { cleanData, manualErrors };
};