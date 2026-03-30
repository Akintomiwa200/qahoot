import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, TrendingUp, Users, Target, Clock, Download } from 'lucide-react';
import { toast } from 'sonner';

const AnalyticsDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { session, getAnalytics } = useGame();

  if (!session) {
    navigate('/');
    return null;
  }

  const analytics = getAnalytics();

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card>
          <CardContent className="py-12 text-center">
            <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No Analytics Available</h3>
            <p className="text-muted-foreground mb-4">
              Complete a quiz session to view analytics
            </p>
            <Button onClick={() => navigate('/')}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleExport = () => {
    const data = JSON.stringify(analytics, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-analytics-${session.quiz.title}-${Date.now()}.json`;
    a.click();
    toast.success('Analytics exported successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/leaderboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-primary" />
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">{session.quiz.title}</p>
          </div>
          <Button onClick={handleExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Participants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-3xl font-bold">{analytics.totalParticipants}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-secondary" />
                <span className="text-3xl font-bold">{Math.round(analytics.averageScore)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-success" />
                <span className="text-3xl font-bold">{Math.round(analytics.completionRate)}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-info" />
                <span className="text-3xl font-bold">{session.quiz.questions.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Question Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.questionStats.map((stat, index) => {
                const question = session.quiz.questions.find(q => q.id === stat.questionId);
                return (
                  <div key={stat.questionId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Question {index + 1}</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(stat.correctRate)}% correct
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{question?.text}</p>
                    <Progress value={stat.correctRate} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Avg. time: {stat.averageTime.toFixed(1)}s</span>
                      <span>Time limit: {question?.timeLimit}s</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.participantPerformance.slice(0, 10).map((participant, index) => (
                <div
                  key={participant.participantId}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg w-6">#{index + 1}</span>
                    <div>
                      <p className="font-medium">{participant.nickname}</p>
                      <p className="text-sm text-muted-foreground">
                        {participant.correctAnswers} / {session.quiz.questions.length} correct
                      </p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-primary">{participant.score}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboardPage;
