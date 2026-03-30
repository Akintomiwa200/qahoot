import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Avatar } from '@/types/quiz';

interface AvatarSelectorProps {
  selectedAvatar: Avatar;
  onSelect: (avatar: Avatar) => void;
}

const emojiAvatars = ['😀', '😎', '🤓', '🥳', '🤩', '😇', '🤠', '🥸', '🤖', '👽', '🦄', '🐱', '🐶', '🐼', '🦊', '🐯'];
const animalAvatars = ['🦁', '🐯', '🐻', '🐼', '🐨', '🐸', '🐵', '🦊', '🦝', '🐺', '🦉', '🦅', '🦆', '🐧', '🦈', '🐙'];
const robotAvatars = ['🤖', '👾', '🛸', '🚀', '⚡', '💎', '🔮', '🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎬', '🎸', '🎹'];

const avatarColors = [
  '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444',
  '#14B8A6', '#F97316', '#8B5CF6', '#06B6D4', '#84CC16', '#A855F7'
];

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({ selectedAvatar, onSelect }) => {
  const [activeTab, setActiveTab] = useState<'emoji' | 'animal' | 'robot'>('emoji');

  const renderAvatarGrid = (avatars: string[], type: Avatar['type']) => (
    <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
      {avatars.map((avatar, index) => (
        <Button
          key={index}
          variant="outline"
          className={`h-16 w-16 text-3xl p-0 ${
            selectedAvatar.value === avatar && selectedAvatar.type === type
              ? 'ring-4 ring-primary'
              : ''
          }`}
          onClick={() => onSelect({ id: `${type}-${index}`, type, value: avatar })}
        >
          {avatar}
        </Button>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose Your Avatar</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="emoji">Emoji</TabsTrigger>
            <TabsTrigger value="animal">Animals</TabsTrigger>
            <TabsTrigger value="robot">Fun</TabsTrigger>
          </TabsList>
          <TabsContent value="emoji" className="mt-4">
            {renderAvatarGrid(emojiAvatars, 'emoji')}
          </TabsContent>
          <TabsContent value="animal" className="mt-4">
            {renderAvatarGrid(animalAvatars, 'animal')}
          </TabsContent>
          <TabsContent value="robot" className="mt-4">
            {renderAvatarGrid(robotAvatars, 'robot')}
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <p className="text-sm font-medium mb-3">Avatar Color</p>
          <div className="flex gap-2 flex-wrap">
            {avatarColors.map((color, index) => (
              <button
                key={index}
                type="button"
                className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${
                  selectedAvatar.color === color ? 'ring-4 ring-primary ring-offset-2' : 'border-border'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => onSelect({ ...selectedAvatar, color })}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div
              className="text-6xl mb-2 inline-block p-4 rounded-full"
              style={{ backgroundColor: selectedAvatar.color || '#8B5CF6' }}
            >
              {selectedAvatar.value}
            </div>
            <p className="text-sm text-muted-foreground">Preview</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
