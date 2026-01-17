import { useState, useEffect } from "react";
import { Search, Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Toaster } from "@/components/ui/toaster"; // Import if needed for toast in mobile

// Simplified version based on what was described in history
export function MobileSearchHeader() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        // Reuse logic or simple navigation
        try {
            // Just navigation logic for now to keep it simple and functional
            if (query.length > 50) { // Likely transaction or host
                navigate(`/tx/${query}`);
            } else if (!isNaN(Number(query))) { // Block height
                // navigate(`/block/${query}`); // Need block page
            } else {
                // Default search
            }
            setIsOpen(false);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="md:hidden flex items-center justify-between p-4 border-b bg-background sticky top-0 z-50">
            <div className="flex items-center gap-2 font-bold text-primary">
                <img src="/logo.png" className="h-6 w-6" alt="Logo" />
                DARTSIA
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>

            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-background border-b p-4 shadow-lg animate-in slide-in-from-top-2">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <Input
                            placeholder="Search..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                        />
                        <Button type="submit">Go</Button>
                    </form>
                </div>
            )}
        </div>
    );
}
