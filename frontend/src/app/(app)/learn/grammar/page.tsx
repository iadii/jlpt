'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { speakJapanese } from '@/lib/tts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, ArrowPathIcon, SpeakerWaveIcon, FireIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { GSAPReveal } from '@/components/ui/GSAPReveal';

interface ExampleSentence {
  japanese: string;
  romaji: string;
  english: string;
}

interface GrammarPoint {
  id: number;
  title: string;
  structure: string;
  explanation: string;
  jlpt_level: string;
  example_sentences: ExampleSentence[];
}

interface PaginatedResponse {
  next: string | null;
  previous: string | null;
  results: GrammarPoint[];
}

const LEVELS = ['n5', 'n4', 'n3', 'n2', 'n1'] as const;

export default function GrammarExplorer() {
  const [level, setLevel] = useState<string>('n5');
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null]);

  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  const fetchGrammar = async (cursor: string | null): Promise<PaginatedResponse> => {
    let url = `/grammar/${level}/`;
    if (cursor) {
      try {
        const cursorObj = new URL(cursor);
        const param = cursorObj.searchParams.get('cursor');
        if (param) {
          url += `?cursor=${param}`;
        }
      } catch {
        url += `?cursor=${cursor}`;
      }
    }
    const { data } = await api.get(url);
    return data.data || data;
  };

  const {
    data,
    error,
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ['grammar', level, currentCursor],
    queryFn: () => fetchGrammar(currentCursor),
    enabled: hasHydrated,
  });

  const handleLevelChange = (newLevel: string) => {
    setLevel(newLevel);
    setCurrentCursor(null);
    setPageNumber(1);
    setCursorHistory([null]);
  };

  const handleNextPage = () => {
    if (!data?.next) return;
    const nextCursor = data.next;
    setCursorHistory((prev) => [...prev, nextCursor]);
    setCurrentCursor(nextCursor);
    setPageNumber((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    if (pageNumber <= 1) return;
    const prevIndex = pageNumber - 2;
    const prevCursor = cursorHistory[prevIndex] ?? null;
    setCurrentCursor(prevCursor);
    setPageNumber((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const grammarList = data?.results || [];
  const pageSize = 50;
  const startItem = (pageNumber - 1) * pageSize + 1;
  const endItem = startItem + grammarList.length - 1;

  return (
    <GSAPReveal className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/learn">
            <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-secondary">
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="h1-premium text-3xl sm:text-4xl">Grammar & Sentence Patterns</h1>
            <p className="text-muted-foreground text-sm sm:text-base font-medium">Master sentence structures, particle rules, and syntax across JLPT N5–N1.</p>
          </div>
        </div>
      </div>

      {/* Level Selector & Info Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-2 p-1.5 bg-card/80 backdrop-blur-2xl rounded-2xl border border-border/60 shadow-lg">
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => handleLevelChange(l)}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black uppercase transition-all duration-300 ${
                level === l 
                  ? 'bg-gradient-to-r from-matcha to-emerald-500 text-slate-950 shadow-lg shadow-matcha/25 scale-105' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Page status pill */}
        {!isLoading && !isError && grammarList.length > 0 && (
          <div className="text-xs sm:text-sm font-extrabold text-muted-foreground bg-card/80 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-border/60 shadow-sm flex items-center gap-2">
            
            Showing <span className="text-matcha font-black">{startItem}–{endItem}</span> patterns (Page {pageNumber})
          </div>
        )}
      </div>

      {/* Content List */}
      {isLoading || isFetching ? (
        <div className="flex justify-center p-20">
          <ArrowPathIcon className="h-10 w-10 animate-spin text-matcha" />
        </div>
      ) : isError ? (
        <div className="text-center text-destructive p-10 bg-destructive/10 rounded-3xl border border-destructive/20">
          <p className="font-bold text-lg">Failed to load Grammar points.</p>
          <p className="text-sm text-muted-foreground mt-1">
            {error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.'}
          </p>
        </div>
      ) : (
        <>
          <GSAPReveal key={`${level}-${pageNumber}`} staggerChildren delay={0.05} className="space-y-6">
            {grammarList.map((g) => (
              <Card key={g.id} className="enterprise-card rounded-3xl border-matcha/30">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-matcha bg-matcha/15 px-3 py-1 rounded-xl border border-matcha/20">
                        {g.jlpt_level.toUpperCase()} Grammar
                      </span>
                      <CardTitle className="text-2xl font-black text-foreground">{g.title}</CardTitle>
                    </div>
                  </div>

                  <div className="bg-secondary/80 text-matcha px-5 py-2.5 rounded-2xl text-sm font-mono font-black border border-matcha/30 w-fit shadow-sm">
                    {g.structure}
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      
                      Usage Explanation
                    </p>
                    <p className="text-foreground/90 text-base leading-relaxed font-medium pl-1">
                      {g.explanation}
                    </p>
                  </div>

                  {g.example_sentences && g.example_sentences.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <FireIcon className="h-4 w-4 text-tokyo-gold" />
                        Example Sentences
                      </p>
                      
                      <div className="grid grid-cols-1 gap-3">
                        {g.example_sentences.map((ex, idx) => (
                          <div key={idx} className="bg-secondary/40 p-5 rounded-2xl border border-border/50 space-y-1.5 flex items-start justify-between gap-4 shadow-sm">
                            <div className="space-y-1">
                              <p className="text-lg font-black text-foreground tracking-wide">
                                {ex.japanese}
                              </p>
                              {ex.romaji && (
                                <p className="text-xs text-muted-foreground italic font-mono font-medium">
                                  {ex.romaji}
                                </p>
                              )}
                              <p className="text-sm font-bold text-foreground/80 pt-0.5">
                                {ex.english}
                              </p>
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => speakJapanese(ex.japanese)}
                              title="Listen Japanese Audio"
                              className="h-10 w-10 text-muted-foreground hover:text-matcha hover:bg-matcha/15 rounded-full transition-colors shrink-0 shadow-sm"
                            >
                              <SpeakerWaveIcon className="h-5 w-5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </GSAPReveal>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between pt-8 border-t border-border/40">
            <Button
              variant="outline"
              onClick={handlePrevPage}
              disabled={pageNumber <= 1 || isFetching}
              className="gap-2 rounded-2xl font-bold px-6 py-5 shadow-sm"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-muted-foreground">
                Page <span className="text-matcha font-black text-lg">{pageNumber}</span>
              </span>
            </div>

            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={!data?.next || isFetching}
              className="gap-2 rounded-2xl font-bold px-6 py-5 shadow-sm"
            >
              Next
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </GSAPReveal>
  );
}
