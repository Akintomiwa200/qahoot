import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AvatarSelector } from '@/components/quiz/AvatarSelector';
import { ArrowLeft, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import type { Avatar } from '@/types/quiz';

const JoinPage: React.FC = () => {
  const navigate = useNavigate();
  const { joinSession } = useGame();
  const [roomCode, setRoomCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar>({
    id: 'emoji-0',
    type: 'emoji',
    value: '😀',
    color: '#8B5CF6',
  });

  const handleJoin = () => {
    if (!roomCode.trim()) {
      toast.error('Please enter a room code');
      return;
    }

    if (!nickname.trim()) {
      toast.error('Please enter a nickname');
      return;
    }

    const success = joinSession(roomCode.trim().toUpperCase(), nickname.trim(), selectedAvatar);

    if (!success) {
      toast.error('Invalid or expired room code. Please check and try again.');
      return;
    }

    toast.success('Successfully joined the quiz!');
    navigate('/waiting-room');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-secondary/10 via-background to-primary/10">
      <div className="w-full max-w-2xl space-y-6">
        <Button variant="outline" size="icon" onClick={() => navigate('/')} className="mb-4">
          <ArrowLeft className="w-4 h-4" />
        </Button>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Join Quiz</CardTitle>
            <CardDescription>Enter the room code and customize your profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="room-code">Room Code</Label>
              <Input
                id="room-code"
                placeholder="Enter 6-digit code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="text-center text-2xl font-mono tracking-widest"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nickname">Nickname</Label>
              <Input
                id="nickname"
                placeholder="Enter your nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={20}
              />
              <p className="text-xs text-muted-foreground">
                This name will be visible to other participants
              </p>
            </div>

            <AvatarSelector selectedAvatar={selectedAvatar} onSelect={setSelectedAvatar} />

            <Button onClick={handleJoin} className="w-full" size="lg">
              <LogIn className="w-5 h-5 mr-2" />
              Join Quiz
            </Button>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>Get the room code from your quiz host</p>
        </div>
      </div>
    </div>
  );
};

export default JoinPage;
