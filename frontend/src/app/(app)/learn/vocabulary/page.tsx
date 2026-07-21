'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2, Volume2 } from 'lucide-react';
import Link from 'next/link';

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/learn">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="h1-premium text-3xl">Vocabulary Explorer</h1>
            <p className="text-muted-foreground">Browse words across the JLPT spectrum with page navigation.</p>
          </div>
        </div>
      </div>

      {/* Level Selector & Info Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl w-fit">
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => handleLevelChange(l)}
              className={`px-6 py-2 rounded-lg text-sm font-bold uppercase transition-all ${
                level === l 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Page status pill */}
        {!isLoading && !isError && words.length > 0 && (
          <div className="text-sm font-medium text-muted-foreground bg-secondary/30 px-4 py-2 rounded-lg border border-border/40">
            Showing <span className="text-foreground font-bold">{startItem}–{endItem}</span> words (Page {pageNumber})
          </div>
        )}
      </div>

      {/* Content Grid */}
      {isLoading || isFetching ? (
        <div className="flex justify-center p-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="text-center text-destructive p-8 bg-destructive/10 rounded-xl">
          <p className="font-medium">Failed to load vocabulary.</p>
          <p className="text-sm text-muted-foreground mt-1">
            {error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {words.map((word) => (
              <Card key={word.id} className="glass-card hover:border-primary/30 transition-all hover:-translate-y-1">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md w-fit">
                        {word.part_of_speech}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full">
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-center py-4">
                    <h2 className="text-4xl font-bold mb-2 tracking-wide">
                      {word.kanji || word.kana}
                    </h2>
                    {word.kanji && (
                      <p className="text-lg text-muted-foreground font-medium">
                        {word.kana}
                      </p>
                    )}
                    {word.romaji && (
                      <p className="text-sm text-muted-foreground/70 italic mt-1">
                        {word.romaji}
                      </p>
                    )}
                  </div>
                  
                  <div className="border-t border-border/50 pt-4 text-center">
                    <p className="text-foreground/90 font-medium">
                      {word.meaning}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between pt-8 border-t border-border/40">
            <Button
              variant="outline"
              onClick={handlePrevPage}
              disabled={pageNumber <= 1 || isFetching}
              className="gap-2 rounded-xl"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Page <span className="text-foreground font-bold">{pageNumber}</span>
              </span>
            </div>

            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={!data?.next || isFetching}
              className="gap-2 rounded-xl"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
