import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Timer } from '@/components/quiz/Timer';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Trophy } from 'lucide-react';

const HostGamePage: React.FC = () => {
  const navigate = useNavigate();
  const { session, nextQuestion } = useGame();
  const [showTimer, setShowTimer] = useState(true);

  useEffect(() => {
    if (!session || session.state !== 'in-progress') {
      navigate('/');
    }
  }, [session, navigate]);

  useEffect(() => {
    if (session?.state === 'ended') {
      navigate('/leaderboard');
    }
  }, [session?.state, navigate]);

  if (!session || session.currentQuestionIndex < 0) {
    return null;
  }

  const currentQuestion = session.quiz.questions[session.currentQuestionIndex];
  const answeredCount = session.participants.filter(
    (p) => p.answers.some((a) => a.questionId === currentQuestion.id)
  ).length;
  const totalParticipants = session.participants.length;
  const isLastQuestion = session.currentQuestionIndex === session.quiz.questions.length - 1;

  const handleTimerComplete = () => {
    setShowTimer(false);
  };

  const handleNext = () => {
    setShowTimer(true);
    nextQuestion();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{session.quiz.title}</h2>
            <p className="text-muted-foreground">
              Question {session.currentQuestionIndex + 1} of {session.quiz.questions.length}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Progress</p>
            <p className="text-2xl font-bold text-primary">
              {Math.round(((session.currentQuestionIndex + 1) / session.quiz.questions.length) * 100)}%
            </p>
          </div>
        </div>

        <Progress
          value={((session.currentQuestionIndex + 1) / session.quiz.questions.length) * 100}
          className="h-2"
        />

        <Card className="border-4 border-primary">
          <CardHeader>
            <CardTitle className="text-3xl text-center">{currentQuestion.text}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Timer
              duration={currentQuestion.timeLimit}
              onComplete={handleTimerComplete}
              isActive={showTimer}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-lg border-2 ${
                    index === currentQuestion.correctAnswer
                      ? 'border-success bg-success/10'
                      : 'border-border bg-muted/50'
                  }`}
                >
                  <p className="font-medium text-lg">{option}</p>
                  {index === currentQuestion.correctAnswer && (
                    <p className="text-sm text-success mt-2">✓ Correct Answer</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Participant Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Answered</span>
                <span className="text-2xl font-bold">
                  {answeredCount} / {totalParticipants}
                </span>
              </div>
              <Progress value={(answeredCount / totalParticipants) * 100} className="h-3" />
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleNext} className="w-full" size="lg">
          {isLastQuestion ? (
            <>
              <Trophy className="w-5 h-5 mr-2" />
              Show Leaderboard
            </>
          ) : (
            <>
              <ChevronRight className="w-5 h-5 mr-2" />
              Next Question
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default HostGamePage;
