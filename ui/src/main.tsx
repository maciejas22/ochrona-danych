import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';

import './index.css';
import RouterProvider from './providers/router';
import { UserProvider } from './providers/user';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <RouterProvider />
        </UserProvider>
      </QueryClientProvider>
    </Suspense>
  </React.StrictMode>,
);
