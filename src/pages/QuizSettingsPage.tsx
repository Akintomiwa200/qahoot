import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { BackgroundSelector } from '@/components/quiz/BackgroundSelector';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import type { QuizSettings } from '@/types/quiz';

const QuizSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { session, updateQuizSettings } = useGame();
  
  const [settings, setSettings] = useState<QuizSettings>(
    session?.quiz.settings || {
      backgroundTheme: 'default',
      musicEnabled: false,
      soundEffectsEnabled: true,
    }
  );

  const handleSave = () => {
    updateQuizSettings(settings);
    toast.success('Settings saved successfully!');
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Quiz Settings</h1>
            <p className="text-muted-foreground">Customize your quiz experience</p>
          </div>
        </div>

        <BackgroundSelector settings={settings} onUpdate={setSettings} />

        <Card>
          <CardHeader>
            <CardTitle>Audio Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="music">Background Music</Label>
                <p className="text-sm text-muted-foreground">
                  Play background music during the quiz
                </p>
              </div>
              <Switch
                id="music"
                checked={settings.musicEnabled}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, musicEnabled: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sound-effects">Sound Effects</Label>
                <p className="text-sm text-muted-foreground">
                  Play sound effects for correct/incorrect answers
                </p>
              </div>
              <Switch
                id="sound-effects"
                checked={settings.soundEffectsEnabled}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, soundEffectsEnabled: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brand-color">Brand Color</Label>
              <div className="flex gap-2">
                <Input
                  id="brand-color"
                  type="color"
                  value={settings.brandColor || '#8B5CF6'}
                  onChange={(e) =>
                    setSettings({ ...settings, brandColor: e.target.value })
                  }
                  className="w-20 h-10"
                />
                <Input
                  value={settings.brandColor || '#8B5CF6'}
                  onChange={(e) =>
                    setSettings({ ...settings, brandColor: e.target.value })
                  }
                  placeholder="#8B5CF6"
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Customize the primary color for your quiz
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate(-1)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizSettingsPage;
