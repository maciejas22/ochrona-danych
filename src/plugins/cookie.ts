import fastifyCookie from '@fastify/cookie';

import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

export default fastifyPlugin(
  async (fastify: FastifyInstance) => {
    await fastify.register(fastifyCookie, {});
  },
  { name: 'cookie' },
);
