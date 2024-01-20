import { ReactNode, createContext, useEffect, useState } from 'react';
import { useMutation } from 'react-query';

import { AxiosError } from 'axios';

import axios from '../../utils/axios';

import { IUser } from '../../types/user';

interface ILoginBody {
  email: string;
  password: string;
}

interface IRegisterBody {
  email: string;
  name: string;
  surname: string;
  password: string;
}

interface AuthResponse {
  id: string;
  email: string;
}

interface IActionHandlers {
  onSuccess?: () => void;
  onError?: () => void;
}

interface IUserContext {
  login: (user: ILoginBody, handlers?: IActionHandlers) => void;
  register: (user: IRegisterBody, handlers?: IActionHandlers) => void;
  getUser: (handlers?: IActionHandlers) => void;
  logoutUser: (handlers?: IActionHandlers) => void;

  user: IUser | undefined;
  isLoading: boolean;
  error: AxiosError | undefined;
}

const UserContext = createContext<IUserContext | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AxiosError | undefined>(undefined);

  useEffect(() => {
    setTimeout(() => {
      setError(undefined);
    }, 3000);
  }, [error]);

  const loginMutation = useMutation<AuthResponse, AxiosError, ILoginBody>({
    mutationKey: 'login',
    mutationFn: async (user: ILoginBody) => {
      setIsLoading(true);
      setError(undefined);
      return axios.post('/auth/login', user);
    },
    onError: (error) => {
      setError(error);
    },
    onSettled: () => {
      setIsLoading(false);
    },
    onSuccess: () => {
      getUser({});
    },
  });

  function login(user: ILoginBody, handlers?: IActionHandlers) {
    loginMutation.mutate(user, {
      onSuccess: () => {
        handlers?.onSuccess?.();
      },
      onError: () => {
        handlers?.onError?.();
      },
    });
  }

  const registerMutation = useMutation<AuthResponse, AxiosError, IRegisterBody>(
    {
      mutationKey: 'register',
      mutationFn: async (user: IRegisterBody) => {
        setIsLoading(true);
        setError(undefined);
        return axios.post('/auth/register', user);
      },
      onError: (error) => {
        setError(error);
      },
      onSettled: () => {
        setIsLoading(false);
      },
    },
  );

  function register(user: IRegisterBody, handlers?: IActionHandlers) {
    registerMutation.mutate(user, {
      onSuccess: () => {
        handlers?.onSuccess?.();
      },
      onError: () => {
        handlers?.onError?.();
      },
    });
  }

  const getUserMutation = useMutation<IUser, AxiosError, null>({
    mutationKey: 'getUser',
    mutationFn: async () => {
      setIsLoading(true);
      return axios.get('/user');
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  function getUser(handlers?: IActionHandlers) {
    getUserMutation.mutate(null, {
      onSuccess: (data) => {
        setUser(data);
        handlers?.onSuccess?.();
      },
      onError: () => {
        handlers?.onError?.();
      },
    });
  }

  const logoutUserMutation = useMutation<void, AxiosError, null>({
    mutationKey: 'logoutUser',
    mutationFn: async () => {
      setIsLoading(true);
      setError(undefined);
      return axios.post('/auth/logout');
    },
    onError: (error) => {
      setError(error);
    },
    onSettled: () => {
      setIsLoading(false);
    },
    onSuccess: () => {
      setUser(undefined);
    },
  });

  function logoutUser(handlers?: IActionHandlers) {
    logoutUserMutation.mutate(null, {
      onSuccess: () => {
        handlers?.onSuccess?.();
      },
      onError: () => {
        handlers?.onError?.();
      },
    });
  }

  const contextValue: IUserContext = {
    login,
    register,
    getUser,
    logoutUser,
    user,
    isLoading,
    error,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export default UserContext;
