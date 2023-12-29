import axios from 'axios';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { IUser } from '../types/user';

export default function HomePage() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: 'user',
    queryFn: async () => {
      const response = await axios.get<IUser>('/user/user');
      return response.data;
    },
    onSuccess: (data) => {
      if (!data) {
        navigate('/login');
      }
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return <div>{data?.username}</div>;
}
