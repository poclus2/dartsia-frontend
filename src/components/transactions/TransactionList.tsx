import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Transaction } from "@/types/api";
import { ArrowRightLeft } from "lucide-react";

interface TransactionListProps {
    transactions: Transaction[];
    isLoading: boolean;
}

export function TransactionList({ transactions, isLoading }: TransactionListProps) {
    const navigate = useNavigate();

    if (isLoading) {
        return <div className="text-center py-10">Loading transactions...</div>;
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Height</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Time</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((tx) => (
                        <TableRow
                            key={tx.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => navigate(`/tx/${tx.id}`)}
                        >
                            <TableCell className="font-mono text-xs flex items-center gap-2">
                                <ArrowRightLeft className="h-3 w-3 text-muted-foreground" />
                                <span className="text-primary font-medium">
                                    {tx.id.substring(0, 24)}...
                                </span>
                            </TableCell>
                            <TableCell>#{tx.height.toLocaleString()}</TableCell>
                            <TableCell>{(tx.size / 1024).toFixed(2)} KB</TableCell>
                            <TableCell className="text-muted-foreground">
                                {new Date(tx.timestamp).toLocaleString()}
                            </TableCell>
                        </TableRow>
                    ))}
                    {transactions.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                No transactions found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
