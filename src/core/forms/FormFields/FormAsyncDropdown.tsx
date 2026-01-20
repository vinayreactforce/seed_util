import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useWatch, FieldValues, Path, UseFormSetValue, Control } from 'react-hook-form';
import debounce from 'lodash/debounce';
import { FormDropdown } from './index'; 
import { AppDropdownProps } from '../../../types/formComponentTypes';

// --- Enterprise Service Layer ---
const ApiService = {
  fetch: async (url: string, params: Record<string, any>) => {
    // Note: GET requests should use query params, not a body
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${url}?${queryString}`, {
      method: 'GET',
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  }
};

// --- Types ---
type DropdownOption = {
  label: string;
  value: string | number;
  parentId?: string | number;
  [key: string]: any; // Support for additional API metadata
};

interface DependentDropdownProps<T extends FieldValues> extends Omit<AppDropdownProps, 'onSelect' | 'options'> {
  name: Path<T>;
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  dependsOn?: Path<T>;
  apiTarget?: string;
  labelKey?: string;
  valueKey?: string;
  parentKeyName?: string;
  options?: DropdownOption[];
}

const FormAsyncDropdown = <T extends FieldValues>({
  name,
  control,
  dependsOn,
  setValue,
  apiTarget,
  labelKey = 'label',
  valueKey = 'value',
  options: staticOptions = [],
  parentKeyName = 'parentId',
  ...rest
}: DependentDropdownProps<T>) => {
  const [remoteOptions, setRemoteOptions] = useState<DropdownOption[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const requestIdRef = useRef(0);

  // 1. Watch the parent value
  const parentValue = useWatch({
    control,
    name: (dependsOn || '') as Path<T>,
  });

  // 2. Normalize Parent Key
  const parentKey = useMemo(() => {
    if (parentValue == null || parentValue === '') return undefined;
    return typeof parentValue === 'object' 
      ? String((parentValue as any).value ?? (parentValue as any).id) 
      : String(parentValue);
  }, [parentValue]);

  // 3. Optimized Static Indexing (O(1) lookup)
  const optionsMap = useMemo(() => {
    if (apiTarget || !staticOptions.length) return undefined;

    const map = new Map<string, DropdownOption[]>();
    staticOptions.forEach(opt => {
      const key = String(opt.parentId);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(opt);
    });
    return map;
  }, [staticOptions, apiTarget]);

  // 4. Resolve Final Display Options (Polymorphic Logic)
  const displayOptions = useMemo(() => {
    // Mode A: Remote
    if (apiTarget) return remoteOptions;

    // Mode B: Static Dependent
    if (dependsOn) {
      if (!parentKey || !optionsMap) return [];
      return optionsMap.get(parentKey) ?? [];
    }

    // Mode C: Static Standalone
    return staticOptions;
  }, [apiTarget, remoteOptions, dependsOn, parentKey, optionsMap, staticOptions]);

  // 5. Debounced Search w/ Normalization & Race Protection
  const debouncedSearch = useMemo(() =>
    debounce(async (query: string, pKey?: string) => {
      if (dependsOn && !pKey && !query) {
        setRemoteOptions([]);
        return;
      }
      const requestId = ++requestIdRef.current;
      setIsFetching(true);
      try {
        const response = await ApiService.fetch(apiTarget!, {
          search: query,
          ...(pKey ? { [parentKeyName]: pKey } : {})
        });
        
        const normalized = response.map((item: any) => ({
          ...item,
          label: String(item[labelKey]),
          value: item[valueKey],
        }));

        if (requestId === requestIdRef.current) setRemoteOptions(normalized);
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        if (requestId === requestIdRef.current) setIsFetching(false);
      }
    }, 500),
  [apiTarget, dependsOn, labelKey, valueKey, parentKeyName]);

  // 6. Handle Parent Changes & State Cleanup
  const lastParentKeyRef = useRef<string | undefined>(parentKey);

  useEffect(() => {
    const isFirstRun = requestIdRef.current === 0;
    const hasParentChanged = lastParentKeyRef.current !== parentKey;
    lastParentKeyRef.current = parentKey;

    if (!hasParentChanged) return;

    // Auto-clear child selection if parent changes (skip on initial pre-fill)
    if (dependsOn && !isFirstRun) {
      setValue(name, (rest.isMulti ? [] : undefined) as any, { 
        shouldDirty: true,
        shouldValidate: false 
      });
    }

    // Trigger initial fetch if in Remote Mode
    if (apiTarget && (parentKey || !dependsOn)) {
      debouncedSearch('', parentKey);
    }
  }, [parentKey, name, setValue, dependsOn, apiTarget, debouncedSearch, rest.isMulti]);

  // 7. Component Lifecycle Cleanup
  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  

  return (
    <FormDropdown
      {...rest}
      name={name}
      control={control}
      options={displayOptions}
      isLoading={isFetching}
      // UX: Only disable if it's dependent and no parent is selected
    //   isDisabled={rest.isDisabled || (!!dependsOn && !parentKey)}
      onSearchChange={apiTarget ? (q) => debouncedSearch(q, parentKey) : undefined}
    //   placeholder={
    //     !!dependsOn && !parentKey 
    //       ? `Select ${dependsOn.replace(/Id|id/, '')} first` 
    //       : rest.placeholder
    //   }
    />
  );
};

export default FormAsyncDropdown;