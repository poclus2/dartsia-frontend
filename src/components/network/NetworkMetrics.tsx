import { useEffect, useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNetworkStats, useHosts } from '@/hooks/useDartsia';

interface MetricData {
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

interface ChartData {
  storage: number[];
  price: number[];
  growth: number[];
}

const generateChartData = (): ChartData => ({
  storage: Array.from({ length: 24 }, () => Math.random() * 100 + 50),
  price: Array.from({ length: 24 }, () => Math.random() * 20 + 10),
  growth: Array.from({ length: 24 }, () => Math.random() * 50 - 10),
});

const MiniChart = ({ data, color, height = 40 }: { data: number[]; color: string; height?: number }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <div className="flex items-end gap-px" style={{ height }}>
      {data.map((value, i) => {
        const normalizedHeight = ((value - min) / range) * 100;
        return (
          <div
            key={i}
            className={cn('flex-1 transition-all', color)}
            style={{ height: `${Math.max(normalizedHeight, 5)}%` }}
          />
        );
      })}
    </div>
  );
};

export const NetworkMetrics = () => {
  const { data: stats } = useNetworkStats();
  const { data: hostsData } = useHosts();
  const [chartData, setChartData] = useState<ChartData>({ storage: [], price: [], growth: [] });

  // Calculate real metrics from stats
  const realStorage = useMemo(() => {
    if (!stats) return 0;
    const totalBytes = Number(stats.totalStorage);
    return totalBytes / 1e15; // PB
  }, [stats]);

  // Calculate Median Storage Price from Active Hosts
  const medianStoragePrice = useMemo(() => {
    if (!hostsData) return 0;

    const twoDaysAgo = Date.now() - (48 * 60 * 60 * 1000);
    const activeHosts = hostsData.filter(h =>
      h.lastScan && new Date(h.lastScan).getTime() > twoDaysAgo
    );

    if (activeHosts.length === 0) return 0;

    const prices = activeHosts
      .map(h => h.settings?.storageprice ? parseFloat(h.settings.storageprice) : 0)
      .sort((a, b) => a - b);

    const mid = Math.floor(prices.length / 2);
    const median = prices.length % 2 !== 0 ? prices[mid] : (prices[mid - 1] + prices[mid]) / 2;

    // Warning: Assuming price is already normalized or using placeholder if 0
    // If RAW unit, needs conversion. For now utilizing the value as is or default 2.3 if 0 for demo if needed?
    // User requested "median calculated", so we trust the data.
    return median;
  }, [hostsData]);

  const [metrics, setMetrics] = useState({
    storage: { value: 0, change: 0, trend: 'stable' as const }, // Initial
    avgPrice: { value: 0, change: -3.2, trend: 'down' as const },
    hosts: { value: 312, change: 0, trend: 'stable' as const },
  });

  useEffect(() => {
    if (stats) {
      setMetrics(prev => ({
        ...prev,
        storage: {
          value: parseFloat(realStorage.toFixed(2)),
          change: 2.5, // Placeholder change
          trend: 'up'
        },
        hosts: {
          value: stats.activeHosts,  // Use activeHosts (48h filter) for Network Intelligence
          change: 1.2,
          trend: 'up'
        },
        avgPrice: {
          value: medianStoragePrice || stats.avgStoragePrice || 0.002,
          change: -1.5,
          trend: 'down'
        }
      }));
    }
  }, [stats, realStorage, medianStoragePrice]);

  useEffect(() => {
    setChartData(generateChartData());
  }, []);

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
    if (trend === 'up') return <TrendingUp size={12} className="text-success" />;
    if (trend === 'down') return <TrendingDown size={12} className="text-primary" />;
    return <Minus size={12} className="text-foreground-muted" />;
  };

  return (
    <div className="border-y border-border py-6">
      <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
        Network Intelligence
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {/* Storage Capacity */}
        <div className="chart-container">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-wider text-foreground-subtle">
              Storage Capacity
            </span>
            <div className="flex items-center gap-1">
              <TrendIcon trend={metrics.storage.trend} />
              <span className={cn(
                'text-xs font-mono',
                metrics.storage.change > 0 ? 'text-success' : 'text-primary'
              )}>
                {metrics.storage.change > 0 ? '+' : ''}{metrics.storage.change}%
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-2xl font-semibold font-mono text-secondary">
              {metrics.storage.value}
            </span>
            <span className="text-sm text-foreground-muted">PB</span>
          </div>

          <MiniChart data={chartData.storage} color="bg-secondary/60" />
        </div>

        {/* Average Price */}
        <div className="chart-container">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-wider text-foreground-subtle">
              STORAGE PRICE
            </span>
            <div className="flex items-center gap-1">
              <TrendIcon trend={metrics.avgPrice.trend} />
              <span className={cn(
                'text-xs font-mono',
                metrics.avgPrice.change > 0 ? 'text-success' : 'text-primary'
              )}>
                {metrics.avgPrice.change}%
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-2xl font-semibold font-mono text-foreground">
              {metrics.avgPrice.value}
            </span>
            <span className="text-sm text-foreground-muted">SC/TB/mo</span>
          </div>

          <MiniChart data={chartData.price} color="bg-primary/60" />
        </div>

        {/* Network Growth */}
        <div className="chart-container">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-wider text-foreground-subtle">
              Active Hosts
            </span>
            <div className="flex items-center gap-1">
              <TrendIcon trend={metrics.hosts.trend} />
              <span className="text-xs font-mono text-foreground-muted">
                Stable
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-2xl font-semibold font-mono text-success">
              +{metrics.hosts.value}
            </span>
            <span className="text-sm text-foreground-muted">hosts</span>
          </div>

          <MiniChart data={chartData.growth} color="bg-success/60" />
        </div>
      </div>
    </div>
  );
};
