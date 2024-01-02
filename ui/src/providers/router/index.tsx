import {
  Outlet,
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';

import { useTitle } from '../../hooks/use-title';
import routes from './route-to-component';

function ComponentWithTitle({
  component,
  title,
}: {
  component: JSX.Element;
  title?: string;
}) {
  useTitle(title);

  return component;
}

function buildPublicRoutes(): RouteObject[] {
  return routes.map((route) => ({
    path: route.url,
    element: (
      <ComponentWithTitle component={route.component} title={route.title} />
    ),
  }));
}

function buildPrivateRoutes(): RouteObject[] {
  return [];
}

export default function RouterProviderWrapper({
  layout,
}: {
  layout?: JSX.Element;
}) {
  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          path: '/',
          element: layout ?? <Outlet />,
          children: [...buildPublicRoutes(), ...buildPrivateRoutes()],
        },
      ])}
    />
  );
}
