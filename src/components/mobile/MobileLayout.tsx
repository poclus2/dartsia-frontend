import { ReactNode } from 'react';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileSearchHeader } from './MobileSearchHeader';
import { MobileStatusStrip } from './MobileStatusStrip';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: ReactNode;
  showSearch?: boolean;
  showStatus?: boolean;
  className?: string;
}

export const MobileLayout = ({
  children,
  showSearch = true,
  showStatus = true,
  className
}: MobileLayoutProps) => {
  return (
    <div className="h-screen overflow-hidden flex flex-col bg-background">
      {/* Top Section */}
      {showSearch && <MobileSearchHeader />}
      {showStatus && <MobileStatusStrip />}

      {/* Main Content */}
      <main className={cn(
        'flex-1 overflow-y-auto overscroll-contain no-scrollbar',
        'pb-20', // Ensure enough space for bottom nav + extra
        className
      )}>
        {children}
      </main>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};
