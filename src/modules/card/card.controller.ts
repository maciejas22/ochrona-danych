import { FastifyReply, FastifyRequest } from 'fastify';

import { verifyPartialPassword } from '../../utils/partial-password-indexes';

import { prisma } from '../../plugins/prisma';
import { CreateCardInput, GetCardsInput } from './card.schema';
import { createCard, getUserCards } from './card.service';

export async function getUserCardsHandler(
  request: FastifyRequest<{
    Body: GetCardsInput;
  }>,
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

  if (
    !verifyPartialPassword(request.body.partialPassword, user.partialPassword)
  ) {
    return reply.code(400).send('Invalid partial password');
  }

  const cards = await getUserCards(tokenPayload.id);

  try {
    return reply.code(200).send(cards);
  } catch (err) {
    return reply.code(500).send('Internal server error');
  }
}

export async function createCardHandler(
  request: FastifyRequest<{ Body: CreateCardInput }>,
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

  if (
    !verifyPartialPassword(request.body.partialPassword, user.partialPassword)
  ) {
    return reply.code(400).send('Invalid partial password');
  }

  const card = await createCard(tokenPayload.id);

  try {
    return reply.code(200).send(card);
  } catch (err) {
    return reply.code(500).send('Internal server error');
  }
}
