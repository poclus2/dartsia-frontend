import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Host } from '@/types/api';

interface UseHostsParams {
    limit?: number;
    offset?: number;
}

export function useHosts({ limit = 20, offset = 0 }: UseHostsParams = {}) {
    return useQuery({
        queryKey: ['hosts', limit, offset],
        queryFn: async () => {
            const { data } = await api.get<Host[]>(`/explorer/hosts`, {
                params: { limit, offset }
            });
            return data;
        },
        refetchInterval: 60000,
    });
}
