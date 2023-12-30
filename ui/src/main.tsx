import axios from 'axios';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';

import './index.css';
import RouterProvider from './providers/router';
import { UserProvider } from './providers/user';

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <div className="mx-auto max-w-screen-2xl">
            <RouterProvider />
          </div>
        </UserProvider>
      </QueryClientProvider>
    </Suspense>
  </React.StrictMode>,
);
