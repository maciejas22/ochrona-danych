import fastifyCookie from '@fastify/cookie';
import cors from '@fastify/cors';
import fastifyJWT from '@fastify/jwt';

import Fastify from 'fastify';

import authRoutes from './auth/auth.route';
import { authSchemas } from './auth/auth.schema';

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

  server.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET as string,
  });

  server.register(fastifyJWT, {
    secret: process.env.JWT_SECRET as string,
    sign: { algorithm: 'HS256' },
    cookie: {
      cookieName: 'token',
      signed: false,
    },
  });

  server.addHook('onRequest', async (request, reply) => {
    const accessToken = request.cookies['token'];

    if (
      (!accessToken || !(await request.jwtVerify())) &&
      !request.url.includes('/auth')
    ) {
      reply.code(401).send({ message: 'Unauthorized' });
    }
  });

  for (const schema of [...authSchemas]) {
    server.addSchema(schema);
  }
  server.register(authRoutes, { prefix: '/auth' });

  return server;
}
