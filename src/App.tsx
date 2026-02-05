import { useState, useCallback, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  ChartBar,
  CheckCircle,
  Baby,
  Users,
  Trophy,
  Confetti,
  CalendarBlank,
} from '@phosphor-icons/react';
import { POLL_CONFIG } from './config';

const BAR_COLORS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-pink-500',
  'bg-teal-500',
];

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatShortDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function App() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [hasVoted, setHasVoted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Track votes by date string
  const [dateVotes, setDateVotes] = useState<Record<string, number>>({});

  const dateMin = useMemo(() => new Date(POLL_CONFIG.dateRange.start), []);
  const dateMax = useMemo(() => new Date(POLL_CONFIG.dateRange.end), []);

  // Simulate other people's votes for demo
  useEffect(() => {
    if (!hasVoted) return;

    // Initial burst of "other votes"
    const initialVotes: Record<string, number> = {};
    const baseDate = new Date(POLL_CONFIG.dateRange.start);
    const endDate = new Date(POLL_CONFIG.dateRange.end);
    const range = endDate.getTime() - baseDate.getTime();

    for (let i = 0; i < 12; i++) {
      const randomDate = new Date(baseDate.getTime() + Math.random() * range);
      const key = randomDate.toISOString().split('T')[0];
      initialVotes[key] = (initialVotes[key] || 0) + 1;
    }

    setDateVotes((prev) => {
      const next = { ...prev };
      Object.entries(initialVotes).forEach(([k, v]) => {
        next[k] = (next[k] || 0) + v;
      });
      return next;
    });

    // Trickle in more votes
    const interval = setInterval(() => {
      const randomDate = new Date(baseDate.getTime() + Math.random() * range);
      const key = randomDate.toISOString().split('T')[0];
      setDateVotes((prev) => ({
        ...prev,
        [key]: (prev[key] || 0) + 1,
      }));
    }, 2500 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, [hasVoted]);

  const totalVotes = Object.values(dateVotes).reduce((a, b) => a + b, 0);

  // Sort votes for display (top dates)
  const sortedVotes = useMemo(() => {
    return Object.entries(dateVotes)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8);
  }, [dateVotes]);

  const maxVotes = sortedVotes.length > 0 ? sortedVotes[0][1] : 0;

  const handleVote = useCallback(() => {
    if (!selectedDate) return;

    const key = selectedDate.toISOString().split('T')[0];
    setDateVotes((prev) => ({
      ...prev,
      [key]: (prev[key] || 0) + 1,
    }));
    setHasVoted(true);

    setTimeout(() => setShowResults(true), 600);
  }, [selectedDate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-2xl mx-auto px-4 flex h-14 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <ChartBar className="w-5 h-5 text-primary-foreground" weight="fill" />
            </div>
            <span className="text-sm font-semibold">{POLL_CONFIG.title}</span>
          </div>
          {totalVotes > 0 && (
            <Badge variant="secondary" className="gap-1.5 font-normal tabular-nums">
              <Users className="w-3 h-3" weight="bold" />
              {totalVotes} guess{totalVotes !== 1 ? 'es' : ''}
            </Badge>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 sm:py-12">
        <div className="space-y-6">
          {/* Question Card */}
          <Card>
            <CardHeader className="text-center pb-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mx-auto mb-3">
                <Baby className="w-6 h-6 text-primary" weight="fill" />
              </div>
              <CardTitle className="text-xl sm:text-2xl leading-tight">
                {POLL_CONFIG.question}
              </CardTitle>
              <CardDescription className="mt-2">
                {hasVoted ? 'Results are updating live' : POLL_CONFIG.subtitle}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-2 space-y-4">
              {/* Date Picker */}
              {!hasVoted && (
                <>
                  <div className="flex justify-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="lg"
                          className={`w-full max-w-xs gap-2 justify-start text-left font-normal ${
                            !selectedDate ? 'text-muted-foreground' : ''
                          }`}
                        >
                          <CalendarBlank className="w-4 h-4" weight="duotone" />
                          {selectedDate ? formatDate(selectedDate) : 'Pick a date...'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => date < dateMin || date > dateMax}
                          defaultMonth={dateMin}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <Separator />

                  <Button
                    onClick={handleVote}
                    disabled={!selectedDate}
                    className="w-full gap-2"
                    size="lg"
                  >
                    <Confetti className="w-4 h-4" weight="bold" />
                    Lock In My Guess
                  </Button>
                </>
              )}

              {/* Results */}
              {showResults && sortedVotes.length > 0 && (
                <div className="space-y-2.5">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Top Guesses
                  </p>
                  {sortedVotes.map(([dateKey, count], index) => {
                    const date = new Date(dateKey + 'T12:00:00');
                    const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                    const isTop = index === 0;
                    const isUserPick = selectedDate && dateKey === selectedDate.toISOString().split('T')[0];

                    return (
                      <div
                        key={dateKey}
                        className={`relative rounded-lg border overflow-hidden transition-all ${
                          isUserPick ? 'border-primary ring-1 ring-primary/20' : 'border-border'
                        }`}
                      >
                        {/* Background bar */}
                        <div
                          className={`absolute inset-0 ${BAR_COLORS[index % BAR_COLORS.length]} opacity-10 transition-all duration-1000 ease-out`}
                          style={{ width: `${maxVotes > 0 ? (count / maxVotes) * 100 : 0}%` }}
                        />

                        <div className="relative px-4 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-muted-foreground w-5">
                              {isTop ? (
                                <Trophy className="w-4 h-4 text-amber-500" weight="fill" />
                              ) : (
                                `#${index + 1}`
                              )}
                            </span>
                            <span className="text-sm font-medium">
                              {formatShortDate(date)}
                            </span>
                            {isUserPick && (
                              <Badge variant="outline" className="text-xs h-5 gap-1">
                                <CheckCircle className="w-3 h-3" weight="fill" />
                                You
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground tabular-nums">
                              {count} vote{count !== 1 ? 's' : ''}
                            </span>
                            <span className="text-sm font-bold tabular-nums w-10 text-right">
                              {percentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Voted confirmation */}
              {hasVoted && (
                <div className="text-center pt-2">
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" weight="fill" />
                    Your guess: <strong>{selectedDate ? formatDate(selectedDate) : ''}</strong> · Results update live
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="max-w-2xl mx-auto px-4 py-4 text-center">
          <p className="text-xs text-muted-foreground">{POLL_CONFIG.footer}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
