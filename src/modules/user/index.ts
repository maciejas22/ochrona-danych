import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

import userRotues from './user.route';
import { userSchemas } from './user.schema';

export default fastifyPlugin(
  async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
    for (const schema of userSchemas) {
      fastify.addSchema(schema);
    }

    await fastify.register(userRotues, options);
  },
);
