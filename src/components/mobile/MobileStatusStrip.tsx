import { useNetworkStats } from "@/hooks/useNetworkStats";

export function MobileStatusStrip() {
    const { data: stats } = useNetworkStats();

    if (!stats) return null;

    return (
        <div className="md:hidden grid grid-cols-2 gap-2 p-4 text-xs bg-muted/20">
            <div className="flex flex-col items-center p-2 rounded bg-background border">
                <span className="text-muted-foreground uppercase text-[10px]">Height</span>
                <span className="font-bold">#{stats.height.toLocaleString()}</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded bg-background border">
                <span className="text-muted-foreground uppercase text-[10px]">Hosts</span>
                <span className="font-bold">{stats.active_hosts.toLocaleString()}</span>
            </div>
        </div>
    );
}
