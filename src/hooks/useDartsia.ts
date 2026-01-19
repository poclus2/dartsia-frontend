import { useQuery } from '@tanstack/react-query';
import { dartsiaAPI } from '../api/dartsia';

export const useBlockTip = () => {
    return useQuery({
        queryKey: ['blockTip'],
        queryFn: dartsiaAPI.getBlockTip,
        refetchInterval: 30000, // Refresh every 30s
    });
};

export const useBlocks = (page: number = 1, limit: number = 20) => {
    return useQuery({
        queryKey: ['blocks', page, limit],
        queryFn: () => dartsiaAPI.getBlocks(page, limit),
    });
};

export const useBlock = (id: string | undefined) => {
    return useQuery({
        queryKey: ['block', id],
        queryFn: () => dartsiaAPI.getBlockById(id!),
        enabled: !!id,
    });
};

export const useBlockStats = () => {
    return useQuery({
        queryKey: ['blockStats'],
        queryFn: dartsiaAPI.getBlockStats,
        refetchInterval: 60000,
    });
};

export const useRecentTxs = (limit: number = 50) => {
    return useQuery({
        queryKey: ['recentTxs', limit],
        queryFn: () => dartsiaAPI.getRecentTxs(limit),
        refetchInterval: 30000,
    });
};

export const useTransaction = (id: string | undefined) => {
    return useQuery({
        queryKey: ['transaction', id],
        queryFn: () => dartsiaAPI.getTransactionById(id!),
        enabled: !!id,
    });
};

export const useHosts = () => {
    return useQuery({
        queryKey: ['hosts'],
        queryFn: dartsiaAPI.getHosts,
        refetchInterval: 60000,
    });
};

export const useNetworkStats = () => {
    return useQuery({
        queryKey: ['networkStats'],
        queryFn: dartsiaAPI.getNetworkStats,
        refetchInterval: 60000,
    });
};
