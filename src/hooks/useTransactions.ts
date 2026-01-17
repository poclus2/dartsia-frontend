import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Transaction } from '@/types/api';

interface UseTransactionsParams {
    limit?: number;
    offset?: number;
}

export function useTransactions({ limit = 20, offset = 0 }: UseTransactionsParams = {}) {
    return useQuery({
        queryKey: ['transactions', limit, offset],
        queryFn: async () => {
            const { data } = await api.get<Transaction[]>(`/explorer/transactions`, {
                params: { limit, offset }
            });
            return data;
        },
        refetchInterval: 15000,
    });
}
