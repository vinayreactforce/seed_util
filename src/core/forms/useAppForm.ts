// core/forms/useAppForm.ts
import { useMemo } from 'react';
import { useForm, UseFormProps, FieldValues, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSchemaFromConfig } from './FormFactory';
import { FormFieldConfig } from './FormTypes';
import { getCleanVisibleData } from './utils/formUtil';

export const useAppForm = <T extends FieldValues>({
  config,
  ...formOptions
}: {
  config: FormFieldConfig<T>[];
} & UseFormProps<T>) => {
  
  // 1. Memoize the "Soft" Schema (Conditional fields are optional here)
  const schema = useMemo(() => createSchemaFromConfig(config), [config]);

  const formMethods = useForm<T>({
    ...formOptions,
    resolver: zodResolver(schema) as unknown as Resolver<T>,
    mode: 'onTouched',
    shouldUnregister: true,
  });

  /**
   * handleSmartSubmit
   * Centralizes the Option A logic: 
   * - Validates visible conditional fields
   * - Strips hidden field data
   */
  const handleSmartSubmit = (onSuccess: (data: T) => void,onError?: (errors: any) => void) => {
    // We wrap the success handler AND handle the error state
    return formMethods.handleSubmit(
      (data) => {
        // Zod passed, but we still need to check visibleIf requirements
        const { cleanData, manualErrors } = getCleanVisibleData(config, data);

        if (Object.keys(manualErrors).length > 0) {
          Object.entries(manualErrors).forEach(([key, message]) => {
            formMethods.setError(key as any, { type: 'manual', message: message as string });
          });
          return;
        }
        onSuccess(cleanData as T);
      },
      (errors: any) => {
        // 1. Check manual errors first
        const currentValues = formMethods.getValues();
        const { manualErrors } = getCleanVisibleData(config, currentValues);

        // 2. Inject manual errors into RHF state
        Object.entries(manualErrors).forEach(([key, message]) => {
          formMethods.setError(key as any, { type: 'manual', message: message as string });
        });

        // 3. Call the external onError with the combined error state
        // We use a timeout or delay if we want to ensure the state is updated, 
        // but passing 'errors' usually suffices for immediate feedback.
        onError?.({ ...errors, ...manualErrors });
      }
    );
  };

  return {
    ...formMethods,
    handleSmartSubmit,
  };
};