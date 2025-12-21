import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Transaction {
  id: string;
  type: 'contract' | 'storage' | 'transfer' | 'host';
  amount: number;
  timestamp: Date;
}

const txTypes = {
  contract: { label: 'Contract', color: 'bg-primary' },
  storage: { label: 'Storage', color: 'bg-secondary' },
  transfer: { label: 'Transfer', color: 'bg-foreground-muted' },
  host: { label: 'Host', color: 'bg-success' },
};

const generateMockTxs = (count: number): Transaction[] => {
  const types: Transaction['type'][] = ['contract', 'storage', 'transfer', 'host'];
  return Array.from({ length: count }, (_, i) => ({
    id: `tx_${Math.random().toString(36).slice(2, 10)}`,
    type: types[Math.floor(Math.random() * types.length)],
    amount: Math.random() * 1000,
    timestamp: new Date(Date.now() - i * 30000),
  }));
};

export const TransactionFlow = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    setTransactions(generateMockTxs(15));

    // Simulate new transactions
    const interval = setInterval(() => {
      setTransactions(prev => {
        const newTx = generateMockTxs(1)[0];
        return [newTx, ...prev.slice(0, 14)];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Transaction Flow
        </h2>
        <div className="flex items-center gap-4">
          {Object.entries(txTypes).map(([key, { label, color }]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={cn('w-2 h-2', color)} />
              <span className="text-[10px] text-foreground-subtle uppercase">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Flow visualization */}
      <div className="relative space-y-1">
        {transactions.map((tx, index) => {
          const config = txTypes[tx.type];
          const widthPercent = (tx.amount / 1000) * 100;
          
          return (
            <div
              key={tx.id}
              className={cn(
                'group relative h-8 flex items-center gap-3 cursor-pointer',
                'transition-all duration-200 hover:bg-muted/20'
              )}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              {/* Flow bar */}
              <div className="relative flex-1 h-full flex items-center">
                <div
                  className={cn(
                    'h-1.5 transition-all duration-300',
                    config.color,
                    'group-hover:h-2'
                  )}
                  style={{ width: `${Math.max(widthPercent, 10)}%` }}
                />
              </div>

              {/* TX info */}
              <div className="flex items-center gap-3 min-w-[200px]">
                <span className="font-mono text-xs text-foreground-muted">
                  {tx.id}
                </span>
                <span className="font-mono text-xs text-secondary">
                  {tx.amount.toFixed(2)} SC
                </span>
              </div>

              {/* Hover indicator */}
              <div className={cn(
                'absolute left-0 top-0 bottom-0 w-0.5 transition-opacity',
                config.color,
                'opacity-0 group-hover:opacity-100'
              )} />
            </div>
          );
        })}

        {/* Scan line effect */}
        <div className="scan-line absolute inset-0 pointer-events-none" />
      </div>
    </div>
  );
};
