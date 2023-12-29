import { z } from 'zod';

import { buildJsonSchemas } from 'fastify-zod';

const user = {
  id: z.string().uuid(),
  username: z.string().min(2, 'Username must be at least 2 character long'),
  name: z.string().min(2, 'Name must be at least 2 character long').optional(),
  surname: z
    .string()
    .min(2, 'Surname must be at least 2 character long')
    .optional(),
  email: z
    .string({
      invalid_type_error: 'Email must be a string',
    })
    .email('Email must be a valid email')
    .optional(),
  balance: z.number(),
};

const getUserResponseSchema = z.object({
  ...user,
});

export const { schemas: userSchemas, $ref } = buildJsonSchemas(
  {
    getUserResponseSchema,
  },
  { $id: 'user' },
);
