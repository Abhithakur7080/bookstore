import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export const useDebouncedSearchParams = (
  key: string,
  delay: number = 500
): [string, (value: string) => void] => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialValue = searchParams.get(key) || "";
  const [inputValue, setInputValue] = useState(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (inputValue.trim()) {
        params.set(key, inputValue.trim());
      } else {
        params.delete(key);
      }
      params.set("page", "1");
      setSearchParams(params, { replace: true });
    }, delay);

    return () => clearTimeout(handler);
  }, [inputValue, delay, key, searchParams, setSearchParams]);

  return [inputValue, setInputValue];
};
