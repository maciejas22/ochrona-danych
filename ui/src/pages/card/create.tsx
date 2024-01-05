import { useMutation } from 'react-query';

import { AxiosError } from 'axios';

import axios from '../../utils/axios';

import { ICard } from '../../types/card';

export default function CreateCard() {
  const { mutate, isLoading, error } = useMutation<ICard, AxiosError>({
    mutationKey: 'createCard',
    mutationFn: async (body) => {
      return axios.post('/card/create', body);
    },
    onSuccess: () => {
      alert('Card created successfully!');
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate();
  };

  return (
    <div className="flex h-screen items-center justify-center mx-4 my-2">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-xl border border-black p-8"
      >
        <p>Are you sure you want to continue?</p>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md border border-black"
        >
          {isLoading ? 'Creating new card...' : 'Continue'}
        </button>
        {error && (
          <div className="font-bold text-red-600">
            {(error.response?.data as { message: string })?.message ??
              error.message}
          </div>
        )}
      </form>
    </div>
  );
}
