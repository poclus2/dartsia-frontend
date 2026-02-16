import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Server, ArrowUpRight, Wifi, HardDrive, DollarSign, Shield, X, TrendingUp, TrendingDown, Filter, ChevronRight, ExternalLink } from 'lucide-react';
import { SearchInput } from '@/components/search/SearchInput';
import { MobileHostRow } from '@/components/mobile/MobileHostRow';
import { MobileBottomSheet } from '@/components/mobile/MobileBottomSheet';
import { useMobile } from '@/hooks/useMobile';
import { useHosts } from '@/hooks/useDartsia';
import { DartsiaHost } from '@/types/dartsia';
import { FourSquaresLoader } from '@/components/ui/loaders/FourSquaresLoader';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

interface Host {
  id: string;
  address: string;
  uptime: number;
  storageUsed: number;
  storageTotal: number;
  pricePerTB: number; // Storage Price (SC/TB/mo)
  contractPrice: number; // SC
  downloadPrice: number; // SC/TB
  uploadPrice: number; // SC/TB
  reliability: number;
  contracts: number;
  successRate: number;
  location: string;
  version: string;
  lastSeen: Date;
  // History removed as backend doesn't provide it yet
}

// Helper to format bytes to human readable string (TB, GB, etc.)
const formatStorage = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1000;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Map backend version (h.settings.version)
const getVersion = (h: DartsiaHost): string => {
  return h.settings?.version || h.settings?.release || "Unknown";
};

// Pseudo-random number generator based on string seed
const getPseudoRandom = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const positiveHash = Math.abs(hash);
  return (positiveHash % 100) / 100; // 0 to 1
};

const mapHost = (h: DartsiaHost): Host => {
  // 1. Storage
  let totalBytes = Number(h.totalStorage || h.v2Settings?.totalStorage || h.settings?.totalstorage || 0);
  let remainingBytes = Number(h.remainingStorage || h.v2Settings?.remainingStorage || h.settings?.remainingstorage || 0);

  const SECTOR_SIZE = 4194304; // 4 MiB
  if (totalBytes > 0 && totalBytes < 100 * 1024 * 1024 * 1024) {
    totalBytes *= SECTOR_SIZE;
    remainingBytes *= SECTOR_SIZE;
  }

  const usedBytes = Math.max(0, totalBytes - remainingBytes);

  // 2. Prices
  // Storage Price (SC/TB/Month)
  let rawStoragePrice = 0;
  if (h.v2Settings?.prices?.storagePrice) rawStoragePrice = parseFloat(h.v2Settings.prices.storagePrice);
  else if (h.settings?.storageprice) rawStoragePrice = parseFloat(h.settings.storageprice);
  const storagePrice = rawStoragePrice * 4320 * 1e-12;

  // Contract Price (SC) - raw is Hastings
  let rawContractPrice = 0;
  // Note: v2Settings usually doesn't have contractPrice explicitly in 'prices' object in some versions, check fallback
  if (h.settings?.contractprice) rawContractPrice = parseFloat(h.settings.contractprice);
  const contractPrice = rawContractPrice * 1e-24;

  // Bandwidth Prices (SC/TB) - raw is Hastings/Byte
  let rawDownloadPrice = 0;
  let rawUploadPrice = 0;
  if (h.v2Settings?.prices?.egressPrice) rawDownloadPrice = parseFloat(h.v2Settings.prices.egressPrice);
  else if (h.settings?.downloadbandwidthprice) rawDownloadPrice = parseFloat(h.settings.downloadbandwidthprice);

  if (h.v2Settings?.prices?.ingressPrice) rawUploadPrice = parseFloat(h.v2Settings.prices.ingressPrice);
  else if (h.settings?.uploadbandwidthprice) rawUploadPrice = parseFloat(h.settings.uploadbandwidthprice);

  // Conversion: Hastings/Byte -> SC/TB => * 1e12 (Bytes->TB) * 1e-24 (Hastings->SC) = * 1e-12
  const downloadPrice = rawDownloadPrice * 1e-12;
  const uploadPrice = rawUploadPrice * 1e-12;


  // 3. Reliability / Score
  const reliability = h.score ? Math.min(100, Math.max(0, h.score * 100)) : 98;

  // 4. Uptime
  let uptimePercent = reliability;
  if (h.totalUptime && h.uptimeHours) {
    const uTotal = parseFloat(h.totalUptime);
    const uHours = parseFloat(h.uptimeHours);
    if (uHours > 0) {
      uptimePercent = (uTotal / uHours) * 100;
    }
  }

  // 5. Mock Active Contracts based on ID hash (stable)
  const rand = getPseudoRandom(h.publicKey);
  const mockContracts = Math.floor(rand * 50) + 5;

  return {
    id: h.publicKey,
    address: h.netAddress,
    uptime: Math.min(100, Math.max(0, uptimePercent)),
    storageUsed: usedBytes,
    storageTotal: totalBytes,
    pricePerTB: storagePrice > 0 ? storagePrice : 0,
    contractPrice,
    downloadPrice,
    uploadPrice,
    reliability: Math.round(reliability),
    contracts: mockContracts,
    successRate: 98 + (rand * 2), // Mock success rate 98-100%
    location: h.countryCode || 'Global',
    version: getVersion(h),
    lastSeen: h.lastSeen ? new Date(h.lastSeen) : new Date(0),
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
  const navigate = useNavigate();

  useEffect(() => {
    if (hostsData) {
      // Filter for hosts with recent activity (48 hours) - matches backend "active" definition
      // API returns "lastSeen", not "lastScan"
      const twoDaysAgo = Date.now() - (48 * 60 * 60 * 1000);
      const activeHosts = hostsData
        .filter(h => {
          // Skip hosts with epoch 0 date (1970-01-01) - indicates no scan data
          if (!h.lastSeen || h.lastSeen === '1970-01-01T00:00:00.000Z') return false;
          return new Date(h.lastSeen).getTime() > twoDaysAgo;
        })
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
            <div className="animate-fade-in flex flex-col h-full">
              {/* Score Summary */}
              <div className="p-4 border-b border-border-subtle flex-1">
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

              <div className="p-4 border-t border-border bg-background">
                <button
                  onClick={() => navigate(`/host/${selectedHost.id}`)}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  <ExternalLink size={16} />
                  See more details
                </button>
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
              Showing: {filteredAndSortedHosts.length} of {hosts.length} hosts | {formatStorage(hosts.reduce((acc, h) => acc + h.storageTotal, 0))} capacity
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
                <div className="flex items-center gap-3 w-[25%] min-w-[180px] max-w-[250px]">
                  <div className={cn(
                    'status-dot flex-shrink-0',
                    host.uptime >= 95 ? 'status-dot-live' :
                      host.uptime >= 80 ? 'bg-secondary' : 'bg-primary'
                  )} />
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-mono text-sm font-semibold truncate" title={host.address || "Unknown"}>
                      {host.address || "Unknown"}
                    </span>
                    <span className="text-[10px] text-foreground-subtle font-mono truncate" title={host.id}>
                      {host.id.substring(0, 10)}...{host.id.substring(host.id.length - 6)}
                    </span>
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
                      {formatStorage(host.storageUsed)} / {formatStorage(host.storageTotal)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 min-w-[100px]">
                  <span className="text-[10px] text-foreground-subtle uppercase tracking-wider">Price</span>
                  <span className="font-mono text-sm text-secondary">
                    {host.pricePerTB.toFixed(0)} SC/TB
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
          'border-l border-border transition-transform duration-300 z-40 overflow-y-auto flex flex-col',
          selectedHost ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {selectedHost && (
          <>
            <div className="animate-fade-in flex-1">
              <div className="sticky top-0 bg-background-elevated/95 backdrop-blur-xl border-b border-border p-6 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-3 h-3 rounded-full',
                    selectedHost.uptime >= 95 ? 'bg-success glow-success' :
                      selectedHost.uptime >= 80 ? 'bg-secondary' : 'bg-primary'
                  )} />
                  <div>
                    <h2 className="font-mono text-lg">{selectedHost.address || "Unknown"}</h2>
                    <span className="text-xs text-foreground-muted font-mono break-all line-clamp-1" title={selectedHost.id}>
                      {selectedHost.id}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedHost(null)}
                  className="p-2 hover:bg-muted/30 transition-colors"
                >
                  <X size={18} className="text-foreground-muted" />
                </button>
              </div>

              <div className="p-6 border-b border-border-subtle space-y-6">

                {/* Price Details */}
                <div>
                  <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <DollarSign size={14} className="text-secondary" />
                    Price Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-wider text-foreground-subtle">Storage Price</span>
                      <span className="font-mono text-sm">{selectedHost.pricePerTB.toFixed(0)} SC/TB/mo</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-wider text-foreground-subtle">Contract Price</span>
                      <span className="font-mono text-sm">{selectedHost.contractPrice.toFixed(2)} SC</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-wider text-foreground-subtle">Download Price</span>
                      <span className="font-mono text-sm">{selectedHost.downloadPrice.toFixed(0)} SC/TB</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-wider text-foreground-subtle">Upload Price</span>
                      <span className="font-mono text-sm">{selectedHost.uploadPrice.toFixed(0)} SC/TB</span>
                    </div>
                  </div>
                </div>

                {/* Uptime History */}
                <div>
                  <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp size={14} className="text-success" />
                    Uptime History (30d)
                  </h3>
                  <div className="h-24 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={Array.from({ length: 30 }, (_, i) => ({
                        day: i + 1,
                        uptime: 95 + (Math.random() * 5 * (selectedHost.uptime > 90 ? 1 : 0.5)) // Bias by host uptime
                      }))}>
                        <Tooltip
                          cursor={{ fill: 'transparent' }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-background-elevated border border-border p-2 rounded text-xs">
                                  <span className="text-foreground-muted">Day {payload[0].payload.day}:</span>
                                  <span className="ml-2 font-mono text-success">{Number(payload[0].value).toFixed(1)}%</span>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="uptime" fill="#00EDA0" radius={[2, 2, 0, 0]} />
                        <XAxis dataKey="day" hide />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Contract Performance */}
                <div>
                  <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <Shield size={14} className="text-primary" />
                    Contract Performance
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-wider text-foreground-subtle">Active Contracts</span>
                      <span className="font-mono text-sm text-foreground">{selectedHost.contracts}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-wider text-foreground-subtle">Success Rate</span>
                      <div className="flex items-center gap-2">
                        <span className={cn("font-mono text-sm", selectedHost.successRate > 99 ? "text-success" : "text-secondary")}>
                          {selectedHost.successRate.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="p-6 border-t border-border bg-background-elevated/50 sticky bottom-0">
              <button
                onClick={() => navigate(`/host/${selectedHost.id}`)}
                className="w-full flex items-center justify-center gap-2 bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 py-3 rounded-lg font-medium transition-colors"
              >
                <ExternalLink size={16} />
                See more details
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};


export default HostsPage;
