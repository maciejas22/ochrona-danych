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

const partialPassword = z.object({
  partialPassword: z.string(),
});

const createTransactionSchema = z
  .object({
    receiverAccountNumber: z.string(),
  })
  .merge(transactionCore)
  .merge(partialPassword);

const createTransactionResponseSchema = transactionCore.extend({
  senderEmail: z.string().email(),
  receiverEmail: z.string().email(),
});

const transactionHistorySchema = partialPassword.extend({});

const transactionHistoryResponseSchema = z.array(
  transactionCore.extend({
    senderEmail: z.string(),
    receiverEmail: z.string(),
  }),
);

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type TransactionHistoryInput = z.infer<typeof transactionHistorySchema>;

export const { schemas: transactionSchemas, $ref } = buildJsonSchemas(
  {
    createTransactionSchema,
    createTransactionResponseSchema,
    transactionHistorySchema,
    transactionHistoryResponseSchema,
  },
  { $id: 'transaction' },
);
