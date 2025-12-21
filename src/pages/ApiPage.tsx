import { useState } from 'react';
import { Code, Copy, Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  params?: { name: string; type: string; required: boolean }[];
}

const endpoints: Endpoint[] = [
  {
    method: 'GET',
    path: '/api/v1/blocks',
    description: 'Retrieve a list of recent blocks',
    params: [
      { name: 'limit', type: 'number', required: false },
      { name: 'offset', type: 'number', required: false },
    ],
  },
  {
    method: 'GET',
    path: '/api/v1/blocks/:height',
    description: 'Get details of a specific block by height',
    params: [
      { name: 'height', type: 'number', required: true },
    ],
  },
  {
    method: 'GET',
    path: '/api/v1/transactions',
    description: 'List recent transactions',
    params: [
      { name: 'type', type: 'string', required: false },
      { name: 'limit', type: 'number', required: false },
    ],
  },
  {
    method: 'GET',
    path: '/api/v1/hosts',
    description: 'Retrieve list of all active hosts',
    params: [
      { name: 'sort', type: 'string', required: false },
      { name: 'region', type: 'string', required: false },
    ],
  },
  {
    method: 'GET',
    path: '/api/v1/hosts/:id',
    description: 'Get detailed information for a specific host',
    params: [
      { name: 'id', type: 'string', required: true },
    ],
  },
  {
    method: 'GET',
    path: '/api/v1/network/stats',
    description: 'Get current network statistics',
  },
  {
    method: 'GET',
    path: '/api/v1/network/health',
    description: 'Check network health status',
  },
];

const methodColors = {
  GET: 'bg-success text-success-foreground',
  POST: 'bg-secondary text-secondary-foreground',
  PUT: 'bg-primary text-primary-foreground',
  DELETE: 'bg-destructive text-destructive-foreground',
};

const ApiPage = () => {
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPath(text);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="h-16 border-b border-border bg-background-elevated/50 backdrop-blur-sm px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Code size={20} className="text-secondary" />
          <h1 className="text-lg font-semibold">API Reference</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-foreground-muted">Base URL:</span>
          <code className="font-mono text-sm text-secondary bg-muted/30 px-2 py-0.5">
            https://api.siascan.io
          </code>
        </div>
      </div>

      {/* API Info */}
      <div className="border-b border-border-subtle bg-background-elevated/30 px-6 py-4">
        <div className="grid grid-cols-4 gap-6 text-sm">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-foreground-subtle block mb-1">
              Version
            </span>
            <span className="font-mono">v1.0.0</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-foreground-subtle block mb-1">
              Format
            </span>
            <span className="font-mono">JSON</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-foreground-subtle block mb-1">
              Rate Limit
            </span>
            <span className="font-mono">1000/min</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-foreground-subtle block mb-1">
              Auth
            </span>
            <span className="font-mono">API Key</span>
          </div>
        </div>
      </div>

      {/* Endpoints */}
      <div className="p-6">
        <div className="space-y-2">
          {endpoints.map((endpoint) => {
            const isExpanded = expandedEndpoint === endpoint.path;
            
            return (
              <div
                key={endpoint.path}
                className="border border-border bg-background-surface/50 transition-all"
              >
                {/* Endpoint Header */}
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/20 transition-colors"
                  onClick={() => setExpandedEndpoint(isExpanded ? null : endpoint.path)}
                >
                  {/* Method Badge */}
                  <span className={cn(
                    'px-2 py-0.5 text-[10px] font-bold uppercase min-w-[50px] text-center',
                    methodColors[endpoint.method]
                  )}>
                    {endpoint.method}
                  </span>

                  {/* Path */}
                  <code className="font-mono text-sm text-foreground flex-1">
                    {endpoint.path}
                  </code>

                  {/* Description */}
                  <span className="text-sm text-foreground-muted">
                    {endpoint.description}
                  </span>

                  {/* Copy Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(endpoint.path);
                    }}
                    className="p-1.5 hover:bg-muted/30 transition-colors"
                  >
                    {copiedPath === endpoint.path ? (
                      <Check size={14} className="text-success" />
                    ) : (
                      <Copy size={14} className="text-foreground-muted" />
                    )}
                  </button>

                  {/* Expand Arrow */}
                  <ChevronRight 
                    size={16} 
                    className={cn(
                      'text-foreground-muted transition-transform',
                      isExpanded && 'rotate-90'
                    )} 
                  />
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-border-subtle p-4 bg-background/50 animate-fade-in">
                    {endpoint.params && endpoint.params.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-[10px] uppercase tracking-wider text-foreground-subtle mb-2">
                          Parameters
                        </h4>
                        <div className="space-y-2">
                          {endpoint.params.map((param) => (
                            <div key={param.name} className="flex items-center gap-4 text-sm">
                              <code className="font-mono text-secondary">{param.name}</code>
                              <span className="text-foreground-muted">{param.type}</span>
                              {param.required && (
                                <span className="text-[10px] text-primary uppercase">Required</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="text-[10px] uppercase tracking-wider text-foreground-subtle mb-2">
                        Example Request
                      </h4>
                      <div className="bg-background border border-border-subtle p-3 font-mono text-xs overflow-x-auto">
                        <span className="text-foreground-muted">curl</span>{' '}
                        <span className="text-secondary">https://api.siascan.io{endpoint.path}</span>{' '}
                        <span className="text-foreground-muted">\</span>
                        <br />
                        <span className="text-foreground-muted">  -H</span>{' '}
                        <span className="text-success">"Authorization: Bearer YOUR_API_KEY"</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ApiPage;
