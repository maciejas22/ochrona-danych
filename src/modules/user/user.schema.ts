import { z } from 'zod';

import { buildJsonSchemas } from 'fastify-zod';

const user = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, 'Name must be at least 2 character long').optional(),
  surname: z
    .string()
    .min(2, 'Surname must be at least 2 character long')
    .optional(),
  email: z
    .string({
      invalid_type_error: 'Email must be a string',
    })
    .email('Email must be a valid email'),
  balance: z.number(),
  accountNumber: z.string(),
});

const getUserResponseSchema = user.extend({});

const getTransactionsHistoryResponseSchema = z.array(
  z.object({
    title: z.string(),
    amount: z.number(),
    timestamp: z.string().datetime(),
    senderAccountNumber: z.string(),
    receiverAccountNumber: z.string(),
  }),
);

const getPartialPasswordIndexesResponseSchema = z.object({
  partialPasswordIndexes: z.array(z.number()),
});

export const { schemas: userSchemas, $ref } = buildJsonSchemas(
  {
    getUserResponseSchema,
    getTransactionsHistoryResponseSchema,
    getPartialPasswordIndexesResponseSchema,
  },
  { $id: 'user' },
);
