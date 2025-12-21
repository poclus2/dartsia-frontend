import { useEffect, useState } from 'react';
import { Activity, Blocks, Server, HardDrive } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricProps {
  icon: React.ElementType;
  label: string;
  value: string;
  subValue?: string;
  highlight?: boolean;
}

const Metric = ({ icon: Icon, label, value, subValue, highlight }: MetricProps) => (
  <div className="flex items-center gap-3">
    <Icon 
      size={18} 
      className={cn(
        'flex-shrink-0',
        highlight ? 'text-secondary' : 'text-foreground-subtle'
      )} 
    />
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wider text-foreground-subtle">
        {label}
      </span>
      <div className="flex items-baseline gap-2">
        <span className={cn(
          'font-mono text-lg font-semibold',
          highlight ? 'text-secondary' : 'text-foreground'
        )}>
          {value}
        </span>
        {subValue && (
          <span className="text-xs text-foreground-muted">{subValue}</span>
        )}
      </div>
    </div>
  </div>
);

export const StatusRail = () => {
  const [blockHeight, setBlockHeight] = useState(489271);
  const [blockHash, setBlockHash] = useState('0000000000000000000a8f3c2b1e4d5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4');

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBlockHeight(prev => prev + 1);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-background-elevated/80 backdrop-blur-sm border-b border-border">
      {/* Hash Scroll Bar */}
      <div className="h-8 border-b border-border-subtle overflow-hidden relative">
        <div className="absolute inset-0 flex items-center">
          <div className="animate-scroll-left whitespace-nowrap font-mono text-xs text-foreground-subtle">
            <span className="text-foreground-muted mr-4">LATEST BLOCK</span>
            <span className="text-secondary">{blockHash}</span>
            <span className="mx-8 text-foreground-subtle">•</span>
            <span className="text-foreground-muted mr-4">LATEST BLOCK</span>
            <span className="text-secondary">{blockHash}</span>
            <span className="mx-8 text-foreground-subtle">•</span>
            <span className="text-foreground-muted mr-4">LATEST BLOCK</span>
            <span className="text-secondary">{blockHash}</span>
          </div>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="h-20 px-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Network Health */}
          <div className="flex items-center gap-3 pr-8 border-r border-border">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-success" />
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-success animate-ping opacity-40" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-foreground-subtle">
                Network Health
              </span>
              <span className="text-sm font-semibold text-success">Healthy</span>
            </div>
          </div>

          <Metric 
            icon={Blocks}
            label="Block Height"
            value={blockHeight.toLocaleString()}
            highlight
          />

          <Metric 
            icon={Activity}
            label="Transactions"
            value="2,847"
            subValue="last 24h"
          />

          <Metric 
            icon={Server}
            label="Active Hosts"
            value="312"
            highlight
          />

          <Metric 
            icon={HardDrive}
            label="Network Storage"
            value="4.82"
            subValue="PB"
          />
        </div>

        {/* Time indicator */}
        <div className="flex items-center gap-2 text-foreground-subtle">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="font-mono text-xs">LIVE</span>
        </div>
      </div>
    </div>
  );
};
