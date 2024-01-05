import { prisma } from '../../plugins/prisma';

export const getUserCards = async (userId: string) => {
  return await prisma.card.findMany({
    where: {
      userId,
    },
  });
};

export const createCard = async (userId: string) => {
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
      cardNumber: generateRandomNumber(16).toString(),
      expirationDate: generateExpirationDate(),
      cvv: generateRandomNumber(3).toString(),
    },
  });
};

function generateRandomNumber(length: number) {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateExpirationDate() {
  const now = new Date();
  const year = now.getFullYear() + 4;
  const month = now.getMonth() + 1;
  return `${month}/${year.toString().slice(-2)}`;
}
