// schemas/addProductSchema.ts
import z from "zod";

const addProductSchema = z.object({
  name: z.string().min(1, { message: "the product name is required" }),
  description: z
    .string()
    .min(1, { message: "the product description is required" }),
  price: z.number().positive({ message: "the price must be positive number" }),
  categoryId: z.string().min(1, { message: "the category is required" }),
  // ✅ Changed from z.file() to z.string() because we store the path
  image: z.string().optional(),
});

export default addProductSchema;
