import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AnswerButtonProps {
  index: number;
  text: string;
  onClick: () => void;
  disabled?: boolean;
  selected?: boolean;
  showCorrect?: boolean;
  isCorrect?: boolean;
}

const answerColors = [
  { bg: 'bg-answer-1', text: 'text-answer-1-foreground', border: 'border-answer-1' },
  { bg: 'bg-answer-2', text: 'text-answer-2-foreground', border: 'border-answer-2' },
  { bg: 'bg-answer-3', text: 'text-answer-3-foreground', border: 'border-answer-3' },
  { bg: 'bg-answer-4', text: 'text-answer-4-foreground', border: 'border-answer-4' },
];

const shapes = ['triangle', 'diamond', 'circle', 'square'];

export const AnswerButton: React.FC<AnswerButtonProps> = ({
  index,
  text,
  onClick,
  disabled = false,
  selected = false,
  showCorrect = false,
  isCorrect = false,
}) => {
  const colorScheme = answerColors[index % 4];
  const shape = shapes[index % 4];

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'h-auto min-h-[80px] w-full p-6 text-lg font-bold transition-all duration-200',
        'hover:scale-105 active:scale-95',
        colorScheme.bg,
        colorScheme.text,
        selected && 'ring-4 ring-primary ring-offset-2',
        showCorrect && isCorrect && 'ring-4 ring-success ring-offset-2',
        showCorrect && !isCorrect && selected && 'ring-4 ring-destructive ring-offset-2',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <div className="flex items-center gap-4 w-full">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
          {shape === 'triangle' && (
            <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
              <path d="M12 2L2 22h20L12 2z" />
            </svg>
          )}
          {shape === 'diamond' && (
            <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
              <path d="M12 2l10 10-10 10L2 12 12 2z" />
            </svg>
          )}
          {shape === 'circle' && (
            <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
              <circle cx="12" cy="12" r="10" />
            </svg>
          )}
          {shape === 'square' && (
            <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
              <rect x="2" y="2" width="20" height="20" />
            </svg>
          )}
        </div>
        <span className="flex-1 text-left break-words">{text}</span>
      </div>
    </Button>
  );
};
