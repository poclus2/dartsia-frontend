import { useState, useEffect } from 'react';
import { AlertTriangle, Bell, CheckCircle, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'resolved';
  title: string;
  description: string;
  timestamp: Date;
  source: string;
}

const alertConfig = {
  critical: { 
    icon: XCircle, 
    color: 'text-primary', 
    bg: 'bg-primary/10', 
    border: 'border-primary/30',
    pulse: true 
  },
  warning: { 
    icon: AlertTriangle, 
    color: 'text-secondary', 
    bg: 'bg-secondary/10', 
    border: 'border-secondary/30',
    pulse: false 
  },
  info: { 
    icon: Bell, 
    color: 'text-foreground-muted', 
    bg: 'bg-muted/30', 
    border: 'border-border',
    pulse: false 
  },
  resolved: { 
    icon: CheckCircle, 
    color: 'text-success', 
    bg: 'bg-success/10', 
    border: 'border-success/30',
    pulse: false 
  },
};

const generateMockAlerts = (): Alert[] => {
  const alerts: Alert[] = [
    {
      id: '1',
      type: 'critical',
      title: 'Host Cluster Offline',
      description: '12 hosts in EU-West region reporting connectivity issues',
      timestamp: new Date(Date.now() - 300000),
      source: 'Network Monitor'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Storage Capacity Warning',
      description: 'Network approaching 85% storage utilization threshold',
      timestamp: new Date(Date.now() - 1800000),
      source: 'Capacity Planner'
    },
    {
      id: '3',
      type: 'info',
      title: 'Contract Renewal Spike',
      description: 'Unusual number of contract renewals detected in last hour',
      timestamp: new Date(Date.now() - 3600000),
      source: 'Transaction Analyzer'
    },
    {
      id: '4',
      type: 'resolved',
      title: 'Block Propagation Delay',
      description: 'Block propagation delay resolved, network synced',
      timestamp: new Date(Date.now() - 7200000),
      source: 'Consensus Monitor'
    },
    {
      id: '5',
      type: 'warning',
      title: 'Price Volatility Detected',
      description: 'Host pricing variance exceeds normal parameters',
      timestamp: new Date(Date.now() - 10800000),
      source: 'Market Analyzer'
    },
  ];
  return alerts;
};

const AlertsPage = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<Alert['type'] | 'all'>('all');

  useEffect(() => {
    setAlerts(generateMockAlerts());
  }, []);

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(a => a.type === filter);

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="h-16 border-b border-border bg-background-elevated/50 backdrop-blur-sm px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle size={20} className="text-primary" />
          <h1 className="text-lg font-semibold">Alert Center</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-foreground-muted">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {alerts.filter(a => a.type === 'critical').length} Critical
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="border-b border-border-subtle bg-background-elevated/30 px-6 py-3">
        <div className="flex items-center gap-4">
          {(['all', 'critical', 'warning', 'info', 'resolved'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium transition-all',
                filter === type
                  ? 'bg-muted text-foreground'
                  : 'text-foreground-muted hover:text-foreground'
              )}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
              {type !== 'all' && (
                <span className="ml-1.5 opacity-60">
                  ({alerts.filter(a => a.type === type).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="p-6 space-y-3">
        {filteredAlerts.map((alert) => {
          const config = alertConfig[alert.type];
          const Icon = config.icon;

          return (
            <div
              key={alert.id}
              className={cn(
                'border p-4 transition-all cursor-pointer',
                config.bg,
                config.border,
                'hover:border-foreground/20'
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  'mt-0.5',
                  config.color,
                  config.pulse && 'animate-pulse'
                )}>
                  <Icon size={20} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-foreground">{alert.title}</h3>
                    <div className="flex items-center gap-2 text-foreground-subtle">
                      <Clock size={12} />
                      <span className="text-xs font-mono">{formatTimeAgo(alert.timestamp)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-foreground-muted mb-2">{alert.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-foreground-subtle">
                      Source:
                    </span>
                    <span className="text-xs text-foreground-muted font-mono">{alert.source}</span>
                  </div>
                </div>

                {/* Type Badge */}
                <div className={cn(
                  'px-2 py-1 text-[10px] uppercase tracking-wider font-medium',
                  alert.type === 'critical' && 'bg-primary text-primary-foreground',
                  alert.type === 'warning' && 'bg-secondary text-secondary-foreground',
                  alert.type === 'info' && 'bg-muted text-foreground-muted',
                  alert.type === 'resolved' && 'bg-success text-success-foreground'
                )}>
                  {alert.type}
                </div>
              </div>
            </div>
          );
        })}

        {filteredAlerts.length === 0 && (
          <div className="text-center py-12 text-foreground-muted">
            <Bell size={32} className="mx-auto mb-3 opacity-30" />
            <p>No alerts matching current filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPage;
