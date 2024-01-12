import { prisma } from '../../plugins/prisma';

export const getUserCards = async (userId: string) => {
  return await prisma.card.findMany({
    where: {
      userId,
    },
  });
};

export const createCard = async (
  userId: string,
  cardNumber: string,
  expirationDate: string,
  cvv: string,
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return await prisma.card.create({
    data: {
      userId,
      cardHolderName: `${user.name} ${user.surname}`,
      cardNumber,
      expirationDate,
      cvv,
    },
  });
};

export const getKEKSalt = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user.KEKSalt;
};

export const getIV = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user.iv;
};
