import { useState } from 'react';
import { StatusRail } from '@/components/network/StatusRail';
import { BlockchainTimeline } from '@/components/network/BlockchainTimeline';
import { TransactionFlow } from '@/components/network/TransactionFlow';
import { NetworkMetrics } from '@/components/network/NetworkMetrics';
import { BlockDetailPanel } from '@/components/network/BlockDetailPanel';

interface Block {
  height: number;
  txCount: number;
  timestamp: Date;
  hash: string;
  fees: number;
}

const Index = () => {
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Status Rail */}
      <StatusRail />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Core Data Field - Asymmetric Split */}
        <div className="grid grid-cols-5 gap-6 mb-6">
          {/* Left - Blockchain Timeline (3 cols) */}
          <div className="col-span-3 bg-background-elevated/30 border border-border p-4">
            <BlockchainTimeline 
              onBlockSelect={setSelectedBlock}
              selectedBlockHeight={selectedBlock?.height}
            />
            
            {/* Block Detail Panel - appears when block is selected */}
            {selectedBlock && (
              <div className="mt-4 border-t border-border-subtle pt-4">
                <BlockDetailPanel 
                  block={selectedBlock}
                  onClose={() => setSelectedBlock(null)}
                />
              </div>
            )}
          </div>

          {/* Right - Transaction Flow (2 cols) */}
          <div className="col-span-2 bg-background-elevated/30 border border-border p-4">
            <TransactionFlow />
          </div>
        </div>

        {/* Bottom Intelligence Layer */}
        <NetworkMetrics />
      </div>
    </div>
  );
};

export default Index;
