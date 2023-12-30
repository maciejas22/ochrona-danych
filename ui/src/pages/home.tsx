import { useEffect } from 'react';

import Header from '../components/header';
import { useUser } from '../hooks/use-user';

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
      <Header />
      <div className="mx-4 my-2">
        <p>Account Balance: {user?.balance}$</p>
      </div>
    </>
  );
}
