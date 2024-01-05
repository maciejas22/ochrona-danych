import { z } from 'zod';

import { buildJsonSchemas } from 'fastify-zod';

const cardCore = z.object({
  cardNumber: z.string().min(16).max(16),
  cvv: z.string().min(3).max(3),
  cardHolderName: z.string(),
  expirationDate: z.string(),
});

const cardCoreWithoutSensitive = cardCore.omit({ cvv: true });

const createCardResponseSchema = cardCoreWithoutSensitive.extend({});

const getCardsResponseSchema = z.array(cardCore);

export const { schemas: cardSchemas, $ref } = buildJsonSchemas(
  {
    createCardResponseSchema,
    getCardsResponseSchema,
  },
  { $id: 'card' },
);
