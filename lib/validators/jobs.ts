import { z } from "zod";

const jobStatusSchema = z.enum([
  "Saved",
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
]);

const interviewRoundSchema = z.object({
  name: z.string().trim().min(1),
  status: z.enum(["Done", "Upcoming", "Pending"]),
});

const optionalTrimmedString = z
  .string()
  .trim()
  .transform((value) => (value.length ? value : undefined));

const nullableTrimmedString = z
  .string()
  .trim()
  .transform((value) => (value.length ? value : null))
  .nullable();

export const createJobSchema = z.object({
  company: z.string().trim().min(1),
  role: z.string().trim().min(1),
  status: jobStatusSchema.optional(),
  notes: nullableTrimmedString.optional(),
  followUp: nullableTrimmedString.optional(),
  contactName: nullableTrimmedString.optional(),
  contactEmail: nullableTrimmedString.optional(),
  interviewRounds: z.array(interviewRoundSchema).optional(),
  location: nullableTrimmedString.optional(),
  link: nullableTrimmedString.optional(),
});

export const updateJobSchema = z
  .object({
    company: optionalTrimmedString.optional(),
    role: optionalTrimmedString.optional(),
    status: jobStatusSchema.optional(),
    notes: nullableTrimmedString.optional(),
    followUp: nullableTrimmedString.optional(),
    contactName: nullableTrimmedString.optional(),
    contactEmail: nullableTrimmedString.optional(),
    interviewRounds: z.array(interviewRoundSchema).nullable().optional(),
    location: nullableTrimmedString.optional(),
    link: nullableTrimmedString.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });
