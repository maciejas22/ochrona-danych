import { FastifyReply, FastifyRequest } from 'fastify';

import { calcEntropy } from '../utils/entropy';
import { verifyPartialPassword } from '../utils/hash';

import { JWTPayloadType } from '../config/jwtConfig';
import { EntropyInput, LoginUserInput, RegisterUserInput } from './auth.schema';
import { createUser, findUserByUsername, loginUser } from './auth.service';

export async function registerUserHandler(
  request: FastifyRequest<{
    Body: RegisterUserInput;
  }>,
  reply: FastifyReply,
) {
  const body = request.body;
  try {
    const user = await createUser(body);
    return reply.code(200).send(user);
  } catch (err) {
    return reply.code(500).send(err);
  }
}

export async function checkPartialPassword(
  request: FastifyRequest<{
    Body: {
      username: string;
      partialPassword: string;
    };
  }>,
  reply: FastifyReply,
) {
  const body = request.body;
  try {
    const user = await findUserByUsername(request.body.username);
    if (!user) {
      return reply.code(404).send({ message: 'User not found' });
    }
    const isMatch = verifyPartialPassword(
      body.partialPassword,
      user.partialPassword,
    );
    return reply.code(200).send({ isMatch });
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
      iat: Date.now(),
    };
    const token = await reply.jwtSign(payload);
    reply
      .setCookie('accessToken', token, {
        domain: 'localhost',
        path: '/',
        sameSite: 'strict',
        secure: false,
        httpOnly: true,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      })
      .code(200)
      .send(user);
  } catch (err) {
    return reply.code(500).send(err);
  }
}

export async function entropyHandler(
  request: FastifyRequest<{
    Body: EntropyInput;
  }>,
  reply: FastifyReply,
) {
  const body = request.body;

  try {
    const entropy = calcEntropy(body.password).entropy;
    return reply.code(200).send({ entropy });
  } catch (err) {
    return reply.code(500).send(err);
  }
}
