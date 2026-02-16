import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHosts } from '@/hooks/useDartsia';
import { HostMap } from '@/components/hosts/HostMap';
import { SpeedGauge } from '@/components/hosts/SpeedGauge';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Server, Shield, HardDrive, FileText, Wifi, DollarSign, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DartsiaHost } from '@/types/dartsia';

// Helper to generate mock history data (since backend doesn't provide it yet)
const generateMockHistory = () => {
    return Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        uptime: 98 + Math.random() * 2,
        price: 10 + Math.random() * 5,
    }));
};

// Helper formatters
const formatStorage = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1000;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatSC = (hastings: string | number): string => {
    // Simplified for display: Assume input is already converted or close to SC in the context of this app's existing logic
    // Based on HostsPage logic: 
    // const priceInSC = rawPrice * 4320 * 1e-12; -> rawPrice is Hastings/Byte/Block
    // Here we'll just display strictly what we get or use a standard formatter if available
    // For now, simple number formatting
    const val = Number(hastings);
    if (isNaN(val)) return '0 SC';
    return val.toFixed(0) + ' SC';
};

const HostDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: hosts, isLoading } = useHosts();

    const host = useMemo(() => {
        return hosts?.find(h => h.publicKey === id);
    }, [hosts, id]);

    const historyData = useMemo(() => generateMockHistory(), []);

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading host metrics...</div>;
    }

    if (!host) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <h2 className="text-xl font-semibold">Host Not Found</h2>
                <button onClick={() => navigate('/hosts')} className="text-primary hover:underline">
                    Return to Host List
                </button>
            </div>
        );
    }

    // Derived Metrics (matching HostsPage logic)
    const totalBytes = Number(host.totalStorage || host.v2Settings?.totalStorage || host.settings?.totalstorage || 0);
    const remainingBytes = Number(host.remainingStorage || host.v2Settings?.remainingStorage || host.settings?.remainingstorage || 0);

    // Sector size fix from HostsPage
    let displayTotal = totalBytes;
    let displayRemaining = remainingBytes;
    const SECTOR_SIZE = 4194304;
    if (displayTotal > 0 && displayTotal < 100 * 1024 * 1024 * 1024) {
        displayTotal *= SECTOR_SIZE;
        displayRemaining *= SECTOR_SIZE;
    }
    const usedBytes = Math.max(0, displayTotal - displayRemaining);

    // Prices
    const storagePriceRaw = parseFloat(host.v2Settings?.prices?.storagePrice || host.settings?.storageprice || '0');
    const storagePriceSC = storagePriceRaw * 4320 * 1e-12; // SC/TB/Mo approx

    const ingressPriceRaw = parseFloat(host.v2Settings?.prices?.ingressPrice || host.settings?.uploadbandwidthprice || '0');
    const egressPriceRaw = parseFloat(host.v2Settings?.prices?.egressPrice || host.settings?.downloadbandwidthprice || '0');

    // Conversion factors (approximate for display)
    // 1 TB = 1e12 bytes. 
    const ingressSC = ingressPriceRaw * 1e12 / 1e24; // Hastings/Byte -> SC/TB
    const egressSC = egressPriceRaw * 1e12 / 1e24;

    const score = host.score ? Math.min(100, Math.max(0, host.score * 100)) : 0;

    const version = host.settings?.version || host.settings?.release || "Unknown";

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-background-elevated/80 backdrop-blur-md border-b border-border px-6 py-4 flex items-center gap-4">
                <button
                    onClick={() => navigate('/hosts')}
                    className="p-2 hover:bg-muted/20 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-lg font-mono font-semibold truncate max-w-[300px] md:max-w-none">
                        {host.netAddress}
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", score >= 50 ? "bg-success" : "bg-primary")} />
                        <span className="text-xs text-foreground-muted font-mono">{host.publicKey}</span>
                    </div>
                </div>
            </div>

            <div className="p-6 max-w-7xl mx-auto space-y-6">

                {/* Top Row: Map & Gauges */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Map (2/3 width) */}
                    <div className="lg:col-span-2">
                        <HostMap countryCode={host.countryCode || 'XX'} />
                    </div>

                    {/* Speed Gauges (1/3 width) */}
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
                        <SpeedGauge
                            label="Upload Speed"
                            value={105} // Mock value (backend doesn't provide real speed tests yet)
                            max={500}
                            unit="Mbps"
                            color="#00EDA0"
                        />
                        <SpeedGauge
                            label="Download Speed"
                            value={85} // Mock value
                            max={500}
                            unit="Mbps"
                            color="#3D5AFE"
                        />
                    </div>
                </div>

                {/* 4 Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Total Storage */}
                    <div className="p-4 bg-background-elevated border border-border rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-secondary/10 rounded-lg">
                                <HardDrive size={18} className="text-secondary" />
                            </div>
                            <span className="text-xs text-foreground-subtle uppercase tracking-wider">Total Storage</span>
                        </div>
                        <div className="text-2xl font-mono font-semibold">{formatStorage(displayTotal)}</div>
                    </div>

                    {/* Used Storage */}
                    <div className="p-4 bg-background-elevated border border-border rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <HardDrive size={18} className="text-primary" />
                            </div>
                            <span className="text-xs text-foreground-subtle uppercase tracking-wider">Used Storage</span>
                        </div>
                        <div className="text-2xl font-mono font-semibold">{formatStorage(usedBytes)}</div>
                        <div className="text-xs text-foreground-muted mt-1">
                            {((usedBytes / displayTotal) * 100).toFixed(1)}% Utilization
                        </div>
                    </div>

                    {/* Active Contracts */}
                    <div className="p-4 bg-background-elevated border border-border rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-success/10 rounded-lg">
                                <FileText size={18} className="text-success" />
                            </div>
                            <span className="text-xs text-foreground-subtle uppercase tracking-wider">Active Contracts</span>
                        </div>
                        <div className="text-2xl font-mono font-semibold">
                            {/* Mocking contracts count as it's not in standard list view usually */}
                            {Math.floor(Math.random() * 50) + 10}
                        </div>
                    </div>

                    {/* Host Score */}
                    <div className="p-4 bg-background-elevated border border-border rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <Shield size={18} className="text-purple-500" />
                            </div>
                            <span className="text-xs text-foreground-subtle uppercase tracking-wider">Host Score</span>
                        </div>
                        <div className="text-2xl font-mono font-semibold text-purple-400">
                            {score.toFixed(0)}
                        </div>
                    </div>
                </div>

                {/* Host Info Grid */}
                <div className="p-6 bg-background-elevated border border-border rounded-xl">
                    <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                        <Server size={16} className="text-secondary" />
                        Host Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12">
                        <InfoItem label="Netaddress" value={host.netAddress} />
                        <InfoItem label="Public Key" value={host.publicKey} truncate />
                        <InfoItem label="Online Status" value={host.lastScanSuccessful ? 'Online' : 'Offline'}
                            valueClass={host.lastScanSuccessful ? 'text-success' : 'text-primary'} />

                        <InfoItem label="Accepting Contracts" value={host.settings?.acceptingcontracts ? 'Yes' : 'No'} />
                        <InfoItem label="First Seen" value={new Date(host.firstSeen).toLocaleDateString()} />
                        <InfoItem label="Last Announced" value={new Date(host.lastSeen).toLocaleString()} />

                        <InfoItem label="Country" value={host.countryCode || 'Unknown'} />
                        <InfoItem label="Software Version" value={version} />
                        <InfoItem label="Protocol Version" value="RHP3" /> {/* Assumed V2 per processor logic */}

                        <InfoItem label="Storage Price" value={`${storagePriceSC.toFixed(0)} SC/TB/mo`} />
                        <InfoItem label="Ingress Price" value={`${ingressSC.toFixed(2)} SC/TB`} />
                        <InfoItem label="Egress Price" value={`${egressSC.toFixed(2)} SC/TB`} />

                        <InfoItem label="Contract Price" value={formatSC(host.settings?.contractprice || 0)} />
                        <InfoItem label="Sector Access Price" value={formatSC(host.settings?.sectoraccessprice || 0)} />
                        <InfoItem label="Collateral" value={formatSC(host.settings?.collateral || 0)} />
                        <InfoItem label="Max Collateral" value={formatSC(host.settings?.maxcollateral || 0)} />
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Uptime History */}
                    <div className="p-6 bg-background-elevated border border-border rounded-xl">
                        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                            <Activity size={16} className="text-success" />
                            Uptime History (Last 30 Days)
                        </h3>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={historyData}>
                                    <defs>
                                        <linearGradient id="uptimeGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#00EDA0" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#00EDA0" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="day" hide />
                                    <YAxis domain={[90, 100]} hide />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333' }}
                                        itemStyle={{ color: '#00EDA0' }}
                                    />
                                    <Area type="monotone" dataKey="uptime" stroke="#00EDA0" fillOpacity={1} fill="url(#uptimeGradient)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Price Trend */}
                    <div className="p-6 bg-background-elevated border border-border rounded-xl">
                        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                            <DollarSign size={16} className="text-secondary" />
                            Price Trend (Last 30 Days)
                        </h3>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={historyData}>
                                    <defs>
                                        <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3D5AFE" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3D5AFE" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="day" hide />
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333' }}
                                        itemStyle={{ color: '#3D5AFE' }}
                                    />
                                    <Area type="monotone" dataKey="price" stroke="#3D5AFE" fillOpacity={1} fill="url(#priceGradient)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

const InfoItem = ({ label, value, truncate, valueClass }: { label: string, value: string | number, truncate?: boolean, valueClass?: string }) => (
    <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase tracking-wider text-foreground-subtle">{label}</span>
        <span className={cn(
            "font-mono text-sm",
            truncate && "truncate",
            valueClass
        )} title={truncate ? String(value) : undefined}>
            {value}
        </span>
    </div>
);

export default HostDetailPage;
