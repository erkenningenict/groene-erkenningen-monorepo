import { useState, useEffect } from "react";

// Define a generic type for the data
type FetchResult<T> = {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: unknown | undefined;
};

function hasNameProperty(error: unknown): error is { name: string } {
  return typeof error === "object" && error !== null && "name" in error;
}

function useFetch<T>(url: string, enabled = true): FetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<unknown | undefined>(undefined);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setIsError(false);
    setError(undefined);
    setData(null);
  }, [url]);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }
    const abortController = new AbortController();
    const fetchData = async () => {
      try {
        const response = await fetch(url, { signal: abortController.signal });
        if (response.status === 500) {
          try {
            const errorResponse = await response.json();
            setError(errorResponse);
            return;
          } catch (error) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }
        if (response.status === 400) {
          try {
            const errorResponse = await response.json();
            setError(errorResponse);
            return;
          } catch (error) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }
        const json = await response.json();
        setData(json as T);
        setIsError(false);
        setError(undefined);
      } catch (error: unknown) {
        if (hasNameProperty(error) && error.name === "AbortError") {
          return;
        } else {
          console.error("Unexpected error", error);

          setIsError(true);
          setError(error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    return () => abortController.abort();
  }, [url, enabled]);

  return { data, isLoading, isError, error };
}

export default useFetch;
