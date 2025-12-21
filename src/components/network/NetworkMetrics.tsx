import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [chartData, setChartData] = useState<ChartData>({ storage: [], price: [], growth: [] });
  const [metrics] = useState({
    storage: { value: 4.82, change: 12.3, trend: 'up' as const },
    avgPrice: { value: 0.0023, change: -3.2, trend: 'down' as const },
    hosts: { value: 312, change: 0, trend: 'stable' as const },
  });

  useEffect(() => {
    setChartData(generateChartData());
  }, []);

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
    if (trend === 'up') return <TrendingUp size={12} className="text-success" />;
    if (trend === 'down') return <TrendingDown size={12} className="text-primary" />;
    return <Minus size={12} className="text-foreground-muted" />;
  };

  return (
    <div className="border-t border-border pt-6">
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
              Avg Host Price
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
              ${metrics.avgPrice.value}
            </span>
            <span className="text-sm text-foreground-muted">/TB/mo</span>
          </div>

          <MiniChart data={chartData.price} color="bg-primary/60" />
        </div>

        {/* Network Growth */}
        <div className="chart-container">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-wider text-foreground-subtle">
              Network Growth
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
            <span className="text-sm text-foreground-muted">hosts/mo</span>
          </div>

          <MiniChart data={chartData.growth} color="bg-success/60" />
        </div>
      </div>
    </div>
  );
};
