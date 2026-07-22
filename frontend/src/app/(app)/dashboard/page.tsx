'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, Brain, BookA, BookOpen, Target, Play, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { GSAPReveal } from '@/components/ui/GSAPReveal';

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

  return (
    <GSAPReveal className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Welcome Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-8 rounded-3xl bg-gradient-to-r from-card/90 via-card/70 to-card/90 backdrop-blur-xl border border-primary/20 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none text-9xl font-black select-none text-primary">
          富士
        </div>
        
        <div className="space-y-1 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            Mount Fuji JLPT Dashboard
          </div>
          <h1 className="h1-premium text-4xl sm:text-5xl">おかえり, {user?.username || 'Student'}!</h1>
          <p className="text-muted-foreground text-base sm:text-lg">Ready to conquer your Japanese proficiency goals today?</p>
        </div>
        
        <div className="flex gap-4 z-10">
          <Card className="glass-card-sakura py-3 px-5 flex items-center gap-3 rounded-2xl">
            <div className="p-2.5 bg-orange-500/20 rounded-xl text-orange-500">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider">Day Streak</p>
              <p className="text-2xl font-black text-foreground">{streak?.current_streak || 0} Days</p>
            </div>
          </Card>
          
          <Card className="glass-card py-3 px-5 flex items-center gap-3 rounded-2xl border-primary/30">
            <div className="p-2.5 bg-primary/20 rounded-xl text-primary">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider">Total XP</p>
              <p className="text-2xl font-black text-foreground">{progress?.total_xp || 0} XP</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Study Cards Grid */}
      <GSAPReveal staggerChildren delay={0.15} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Smart Review */}
        <Card className="glass-card-fuji relative overflow-hidden group border border-fuji-ice/30 rounded-3xl transition-all duration-300 hover:border-primary/50">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-8 relative z-10 flex flex-col items-center text-center">
            <div className="bg-primary/20 p-5 rounded-2xl mb-6 text-primary border border-primary/30 group-hover:scale-110 transition-transform">
              <Brain className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Smart Review Queue</h2>
            <p className="text-muted-foreground mb-6 max-w-sm text-sm sm:text-base">
              You have <span className="text-primary font-bold text-lg">{progress?.due_reviews || 0}</span> items due for review. Half-Life Regression SRS has optimized your queue.
            </p>
            <Button variant="premium" size="lg" className="w-full max-w-xs gap-2 rounded-2xl font-bold shadow-lg shadow-primary/20">
              <Play className="h-4 w-4" fill="currentColor" />
              Start Review Session
            </Button>
          </CardContent>
        </Card>

        {/* Explore New Content */}
        <Card className="glass-card relative overflow-hidden group border border-border/60 rounded-3xl transition-all duration-300 hover:border-accent/50">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-8 relative z-10 flex flex-col items-center text-center">
            <div className="bg-accent/20 p-5 rounded-2xl mb-6 text-accent border border-accent/30 group-hover:scale-110 transition-transform">
              <BookA className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Explore Curriculum</h2>
            <p className="text-muted-foreground mb-6 max-w-sm text-sm sm:text-base">
              Discover <span className="text-accent font-bold text-lg">{progress?.new_items || 6900}</span> vocabulary, Kanji characters, and grammar patterns.
            </p>
            <Link href="/learn" className="w-full max-w-xs">
              <Button variant="outline" size="lg" className="w-full gap-2 border-accent/50 hover:bg-accent/10 hover:text-accent rounded-2xl font-bold">
                <BookOpen className="h-4 w-4" />
                Explore Curriculum
              </Button>
            </Link>
          </CardContent>
        </Card>
      </GSAPReveal>
      
      {/* Progress Trackers */}
      <GSAPReveal delay={0.3} className="space-y-4">
        <h3 className="h2-premium text-2xl">JLPT N5 Mastery Progress</h3>
        <Card className="glass-card p-8 rounded-3xl border-border/60">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="font-bold text-foreground">Vocabulary Mastery</span>
                <span className="text-primary font-bold">{n5Progress?.percentage || 0}%</span>
              </div>
              <div className="h-3 w-full bg-secondary/80 rounded-full overflow-hidden p-0.5 border border-border/40">
                <div className="h-full bg-gradient-to-r from-primary to-tokyo-pink rounded-full transition-all duration-1000 ease-out" style={{ width: `${n5Progress?.percentage || 0}%` }} />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="font-bold text-foreground">Kanji Mastery</span>
                <span className="text-accent font-bold">0%</span>
              </div>
              <div className="h-3 w-full bg-secondary/80 rounded-full overflow-hidden p-0.5 border border-border/40">
                <div className="h-full bg-gradient-to-r from-fuji-ice to-accent rounded-full transition-all duration-1000 ease-out" style={{ width: '0%' }} />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="font-bold text-foreground">Grammar & Syntax Mastery</span>
                <span className="text-blue-400 font-bold">0%</span>
              </div>
              <div className="h-3 w-full bg-secondary/80 rounded-full overflow-hidden p-0.5 border border-border/40">
                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full transition-all duration-1000 ease-out" style={{ width: '0%' }} />
              </div>
            </div>
          </div>
        </Card>
      </GSAPReveal>
    </GSAPReveal>
  );
}
