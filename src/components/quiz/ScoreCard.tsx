import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScoreCardProps {
  isCorrect: boolean;
  pointsEarned: number;
  totalScore: number;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ isCorrect, pointsEarned, totalScore }) => {
  return (
    <Card className={cn(
      'border-4',
      isCorrect ? 'border-success bg-success/10' : 'border-destructive bg-destructive/10'
    )}>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center gap-6 text-center">
          {isCorrect ? (
            <CheckCircle2 className="w-24 h-24 text-success" />
          ) : (
            <XCircle className="w-24 h-24 text-destructive" />
          )}
          
          <div>
            <h2 className={cn(
              'text-3xl font-bold mb-2',
              isCorrect ? 'text-success' : 'text-destructive'
            )}>
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {isCorrect ? `+${pointsEarned} points` : 'No points earned'}
            </p>
          </div>

          <div className="w-full pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-1">Current Score</p>
            <p className="text-4xl font-bold text-primary">{totalScore}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
