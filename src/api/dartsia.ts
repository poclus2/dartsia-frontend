import axios from 'axios';
import type {
    DartsiaBlock,
    DartsiaTransaction,
    DartsiaHost,
    BlockStats,
    NetworkTip,
    NetworkStats
} from '../types/dartsia';

const API_BASE = '/api/v1/explorer';

const apiKey = import.meta.env.VITE_API_KEY || 'secret-key-change-me';
console.log('Dartsia Client Initialized. API Key:', apiKey ? `${apiKey.substring(0, 5)}...` : 'undefined');

// Create authenticated client
const client = axios.create({
    baseURL: API_BASE,
    headers: {
        'x-api-key': apiKey
    }
});

export const dartsiaAPI = {
    // Blocks
    getBlocks: async (page: number = 1, limit: number = 20) => {
        const { data } = await client.get<DartsiaBlock[]>('/blocks', {
            params: { page, limit }
        });
        return data;
    },

    getBlockTip: async () => {
        const { data } = await client.get<DartsiaBlock>('/blocks/tip');
        return data;
    },

    getBlockById: async (id: string) => {
        const { data } = await client.get<DartsiaBlock>(`/blocks/${id}`);
        return data;
    },

    searchBlock: async (query: string) => {
        const { data } = await client.get<DartsiaBlock[]>('/blocks/search', {
            params: { q: query }
        });
        return data;
    },

    getBlockStats: async () => {
        const { data } = await client.get<BlockStats>('/blocks/stats');
        return data;
    },

    // Transactions
    getRecentTxs: async (limit: number = 50) => {
        const { data } = await client.get<DartsiaTransaction[]>('/tx/recent', {
            params: { limit }
        });
        return data;
    },

    getTransactionById: async (id: string) => {
        const { data } = await client.get<DartsiaTransaction>(`/tx/${id}`);
        return data;
    },

    // Hosts
    getHosts: async () => {
        const { data } = await client.get<DartsiaHost[]>('/hosts');
        return data;
    },

    // Network Analytics
    getNetworkStats: async () => {
        // Breaking out of /explorer base to access /analytics
        const { data } = await client.get<NetworkStats>('../analytics/network');
        return data;
    },
};
