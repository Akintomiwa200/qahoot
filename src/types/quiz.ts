export type QuestionType = 'multiple-choice' | 'true-false' | 'poll';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  text: string;
  imageUrl?: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number;
  points?: number;
}

export interface QuizSettings {
  backgroundImage?: string;
  backgroundTheme: 'default' | 'space' | 'ocean' | 'forest' | 'gradient' | 'custom';
  musicEnabled: boolean;
  musicTrack?: string;
  soundEffectsEnabled: boolean;
  brandLogo?: string;
  brandColor?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  settings: QuizSettings;
  category?: string;
  isTemplate?: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Avatar {
  id: string;
  type: 'emoji' | 'animal' | 'robot' | 'custom';
  value: string;
  color?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

export interface PowerUp {
  id: string;
  type: 'freeze-time' | 'fifty-fifty' | 'double-points' | 'skip';
  name: string;
  icon: string;
  used: boolean;
}

export interface ParticipantStats {
  totalQuizzes: number;
  totalPoints: number;
  averageScore: number;
  bestStreak: number;
  achievements: Achievement[];
  level: number;
  xp: number;
}

export interface Participant {
  id: string;
  nickname: string;
  avatar: Avatar;
  score: number;
  answers: ParticipantAnswer[];
  powerUps: PowerUp[];
  currentStreak: number;
  stats?: ParticipantStats;
  joinedAt: Date;
}

export interface ParticipantAnswer {
  questionId: string;
  selectedAnswer: number | null;
  timeSpent: number;
  isCorrect: boolean;
  pointsEarned: number;
  powerUpUsed?: string;
}

export type SessionState = 'lobby' | 'in-progress' | 'ended';

export interface Team {
  id: string;
  name: string;
  color: string;
  members: string[];
  score: number;
}

export interface Session {
  id: string;
  roomCode: string;
  quiz: Quiz;
  hostId: string;
  participants: Participant[];
  teams?: Team[];
  isTeamMode: boolean;
  currentQuestionIndex: number;
  state: SessionState;
  questionStartTime: number | null;
  createdAt: Date;
}

export interface QuizAnalytics {
  quizId: string;
  totalParticipants: number;
  averageScore: number;
  completionRate: number;
  questionStats: {
    questionId: string;
    correctRate: number;
    averageTime: number;
  }[];
  participantPerformance: {
    participantId: string;
    nickname: string;
    score: number;
    correctAnswers: number;
  }[];
}

export interface GameContextType {
  session: Session | null;
  isHost: boolean;
  currentParticipant: Participant | null;
  savedQuizzes: Quiz[];
  createSession: (quiz: Quiz, isTeamMode?: boolean) => string;
  joinSession: (roomCode: string, nickname: string, avatar: Avatar) => boolean;
  startGame: () => void;
  nextQuestion: () => void;
  submitAnswer: (questionId: string, answer: number, timeSpent: number) => void;
  usePowerUp: (powerUpType: string) => void;
  endSession: () => void;
  getLeaderboard: () => Participant[];
  getTeamLeaderboard: () => Team[];
  saveQuiz: (quiz: Quiz) => void;
  loadQuiz: (quizId: string) => Quiz | null;
  deleteQuiz: (quizId: string) => void;
  getAnalytics: () => QuizAnalytics | null;
  updateAvatar: (avatar: Avatar) => void;
  updateQuizSettings: (settings: QuizSettings) => void;
}
