import { prisma } from '../../plugins/prisma';
import { CreateCardInput } from './card.schema';

export const getUserCards = async (userId: string) => {
  return await prisma.card.findMany({
    where: {
      userId,
    },
  });
};

export const createCard = async (userId: string, card: CreateCardInput) => {
  return await prisma.card.create({
    data: {
      userId,
      ...card,
    },
  });
};
