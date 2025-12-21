import { Hash, Clock, Layers, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Block {
  height: number;
  txCount: number;
  timestamp: Date;
  hash: string;
  fees: number;
}

interface BlockDetailPanelProps {
  block: Block | null;
  onClose: () => void;
}

export const BlockDetailPanel = ({ block, onClose }: BlockDetailPanelProps) => {
  if (!block) return null;

  return (
    <div className="bg-background-elevated border border-border p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-secondary" />
          <h3 className="text-sm font-semibold">Block Details</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-foreground-muted hover:text-foreground transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="metric-card">
          <div className="flex items-center gap-1.5 mb-1">
            <Hash size={12} className="text-secondary" />
            <span className="text-[10px] uppercase tracking-wider text-foreground-subtle">
              Height
            </span>
          </div>
          <span className="font-mono text-lg text-secondary">
            #{block.height.toLocaleString()}
          </span>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-1.5 mb-1">
            <Clock size={12} className="text-foreground-muted" />
            <span className="text-[10px] uppercase tracking-wider text-foreground-subtle">
              Time
            </span>
          </div>
          <span className="font-mono text-sm">
            {block.timestamp.toLocaleTimeString()}
          </span>
        </div>

        <div className="col-span-2 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-foreground-muted">Hash</span>
            <span className="font-mono text-xs text-foreground-subtle truncate max-w-[200px]">
              {block.hash}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-foreground-muted">Transactions</span>
            <span className="font-mono text-secondary">{block.txCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-foreground-muted">Total Fees</span>
            <span className="font-mono">{block.fees.toFixed(4)} SC</span>
          </div>
        </div>
      </div>
    </div>
  );
};
