import { z } from "zod";

export const insertCustomerSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  address1: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  email: z.email({ message: "Email is required as coorect email" }),
  phone: z.string().regex(
    /^\d{3}-\d{3}-\d{4}$/, // <- Backslashes added here
    { message: "Invalid Phone number format. Use XXX-XXX-XXXX" }
  ),
  state: z.string().length(2, { message: "State must be exatly 2 characters" }),
  zip_code: z
    .string()
    .min(1)
    .regex(
      /^\d{5}(-\d{4})?$/, // <- Corrected regex
      {
        message:
          "Invalid zip code. Use 5 digits or 5 digits followed by hyphen and 4 digits",
      }
    ),
  saveCard: z.boolean().default(false),
  amount: z.number().min(1, "Amount must be at least $1"),
});

export const paymentIntentSchema = z.object({
  amount: z.number().min(1),
  currency: z.string().default("usd"),
  payment_method_types: z.array(z.string()).default(["card"]),
});

export type InsertCustomerSchemaType = z.infer<typeof insertCustomerSchema>;
