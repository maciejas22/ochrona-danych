import { FastifyReply, FastifyRequest } from 'fastify';

import { getUserCards } from './card.service';

export async function getUserCardsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const tokenPayload = request.user;

  const cards = await getUserCards(tokenPayload.id);
  try {
    return reply.code(200).send(cards);
  } catch (err) {
    return reply.code(500).send(err);
  }
}
