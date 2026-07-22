'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { speakJapanese } from '@/lib/tts';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, ArrowPathIcon, SpeakerWaveIcon, EyeIcon, XMarkIcon, Square3Stack3DIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { GSAPReveal } from '@/components/ui/GSAPReveal';

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
    <GSAPReveal className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/learn">
            <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-secondary">
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="h1-premium text-3xl sm:text-4xl">Kanji Explorer</h1>
            <p className="text-muted-foreground text-sm sm:text-base font-medium">Master character readings, stroke order, and meanings across JLPT N5–N1.</p>
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
                  ? 'bg-gradient-to-r from-fuji-ice to-accent text-white shadow-lg shadow-fuji-ice/25 scale-105' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Page status pill */}
        {!isLoading && !isError && kanjiList.length > 0 && (
          <div className="text-xs sm:text-sm font-extrabold text-muted-foreground bg-card/80 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-border/60 shadow-sm flex items-center gap-2">
            
            Showing <span className="text-fuji-ice font-black">{startItem}–{endItem}</span> characters (Page {pageNumber})
          </div>
        )}
      </div>

      {/* Content Grid */}
      {isLoading || isFetching ? (
        <div className="flex justify-center p-20">
          <ArrowPathIcon className="h-10 w-10 animate-spin text-fuji-ice" />
        </div>
      ) : isError ? (
        <div className="text-center text-destructive p-10 bg-destructive/10 rounded-3xl border border-destructive/20">
          <p className="font-bold text-lg">Failed to load Kanji characters.</p>
          <p className="text-sm text-muted-foreground mt-1">
            {error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.'}
          </p>
        </div>
      ) : (
        <>
          <GSAPReveal key={`${level}-${pageNumber}`} staggerChildren delay={0.05} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {kanjiList.map((k) => (
              <Card key={k.id} className="enterprise-card rounded-3xl group border-fuji-ice/30">
                <CardContent className="p-6 space-y-4">
                  {/* Top Bar */}
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-black text-fuji-ice bg-fuji-ice/15 px-3 py-1 rounded-xl uppercase tracking-wider flex items-center gap-1 border border-fuji-ice/20">
                      <Square3Stack3DIcon className="h-3.5 w-3.5" />
                      {k.stroke_count} Strokes
                    </span>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedKanji(k)}
                        title="View Stroke Order Diagram"
                        className="h-9 w-9 text-muted-foreground hover:text-fuji-ice hover:bg-fuji-ice/15 rounded-full transition-colors"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => speakJapanese(k.character)}
                        title="Listen Pronunciation"
                        className="h-9 w-9 text-muted-foreground hover:text-fuji-ice hover:bg-fuji-ice/15 rounded-full transition-colors"
                      >
                        <SpeakerWaveIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Character Display */}
                  <div className="text-center py-4 space-y-1">
                    <h2 className="text-6xl font-black tracking-tight text-foreground transition-transform duration-300">
                      {k.character}
                    </h2>
                    <p className="text-base font-extrabold text-fuji-ice">
                      {k.meaning}
                    </p>
                  </div>

                  {/* Readings */}
                  <div className="border-t border-border/50 pt-3 space-y-1.5 text-xs font-semibold">
                    {k.onyomi && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-muted-foreground uppercase text-[10px] w-14 font-black">Onyomi:</span>
                        <span className="text-foreground">{k.onyomi}</span>
                      </div>
                    )}
                    {k.kunyomi && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-muted-foreground uppercase text-[10px] w-14 font-black">Kunyomi:</span>
                        <span className="text-foreground">{k.kunyomi}</span>
                      </div>
                    )}
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
              className="gap-2 rounded-2xl font-bold px-6 py-5 shadow-sm"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-muted-foreground">
                Page <span className="text-fuji-ice font-black text-lg">{pageNumber}</span>
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

      {/* Kanji Stroke Order Modal */}
      {selectedKanji && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xl p-4 animate-in fade-in">
          <div className="enterprise-card max-w-md w-full p-8 space-y-6 relative border-fuji-ice/50 shadow-2xl rounded-3xl">
            <button
              onClick={() => setSelectedKanji(null)}
              className="absolute top-5 right-5 text-muted-foreground hover:text-foreground p-2 rounded-2xl hover:bg-secondary transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>

            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-widest font-black text-fuji-ice bg-fuji-ice/15 px-3.5 py-1 rounded-full border border-fuji-ice/20">
                {selectedKanji.jlpt_level.toUpperCase()} Kanji • {selectedKanji.stroke_count} Strokes
              </span>
              <h3 className="text-7xl font-black pt-2 text-foreground">{selectedKanji.character}</h3>
              <p className="text-xl font-extrabold text-fuji-ice">{selectedKanji.meaning}</p>
            </div>

            {/* SVG Stroke Order Animation Canvas */}
            <div className="bg-secondary/50 rounded-2xl p-6 flex flex-col items-center justify-center border border-border/60 space-y-3">
              <div className="w-44 h-44 relative bg-card rounded-2xl border border-fuji-ice/40 flex items-center justify-center shadow-inner">
                <svg viewBox="0 0 100 100" className="w-36 h-36 stroke-fuji-ice fill-none stroke-[4] stroke-linecap-round stroke-linejoin-round">
                  <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
                  <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
                  <text
                    x="50"
                    y="72"
                    textAnchor="middle"
                    className="fill-foreground stroke-none font-black text-[70px] select-none"
                  >
                    {selectedKanji.character}
                  </text>
                </svg>
              </div>
              <p className="text-xs text-muted-foreground font-extrabold">Stroke order diagram preview</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm bg-secondary/40 p-4 rounded-2xl border border-border/50">
              <div>
                <p className="text-[10px] text-muted-foreground font-black uppercase">Onyomi</p>
                <p className="font-extrabold text-foreground mt-0.5">{selectedKanji.onyomi || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-black uppercase">Kunyomi</p>
                <p className="font-extrabold text-foreground mt-0.5">{selectedKanji.kunyomi || '—'}</p>
              </div>
            </div>

            <Button 
              variant="premium" 
              onClick={() => speakJapanese(selectedKanji.character)} 
              className="w-full gap-2 rounded-2xl font-bold py-6"
            >
              <SpeakerWaveIcon className="h-5 w-5" />
              Listen Pronunciation
            </Button>
          </div>
        </div>
      )}
    </GSAPReveal>
  );
}
