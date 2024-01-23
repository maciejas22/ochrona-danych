import { useMutation } from 'react-query';

import { AxiosError } from 'axios';

import axios from '../../utils/axios';

import { IUser } from '../../types/user';

interface IResetPasswordPayload {
  email: string;
  password: string;
  token: string;
}

export default function ResetPassword() {
  const { mutate, error, isLoading } = useMutation<
    IUser,
    AxiosError,
    IResetPasswordPayload
  >({
    mutationKey: 'resetPassword',
    mutationFn: async (body) => {
      return axios.post('/auth/reset-password', body);
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { elements } = event.currentTarget;
    const email = (elements.namedItem('email') as HTMLInputElement).value;
    const password = (elements.namedItem('password') as HTMLInputElement).value;
    const token = (elements.namedItem('token') as HTMLInputElement).value;

    mutate(
      { email, password, token },
      { onSuccess: () => alert('Password reset successfully') },
    );
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
        <div className="flex justify-between gap-2">
          <p>new password:</p>
          <input
            type="password"
            name="password"
            className="rounded-md border border-black"
          />
        </div>
        <div className="flex justify-between gap-2">
          <p>token:</p>
          <input
            type="text"
            name="token"
            className="rounded-md border border-black"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md border border-black"
        >
          {isLoading ? 'Sending' : 'reset password'}
        </button>
        {error && (
          <div className="font-bold text-red-600">
            {typeof error?.response?.data === 'string'
              ? error.response.data
              : 'An error occurred'}
          </div>
        )}
      </form>
    </div>
  );
}
