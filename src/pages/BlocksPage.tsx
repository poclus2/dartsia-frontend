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
