// visibility.ts
export type Operator = 'eq' | 'ne' | 'gt' | 'lt' | 'includes';

export interface VisibilityConfig {
  field: string;
  operator: Operator;
  value: any;
}

export const evaluateVisibility = (condition: VisibilityConfig, watchedValue: any): boolean => {
  if (!condition) return true;
  const { operator, value } = condition;

  switch (operator) {
    case 'eq': return watchedValue === value;
    case 'ne': return watchedValue !== value;
    case 'gt': return Number(watchedValue) > Number(value);
    case 'lt': return Number(watchedValue) < Number(value);
    case 'includes': 
      return Array.isArray(watchedValue) && watchedValue.includes(value);
    default: return false;
  }
};