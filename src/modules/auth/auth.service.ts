import { Status } from '@prisma/client';

import {
  decrypt,
  encrypt,
  generateIV,
  generateKey,
  getKEK,
} from '../../utils/encrypt';
import { generateSalt, hashPassword } from '../../utils/hash';
import { generatePartialPassword } from '../../utils/partial-password-indexes';

import { prisma } from '../../plugins/prisma';

export const createUser = async (input: {
  email: string;
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
      email: input.email,
      name: input.name,
      surname: input.surname,
      password: passwordHash.salt + passwordHash.hash,
      partialPassword: partialPasswordHash,
      iv,
      KEKSalt,
      DEK,
      DEKReset,
      lastLoginTimeStamp: Date.now(),
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

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: {
      email: email,
    },
  });
};

export const incrementInvalidPasswordCount = async (userId: string) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

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

export const resetInvalidPasswordCount = async (userId: string) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

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

export const resetPartialPassword = async (
  userId: string,
  password: string,
) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

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
      partialPassword: hash,
      DEK,
    },
  });
};

export const resetPassword = async (userId: string, password: string) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const passwordHash = hashPassword(password);
  const { partialPassword, hash: partialPasswordHash } =
    generatePartialPassword(password);

  const { iv, KEKSalt, DEKReset } = user;

  const KEK = getKEK(partialPassword, KEKSalt);
  const DEKRaw = decrypt(DEKReset, iv, process.env.ADMIN_SECRET!);

  const DEK = encrypt(DEKRaw, iv, KEK);

  return prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: passwordHash.salt + passwordHash.hash,
      partialPassword: partialPasswordHash,
      DEK,
    },
  });
};

export const updateResetPasswordToken = async (
  userId: string,
  token: string,
) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  return prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      resetPasswordToken: token,
    },
  });
};

export const removeResetPasswordToken = (userId: string) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      resetPasswordToken: null,
    },
  });
};

export const findUserByResetPasswordToken = async (token: string) => {
  return prisma.user.findUnique({
    where: {
      resetPasswordToken: token,
    },
  });
};

const generateAccountNumber = () => {
  const accountNumber = Math.floor(Math.random() * 9000000000) + 1000000000;

  return accountNumber.toString();
};
