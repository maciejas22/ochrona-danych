import { z } from 'zod';

import { buildJsonSchemas } from 'fastify-zod';

const transactionCore = z.object({
  title: z
    .string({
      required_error: 'Title is required',
      invalid_type_error: 'Title must be a string',
    })
    .min(2, 'Title must be at least 2 characters long'),
  amount: z.number(),
});

const createTransactionSchema = transactionCore.extend({
  receiverAccountNumber: z.string().uuid(),
});

const createTransactionResponseSchema = transactionCore.extend({
  senderUsername: z.string(),
  receiverUsername: z.string(),
});

const transactionHistoryResponseSchema = z.array(
  transactionCore.extend({
    senderUsername: z.string(),
    receiverUsername: z.string(),
  }),
);

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;

export const { schemas: transactionSchemas, $ref } = buildJsonSchemas(
  {
    createTransactionSchema,
    createTransactionResponseSchema,
    transactionHistoryResponseSchema,
  },
  { $id: 'transaction' },
);
