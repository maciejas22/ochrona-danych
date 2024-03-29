import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

import authRoutes from './auth.route';
import { authSchemas } from './auth.schema';

export default fastifyPlugin(
  async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
    for (const schema of authSchemas) {
      fastify.addSchema(schema);
    }

    await fastify.register(authRoutes, options);
  },
);
