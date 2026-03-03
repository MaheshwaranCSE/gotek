import { z } from "zod";

export const studentSchema = z.object({
  registrationId: z.string().trim().min(1, "Registration ID is required"),
  name: z.string().trim().min(1, "Name is required"),
  class: z.string().trim().optional(),
  section: z.string().trim().optional(),
  bloodGroup: z.string().trim().optional(),
  dob: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
  parentName: z.string().trim().optional(),
});

export type StudentInput = z.infer<typeof studentSchema>;

export const bulkStudentSchema = z.object({
  rows: z.array(studentSchema).max(1000, "Bulk upload limited to 1000 rows"),
});

