import { Activity, Box, Server, Wifi, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNetworkStats } from '@/hooks/useDartsia';

interface StatusItem {
  icon: React.ElementType;
  label: string;
  value: string;
  status: 'healthy' | 'warning' | 'critical';
}

export const MobileStatusStrip = () => {
  const { data: stats } = useNetworkStats();

  const statusItems: StatusItem[] = [
    {
      icon: Box,
      label: 'Height',
      value: stats?.blockHeight ? stats.blockHeight.toLocaleString() : '...',
      status: stats ? 'healthy' : 'warning'
    },
    {
      icon: Wifi,
      label: 'Network',
      value: stats ? 'Synced' : 'Connecting...',
      status: stats ? 'healthy' : 'warning'
    },
    {
      icon: Server,
      label: 'Hosts',
      value: stats?.activeHosts ? stats.activeHosts.toLocaleString() : '...',
      status: 'healthy'
    },
    {
      icon: DollarSign, // Changed from Activity (TPS) to Price
      label: 'Price',
      value: stats?.avgStoragePrice ? `${stats.avgStoragePrice.toFixed(1)} SC` : '...',
      status: 'healthy'
    },
  ];

  return (
    <div className="flex items-center justify-between px-3 py-1.5 bg-muted/30 border-b border-border">
      {statusItems.map((item, i) => {
        const Icon = item.icon;
        const statusColor = {
          healthy: 'text-success',
          warning: 'text-secondary',
          critical: 'text-primary'
        }[item.status];

        return (
          <div key={i} className="flex items-center gap-1">
            <div className={cn('w-1.5 h-1.5 rounded-full', {
              'bg-success': item.status === 'healthy',
              'bg-secondary': item.status === 'warning',
              'bg-primary': item.status === 'critical',
            })} />
            <Icon size={10} className="text-foreground-subtle" />
            <span className={cn('text-[10px] font-mono font-medium', statusColor)}>
              {item.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};
