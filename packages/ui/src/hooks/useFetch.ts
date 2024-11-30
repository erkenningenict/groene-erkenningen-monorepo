import { useState, useEffect } from "react";

// Define a generic type for the data
type FetchResult<T> = {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
};

function hasNameProperty(error: unknown): error is { name: string } {
  return typeof error === "object" && error !== null && "name" in error;
}

function useFetch<T>(url: string, enabled = true): FetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const abortController = new AbortController();
    const fetchData = async () => {
      try {
        const response = await fetch(url, { signal: abortController.signal });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        setData(json as T);
        setIsLoading(false);
        setIsError(false);
      } catch (error: unknown) {
        if (hasNameProperty(error) && error.name === "AbortError") {
        } else {
          console.error("Unexpected error", error);
          setIsError(true);
          setIsLoading(false);
        }
      }
    };

    fetchData();
    return () => abortController.abort();
  }, [url, enabled]);

  return { data, isLoading, isError };
}

export default useFetch;
