import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ChartBar,
  CheckCircle,
  Lightning,
  Users,
  Trophy,
  Confetti,
} from '@phosphor-icons/react';
import { POLL_CONFIG } from './config';

const COLORS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-pink-500',
  'bg-teal-500',
];

const LIGHT_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-violet-100 text-violet-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-700',
  'bg-pink-100 text-pink-700',
  'bg-teal-100 text-teal-700',
];

function App() {
  const [votes, setVotes] = useState<number[]>(
    new Array(POLL_CONFIG.options.length).fill(0)
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Simulate other people voting for demo effect
  useEffect(() => {
    if (!hasVoted) return;

    const interval = setInterval(() => {
      setVotes((prev) => {
        const next = [...prev];
        const randomIndex = Math.floor(Math.random() * next.length);
        next[randomIndex] += Math.random() > 0.5 ? 1 : (Math.random() > 0.3 ? 1 : 0);
        return next;
      });
    }, 2000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, [hasVoted]);

  const totalVotes = votes.reduce((a, b) => a + b, 0);

  const handleVote = useCallback(() => {
    if (selected === null) return;

    setAnimatingIndex(selected);
    setVotes((prev) => {
      const next = [...prev];
      next[selected] += 1;
      return next;
    });
    setHasVoted(true);

    // Add some initial "other votes" for demo realism
    setTimeout(() => {
      setVotes((prev) => {
        const next = [...prev];
        POLL_CONFIG.options.forEach((_, i) => {
          if (i !== selected) {
            next[i] += Math.floor(Math.random() * 4) + 1;
          }
        });
        return next;
      });
      setShowResults(true);
    }, 600);

    setTimeout(() => setAnimatingIndex(null), 800);
  }, [selected]);

  const maxVotes = Math.max(...votes);

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
              {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
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
                <Lightning className="w-6 h-6 text-primary" weight="fill" />
              </div>
              <CardTitle className="text-xl sm:text-2xl leading-tight">
                {POLL_CONFIG.question}
              </CardTitle>
              <CardDescription className="mt-2">
                {hasVoted ? 'Results are updating live' : POLL_CONFIG.subtitle}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-2 space-y-3">
              {POLL_CONFIG.options.map((option, index) => {
                const percentage = totalVotes > 0 ? Math.round((votes[index] / totalVotes) * 100) : 0;
                const isWinning = votes[index] === maxVotes && totalVotes > 0;
                const isSelected = selected === index;
                const isAnimating = animatingIndex === index;

                return (
                  <button
                    key={index}
                    onClick={() => !hasVoted && setSelected(index)}
                    disabled={hasVoted}
                    className={`relative w-full text-left rounded-xl border-2 transition-all overflow-hidden ${
                      hasVoted
                        ? 'cursor-default border-border'
                        : isSelected
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/40 cursor-pointer'
                    } ${isAnimating ? 'scale-[1.02]' : ''}`}
                  >
                    {/* Background fill bar */}
                    {showResults && (
                      <div
                        className={`absolute inset-0 ${COLORS[index % COLORS.length]} opacity-10 transition-all duration-1000 ease-out`}
                        style={{ width: `${percentage}%` }}
                      />
                    )}

                    <div className="relative px-4 py-3.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Selection indicator / result badge */}
                        {!hasVoted ? (
                          <div
                            className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'border-primary bg-primary'
                                : 'border-muted-foreground/30'
                            }`}
                          >
                            {isSelected && (
                              <CheckCircle className="w-4 h-4 text-primary-foreground" weight="fill" />
                            )}
                          </div>
                        ) : (
                          <span
                            className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${LIGHT_COLORS[index % LIGHT_COLORS.length]}`}
                          >
                            {isWinning && totalVotes > 1 ? (
                              <Trophy className="w-3.5 h-3.5" weight="fill" />
                            ) : (
                              index + 1
                            )}
                          </span>
                        )}

                        <span className="text-sm font-medium truncate">{option}</span>
                      </div>

                      {showResults && (
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {votes[index]}
                          </span>
                          <span className="text-sm font-bold tabular-nums w-10 text-right">
                            {percentage}%
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}

              {/* Vote Button */}
              {!hasVoted && (
                <>
                  <Separator className="my-2" />
                  <Button
                    onClick={handleVote}
                    disabled={selected === null}
                    className="w-full gap-2"
                    size="lg"
                  >
                    <Confetti className="w-4 h-4" weight="bold" />
                    Submit Vote
                  </Button>
                </>
              )}

              {/* Voted confirmation */}
              {hasVoted && (
                <div className="text-center pt-2">
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" weight="fill" />
                    Your vote has been recorded · Results update live
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
