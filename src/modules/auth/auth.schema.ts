import { z } from 'zod';

import { buildJsonSchemas } from 'fastify-zod';

const userCore = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email('Email must be a valid email'),
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .min(8, 'Password must be at least 8 character long'),
});

const userCoreWithoutSensitive = userCore.omit({ password: true });

const userWithoutSensitive = userCoreWithoutSensitive.extend({
  id: z.string().uuid(),
});

const registerUserSchema = userCore.extend({
  name: z.string().min(2, 'Name must be at least 2 character long'),
  surname: z.string().min(2, 'Surname must be at least 2 character long'),
});

const registerUserResponseSchema = userWithoutSensitive.extend({});

const loginUserSchema = userCore.extend({});

const loginUserResponseSchema = userWithoutSensitive.extend({});

const entropySchema = z.object({
  password: z.string(),
});
const entropyResponseSchema = z.object({
  entropy: z.number(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const forgotPasswordResponseSchema = z.object({
  token: z.string(),
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 character long'),
  token: z.string(),
});

const resetPasswordResponseSchema = userWithoutSensitive.extend({});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type EntropyInput = z.infer<typeof entropySchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const { schemas: authSchemas, $ref } = buildJsonSchemas(
  {
    registerUserSchema,
    registerUserResponseSchema,
    loginUserSchema,
    loginUserResponseSchema,
    entropySchema,
    entropyResponseSchema,
    resetPasswordSchema,
    resetPasswordResponseSchema,
    forgotPasswordSchema,
    forgotPasswordResponseSchema,
  },
  { $id: 'auth' },
);
