import z from "zod";

const addCategortySchema = z.object({
  title: z.string().min(1, { message: "the title is required" }),
  description: z.string().min(1, { message: "the description is required" }),
});

// type TCategory = {
//   title: string;
//   description: string;
// };
type TCategory = z.infer<typeof addCategortySchema>;
// export default addCategortySchema;

export { addCategortySchema, type TCategory };
