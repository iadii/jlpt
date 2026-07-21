'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { speakJapanese } from '@/lib/tts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2, Volume2, Sparkles, Flame } from 'lucide-react';
import Link from 'next/link';

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
            <h1 className="h1-premium text-3xl">Grammar & Sentence Patterns</h1>
            <p className="text-muted-foreground">Master sentence structures, particle rules, and syntax across JLPT N5–N1.</p>
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
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Page status pill */}
        {!isLoading && !isError && grammarList.length > 0 && (
          <div className="text-sm font-medium text-muted-foreground bg-secondary/30 px-4 py-2 rounded-lg border border-border/40">
            Showing <span className="text-foreground font-bold">{startItem}–{endItem}</span> patterns (Page {pageNumber})
          </div>
        )}
      </div>

      {/* Content List */}
      {isLoading || isFetching ? (
        <div className="flex justify-center p-16">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : isError ? (
        <div className="text-center text-destructive p-8 bg-destructive/10 rounded-xl">
          <p className="font-medium">Failed to load Grammar points.</p>
          <p className="text-sm text-muted-foreground mt-1">
            {error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.'}
          </p>
        </div>
      ) : grammarList.length === 0 ? (
        <div className="text-center p-12 bg-secondary/20 rounded-xl">
          <p className="text-muted-foreground">No Grammar points found for level {level.toUpperCase()}.</p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {grammarList.map((g) => (
              <Card key={g.id} className="glass-card hover:border-blue-500/40 transition-all border border-border/50">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md">
                        {g.jlpt_level.toUpperCase()} Grammar
                      </span>
                      <CardTitle className="text-2xl font-bold">{g.title}</CardTitle>
                    </div>
                  </div>

                  <div className="bg-secondary/60 text-blue-400 px-4 py-2 rounded-xl text-sm font-mono font-bold border border-blue-500/20 w-fit">
                    {g.structure}
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {/* Explanation */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-blue-400" />
                      Usage Explanation
                    </p>
                    <p className="text-foreground/90 text-base leading-relaxed pl-1">
                      {g.explanation}
                    </p>
                  </div>

                  {/* Example Sentences */}
                  {g.example_sentences && g.example_sentences.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Flame className="h-3.5 w-3.5 text-orange-400" />
                        Example Sentences
                      </p>
                      
                      <div className="grid grid-cols-1 gap-3">
                        {g.example_sentences.map((ex, idx) => (
                          <div key={idx} className="bg-secondary/30 p-4 rounded-xl border border-border/40 space-y-1.5 flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <p className="text-lg font-bold text-foreground tracking-wide">
                                {ex.japanese}
                              </p>
                              {ex.romaji && (
                                <p className="text-xs text-muted-foreground italic font-medium">
                                  {ex.romaji}
                                </p>
                              )}
                              <p className="text-sm text-foreground/80 pt-0.5">
                                {ex.english}
                              </p>
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => speakJapanese(ex.japanese)}
                              title="Listen Japanese Audio"
                              className="h-9 w-9 text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 rounded-full transition-colors shrink-0"
                            >
                              <Volume2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
