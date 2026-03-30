import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type {
  Quiz,
  Session,
  Participant,
  GameContextType,
  SessionState,
} from '@/types/quiz';

const GameContext = createContext<GameContextType | undefined>(undefined);

// In-memory storage for sessions (simulating real-time database)
const sessions = new Map<string, Session>();

// Generate a random 6-digit alphanumeric room code
const generateRoomCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Calculate points based on correctness and speed
const calculatePoints = (isCorrect: boolean, timeSpent: number, timeLimit: number): number => {
  if (!isCorrect) return 0;
  
  const basePoints = 1000;
  const speedRatio = timeSpent / timeLimit;
  const speedBonus = Math.max(0, Math.floor(1000 * (1 - speedRatio)));
  
  return basePoints + speedBonus;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [currentParticipant, setCurrentParticipant] = useState<Participant | null>(null);

  // Simulate real-time updates by polling session state
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      const updatedSession = sessions.get(session.roomCode);
      if (updatedSession) {
        setSession({ ...updatedSession });
      }
    }, 500);

    return () => clearInterval(interval);
  }, [session?.roomCode]);

  const createSession = useCallback((quiz: Quiz): string => {
    const roomCode = generateRoomCode();
    const hostId = `host-${Date.now()}`;
    
    const newSession: Session = {
      id: `session-${Date.now()}`,
      roomCode,
      quiz,
      hostId,
      participants: [],
      currentQuestionIndex: -1,
      state: 'lobby',
      questionStartTime: null,
      createdAt: new Date(),
    };

    sessions.set(roomCode, newSession);
    setSession(newSession);
    setIsHost(true);
    setCurrentParticipant(null);

    return roomCode;
  }, []);

  const joinSession = useCallback((roomCode: string, nickname: string): boolean => {
    const existingSession = sessions.get(roomCode.toUpperCase());
    
    if (!existingSession) {
      return false;
    }

    if (existingSession.state !== 'lobby') {
      return false;
    }

    // Check for duplicate nickname
    const isDuplicate = existingSession.participants.some(
      (p) => p.nickname.toLowerCase() === nickname.toLowerCase()
    );
    
    if (isDuplicate) {
      return false;
    }

    const newParticipant: Participant = {
      id: `participant-${Date.now()}-${Math.random()}`,
      nickname,
      score: 0,
      answers: [],
      joinedAt: new Date(),
    };

    existingSession.participants.push(newParticipant);
    sessions.set(roomCode.toUpperCase(), existingSession);
    
    setSession({ ...existingSession });
    setIsHost(false);
    setCurrentParticipant(newParticipant);

    return true;
  }, []);

  const startGame = useCallback(() => {
    if (!session || !isHost || session.participants.length === 0) return;

    const updatedSession = {
      ...session,
      state: 'in-progress' as SessionState,
      currentQuestionIndex: 0,
      questionStartTime: Date.now(),
    };

    sessions.set(session.roomCode, updatedSession);
    setSession(updatedSession);
  }, [session, isHost]);

  const nextQuestion = useCallback(() => {
    if (!session || !isHost) return;

    const nextIndex = session.currentQuestionIndex + 1;
    
    if (nextIndex >= session.quiz.questions.length) {
      const updatedSession = {
        ...session,
        state: 'ended' as SessionState,
        questionStartTime: null,
      };
      sessions.set(session.roomCode, updatedSession);
      setSession(updatedSession);
    } else {
      const updatedSession = {
        ...session,
        currentQuestionIndex: nextIndex,
        questionStartTime: Date.now(),
      };
      sessions.set(session.roomCode, updatedSession);
      setSession(updatedSession);
    }
  }, [session, isHost]);

  const submitAnswer = useCallback(
    (questionId: string, answer: number, timeSpent: number) => {
      if (!session || !currentParticipant) return;

      const question = session.quiz.questions.find((q) => q.id === questionId);
      if (!question) return;

      const isCorrect = answer === question.correctAnswer;
      const pointsEarned = calculatePoints(isCorrect, timeSpent, question.timeLimit);

      const updatedParticipant = {
        ...currentParticipant,
        score: currentParticipant.score + pointsEarned,
        answers: [
          ...currentParticipant.answers,
          {
            questionId,
            selectedAnswer: answer,
            timeSpent,
            isCorrect,
            pointsEarned,
          },
        ],
      };

      const updatedParticipants = session.participants.map((p) =>
        p.id === currentParticipant.id ? updatedParticipant : p
      );

      const updatedSession = {
        ...session,
        participants: updatedParticipants,
      };

      sessions.set(session.roomCode, updatedSession);
      setSession(updatedSession);
      setCurrentParticipant(updatedParticipant);
    },
    [session, currentParticipant]
  );

  const endSession = useCallback(() => {
    if (!session) return;

    sessions.delete(session.roomCode);
    setSession(null);
    setIsHost(false);
    setCurrentParticipant(null);
  }, [session]);

  const getLeaderboard = useCallback((): Participant[] => {
    if (!session) return [];
    
    return [...session.participants].sort((a, b) => b.score - a.score);
  }, [session]);

  const value: GameContextType = {
    session,
    isHost,
    currentParticipant,
    createSession,
    joinSession,
    startGame,
    nextQuestion,
    submitAnswer,
    endSession,
    getLeaderboard,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
