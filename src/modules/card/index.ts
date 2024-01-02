import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

import cardRoutes from './card.route';
import { cardSchemas } from './card.schema';

export default fastifyPlugin(
  async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
    for (const schema of cardSchemas) {
      fastify.addSchema(schema);
    }

    await fastify.register(cardRoutes, options);
  },
);
