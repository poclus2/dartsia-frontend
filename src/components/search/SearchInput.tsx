import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput = ({ 
  value, 
  onChange, 
  placeholder = "Search...",
  className 
}: SearchInputProps) => {
  return (
    <div className={cn('relative', className)}>
      <Search 
        size={14} 
        className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-subtle" 
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="search-input pl-9 pr-8"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
