import fastifyEnv from '@fastify/env';
import 'dotenv/config';

import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

const NODE_ENVS = ['prod', 'dev'] as const;
type NODE_ENV = (typeof NODE_ENVS)[number];

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      NODE_ENV: NODE_ENV;
      JWT_SECRET: string;
      ENCRYPT_SECRET: string;
      ADMIN_SECRET: string;
      HOST: string;
      PORT: number;
      DATABASE_URL: string;
      ALLOWED_ORIGINS: string[];
    };
  }
}

export default fastifyPlugin(
  (
    fastify: FastifyInstance,
    _options: FastifyPluginOptions,
    done: (err?: Error | undefined) => void,
  ) => {
    const schema = {
      type: 'object',
      required: [
        'JWT_SECRET',
        'ENCRYPT_SECRET',
        'ADMIN_SECRET',
        'DATABASE_URL',
      ],
      properties: {
        NODE_ENV: {
          type: 'string',
          default: 'dev',
        },
        JWT_SECRET: {
          type: 'string',
        },
        ENCRYPT_SECRET: {
          type: 'string',
        },
        ADMIN_SECRET: {
          type: 'string',
        },
        DATABASE_URL: {
          type: 'string',
        },
        HOST: {
          type: 'string',
          default: '0.0.0.0',
        },
        PORT: {
          type: 'number',
          default: 3000,
        },
        ALLOWED_ORIGINS: {
          type: 'string',
          separator: ',',
          default: 'http://localhost:5173,https://localhost:5173',
        },
      },
    };

    const configOptions = {
      confKey: 'config',
      schema: schema,
      data: process.env,
      dotenv: true,
      removeAdditional: true,
    };

    fastifyEnv(fastify, configOptions, done);
  },
  { name: 'config' },
);
