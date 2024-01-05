import { useQuery } from 'react-query';

import { AxiosError } from 'axios';

import axios from '../../utils/axios';

import { ICard } from '../../types/card';

export default function ListCards() {
  const { data, isLoading, error } = useQuery<ICard[], AxiosError>({
    queryKey: 'cardList',
    queryFn: async () => {
      return axios.get('/card');
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
            <th className="py-4">Card Number</th>
            <th className="py-4">Card CVV</th>
            <th className="py-4">Expiration Date</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((card, id) => (
            <tr key={id} className="border-b">
              <td className="py-2">{card.cardNumber}</td>
              <td className="py-2">{card.cvv}</td>
              <td className="py-2">{card.expirationDate}</td>
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
