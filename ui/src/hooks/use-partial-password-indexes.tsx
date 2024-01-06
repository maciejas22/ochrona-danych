import { useQuery } from 'react-query';

import axios from '../utils/axios';

import { PartialPasswordIndexes } from '../types/parital-password';

export default function usePartialPasswordIndexes() {
  const { data, isLoading, error } = useQuery<PartialPasswordIndexes>({
    queryKey: 'partialPasswordIndexes',
    queryFn: async () => axios.get('/user/partial-password-indexes'),
  });

  return { indexes: data, isLoading, error };
}
