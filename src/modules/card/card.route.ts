import { FastifyInstance } from 'fastify';

import { createCardHandler, getUserCardsHandler } from './card.controller';
import { $ref } from './card.schema';

const userRoutes = async (server: FastifyInstance) => {
  server.addHook('onRequest', server.authenticate);

  server.post(
    '/',
    {
      schema: {
        body: $ref('getCardsInput'),
        response: {
          200: $ref('getCardsResponseSchema'),
        },
      },
    },
    getUserCardsHandler,
  );

  server.post(
    '/create',
    {
      schema: {
        body: $ref('createCardSchema'),
        response: {
          200: $ref('createCardResponseSchema'),
        },
      },
    },
    createCardHandler,
  );
};

export default userRoutes;
