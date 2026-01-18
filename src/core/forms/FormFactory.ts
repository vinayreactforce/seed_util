// src/core/forms/FormFactory.ts
import { z } from 'zod';
import { Bricks } from '../validation/bricks'; 
import { FormFieldConfig } from './FormTypes';

// Dynamic schema: we can only safely return "some Zod object", not a Zod schema of `T`.
// If we assert it as `ZodType<T>` we lose the object-input typing and `zodResolver` overloads break.
export const createSchemaFromConfig = (config: FormFieldConfig<any>[]) => {
  const schemaMap: any = {};

  config.forEach((field) => {
    let baseZod: any;
    const brick = (Bricks as any)[field.type];

    const isRequired= field.required&&!field.visibleIf;;

    if (field.type === 'Select') {
      const opts = field.options || [];

      if (opts.length === 0) {
        // z.enum requires at least 1 option; fall back safely.
        baseZod = isRequired
          ? z.string().min(1, { message: `Please select a valid ${field.label}` })
          : z.string().optional().or(z.literal(''));
      } else {
        // Bricks.Select expects a non-empty tuple of string values.
        const values = opts.map(o => o.value) as [string, ...string[]];
        baseZod = isRequired
          ? Bricks.Required(field.label)
          : Bricks.Select.optional(values);
      }
  
    //   if (field.props?.isMulti) {
    //     baseZod = z.array(baseZod).min(isRequired ? 1 : 0, { 
    //       message: `Select at least one ${field.label}` 
    //     });
    //   }
    }
    else if (field.type === 'Password') {
      const mode = field.props?.mode || 'complex';
      baseZod = isRequired ? Bricks.Password.required(mode, field.label) : Bricks.Password.optional(mode);
    }
    else if (field.type === 'Number') {
        const min = field.props?.min || 0;
        baseZod = isRequired ? Bricks.Number.required(field.label,min) : Bricks.Password.optional();
      }
    else if (field.type === 'Agreed') {
      baseZod = Bricks.Agreed(field.props?.message || `${field.label} is required`);
    }
    else if (brick) {
      if (isRequired) {
        baseZod = field.type === 'Date' 
          ? brick.required(field.label, field.props?.minAge) 
          : brick.required(field.label);
      } else {
        baseZod = typeof brick.optional === 'function' ? brick.optional() : brick.optional; 
      }
    } else {
      baseZod = z.string().optional();
    }
    // Handle Conditional Visibility
    // If a field has a 'visibleIf' condition, it MUST be optional in the schema
    // because Zod validates the whole object before 'shouldUnregister' finishes.
    if (field.visibleIf) {
        baseZod = baseZod.optional().or(z.null()).or(z.literal(''));
      }

    schemaMap[field.name as string] = baseZod;
  });

  return z.object(schemaMap);
};