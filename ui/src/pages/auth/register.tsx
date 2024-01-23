import { useEffect, useState } from 'react';
import { MutationFunction, useMutation } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';

import { AxiosError } from 'axios';

import axios from '../../utils/axios';

import { useDebounce } from '../../hooks/use-debounce';
import { useUser } from '../../hooks/use-user';
import paths from '../../providers/router/routes';

interface IEntropyBody {
  password: string;
}

interface IEntropyResponse {
  entropy: number;
}

const entropyMutationService: MutationFunction<
  IEntropyResponse,
  IEntropyBody
> = async (entropy) => {
  return axios.post('/auth/entropy', entropy);
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const debouncedPassword = useDebounce(password, 250);
  const {
    register,
    isLoading: registerLoading,
    error: registerError,
  } = useUser();

  const {
    mutate: entropyMutation,
    data: entropyData,
    isLoading: entropyLoading,
    error: entropyError,
  } = useMutation<IEntropyResponse, AxiosError, IEntropyBody>({
    mutationFn: entropyMutationService,
  });

  useEffect(() => {
    if (debouncedPassword) {
      entropyMutation({ password: debouncedPassword });
    }
  }, [debouncedPassword, entropyMutation]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { elements } = event.currentTarget;
    const email = (elements.namedItem('email') as HTMLInputElement).value;
    const name = (elements.namedItem('name') as HTMLInputElement).value;
    const surname = (elements.namedItem('surname') as HTMLInputElement).value;
    const password = (elements.namedItem('password') as HTMLInputElement).value;

    register(
      {
        email,
        name,
        surname,
        password,
      },
      {
        onSuccess: () => navigate(paths.login),
      },
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
          <p>name:</p>
          <input
            type="text"
            name="name"
            className="rounded-md border border-black"
          />
        </div>
        <div className="flex justify-between gap-2">
          <p>surname:</p>
          <input
            type="text"
            name="surname"
            className="rounded-md border border-black"
          />
        </div>
        <div className="flex justify-between gap-2">
          <p>password:</p>
          <input
            type="password"
            name="password"
            className="rounded-md border border-black"
            onChange={(event) => setPassword(event.target.value)}
            value={password}
          />
        </div>
        {password && (
          <div>
            <p>
              Password is:
              {entropyData?.entropy
                ? entropyData.entropy < 2.5
                  ? ' weak'
                  : entropyData.entropy < 3.5
                    ? ' medium'
                    : ' Very Strong'
                : ' Calculating...'}
            </p>
          </div>
        )}
        <button
          type="submit"
          disabled={entropyLoading || registerLoading}
          className="rounded-md border border-black"
        >
          {registerLoading ? 'Signing up...' : 'Register'}
        </button>
        {entropyError && (
          <div className="font-bold text-red-600">
            {typeof entropyError?.response?.data === 'string'
              ? entropyError.response.data
              : 'An error occurred'}
          </div>
        )}
        {registerError && (
          <div className="font-bold text-red-600">
            {typeof registerError?.response?.data === 'string'
              ? registerError.response.data
              : 'An error occurred'}
          </div>
        )}
        <Link to={paths.forgotPassword}>forgot password?</Link>
      </form>
    </div>
  );
}
