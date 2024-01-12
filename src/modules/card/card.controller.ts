import { FastifyReply, FastifyRequest } from 'fastify';

import { decrypt, encrypt, getKEK } from '../../utils/encrypt';
import { verifyPartialPassword } from '../../utils/partial-password-indexes';

import { prisma } from '../../plugins/prisma';
import { CreateCardInput, GetCardsInput } from './card.schema';
import { createCard, getIV, getKEKSalt, getUserCards } from './card.service';

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

  let cards = await getUserCards(tokenPayload.id);

  const iv = await getIV(tokenPayload.id);
  const KEKSalt = await getKEKSalt(tokenPayload.id);
  const KEK = getKEK(request.body.partialPassword, KEKSalt);
  const DEK = decrypt(user.DEK, iv, KEK);

  cards = cards.map((card) => ({
    ...card,
    cardNumber: decrypt(card.cardNumber, iv, DEK),
    cvv: decrypt(card.cvv, iv, DEK),
  }));

  console.log(cards);
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

  let card = {
    cardNumber: generateRandomNumber(16).toString(),
    expirationDate: generateExpirationDate(),
    cvv: generateRandomNumber(3).toString(),
  };

  const iv = await getIV(tokenPayload.id);
  const KEKSalt = await getKEKSalt(tokenPayload.id);
  const KEK = getKEK(request.body.partialPassword, KEKSalt);
  const DEK = decrypt(user.DEK, iv, KEK);

  card = {
    ...card,
    cardNumber: encrypt(card.cardNumber, iv, DEK),
    cvv: encrypt(card.cvv, iv, DEK),
  };

  const res = await createCard(
    tokenPayload.id,
    card.cardNumber,
    card.expirationDate,
    card.cvv,
  );

  console.log(res);

  try {
    return reply.code(200).send(res);
  } catch (err) {
    return reply.code(500).send('Internal server error');
  }
}

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
