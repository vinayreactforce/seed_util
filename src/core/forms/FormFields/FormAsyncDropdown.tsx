import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useWatch, FieldValues, Path, UseFormSetValue, Control } from 'react-hook-form';
import debounce from 'lodash/debounce';
import { FormDropdown } from './index'; 
import { AppDropdownProps } from '../../../types/formComponentTypes';

// --- Enterprise Service Layer ---
const ApiService = {
  fetch: async (url: string, params: Record<string, any>, signal?: AbortSignal) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${url}?${queryString}`, {
      method: 'GET',
      signal
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  }
};

type DropdownOption = {
  label: string;
  value: string | number;
  parentId?: string | number;
  [key: string]: any; 
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
  const isMounted = useRef(false);
  const hydrationStartedRef = useRef<any>(null); // Guard for React 18 double-mounts

  // 1. Watch Parent & Current Value
  const parentValue = useWatch({ control, name: (dependsOn || '') as Path<T> });
  const currentValue = useWatch({ control, name });

  // 2. Normalize Parent Key
  const parentKey = useMemo(() => {
    if (parentValue == null || parentValue === '') return undefined;
    return typeof parentValue === 'object' 
      ? String((parentValue as any).value ?? (parentValue as any).id) 
      : String(parentValue);
  }, [parentValue]);

  // 3. Optimized Static Indexing
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

  // 4. Resolve Final Display Options
  const displayOptions = useMemo(() => {
    if (apiTarget) return remoteOptions;
    if (dependsOn) {
      if (!parentKey || !optionsMap) return [];
      return optionsMap.get(parentKey) ?? [];
    }
    return staticOptions;
  }, [apiTarget, remoteOptions, dependsOn, parentKey, optionsMap, staticOptions]);

  // 5. Debounced Search
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
      } catch (error:any) {
        if (error.name !== 'AbortError') console.error("Fetch Error:", error);
      } finally {
        if (requestId === requestIdRef.current) setIsFetching(false);
      }
    }, 500),
  [apiTarget, dependsOn, labelKey, valueKey, parentKeyName]);

  // 6. Handle Parent Changes (Using your working logic)
  const lastParentKeyRef = useRef<string | undefined>(parentKey);
  useEffect(() => {
    const hasParentChanged = lastParentKeyRef.current !== parentKey;
    lastParentKeyRef.current = parentKey;

    if (!isMounted.current) {
      isMounted.current = true;
      if (apiTarget && (parentKey || !dependsOn)) debouncedSearch('', parentKey);
      return; 
    }

    if (!hasParentChanged) return;

    if (dependsOn) {
      setValue(name, (rest.isMulti ? [] : undefined) as any, {
        shouldValidate: false, 
        shouldDirty: true,     
        shouldTouch: false,    
      });
    }

    if (apiTarget && (parentKey || !dependsOn)) {
      debouncedSearch('', parentKey);
    }
  }, [parentKey, name, setValue, dependsOn, apiTarget, debouncedSearch, rest.isMulti]);

  // 7. Hydration Layer: Resolves IDs to Labels in Edit Mode
  useEffect(() => {
    const hasValue = currentValue !== undefined && currentValue !== null && currentValue !== '';
    const isValueFound = displayOptions.some(opt => String(opt.value) === String(currentValue));

    if (hasValue && !isValueFound && apiTarget && hydrationStartedRef.current !== currentValue) {
      hydrationStartedRef.current = currentValue; // Prevents duplicate calls for same ID
      
      const hydrate = async () => {
        try {
          // Note: Backend should support fetching a specific record by its ID
          const response = await ApiService.fetch(apiTarget, { id: currentValue, limit: 1 });
          if (response && response.length > 0) {
            const item = response[0];
            const option = {
              ...item,
              label: String(item[labelKey]),
              value: item[valueKey],
            };
            setRemoteOptions(prev => [option, ...prev]);
          }
        } catch (e) {
          console.error("Hydration failed", e);
          hydrationStartedRef.current = null;
        }
      };
      hydrate();
    }
  }, [currentValue, apiTarget, displayOptions, labelKey, valueKey]);

  // 8. Cleanup
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
      onSearchChange={apiTarget ? (q) => debouncedSearch(q, parentKey) : undefined}
    />
  );
};

export default FormAsyncDropdown;