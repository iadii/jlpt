'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { 
  HomeIcon, 
  BookOpenIcon, 
  TrophyIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon, 
  UserCircleIcon 
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.push('/login');
    }
  }, [_hasHydrated, isAuthenticated, router]);

  if (!_hasHydrated || !isAuthenticated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm font-medium text-muted-foreground animate-pulse">Loading...</span>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Learn', href: '/learn', icon: BookOpenIcon },
    { name: 'Leaderboard', href: '/leaderboard', icon: TrophyIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background relative selection:bg-primary/30 selection:text-primary">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-background relative z-10 flex flex-col items-center pb-32">
        <div className="w-full max-w-6xl px-6 py-8 lg:px-10 lg:py-12 flex-1">
          {children}
        </div>
      </main>

      {/* Floating Dock Navigation */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4">
        <nav className="glass-nav flex items-center p-2 gap-2 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          
          {/* Main Links */}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href === '/learn' && pathname.startsWith('/learn'));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative group flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full transition-all duration-300",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : "text-muted-foreground hover:bg-white/50 hover:text-foreground"
                )}
              >
                <Icon className="h-6 w-6 sm:h-7 sm:w-7 transition-transform duration-300" />
                
                {/* Tooltip */}
                <span className="absolute -top-10 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300 bg-foreground text-background text-xs font-bold px-3 py-1.5 rounded-lg pointer-events-none whitespace-nowrap shadow-xl">
                  {item.name}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                </span>
              </Link>
            )
          })}

          <div className="w-px h-8 bg-border mx-2" />

          {/* User Profile Tooltip/Button */}
          <div className="relative group flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full transition-all duration-300 text-muted-foreground hover:bg-white/50 hover:text-foreground cursor-default">
            <UserCircleIcon className="h-6 w-6 sm:h-7 sm:w-7 transition-transform duration-300" />
            <span className="absolute -top-10 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300 bg-foreground text-background text-xs font-bold px-3 py-1.5 rounded-lg pointer-events-none whitespace-nowrap shadow-xl">
              {user?.username || 'Student'}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="relative group flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full transition-all duration-300 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <ArrowRightOnRectangleIcon className="h-6 w-6 sm:h-7 sm:w-7 transition-transform duration-300" />
            <span className="absolute -top-10 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300 bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1.5 rounded-lg pointer-events-none whitespace-nowrap shadow-xl">
              Sign Out
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-destructive" />
            </span>
          </button>

        </nav>
      </div>
    </div>
  );
}
