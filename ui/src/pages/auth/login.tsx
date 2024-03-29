import { Link, useNavigate } from 'react-router-dom';

import { useUser } from '../../hooks/use-user';
import paths from '../../providers/router/routes';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useUser();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { elements } = event.currentTarget;
    const email = (elements.namedItem('email') as HTMLInputElement).value;
    const password = (elements.namedItem('password') as HTMLInputElement).value;

    login({ email, password }, { onSuccess: () => navigate(paths.home) });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
          <p>password:</p>
          <input
            type="password"
            name="password"
            className="rounded-md border border-black"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md border border-black"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        {error && (
          <div className="font-bold text-red-600">
            {typeof error?.response?.data === 'string'
              ? error.response.data
              : 'An error occurred'}
          </div>
        )}
        <Link to={paths.forgotPassword}>forgot password?</Link>
      </form>
    </div>
  );
}
