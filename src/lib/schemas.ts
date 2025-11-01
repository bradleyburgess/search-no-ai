import * as z from "zod";

export const contactFormSchema = z.object({
  email: z.string().email(),
  name: z.string().min(4, "Too short"),
  subject: z.string().min(4, "Too short"),
  message: z.string().min(4, "Too short"),
});
