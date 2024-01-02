import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

import auth from './auth';
import card from './card';
import transaction from './transaction';
import user from './user';

export default fastifyPlugin(
  async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
    fastify.get('/healthcheck', async () => {
      return { status: 'OK' };
    });

    await Promise.all([
      fastify.register(auth, {
        ...options,
        prefix: options.prefix + '/auth',
      }),
      fastify.register(user, {
        ...options,
        prefix: options.prefix + '/user',
      }),
      fastify.register(transaction, {
        ...options,
        prefix: options.prefix + '/transaction',
      }),
      fastify.register(card, {
        ...options,
        prefix: options.prefix + '/card',
      }),
    ]);
  },
);
