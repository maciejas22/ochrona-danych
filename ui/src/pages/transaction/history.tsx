import axios, { AxiosError } from 'axios';
import { useQuery } from 'react-query';

import { ITransaction } from '../../types/transaction';

export default function TransactionHistory() {
  const { data, isLoading, error } = useQuery<ITransaction[], AxiosError>({
    queryKey: 'transactionHistory',
    queryFn: async () => {
      return axios.get('/transaction/history').then((res) => res.data);
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Transaction history: </h1>
      <ul>
        {data?.map((transaction, id) => (
          <li key={id}>
            {transaction.title} - {transaction.amount}
          </li>
        ))}
      </ul>
      {error && (
        <div className="font-bold text-red-600">
          {(error.response?.data as { message: string })?.message ??
            error.message}
        </div>
      )}
    </div>
  );
}
