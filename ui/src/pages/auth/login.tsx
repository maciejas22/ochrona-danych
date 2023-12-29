import axios from 'axios';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { IUser } from '../../types/user';

export default function LoginPage() {
  const navigate = useNavigate();

  const { mutate: loginMutation, isLoading } = useMutation({
    mutationFn: async (user: { username: string; password: string }) => {
      const response = await axios.post<IUser>('/auth/login', user);
      return response.data;
    },
    onSuccess: () => {
      navigate('/');
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { elements } = event.currentTarget;
    const username = (elements.namedItem('username') as HTMLInputElement).value;
    const password = (elements.namedItem('password') as HTMLInputElement).value;

    try {
      loginMutation({ username, password });
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" />
      <input type="password" name="password" />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
