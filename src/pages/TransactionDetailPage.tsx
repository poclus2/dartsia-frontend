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
        );
    }

    if (error || !tx) {
        return (
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
