import { useState, useEffect } from 'react';
import { Globe, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HostCluster {
  id: string;
  lat: number;
  lng: number;
  count: number;
  avgPrice: number;
  avgReliability: number;
  avgLatency: number;
  region: string;
}

const generateMockClusters = (): HostCluster[] => {
  const regions = [
    { region: 'US East', lat: 40.7, lng: -74 },
    { region: 'US West', lat: 37.8, lng: -122.4 },
    { region: 'EU West', lat: 51.5, lng: -0.1 },
    { region: 'EU Central', lat: 52.5, lng: 13.4 },
    { region: 'Asia Pacific', lat: 35.7, lng: 139.7 },
    { region: 'Singapore', lat: 1.3, lng: 103.8 },
    { region: 'Australia', lat: -33.9, lng: 151.2 },
    { region: 'South America', lat: -23.5, lng: -46.6 },
  ];

  return regions.map((r, i) => ({
    id: `cluster_${i}`,
    lat: r.lat,
    lng: r.lng,
    count: Math.floor(Math.random() * 50) + 10,
    avgPrice: Math.random() * 0.003 + 0.001,
    avgReliability: Math.random() * 15 + 85,
    avgLatency: Math.floor(Math.random() * 100) + 20,
    region: r.region,
  }));
};

const MapPage = () => {
  const [clusters, setClusters] = useState<HostCluster[]>([]);
  const [hoveredCluster, setHoveredCluster] = useState<HostCluster | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<HostCluster | null>(null);

  useEffect(() => {
    setClusters(generateMockClusters());
  }, []);

  // Convert lat/lng to x/y percentages for a simple world map projection
  const projectToMap = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="h-16 border-b border-border bg-background-elevated/50 backdrop-blur-sm px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Globe size={20} className="text-secondary" />
          <h1 className="text-lg font-semibold">Host Distribution</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-foreground-muted">Clusters:</span>
            <span className="font-mono text-sm text-secondary">{clusters.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-foreground-muted">Total Hosts:</span>
            <span className="font-mono text-sm text-secondary">
              {clusters.reduce((acc, c) => acc + c.count, 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-[calc(100vh-64px)] bg-background overflow-hidden">
        {/* World Map Background */}
        <div className="absolute inset-0">
          {/* Grid lines */}
          <svg className="w-full h-full opacity-20">
            {/* Latitude lines */}
            {[-60, -30, 0, 30, 60].map((lat) => {
              const y = ((90 - lat) / 180) * 100;
              return (
                <line
                  key={`lat-${lat}`}
                  x1="0%"
                  y1={`${y}%`}
                  x2="100%"
                  y2={`${y}%`}
                  stroke="hsl(var(--border))"
                  strokeWidth="0.5"
                />
              );
            })}
            {/* Longitude lines */}
            {[-120, -60, 0, 60, 120].map((lng) => {
              const x = ((lng + 180) / 360) * 100;
              return (
                <line
                  key={`lng-${lng}`}
                  x1={`${x}%`}
                  y1="0%"
                  x2={`${x}%`}
                  y2="100%"
                  stroke="hsl(var(--border))"
                  strokeWidth="0.5"
                />
              );
            })}
          </svg>
        </div>

        {/* Continent outlines (simplified) */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Simplified continent shapes */}
            <ellipse cx="30" cy="35" rx="12" ry="8" fill="hsl(var(--foreground))" /> {/* North America */}
            <ellipse cx="32" cy="58" rx="6" ry="10" fill="hsl(var(--foreground))" /> {/* South America */}
            <ellipse cx="52" cy="35" rx="8" ry="6" fill="hsl(var(--foreground))" /> {/* Europe */}
            <ellipse cx="55" cy="50" rx="12" ry="10" fill="hsl(var(--foreground))" /> {/* Africa */}
            <ellipse cx="75" cy="40" rx="15" ry="12" fill="hsl(var(--foreground))" /> {/* Asia */}
            <ellipse cx="85" cy="68" rx="6" ry="5" fill="hsl(var(--foreground))" /> {/* Australia */}
          </svg>
        </div>

        {/* Host Clusters */}
        {clusters.map((cluster) => {
          const { x, y } = projectToMap(cluster.lat, cluster.lng);
          const size = Math.max(cluster.count / 5, 12);
          const isHovered = hoveredCluster?.id === cluster.id;
          const isSelected = selectedCluster?.id === cluster.id;

          return (
            <div
              key={cluster.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{ left: `${x}%`, top: `${y}%` }}
              onMouseEnter={() => setHoveredCluster(cluster)}
              onMouseLeave={() => setHoveredCluster(null)}
              onClick={() => setSelectedCluster(cluster)}
            >
              {/* Pulse ring */}
              <div 
                className={cn(
                  'absolute inset-0 rounded-full animate-ping opacity-30',
                  isSelected ? 'bg-primary' : 'bg-secondary'
                )}
                style={{ 
                  width: size + 10, 
                  height: size + 10,
                  left: -5,
                  top: -5,
                }}
              />
              
              {/* Main dot */}
              <div
                className={cn(
                  'rounded-full transition-all duration-200',
                  isHovered || isSelected 
                    ? 'bg-primary glow-primary' 
                    : 'bg-secondary glow-secondary'
                )}
                style={{ 
                  width: isHovered ? size * 1.2 : size, 
                  height: isHovered ? size * 1.2 : size,
                }}
              />

              {/* Hover tooltip */}
              {isHovered && !isSelected && (
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-popover border border-border p-3 z-20 min-w-[160px] animate-fade-in">
                  <div className="space-y-1">
                    <div className="font-semibold text-sm text-foreground">{cluster.region}</div>
                    <div className="text-xs text-foreground-muted">{cluster.count} hosts</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Selected Cluster Panel */}
        {selectedCluster && (
          <div className="absolute bottom-6 left-6 right-6 bg-background-elevated/95 backdrop-blur-xl border border-border p-6 animate-fade-in">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/20 flex items-center justify-center">
                  <MapPin size={24} className="text-secondary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedCluster.region}</h3>
                  <span className="text-sm text-foreground-muted">{selectedCluster.count} active hosts</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCluster(null)}
                className="text-foreground-muted hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-4 gap-6 mt-6">
              <div className="metric-card">
                <span className="text-[10px] uppercase tracking-wider text-foreground-subtle">
                  Avg Price
                </span>
                <span className="font-mono text-lg text-secondary">
                  ${selectedCluster.avgPrice.toFixed(4)}/TB
                </span>
              </div>
              <div className="metric-card">
                <span className="text-[10px] uppercase tracking-wider text-foreground-subtle">
                  Avg Reliability
                </span>
                <span className={cn(
                  'font-mono text-lg',
                  selectedCluster.avgReliability >= 90 ? 'text-success' : 'text-foreground'
                )}>
                  {selectedCluster.avgReliability.toFixed(1)}%
                </span>
              </div>
              <div className="metric-card">
                <span className="text-[10px] uppercase tracking-wider text-foreground-subtle">
                  Avg Latency
                </span>
                <span className="font-mono text-lg">
                  {selectedCluster.avgLatency}ms
                </span>
              </div>
              <div className="metric-card">
                <span className="text-[10px] uppercase tracking-wider text-foreground-subtle">
                  Host Count
                </span>
                <span className="font-mono text-lg text-secondary">
                  {selectedCluster.count}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute top-6 right-6 bg-background-elevated/80 backdrop-blur-sm border border-border p-4">
          <div className="text-[10px] uppercase tracking-wider text-foreground-subtle mb-3">
            Cluster Density
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary" />
              <span className="text-xs text-foreground-muted">10+</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-secondary" />
              <span className="text-xs text-foreground-muted">30+</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-secondary" />
              <span className="text-xs text-foreground-muted">50+</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
