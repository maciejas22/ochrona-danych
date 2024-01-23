import { useMutation } from 'react-query';
import { Link } from 'react-router-dom';

import { AxiosError } from 'axios';

import axios from '../../utils/axios';

import paths from '../../providers/router/routes';

export default function ForgotPassword() {
  const { mutate, data, error, isLoading } = useMutation<
    { token: string },
    AxiosError,
    { email: string }
  >({
    mutationKey: 'forgotPassword',
    mutationFn: async (body) => {
      return axios.post('/auth/forgot-password', body);
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { elements } = event.currentTarget;
    const email = (elements.namedItem('email') as HTMLInputElement).value;

    mutate({ email });
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-xl border border-black p-8"
      >
        <div className="flex justify-between gap-2">
          <p>email:</p>
          <input
            type="text"
            name="email"
            className="rounded-md border border-black"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md border border-black"
        >
          {isLoading ? 'Sending...' : 'Send Reset Token'}
        </button>
        {error && (
          <div className="font-bold text-red-600">
            {typeof error?.response?.data === 'string'
              ? error.response.data
              : 'An error occurred'}
          </div>
        )}
        {data && (
          <>
            <p>Reset token: {data.token}</p>
            <Link to={paths.resetPassword} className="text-center">
              reset password
            </Link>
          </>
        )}
      </form>
    </div>
  );
}
