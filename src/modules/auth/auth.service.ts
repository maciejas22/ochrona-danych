import { Status, User } from '@prisma/client';

import {
  decrypt,
  encrypt,
  generateIV,
  generateKey,
  getKEK,
} from '../../utils/encrypt';
import {
  generatePartialPassword,
  generateSalt,
  hashPassword,
} from '../../utils/hash';

import { prisma } from '../../plugins/prisma';

export const createUser = async (input: {
  username: string;
  password: string;
  name: string;
  surname: string;
}) => {
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
      accountNumber: generateAccountNumber(),
      username: input.username,
      name: input.name,
      surname: input.surname,
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

export const incrementInvalidPasswordCount = async (user: User) => {
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

export const resetInvalidPasswordCount = async (user: User) => {
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

export const resetPartialPassword = (user: User, password: string) => {
  const { iv, KEKSalt } = user;
  const { partialPassword, hash } = generatePartialPassword(password);
  const KEK = getKEK(partialPassword, KEKSalt);
  const DEKRaw = decrypt(user.DEKReset, iv, process.env.ADMIN_SECRET!);
  const DEK = encrypt(DEKRaw, iv, KEK);

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

const generateAccountNumber = () => {
  const accountNumber = Math.floor(Math.random() * 9000000000) + 1000000000;

  const accountNumberString = accountNumber.toString();

  return accountNumberString;
};
