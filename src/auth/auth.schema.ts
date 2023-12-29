import { z } from 'zod';

import { buildJsonSchemas } from 'fastify-zod';

const userCore = {
  username: z
    .string({
      required_error: 'Username is required',
      invalid_type_error: 'Username must be a string',
    })
    .min(2, 'Username must be at least 8 character long'),
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .min(2, 'Password must be at least 8 character long'),
};

const { password, ...userCoreWithoutSensitive } = userCore;
const userWithoutSensitive = {
  id: z.string().uuid(),
  ...userCoreWithoutSensitive,
};

const registerUserSchema = z.object({
  ...userCore,
});

const registerUserResponseSchema = z.object({
  ...userWithoutSensitive,
});

const loginUserSchema = z.object({
  ...userCore,
});

const loginUserResponseSchema = z.object({
  ...userWithoutSensitive,
});

const entropySchema = z.object({
  password: z.string(),
});
const entropyResponseSchema = z.object({
  entropy: z.number(),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type EntropyInput = z.infer<typeof entropySchema>;

export const { schemas: authSchemas, $ref } = buildJsonSchemas(
  {
    registerUserSchema,
    registerUserResponseSchema,
    loginUserSchema,
    loginUserResponseSchema,
    entropySchema,
    entropyResponseSchema,
  },
  { $id: 'auth' },
);
