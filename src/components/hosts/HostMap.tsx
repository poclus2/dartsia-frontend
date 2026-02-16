import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';

interface HostMapProps {
    countryCode: string; // e.g., 'US', 'DE'
}

// Approximate Lat/Long for countries
const COUNTRY_COORDS: Record<string, { lat: number; lng: number }> = {
    'US': { lat: 37.0902, lng: -95.7129 },
    'DE': { lat: 51.1657, lng: 10.4515 },
    'FR': { lat: 46.2276, lng: 2.2137 },
    'GB': { lat: 55.3781, lng: -3.4360 },
    'CA': { lat: 56.1304, lng: -106.3468 },
    'AU': { lat: -25.2744, lng: 133.7751 },
    'CN': { lat: 35.8617, lng: 104.1954 },
    'JP': { lat: 36.2048, lng: 138.2529 },
    'RU': { lat: 61.5240, lng: 105.3188 },
    'BR': { lat: -14.2350, lng: -51.9253 },
    'IN': { lat: 20.5937, lng: 78.9629 },
    'NL': { lat: 52.1326, lng: 5.2913 },
    'SG': { lat: 1.3521, lng: 103.8198 },
    'HK': { lat: 22.3193, lng: 114.1694 },
    'FI': { lat: 61.9241, lng: 25.7482 },
    'SE': { lat: 60.1282, lng: 18.6435 },
    'NO': { lat: 60.4720, lng: 8.4689 },
    'PL': { lat: 51.9194, lng: 19.1451 },
    'ES': { lat: 40.4637, lng: -3.7492 },
    'IT': { lat: 41.8719, lng: 12.5674 },
    'CH': { lat: 46.8182, lng: 8.2275 },
    'AT': { lat: 47.5162, lng: 14.5501 },
    'BE': { lat: 50.5039, lng: 4.4699 },
    'XX': { lat: 0, lng: 0 },
};

export const HostMap: React.FC<HostMapProps> = ({ countryCode }) => {
    const coords = useMemo(() => {
        return COUNTRY_COORDS[countryCode] || { lat: 0, lng: 0 };
    }, [countryCode]);

    // Project to simple percentage (Equirectangular)
    // x: -180 to 180 -> 0 to 100
    // y: 90 to -90 -> 0 to 100
    const x = ((coords.lng + 180) / 360) * 100;
    const y = ((90 - coords.lat) / 180) * 100;

    return (
        <div className="relative w-full h-[300px] bg-background-elevated border border-border rounded-xl overflows-hidden">
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full">
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* World Map Background (Simplified SVG) */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Rough Continents */}
                    <path d="M20,20 Q40,10 50,30 T20,50" fill="currentColor" />
                    <path d="M60,20 Q80,10 90,30 T60,50" fill="currentColor" />
                    <path d="M30,60 Q50,70 60,90 T30,80" fill="currentColor" />
                    {/* This is a very abstract representation, better to use the one from MapPage if available, 
                but I'll reuse the MapPage SVG structure for consistency.
            */}
                    <ellipse cx="30" cy="35" rx="12" ry="8" fill="currentColor" />
                    <ellipse cx="32" cy="58" rx="6" ry="10" fill="currentColor" />
                    <ellipse cx="52" cy="35" rx="8" ry="6" fill="currentColor" />
                    <ellipse cx="55" cy="50" rx="12" ry="10" fill="currentColor" />
                    <ellipse cx="75" cy="40" rx="15" ry="12" fill="currentColor" />
                    <ellipse cx="85" cy="68" rx="6" ry="5" fill="currentColor" />
                </svg>
            </div>

            {/* Host Pin */}
            <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x}%`, top: `${y}%` }}
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-50 w-8 h-8 -left-2 -top-2"></div>
                    <div className="relative bg-background-elevated p-1 rounded-full border border-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]">
                        <MapPin size={16} className="text-primary fill-primary/20" />
                    </div>
                </div>

                {/* Label */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-background/80 backdrop-blur px-2 py-1 rounded text-[10px] font-mono whitespace-nowrap border border-border">
                    {countryCode}
                </div>
            </div>

            <div className="absolute top-4 left-4">
                <h3 className="text-xs uppercase tracking-wider text-foreground-subtle">Host Location</h3>
            </div>
        </div>
    );
};
