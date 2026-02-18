import { useState, useRef, useEffect } from 'react';
import { Search, X, Copy, Check, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface MobileSearchHeaderProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (query: string, type: string) => void;
  placeholder?: string;
  className?: string;
}

export const MobileSearchHeader = ({
  value,
  onChange,
  onSearch,
  placeholder = "Block, tx, host, address...",
  className
}: MobileSearchHeaderProps) => {
  const navigate = useNavigate();
  const [internalQuery, setInternalQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const query = value !== undefined ? value : internalQuery;

  const setQuery = (val: string) => {
    if (onChange) {
      onChange(val);
    } else {
      setInternalQuery(val);
    }
  };

  // Detect query type
  const detectQueryType = (q: string): string => {
    if (!q) return 'unknown';
    if (/^\d+$/.test(q)) return 'block_height';
    if (/^[a-fA-F0-9]{64}$/.test(q)) return 'hash';
    if (/^[a-fA-F0-9]{40,}$/.test(q)) return 'address';
    if (q.startsWith('ed25519:')) return 'host_key';
    return 'search'; // Default
  };

  const handleSearch = () => {
    if (!query.trim()) return;

    const type = detectQueryType(query.trim());

    if (onSearch) {
      onSearch(query.trim(), type);
    } else {
      // Default Global Navigation
      const q = query.trim();
      switch (type) {
        case 'block_height':
          navigate(`/block/${q}`);
          break;
        case 'host_key':
          navigate(`/host/${q}`);
          break;
        case 'hash':
          // Ambiguous: Block ID or TX ID. 
          // For now, try Block first or generic search page if we had one.
          // Let's assume generic hash navigation or maybe logic to check.
          // Since we don't have a dedicated /search/:id route yet, we might fallback to block
          navigate(`/block/${q}`);
          break;
        case 'address':
          // Address page not implemented yet? Or maybe it is.
          // navigate(`/address/${q}`);
          break;
        default:
          // Generic search for hosts or navigation
          if (q.includes('host') || q.length > 20) {
            navigate(`/host/${q}`);
          }
          break;
      }
    }
    inputRef.current?.blur();
    setIsFocused(false);
  };

  const clearSearch = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className={cn(
      'sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border',
      className
    )}>
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

          {/* Query type badge or Clear button */}
          <div className="absolute right-2 flex items-center gap-2">
            {query && (
              <span className="text-[8px] uppercase tracking-wider text-foreground-subtle bg-muted px-1.5 py-0.5">
                {detectQueryType(query).replace('_', ' ')}
              </span>
            )}

            {query && (
              <button
                onClick={clearSearch}
                className="text-foreground-subtle hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
