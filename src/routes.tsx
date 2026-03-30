import HomePage from './pages/HomePage';
import CreateQuizPage from './pages/CreateQuizPage';
import QuizLobbyPage from './pages/QuizLobbyPage';
import HostGamePage from './pages/HostGamePage';
import JoinPage from './pages/JoinPage';
import WaitingRoomPage from './pages/WaitingRoomPage';
import AnswerPage from './pages/AnswerPage';
import ScorePage from './pages/ScorePage';
import LeaderboardPage from './pages/LeaderboardPage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <HomePage />
  },
  {
    name: 'Create Quiz',
    path: '/create-quiz',
    element: <CreateQuizPage />
  },
  {
    name: 'Quiz Lobby',
    path: '/lobby',
    element: <QuizLobbyPage />
  },
  {
    name: 'Host Game',
    path: '/host-game',
    element: <HostGamePage />
  },
  {
    name: 'Join',
    path: '/join',
    element: <JoinPage />
  },
  {
    name: 'Waiting Room',
    path: '/waiting-room',
    element: <WaitingRoomPage />
  },
  {
    name: 'Answer',
    path: '/answer',
    element: <AnswerPage />
  },
  {
    name: 'Score',
    path: '/score',
    element: <ScorePage />
  },
  {
    name: 'Leaderboard',
    path: '/leaderboard',
    element: <LeaderboardPage />
  }
];

export default routes;
