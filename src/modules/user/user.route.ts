import { type FastifyInstance } from 'fastify';

import {
  getTransactionsHistoryHandler,
  getUserHandler,
} from './user.controller';
import { $ref } from './user.schema';

const userRoutes = async (server: FastifyInstance) => {
  server.addHook('onRequest', server.authenticate);

  server.get(
    '/',
    {
      schema: {
        response: {
          200: $ref('getUserResponseSchema'),
        },
      },
    },
    getUserHandler,
  );
  server.get(
    '/transactions',
    {
      schema: {
        response: {
          200: $ref('getTransactionsHistoryResponseSchema'),
        },
      },
    },
    getTransactionsHistoryHandler,
  );
};

export default userRoutes;
