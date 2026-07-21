'use client';

import { useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Volume2 } from 'lucide-react';
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

export default function VocabularyExplorer() {
  const [level, setLevel] = useState('n5');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const fetchVocabulary = async ({ pageParam = null }): Promise<PaginatedResponse> => {
    // If we have a pageParam (the next URL), we extract the cursor from it
    let url = `/words/${level}/`;
    if (pageParam) {
      const cursorObj = new URL(pageParam);
      const cursor = cursorObj.searchParams.get('cursor');
      if (cursor) {
        url += `?cursor=${cursor}`;
      }
    }
    const { data } = await api.get(url);
    // If the backend wraps paginated responses in our ApiResponse format, it might be data.data.
    // If it uses raw DRF pagination, it's just data.
    return data.data || data; 
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['vocabulary', level],
    queryFn: fetchVocabulary,
    getNextPageParam: (lastPage) => lastPage.next,
    initialPageParam: null,
    enabled: mounted,
  });

  const words = data?.pages.flatMap((page) => page.results) || [];

  const levels = ['n5', 'n4', 'n3', 'n2', 'n1'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Link href="/learn">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="h1-premium text-3xl">Vocabulary Explorer</h1>
          <p className="text-muted-foreground">Browse all 8,000+ words across the JLPT spectrum.</p>
        </div>
      </div>

      {/* Level Selector */}
      <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl w-fit">
        {levels.map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
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

      {/* Grid */}
      {status === 'pending' ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : status === 'error' ? (
        <div className="text-center text-destructive p-8 bg-destructive/10 rounded-xl flex flex-col gap-2 items-center">
          <p>Error loading vocabulary. Please try again.</p>
          <p className="text-sm font-mono bg-background p-2 rounded">{error?.message || JSON.stringify(error)}</p>
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

          <div className="flex justify-center pt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
              className="w-full max-w-sm rounded-full"
            >
              {isFetchingNextPage
                ? 'Loading more...'
                : hasNextPage
                ? 'Load More'
                : 'End of List'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
