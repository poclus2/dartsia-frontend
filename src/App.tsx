import { Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import BlocksPage from "./pages/BlocksPage";
import TransactionsPage from "./pages/TransactionsPage";
import HostsPage from "./pages/HostsPage";
import TransactionDetailPage from "./pages/TransactionDetailPage";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60, // 1 minute
        },
    },
});

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/blocks" element={<BlocksPage />} />
                <Route path="/txs" element={<TransactionsPage />} />
                <Route path="/hosts" element={<HostsPage />} />
                <Route path="/tx/:hash" element={<TransactionDetailPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
