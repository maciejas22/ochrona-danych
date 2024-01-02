import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

import config from './config';
import cookie from './cookie';
import cors from './cors';
import jwt from './jwt';
import prisma from './prisma';

export default fastifyPlugin(async (fastify: FastifyInstance) => {
  await Promise.all([fastify.register(config)]);

  await Promise.all([
    fastify.register(prisma),
    fastify.register(cookie),
    fastify.register(cors),
  ]);

  await Promise.all([fastify.register(jwt)]);
});
