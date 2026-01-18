import { z } from 'zod';
import { Bricks } from '../core/validation/bricks';


export const formSchema = z.object({
  name: Bricks.Text.required("Name"),
  email: Bricks.Email.required("Email of the user"),
  age: Bricks.Number.required("Age", 18),
  gender: Bricks.Select.required(['male', 'Female', 'Other'] as const, "Gender"),
  interests: Bricks.Required("Interests"), // Handles the array validation
  story: Bricks.Text.optional,
  date: Bricks.Date.required("Appointment Date"),
});

// Input vs output differs because some bricks use z.preprocess / z.coerce.
// - input: what the form can hold before validation/transforms (e.g. string -> number)
// - output: what Zod returns after validation/transforms (e.g. number, Date)
export type TestFormInputValues = z.input<typeof formSchema>;
export type TestFormValues = z.output<typeof formSchema>;