import { z } from 'zod';

/** * SECTION 1: THE RAW INGREDIENTS (Private Logic)
 * We don't export these. We keep the "Formatting Rules" here.
 */
const _emailRegex = z.string().trim().toLowerCase().email("Invalid email format");
const _mobileRegex = z.string().regex(/^[6-9]\d{9}$/, "Invalid 10-digit number");
const _panRegex = z.string().toUpperCase().regex(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, "Invalid PAN format");
const _pincodeRegex = z.string().length(6, "Must be 6 digits").regex(/^\d+$/, "Numbers only");

/** * SECTION 2: THE HELPERS (The "Magic" Wrappers)
 * These handle the "Empty vs Required" logic for you.
 */
const asRequired = (schema: z.ZodString, label: string) => 
  z.string().min(1, `${label} is required`).pipe(schema);

const asOptional = (schema: z.ZodString) => 
  schema.optional().or(z.literal(''));

/** * SECTION 3: THE PUBLIC BRICKS (What you use in screens)
 * This is the clean, organized list for your team.
 */
export const Bricks = {
  // EMAIL
  Email: {
    required: (label = "Email") => asRequired(_emailRegex, label),
    optional: asOptional(_emailRegex),
  },

  // MOBILE
  Mobile: {
    required: (label = "Mobile number") => asRequired(_mobileRegex, label),
    optional: asOptional(_mobileRegex),
  },

  // PAN CARD
  Pan: {
    required: (label = "PAN") => asRequired(_panRegex, label),
    optional: asOptional(_panRegex),
  },

  // PINCODE
  Pincode: {
    required: (label = "Pincode") => asRequired(_pincodeRegex, label),
    optional: asOptional(_pincodeRegex),
  },

  // GENERIC TEXT (For Name, Address, etc.)
  Text: {
    required: (label: string) => z.string().trim().min(1, `${label} is required`),
    optional: z.string().optional().or(z.literal('')),
  },

  // SELECTION (For Dropdowns/Enums)
  Select:{
    required: (options: readonly [string, ...string[]], label: string) => 
        z.enum(options as Record<string, any>).refine(val => val !== undefined, { message: `Please select a valid ${label}` }),
    optional: (options: readonly [string, ...string[]]) => 
      z.enum(options as Record<string, any>).optional(),
  },

  // CHECKBOX (For Terms & Conditions)
  Agreed: (message: string) => 
    z.boolean().refine(val => val === true, { message }),
};