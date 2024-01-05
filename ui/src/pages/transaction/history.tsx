import { useQuery } from 'react-query';

import { AxiosError } from 'axios';

import axios from '../../utils/axios';

import { ITransaction } from '../../types/transaction';

export default function TransactionHistory() {
  const { data, isLoading, error } = useQuery<ITransaction[], AxiosError>({
    queryKey: 'transactionHistory',
    queryFn: async () => {
      return axios.get('/transaction/history');
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
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
      {error && (
        <div className="font-bold text-red-600">
          {(error.response?.data as { message: string })?.message ??
            error.message}
        </div>
      )}
    </div>
  );
}
