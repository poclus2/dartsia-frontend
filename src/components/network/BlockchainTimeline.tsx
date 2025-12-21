import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { SearchInput } from '@/components/search/SearchInput';

interface Block {
  height: number;
  txCount: number;
  timestamp: Date;
  hash: string;
  fees: number;
}

const generateMockBlocks = (count: number, startHeight: number): Block[] => {
  return Array.from({ length: count }, (_, i) => ({
    height: startHeight - i,
    txCount: Math.floor(Math.random() * 50) + 5,
    timestamp: new Date(Date.now() - i * 600000),
    hash: `000000000000000000${Math.random().toString(16).slice(2, 18)}`,
    fees: Math.random() * 5,
  }));
};

const formatTimeAgo = (date: Date) => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h`;
};

interface BlockchainTimelineProps {
  onBlockSelect?: (block: Block) => void;
  selectedBlockHeight?: number | null;
}

export const BlockchainTimeline = ({ onBlockSelect, selectedBlockHeight }: BlockchainTimelineProps) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [hoveredBlock, setHoveredBlock] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedBlock, setHighlightedBlock] = useState<number | null>(null);
  const blockRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    setBlocks(generateMockBlocks(20, 489271));
  }, []);

  // Handle search
  useEffect(() => {
    if (searchQuery) {
      const height = parseInt(searchQuery);
      if (!isNaN(height)) {
        const block = blocks.find(b => b.height === height);
        if (block) {
          setHighlightedBlock(height);
          const element = blockRefs.current.get(height);
          element?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        } else {
          setHighlightedBlock(null);
        }
      } else {
        // Search by hash prefix
        const block = blocks.find(b => b.hash.toLowerCase().includes(searchQuery.toLowerCase()));
        if (block) {
          setHighlightedBlock(block.height);
          const element = blockRefs.current.get(block.height);
          element?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        } else {
          setHighlightedBlock(null);
        }
      }
    } else {
      setHighlightedBlock(null);
    }
  }, [searchQuery, blocks]);

  return (
    <div className="flex-1">
      {/* Header with Search */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Block Timeline
        </h2>
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Height (234567) or hash..."
          className="w-64"
        />
      </div>

      {/* Timeline visualization */}
      <div className="relative">
        {/* Connection line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-border-subtle" />
        
        {/* Blocks */}
        <div className="relative flex items-center gap-1 overflow-x-auto pb-4 scrollbar-thin">
          {blocks.map((block, index) => {
            const isHovered = hoveredBlock === block.height;
            const isHighlighted = highlightedBlock === block.height;
            const isSelected = selectedBlockHeight === block.height;
            const density = Math.min(block.txCount / 50, 1);
            
            return (
              <div
                key={block.height}
                ref={(el) => {
                  if (el) blockRefs.current.set(block.height, el);
                }}
                className="flex flex-col items-center group cursor-pointer"
                onMouseEnter={() => setHoveredBlock(block.height)}
                onMouseLeave={() => setHoveredBlock(null)}
                onClick={() => onBlockSelect?.(block)}
              >
                {/* Block node */}
                <div
                  className={cn(
                    'w-8 h-8 border transition-all duration-200 flex items-center justify-center',
                    isSelected
                      ? 'border-primary bg-primary/20 scale-110'
                      : isHighlighted
                      ? 'border-secondary bg-secondary/30 scale-110 ring-2 ring-secondary/50'
                      : isHovered
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
                      isSelected ? 'bg-primary' :
                      isHighlighted ? 'bg-secondary' :
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
                  isSelected ? 'text-primary' :
                  isHighlighted ? 'text-secondary font-semibold' :
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

      {/* Block Preview Grid - NEW */}
      <div className="mt-6 border-t border-border-subtle pt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
            Recent Blocks
          </h3>
          <span className="text-[10px] text-foreground-subtle font-mono">Click to inspect</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {blocks.slice(0, 10).map((block) => (
            <div
              key={block.height}
              className={cn(
                'block-preview',
                selectedBlockHeight === block.height && 'active'
              )}
              onClick={() => onBlockSelect?.(block)}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs text-secondary">#{block.height}</span>
                <span className="text-[10px] text-foreground-subtle">{formatTimeAgo(block.timestamp)}</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-foreground-muted">{block.txCount} txs</span>
                <span className="font-mono text-foreground-subtle">{block.fees.toFixed(2)} SC</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
