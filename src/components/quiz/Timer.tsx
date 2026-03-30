import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface TimerProps {
  duration: number;
  onComplete: () => void;
  isActive: boolean;
  className?: string;
}

export const Timer: React.FC<TimerProps> = ({ duration, onComplete, isActive, className }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, onComplete]);

  const progress = (timeLeft / duration) * 100;
  const isUrgent = timeLeft <= duration * 0.3;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Time Remaining</span>
        <span
          className={cn(
            'text-2xl font-bold tabular-nums',
            isUrgent ? 'text-destructive' : 'text-foreground'
          )}
        >
          {Math.ceil(timeLeft)}s
        </span>
      </div>
      <Progress
        value={progress}
        className={cn('h-3', isUrgent && 'animate-pulse')}
      />
    </div>
  );
};
