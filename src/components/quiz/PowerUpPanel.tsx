import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Snowflake, Lightbulb, Zap, SkipForward } from 'lucide-react';
import type { PowerUp } from '@/types/quiz';

interface PowerUpButtonProps {
  powerUp: PowerUp;
  onUse: () => void;
  disabled?: boolean;
}

const powerUpIcons: Record<string, React.ReactNode> = {
  'freeze-time': <Snowflake className="w-5 h-5" />,
  'fifty-fifty': <Lightbulb className="w-5 h-5" />,
  'double-points': <Zap className="w-5 h-5" />,
  'skip': <SkipForward className="w-5 h-5" />,
};

const powerUpColors: Record<string, string> = {
  'freeze-time': 'from-cyan-500 to-blue-500',
  'fifty-fifty': 'from-yellow-500 to-orange-500',
  'double-points': 'from-purple-500 to-pink-500',
  'skip': 'from-green-500 to-emerald-500',
};

export const PowerUpButton: React.FC<PowerUpButtonProps> = ({ powerUp, onUse, disabled }) => {
  return (
    <Button
      onClick={onUse}
      disabled={disabled || powerUp.used}
      className={`relative overflow-hidden bg-gradient-to-r ${powerUpColors[powerUp.type]} text-white hover:scale-105 transition-transform`}
      size="lg"
    >
      <div className="flex items-center gap-2">
        {powerUpIcons[powerUp.type]}
        <span className="font-bold">{powerUp.name}</span>
      </div>
      {powerUp.used && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <span className="text-xs font-bold">USED</span>
        </div>
      )}
    </Button>
  );
};

interface PowerUpPanelProps {
  powerUps: PowerUp[];
  onUsePowerUp: (powerUpType: string) => void;
  disabled?: boolean;
}

export const PowerUpPanel: React.FC<PowerUpPanelProps> = ({ powerUps, onUsePowerUp, disabled }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground mb-3">Power-Ups</p>
          <div className="grid grid-cols-2 gap-2">
            {powerUps.map((powerUp) => (
              <PowerUpButton
                key={powerUp.id}
                powerUp={powerUp}
                onUse={() => onUsePowerUp(powerUp.type)}
                disabled={disabled}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
