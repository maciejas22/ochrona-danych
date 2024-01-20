import { type FastifyInstance } from 'fastify';

import {
  checkPartialPassword,
  entropyHandler,
  forgotPasswordHandler,
  loginUserHandler,
  logoutUserHandler,
  registerUserHandler,
  resetPasswordHandler,
} from './auth.controller';
import { $ref } from './auth.schema';

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

  server.post('/logout', logoutUserHandler);

  server.post('/check-partial-password', checkPartialPassword);

  server.post(
    '/forgot-password',
    {
      schema: {
        body: $ref('forgotPasswordSchema'),
        response: {
          200: $ref('forgotPasswordResponseSchema'),
        },
      },
    },
    forgotPasswordHandler,
  );

  server.post(
    '/reset-password',
    {
      schema: {
        body: $ref('resetPasswordSchema'),
        response: {
          200: $ref('resetPasswordResponseSchema'),
        },
      },
    },
    resetPasswordHandler,
  );
};

export default authRoutes;
