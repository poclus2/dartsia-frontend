import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { NetworkStats } from "@/types/api";

export function useNetworkStats() {
    return useQuery({
        queryKey: ["network-stats"],
        queryFn: async () => {
            const { data } = await api.get<NetworkStats>("/explorer/network/stats");
            return data;
        },
        refetchInterval: 30000,
    });
}
