import { FastifyInstance } from 'fastify';

import { getUserCardsHandler } from './card.controller';
import { $ref } from './card.schema';

const userRoutes = async (server: FastifyInstance) => {
  server.addHook('onRequest', server.authenticate);

  server.get(
    '/',
    {
      schema: {
        response: {
          200: $ref('getCardsResponseSchema'),
        },
      },
    },
    getUserCardsHandler,
  );
};

export default userRoutes;
