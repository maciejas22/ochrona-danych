import fastifyCookie from '@fastify/cookie';
import cors from '@fastify/cors';
import fastifyJWT from '@fastify/jwt';

import Fastify from 'fastify';

import authRoutes from './auth/auth.route';
import { authSchemas } from './auth/auth.schema';
import userRoutes from './user/user.route';
import { userSchemas } from './user/user.schema';

export default function buildServer() {
  const server = Fastify({
    logger: true,
  });

  server.get('/healthcheck', async () => {
    return { status: 'ok' };
  });

  server.register(cors, {
    origin: ['http://localhost:5173', 'http://localhost:4173'],
    credentials: true,
  });

  server.register(fastifyCookie, {});

  server.register(fastifyJWT, {
    secret: process.env.JWT_SECRET as string,
    sign: { algorithm: 'HS256' },
    cookie: {
      cookieName: 'accessToken',
      signed: false,
    },
  });

  for (const schema of [...authSchemas, ...userSchemas]) {
    server.addSchema(schema);
  }

  server.addHook('preValidation', async (request, reply) => {
    const accessToken = request.cookies['accessToken'];

    if (
      (!accessToken || !(await request.jwtVerify())) &&
      !request.url.includes('/auth')
    ) {
      reply.code(401).send({ message: 'Unauthorized' });
    }
  });

  server.register(authRoutes, { prefix: '/auth' });
  server.register(userRoutes, { prefix: '/user' });

  return server;
}
