import { Activity, Server, Database, HardDrive, Box } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNetworkStats } from "@/hooks/useNetworkStats";

export function StatusRail() {
    const { data: stats, isLoading } = useNetworkStats();

    const formatHashrate = (hashrate: number) => {
        if (!hashrate) return "0 H/s";
        const units = ["H/s", "KH/s", "MH/s", "GH/s", "TH/s", "PH/s", "EH/s"];
        let unitIndex = 0;
        while (hashrate >= 1000 && unitIndex < units.length - 1) {
            hashrate /= 1000;
            unitIndex++;
        }
        return `${hashrate.toFixed(2)} ${units[unitIndex]}`;
    };

    const formatStorage = (bytes: number) => {
        if (!bytes) return "0 B";
        const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB"];
        let unitIndex = 0;
        while (bytes >= 1024 && unitIndex < units.length - 1) {
            bytes /= 1024;
            unitIndex++;
        }
        return `${bytes.toFixed(2)} ${units[unitIndex]}`;
    };

    const items = [
        {
            label: "Height",
            value: stats?.height ? `#${stats.height.toLocaleString()}` : "Loading...",
            icon: Box,
            color: "text-blue-500",
        },
        {
            label: "Hashrate",
            value: stats?.hashrate ? formatHashrate(stats.hashrate) : "Loading...",
            icon: Activity,
            color: "text-green-500",
        },
        {
            label: "Active Hosts",
            value: stats?.active_hosts?.toLocaleString() || "Loading...",
            icon: Server,
            color: "text-purple-500",
        },
        {
            label: "Total Storage",
            value: stats?.total_storage ? formatStorage(stats.total_storage) : "Loading...",
            icon: HardDrive,
            color: "text-orange-500",
        },
        {
            label: "Used Storage",
            value: stats?.used_storage ? formatStorage(stats.used_storage) : "Loading...",
            icon: Database,
            color: "text-red-500",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {items.map((item) => (
                <Card key={item.label}>
                    <CardContent className="flex flex-row items-center justify-between p-6 space-y-0">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                            <p className="text-2xl font-bold">{item.value}</p>
                        </div>
                        <item.icon className={`h-8 w-8 ${item.color} opacity-75`} />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
