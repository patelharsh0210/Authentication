import { z } from "zod";

// Registration Schema (Requires Both Email and Username)
export const userInputSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  name: z.string().min(3, "Name must be at least 3 characters long"),
});

// Login Schema (Requires Either Email or Username)
export const loginInputSchema = z.object({
  identifier: z.string().min(3, "Username or email must be at least 3 characters long"), // Accepts either email or username
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Infer the TypeScript type from the schemas
export type UserInput = z.infer<typeof userInputSchema>;
export type LoginInput = z.infer<typeof loginInputSchema>;
