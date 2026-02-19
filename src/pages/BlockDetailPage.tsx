import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { dartsiaAPI } from '@/api/dartsia';
import { FourSquaresLoader } from '@/components/ui/loaders/FourSquaresLoader';
import { Layers, ArrowLeft, Hash, Clock, Database, HardDrive, Cpu, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MobileBlockCard } from '@/components/mobile/MobileBlockCard';

const BlockDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: block, isLoading, error } = useQuery({
        queryKey: ['block', id],
        queryFn: () => dartsiaAPI.getBlockById(id || ''),
        enabled: !!id,
        retry: 1
    });

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-background">
                <FourSquaresLoader />
            </div>
        );
    }

    if (error || !block) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-center p-6">
                <AlertCircle size={48} className="text-primary mb-4" />
                <h1 className="text-2xl font-bold mb-2">Block Not Found</h1>
                <p className="text-foreground-muted mb-6">
                    We couldn't find a block with identifier "{id}".
                </p>
                <button
                    onClick={() => navigate('/blocks')}
                    className="px-6 py-2 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-lg transition-colors"
                >
                    Back to Blocks
                </button>
            </div>
        );
    }

    // Helper to format size
    const formatSize = (bytes: number) => {
        if (!bytes) return '0 B';
        const k = 1000; // or 1024
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Calculate fees if not explicitly provided
    const totalFees = block.fees || (block.transactions?.reduce((acc, tx) =>
        acc + (tx.miner_fees?.reduce((sum, fee) => sum + parseFloat(fee) / 1e24, 0) || 0)
        , 0) || 0);

    const txCount = block.transactionsCount || block.transactions?.length || 0;

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-background-elevated/95 backdrop-blur-xl border-b border-border px-4 md:px-6 h-16 flex items-center gap-4">
                <button
                    onClick={() => navigate('/blocks')}
                    className="p-2 -ml-2 hover:bg-muted/50 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} className="text-foreground-muted" />
                </button>
                <div className="flex items-center gap-3">
                    <Layers size={20} className="text-secondary" />
                    <h1 className="text-lg font-semibold font-mono">
                        Block #{block.height.toLocaleString()}
                    </h1>
                </div>
            </div>

            <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="metric-card bg-background-elevated border border-border p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock size={16} className="text-foreground-muted" />
                            <span className="text-xs uppercase tracking-wider text-foreground-subtle">Timestamp</span>
                        </div>
                        <div className="font-mono text-sm md:text-base">
                            {new Date(block.timestamp).toLocaleString()}
                        </div>
                    </div>

                    <div className="metric-card bg-background-elevated border border-border p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                            <Database size={16} className="text-secondary" />
                            <span className="text-xs uppercase tracking-wider text-foreground-subtle">Transactions</span>
                        </div>
                        <div className="font-mono text-lg md:text-xl text-secondary font-semibold">
                            {txCount}
                        </div>
                    </div>

                    <div className="metric-card bg-background-elevated border border-border p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                            <HardDrive size={16} className="text-foreground-muted" />
                            <span className="text-xs uppercase tracking-wider text-foreground-subtle">Size</span>
                        </div>
                        <div className="font-mono text-sm md:text-base">
                            {formatSize(block.size || 0)}
                        </div>
                    </div>

                    <div className="metric-card bg-background-elevated border border-border p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                            <Cpu size={16} className="text-primary" />
                            <span className="text-xs uppercase tracking-wider text-foreground-subtle">Total Fees</span>
                        </div>
                        <div className="font-mono text-sm md:text-base text-primary">
                            {totalFees.toFixed(4)} SC
                        </div>
                    </div>
                </div>

                {/* Main Details */}
                <div className="bg-background-elevated border border-border rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-border bg-muted/20">
                        <h2 className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                            <Hash size={14} />
                            Block Information
                        </h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between py-2 border-b border-border-subtle">
                            <span className="text-sm text-foreground-muted w-32 shrink-0">Hash</span>
                            <span className="font-mono text-xs md:text-sm break-all text-secondary selection:bg-secondary/20">
                                {block.id}
                            </span>
                        </div>
                        <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between py-2 border-b border-border-subtle">
                            <span className="text-sm text-foreground-muted w-32 shrink-0">Parent Hash</span>
                            <span className="font-mono text-xs md:text-sm break-all text-foreground-subtle">
                                {block.parent_id || 'Genesis'}
                            </span>
                        </div>
                        <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between py-2 border-b border-border-subtle">
                            <span className="text-sm text-foreground-muted w-32 shrink-0">Miner Payout Address</span>
                            <div className="flex flex-col items-end gap-1">
                                {block.miner_payouts?.map((payout, i) => (
                                    <span key={i} className="font-mono text-xs md:text-sm break-all text-foreground-subtle text-right">
                                        {payout.siacoin_output?.address}
                                    </span>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>

                {/* Transactions List */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2 px-1">
                        Transactions
                        <span className="text-xs font-normal text-foreground-muted bg-muted px-2 py-0.5 rounded-full">
                            {txCount}
                        </span>
                    </h2>

                    <div className="space-y-3">
                        {block.transactions?.map((tx, idx) => (
                            <div
                                key={tx.id || idx}
                                onClick={() => navigate(`/tx/${tx.id}`)}
                                className="bg-background-elevated border border-border p-4 rounded-xl hover:border-secondary/50 cursor-pointer transition-all hover:bg-muted/30 group"
                            >
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="space-y-2 overflow-hidden">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-mono text-foreground-subtle bg-muted px-2 py-0.5 rounded">
                                                #{idx + 1}
                                            </span>
                                            {tx.type && (
                                                <span className="text-[10px] uppercase tracking-wider text-secondary bg-secondary/10 px-2 py-0.5 rounded">
                                                    {tx.type}
                                                </span>
                                            )}
                                        </div>
                                        <div className="font-mono text-xs md:text-sm text-foreground-muted truncate group-hover:text-primary transition-colors">
                                            {tx.id}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 shrink-0">
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] uppercase text-foreground-subtle">Outputs</span>
                                            <span className="font-mono text-sm">
                                                {tx.siacoin_outputs?.length || 0}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] uppercase text-foreground-subtle">Value</span>
                                            <span className="font-mono text-sm text-secondary">
                                                {(tx.siacoin_outputs?.reduce((sum, out) => sum + parseFloat(out.value || '0'), 0) / 1e24).toFixed(2)} SC
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {(!block.transactions || block.transactions.length === 0) && (
                            <div className="text-center py-12 text-foreground-muted bg-background-elevated border border-border border-dashed rounded-xl">
                                No transactions in this block
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BlockDetailPage;
