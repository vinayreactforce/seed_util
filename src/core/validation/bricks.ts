import { z } from 'zod';
import { normalizeToDate } from '../../utils/dateUtil';



/** * SECTION 1: THE RAW INGREDIENTS (Private Logic)
 * We don't export these. We keep the "Formatting Rules" here.
 */
const _emailRegex = z.string().email("Invalid email format");
const _mobileRegex = z.string().regex(/^[6-9]\d{9}$/, "Invalid 10-digit number");
const _panRegex = z.string().toUpperCase().regex(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, "Invalid PAN format");
const _pincodeRegex = z.string().length(6, "Must be 6 digits").regex(/^\d+$/, "Numbers only");
// const _gstRegex = z.string().toUpperCase().regex(/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/, { message: "Invalid GST format" });
// const _ifscRegex = z.string().toUpperCase().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, { message: "Invalid IFSC code format" });
// const _urlRegex = z.string().url({ message: "Invalid URL format" });

/** * SECTION 2: THE HELPERS (The "Magic" Wrappers)
 * These handle the "Empty vs Required" logic for you.
 */
// This is a helper function that ensures the field is required along with schema passed to it
const asRequired = (schema: z.ZodString, label: string) => 
  z.string().min(1, `${label} is required`).pipe(schema);

const asOptional = (schema: z.ZodString) => 
  schema.optional().or(z.literal(''));

;

// This is a helper function that checks if the field has a value or not( handles strings, arrays, objects, nulls)
const hasValue = (val: unknown): boolean => {
  if (val === null || val === undefined) return false;
  if (typeof val === 'string') return val.trim().length > 0;
  if (Array.isArray(val)) return val.length > 0;
  if (typeof val === 'object') return Object.keys(val).length > 0;
  return true;
};

const requiredBrick = (label: string | string[]) =>
  z.any().refine(hasValue, {
    message: `${Array.isArray(label) ? label.join(', ') : label} is required`,
  })

/** * SECTION 3: THE PUBLIC BRICKS (What you use in screens)
 * This is the clean, organized list for your team.
 */
export const Bricks = {
  // --- UNIVERSAL REQUIRED (Handles Strings, Arrays, Objects, Nulls) ---
  Required:requiredBrick,
  Mandatory: {
      required:  requiredBrick,
      optional: z.any().optional().or(z.literal('')),
  },  
  // EMAIL
  Email: {
    required: (label = "Email") => asRequired(_emailRegex, label),
    optional: asOptional(_emailRegex),
  },

  // PASSWORD: v4 recommends keeping logic simple or using .refine()
  Password: {
    required: (mode: 'numeric' | 'complex' = 'complex', label = "Password") => {
      const base = z.string().min(mode === 'numeric' ? 4 : 8, {
        error: `${label} is too short`
      });

      if (mode === 'numeric') {
        return base.regex(/^\d+$/, "Numbers only");
      }
      return base.regex(/[A-Z]/, "Uppercase required").regex(/[0-9]/, "Number required");
    },
    optional: (mode: 'numeric' | 'complex' = 'complex') => {
      const schema = mode === 'numeric' 
        ? z.string().regex(/^\d+$/, "Only numbers allowed").min(4, "Must be 4+ digits")
        : z.string().min(8, "Must be 8+ characters").regex(/[A-Z]/, "Include uppercase");

      // This allows the field to be empty OR follow the rules
      return schema.optional().or(z.literal(''));
    }
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
  Select: {
    required: (options: readonly [string, ...string[]], label: string) =>
      z.preprocess(
        (val) => (typeof val === "string" ? val.toLowerCase() : val),
        z.enum(options as [string, ...string[]]).refine(val => val !== undefined, { message: `Please select a valid ${label}` })
      ),
    optional: (options: readonly [string, ...string[]]) =>
      z.preprocess(
        (val) => (typeof val === "string" ? val.toLowerCase() : val),
        z.enum(options as [string, ...string[]]).optional()
      ),
  },

  Date: {
    required: (label = "Date", minAge?: number) => 
      z.preprocess(
        (val) => normalizeToDate(val),
        z.date({ message: `${label} is required` }) 
        .refine((date) => {
          if (!minAge) return true;
          const age = new Date().getFullYear() - date.getFullYear();
          return age >= minAge;
        }, { message: `Must be at least ${minAge} years old` })
      ),
    optional: z.preprocess(
      (val) => normalizeToDate(val),
      z.union([z.date(), z.null(), z.undefined()]).optional()
    ),
  },

  // FIXED NUMBER BRICK: Using 'message' for the coercion error
  Number: {
    required: (label: string, min = 0) => 
      z.coerce.number({ message: `${label} must be a number` })
       .min(min, { message: `${label} must be at least ${min}` }),
    optional: z.coerce.number().optional(),
  },

  Location: {
    required: (label: string = "Location") =>
      z
        .object({})
        .refine((val) => {
          if (typeof val !== "object" || val === null) return false;
  
          const keys = Object.keys(val);
          if (keys.length !== 2) return false; // must have exactly two keys
  
          return Object.values(val).every(
            (v) => typeof v === "number" && !Number.isNaN(v)
          );
        }, {
          message: `${Array.isArray(label) ? label.join(', ') : label} must be an object with 2 numeric values`,
        }),
    optional: z.any().optional().or(z.literal('')),
  },
  
  File: {
    required: (label = 'File') =>
      z.array(z.any()).nonempty(`${label} is required`).superRefine((val, ctx) => {
        // Loop through the array of files (even if it's just 1)
        val.forEach((file, index) => {
          const isFileObject =
            file &&
            typeof file === 'object' &&
            typeof file.uri === 'string' &&
            file.uri.length > 0;
  
          const isUrl =
            typeof file === 'string' && /^https?:\/\//.test(file);
  
          const isBase64 =
            typeof file === 'string' && /^data:image\/[a-zA-Z]+;base64,/.test(file);
  
          if (!isFileObject && !isUrl && !isBase64) {
            ctx.addIssue({
              code: 'custom',
              message: `File #${index + 1} is invalid`,
              path: [index], // Highlights the specific file in the array
            });
          }
        });
      }),
  
    optional: z.array(z.any()).optional().default([]),
  },
  
  // CHECKBOX (For Terms & Conditions)
  Agreed: (message: string) => 
    z.boolean().refine(val => val === true, { message }),
};