import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { AxiosError } from 'axios';

import axios from '../../utils/axios';

import usePartialPasswordIndexes from '../../hooks/use-partial-password-indexes';
import paths from '../../providers/router/routes';
import { ICard } from '../../types/card';
import { PartialPassword } from '../../types/parital-password';

export default function CreateCard() {
  const navigate = useNavigate();
  const { indexes } = usePartialPasswordIndexes();

  const { mutate, isLoading, error } = useMutation<
    ICard,
    AxiosError,
    PartialPassword
  >({
    mutationKey: 'createCard',
    mutationFn: async (body) => {
      return axios.post('/card/create', body);
    },
    onSuccess: () => {
      alert('Card created successfully!');
      navigate(paths.home);
    },
  });

  if (!indexes) return <div>Loading...</div>;

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
    <div className="flex h-screen items-center justify-center mx-4 my-2">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-xl border border-black p-8"
      >
        <div className="flex justify-between gap-2">
          <p>
            enter {indexes.partialPasswordIndexes.join(', ')} characters of your
            password:
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
          {isLoading ? 'Creating new card...' : 'Continue'}
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
