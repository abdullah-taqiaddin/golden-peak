import { z } from "zod";

import { EXPERIENCE_LEVELS } from "@/lib/experience-level";

export const registerSchema = z.object({
  firstName: z.string().trim().min(1).max(50),
  lastName: z.string().trim().min(1).max(50),
  email: z.string().trim().email(),
  experienceLevel: z.enum(EXPERIENCE_LEVELS)
});

export const userLoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6).max(100)
});

export const adminLoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(100)
});

export const progressCreateSchema = z.object({
  entryDate: z.string().date(),
  revenue: z.coerce.number().finite()
});
