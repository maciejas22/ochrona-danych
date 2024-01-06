import { type FastifyInstance } from 'fastify';

import {
  transactionHandler,
  transactionHistoryHandler,
} from './transaction.controller';
import { $ref } from './transaction.schema';

const transactionRoutes = async (server: FastifyInstance) => {
  server.addHook('onRequest', server.authenticate);

  server.post(
    '/new',
    {
      schema: {
        body: $ref('createTransactionSchema'),
        response: {
          200: $ref('createTransactionResponseSchema'),
        },
      },
    },
    transactionHandler,
  );

  server.post(
    '/history',
    {
      schema: {
        body: $ref('transactionHistorySchema'),
        response: {
          200: $ref('transactionHistoryResponseSchema'),
        },
      },
    },
    transactionHistoryHandler,
  );
};

export default transactionRoutes;
