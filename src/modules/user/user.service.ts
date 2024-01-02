import { prisma } from '../../plugins/prisma';

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

export const getTransactionsHistory = async (userId: string) => {
  return await prisma.transaction.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    include: {
      sender: {
        select: {
          accountNumber: true,
        },
      },
      receiver: {
        select: {
          accountNumber: true,
        },
      },
    },
  });
};
