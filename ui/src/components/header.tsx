import { Link, useNavigate } from 'react-router-dom';

import { useUser } from '../hooks/use-user';
import paths from '../providers/router/routes';

export default function Header() {
  const navigate = useNavigate();
  const { user, logoutUser } = useUser();

  return (
    <header className="flex items-center justify-between rounded-b-md border-x-2 border-b-2 border-black px-4 py-2 ">
      <Link to={paths.home}>MyBank</Link>
      <div className="flex items-center gap-4">
        {!user && (
          <>
            <Link
              to={paths.login}
              className="rounded-md border border-black px-2 py-1"
            >
              Login
            </Link>
            <Link
              to={paths.register}
              className="rounded-md border border-black px-2 py-1"
            >
              Register
            </Link>
          </>
        )}
        {user && (
          <>
            <p>{user.username}</p>
            <button
              className="rounded-md border border-black px-2 py-1"
              onClick={() =>
                logoutUser({
                  onSuccess: () => navigate(paths.login),
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
