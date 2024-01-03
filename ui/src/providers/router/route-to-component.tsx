import Login from '../../pages/auth/login';
import Register from '../../pages/auth/register';
import Home from '../../pages/home';
import CreateTransaction from '../../pages/transaction/create';
import TransactionHistory from '../../pages/transaction/history';
import paths from './routes';

interface Route {
  url: (typeof paths)[keyof typeof paths];
  component: () => JSX.Element;
  title?: string;
}

export const publicRoutes: Route[] = [
  {
    url: paths.login,
    component: Login,
    title: 'Login',
  },
  {
    url: paths.register,
    component: Register,
    title: 'Register',
  },
];

export const privateRoutes: Route[] = [
  {
    url: paths.home,
    component: Home,
    title: 'Home',
  },
  {
    url: paths.transactionHistory,
    component: TransactionHistory,
    title: 'Transaction History',
  },
  {
    url: paths.newTransaction,
    component: CreateTransaction,
    title: 'New Transaction',
  },
];
