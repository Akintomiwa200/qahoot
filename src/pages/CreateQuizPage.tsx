import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, ArrowLeft, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import type { Quiz, QuizQuestion } from '@/types/quiz';

const CreateQuizPage: React.FC = () => {
  const navigate = useNavigate();
  const { createSession } = useGame();
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: `q-${Date.now()}`,
      text: '',
      options: ['', ''],
      correctAnswer: 0,
      timeLimit: 20,
    },
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `q-${Date.now()}`,
        text: '',
        options: ['', ''],
        correctAnswer: 0,
        timeLimit: 20,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length === 1) {
      toast.error('Quiz must have at least one question');
      return;
    }
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof QuizQuestion, value: string | number) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = value;
    setQuestions(updated);
  };

  const addOption = (questionIndex: number) => {
    const updated = [...questions];
    if (updated[questionIndex].options.length >= 4) {
      toast.error('Maximum 4 options allowed');
      return;
    }
    updated[questionIndex].options.push('');
    setQuestions(updated);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions];
    if (updated[questionIndex].options.length <= 2) {
      toast.error('Minimum 2 options required');
      return;
    }
    updated[questionIndex].options.splice(optionIndex, 1);
    if (updated[questionIndex].correctAnswer >= updated[questionIndex].options.length) {
      updated[questionIndex].correctAnswer = 0;
    }
    setQuestions(updated);
  };

  const validateAndStart = () => {
    if (!quizTitle.trim()) {
      toast.error('Please enter a quiz title');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        toast.error(`Question ${i + 1} is empty`);
        return;
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          toast.error(`Question ${i + 1}, Option ${j + 1} is empty`);
          return;
        }
      }
    }

    const quiz: Quiz = {
      id: `quiz-${Date.now()}`,
      title: quizTitle,
      questions,
      createdAt: new Date(),
    };

    const roomCode = createSession(quiz);
    toast.success(`Quiz created! Room code: ${roomCode}`);
    navigate('/lobby');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create Quiz</h1>
            <p className="text-muted-foreground">Design your quiz questions and answers</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quiz Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="quiz-title">Quiz Title</Label>
              <Input
                id="quiz-title"
                placeholder="Enter quiz title..."
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {questions.map((question, qIndex) => (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-5 h-5 text-muted-foreground" />
                    <CardTitle className="text-lg">Question {qIndex + 1}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeQuestion(qIndex)}
                    disabled={questions.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Question Text</Label>
                  <Input
                    placeholder="Enter your question..."
                    value={question.text}
                    onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Time Limit</Label>
                  <Select
                    value={question.timeLimit.toString()}
                    onValueChange={(value) => updateQuestion(qIndex, 'timeLimit', Number.parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 seconds</SelectItem>
                      <SelectItem value="20">20 seconds</SelectItem>
                      <SelectItem value="30">30 seconds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Answer Options</Label>
                  <div className="space-y-2">
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex gap-2">
                        <Input
                          placeholder={`Option ${oIndex + 1}`}
                          value={option}
                          onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                          className={question.correctAnswer === oIndex ? 'border-success border-2' : ''}
                        />
                        <Button
                          variant={question.correctAnswer === oIndex ? 'default' : 'outline'}
                          onClick={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                          className="flex-shrink-0"
                        >
                          {question.correctAnswer === oIndex ? '✓ Correct' : 'Set Correct'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeOption(qIndex, oIndex)}
                          disabled={question.options.length <= 2}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  {question.options.length < 4 && (
                    <Button variant="outline" size="sm" onClick={() => addOption(qIndex)} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Option
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-4">
          <Button variant="outline" onClick={addQuestion} className="flex-1">
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
          <Button onClick={validateAndStart} className="flex-1" size="lg">
            Start Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuizPage;
