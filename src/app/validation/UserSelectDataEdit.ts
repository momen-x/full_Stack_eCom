import z from "zod";

const selectTypeOfEdit = z.object({
  process: z.string().min(1, { message: "the prosess is required" }),
  userId: z.string().min(1),
  isAdmin: z.boolean().optional(),
  wishlist: z.array(z.string()).optional(),
  productId: z.string().optional(),
});


type TIsAdmin = z.infer<typeof selectTypeOfEdit>;

export { selectTypeOfEdit, type TIsAdmin };
