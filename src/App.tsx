<<<<<<< HEAD
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { MainLayout } from "./components/layout/MainLayout";
import Index from "./pages/Index";
import BlocksPage from "./pages/BlocksPage";
import TransactionsPage from "./pages/TransactionsPage";
import TransactionDetailPage from "./pages/TransactionDetailPage";
import HostsPage from "./pages/HostsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/blocks" element={<BlocksPage />} />
              <Route path="/txs" element={<TransactionsPage />} />
              <Route path="/tx/:id" element={<TransactionDetailPage />} />
              <Route path="/hosts" element={<HostsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
=======
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
>>>>>>> dd59b3813fb7697c36a309d5be73d24968d14e15
);

export default App;
