import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useUser } from '../hooks/use-user';
import paths from '../providers/router/routes';

export default function HomePage() {
  const { user, isLoading, getUser } = useUser();

  useEffect(() => {
    getUser({});
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex items-center justify-between mx-4 my-2">
        <p>Account Balance: {user?.balance}$</p>

        <Link to={paths.transactionHistory}>History</Link>
        <Link
          to={paths.newTransaction}
          className="rounded-md border border-black px-1 py-1"
        >
          New Transaction
        </Link>
      </div>
    </>
  );
}
