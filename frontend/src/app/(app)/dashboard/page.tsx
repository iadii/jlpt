'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FireIcon, 
  AcademicCapIcon, 
  BookOpenIcon, 
  ChartBarIcon, 
  PlayIcon,
  ArrowRightIcon,
  LanguageIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const fetchProgressSummary = async () => {
  try {
    const { data } = await api.get('/progress/summary/');
    return data.data;
  } catch (_e) {
    return { due_reviews: 0, new_items: 0, accuracy: 0, total_xp: 0 };
  }
};

const fetchStreak = async () => {
  try {
    const { data } = await api.get('/streaks/current/');
    return data.data;
  } catch (_e) {
    return { current_streak: 0, longest_streak: 0 };
  }
};

const fetchN5Progress = async () => {
  try {
    const { data } = await api.get('/progress/n5/');
    return data.data;
  } catch (_e) {
    return { percentage: 0 };
  }
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const checkinMutation = useMutation({
    mutationFn: async () => {
      await api.post('/streaks/checkin/');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['streak-summary'] });
    },
  });

  useEffect(() => {
    // Fire daily check-in silently in the background
    checkinMutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: progress } = useQuery({
    queryKey: ['progress-summary'],
    queryFn: fetchProgressSummary,
  });

  const { data: streak } = useQuery({
    queryKey: ['streak-summary'],
    queryFn: fetchStreak,
  });

  const { data: n5Progress } = useQuery({
    queryKey: ['progress-n5'],
    queryFn: fetchN5Progress,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Staggered entrance for all major elements
      gsap.fromTo(
        '.gsap-stagger-item',
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          stagger: 0.1, 
          duration: 0.8, 
          ease: 'power3.out',
          delay: 0.1
        }
      );
      
      // Progress bar animations
      gsap.fromTo(
        '.gsap-progress-bar',
        { width: '0%' },
        {
          width: (i, el) => el.getAttribute('data-width') || '0%',
          duration: 1.5,
          ease: 'power4.out',
          delay: 0.5
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [progress, streak, n5Progress]); // Re-run if data loads significantly later

  return (
    <div ref={containerRef} className="space-y-12 max-w-5xl mx-auto pb-16">
      
      {/* Header Section */}
      <div className="gsap-stagger-item flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="h1-premium mb-2">
            おかえり, {user?.username || 'Student'}
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome back to your Japanese learning journey.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-border shadow-sm">
            <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center">
              <FireIcon className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Day Streak</p>
              <p className="text-xl font-bold text-foreground leading-none">{streak?.current_streak || 0}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-border shadow-sm">
            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
              <ChartBarIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total XP</p>
              <p className="text-xl font-bold text-foreground leading-none">{progress?.total_xp || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Review Card */}
        <div className="gsap-stagger-item glass-card-sakura p-8 flex flex-col justify-between group h-[320px]">
          <div>
            <div className="h-12 w-12 rounded-xl bg-white/60 flex items-center justify-center mb-6 shadow-sm border border-white/40">
              <AcademicCapIcon className="h-6 w-6 text-rose-500" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Smart Reviews</h2>
            <p className="text-muted-foreground max-w-sm">
              You have <span className="font-bold text-foreground">{progress?.due_reviews || 0}</span> items due for recall today. Keep your memory fresh.
            </p>
          </div>
          <Button className="w-full gap-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white border-none py-6 shadow-md transition-transform">
            <PlayIcon className="h-5 w-5" />
            Start Session
          </Button>
        </div>

        {/* Curriculum Card */}
        <div className="gsap-stagger-item enterprise-card p-8 flex flex-col justify-between group h-[320px]">
          <div>
            <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6 border border-border">
              <BookOpenIcon className="h-6 w-6 text-slate-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Curriculum</h2>
            <p className="text-muted-foreground max-w-sm">
              Explore new vocabulary, grammar, and kanji to advance your proficiency level.
            </p>
          </div>
          <Link href="/learn" className="w-full">
            <Button variant="outline" className="w-full gap-2 rounded-xl py-6 hover:bg-slate-50 transition-transform">
              Explore Path
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Progress Section */}
      <div className="gsap-stagger-item space-y-6 pt-6">
        <h3 className="h2-premium">JLPT N5 Progress</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Vocabulary Progress */}
          <Card className="enterprise-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600 font-medium border border-pink-100">語</div>
                <span className="font-semibold text-foreground">Vocabulary</span>
              </div>
              <span className="font-bold text-pink-600">{n5Progress?.percentage || 0}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="gsap-progress-bar h-full bg-pink-400 rounded-full" 
                data-width={`${n5Progress?.percentage || 0}%`}
              />
            </div>
          </Card>

          {/* Kanji Progress */}
          <Card className="enterprise-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-medium border border-blue-100">漢</div>
                <span className="font-semibold text-foreground">Kanji</span>
              </div>
              <span className="font-bold text-blue-600">0%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="gsap-progress-bar h-full bg-blue-400 rounded-full" 
                data-width="0%"
              />
            </div>
          </Card>

          {/* Grammar Progress */}
          <Card className="enterprise-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 font-medium border border-emerald-100">文</div>
                <span className="font-semibold text-foreground">Grammar</span>
              </div>
              <span className="font-bold text-emerald-600">0%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="gsap-progress-bar h-full bg-emerald-400 rounded-full" 
                data-width="0%"
              />
            </div>
          </Card>
        </div>
      </div>

    </div>
  );
}
