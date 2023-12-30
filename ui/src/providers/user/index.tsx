import axios, { AxiosError } from 'axios';
import { ReactNode, createContext, useState } from 'react';
import { useMutation } from 'react-query';

import { IUser } from '../../types/user';

interface ILoginBody {
  username: string;
  password: string;
}

interface IRegisterBody {
  username: string;
  password: string;
}

interface AuthResponse {
  id: string;
  username: string;
}

interface IUserContext {
  user: IUser | undefined;
  login: ({
    user,
    onSuccess,
    onError,
  }: {
    user: ILoginBody;
    onSuccess?: () => void;
    onError?: () => void;
  }) => void;
  register: ({
    user,
    onSuccess,
    onError,
  }: {
    user: IRegisterBody;
    onSuccess?: () => void;
    onError?: () => void;
  }) => void;
  getUser: ({
    onSuccess,
    onError,
  }: {
    onSuccess?: () => void;
    onError?: () => void;
  }) => void;
  logoutUser: ({
    onSuccess,
    onError,
  }: {
    onSuccess?: () => void;
    onError?: () => void;
  }) => void;
  isLoading: boolean;
  error: AxiosError | undefined;
}

const UserContext = createContext<IUserContext | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AxiosError | undefined>(undefined);

  const loginMutation = useMutation<AuthResponse, AxiosError, ILoginBody>({
    mutationFn: (user: ILoginBody) => {
      setIsLoading(true);
      setError(undefined);
      return axios.post('/auth/login', user).then((res) => res.data);
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

  function login({
    user,
    onSuccess,
    onError,
  }: {
    user: ILoginBody;
    onSuccess?: () => void;
    onError?: () => void;
  }) {
    loginMutation.mutate(user, {
      onSuccess: () => {
        onSuccess && onSuccess();
      },
      onError: () => {
        onError && onError();
      },
    });
  }

  const registerMutation = useMutation<AuthResponse, AxiosError, IRegisterBody>(
    {
      mutationFn: (user: IRegisterBody) => {
        setIsLoading(true);
        setError(undefined);
        return axios.post('/auth/register', user).then((res) => res.data);
      },
      onError: (error) => {
        setError(error);
      },
      onSettled: () => {
        setIsLoading(false);
      },
    },
  );

  function register({
    user,
    onSuccess,
    onError,
  }: {
    user: IRegisterBody;
    onSuccess?: () => void;
    onError?: () => void;
  }) {
    registerMutation.mutate(user, {
      onSuccess: () => {
        onSuccess && onSuccess();
      },
      onError: () => {
        onError && onError();
      },
    });
  }

  const getUserMutation = useMutation<IUser, AxiosError, null>({
    mutationFn: () => {
      setIsLoading(true);
      setError(undefined);
      return axios.get('/user/user').then((res) => res.data);
    },
    onError: (error) => {
      setError(error);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  function getUser({
    onSuccess,
    onError,
  }: {
    onSuccess?: () => void;
    onError?: () => void;
  }) {
    getUserMutation.mutate(null, {
      onSuccess: (data) => {
        setUser(data);
        onSuccess && onSuccess();
      },
      onError: () => {
        onError && onError();
      },
    });
  }

  const logoutUserMutation = useMutation<void, AxiosError, null>({
    mutationFn: () => {
      setIsLoading(true);
      setError(undefined);
      return axios.post('/auth/logout').then((res) => res.data);
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

  function logoutUser({
    onSuccess,
    onError,
  }: {
    onSuccess?: () => void;
    onError?: () => void;
  }) {
    logoutUserMutation.mutate(null, {
      onSuccess: () => {
        onSuccess && onSuccess();
      },
      onError: () => {
        onError && onError();
      },
    });
  }

  const contextValue: IUserContext = {
    user,
    login,
    register,
    getUser,
    logoutUser,
    isLoading,
    error,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export default UserContext;
