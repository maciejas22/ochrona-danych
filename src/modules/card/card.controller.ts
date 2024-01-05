import { FastifyReply, FastifyRequest } from 'fastify';

import { prisma } from '../../plugins/prisma';
import { createCard, getUserCards } from './card.service';

export async function getUserCardsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const tokenPayload = request.user;

  const user = await prisma.user.findUnique({
    where: {
      id: tokenPayload.id,
    },
  });

  if (!user) {
    return reply.code(404).send('User not found');
  }

  const cards = await getUserCards(tokenPayload.id);

  try {
    return reply.code(200).send(cards);
  } catch (err) {
    return reply.code(500).send('Internal server error');
  }
}

export async function createCardHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const tokenPayload = request.user;

  const user = await prisma.user.findUnique({
    where: {
      id: tokenPayload.id,
    },
  });

  if (!user) {
    return reply.code(404).send('User not found');
  }

  const card = await createCard(tokenPayload.id);

  try {
    return reply.code(200).send(card);
  } catch (err) {
    return reply.code(500).send('Internal server error');
  }
}
