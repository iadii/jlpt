'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Home, Trophy, LogOut, Settings, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SakuraBackground } from '@/components/ui/SakuraBackground';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout, _hasHydrated } = useAuthStore();
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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Learn', href: '/learn', icon: BookOpen },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background relative">
      {/* Dynamic Floating Sakura Petals */}
      <SakuraBackground />

      {/* Sidebar */}
      <aside className="w-64 border-r border-border/70 bg-card/60 backdrop-blur-xl flex flex-col z-10 shadow-2xl">
        <div className="p-6 border-b border-border/50">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <span className="text-3xl group-hover:scale-110 transition-transform">🎌</span>
            <div>
              <span className="text-xl font-black tracking-wider bg-gradient-to-r from-primary via-tokyo-pink to-accent bg-clip-text text-transparent">
                JLPT Sensei
              </span>
              <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="h-2.5 w-2.5 text-primary" />
                Mount Fuji & Tokyo
              </span>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href === '/learn' && pathname.startsWith('/learn'));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
                  isActive 
                    ? "bg-gradient-to-r from-primary/15 to-tokyo-pink/10 text-primary border border-primary/20 shadow-md translate-x-1" 
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border/50">
          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-destructive w-full hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
