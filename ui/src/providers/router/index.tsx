import {
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import Header from '../../components/header';
import { useTitle } from '../../hooks/use-title';
import { privateRoutes, publicRoutes } from './route-to-component';

function buildPublicRoutes() {
  return publicRoutes.map((route, id) => (
    <Route
      key={id}
      path={route.url}
      element={
        <>
          {useTitle(route.title)} <route.component />
        </>
      }
    />
  ));
}

function buildPrivateRoutes() {
  return privateRoutes.map((route, id) => (
    <Route
      key={id}
      path={route.url}
      element={
        <>
          {useTitle(route.title)} <route.component />
        </>
      }
    />
  ));
}

export default function RouterProviderWrapper() {
  return (
    <RouterProvider
      router={createBrowserRouter(
        createRoutesFromElements(
          <Route
            element={
              <div className="max-w-screen-2xl mx-auto">
                <Header />
                <Outlet />
              </div>
            }
          >
            {...buildPublicRoutes()}
            {...buildPrivateRoutes()}
          </Route>,
        ),
      )}
    />
  );
}
