import React from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useTransaction } from "@/hooks/useTransaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, ArrowRightLeft, Clock, Box } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TransactionDetailPage() {
    const { hash } = useParams<{ hash: string }>();
    const { data: tx, isLoading, error } = useTransaction(hash || "");

    if (isLoading) {
        return (
            <Layout>
                <div className="text-center py-20">Loading transaction details...</div>
            </Layout>
        );
    }

    if (error || !tx) {
        return (
            <Layout>
                <div className="text-center py-20">
                    <h2 className="text-xl font-bold text-destructive">Transaction not found</h2>
                    <Button asChild className="mt-4" variant="outline">
                        <Link to="/txs">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Transactions
                        </Link>
                    </Button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button asChild variant="ghost" size="icon">
                        <Link to="/txs">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            Transaction Details
                        </h1>
                        <p className="text-muted-foreground font-mono text-xs md:text-sm break-all">
                            {tx.id}
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Block Height</CardTitle>
                            <Box className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">#{tx.height.toLocaleString()}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Timestamp</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-bold">{new Date(tx.timestamp).toLocaleString()}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Size</CardTitle>
                            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{(tx.size / 1024).toFixed(2)} KB</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Inputs ({tx.inputs?.length || 0})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {tx.inputs?.map((input, i) => (
                                    <div key={i} className="p-3 border rounded-md bg-muted/30">
                                        <div className="text-xs font-mono text-muted-foreground break-all mb-1">Parent ID:</div>
                                        <div className="text-sm font-mono break-all">{input.parent_id || "N/A"}</div>
                                    </div>
                                ))}
                                {(!tx.inputs || tx.inputs.length === 0) && <div className="text-muted-foreground text-sm">No inputs</div>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Outputs ({tx.outputs?.length || 0})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {tx.outputs?.map((output, i) => (
                                    <div key={i} className="p-3 border rounded-md bg-muted/30 flex justify-between items-center gap-4">
                                        <div className="overflow-hidden">
                                            <div className="text-xs font-mono text-muted-foreground mb-1">Address:</div>
                                            <div className="text-sm font-mono truncate">{output.unlock_hash || "N/A"}</div>
                                        </div>
                                        <div className="text-right whitespace-nowrap">
                                            <div className="font-bold text-primary">{output.value} SC</div>
                                        </div>
                                    </div>
                                ))}
                                {(!tx.outputs || tx.outputs.length === 0) && <div className="text-muted-foreground text-sm">No outputs</div>}
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </Layout>
    );
}
