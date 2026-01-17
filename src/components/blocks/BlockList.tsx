import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CubeIcon } from "@radix-ui/react-icons";
import { Block } from "@/types/api";

interface BlockListProps {
    blocks: Block[];
    isLoading: boolean;
}

export function BlockList({ blocks, isLoading }: BlockListProps) {
    const navigate = useNavigate();

    if (isLoading) {
        return <div className="text-center py-10">Loading blocks...</div>;
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Height</TableHead>
                        <TableHead>Block ID</TableHead>
                        <TableHead>Transactions</TableHead>
                        <TableHead>Time</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {blocks.map((block) => (
                        <TableRow
                            key={block.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => navigate(`/block/${block.id}`)} // Assuming block detail page exists or will exist, usually it's just height or ID
                        >
                            <TableCell className="font-medium text-primary">
                                #{block.height.toLocaleString()}
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                                {block.id.substring(0, 24)}...
                            </TableCell>
                            <TableCell>{block.transaction_count}</TableCell>
                            <TableCell className="text-muted-foreground">
                                {new Date(block.timestamp).toLocaleString()}
                            </TableCell>
                        </TableRow>
                    ))}
                    {blocks.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                No blocks found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
