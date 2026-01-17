import { Sidebar } from "./Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-background font-sans antialiased">
            <div className="hidden md:block">
                <Sidebar />
            </div>
            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto p-4 md:p-8 pt-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
