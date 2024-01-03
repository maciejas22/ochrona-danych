import { FastifyReply, FastifyRequest } from 'fastify';

import { prisma } from '../../plugins/prisma';
import { CreateTransactionInput } from './transaction.schema';
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
    return reply.code(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: 'Sender not found',
    });
  }

  const receiver = await prisma.user.findUnique({
    where: {
      accountNumber: body.receiverAccountNumber,
    },
  });

  if (!receiver) {
    return reply.code(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: 'Receiver not found',
    });
  }

  if (
    !(await verifyBalance({
      senderId: sender.id,
      amount: body.amount,
    }))
  ) {
    return reply.code(400).send({
      error: 'Bad Request',
      message: 'Insufficient balance',
    });
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
    return reply.code(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: 'User not found',
    });
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
