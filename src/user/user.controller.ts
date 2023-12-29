import { JWT } from '@fastify/jwt';

import { FastifyReply, FastifyRequest } from 'fastify';

import { JWTPayloadType } from '../config/jwtConfig';
import { findUserById } from './user.service';

export async function getUserHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const tokenPayload = request.user as JWTPayloadType;
  const user = await findUserById(tokenPayload.id);
  try {
    return reply.code(200).send(user);
  } catch (err) {
    return reply.code(500).send(err);
  }
}
