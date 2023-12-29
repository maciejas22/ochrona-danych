import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';

interface UseAxiosProps {
  url: string;
  options?: AxiosRequestConfig;
}

interface UseAxiosResult<T> {
  data: T | null;
  error: AxiosError | null;
  isLoading: boolean;
}

const useAxios = <T,>({
  url,
  options = {},
}: UseAxiosProps): UseAxiosResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response: AxiosResponse = await axios(url, options);
        setData(response.data);
      } catch (error) {
        setError(error as AxiosError);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url, options]);

  return { data, error, isLoading };
};

export default useAxios;
