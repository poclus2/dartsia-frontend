<<<<<<< HEAD
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ArrowRight, Clock, Hash, Layers, ChevronDown } from 'lucide-react';
import { SearchInput } from '@/components/search/SearchInput';
import { MobileBlockCard } from '@/components/mobile/MobileBlockCard';
import { MobileBottomSheet } from '@/components/mobile/MobileBottomSheet';
import { useMobile } from '@/hooks/useMobile';
import { useBlocks } from '@/hooks/useDartsia';
import { dartsiaAPI } from '@/api/dartsia';
import { DartsiaBlock } from '@/types/dartsia';
import { FourSquaresLoader } from '@/components/ui/loaders/FourSquaresLoader';
import { useQuery } from '@tanstack/react-query';

// Helper to map DartsiaBlock to UI format
const mapBlock = (b: DartsiaBlock) => ({
  height: b.height,
  hash: b.id,
  txCount: b.transactionsCount || b.transactions?.length || 0,
  fees: b.fees || (b.transactions?.reduce((acc, tx) =>
    acc + (tx.miner_fees?.reduce((sum, fee) => sum + parseFloat(fee) / 1e24, 0) || 0)
    , 0) || 0),
  timestamp: new Date(b.timestamp),
  size: 0, // Not available in current API
  miner: b.miner_payouts?.[0]?.siacoin_output?.address || 'Unknown'
});

const BlocksPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data: blocksData, isLoading } = useBlocks(page, 50);
  const [blocks, setBlocks] = useState<ReturnType<typeof mapBlock>[]>([]);

  const [selectedBlock, setSelectedBlock] = useState<ReturnType<typeof mapBlock> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedHeight, setHighlightedHeight] = useState<number | null>(null);
  const blockRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const { isMobile } = useMobile();

  // Fetch detailed block data when selected
  const { data: detailedBlock } = useQuery({
    queryKey: ['block-detail', selectedBlock?.height],
    queryFn: () => selectedBlock ? dartsiaAPI.getBlockById(String(selectedBlock.height)) : null,
    enabled: !!selectedBlock,
  });

  // Update blocks when data loads
  useEffect(() => {
    if (blocksData) {
      setBlocks(blocksData.map(mapBlock));
    }
  }, [blocksData]);

  // Handle search via API
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery) {
        setHighlightedHeight(null);
        if (blocksData) setBlocks(blocksData.map(mapBlock));
        return;
      }

      try {
        const results = await dartsiaAPI.searchBlock(searchQuery);
        if (results && results.length > 0) {
          // If search returns specific blocks, verify if they are in current list or replace list
          // For simplicity, we filter current view or fetch specific if not found?
          // Actually search API returns list matching query.
          // Let's replace the list with search results for now, or just highlight.

          // Strategy: Update main list to show results
          setBlocks(results.map(mapBlock));

          // Also highlight if exact match found
          const height = parseInt(searchQuery);
          if (!isNaN(height)) {
            setHighlightedHeight(height);
            // Scroll if possible...
          }
        }
      } catch (e) {
        console.error("Search failed", e);
      }
    };

    const debounce = setTimeout(performSearch, 500);
    return () => clearTimeout(debounce);
  }, [searchQuery, blocksData]);

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  // Mobile View
  if (isMobile) {
    return (
      <div className="flex flex-col">
        {/* Mobile Block List */}
        <div className="divide-y divide-border">
          {blocks.map((block) => (
            <MobileBlockCard
              key={block.height}
              height={block.height}
              txCount={block.txCount}
              timestamp={block.timestamp}
              fees={block.fees}
              hash={block.hash}
              onTap={() => setSelectedBlock(block)}
            />
          ))}
        </div>

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
                <div className="bg-muted/30 p-3">
                  <div className="text-[9px] uppercase tracking-wider text-foreground-subtle mb-1">
                    <Hash size={10} className="inline mr-1" />Height
                  </div>
                  <div className="text-sm font-mono font-medium text-secondary">
                    #{selectedBlock.height.toLocaleString()}
                  </div>
                </div>
                <div className="bg-muted/30 p-3">
                  <div className="text-[9px] uppercase tracking-wider text-foreground-subtle mb-1">
                    <Clock size={10} className="inline mr-1" />Time
                  </div>
                  <div className="text-sm font-mono">
                    {formatTimeAgo(selectedBlock.timestamp)}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm py-2 border-b border-border-subtle">
                  <span className="text-foreground-muted">Transactions</span>
                  <span className="font-mono text-secondary">{selectedBlock.txCount}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-border-subtle">
                  <span className="text-foreground-muted">Total Fees</span>
                  <span className="font-mono">{selectedBlock.fees.toFixed(6)} SC</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-border-subtle">
                  <span className="text-foreground-muted">Size</span>
                  <span className="font-mono">{(selectedBlock.size / 1000).toFixed(1)} KB</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-border-subtle">
                  <span className="text-foreground-muted">Miner</span>
                  <span className="font-mono text-foreground-subtle">{selectedBlock.miner}</span>
                </div>
              </div>

              <div>
                <div className="text-[9px] uppercase tracking-wider text-foreground-subtle mb-1">
                  Block Hash
                </div>
                <div className="text-xs font-mono break-all text-foreground-muted bg-muted/30 p-2">
                  {selectedBlock.hash}
                </div>
              </div>
            </div>
          )}
        </MobileBottomSheet>
      </div>
    );
  }

  // Desktop View
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="h-16 border-b border-border bg-background-elevated/50 backdrop-blur-sm px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Layers size={20} className="text-secondary" />
          <h1 className="text-lg font-semibold">Block Chain</h1>
        </div>
        <div className="flex items-center gap-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Block height (234567) or hash..."
            className="w-72"
          />
          <div className="flex items-center gap-2 text-foreground-subtle">
            <span className="text-xs font-mono">Latest:</span>
            <span className="text-sm font-mono text-secondary">{blocks[0]?.height.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Block Chain - Vertical */}
        <div className="flex-1 p-6">
          <div className="space-y-0">
            {blocks.map((block, index) => {
              const isHighlighted = highlightedHeight === block.height;

              return (
                <div
                  key={block.height}
                  className="relative"
                  ref={(el) => {
                    if (el) blockRefs.current.set(block.height, el);
                  }}
                >
                  {index > 0 && (
                    <div className="absolute left-4 -top-4 w-px h-4 bg-border" />
                  )}

                  <div
                    className={cn(
                      'block-node group cursor-pointer',
                      selectedBlock?.height === block.height && 'border-primary glow-primary',
                      isHighlighted && !selectedBlock && 'border-secondary ring-2 ring-secondary/30 bg-secondary/10'
                    )}
                    onClick={() => setSelectedBlock(block)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          'w-8 h-8 flex items-center justify-center border',
                          selectedBlock?.height === block.height
                            ? 'border-primary bg-primary/10'
                            : isHighlighted
                              ? 'border-secondary bg-secondary/20'
                              : 'border-border bg-background'
                        )}>
                          <span className="text-xs font-mono text-secondary">
                            {(index + 1).toString().padStart(2, '0')}
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="font-mono text-sm text-foreground">
                            #{block.height.toLocaleString()}
                          </span>
                          <span className="font-mono text-[10px] text-foreground-subtle truncate max-w-[300px]">
                            {block.hash}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-foreground-muted">Transactions</span>
                          <span className="font-mono text-sm text-secondary">{block.txCount}</span>
                        </div>

                        <div className="flex flex-col items-end">
                          <span className="text-xs text-foreground-muted">Fees</span>
                          <span className="font-mono text-sm">{block.fees.toFixed(4)} SC</span>
                        </div>

                        <div className="flex flex-col items-end">
                          <span className="text-xs text-foreground-muted">Time</span>
                          <span className="font-mono text-xs text-foreground-subtle">
                            {formatTimeAgo(block.timestamp)}
                          </span>
                        </div>

                        <ArrowRight
                          size={16}
                          className={cn(
                            'text-foreground-subtle transition-all',
                            'group-hover:text-primary group-hover:translate-x-1'
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {blocks.length === 0 && (
            <FourSquaresLoader />
          )}
        </div>

        {/* Detail Panel */}
        <div
          className={cn(
            'w-[400px] border-l border-border bg-background-elevated/80 backdrop-blur-xl',
            'transition-all duration-300 overflow-hidden',
            selectedBlock ? 'translate-x-0' : 'translate-x-full w-0'
          )}
        >
          {selectedBlock && (
            <div className="p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Block Intelligence</h2>
                <button
                  onClick={() => setSelectedBlock(null)}
                  className="text-foreground-muted hover:text-foreground transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="metric-card">
                  <div className="flex items-center gap-2 mb-2">
                    <Hash size={14} className="text-secondary" />
                    <span className="text-[10px] uppercase tracking-wider text-foreground-subtle">
                      Block Height
                    </span>
                  </div>
                  <span className="font-mono text-xl text-secondary">
                    #{selectedBlock.height.toLocaleString()}
                  </span>
                </div>

                <div className="metric-card">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={14} className="text-foreground-muted" />
                    <span className="text-[10px] uppercase tracking-wider text-foreground-subtle">
                      Timestamp
                    </span>
                  </div>
                  <span className="font-mono text-sm">
                    {selectedBlock.timestamp.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground-muted">Hash</span>
                    <span className="font-mono text-xs text-foreground-subtle truncate max-w-[200px]">
                      {selectedBlock.hash}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground-muted">Transactions</span>
                    <span className="font-mono text-secondary">{selectedBlock.txCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground-muted">Total Fees</span>
                    <span className="font-mono">{selectedBlock.fees.toFixed(6)} SC</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground-muted">Size</span>
                    <span className="font-mono">{(selectedBlock.size / 1000).toFixed(1)} KB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground-muted">Miner</span>
                    <span className="font-mono text-foreground-subtle truncate max-w-[180px]">{selectedBlock.miner}</span>
                  </div>
                </div>

                {/* Transaction List */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Hash size={14} className="text-secondary" />
                    Transactions ({selectedBlock.txCount})
                  </h3>
                  <div className="space-y-2">
                    {detailedBlock?.transactions?.map((tx, idx) => (
                      <div
                        key={tx.id || idx}
                        className="border border-border bg-background/50 p-3 rounded text-xs cursor-pointer hover:border-secondary hover:bg-secondary/5 transition-all"
                        onClick={() => navigate(`/tx/${tx.id}`)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-mono text-foreground-subtle">TX #{idx + 1}</span>
                          {tx.type && (
                            <span className="px-2 py-0.5 bg-secondary/10 text-secondary rounded text-[10px] uppercase">
                              {tx.type}
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-[10px] text-foreground-muted break-all mb-2">
                          {tx.id}
                        </div>
                        {tx.siacoin_outputs && tx.siacoin_outputs.length > 0 && (
                          <div className="text-[10px] text-foreground-subtle">
                            {tx.siacoin_outputs.length} output(s) • {
                              (tx.siacoin_outputs.reduce((sum, out) => sum + parseFloat(out.value || '0'), 0) / 1e24).toFixed(4)
                            } SC
                          </div>
                        )}
                        {tx.miner_fees && tx.miner_fees.length > 0 && (
                          <div className="text-[10px] text-amber-500">
                            Fee: {(parseFloat(tx.miner_fees[0]) / 1e24).toFixed(6)} SC
                          </div>
                        )}
                      </div>
                    )) || (
                        <div className="text-xs text-foreground-muted text-center py-4">
                          No transactions available
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlocksPage;
=======
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { BlockList } from "@/components/blocks/BlockList";
import { useBlocks } from "@/hooks/useBlocks";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BlockStatsDisplay from "@/components/network/BlockStats";

export default function BlocksPage() {
    const [offset, setOffset] = useState(0);
    const limit = 20;
    const { data: blocks, isLoading } = useBlocks({ limit, offset });

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
                    <h1 className="text-3xl font-bold tracking-tight">Blocks</h1>
                    <p className="text-muted-foreground">
                        Explore the latest blocks mined on the Sia network
                    </p>
                </div>

                {/* Integrated BlockStats at the top of the Blocks page as requested previously */}
                <div className="mb-6">
                    <BlockStatsDisplay />
                </div>

                <BlockList blocks={blocks || []} isLoading={isLoading} />

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
                        disabled={isLoading || (blocks && blocks.length < limit)}
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </div>
        </Layout>
    );
}
>>>>>>> dd59b3813fb7697c36a309d5be73d24968d14e15
