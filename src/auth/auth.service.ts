import { comparePassword, hashPassword } from '../utils/hash';
import prisma from '../utils/prisma';

import { LoginUserInput, RegisterUserInput } from './auth.schema';

export const createUser = async (input: RegisterUserInput) => {
  return prisma.user.create({
    data: {
      username: input.username,
      password: await hashPassword(input.password),
    },
  });
};

export const findUserById = async (id: number) => {
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

  const isPasswordMatch = await comparePassword(input.password, user.password);
  if (!isPasswordMatch) {
    throw new Error('Invalid password');
  }

  return user;
};
