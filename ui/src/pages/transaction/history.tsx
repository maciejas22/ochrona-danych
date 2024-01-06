import { useMutation } from 'react-query';

import { AxiosError } from 'axios';

import axios from '../../utils/axios';

import usePartialPasswordIndexes from '../../hooks/use-partial-password-indexes';
import { PartialPassword } from '../../types/parital-password';
import { ITransaction } from '../../types/transaction';

export default function TransactionHistory() {
  const { indexes } = usePartialPasswordIndexes();
  const { mutate, isLoading, error, data } = useMutation<
    ITransaction[],
    AxiosError,
    PartialPassword
  >({
    mutationKey: 'transactionHistory',
    mutationFn: async (body) => {
      return axios.post('/transaction/history', body);
    },
  });

  if (!indexes || isLoading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { elements } = event.currentTarget;
    const partialPassword = (
      elements.namedItem('partialPassword') as HTMLInputElement
    ).value;
    mutate({
      partialPassword,
    });
  };

  return (
    <>
      {!data && (
        <div className="flex h-screen items-center justify-center mx-4 my-2">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 rounded-xl border border-black p-8"
          >
            <div className="flex justify-between gap-2">
              <p>
                enter {indexes.partialPasswordIndexes.join(', ')} characters of
                your password:
              </p>
              <input
                type="text"
                name="partialPassword"
                className="rounded-md border border-black"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md border border-black"
            >
              {isLoading ? 'Loading...' : 'List Cards'}
            </button>
            {error && (
              <div className="font-bold text-red-600">
                {error.response?.data as string}
              </div>
            )}
          </form>
        </div>
      )}

      {data && (
        <div className="mx-4 my-2">
          <table className="table-auto w-full text-left">
            <thead>
              <tr>
                <th className="py-4">Title</th>
                <th className="py-4">Amount</th>
                <th className="py-4">Sender</th>
                <th className="py-4">Receiver</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((transaction, id) => (
                <tr key={id} className="border-b">
                  <td className="py-2">{transaction.title}</td>
                  <td className="py-2">{transaction.amount}$</td>
                  <td className="py-2">{transaction.senderUsername}</td>
                  <td className="py-2">{transaction.receiverUsername}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
