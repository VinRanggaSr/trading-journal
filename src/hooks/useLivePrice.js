import { useQuery } from '@tanstack/react-query';
import * as api from '../lib/api';

export function useLivePrice(ticker) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['price', ticker],
    queryFn: () => api.getPrice(ticker),
    staleTime: 60 * 1000,
    enabled: Boolean(ticker)
  });

  return { price: data?.price, isLoading, isError };
}
