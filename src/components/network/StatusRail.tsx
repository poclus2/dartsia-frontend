<<<<<<< HEAD
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

export const StatusRail = ({
  blockHeight = 0,
  blockHash = 'Loading...',
  txCount24h = 0,
  activeHosts = 0,
  usedStorage = 0
}: StatusRailProps) => {



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
            label="Active Hosts"
            value={activeHosts.toLocaleString()}
            highlight
          />

          <Metric
            icon={HardDrive}
            label="Used Storage"
            value={(usedStorage / 1000 / 1000 / 1000 / 1000 / 1000).toFixed(2)} // Bytes -> PB
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
=======
import { Activity, Server, Database, HardDrive, Box } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNetworkStats } from "@/hooks/useNetworkStats";

export function StatusRail() {
    const { data: stats, isLoading } = useNetworkStats();

    const formatHashrate = (hashrate: number) => {
        if (!hashrate) return "0 H/s";
        const units = ["H/s", "KH/s", "MH/s", "GH/s", "TH/s", "PH/s", "EH/s"];
        let unitIndex = 0;
        while (hashrate >= 1000 && unitIndex < units.length - 1) {
            hashrate /= 1000;
            unitIndex++;
        }
        return `${hashrate.toFixed(2)} ${units[unitIndex]}`;
    };

    const formatStorage = (bytes: number) => {
        if (!bytes) return "0 B";
        const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB"];
        let unitIndex = 0;
        while (bytes >= 1024 && unitIndex < units.length - 1) {
            bytes /= 1024;
            unitIndex++;
        }
        return `${bytes.toFixed(2)} ${units[unitIndex]}`;
    };

    const items = [
        {
            label: "Height",
            value: stats?.height ? `#${stats.height.toLocaleString()}` : "Loading...",
            icon: Box,
            color: "text-blue-500",
        },
        {
            label: "Hashrate",
            value: stats?.hashrate ? formatHashrate(stats.hashrate) : "Loading...",
            icon: Activity,
            color: "text-green-500",
        },
        {
            label: "Active Hosts",
            value: stats?.active_hosts?.toLocaleString() || "Loading...",
            icon: Server,
            color: "text-purple-500",
        },
        {
            label: "Total Storage",
            value: stats?.total_storage ? formatStorage(stats.total_storage) : "Loading...",
            icon: HardDrive,
            color: "text-orange-500",
        },
        {
            label: "Used Storage",
            value: stats?.used_storage ? formatStorage(stats.used_storage) : "Loading...",
            icon: Database,
            color: "text-red-500",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {items.map((item) => (
                <Card key={item.label}>
                    <CardContent className="flex flex-row items-center justify-between p-6 space-y-0">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                            <p className="text-2xl font-bold">{item.value}</p>
                        </div>
                        <item.icon className={`h-8 w-8 ${item.color} opacity-75`} />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
>>>>>>> dd59b3813fb7697c36a309d5be73d24968d14e15
