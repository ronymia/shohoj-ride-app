import { useCallback, useEffect, useState } from "react";

export const fetchAPI = async (url: string, options?: RequestInit) => {
  try {
    const baseUrl = process.env.EXPO_PUBLIC_API_URL;
    // Avoid double slashes: if baseUrl ends with / and url starts with /, remove one
    const safeUrl = url.startsWith("/") ? url : `/${url}`;
    const fullUrl = `${baseUrl}${safeUrl}`;

    console.log("Fetching API:", fullUrl);

    const response = await fetch(fullUrl, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`,
      );
    }
    return await response.json();
  } catch (error) {
    console.error(
      `Fetch error at ${process.env.EXPO_PUBLIC_API_URL || "http://192.168.8.67:8081"}${url}:`,
      error,
    );
    throw error;
  }
};

export const useFetch = <T>(url: string, options?: RequestInit) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchAPI(url, options);
      setData(result.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
