import axios, { AxiosError, AxiosResponse } from 'axios';

import paths from '../providers/router/routes';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 1000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.response.use(
  (res: AxiosResponse) => {
    return res.data;
  },
  (err: AxiosError) => {
    if (err.response && [401, 403].includes(err.response?.status)) {
      window.location.href = paths.login;
    }
    return Promise.reject(err);
  },
);

export default instance;
