import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface NetworkHistoryPoint {
    timestamp: string;
    hashrate: number;
    difficulty: number;
    active_hosts: number;
}

export function useNetworkHistory(range: '24h' | '7d' | '30d' = '24h') {
    return useQuery({
        queryKey: ['network-history', range],
        queryFn: async () => {
            // Endpoint might differ, mocking or pointing to a likely endpoint
            // Assuming backend has /explorer/network/history
            const { data } = await api.get<NetworkHistoryPoint[]>(`/explorer/network/history`, {
                params: { range }
            });
            return data;
        },
        refetchInterval: 300000, // 5 minutes
    });
}
