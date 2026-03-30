import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Zap, Target, Award, Star, Crown } from 'lucide-react';
import type { Achievement } from '@/types/quiz';

interface AchievementBadgeProps {
  achievements: Achievement[];
}

const achievementIcons: Record<string, React.ReactNode> = {
  'first-win': <Trophy className="w-6 h-6" />,
  'speed-demon': <Zap className="w-6 h-6" />,
  'perfect-score': <Target className="w-6 h-6" />,
  'streak-master': <Award className="w-6 h-6" />,
  'quiz-master': <Star className="w-6 h-6" />,
  'champion': <Crown className="w-6 h-6" />,
};

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievements }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Achievements
          <Badge variant="secondary" className="ml-auto">
            {achievements.filter(a => a.unlockedAt).length} / {achievements.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border-2 text-center transition-all ${
                achievement.unlockedAt
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-muted/50 opacity-50'
              }`}
            >
              <div className={`mb-2 flex justify-center ${achievement.unlockedAt ? 'text-primary' : 'text-muted-foreground'}`}>
                {achievementIcons[achievement.icon] || <Award className="w-6 h-6" />}
              </div>
              <p className="font-bold text-sm">{achievement.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
              {achievement.unlockedAt && (
                <Badge variant="outline" className="mt-2 text-xs">
                  Unlocked
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
