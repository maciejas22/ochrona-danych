import { useMutation } from 'react-query';

import { AxiosError } from 'axios';

import axios from '../../utils/axios';

import { ITransaction } from '../../types/transaction';

interface ICreateTransactionBody {
  title: string;
  amount: number;
  receiverAccountNumber: string;
}

export default function CreateTransaction() {
  const { mutate, isLoading, error } = useMutation<
    ITransaction,
    AxiosError,
    ICreateTransactionBody
  >({
    mutationKey: 'createTransaction',
    mutationFn: async (body) => {
      return axios.post('/transaction/new', body);
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { elements } = event.currentTarget;
    const title = (elements.namedItem('title') as HTMLInputElement).value;
    const amount = (elements.namedItem('amount') as HTMLInputElement).value;
    const receiverAccountNumber = (
      elements.namedItem('receiverAccountNumber') as HTMLInputElement
    ).value;

    mutate({
      title,
      amount: Number(amount),
      receiverAccountNumber: receiverAccountNumber,
    });
  };

  return (
    <div className="flex h-screen items-center justify-center mx-4 my-2">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-xl border border-black p-8"
      >
        <div className="flex justify-between gap-2">
          <p>title:</p>
          <input
            type="text"
            name="title"
            className="rounded-md border border-black"
          />
        </div>
        <div className="flex justify-between gap-2">
          <p>amount:</p>
          <input
            type="number"
            name="amount"
            className="rounded-md border border-black"
          />
        </div>
        <div className="flex justify-between gap-2">
          <p>receiver account number:</p>
          <input
            type="number"
            name="receiverAccountNumber"
            className="rounded-md border border-black"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md border border-black"
        >
          {isLoading ? 'Processing...' : 'Send'}
        </button>
        {error && (
          <div className="font-bold text-red-600">
            {(error.response?.data as { message: string })?.message ??
              error.message}
          </div>
        )}
      </form>
    </div>
  );
}
