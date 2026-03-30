import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ParticipantList } from '@/components/quiz/ParticipantList';
import { Copy, Play } from 'lucide-react';
import { toast } from 'sonner';

const QuizLobbyPage: React.FC = () => {
  const navigate = useNavigate();
  const { session, startGame } = useGame();

  if (!session) {
    navigate('/');
    return null;
  }

  const copyRoomCode = () => {
    navigator.clipboard.writeText(session.roomCode);
    toast.success('Room code copied to clipboard!');
  };

  const handleStartGame = () => {
    if (session.participants.length === 0) {
      toast.error('Waiting for at least 1 participant to join.');
      return;
    }
    startGame();
    navigate('/host-game');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">{session.quiz.title}</h1>
          <p className="text-muted-foreground">Waiting for participants to join...</p>
        </div>

        <Card className="border-4 border-primary">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Room Code</CardTitle>
            <CardDescription>Share this code with participants</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center gap-4 bg-primary/10 px-8 py-6 rounded-lg">
                <span className="text-6xl font-bold tracking-widest text-primary font-mono">
                  {session.roomCode}
                </span>
                <Button size="icon" variant="outline" onClick={copyRoomCode}>
                  <Copy className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Participants can join at the Join Quiz page
            </p>
          </CardContent>
        </Card>

        <ParticipantList participants={session.participants} />

        <Card>
          <CardHeader>
            <CardTitle>Quiz Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-3xl font-bold text-primary">{session.quiz.questions.length}</p>
                <p className="text-sm text-muted-foreground">Questions</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-3xl font-bold text-secondary">{session.participants.length}</p>
                <p className="text-sm text-muted-foreground">Participants</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleStartGame}
          disabled={session.participants.length === 0}
          className="w-full"
          size="lg"
        >
          <Play className="w-5 h-5 mr-2" />
          Start Game
        </Button>
      </div>
    </div>
  );
};

export default QuizLobbyPage;
