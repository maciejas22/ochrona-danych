import { z } from 'zod';

import { buildJsonSchemas } from 'fastify-zod';

const cardCore = z.object({
  cardNumber: z.string().min(16).max(16),
  cvv: z.string().min(3).max(3),
  cardHolderName: z.string(),
  expirationDate: z.string(),
});

const cardCoreWithoutSensitive = cardCore.omit({ cvv: true });

const paritalPassword = z.object({
  partialPassword: z.string(),
});

const createCardSchema = paritalPassword.extend({});

const createCardResponseSchema = cardCoreWithoutSensitive.extend({});

const getCardsInput = paritalPassword.extend({});

const getCardsResponseSchema = z.array(cardCore);

export type CreateCardInput = z.infer<typeof createCardSchema>;
export type GetCardsInput = z.infer<typeof getCardsInput>;

export const { schemas: cardSchemas, $ref } = buildJsonSchemas(
  {
    createCardSchema,
    createCardResponseSchema,
    getCardsInput,
    getCardsResponseSchema,
  },
  { $id: 'card' },
);
