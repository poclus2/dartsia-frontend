<<<<<<< HEAD
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTransaction } from '@/hooks/useDartsia';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Layers, ArrowRightLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { FourSquaresLoader } from '@/components/ui/loaders/FourSquaresLoader';

const getTxType = (tx: any): string => {
    if (tx.type) return tx.type.replace(/_/g, ' '); // If explicitly provided
    if (tx.fileContractResolutions?.length) return 'Contract Resolution';
    if (tx.fileContractRevisions?.length) return 'Contract Revision';
    if (tx.fileContracts?.length) return 'Contract Formation';
    if (tx.storageProofs?.length) return 'Storage Proof';
    if (tx.hostAnnouncements?.length) return 'Host Announcement';
    return 'Transfer';
};

const TransactionDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { data: tx, isLoading, error } = useTransaction(id || '');
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <FourSquaresLoader />
            </div>
=======
import React from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useTransaction } from "@/hooks/useTransaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRightLeft, Clock, Box } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TransactionDetailPage() {
    const { hash } = useParams<{ hash: string }>();
    // Use a fallback empty string to prevent query disable if hash is undefined initially (though router prevents this mostly)
    const { data: tx, isLoading, error } = useTransaction(hash || "");

    if (isLoading) {
        return (
            <Layout>
                <div className="text-center py-20">Loading transaction details...</div>
            </Layout>
>>>>>>> dd59b3813fb7697c36a309d5be73d24968d14e15
        );
    }

    if (error || !tx) {
        return (
<<<<<<< HEAD
            <div className="p-6 min-h-screen flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                    <ArrowRightLeft size={32} className="text-red-500" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Transaction Not Found</h2>
                <p className="text-foreground-muted mb-6">
                    The transaction {id} could not be found or retrieved.
                </p>
                <button
                    onClick={() => navigate('/txs')}
                    className="px-4 py-2 bg-primary text-background rounded-md hover:bg-primary/90 transition-colors"
                >
                    Return to Transactions
                </button>
            </div>
        );
    }

    const txType = getTxType(tx);
    // Handle both string minerFee (detail) and array miner_fees (summary fallback)
    const fee = tx.minerFee ? parseFloat(tx.minerFee) : (tx.miner_fees?.reduce((sum: number, f: string) => sum + parseFloat(f), 0) || 0);

    // Handle camelCase outputs vs snake_case
    const outputs = tx.siacoinOutputs || tx.siacoin_outputs || [];
    const inputs = tx.siacoinInputs || tx.siacoin_inputs || [];

    const totalOutput = outputs.reduce((sum: number, out: any) => {
        // Detailed API uses nested siacoinOutput object
        const val = out.siacoinOutput ? out.siacoinOutput.value : out.value;
        return sum + parseFloat(val);
    }, 0);

    return (
        <div className="min-h-screen p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link to="/txs" className="p-2 hover:bg-background-elevated/50 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-foreground-muted" />
                </Link>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-semibold font-mono">Transaction Details</h1>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">
                            Confirmed
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground-muted font-mono text-sm mt-1">
                        <span className="text-foreground-subtle">ID:</span>
                        <span className="text-foreground select-all">{tx.id}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <Card className="lg:col-span-2 bg-background-elevated/30 border-border">
                    <CardHeader className="border-b border-border-subtle">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Layers size={18} className="text-primary" />
                            General Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border-subtle">
                            <div className="p-4 grid grid-cols-3 hover:bg-background-surface/30 transition-colors">
                                <div className="text-sm text-foreground-muted">Block Height</div>
                                <div className="col-span-2 font-mono text-secondary">
                                    {tx.height ? (
                                        <Link to={`/blocks?search=${tx.height}`} className="hover:underline">
                                            #{tx.height.toLocaleString()}
                                        </Link>
                                    ) : 'Pending'}
                                </div>
                            </div>
                            <div className="p-4 grid grid-cols-3 hover:bg-background-surface/30 transition-colors">
                                <div className="text-sm text-foreground-muted">Transaction Type</div>
                                <div className="col-span-2 font-mono capitalize text-foreground">
                                    {txType}
                                </div>
                            </div>
                            <div className="p-4 grid grid-cols-3 hover:bg-background-surface/30 transition-colors">
                                <div className="text-sm text-foreground-muted">Timestamp</div>
                                <div className="col-span-2 font-mono">
                                    {tx.timestamp ? new Date(tx.timestamp).toLocaleString() : 'N/A'}
                                </div>
                            </div>
                            <div className="p-4 grid grid-cols-3 hover:bg-background-surface/30 transition-colors">
                                <div className="text-sm text-foreground-muted">Total Output</div>
                                <div className="col-span-2 font-mono text-lg font-semibold">
                                    {totalOutput.toLocaleString()} <span className="text-sm text-foreground-muted font-normal">SC</span>
                                </div>
                            </div>
                            <div className="p-4 grid grid-cols-3 hover:bg-background-surface/30 transition-colors">
                                <div className="text-sm text-foreground-muted">Miner Fee</div>
                                <div className="col-span-2 font-mono">
                                    {fee.toFixed(4)} <span className="text-sm text-foreground-muted">SC</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Inputs / Outputs Summary */}
                <div className="space-y-6">
                    {/* Inputs */}
                    <Card className="bg-background-elevated/30 border-border h-fit">
                        <CardHeader className="py-3 border-b border-border-subtle">
                            <CardTitle className="text-sm font-medium text-foreground-muted uppercase tracking-wider">
                                Io Source (Inputs)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 max-h-[300px] overflow-y-auto custom-scrollbar">
                            {inputs.length ? (
                                inputs.map((input: any, i: number) => {
                                    // Detail API: input.parent.siacoinOutput.address
                                    // Summary API: input.parent_id (no address)
                                    const address = input.parent?.siacoinOutput?.address || input.address || 'Unknown';
                                    const value = input.parent?.siacoinOutput?.value;
                                    const parentId = input.parent?.id || input.parent_id;

                                    return (
                                        <div key={i} className="p-3 border-b border-border-subtle last:border-0 font-mono text-xs">
                                            <div className="flex justify-between items-start mb-1">
                                                {value && (
                                                    <div className="font-mono text-xs text-secondary font-medium">
                                                        {parseFloat(value).toLocaleString()} SC
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-foreground-subtle break-all" title={address}>
                                                {address}
                                            </div>
                                            <div className="text-[10px] text-foreground-muted mt-1 truncate" title={parentId}>
                                                ID: ...{parentId?.slice(-16)}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-4 text-xs text-foreground-muted italic">No siacoin inputs</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Outputs */}
                    <Card className="bg-background-elevated/30 border-border h-fit">
                        <CardHeader className="py-3 border-b border-border-subtle">
                            <CardTitle className="text-sm font-medium text-foreground-muted uppercase tracking-wider">
                                Io Destinations (Outputs)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 max-h-[300px] overflow-y-auto custom-scrollbar">
                            {outputs.map((output: any, i: number) => {
                                // Detail API: output.siacoinOutput.value
                                // Summary API: output.value
                                const val = output.siacoinOutput ? output.siacoinOutput.value : output.value;
                                const addr = output.siacoinOutput ? output.siacoinOutput.address : output.address;

                                return (
                                    <div key={i} className="p-3 border-b border-border-subtle last:border-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="font-mono text-xs text-secondary font-medium">
                                                {parseFloat(val).toLocaleString()} SC
                                            </div>
                                        </div>
                                        <div className="font-mono text-[10px] text-foreground-subtle break-all">
                                            {addr}
                                        </div>
                                    </div>
                                );
                            })}
                            {!outputs.length && (
                                <div className="p-4 text-xs text-foreground-muted italic">No siacoin outputs</div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetailPage;
=======
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
                    <div className="overflow-hidden">
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
                            <div className="text-2xl font-bold">#{tx.height?.toLocaleString() || "Pending"}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Timestamp</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-bold">
                                {tx.timestamp ? new Date(tx.timestamp).toLocaleString() : "N/A"}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Size</CardTitle>
                            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {tx.size ? (tx.size / 1024).toFixed(2) : "0"} KB
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Inputs ({tx.siacoin_inputs?.length || 0})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                {tx.siacoin_inputs?.map((input: import("@/types/api").SiacoinInput, i: number) => (
                                    <div key={i} className="p-3 border rounded-md bg-muted/30">
                                        <div className="text-xs font-mono text-muted-foreground break-all mb-1">Parent ID:</div>
                                        <div className="text-sm font-mono break-all">{input.parent_id || "N/A"}</div>
                                    </div>
                                ))}
                                {(!tx.siacoin_inputs || tx.siacoin_inputs.length === 0) && (
                                    <div className="text-muted-foreground text-sm">No siacoin inputs</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Outputs ({tx.siacoin_outputs?.length || 0})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                {tx.siacoin_outputs?.map((output: import("@/types/api").SiacoinOutput, i: number) => (
                                    <div key={i} className="p-3 border rounded-md bg-muted/30 flex flex-col gap-2">
                                        <div className="overflow-hidden">
                                            <div className="text-xs font-mono text-muted-foreground mb-1">Address:</div>
                                            <div className="text-sm font-mono break-all">{output.unlock_hash || "N/A"}</div>
                                        </div>
                                        <div className="self-end">
                                            <div className="font-bold text-primary">{output.value} SC</div>
                                        </div>
                                    </div>
                                ))}
                                {(!tx.siacoin_outputs || tx.siacoin_outputs.length === 0) && (
                                    <div className="text-muted-foreground text-sm">No siacoin outputs</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </Layout>
    );
}
>>>>>>> dd59b3813fb7697c36a309d5be73d24968d14e15
