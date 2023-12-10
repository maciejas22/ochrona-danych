import { FastifyReply, FastifyRequest } from 'fastify';

import { JWTPayloadType } from '../config/jwtConfig';
import { LoginUserInput, RegisterUserInput } from './auth.schema';
import { createUser, loginUser } from './auth.service';

export async function registerUserHandler(
  request: FastifyRequest<{
    Body: RegisterUserInput;
  }>,
  reply: FastifyReply,
) {
  const body = request.body;

  try {
    const author = await createUser(body);
    return reply.code(200).send(author);
  } catch (err) {
    return reply.code(500).send(err);
  }
}

export async function loginUserHandler(
  request: FastifyRequest<{
    Body: LoginUserInput;
  }>,
  reply: FastifyReply,
) {
  const body = request.body;

  try {
    const user = await loginUser(body);
    const payload: JWTPayloadType = {
      id: user.id,
      username: user.username,
    };
    const token = await reply.jwtSign(payload);
    reply
      .setCookie('accessToken', token, {
        domain: 'localhost',
        path: '/',
        sameSite: 'none',
        secure: false,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      })
      .code(200)
      .send({ id: user.id, username: user.username });
  } catch (err) {
    return reply.code(500).send(err);
  }
}
