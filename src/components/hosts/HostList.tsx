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
                        <TableHead>Host Address</TableHead>
                        <TableHead>Total Storage</TableHead>
                        <TableHead>Used Storage</TableHead>
                        <TableHead>Price / TB / Mo</TableHead>
                        <TableHead>Version</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {hosts.map((host) => (
                        <TableRow key={host.public_key}>
                            <TableCell className="font-mono text-xs">
                                <div className="text-primary font-semibold">{host.net_address || "Unknown Address"}</div>
                                <div className="text-[10px] text-muted-foreground mt-0.5" title={host.public_key}>
                                    {host.public_key.substring(0, 10)}...{host.public_key.substring(host.public_key.length - 6)}
                                </div>
                            </TableCell>
                            <TableCell>{formatStorage(host.total_storage)}</TableCell>
                            <TableCell className="text-muted-foreground">
                                {formatStorage(host.used_storage)}
                            </TableCell>
                            <TableCell>{host.price} SC</TableCell>
                            <TableCell>{host.version}</TableCell>
                        </TableRow>
                    ))}
                    {hosts.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                No active hosts found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
