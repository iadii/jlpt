'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { speakJapanese } from '@/lib/tts';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2, Volume2, Eye, X, Layers } from 'lucide-react';
import Link from 'next/link';

interface KanjiItem {
  id: number;
  character: string;
  onyomi: string;
  kunyomi: string;
  meaning: string;
  stroke_count: number;
  jlpt_level: string;
}

interface PaginatedResponse {
  next: string | null;
  previous: string | null;
  results: KanjiItem[];
}

const LEVELS = ['n5', 'n4', 'n3', 'n2', 'n1'] as const;

export default function KanjiExplorer() {
  const [level, setLevel] = useState<string>('n5');
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null]);
  const [selectedKanji, setSelectedKanji] = useState<KanjiItem | null>(null);

  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  const fetchKanji = async (cursor: string | null): Promise<PaginatedResponse> => {
    let url = `/kanji/${level}/`;
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
    queryKey: ['kanji', level, currentCursor],
    queryFn: () => fetchKanji(currentCursor),
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

  const kanjiList = data?.results || [];
  const pageSize = 50;
  const startItem = (pageNumber - 1) * pageSize + 1;
  const endItem = startItem + kanjiList.length - 1;

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
            <h1 className="h1-premium text-3xl">Kanji Explorer</h1>
            <p className="text-muted-foreground">Master character readings, stroke order, and meanings across JLPT N5–N1.</p>
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
                  ? 'bg-accent text-accent-foreground shadow-md' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Page status pill */}
        {!isLoading && !isError && kanjiList.length > 0 && (
          <div className="text-sm font-medium text-muted-foreground bg-secondary/30 px-4 py-2 rounded-lg border border-border/40">
            Showing <span className="text-foreground font-bold">{startItem}–{endItem}</span> characters (Page {pageNumber})
          </div>
        )}
      </div>

      {/* Content Grid */}
      {isLoading || isFetching ? (
        <div className="flex justify-center p-16">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : isError ? (
        <div className="text-center text-destructive p-8 bg-destructive/10 rounded-xl">
          <p className="font-medium">Failed to load Kanji characters.</p>
          <p className="text-sm text-muted-foreground mt-1">
            {error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.'}
          </p>
        </div>
      ) : kanjiList.length === 0 ? (
        <div className="text-center p-12 bg-secondary/20 rounded-xl">
          <p className="text-muted-foreground">No Kanji found for level {level.toUpperCase()}.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {kanjiList.map((k) => (
              <Card key={k.id} className="glass-card hover:border-accent/40 transition-all hover:-translate-y-1 relative group">
                <CardContent className="p-6 space-y-4">
                  {/* Top Bar: Strokes + Audio + Stroke Order Inspection */}
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-md flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5" />
                      {k.stroke_count} Strokes
                    </span>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedKanji(k)}
                        title="View Stroke Order Diagram"
                        className="h-8 w-8 text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-full transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => speakJapanese(k.character)}
                        title="Listen Pronunciation"
                        className="h-8 w-8 text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-full transition-colors"
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Character Display */}
                  <div className="text-center py-3">
                    <h2 className="text-6xl font-bold tracking-tight text-foreground group-hover:scale-105 transition-transform duration-300">
                      {k.character}
                    </h2>
                    <p className="text-lg font-bold text-accent mt-2">
                      {k.meaning}
                    </p>
                  </div>

                  {/* Readings */}
                  <div className="border-t border-border/50 pt-3 space-y-2 text-xs">
                    {k.onyomi && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-muted-foreground font-semibold uppercase text-[10px] w-12">Onyomi:</span>
                        <span className="font-medium text-foreground">{k.onyomi}</span>
                      </div>
                    )}
                    {k.kunyomi && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-muted-foreground font-semibold uppercase text-[10px] w-12">Kunyomi:</span>
                        <span className="font-medium text-foreground">{k.kunyomi}</span>
                      </div>
                    )}
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

      {/* Kanji Stroke Order Visualization Modal */}
      {selectedKanji && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="glass-card max-w-md w-full p-6 space-y-6 relative border-accent/40 shadow-2xl">
            <button
              onClick={() => setSelectedKanji(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-secondary transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-wider font-bold text-accent bg-accent/10 px-3 py-1 rounded-full">
                {selectedKanji.jlpt_level.toUpperCase()} Kanji • {selectedKanji.stroke_count} Strokes
              </span>
              <h3 className="text-7xl font-bold pt-2">{selectedKanji.character}</h3>
              <p className="text-xl font-medium text-accent">{selectedKanji.meaning}</p>
            </div>

            {/* SVG Stroke Order Animation Canvas */}
            <div className="bg-secondary/40 rounded-2xl p-6 flex flex-col items-center justify-center border border-border/50 space-y-4">
              <div className="w-44 h-44 relative bg-background/80 rounded-xl border border-accent/30 flex items-center justify-center shadow-inner">
                {/* SVG Stroke Order Display Grid */}
                <svg viewBox="0 0 100 100" className="w-36 h-36 stroke-accent fill-none stroke-[4] stroke-linecap-round stroke-linejoin-round">
                  {/* Guideline Grid */}
                  <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
                  <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
                  {/* Render Character */}
                  <text
                    x="50"
                    y="72"
                    textAnchor="middle"
                    className="fill-foreground stroke-none font-bold text-[70px] select-none"
                  >
                    {selectedKanji.character}
                  </text>
                </svg>
              </div>
              <p className="text-xs text-muted-foreground font-medium">Stroke order diagram preview</p>
            </div>

            {/* Readings inside Modal */}
            <div className="grid grid-cols-2 gap-3 text-sm bg-secondary/20 p-4 rounded-xl">
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Onyomi</p>
                <p className="font-bold text-foreground mt-0.5">{selectedKanji.onyomi || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Kunyomi</p>
                <p className="font-bold text-foreground mt-0.5">{selectedKanji.kunyomi || '—'}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button 
                variant="premium" 
                onClick={() => speakJapanese(selectedKanji.character)} 
                className="w-full gap-2"
              >
                <Volume2 className="h-4 w-4" />
                Listen Pronunciation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
