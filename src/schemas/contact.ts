import { z } from "zod";

/**
 * Runtime validation schema for the interactive dispatch contact form (/contact).
 */
export const ContactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama minimal harus memuat 2 karakter.")
    .max(80, "Nama maksimal 80 karakter."),
  email: z
    .string()
    .trim()
    .email("Format alamat email tidak valid."),
  subject: z
    .string()
    .trim()
    .min(3, "Subjek minimal harus memuat 3 karakter.")
    .max(120, "Subjek maksimal 120 karakter."),
  message: z
    .string()
    .trim()
    .min(10, "Pesan minimal harus memuat 10 karakter.")
    .max(2000, "Pesan maksimal 2000 karakter."),
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;

export const initialContactFormData: ContactFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};
