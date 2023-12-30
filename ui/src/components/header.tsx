import { useNavigate } from 'react-router-dom';

import { useUser } from '../hooks/use-user';

export default function Header() {
  const navigate = useNavigate();
  const { user, logoutUser } = useUser();

  return (
    <header className="flex items-center justify-between rounded-b-md border-x-2 border-b-2 border-black px-4 py-2 ">
      <p>MyBank</p>
      <div className="flex items-center gap-4">
        {!user && (
          <>
            <button
              className="rounded-md border border-black px-2 py-1"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button
              className="rounded-md border border-black px-2 py-1"
              onClick={() => navigate('/register')}
            >
              Register
            </button>
          </>
        )}
        {user && (
          <>
            <p>{user.username}</p>
            <button
              className="rounded-md border border-black px-2 py-1"
              onClick={() =>
                logoutUser({
                  onSuccess: () => navigate('/login'),
                })
              }
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}
