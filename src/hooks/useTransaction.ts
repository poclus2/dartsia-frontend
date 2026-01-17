import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Transaction } from '@/types/api';

export function useTransaction(hash: string) {
    return useQuery({
        queryKey: ['transaction', hash],
        queryFn: async () => {
            const { data } = await api.get<Transaction>(`/explorer/transactions/${hash}`);
            return data;
        },
        enabled: !!hash,
    });
}
