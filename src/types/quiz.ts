export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  createdAt: Date;
}

export interface Participant {
  id: string;
  nickname: string;
  score: number;
  answers: ParticipantAnswer[];
  joinedAt: Date;
}

export interface ParticipantAnswer {
  questionId: string;
  selectedAnswer: number | null;
  timeSpent: number;
  isCorrect: boolean;
  pointsEarned: number;
}

export type SessionState = 'lobby' | 'in-progress' | 'ended';

export interface Session {
  id: string;
  roomCode: string;
  quiz: Quiz;
  hostId: string;
  participants: Participant[];
  currentQuestionIndex: number;
  state: SessionState;
  questionStartTime: number | null;
  createdAt: Date;
}

export interface GameContextType {
  session: Session | null;
  isHost: boolean;
  currentParticipant: Participant | null;
  createSession: (quiz: Quiz) => string;
  joinSession: (roomCode: string, nickname: string) => boolean;
  startGame: () => void;
  nextQuestion: () => void;
  submitAnswer: (questionId: string, answer: number, timeSpent: number) => void;
  endSession: () => void;
  getLeaderboard: () => Participant[];
}
