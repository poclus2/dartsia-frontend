import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, Zap } from "lucide-react";
import { useBlockStats } from "@/hooks/useBlockStats";

export default function BlockStatsDisplay() {
    const { data: stats, isLoading } = useBlockStats();

    // Helper to format difficulty as hash rate
    const formatDifficulty = (difficulty: number) => {
        if (!difficulty) return "0 H/s";
        // This is an approximation. Real network hashrate is usually difficulty / block_time
        // But here we might just display difficulty or a hashrate if provided by backend
        // Assuming the backend sends 'hashrate' in the stats object as per previous implementation
        // If not, we display formatted difficulty
        return difficulty.toLocaleString();
    };

    // Use hashrate from stats if available (added in recent backend updates)
    const displayHashrate = stats?.hashrate
        ? (stats.hashrate > 1e15 ? `${(stats.hashrate / 1e15).toFixed(2)} PH/s` : `${(stats.hashrate / 1e12).toFixed(2)} TH/s`)
        : "Loading...";

    const items = [
        {
            title: "Average Block Fees",
            value: stats?.averageBlockFees ? `${stats.averageBlockFees.toFixed(2)} SC` : "Loading...",
            icon: Zap,
            color: "text-yellow-500",
        },
        {
            title: "Average Block Time",
            value: stats?.averageBlockTime ? `${(stats.averageBlockTime / 60).toFixed(1)} min` : "Loading...",
            icon: Clock,
            color: "text-blue-500",
        },
        {
            title: "Network Difficulty",
            value: displayHashrate,
            icon: Activity,
            color: "text-purple-500",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {items.map((item) => (
                <Card key={item.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {item.title}
                        </CardTitle>
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{item.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
