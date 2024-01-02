import { prisma } from '../../plugins/prisma';

interface ITransaction {
  senderAccountNumber: string;
  receiverAccountNumber: string;
  title: string;
  amount: number;
}

export const sendTransaction = async ({
  senderAccountNumber,
  receiverAccountNumber,
  title,
  amount,
}: ITransaction) => {
  const sender = await prisma.user.findUnique({
    where: {
      accountNumber: senderAccountNumber,
    },
  });

  if (!sender) {
    throw new Error('Sender not found');
  }

  const receiver = await prisma.user.findUnique({
    where: {
      accountNumber: receiverAccountNumber,
    },
  });

  if (!receiver) {
    throw new Error('Receiver not found');
  }

  const transaction = await prisma.transaction.create({
    data: {
      sender: {
        connect: {
          id: sender.id,
        },
      },
      receiver: {
        connect: {
          id: receiver.id,
        },
      },
      title,
      amount,
    },
  });

  await prisma.user.update({
    where: {
      id: sender.id,
    },
    data: {
      balance: { decrement: amount },
    },
  });

  await prisma.user.update({
    where: {
      id: receiver.id,
    },
    data: {
      balance: { increment: amount },
    },
  });

  return transaction;
};

export const verifyBalance = async ({
  senderId,
  amount,
}: {
  senderId: string;
  amount: number;
}) => {
  const sender = await prisma.user.findUnique({
    where: {
      id: senderId,
    },
  });

  if (!sender) {
    throw new Error('Sender not found');
  }

  return sender.balance >= amount;
};

export const getTransactionHistory = async (userId: string) => {
  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [
        {
          senderId: userId,
        },
        {
          receiverId: userId,
        },
      ],
    },
    include: {
      sender: true,
      receiver: true,
    },
  });

  return transactions;
};
