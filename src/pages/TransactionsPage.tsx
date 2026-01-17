import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { TransactionList } from "@/components/transactions/TransactionList";
import { useTransactions } from "@/hooks/useTransactions";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TransactionsPage() {
    const [offset, setOffset] = useState(0);
    const limit = 20;
    const { data: transactions, isLoading } = useTransactions({ limit, offset });

    const handleNext = () => {
        setOffset(prev => prev + limit);
    };

    const handlePrevious = () => {
        setOffset(prev => Math.max(0, prev - limit));
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
                    <p className="text-muted-foreground">
                        View the most recent transactions on the network
                    </p>
                </div>

                <TransactionList transactions={transactions || []} isLoading={isLoading} />

                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={offset === 0 || isLoading}
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleNext}
                        disabled={isLoading || (transactions && transactions.length < limit)}
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </div>
        </Layout>
    );
}
