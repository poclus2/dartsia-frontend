import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Block {
  height: number;
  txCount: number;
  timestamp: Date;
  hash: string;
}

const generateMockBlocks = (count: number, startHeight: number): Block[] => {
  return Array.from({ length: count }, (_, i) => ({
    height: startHeight - i,
    txCount: Math.floor(Math.random() * 50) + 5,
    timestamp: new Date(Date.now() - i * 600000),
    hash: `000000000000000000${Math.random().toString(16).slice(2, 18)}`,
  }));
};

export const BlockchainTimeline = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [hoveredBlock, setHoveredBlock] = useState<number | null>(null);

  useEffect(() => {
    setBlocks(generateMockBlocks(20, 489271));
  }, []);

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Block Timeline
        </h2>
        <span className="text-xs text-foreground-muted font-mono">
          Showing last 20 blocks
        </span>
      </div>

      {/* Timeline visualization */}
      <div className="relative">
        {/* Connection line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-border-subtle" />
        
        {/* Blocks */}
        <div className="relative flex items-center gap-1 overflow-x-auto pb-4 scrollbar-thin">
          {blocks.map((block, index) => {
            const isHovered = hoveredBlock === block.height;
            const density = Math.min(block.txCount / 50, 1);
            
            return (
              <div
                key={block.height}
                className="flex flex-col items-center group cursor-pointer"
                onMouseEnter={() => setHoveredBlock(block.height)}
                onMouseLeave={() => setHoveredBlock(null)}
              >
                {/* Block node */}
                <div
                  className={cn(
                    'w-8 h-8 border transition-all duration-200 flex items-center justify-center',
                    isHovered
                      ? 'border-secondary bg-secondary/20 scale-110'
                      : 'border-border bg-background-surface hover:border-foreground-muted'
                  )}
                  style={{
                    opacity: 0.5 + density * 0.5,
                  }}
                >
                  <div 
                    className={cn(
                      'w-2 h-2 transition-colors',
                      isHovered ? 'bg-secondary' : 'bg-foreground-subtle'
                    )}
                  />
                </div>

                {/* Connector to next block */}
                {index < blocks.length - 1 && (
                  <div className="absolute top-1/2 left-full w-1 h-px bg-border-subtle" />
                )}

                {/* Height label */}
                <span className={cn(
                  'mt-2 font-mono text-[10px] transition-colors',
                  isHovered ? 'text-secondary' : 'text-foreground-subtle'
                )}>
                  {block.height}
                </span>

                {/* Hover tooltip */}
                {isHovered && (
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-popover border border-border p-3 z-10 min-w-[180px] animate-fade-in">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-foreground-muted">Height</span>
                        <span className="font-mono text-secondary">{block.height}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-foreground-muted">Transactions</span>
                        <span className="font-mono">{block.txCount}</span>
                      </div>
                      <div className="text-[10px] font-mono text-foreground-subtle truncate">
                        {block.hash}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Density legend */}
        <div className="flex items-center gap-2 mt-4 text-[10px] text-foreground-subtle">
          <span>TX Density:</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 border border-border bg-background-surface opacity-50" />
            <span>Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 border border-border bg-background-surface" />
            <span>High</span>
          </div>
        </div>
      </div>
    </div>
  );
};
