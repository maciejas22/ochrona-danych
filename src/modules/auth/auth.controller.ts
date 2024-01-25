import { Status } from '@prisma/client';

import { FastifyReply, FastifyRequest } from 'fastify';

import { calcEntropy } from '../../utils/entropy';
import { comparePassword, hashPassword } from '../../utils/hash';
import { verifyPartialPassword } from '../../utils/partial-password-indexes';

import {
  EntropyInput,
  LoginUserInput,
  RegisterUserInput,
  ResetPasswordInput,
} from './auth.schema';
import {
  createUser,
  findResetPasswordTokenByUserId,
  findUserByEmail,
  incrementInvalidPasswordCount,
  removeResetPasswordToken,
  resetInvalidPasswordCount,
  resetPartialPassword,
  resetPassword,
  updateLastLoginTimeStamp,
  updateResetPasswordToken,
} from './auth.service';

export async function registerUserHandler(
  request: FastifyRequest<{
    Body: RegisterUserInput;
  }>,
  reply: FastifyReply,
) {
  const body = request.body;
  let user = await findUserByEmail(request.body.email);
  if (user) {
    return reply.code(400).send('User already exists');
  }

  try {
    user = await createUser(body);
    return reply.code(200).send(user);
  } catch (err) {
    console.log(err);
    return reply.code(500).send('Internal server error');
  }
}

export async function checkPartialPassword(
  request: FastifyRequest<{
    Body: {
      email: string;
      partialPassword: string;
    };
  }>,
  reply: FastifyReply,
) {
  const body = request.body;
  try {
    const user = await findUserByEmail(request.body.email);
    if (!user) {
      return reply.code(404).send('User not found');
    }
    const isMatch = verifyPartialPassword(
      body.partialPassword,
      user.partialPassword,
    );
    return reply.code(200).send({ isMatch });
  } catch (err) {
    return reply.code(500).send('Internal server error');
  }
}

export async function loginUserHandler(
  request: FastifyRequest<{
    Body: LoginUserInput;
  }>,
  reply: FastifyReply,
) {
  await new Promise((resolve) => setTimeout(resolve, 2500));
  const body = request.body;

  try {
    const user = await findUserByEmail(body.email);
    if (!user) {
      return reply.code(400).send('Invalid password or email');
    }

    if (user.status === Status.BLOCKED) {
      return reply.code(400).send('User is blocked');
    }

    const isPasswordMatch = comparePassword(body.password, user.password);
    if (!isPasswordMatch) {
      incrementInvalidPasswordCount(user.id);
      return reply.code(400).send('Invalid password or email');
    }

    resetInvalidPasswordCount(user.id);
    resetPartialPassword(user.id, body.password);
    removeResetPasswordToken(user.id);
    updateLastLoginTimeStamp(user.id);

    const token = await reply.jwtSign({
      id: user.id,
      email: user.email,
      iat: Date.now(),
    });
    reply
      .setCookie('accessToken', token, {
        domain: 'localhost',
        path: '/',
        sameSite: 'strict',
        secure: true,
        httpOnly: true,
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
      })
      .code(200)
      .send(user);
  } catch (err) {
    return reply.code(500).send('Internal server error');
  }
}

export async function logoutUserHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  reply.clearCookie('accessToken', {
    domain: 'localhost',
    path: '/',
  });
  return reply.code(200).send('Logout successful');
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
    return reply.code(500).send('Internal server error');
  }
}

export async function forgotPasswordHandler(
  request: FastifyRequest<{
    Body: {
      email: string;
    };
  }>,
  reply: FastifyReply,
) {
  const body = request.body;

  try {
    const user = await findUserByEmail(body.email);
    if (!user) {
      return reply.code(404).send('User not found');
    }

    const tokenRaw = generateResetPasswordToken(
      user.id,
      user.password,
      user.lastLoginTimeStamp,
    );
    const token = hashPassword(tokenRaw);

    await updateResetPasswordToken(user.id, `${token.salt}${token.hash}`);
    await resetInvalidPasswordCount(user.id);

    console.log('wygenerowany i zwrocony: ', tokenRaw);
    console.log(`zapisany: ${token.salt}${token.hash}`);

    return reply.code(200).send({ token: tokenRaw });
  } catch (err) {
    return reply.code(500).send('Internal server error');
  }
}

export async function resetPasswordHandler(
  request: FastifyRequest<{
    Body: ResetPasswordInput;
  }>,
  reply: FastifyReply,
) {
  const body = request.body;

  try {
    const user = await findUserByEmail(body.email);
    if (!user) {
      return reply.code(404).send('Invalid email');
    }

    const resetPasswordToken = await findResetPasswordTokenByUserId(user.id);
    if (!resetPasswordToken) {
      return reply.code(400).send('Invalid token');
    }

    const isTokenValid = comparePassword(body.token, resetPasswordToken.token);
    if (
      !isTokenValid ||
      resetPasswordToken.createdAt < user.lastLoginTimeStamp
    ) {
      return reply.code(400).send('Invalid token');
    }

    const res = await resetPassword(user.id, body.password);
    await removeResetPasswordToken(user.id);
    await resetInvalidPasswordCount(user.id);

    return reply.code(200).send(res);
  } catch (err) {
    return reply.code(500).send('Internal server error');
  }
}

function generateResetPasswordToken(
  userId: string,
  passwordHash: string,
  lastLoginTimeStamp: Date,
) {
  const tokenRaw = `${userId}.${passwordHash}.${lastLoginTimeStamp}`;
  const token = hashPassword(tokenRaw);
  return `${token.salt}${token.hash}`;
}
