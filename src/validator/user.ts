import { z } from "zod";

// Zod schemas
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  password: z.string().min(8),
});

export const registerRequestSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string().optional(),
  });

export const loginRequestSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

export const editUserRequestSchema = z.object({
    name: z.string().optional(),
  });
  
  
