import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

export function SearchBar() {
    const [query, setQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsSearching(true);
        try {
            const { data } = await api.get(`/explorer/search/${query}`);

            if (data.type === 'block') {
                navigate(`/block/${data.id}`); // Or height if id is not available directly, assume id for now
            } else if (data.type === 'transaction') {
                navigate(`/tx/${data.id}`);
            } else if (data.type === 'host') {
                navigate(`/host/${data.id}`);
            } else {
                toast({
                    title: "Not found",
                    description: "No block, transaction, or host found with that ID.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            // Fallback: try to guess or just show error
            toast({
                title: "Search failed",
                description: "Could not find what you were looking for.",
                variant: "destructive"
            });
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
            <Input
                type="text"
                placeholder="Search block, tx, or host..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <Button type="submit" size="icon" disabled={isSearching}>
                <Search className="h-4 w-4" />
            </Button>
        </form>
    );
}
