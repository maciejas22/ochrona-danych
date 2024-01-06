import { FastifyReply, FastifyRequest } from 'fastify';

import {
  findUserById,
  getPartialPasswordIndexes,
  getTransactionsHistory,
} from './user.service';

export async function getUserHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const tokenPayload = request.user;
  const user = await findUserById(tokenPayload.id);
  try {
    return reply.code(200).send(user);
  } catch (err) {
    return reply.code(500).send('Internal server error');
  }
}

export async function getTransactionsHistoryHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const tokenPayload = request.user;
  const transactions = (await getTransactionsHistory(tokenPayload.id)).map(
    (t) => {
      return {
        title: t.title,
        amount: t.amount,
        timestamp: t.timestamp,
        senderAccountNumber: t.sender.accountNumber,
        receiverAccountNumber: t.receiver.accountNumber,
      };
    },
  );
  try {
    return reply.code(200).send(transactions);
  } catch (err) {
    return reply.code(500).send('Internal server error');
  }
}

export async function getPartialPasswordIndexesHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const tokenPayload = request.user;

  try {
    const user = await findUserById(tokenPayload.id);
    if (!user) {
      return reply.code(404).send('User not found');
    }
    return reply.code(200).send({
      partialPasswordIndexes: await getPartialPasswordIndexes(tokenPayload.id),
    });
  } catch (err) {
    console.error(err);
    return reply.code(500).send('Internal server error');
  }
}
