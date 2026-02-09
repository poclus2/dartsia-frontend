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

export interface StatusRailProps {
  blockHeight?: number;
  blockHash?: string;
  txCount24h?: number;
  activeHosts?: number;
  usedStorage?: number; // in Bytes
}

const formatStorageValue = (bytes: number) => {
  if (!bytes || bytes === 0) return { value: '0.00', unit: 'B' };
  const k = 1000;
  const sizes = ['B', 'kB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return {
    value: (bytes / Math.pow(k, i)).toFixed(2),
    unit: sizes[i] || 'PB'
  };
};

export const StatusRail = ({
  blockHeight = 0,
  blockHash = 'Loading...',
  txCount24h = 0,
  activeHosts = 0,
  usedStorage = 0
}: StatusRailProps) => {

  const { value: storageVal, unit: storageUnit } = formatStorageValue(usedStorage);

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
            value={txCount24h.toLocaleString()}
            subValue="recent"
          />

          <Metric
            icon={Server}
            label="Total Hosts"
            value={activeHosts.toLocaleString()}
            highlight
          />

          <Metric
            icon={HardDrive}
            label="Used Storage"
            value={storageVal}
            subValue={storageUnit}
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
