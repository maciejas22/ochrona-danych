import { z } from 'zod';

import { buildJsonSchemas } from 'fastify-zod';

const cardCore = z.object({
  cardNumber: z.string().uuid(),
  cvv: z.string().min(3).max(3),
  cardHolderName: z.string(),
  expirationDate: z.string(),
});

const cardCoreWithoutSensitive = cardCore.omit({ cvv: true });

const createCardSchema = cardCore.extend({});
const createCardResponseSchema = cardCoreWithoutSensitive.extend({});

const getCardsResponseSchema = z.array(cardCoreWithoutSensitive);

export type CreateCardInput = z.infer<typeof createCardSchema>;

export const { schemas: cardSchemas, $ref } = buildJsonSchemas(
  {
    createCardSchema,
    createCardResponseSchema,
    getCardsResponseSchema,
  },
  { $id: 'card' },
);
