'use client';

import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Flame, Trophy } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LearnPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pb-12">
      <div className="text-center space-y-4 py-8">
        <h1 className="h1-premium text-4xl">Curriculum & Explore</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Choose a module to master vocabulary, study Kanji stroke order, or practice Japanese grammar patterns across JLPT N5–N1.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vocabulary Card */}
        <Card className="glass-card overflow-hidden group hover:border-primary/50 transition-colors">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-primary/20 p-3 rounded-xl text-primary">
                <BookOpen className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold">Vocabulary</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Learn 6,900+ Japanese words categorized by JLPT levels with readings, meanings, and audio pronunciation.
            </p>
            <Link href="/learn/vocabulary">
              <Button variant="premium" className="w-full">Explore Vocabulary</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Kanji Card */}
        <Card className="glass-card overflow-hidden group hover:border-accent/50 transition-colors">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-accent/20 p-3 rounded-xl text-accent">
                <Trophy className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold">Kanji</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Master essential Kanji characters with Onyomi, Kunyomi, stroke counts, and stroke order diagrams.
            </p>
            <Link href="/learn/kanji">
              <Button variant="outline" className="w-full border-accent/40 hover:bg-accent/10 hover:text-accent">
                Explore Kanji
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Grammar Card */}
        <Card className="glass-card overflow-hidden group hover:border-blue-500/50 transition-colors md:col-span-2">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-500/20 p-3 rounded-xl text-blue-500">
                <Flame className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold">Grammar & Sentence Patterns</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Detailed explanations of Japanese sentence structures, particle usage, and interactive example sentences with native audio.
            </p>
            <Link href="/learn/grammar">
              <Button variant="outline" className="w-full md:w-auto border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400">
                Explore Grammar
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
