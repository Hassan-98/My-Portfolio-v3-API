//= Modules
import { z } from 'zod';
//= Utils
import checkObjectId from '../../utils/checkObjectId';

export const UserSchema = z.object({
  username: z.string().trim(),
  email: z.string().trim().email({ message: "Email Address is invalid" }),
  password: z.string().min(6, { message: "Password must be 6 or more characters long" }),
  picture: z.string().url().optional(),
  externalAuth: z.object({
    userId: z.union([z.string(), z.number()]),
    linked: z.boolean()
  }).optional()
});

export const LoginSchema = UserSchema.pick({ email: true, password: true });

export const ProviderLoginSchema = z.object({
  access_token: z.string(),
  rememberMe: z.boolean().optional()
});

export const VerifyTokenSchema = z.object({
  token: z.string()
});

export const IDSchema = z.object({
  id: z.string().refine((val) => checkObjectId(val), { message: "must be a valid id" })
});

export const UpdatePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6, { message: "Password must be 6 or more characters long" })
});

export type ProviderLoginParams = z.infer<typeof ProviderLoginSchema>
