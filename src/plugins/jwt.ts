import fastifyJwt from '@fastify/jwt';

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      id: string;
      username: string;
      iat: number;
    };
  }
}

export default fastifyPlugin(
  async (fastify: FastifyInstance) => {
    await fastify.register(fastifyJwt, {
      secret: fastify.config.JWT_SECRET,
      sign: { algorithm: 'HS256' },
      cookie: {
        cookieName: 'accessToken',
        signed: false,
      },
    });
    fastify.decorate(
      'authenticate',
      async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          await request.jwtVerify();
        } catch (err) {
          request.log.error(err);
          return reply.code(401).send({ message: 'Unauthorized' });
        }
      },
    );
  },
  { name: 'jwt', dependencies: ['config'] },
);
