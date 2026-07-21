'use client';

import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Flame, Trophy } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LearnPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="text-center space-y-4 py-8">
        <h1 className="h1-premium text-4xl">Curriculum & Explore</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Choose a specific topic to study, review grammar rules, or discover new vocabulary for the JLPT N5.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card overflow-hidden group hover:border-primary/50 transition-colors">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-primary/20 p-3 rounded-xl text-primary">
                <BookOpen className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold">Vocabulary</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Learn new words categorized by topics and frequency for the JLPT N5 exam.
            </p>
            <Link href="/learn/vocabulary">
              <Button variant="premium" className="w-full">Explore Vocabulary</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="glass-card overflow-hidden group hover:border-accent/50 transition-colors">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-accent/20 p-3 rounded-xl text-accent">
                <Trophy className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold">Kanji</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Master the essential 100+ Kanji characters required for the JLPT N5.
            </p>
            <Button variant="outline" className="w-full">Coming Soon</Button>
          </CardContent>
        </Card>

        <Card className="glass-card overflow-hidden group hover:border-blue-500/50 transition-colors md:col-span-2">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-500/20 p-3 rounded-xl text-blue-500">
                <Flame className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold">Grammar & Particles</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Detailed explanations of Japanese grammar rules, particles, and sentence structures.
            </p>
            <Button variant="outline" className="w-full md:w-auto">Coming Soon</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
