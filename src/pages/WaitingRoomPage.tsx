import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Users } from 'lucide-react';

const WaitingRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const { session, currentParticipant } = useGame();

  useEffect(() => {
    if (!session || !currentParticipant) {
      navigate('/join');
      return;
    }

    if (session.state === 'in-progress') {
      navigate('/answer');
    }
  }, [session, currentParticipant, navigate]);

  if (!session || !currentParticipant) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-secondary/10 via-background to-primary/10">
      <div className="w-full max-w-md space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Welcome, {currentParticipant.nickname}!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
              </div>
              <div>
                <p className="text-lg font-medium">Waiting for host to start...</p>
                <p className="text-sm text-muted-foreground mt-2">
                  The quiz will begin shortly
                </p>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quiz</span>
                <span className="font-medium">{session.quiz.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Questions</span>
                <span className="font-medium">{session.quiz.questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Participants</span>
                <span className="font-medium">{session.participants.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WaitingRoomPage;
