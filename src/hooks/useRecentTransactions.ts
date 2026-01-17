import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Transaction } from '@/types/api';

export function useRecentTransactions(limit = 10) {
    return useQuery({
        queryKey: ['recent-transactions', limit],
        queryFn: async () => {
            const { data } = await api.get<Transaction[]>(`/explorer/transactions?limit=${limit}`);
            return data;
        },
        refetchInterval: 15000,
    });
}
