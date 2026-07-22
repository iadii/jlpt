'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { speakJapanese } from '@/lib/tts';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2, Volume2 } from 'lucide-react';
import Link from 'next/link';
import { GSAPReveal } from '@/components/ui/GSAPReveal';

interface Vocabulary {
  id: number;
  kanji: string;
  kana: string;
  romaji: string;
  meaning: string;
  part_of_speech: string;
  jlpt_level: string;
}

interface PaginatedResponse {
  next: string | null;
  previous: string | null;
  results: Vocabulary[];
}

const LEVELS = ['n5', 'n4', 'n3', 'n2', 'n1'] as const;

export default function VocabularyExplorer() {
  const [level, setLevel] = useState<string>('n5');
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null]);
  
  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  const fetchVocabulary = async (cursor: string | null): Promise<PaginatedResponse> => {
    let url = `/words/${level}/`;
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
    queryKey: ['vocabulary', level, currentCursor],
    queryFn: () => fetchVocabulary(currentCursor),
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

  const words = data?.results || [];
  const pageSize = 50;
  const startItem = (pageNumber - 1) * pageSize + 1;
  const endItem = startItem + words.length - 1;

  return (
    <GSAPReveal className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/learn">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="h1-premium text-3xl sm:text-4xl">Vocabulary Explorer</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Browse 6,900+ Japanese words across the JLPT spectrum with page navigation.</p>
          </div>
        </div>
      </div>

      {/* Level Selector & Info Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-2 p-1.5 bg-secondary/60 backdrop-blur-md rounded-2xl w-fit border border-border/50 shadow-inner">
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => handleLevelChange(l)}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase transition-all duration-200 ${
                level === l 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Page status pill */}
        {!isLoading && !isError && words.length > 0 && (
          <div className="text-sm font-semibold text-muted-foreground bg-card/80 backdrop-blur-md px-4 py-2 rounded-xl border border-border/60 shadow-sm">
            Showing <span className="text-primary font-black">{startItem}–{endItem}</span> words (Page {pageNumber})
          </div>
        )}
      </div>

      {/* Content Grid */}
      {isLoading || isFetching ? (
        <div className="flex justify-center p-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="text-center text-destructive p-8 bg-destructive/10 rounded-2xl border border-destructive/20">
          <p className="font-medium">Failed to load vocabulary.</p>
          <p className="text-sm text-muted-foreground mt-1">
            {error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.'}
          </p>
        </div>
      ) : (
        <>
          <GSAPReveal key={`${level}-${pageNumber}`} staggerChildren delay={0.05} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {words.map((word) => (
              <Card key={word.id} className="glass-card hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 rounded-2xl overflow-hidden group">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg w-fit uppercase tracking-wider">
                        {word.part_of_speech}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => speakJapanese(word.kanji || word.kana)}
                      title="Listen Pronunciation"
                      className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-center py-3">
                    <h2 className="text-4xl font-black mb-1.5 tracking-wide text-foreground group-hover:scale-105 transition-transform duration-300">
                      {word.kanji || word.kana}
                    </h2>
                    {word.kanji && (
                      <p className="text-base text-muted-foreground font-semibold">
                        {word.kana}
                      </p>
                    )}
                    {word.romaji && (
                      <p className="text-xs text-muted-foreground/70 italic mt-1 font-mono">
                        {word.romaji}
                      </p>
                    )}
                  </div>
                  
                  <div className="border-t border-border/50 pt-3 text-center">
                    <p className="text-foreground/90 font-bold text-sm">
                      {word.meaning}
                    </p>
                  </div>
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
              className="gap-2 rounded-xl font-bold"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-muted-foreground">
                Page <span className="text-primary font-black">{pageNumber}</span>
              </span>
            </div>

            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={!data?.next || isFetching}
              className="gap-2 rounded-xl font-bold"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </GSAPReveal>
  );
}
