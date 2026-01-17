import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { BlockStats } from '@/types/api';

export function useBlockStats() {
    return useQuery({
        queryKey: ['block-stats'],
        queryFn: async () => {
            const { data } = await api.get<BlockStats>('/explorer/blocks/stats');
            return data;
        },
        refetchInterval: 60000,
    });
}
