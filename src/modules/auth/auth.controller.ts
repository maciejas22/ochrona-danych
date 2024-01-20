import { Status } from '@prisma/client';

import { FastifyReply, FastifyRequest } from 'fastify';

import { decrypt, encrypt } from '../../utils/encrypt';
import { calcEntropy } from '../../utils/entropy';
import { comparePassword } from '../../utils/hash';
import { verifyPartialPassword } from '../../utils/partial-password-indexes';

import {
  EntropyInput,
  LoginUserInput,
  RegisterUserInput,
  ResetPasswordInput,
} from './auth.schema';
import {
  createUser,
  findUserByEmail,
  incrementInvalidPasswordCount,
  removeResetPasswordToken,
  resetInvalidPasswordCount,
  resetPartialPassword,
  resetPassword,
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
        secure: false,
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

    const token = generateResetPasswordToken(
      user.id,
      user.password,
      user.iv,
      user.lastLoginTimeStamp,
    );

    await updateResetPasswordToken(user.id, token);

    return reply.code(200).send({ token });
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

    if (!user.resetPasswordToken) {
      return reply.code(400).send('Invalid token');
    }

    const decoded = decodeResetPasswordToken(body.token, user.iv);
    console.log(decoded);

    // check if decoded correctly
    if (decoded.userId !== user.id) {
      return reply.code(400).send('Invalid token');
    }
    // check if user didn't change password
    if (decoded.passwordHash !== user.password) {
      return reply.code(401).send('Invalid token');
    }

    const currentTimeStamp = BigInt(Date.now());
    const tokenTimeStamp = BigInt(decoded.currentTimeStamp);
    const lastLoginTimeStamp = BigInt(decoded.lastLoginTimeStamp);

    // check if token was created more than 30 minutes ago
    if (currentTimeStamp - tokenTimeStamp > 30 * 60 * 1000) {
      return reply.code(402).send('Invalid token');
    }
    // check if user logged in after token was created
    if (lastLoginTimeStamp !== user.lastLoginTimeStamp) {
      return reply.code(403).send('Invalid token');
    }

    const res = await resetPassword(user.id, body.password);
    await resetInvalidPasswordCount(user.id);

    return reply.code(200).send(res);
  } catch (err) {
    return reply.code(500).send('Internal server error');
  }
}

function generateResetPasswordToken(
  userId: string,
  passwordHash: string,
  iv: string,
  lastLoginTimeStamp: BigInt,
) {
  const currentTimeStamp = Date.now();
  const tokenRaw = `${userId}.${passwordHash}.${currentTimeStamp}.${lastLoginTimeStamp}`;
  const token = encrypt(tokenRaw, iv, process.env.RESET_SECRET!);

  return token;
}

function decodeResetPasswordToken(token: string, iv: string) {
  const decoded = decrypt(token, iv, process.env.RESET_SECRET!);
  const [userId, passwordHash, currentTimeStamp, lastLoginTimeStamp] =
    decoded.split('.');

  return {
    userId,
    passwordHash,
    currentTimeStamp,
    lastLoginTimeStamp,
  };
}
