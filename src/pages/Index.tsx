import { StatusRail } from '@/components/network/StatusRail';
import { BlockchainTimeline } from '@/components/network/BlockchainTimeline';
import { TransactionFlow } from '@/components/network/TransactionFlow';
import { NetworkMetrics } from '@/components/network/NetworkMetrics';

const Index = () => {
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
            <BlockchainTimeline />
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
