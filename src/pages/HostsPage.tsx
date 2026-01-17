import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { HostList } from "@/components/hosts/HostList";
import { useHosts } from "@/hooks/useHosts";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HostsPage() {
    const [offset, setOffset] = useState(0);
    const limit = 20;
    const { data: hosts, isLoading } = useHosts({ limit, offset });

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
                    <h1 className="text-3xl font-bold tracking-tight">Active Hosts</h1>
                    <p className="text-muted-foreground">
                        Browse available storage providers on the network
                    </p>
                </div>

                <HostList hosts={hosts || []} isLoading={isLoading} />

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
                        disabled={isLoading || (hosts && hosts.length < limit)}
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </div>
        </Layout>
    );
}
