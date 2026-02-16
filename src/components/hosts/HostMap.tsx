import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '@/lib/utils';

// Fix for default Leaflet markers in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface HostMapProps {
    countryCode: string;
}

// Custom Pulse Icon
const createPulseIcon = () => {
    return L.divIcon({
        className: 'custom-pin',
        html: `<div class="relative">
                 <div class="absolute -left-3 -top-3 w-6 h-6 bg-primary rounded-full animate-ping opacity-50"></div>
                 <div class="w-3 h-3 bg-primary rounded-full border-2 border-background shadow-[0_0_10px_rgba(var(--primary),0.8)]"></div>
               </div>`,
        iconSize: [0, 0], // CSS handles size
        iconAnchor: [0, 0], // Center it
    });
};

// Approximate Lat/Long for countries (Expanded list if needed, keeping basic set for now)
const COUNTRY_COORDS: Record<string, { lat: number; lng: number, zoom: number }> = {
    'US': { lat: 39.0902, lng: -98.7129, zoom: 4 },
    'DE': { lat: 51.1657, lng: 10.4515, zoom: 6 },
    'FR': { lat: 46.2276, lng: 2.2137, zoom: 6 },
    'GB': { lat: 55.3781, lng: -3.4360, zoom: 5 },
    'CA': { lat: 56.1304, lng: -106.3468, zoom: 3 },
    'AU': { lat: -25.2744, lng: 133.7751, zoom: 4 },
    'CN': { lat: 35.8617, lng: 104.1954, zoom: 4 },
    'JP': { lat: 36.2048, lng: 138.2529, zoom: 5 },
    'RU': { lat: 61.5240, lng: 105.3188, zoom: 3 },
    'BR': { lat: -14.2350, lng: -51.9253, zoom: 4 },
    'IN': { lat: 20.5937, lng: 78.9629, zoom: 5 },
    'NL': { lat: 52.1326, lng: 5.2913, zoom: 7 },
    'SG': { lat: 1.3521, lng: 103.8198, zoom: 11 },
    'Hong Kong': { lat: 22.3193, lng: 114.1694, zoom: 11 },
    'HK': { lat: 22.3193, lng: 114.1694, zoom: 11 },
    'FI': { lat: 61.9241, lng: 25.7482, zoom: 5 },
    'SE': { lat: 60.1282, lng: 18.6435, zoom: 5 },
    'NO': { lat: 60.4720, lng: 8.4689, zoom: 5 },
    'PL': { lat: 51.9194, lng: 19.1451, zoom: 6 },
    'ES': { lat: 40.4637, lng: -3.7492, zoom: 6 },
    'IT': { lat: 41.8719, lng: 12.5674, zoom: 6 },
    'CH': { lat: 46.8182, lng: 8.2275, zoom: 7 },
    'AT': { lat: 47.5162, lng: 14.5501, zoom: 7 },
    'BE': { lat: 50.5039, lng: 4.4699, zoom: 7 },
    'XX': { lat: 20, lng: 0, zoom: 2 }, // Default world view
};

export const HostMap: React.FC<HostMapProps> = ({ countryCode }) => {
    const { lat, lng, zoom } = useMemo(() => {
        return COUNTRY_COORDS[countryCode] || { lat: 20, lng: 0, zoom: 2 };
    }, [countryCode]);

    return (
        <div className="relative w-full h-[250px] md:h-[350px] bg-background-elevated border border-border rounded-xl overflow-hidden shadow-lg group">
            {/* Map Container */}
            <MapContainer
                center={[lat, lng]}
                zoom={zoom}
                scrollWheelZoom={false}
                className="w-full h-full z-0"
                key={`${countryCode}-${lat}-${lng}`} // Key forces re-render when location changes
            >
                {/* CartoDB Dark Matter Tiles - "Expressive" & Dark Mode friendly */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                <Marker position={[lat, lng]} icon={createPulseIcon()}>
                    <Popup className="custom-popup font-mono text-xs">
                        <div className="text-foreground">
                            <strong>Host Location</strong><br />
                            Region: {countryCode}
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>

            {/* Overlay Label */}
            <div className="absolute top-4 left-4 z-[400] bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border">
                <h3 className="text-xs uppercase tracking-wider text-foreground-subtle flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    {countryCode !== 'XX' ? `Region: ${countryCode}` : 'Global Location'}
                </h3>
            </div>
        </div>
    );
};
