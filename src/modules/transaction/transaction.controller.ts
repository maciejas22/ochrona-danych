import { FastifyReply, FastifyRequest } from 'fastify';

import { verifyPartialPassword } from '../../utils/partial-password-indexes';

import { prisma } from '../../plugins/prisma';
import {
  CreateTransactionInput,
  TransactionHistoryInput,
} from './transaction.schema';
import {
  getTransactionHistory,
  sendTransaction,
  verifyBalance,
} from './transaction.service';

export async function transactionHandler(
  request: FastifyRequest<{
    Body: CreateTransactionInput;
  }>,
  reply: FastifyReply,
) {
  const tokenPayload = request.user;
  const body = request.body;

  const sender = await prisma.user.findUnique({
    where: {
      id: tokenPayload.id,
    },
  });

  if (!sender) {
    return reply.code(404).send('Sender not found');
  }

  if (!verifyPartialPassword(body.partialPassword, sender.partialPassword)) {
    return reply.code(400).send('Invalid partial password');
  }

  const receiver = await prisma.user.findUnique({
    where: {
      accountNumber: body.receiverAccountNumber,
    },
  });

  if (!receiver) {
    return reply.code(400).send('Receiver not found');
  }

  if (
    !(await verifyBalance({
      senderId: sender.id,
      amount: body.amount,
    }))
  ) {
    return reply.code(400).send('Insufficient balance');
  }

  const transaction = await sendTransaction({
    senderAccountNumber: sender.accountNumber,
    receiverAccountNumber: body.receiverAccountNumber,
    title: body.title,
    amount: body.amount,
  });

  try {
    return reply.code(200).send({
      title: transaction.title,
      amount: transaction.amount,
      senderUsername: sender.username,
      receiverUsername: receiver.username,
    });
  } catch (err) {
    return reply.code(500).send('Internal server error');
  }
}

export async function transactionHistoryHandler(
  request: FastifyRequest<{
    Body: TransactionHistoryInput;
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

  const transactionsHistory = (await getTransactionHistory(user.id)).map(
    (t) => {
      return {
        title: t.title,
        amount: t.amount,
        senderUsername: t.sender.username,
        receiverUsername: t.receiver.username,
      };
    },
  );
  try {
    return reply.code(200).send(transactionsHistory);
  } catch (err) {
    return reply.code(500).send('Internal server error');
  }
}
