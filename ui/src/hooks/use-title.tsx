import { useEffect } from 'react';

export function useTitle(title?: string) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title || 'MyBank';

    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}
