import { type FastifyInstance } from 'fastify';

import { getUserHandler } from './user.controller';
import { $ref } from './user.schema';

const userRoutes = async (server: FastifyInstance) => {
  server.get(
    '/user',
    {
      schema: {
        response: {
          200: $ref('getUserResponseSchema'),
        },
      },
    },
    getUserHandler,
  );
};

export default userRoutes;
