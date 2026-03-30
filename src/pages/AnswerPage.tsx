import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Timer } from '@/components/quiz/Timer';
import { AnswerButton } from '@/components/quiz/AnswerButton';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

const AnswerPage: React.FC = () => {
  const navigate = useNavigate();
  const { session, currentParticipant, submitAnswer } = useGame();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [startTime] = useState(Date.now());
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    if (!session || !currentParticipant) {
      navigate('/join');
      return;
    }

    if (session.state === 'lobby') {
      navigate('/waiting-room');
      return;
    }

    if (session.state === 'ended') {
      navigate('/leaderboard');
      return;
    }
  }, [session, currentParticipant, navigate]);

  useEffect(() => {
    if (!session || !currentParticipant) return;

    const currentQuestion = session.quiz.questions[session.currentQuestionIndex];
    if (!currentQuestion) return;

    const hasAnsweredCurrent = currentParticipant.answers.some(
      (a) => a.questionId === currentQuestion.id
    );

    if (hasAnsweredCurrent && !hasAnswered) {
      setHasAnswered(true);
      setTimeout(() => {
        navigate('/score');
      }, 1000);
    }
  }, [session, currentParticipant, hasAnswered, navigate]);

  if (!session || !currentParticipant || session.currentQuestionIndex < 0) {
    return null;
  }

  const currentQuestion = session.quiz.questions[session.currentQuestionIndex];
  if (!currentQuestion) return null;

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || hasAnswered) return;

    const timeSpent = (Date.now() - startTime) / 1000;
    setSelectedAnswer(answerIndex);
    setHasAnswered(true);
    submitAnswer(currentQuestion.id, answerIndex, timeSpent);

    setTimeout(() => {
      navigate('/score');
    }, 500);
  };

  const handleTimerComplete = () => {
    if (selectedAnswer === null && !hasAnswered) {
      const timeSpent = currentQuestion.timeLimit;
      setHasAnswered(true);
      submitAnswer(currentQuestion.id, -1, timeSpent);

      setTimeout(() => {
        navigate('/score');
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Question {session.currentQuestionIndex + 1} of {session.quiz.questions.length}
            </p>
            <p className="text-lg font-bold">{currentParticipant.nickname}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Score</p>
            <p className="text-2xl font-bold text-primary">{currentParticipant.score}</p>
          </div>
        </div>

        <Progress
          value={((session.currentQuestionIndex + 1) / session.quiz.questions.length) * 100}
          className="h-2"
        />

        <Card className="border-4 border-primary">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-center">{currentQuestion.text}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Timer
              duration={currentQuestion.timeLimit}
              onComplete={handleTimerComplete}
              isActive={!hasAnswered}
            />

            {hasAnswered ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-lg font-medium text-muted-foreground">
                  Answer submitted! Waiting for others...
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <AnswerButton
                    key={index}
                    index={index}
                    text={option}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={hasAnswered}
                    selected={selectedAnswer === index}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnswerPage;
