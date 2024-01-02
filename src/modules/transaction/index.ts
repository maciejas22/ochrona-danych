import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

import transactionRoutes from './transaction.route';
import { transactionSchemas } from './transaction.schema';

export default fastifyPlugin(
  async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
    for (const schema of transactionSchemas) {
      fastify.addSchema(schema);
    }

    await fastify.register(transactionRoutes, options);
  },
);
