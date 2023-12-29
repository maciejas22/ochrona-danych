import Login from '../../pages/auth/login';
import Register from '../../pages/auth/register';
import Home from '../../pages/home';
import paths from './routes';

interface Route {
  url: (typeof paths)[keyof typeof paths];
  component: JSX.Element;
  title?: string;
}

const routes: Route[] = [
  {
    url: paths.home,
    component: <Home />,
    title: 'Home',
  },
  {
    url: paths.login,
    component: <Login />,
    title: 'Login',
  },
  {
    url: paths.register,
    component: <Register />,
    title: 'Register',
  },
];

export default routes;
