import { Status, User } from '@prisma/client';

import {
  decrypt,
  encrypt,
  generateIV,
  generateKey,
  getKEK,
} from '../utils/encrypt';
import {
  comparePassword,
  generatePartialPassword,
  generateSalt,
  hashPassword,
} from '../utils/hash';
import prisma from '../utils/prisma';

import { LoginUserInput, RegisterUserInput } from './auth.schema';

export const createUser = async (input: RegisterUserInput) => {
  const passwordHash = hashPassword(input.password);
  const { partialPassword, hash: partialPasswordHash } =
    generatePartialPassword(input.password);
  const iv = generateIV();
  const KEKSalt = generateSalt();

  const KEK = getKEK(partialPassword, KEKSalt);
  const DEKRaw = generateKey();
  const DEK = encrypt(DEKRaw, iv, KEK);
  const DEKReset = encrypt(DEKRaw, iv, process.env.ADMIN_SECRET!);

  return prisma.user.create({
    data: {
      username: input.username,
      password: passwordHash.salt + passwordHash.hash,
      partialPassword: partialPasswordHash,
      iv,
      KEKSalt,
      DEK,
      DEKReset,
    },
  });
};

export const findUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: {
      id: id,
    },
  });
};

export const findUserByUsername = async (username: string) => {
  return prisma.user.findUnique({
    where: {
      username: username,
    },
  });
};

export const loginUser = async (input: LoginUserInput) => {
  const user = await findUserByUsername(input.username);
  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordMatch = comparePassword(input.password, user.password);
  if (!isPasswordMatch) {
    incrementInvalidPasswordCount(user);
    throw new Error('Invalid password');
  }

  resetInvalidPasswordCount(user);
  const { partialPassword, DEK } = resetPartialPassword(user, input.password);

  return prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      partialPassword,
      DEK,
    },
  });
};

const incrementInvalidPasswordCount = async (user: User) => {
  return prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      invalidPasswordCount: { increment: 1 },
      status: user.invalidPasswordCount >= 5 ? Status.BLOCKED : user.status,
    },
  });
};

const resetInvalidPasswordCount = async (user: User) => {
  return prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      invalidPasswordCount: 0,
      status: Status.ACTIVE,
    },
  });
};

const resetPartialPassword = (user: User, password: string) => {
  const { iv, KEKSalt } = user;
  const { partialPassword, hash } = generatePartialPassword(password);
  const KEK = getKEK(partialPassword, KEKSalt);
  const DEKRaw = decrypt(user.DEKReset, iv, process.env.ADMIN_SECRET!);
  const DEK = encrypt(DEKRaw, iv, KEK);
  return {
    partialPassword: hash,
    DEK,
  };
};
