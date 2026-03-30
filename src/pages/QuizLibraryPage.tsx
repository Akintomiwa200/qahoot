import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Play, Trash2, Search, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

const QuizLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const { savedQuizzes, loadQuiz, deleteQuiz, createSession } = useGame();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuizzes = savedQuizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quiz.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlayQuiz = (quizId: string) => {
    const quiz = loadQuiz(quizId);
    if (quiz) {
      const roomCode = createSession(quiz);
      toast.success(`Quiz loaded! Room code: ${roomCode}`);
      navigate('/lobby');
    }
  };

  const handleDeleteQuiz = (quizId: string) => {
    deleteQuiz(quizId);
    toast.success('Quiz deleted successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-primary" />
              Quiz Library
            </h1>
            <p className="text-muted-foreground">Browse and manage your saved quizzes</p>
          </div>
          <Button onClick={() => navigate('/create-quiz')}>
            <Plus className="w-4 h-4 mr-2" />
            Create New
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search quizzes by title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {filteredQuizzes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Quizzes Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'Try a different search term' : 'Create your first quiz to get started'}
              </p>
              <Button onClick={() => navigate('/create-quiz')}>
                <Plus className="w-4 h-4 mr-2" />
                Create Quiz
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQuizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{quiz.title}</CardTitle>
                      {quiz.description && (
                        <CardDescription className="mt-1">{quiz.description}</CardDescription>
                      )}
                    </div>
                    {quiz.isTemplate && (
                      <Badge variant="secondary">Template</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2 flex-wrap">
                    {quiz.category && (
                      <Badge variant="outline">{quiz.category}</Badge>
                    )}
                    <Badge variant="outline">{quiz.questions.length} Questions</Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handlePlayQuiz(quiz.id)}
                      className="flex-1"
                      size="sm"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </Button>
                    <Button
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizLibraryPage;
