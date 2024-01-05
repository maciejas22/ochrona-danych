import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useUser } from '../hooks/use-user';
import paths from '../providers/router/routes.ts';

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
        <Link
          to={paths.cardNew}
          className="rounded-md border border-black px-1 py-1"
        >
          New Card
        </Link>
        <Link
          to={paths.cardList}
          className="rounded-md border border-black px-1 py-1"
        >
          List Cards
        </Link>
      </div>
      <div className="flex items-center justify-between mx-4 my-2">
        <p>Account Balance: {user?.balance}$</p>

        <div className="flex gap-2">
          <Link
            to={paths.transactionNew}
            className="rounded-md border border-black px-1 py-1"
          >
            New Transaction
          </Link>
          <Link
            to={paths.transactionHistory}
            className="rounded-md border border-black px-1 py-1"
          >
            Transaction History
          </Link>
        </div>
      </div>
    </>
  );
}
