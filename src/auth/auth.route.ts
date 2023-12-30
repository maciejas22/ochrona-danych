import { type FastifyInstance } from 'fastify';

import {
  checkPartialPassword,
  entropyHandler,
  loginUserHandler,
  logoutUserHandler,
  registerUserHandler,
} from './auth.controller';
import { $ref } from './auth.schema';
import { log } from 'console';

const authRoutes = async (server: FastifyInstance) => {
  server.post(
    '/register',
    {
      schema: {
        body: $ref('registerUserSchema'),
        response: {
          200: $ref('registerUserResponseSchema'),
        },
      },
    },
    registerUserHandler,
  );

  server.post(
    '/login',
    {
      schema: {
        body: $ref('loginUserSchema'),
        response: {
          200: $ref('loginUserResponseSchema'),
        },
      },
    },
    loginUserHandler,
  );

  server.post(
    '/entropy',
    {
      schema: {
        body: $ref('entropySchema'),
        response: {
          200: $ref('entropyResponseSchema'),
        },
      },
    },
    entropyHandler,
  );

  server.post(
    '/logout',
    logoutUserHandler,
  );

  server.post('/check-partial-password', checkPartialPassword);
};

export default authRoutes;
