import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import type { QuizSettings } from '@/types/quiz';

interface BackgroundSelectorProps {
  settings: QuizSettings;
  onUpdate: (settings: QuizSettings) => void;
}

const themes = [
  { id: 'default', name: 'Default', gradient: 'from-primary/10 via-background to-secondary/10' },
  { id: 'space', name: 'Space', gradient: 'from-indigo-900 via-purple-900 to-pink-900' },
  { id: 'ocean', name: 'Ocean', gradient: 'from-cyan-500 via-blue-500 to-indigo-600' },
  { id: 'forest', name: 'Forest', gradient: 'from-green-700 via-emerald-600 to-teal-500' },
  { id: 'sunset', name: 'Sunset', gradient: 'from-orange-500 via-pink-500 to-purple-600' },
  { id: 'gradient', name: 'Vibrant', gradient: 'from-fuchsia-500 via-purple-500 to-indigo-500' },
];

export const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({ settings, onUpdate }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Background Theme</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {themes.map((theme) => (
            <button
              type="button"
              key={theme.id}
              onClick={() => onUpdate({ ...settings, backgroundTheme: theme.id as any })}
              className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                settings.backgroundTheme === theme.id
                  ? 'border-primary ring-4 ring-primary/20'
                  : 'border-border'
              }`}
            >
              <div className={`w-full h-full bg-gradient-to-br ${theme.gradient}`} />
              {settings.backgroundTheme === theme.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Check className="w-8 h-8 text-white" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 px-2">
                {theme.name}
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
