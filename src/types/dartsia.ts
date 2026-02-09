// Dartsia Backend API Types
// Based on actual backend responses from apps/explorer/

export interface DartsiaBlock {
    id: string;
    height: number;
    parent_id: string;
    timestamp: string;
    transactions?: DartsiaTransaction[];
    transactionsCount?: number; // Backend sends count for list views
    fees?: number; // Backend sends pre-calculated fees in SC
    miner_payouts?: Array<{ siacoin_output: SiacoinOutput }>;
}

export interface DartsiaTransaction {
    id: string;
    height?: number;
    siacoin_inputs?: SiacoinInput[];
    siacoin_outputs?: SiacoinOutput[];
    file_contract_revisions?: any[];
    storage_proofs?: any[];
    file_contracts?: any[];
    host_announcements?: any[];
    miner_fees?: string[];
    arbitrary_data?: string[];
    type?: string; // Simplified type from Explorer API
}

export interface SiacoinInput {
    parent_id: string;
    unlock_conditions: {
        public_keys: string[];
        signatures_required: number;
    };
}

export interface SiacoinOutput {
    value: string;
    address: string;
}

export interface DartsiaHost {
    publicKey: string;
    netAddress: string;
    totalStorage?: number;
    remainingStorage?: number;
    acceptingContracts?: boolean;
    lastScan?: string;
    lastSeen?: string;  // API returns this field
    settings?: {
        storageprice?: string;
        totalstorage?: number;
        remainingstorage?: number;
        version?: string;
        release?: string;
    };
    v2Settings?: {
        prices?: {
            storagePrice?: string;
            ingressPrice?: string;
            egressPrice?: string;
        };
        totalStorage?: number;
        remainingStorage?: number;
        acceptingContracts?: boolean;
    };
}

export interface BlockStats {
    latestBlock: number;
    avgBlockTime?: string;
    difficulty?: string;
    hashrate?: string;
}

export interface NetworkTip {
    height: number;
    id: string;
    timestamp: string;
}

export interface NetworkStats {
    totalHosts: number;
    activeHosts: number;
    usedStorage: string;
    totalStorage: string;
    avgStoragePrice: number;
    blockHeight: number;
    lastBlockTime: string;
}
