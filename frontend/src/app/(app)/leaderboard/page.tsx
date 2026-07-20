'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

export default function LeaderboardPage() {
  return (
    <div className="h-full flex items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="glass-card max-w-lg w-full text-center p-12">
        <CardContent className="space-y-6">
          <div className="mx-auto bg-primary/20 p-6 rounded-full w-24 h-24 flex items-center justify-center text-primary mb-6">
            <Trophy className="h-12 w-12" />
          </div>
          <h1 className="h1-premium text-3xl">Global Leaderboard</h1>
          <p className="text-muted-foreground text-lg">
            See how you rank against other Japanese learners worldwide. This feature is currently under construction.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
