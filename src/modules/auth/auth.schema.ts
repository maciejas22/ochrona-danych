import { z } from 'zod';

import { buildJsonSchemas } from 'fastify-zod';

const userCore = z.object({
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
