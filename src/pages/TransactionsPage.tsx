import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ArrowLeftRight, Filter } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'contract_formation' | 'storage_proof' | 'transfer' | 'host_announcement' | 'contract_renewal';
  blockHeight: number;
  amount: number;
  fee: number;
  timestamp: Date;
  from: string;
  to: string;
}

const txTypeConfig = {
  contract_formation: { label: 'Contract Formation', color: 'bg-primary', textColor: 'text-primary' },
  storage_proof: { label: 'Storage Proof', color: 'bg-success', textColor: 'text-success' },
  transfer: { label: 'Transfer', color: 'bg-foreground-muted', textColor: 'text-foreground' },
  host_announcement: { label: 'Host Announcement', color: 'bg-secondary', textColor: 'text-secondary' },
  contract_renewal: { label: 'Contract Renewal', color: 'bg-primary/70', textColor: 'text-primary' },
};

const generateMockTxs = (count: number): Transaction[] => {
  const types: Transaction['type'][] = ['contract_formation', 'storage_proof', 'transfer', 'host_announcement', 'contract_renewal'];
  return Array.from({ length: count }, (_, i) => ({
    id: `${Math.random().toString(36).slice(2, 14)}${Math.random().toString(36).slice(2, 14)}`,
    type: types[Math.floor(Math.random() * types.length)],
    blockHeight: 489271 - Math.floor(i / 5),
    amount: Math.random() * 5000,
    fee: Math.random() * 0.1,
    timestamp: new Date(Date.now() - i * 30000),
    from: `addr_${Math.random().toString(36).slice(2, 10)}`,
    to: `addr_${Math.random().toString(36).slice(2, 10)}`,
  }));
};

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeFilters, setActiveFilters] = useState<Set<Transaction['type']>>(new Set());

  useEffect(() => {
    setTransactions(generateMockTxs(100));
  }, []);

  const toggleFilter = (type: Transaction['type']) => {
    const newFilters = new Set(activeFilters);
    if (newFilters.has(type)) {
      newFilters.delete(type);
    } else {
      newFilters.add(type);
    }
    setActiveFilters(newFilters);
  };

  const filteredTxs = activeFilters.size === 0 
    ? transactions 
    : transactions.filter(tx => activeFilters.has(tx.type));

  // Group by block
  const groupedByBlock = filteredTxs.reduce((acc, tx) => {
    if (!acc[tx.blockHeight]) acc[tx.blockHeight] = [];
    acc[tx.blockHeight].push(tx);
    return acc;
  }, {} as Record<number, Transaction[]>);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="h-16 border-b border-border bg-background-elevated/50 backdrop-blur-sm px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ArrowLeftRight size={20} className="text-secondary" />
          <h1 className="text-lg font-semibold">Transaction Stream</h1>
        </div>
        <div className="flex items-center gap-2 text-foreground-subtle">
          <span className="text-xs font-mono">{filteredTxs.length} transactions</span>
        </div>
      </div>

      {/* Filter Bar - Floating overlay style */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border-subtle px-6 py-3">
        <div className="flex items-center gap-4">
          <Filter size={14} className="text-foreground-muted" />
          <div className="flex items-center gap-2">
            {Object.entries(txTypeConfig).map(([type, config]) => (
              <button
                key={type}
                onClick={() => toggleFilter(type as Transaction['type'])}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium border transition-all',
                  activeFilters.has(type as Transaction['type'])
                    ? `${config.color} border-transparent text-background`
                    : 'border-border text-foreground-muted hover:border-foreground-muted'
                )}
              >
                {config.label}
              </button>
            ))}
          </div>
          {activeFilters.size > 0 && (
            <button
              onClick={() => setActiveFilters(new Set())}
              className="text-xs text-foreground-muted hover:text-foreground transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Transaction Stream */}
      <div className="p-6">
        {Object.entries(groupedByBlock).map(([blockHeight, txs]) => (
          <div key={blockHeight} className="mb-6">
            {/* Block Header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-4 bg-secondary" />
              <span className="text-xs font-mono text-foreground-muted">
                Block #{Number(blockHeight).toLocaleString()}
              </span>
              <span className="text-xs text-foreground-subtle">
                {txs.length} transaction{txs.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* Transactions */}
            <div className="space-y-1 ml-4">
              {txs.map((tx) => {
                const config = txTypeConfig[tx.type];
                return (
                  <div
                    key={tx.id}
                    className="group relative flex items-center gap-4 p-3 bg-background-surface/50 border border-transparent hover:border-border transition-all cursor-pointer"
                  >
                    {/* Type indicator */}
                    <div className={cn('w-1 h-full absolute left-0 top-0', config.color)} />
                    
                    {/* Type badge */}
                    <div className={cn(
                      'px-2 py-0.5 text-[10px] uppercase tracking-wider',
                      config.color,
                      'text-background font-medium min-w-[120px] text-center'
                    )}>
                      {config.label.split(' ')[0]}
                    </div>

                    {/* TX ID */}
                    <span className="font-mono text-xs text-foreground-muted flex-1 truncate">
                      {tx.id}
                    </span>

                    {/* Amount */}
                    <div className="flex flex-col items-end min-w-[100px]">
                      <span className="font-mono text-sm text-secondary">
                        {tx.amount.toFixed(2)} SC
                      </span>
                      <span className="font-mono text-[10px] text-foreground-subtle">
                        Fee: {tx.fee.toFixed(4)}
                      </span>
                    </div>

                    {/* Visual flow indicator */}
                    <div className="flex items-center gap-2 min-w-[180px]">
                      <span className="font-mono text-[10px] text-foreground-subtle truncate max-w-[70px]">
                        {tx.from}
                      </span>
                      <div className="flex-1 h-px bg-border relative">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-border border-y-2 border-y-transparent" />
                      </div>
                      <span className="font-mono text-[10px] text-foreground-subtle truncate max-w-[70px]">
                        {tx.to}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionsPage;
