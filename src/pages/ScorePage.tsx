import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { ScoreCard } from '@/components/quiz/ScoreCard';
import { ArrowRight } from 'lucide-react';

const ScorePage: React.FC = () => {
  const navigate = useNavigate();
  const { session, currentParticipant } = useGame();
  const [previousQuestionIndex, setPreviousQuestionIndex] = useState(-1);

  useEffect(() => {
    if (!session || !currentParticipant) {
      navigate('/join');
      return;
    }

    if (session.state === 'ended') {
      navigate('/leaderboard');
      return;
    }

    // Track question changes
    if (session.currentQuestionIndex !== previousQuestionIndex) {
      if (previousQuestionIndex >= 0 && session.currentQuestionIndex > previousQuestionIndex) {
        // Question advanced, go to next answer page
        setTimeout(() => {
          navigate('/answer');
        }, 2000);
      }
      setPreviousQuestionIndex(session.currentQuestionIndex);
    }
  }, [session, currentParticipant, navigate, previousQuestionIndex]);

  if (!session || !currentParticipant) {
    return null;
  }

  const lastAnswer = currentParticipant.answers[currentParticipant.answers.length - 1];
  if (!lastAnswer) {
    navigate('/answer');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="w-full max-w-md space-y-6">
        <ScoreCard
          isCorrect={lastAnswer.isCorrect}
          pointsEarned={lastAnswer.pointsEarned}
          totalScore={currentParticipant.score}
        />

        <div className="text-center space-y-2">
          <p className="text-muted-foreground">
            {session.currentQuestionIndex < session.quiz.questions.length - 1
              ? 'Get ready for the next question...'
              : 'Waiting for final results...'}
          </p>
          <Button variant="outline" onClick={() => navigate('/answer')} className="mt-4">
            <ArrowRight className="w-4 h-4 mr-2" />
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScorePage;
