import 'dotenv/config';

import Fastify from 'fastify';

import modules from './modules';
import plugins from './plugins';

export default async function buildServer() {
  const server = Fastify({
    logger: true,
  });

  server.register(plugins);
  server.register(modules, { prefix: '/api' });

  return server;
}
