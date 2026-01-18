import React from 'react';
import { useWatch, Control, FieldValues } from 'react-hook-form';
import { evaluateVisibility, VisibilityConfig } from '../utils/visibility';

interface Props {
  condition: VisibilityConfig; // Now mandatory for this sub-component
  control: Control<FieldValues>;
  children: (isVisible: boolean) => React.ReactNode;
}

export const VisibilityWatcher = ({ condition, control, children }: Props) => {
  // 1. Hook is called at the top level of this specific component
  // It is NOT conditional inside this file.
  const watchedValue = useWatch({
    control,
    name: condition.field,
  });

  const isVisible = evaluateVisibility(condition, watchedValue);

  // 2. Pass the result back up via a "Render Prop" pattern
  return <>{children(isVisible)}</>;
};