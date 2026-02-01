import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Server, ArrowUpRight, Wifi, HardDrive, DollarSign, Shield, X, TrendingUp, TrendingDown, Filter, ChevronRight } from 'lucide-react';
import { SearchInput } from '@/components/search/SearchInput';
import { MobileHostRow } from '@/components/mobile/MobileHostRow';
import { MobileBottomSheet } from '@/components/mobile/MobileBottomSheet';
import { useMobile } from '@/hooks/useMobile';
import { useHosts } from '@/hooks/useDartsia';
import { DartsiaHost } from '@/types/dartsia';
import { FourSquaresLoader } from '@/components/ui/loaders/FourSquaresLoader';

interface Host {
  id: string;
  address: string;
  uptime: number;
  storageUsed: number;
  storageTotal: number;
  pricePerTB: number;
  reliability: number;
  contracts: number;
  successRate: number;
  location: string;
  version: string;
  lastSeen: Date;
  // History removed as backend doesn't provide it yet
}

const mapHost = (h: DartsiaHost): Host => {
  const total = h.totalStorage || h.settings?.totalstorage || 0;
  const remaining = h.remainingStorage || h.settings?.remainingstorage || 0;

  // Parse storage price (approximate conversion if needed, assuming Hastings/Byte/Block or similar raw unit)
  // For now using raw value parsed or 0 if string is "0"
  // Real conversion would depend on backend unit. Assuming backend sends usable value or we use placeholder for now.
  const price = h.settings?.storageprice ? parseFloat(h.settings.storageprice) : 0;

  return {
    id: h.publicKey,
    address: h.netAddress,
    uptime: 99.9, // Placeholder
    storageUsed: Math.max(0, total - remaining),
    storageTotal: total,
    pricePerTB: price > 0 ? price : 100, // Use parsed or fallback
    reliability: 98, // Placeholder
    contracts: 0, // Placeholder
    successRate: 100, // Placeholder
    location: 'Global',
    version: '1.6.0',
    lastSeen: h.lastScan ? new Date(h.lastScan) : new Date(0),
  };
};

const UptimeBar = ({ value }: { value: number }) => (
  <div className="h-1.5 w-24 bg-background flex overflow-hidden">
    <div
      className={cn(
        'h-full transition-all',
        value >= 95 ? 'bg-success' : value >= 80 ? 'bg-secondary' : 'bg-primary'
      )}
      style={{ width: `${value}%` }}
    />
  </div>
);

const ScoreIndicator = ({ score, label }: { score: number; label: string }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] uppercase tracking-wider text-foreground-subtle">{label}</span>
    <div className="flex items-center gap-2">
      <div className="h-1 w-16 bg-background overflow-hidden">
        <div
          className={cn(
            'h-full',
            score >= 90 ? 'bg-success' : score >= 70 ? 'bg-secondary' : 'bg-primary'
          )}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={cn(
        'font-mono text-xs',
        score >= 90 ? 'text-success' : score >= 70 ? 'text-secondary' : 'text-primary'
      )}>
        {score.toFixed(0)}
      </span>
    </div>
  </div>
);

const HostsPage = () => {
  const { data: hostsData, isLoading } = useHosts();
  const [hosts, setHosts] = useState<Host[]>([]);
  const [selectedHost, setSelectedHost] = useState<Host | null>(null);
  const [sortBy, setSortBy] = useState<'uptime' | 'price' | 'reliability' | 'storage'>('reliability');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSort, setShowSort] = useState(false);
  const { isMobile } = useMobile();

  useEffect(() => {
    if (hostsData) {
      // Filter for hosts with recent activity (7 days) or newly synced (no lastScan yet)
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      const activeHosts = hostsData
        .filter(h => !h.lastScan || new Date(h.lastScan).getTime() > sevenDaysAgo)
        .map(mapHost);

      setHosts(activeHosts);
    }
  }, [hostsData]);

  const filteredAndSortedHosts = useMemo(() => {
    let result = [...hosts];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(host =>
        host.id.toLowerCase().includes(query) ||
        host.address.toLowerCase().includes(query) ||
        host.location.toLowerCase().includes(query) ||
        (query === 'high uptime' && host.uptime >= 95) ||
        (query === 'low price' && host.pricePerTB < 0.002) ||
        (query === 'reliable' && host.reliability >= 90)
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'uptime': return b.uptime - a.uptime;
        case 'price': return a.pricePerTB - b.pricePerTB;
        case 'reliability': return b.reliability - a.reliability;
        case 'storage': return (b.storageTotal - b.storageUsed) - (a.storageTotal - a.storageUsed);
        default: return 0;
      }
    });

    return result;
  }, [hosts, searchQuery, sortBy]);

  // Mobile View
  if (isMobile) {
    return (
      <div className="flex flex-col">
        {/* Mobile Stats */}
        <div className="flex items-center gap-3 px-3 py-2 border-b border-border bg-muted/20">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-success" />
            <span className="text-[10px] text-success font-medium">{hosts.filter(h => h.uptime >= 95).length}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <span className="text-[10px] text-foreground-muted">{hosts.filter(h => h.uptime < 95 && h.uptime >= 80).length}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-[10px] text-foreground-muted">{hosts.filter(h => h.uptime < 80).length}</span>
          </div>
          <div className="ml-auto">
            <button
              onClick={() => setShowSort(true)}
              className="flex items-center gap-1 text-xs text-foreground-muted"
            >
              Sort: {sortBy}
              <ChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* Host List */}
        <div>
          {filteredAndSortedHosts.map((host) => (
            <MobileHostRow
              key={host.id}
              publicKey={host.id}
              uptime={host.uptime}
              reliability={host.reliability}
              priceCompetitive={host.pricePerTB < 0.002}
              contractSuccess={host.successRate}
              country={host.location.split('-')[0]}
              onTap={() => setSelectedHost(host)}
            />
          ))}
        </div>

        {/* Sort Bottom Sheet */}
        <MobileBottomSheet
          isOpen={showSort}
          onClose={() => setShowSort(false)}
          title="Sort Hosts"
        >
          <div className="p-4 space-y-2">
            {(['reliability', 'uptime', 'price', 'storage'] as const).map((option) => (
              <button
                key={option}
                onClick={() => {
                  setSortBy(option);
                  setShowSort(false);
                }}
                className={cn(
                  'w-full flex items-center justify-between p-3 border transition-colors',
                  sortBy === option ? 'border-primary bg-primary/10' : 'border-border'
                )}
              >
                <span className="text-sm capitalize">{option}</span>
                {sortBy === option && <span className="text-primary text-xs">Active</span>}
              </button>
            ))}
          </div>
        </MobileBottomSheet>

        {/* Host Detail Bottom Sheet */}
        <MobileBottomSheet
          isOpen={!!selectedHost}
          onClose={() => setSelectedHost(null)}
          title="Host Intelligence"
          height="full"
        >
          {selectedHost && (
            <div className="animate-fade-in">
              {/* Score Summary */}
              <div className="p-4 border-b border-border-subtle">
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn(
                    'w-3 h-3 rounded-full',
                    selectedHost.uptime >= 95 ? 'bg-success' :
                      selectedHost.uptime >= 80 ? 'bg-secondary' : 'bg-primary'
                  )} />
                  <div>
                    <div className="font-mono text-sm">{selectedHost.id}</div>
                    <div className="text-[10px] text-foreground-muted">{selectedHost.address}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <ScoreIndicator score={selectedHost.uptime} label="Uptime" />
                  <ScoreIndicator score={selectedHost.reliability} label="Reliability" />
                  <ScoreIndicator score={selectedHost.successRate} label="Success Rate" />
                  <ScoreIndicator score={(1 - selectedHost.pricePerTB / 0.005) * 100} label="Price Score" />
                </div>
              </div>


            </div>
          )}
        </MobileBottomSheet>
      </div>
    );
  }

  // Desktop View
  return (
    <div className="min-h-screen flex">
      <div className={cn('flex-1 transition-all', selectedHost && 'mr-[450px]')}>
        <div className="h-16 border-b border-border bg-background-elevated/50 backdrop-blur-sm px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Server size={20} className="text-secondary" />
            <h1 className="text-lg font-semibold">Host Intelligence</h1>
          </div>
          <div className="flex items-center gap-4">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Host ID, region, or 'high uptime'..."
              className="w-72"
            />
            <span className="text-xs text-foreground-muted">Sort by:</span>
            {(['reliability', 'uptime', 'price', 'storage'] as const).map((option) => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                className={cn(
                  'text-xs font-medium px-2 py-1 transition-colors',
                  sortBy === option
                    ? 'text-secondary border-b border-secondary'
                    : 'text-foreground-muted hover:text-foreground'
                )}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-b border-border-subtle bg-background-elevated/30">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="status-dot status-dot-live" />
              <span className="text-sm font-medium text-success">{hosts.filter(h => h.uptime >= 95).length} Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="status-dot bg-secondary" />
              <span className="text-sm text-foreground-muted">{hosts.filter(h => h.uptime < 95 && h.uptime >= 80).length} Degraded</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="status-dot bg-primary" />
              <span className="text-sm text-foreground-muted">{hosts.filter(h => h.uptime < 80).length} Critical</span>
            </div>
            <div className="ml-auto font-mono text-xs text-foreground-subtle">
              Showing: {filteredAndSortedHosts.length} of {hosts.length} hosts | {hosts.reduce((acc, h) => acc + h.storageTotal, 0).toFixed(1)} TB capacity
            </div>
          </div>
        </div>

        <div className="p-6 space-y-2">
          {filteredAndSortedHosts.map((host) => (
            <div
              key={host.id}
              className={cn(
                'host-rail',
                selectedHost?.id === host.id && 'border-primary bg-primary/5'
              )}
              onClick={() => setSelectedHost(host)}
            >
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 min-w-[200px]">
                  <div className={cn(
                    'status-dot',
                    host.uptime >= 95 ? 'status-dot-live' :
                      host.uptime >= 80 ? 'bg-secondary' : 'bg-primary'
                  )} />
                  <div className="flex flex-col">
                    <span className="font-mono text-sm">{host.id}</span>
                    <span className="text-[10px] text-foreground-subtle">{host.address}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-foreground-subtle uppercase tracking-wider">Uptime</span>
                  <div className="flex items-center gap-2">
                    <UptimeBar value={host.uptime} />
                    <span className="font-mono text-xs">{host.uptime.toFixed(1)}%</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 min-w-[120px]">
                  <span className="text-[10px] text-foreground-subtle uppercase tracking-wider">Storage</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 bg-background overflow-hidden">
                      <div
                        className="h-full bg-secondary"
                        style={{ width: `${(host.storageUsed / host.storageTotal) * 100}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs">
                      {host.storageUsed.toFixed(1)}/{host.storageTotal.toFixed(1)} TB
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 min-w-[100px]">
                  <span className="text-[10px] text-foreground-subtle uppercase tracking-wider">Price</span>
                  <span className="font-mono text-sm text-secondary">
                    ${host.pricePerTB.toFixed(4)}/TB
                  </span>
                </div>

                <div className="flex flex-col gap-1 min-w-[80px]">
                  <span className="text-[10px] text-foreground-subtle uppercase tracking-wider">Score</span>
                  <span className={cn(
                    'font-mono text-sm font-semibold',
                    host.reliability >= 90 ? 'text-success' :
                      host.reliability >= 70 ? 'text-secondary' : 'text-primary'
                  )}>
                    {host.reliability.toFixed(0)}
                  </span>
                </div>

                <div className="flex flex-col gap-1 min-w-[100px]">
                  <span className="text-[10px] text-foreground-subtle uppercase tracking-wider">Region</span>
                  <span className="text-xs text-foreground-muted">{host.location}</span>
                </div>

                <ArrowUpRight
                  size={16}
                  className="text-foreground-subtle ml-auto group-hover:text-primary transition-colors"
                />
              </div>
            </div>
          ))}

          {filteredAndSortedHosts.length === 0 && (
            <FourSquaresLoader />
          )}
        </div>
      </div>

      {/* Desktop Detail Panel */}
      <div
        className={cn(
          'fixed right-0 top-0 h-screen w-[450px] bg-background-elevated/95 backdrop-blur-xl',
          'border-l border-border transition-transform duration-300 z-40 overflow-y-auto',
          selectedHost ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {selectedHost && (
          <div className="animate-fade-in">
            <div className="sticky top-0 bg-background-elevated/95 backdrop-blur-xl border-b border-border p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-3 h-3 rounded-full',
                  selectedHost.uptime >= 95 ? 'bg-success glow-success' :
                    selectedHost.uptime >= 80 ? 'bg-secondary' : 'bg-primary'
                )} />
                <div>
                  <h2 className="font-mono text-lg">{selectedHost.id}</h2>
                  <span className="text-xs text-foreground-muted">{selectedHost.address}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedHost(null)}
                className="p-2 hover:bg-muted/30 transition-colors"
              >
                <X size={18} className="text-foreground-muted" />
              </button>
            </div>

            <div className="p-6 border-b border-border-subtle">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Shield size={14} className="text-secondary" />
                Score Breakdown
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <ScoreIndicator score={selectedHost.uptime} label="Uptime" />
                <ScoreIndicator score={selectedHost.reliability} label="Reliability" />
                <ScoreIndicator score={selectedHost.successRate} label="Success Rate" />
                <ScoreIndicator score={(1 - selectedHost.pricePerTB / 0.005) * 100} label="Price Score" />
              </div>
            </div>


          </div>
        )}
      </div>
    </div>
  );
};

export default HostsPage;
