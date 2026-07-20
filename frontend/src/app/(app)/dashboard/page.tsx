'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, Brain, BookA, BookOpen, Target, Play } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';

const fetchProgressSummary = async () => {
  try {
    const { data } = await api.get('/progress/summary/');
    return data.data;
  } catch (e) {
    return { due_reviews: 0, new_items: 0, accuracy: 0, total_xp: 0 };
  }
};

const fetchStreak = async () => {
  try {
    const { data } = await api.get('/streaks/current/');
    return data.data;
  } catch (e) {
    return { current_streak: 0, longest_streak: 0 };
  }
};

const fetchN5Progress = async () => {
  try {
    const { data } = await api.get('/progress/n5/');
    return data.data;
  } catch (e) {
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="h1-premium mb-2">おかえり, {user?.username || 'Student'}!</h1>
          <p className="text-muted-foreground text-lg">Ready to continue your Japanese journey?</p>
        </div>
        
        <div className="flex gap-4">
          <Card className="glass-card py-2 px-4 flex items-center gap-3">
            <Flame className="text-orange-500 h-6 w-6" />
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Day Streak</p>
              <p className="text-xl font-bold">{streak?.current_streak || 0}</p>
            </div>
          </Card>
          
          <Card className="glass-card py-2 px-4 flex items-center gap-3">
            <Target className="text-primary h-6 w-6" />
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total XP</p>
              <p className="text-xl font-bold">{progress?.total_xp || 0}</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Daily Review Card */}
        <Card className="glass-card relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent z-0 transition-opacity group-hover:opacity-100 opacity-50" />
          <CardContent className="p-8 relative z-10 flex flex-col items-center text-center">
            <div className="bg-primary/20 p-4 rounded-full mb-6 text-primary">
              <Brain className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Smart Review</h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
              You have <span className="text-primary font-bold">{progress?.due_reviews || 0}</span> items due for review. Our ML algorithm has optimized your queue.
            </p>
            <Button variant="premium" size="lg" className="w-full max-w-xs gap-2">
              <Play className="h-4 w-4" fill="currentColor" />
              Start Review Session
            </Button>
          </CardContent>
        </Card>

        {/* Learn New Content */}
        <Card className="glass-card relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent z-0 transition-opacity group-hover:opacity-100 opacity-50" />
          <CardContent className="p-8 relative z-10 flex flex-col items-center text-center">
            <div className="bg-accent/20 p-4 rounded-full mb-6 text-accent">
              <BookA className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Learn New Items</h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Ready for more? Discover <span className="text-accent font-bold">{progress?.new_items || 15}</span> new vocabulary words and grammar points today.
            </p>
            <Link href="/learn" className="w-full max-w-xs">
              <Button variant="outline" size="lg" className="w-full gap-2 border-accent/50 hover:bg-accent/10 hover:text-accent">
                <BookOpen className="h-4 w-4" />
                Explore Content
              </Button>
            </Link>
          </CardContent>
        </Card>

      </div>
      
      {/* Recent Activity or Stats */}
      <div className="mt-8">
        <h3 className="h2-premium text-2xl mb-4">JLPT N5 Progress</h3>
        <Card className="glass-card p-6">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Vocabulary</span>
                <span className="text-muted-foreground">{n5Progress?.percentage || 0}%</span>
              </div>
              <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" style={{ width: `${n5Progress?.percentage || 0}%` }} />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Kanji</span>
                <span className="text-muted-foreground">0%</span>
              </div>
              <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full transition-all duration-1000 ease-out" style={{ width: '0%' }} />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Grammar</span>
                <span className="text-muted-foreground">0%</span>
              </div>
              <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out" style={{ width: '0%' }} />
              </div>
            </div>
          </div>
        </Card>
      </div>

    </div>
  );
}
