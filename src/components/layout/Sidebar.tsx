import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Activity,
  Blocks,
  ArrowLeftRight,
  Server,
  BarChart3,
  Globe,
  AlertTriangle,
  Code,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';

const navItems = [
  { path: '/', label: 'Network', icon: Activity },
  { path: '/blocks', label: 'Blocks', icon: Blocks },
  { path: '/txs', label: 'Transactions', icon: ArrowLeftRight },
  { path: '/hosts', label: 'Hosts', icon: Server },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen z-50 flex flex-col',
        'bg-sidebar/95 backdrop-blur-xl border-r border-sidebar-border',
        'transition-all duration-300 ease-out',
        collapsed ? 'w-16' : 'w-56'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-secondary flex items-center justify-center">
            <span className="text-secondary-foreground font-bold text-lg">D</span>
          </div>
          {!collapsed && (
            <span className="font-semibold text-foreground tracking-tight">
              DART<span className="text-secondary">SIA</span>
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={cn(
                    'nav-item group',
                    isActive && 'active',
                    collapsed ? 'justify-center px-0' : ''
                  )}
                >
                  <Icon
                    size={20}
                    className={cn(
                      'flex-shrink-0 transition-colors',
                      isActive ? 'text-primary' : 'text-foreground-muted group-hover:text-secondary'
                    )}
                  />
                  {!collapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                  {collapsed && (
                    <div className={cn(
                      'absolute left-full ml-2 px-2 py-1 bg-popover border border-border',
                      'text-sm font-medium whitespace-nowrap opacity-0 pointer-events-none',
                      'group-hover:opacity-100 transition-opacity z-50'
                    )}>
                      {item.label}
                    </div>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Theme Toggle */}
      <div className={cn(
        'flex items-center border-t border-sidebar-border',
        collapsed ? 'justify-center py-2' : 'justify-between px-3 py-2'
      )}>
        {!collapsed && (
          <span className="text-[10px] uppercase tracking-wider text-foreground-subtle">
            Theme
          </span>
        )}
        <ThemeToggle />
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          'h-12 flex items-center justify-center border-t border-sidebar-border',
          'text-foreground-muted hover:text-foreground hover:bg-muted/30 transition-colors'
        )}
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {/* Network Status */}
      <div className={cn(
        'h-14 flex items-center border-t border-sidebar-border px-4',
        collapsed ? 'justify-center' : 'gap-3'
      )}>
        <div className="status-dot status-dot-live flex-shrink-0" />
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-foreground-subtle">
              Network
            </span>
            <span className="text-xs font-medium text-success">Synced</span>
          </div>
        )}
      </div>
    </aside>
  );
};
