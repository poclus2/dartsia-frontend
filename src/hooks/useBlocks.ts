import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Block } from '@/types/api';

interface UseBlocksParams {
    limit?: number;
    offset?: number;
}

export function useBlocks({ limit = 20, offset = 0 }: UseBlocksParams = {}) {
    return useQuery({
        queryKey: ['blocks', limit, offset],
        queryFn: async () => {
            const { data } = await api.get<Block[]>(`/explorer/blocks`, {
                params: { limit, offset }
            });
            return data;
        },
        refetchInterval: 30000,
    });
}
