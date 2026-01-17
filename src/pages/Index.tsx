import React from "react";
import Layout from "@/components/layout/Layout";
import { StatusRail } from "@/components/network/StatusRail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import TransactionFlow from "@/components/network/TransactionFlow";
import BlockStats from "@/components/network/BlockStats";

export default function Index() {
    return (
        <Layout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Network Overview</h1>
                    <p className="text-muted-foreground">
                        Real-time insights into the Sia network
                    </p>
                </div>

                <StatusRail />
                <BlockStats />

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Recent Transactions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TransactionFlow />
                            <div className="mt-4 flex justify-end">
                                <Button asChild variant="ghost" size="sm">
                                    <Link to="/txs" className="flex items-center gap-2">
                                        View all transactions <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Network Health</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[200px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-md">
                                Map Visualization Coming Soon
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
