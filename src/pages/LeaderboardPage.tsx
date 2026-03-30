import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Award, Home } from 'lucide-react';

const LeaderboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { session, isHost, getLeaderboard, endSession } = useGame();

  if (!session) {
    navigate('/');
    return null;
  }

  const leaderboard = getLeaderboard();

  const handlePlayAgain = () => {
    endSession();
    navigate('/create-quiz');
  };

  const handleEndSession = () => {
    endSession();
    navigate('/');
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 0:
        return <Trophy className="w-8 h-8 text-yellow-500" />;
      case 1:
        return <Medal className="w-8 h-8 text-gray-400" />;
      case 2:
        return <Award className="w-8 h-8 text-amber-700" />;
      default:
        return null;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 0:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 1:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 2:
        return 'bg-gradient-to-r from-amber-600 to-amber-800 text-white';
      default:
        return 'bg-muted text-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Trophy className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold">Final Results</h1>
          <p className="text-xl text-muted-foreground">{session.quiz.title}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((participant, index) => (
                <div
                  key={participant.id}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                    index < 3
                      ? getRankBadge(index)
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background/20 font-bold text-xl">
                    {index < 3 ? getRankIcon(index) : `#${index + 1}`}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg">{participant.nickname}</p>
                    <p className="text-sm opacity-90">
                      {participant.answers.filter((a) => a.isCorrect).length} /{' '}
                      {session.quiz.questions.length} correct
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{participant.score}</p>
                    <p className="text-sm opacity-90">points</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {isHost ? (
          <div className="grid md:grid-cols-2 gap-4">
            <Button onClick={handlePlayAgain} size="lg" variant="outline">
              Play Again
            </Button>
            <Button onClick={handleEndSession} size="lg">
              <Home className="w-5 h-5 mr-2" />
              End Session
            </Button>
          </div>
        ) : (
          <Button onClick={handleEndSession} className="w-full" size="lg">
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
