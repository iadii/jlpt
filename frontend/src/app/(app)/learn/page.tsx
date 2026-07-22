'use client';

import { BookOpenIcon, FireIcon, TrophyIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function LearnPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
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
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="space-y-10 max-w-7xl mx-auto pb-32 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center space-y-4 py-4 gsap-stagger-item">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mx-auto">
          JLPT Mastery Curriculum
        </div>
        <h1 className="h1-premium text-4xl sm:text-5xl lg:text-6xl">Curriculum & Explorers</h1>
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
          Master Japanese vocabulary, study Kanji stroke order, and learn grammar syntax patterns across JLPT N5 to N1.
        </p>
      </div>

      {/* Curriculum Track Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Vocabulary Track */}
        <div className="gsap-stagger-item enterprise-card p-8 relative overflow-hidden group flex flex-col justify-between">
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="bg-primary/10 p-4 rounded-xl text-primary border border-primary/20 transition-transform">
                <BookOpenIcon className="h-8 w-8" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                6,920+ Words
              </span>
            </div>

            <h2 className="text-2xl font-semibold text-foreground mt-4">Vocabulary Explorer</h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Explore words categorized by JLPT levels with readings, meanings, parts of speech, and native TTS audio pronunciation.
            </p>
          </div>

          <div className="pt-8 relative z-10">
            <Link href="/learn/vocabulary">
              <Button className="w-full gap-3 rounded-xl py-6 hover:bg-primary/90 hover:text-primary-foreground transition-colors">
                Explore Vocabulary
                <ArrowRightIcon className="h-5 w-5 ml-auto" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Kanji Track */}
        <div className="gsap-stagger-item enterprise-card p-8 relative overflow-hidden group flex flex-col justify-between">
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="bg-blue-50 p-4 rounded-xl text-blue-500 border border-blue-100 transition-transform">
                <TrophyIcon className="h-8 w-8" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-500 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                2,210+ Kanji
              </span>
            </div>

            <h2 className="text-2xl font-semibold text-foreground mt-4">Kanji Explorer</h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Master essential Kanji characters with Onyomi, Kunyomi, stroke counts, and interactive SVG stroke order diagrams.
            </p>
          </div>

          <div className="pt-8 relative z-10">
            <Link href="/learn/kanji">
              <Button variant="outline" className="w-full gap-3 rounded-xl py-6 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                Explore Kanji
                <ArrowRightIcon className="h-5 w-5 ml-auto" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Grammar Track */}
        <div className="gsap-stagger-item enterprise-card p-8 relative overflow-hidden group flex flex-col justify-between">
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="bg-emerald-50 p-4 rounded-xl text-emerald-500 border border-emerald-100 transition-transform">
                <FireIcon className="h-8 w-8" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                JLPT N5–N1 Syntax
              </span>
            </div>

            <h2 className="text-2xl font-semibold text-foreground mt-4">Grammar & Sentence Patterns</h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Detailed explanations of Japanese sentence structures, particle usage rules, and interactive example sentence cards with native audio.
            </p>
          </div>

          <div className="pt-8 relative z-10">
            <Link href="/learn/grammar">
              <Button variant="outline" className="w-full md:w-auto px-10 gap-3 rounded-xl py-6 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                Explore Grammar
                <ArrowRightIcon className="h-5 w-5 ml-auto" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
