import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRightLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DartsiaTransaction } from '@/types/dartsia';

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

const getTxType = (tx: DartsiaTransaction): Transaction['type'] => {
  // Use direct Explorer type if available
  if (tx.type) {
    if (tx.type.includes('contract')) return 'contract';
    if (tx.type === 'storage_proof') return 'storage';
    if (tx.type === 'host_announcement') return 'host';
    return 'transfer';
  }

  // Fallback for raw block transactions
  if (tx.host_announcements?.length) return 'host';
  if (tx.file_contracts?.length || tx.file_contract_revisions?.length) return 'contract';
  if (tx.storage_proofs?.length) return 'storage';
  return 'transfer';
};

const getTxAmount = (tx: DartsiaTransaction): number => {
  return tx.siacoin_outputs?.reduce((sum, out) => sum + parseFloat(out.value), 0) || 0;
};

interface TransactionFlowProps {
  transactions: DartsiaTransaction[];
}

export const TransactionFlow = ({ transactions: dartsiaTxs = [] }: TransactionFlowProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const formatted = dartsiaTxs.slice(0, 6).map(tx => ({
      id: tx.id,
      type: getTxType(tx),
      amount: getTxAmount(tx),
      timestamp: new Date()
    }));
    setTransactions(formatted);
  }, [dartsiaTxs]);

  return (
    <Card className="scan-line h-full">
      <div className="flex items-center justify-between mb-4 px-6 pt-6">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
          Transaction Flow
        </h2>
      </div>
      <CardContent className="space-y-2 px-3 pb-3">
        {transactions.map((tx, index) => {
          const typeConfig = txTypes[tx.type];
          return (
            <Link
              key={tx.id}
              to={`/tx/${tx.id}`}
              className="block p-3 rounded border border-border hover:border-secondary hover:bg-secondary/5 transition-all animate-slide-in-right"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Color Bar Indicator */}
                  <div className={cn("w-1 h-8 rounded-full flex-shrink-0", typeConfig.color)} title={typeConfig.label} />

                  <div className="flex flex-col min-w-0">
                    <div className="font-mono-data text-sm text-secondary truncate">
                      {tx.id}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-foreground-muted mt-1">
                      <span className={cn("font-medium", typeConfig.color.replace('bg-', 'text-'))}>
                        {typeConfig.label}
                      </span>
                      <span>•</span>
                      <span className="text-foreground">
                        {tx.amount.toLocaleString(undefined, { maximumFractionDigits: 1 })} SC
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
        {transactions.length === 0 && (
          <div className="text-center py-8 text-foreground-muted">
            No recent transactions
          </div>
        )}
      </CardContent>
    </Card>
  );
};
