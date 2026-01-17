import { useRecentTransactions } from "@/hooks/useRecentTransactions";
import { ArrowLeftRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function TransactionFlow() {
    const { data: transactions, isLoading } = useRecentTransactions(5);

    if (isLoading) {
        return <div className="text-center py-4 text-muted-foreground">Loading recent transactions...</div>;
    }

    return (
        <div className="space-y-4">
            {transactions?.map((tx) => (
                <div
                    key={tx.id}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-2 text-primary">
                            <ArrowLeftRight className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Link to={`/tx/${tx.id}`} className="font-mono text-sm font-medium hover:underline">
                                {tx.id.substring(0, 8)}...{tx.id.substring(tx.id.length - 8)}
                            </Link>
                            <span className="text-xs text-muted-foreground">
                                {new Date(tx.timestamp).toLocaleTimeString()} · Height {tx.height}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-green-500 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Confirmed
                        </span>
                    </div>
                </div>
            ))}
            {(!transactions || transactions.length === 0) && (
                <div className="text-center py-4 text-muted-foreground">No recent transactions found</div>
            )}
        </div>
    );
}
