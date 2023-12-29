import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';

import routes from './route-to-component';

function buildPublicRoutes(): RouteObject[] {
  return routes.map((route) => ({
    path: route.url,
    element: route.component,
    title: route.title,
  }));
}

function buildPrivateRoutes(): RouteObject[] {
  return [];
}

export default function RouterProviderWrapper() {
  return (
    <RouterProvider
      router={createBrowserRouter([
        ...buildPublicRoutes(),
        ...buildPrivateRoutes(),
      ])}
    />
  );
}
