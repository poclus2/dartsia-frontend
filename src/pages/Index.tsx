import { useState, useRef } from 'react';
import { StatusRail } from '@/components/network/StatusRail';
import { BlockchainTimeline } from '@/components/network/BlockchainTimeline';
import { TransactionFlow } from '@/components/network/TransactionFlow';
import { NetworkMetrics } from '@/components/network/NetworkMetrics';
import { BlockDetailPanel } from '@/components/network/BlockDetailPanel';
import { MobileBlockCard } from '@/components/mobile/MobileBlockCard';
import { MobileBottomSheet } from '@/components/mobile/MobileBottomSheet';
import { useMobile } from '@/hooks/useMobile';
import { Activity, Box } from 'lucide-react';
import { useBlocks, useBlockStats, useRecentTxs, useHosts, useNetworkStats } from '@/hooks/useDartsia';
import { DartsiaBlock } from '@/types/dartsia';

// Adapter helper for components expecting "Block" interface
const adaptBlock = (dBlock: DartsiaBlock) => ({
  height: dBlock.height,
  txCount: dBlock.transactions?.length || 0,
  timestamp: new Date(dBlock.timestamp),
  hash: dBlock.id,
  fees: dBlock.transactions?.reduce((acc, tx) =>
    acc + (tx.miner_fees?.reduce((feeSum, fee) => feeSum + parseFloat(fee), 0) || 0)
    , 0) || 0
});

const Index = () => {
  const { data: blocksData, isLoading: blocksLoading } = useBlocks(1, 20);
  const { data: statsData } = useBlockStats();
  const { data: txsData } = useRecentTxs(15);
  const { data: hostsData } = useHosts();
  const { data: networkStats } = useNetworkStats();

  const [selectedBlock, setSelectedBlock] = useState<any | null>(null); // Using any temporarily for mapped block
  const { isMobile } = useMobile();
  const scrollRef = useRef<HTMLDivElement>(null);

  const adaptedBlocks = blocksData?.map(adaptBlock) || [];

  // StatusRail shows TOTAL scanned hosts
  const totalScannedHosts = networkStats?.totalHosts || 0;

  // Parse usedStorage from network stats (string -> number)
  const usedStorage = networkStats ? Number(networkStats.usedStorage) : 0;

  // Mobile view
  if (isMobile) {
    const activeHostsCount = networkStats?.activeHosts || 0;
    return (
      <div className="flex flex-col">
        {/* Network Activity Section */}
        <section className="border-b border-border">
          <div className="px-3 py-2 flex items-center gap-2">
            <Activity size={12} className="text-primary" />
            <span className="text-[10px] uppercase tracking-wider text-foreground-subtle">
              Network Activity
            </span>
          </div>

          {/* Horizontal scrollable block timeline */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide px-3 pb-3"
          >
            {adaptedBlocks.map((block) => (
              <MobileBlockCard
                key={block.height}
                {...block}
                compact
                onTap={() => setSelectedBlock(block)}
              />
            ))}
          </div>
        </section>

        {/* Recent Blocks List */}
        <section>
          <div className="px-3 py-2 flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-2">
              <Box size={12} className="text-secondary" />
              <span className="text-[10px] uppercase tracking-wider text-foreground-subtle">
                Recent Blocks
              </span>
            </div>
            <span className="text-[9px] text-foreground-muted">
              Tap to view details
            </span>
          </div>

          <div className="divide-y divide-border">
            {adaptedBlocks.slice(0, 5).map((block) => (
              <MobileBlockCard
                key={block.height}
                {...block}
                onTap={() => setSelectedBlock(block)}
              />
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="p-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted/30 border border-border p-3">
              <div className="text-[9px] uppercase tracking-wider text-foreground-subtle mb-1">
                Avg Block Time
              </div>
              <div className="text-lg font-mono font-medium text-secondary">
                {statsData?.avgBlockTime || '10m'}<span className="text-xs text-foreground-muted"></span>
              </div>
            </div>
            <div className="bg-muted/30 border border-border p-3">
              <div className="text-[9px] uppercase tracking-wider text-foreground-subtle mb-1">
                Active Hosts
              </div>
              <div className="text-lg font-mono font-medium">
                {activeHostsCount}
              </div>
            </div>
          </div>
        </section>

        {/* Block Detail Bottom Sheet */}
        <MobileBottomSheet
          isOpen={!!selectedBlock}
          onClose={() => setSelectedBlock(null)}
          title={`Block #${selectedBlock?.height.toLocaleString()}`}
          height="half"
        >
          {selectedBlock && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-foreground-subtle mb-1">
                    Height
                  </div>
                  <div className="text-sm font-mono font-medium">
                    {selectedBlock.height.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-foreground-subtle mb-1">
                    Transactions
                  </div>
                  <div className="text-sm font-mono font-medium text-secondary">
                    {selectedBlock.txCount}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-foreground-subtle mb-1">
                    Fees
                  </div>
                  <div className="text-sm font-mono font-medium">
                    {selectedBlock.fees.toFixed(4)} SC
                  </div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-foreground-subtle mb-1">
                    Time
                  </div>
                  <div className="text-sm font-mono">
                    {selectedBlock.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[9px] uppercase tracking-wider text-foreground-subtle mb-1">
                  Block Hash
                </div>
                <div className="text-xs font-mono break-all text-foreground-muted">
                  {selectedBlock.hash}
                </div>
              </div>
            </div>
          )}
        </MobileBottomSheet>
      </div>
    );
  }

  // Desktop view
  return (
    <div className="min-h-screen flex flex-col">
      <StatusRail
        blockHeight={adaptedBlocks[0]?.height}
        blockHash={adaptedBlocks[0]?.hash}
        txCount24h={txsData?.length || 0}
        activeHosts={totalScannedHosts}
        usedStorage={usedStorage}
      />
      <div className="flex-1 p-6">
        <div className="mb-6">
          <NetworkMetrics />
        </div>
        <div className="grid grid-cols-5 gap-6 mb-6">
          <div className="col-span-3 bg-background-elevated/30 border border-border p-4">
            <BlockchainTimeline
              blocks={adaptedBlocks}
              onBlockSelect={setSelectedBlock}
              selectedBlockHeight={selectedBlock?.height}
            />
            {selectedBlock && (
              <div className="mt-4 border-t border-border-subtle pt-4">
                <BlockDetailPanel
                  block={selectedBlock}
                  onClose={() => setSelectedBlock(null)}
                />
              </div>
            )}
          </div>
          <div className="col-span-2 bg-background-elevated/30 border border-border p-4">
            <TransactionFlow transactions={txsData || []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
