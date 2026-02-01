<<<<<<< HEAD
import { useState, useRef, useEffect } from 'react';
import { Search, X, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileSearchHeaderProps {
  onSearch?: (query: string, type: string) => void;
  placeholder?: string;
  className?: string;
}

export const MobileSearchHeader = ({ 
  onSearch,
  placeholder = "Block, tx, host, address...",
  className 
}: MobileSearchHeaderProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Detect query type
  const detectQueryType = (q: string): string => {
    if (!q) return 'unknown';
    if (/^\d+$/.test(q)) return 'block_height';
    if (/^[a-fA-F0-9]{64}$/.test(q)) return 'hash';
    if (/^[a-fA-F0-9]{40,}$/.test(q)) return 'address';
    if (q.startsWith('ed25519:')) return 'host_key';
    return 'search';
  };

  const handleSearch = () => {
    if (query.trim()) {
      const type = detectQueryType(query.trim());
      onSearch?.(query.trim(), type);
      
      // Mock results for demo
      setResults([
        { type: 'block', value: 'Block #' + (parseInt(query) || 234567), id: query },
        { type: 'tx', value: 'Transaction ' + query.slice(0, 8) + '...', id: query },
      ]);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1500);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div className={cn(
      'sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border',
      className
    )}>
      {/* Search Input */}
      <div className="px-3 py-2">
        <div className={cn(
          'relative flex items-center',
          'bg-muted/50 border transition-colors',
          isFocused ? 'border-primary/50' : 'border-transparent'
        )}>
          <Search 
            size={14} 
            className="absolute left-3 text-foreground-subtle" 
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={placeholder}
            className={cn(
              'w-full h-9 bg-transparent pl-9 pr-16',
              'text-xs font-mono text-foreground placeholder:text-foreground-subtle',
              'focus:outline-none'
            )}
          />
          
          {/* Query type badge */}
          {query && (
            <span className="absolute right-10 text-[8px] uppercase tracking-wider text-foreground-subtle bg-muted px-1.5 py-0.5">
              {detectQueryType(query).replace('_', ' ')}
            </span>
          )}
          
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-3 text-foreground-subtle hover:text-foreground"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Inline Results */}
      {isFocused && results.length > 0 && (
        <div className="border-t border-border-subtle">
          {results.map((result, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-3 py-2 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[8px] uppercase tracking-wider text-foreground-subtle bg-muted px-1.5 py-0.5 flex-shrink-0">
                  {result.type}
                </span>
                <span className="text-xs font-mono truncate">{result.value}</span>
              </div>
              <button
                onClick={() => handleCopy(result.id)}
                className="text-foreground-subtle hover:text-foreground flex-shrink-0 ml-2"
              >
                {copied === result.id ? <Check size={12} /> : <Copy size={12} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
=======
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
>>>>>>> dd59b3813fb7697c36a309d5be73d24968d14e15
