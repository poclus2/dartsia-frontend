import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileLayout } from '../mobile/MobileLayout';
import { useMobile } from '@/hooks/useMobile';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { isMobile } = useMobile();
  const location = useLocation();

  if (isMobile) {
    // Hide default search header on Hosts page AND Block Detail page
    // We want the block detail header to be the primary nav
    const showSearch = location.pathname !== '/hosts' && !location.pathname.startsWith('/block/');

    return (
      <MobileLayout showSearch={showSearch}>
        {children}
      </MobileLayout>
    );
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 ml-56 relative z-10">
        {children}
      </main>
    </div>
  );
};
