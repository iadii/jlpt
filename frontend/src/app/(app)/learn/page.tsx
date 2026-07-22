'use client';

import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Flame, Trophy, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GSAPReveal } from '@/components/ui/GSAPReveal';

export default function LearnPage() {
  return (
    <GSAPReveal className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="text-center space-y-4 py-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mx-auto">
          <Sparkles className="h-3.5 w-3.5" />
          Japanese Learning Curriculum
        </div>
        <h1 className="h1-premium text-4xl sm:text-5xl">Curriculum & Explorers</h1>
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
          Choose a module to master vocabulary, study Kanji stroke order, or practice Japanese grammar patterns across JLPT N5–N1.
        </p>
      </div>

      <GSAPReveal staggerChildren delay={0.15} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vocabulary Card */}
        <Card className="glass-card overflow-hidden group hover:border-primary/60 transition-all rounded-3xl relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
          <CardContent className="p-8 relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-primary/20 p-4 rounded-2xl text-primary border border-primary/30 group-hover:scale-110 transition-transform">
                <BookOpen className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold">Vocabulary</h2>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">6,920+ Words</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base mb-6">
              Learn Japanese words categorized by JLPT levels with readings, meanings, parts of speech, and native TTS audio pronunciation.
            </p>
            <Link href="/learn/vocabulary">
              <Button variant="premium" className="w-full rounded-2xl font-bold shadow-md">Explore Vocabulary</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Kanji Card */}
        <Card className="glass-card overflow-hidden group hover:border-accent/60 transition-all rounded-3xl relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-all" />
          <CardContent className="p-8 relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-accent/20 p-4 rounded-2xl text-accent border border-accent/30 group-hover:scale-110 transition-transform">
                <Trophy className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold">Kanji</h2>
                <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-md">2,210+ Kanji</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base mb-6">
              Master essential Kanji characters with Onyomi, Kunyomi, stroke counts, and interactive SVG stroke order diagrams.
            </p>
            <Link href="/learn/kanji">
              <Button variant="outline" className="w-full rounded-2xl font-bold border-accent/50 hover:bg-accent/10 hover:text-accent">
                Explore Kanji
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Grammar Card */}
        <Card className="glass-card overflow-hidden group hover:border-blue-500/60 transition-all rounded-3xl md:col-span-2 relative">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all" />
          <CardContent className="p-8 relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-500/20 p-4 rounded-2xl text-blue-400 border border-blue-500/30 group-hover:scale-110 transition-transform">
                <Flame className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold">Grammar & Sentence Patterns</h2>
                <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">JLPT N5–N1 Syntax</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base mb-6 max-w-2xl">
              Detailed explanations of Japanese sentence structures, particle usage rules, and interactive example sentence cards with native audio.
            </p>
            <Link href="/learn/grammar">
              <Button variant="outline" className="w-full md:w-auto px-8 rounded-2xl font-bold border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400">
                Explore Grammar
              </Button>
            </Link>
          </CardContent>
        </Card>
      </GSAPReveal>
    </GSAPReveal>
  );
}
