export interface Block {
    height: number;
    id: string;
    timestamp: string;
    difficulty: number;
    transactions: Transaction[];
    miner_payouts: MinerPayout[];
    transaction_count: number;
}

export interface Transaction {
    id: string;
    height: number;
    timestamp: string;
    inputs: any[];
    outputs: any[];
    size: number;
}

export interface MinerPayout {
    value: string;
    unlock_hash: string;
}

export interface Host {
    public_key: string;
    net_address: string;
    total_storage: number;
    used_storage: number;
    price: number;
    score: number;
    version: string;
}

export interface NetworkStats {
    height: number;
    difficulty: number;
    hashrate: number;
    active_hosts: number;
    total_storage: number;
    used_storage: number;
}
