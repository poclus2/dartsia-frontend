import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Host } from "@/types/api";

interface HostListProps {
    hosts: Host[];
    isLoading: boolean;
}

export function HostList({ hosts, isLoading }: HostListProps) {
    if (isLoading) {
        return <div className="text-center py-10">Loading hosts...</div>;
    }

    const formatStorage = (bytes: number) => {
        const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
        let i = 0;
        while (bytes >= 1024 && i < units.length - 1) {
            bytes /= 1024;
            i++;
        }
        return `${bytes.toFixed(2)} ${units[i]}`;
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[40%]">Host Address</TableHead>
                        <TableHead className="w-[20%]">Storage</TableHead>
                        <TableHead className="w-[20%]">Price / TB / Mo</TableHead>
                        <TableHead className="w-[10%] text-right">Version</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {hosts.map((host) => (
                        <TableRow key={host.public_key}>
                            <TableCell className="font-mono text-xs max-w-[200px]">
                                <div className="text-primary font-semibold truncate" title={host.net_address}>
                                    {host.net_address || "Unknown"}
                                </div>
                                <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1" title={host.public_key}>
                                    <span className="truncate">{host.public_key.substring(0, 12)}...{host.public_key.substring(host.public_key.length - 6)}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col text-sm">
                                    <span className="font-medium">{formatStorage(host.used_storage)}</span>
                                    <span className="text-xs text-muted-foreground">/ {formatStorage(host.total_storage)}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-sm font-medium">{host.price} SC</TableCell>
                            <TableCell className="text-sm text-right">{host.version}</TableCell>
                        </TableRow>
                    ))}
                    {hosts.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                No active hosts found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
