import React, { useState, useMemo } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { AuthScreen } from './components/AuthScreen';
import { StartScreen } from './components/StartScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { questions } from './data/questions';
import { Topic, User } from './types';

type GameState = 'splash' | 'auth' | 'start' | 'playing' | 'results' | 'leaderboard';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('splash');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [quizStats, setQuizStats] = useState<Record<Topic, { total: number; correct: number }>>({} as any);
  const [quizTime, setQuizTime] = useState(0);

  // We are asked to contain 500 questions.
  // For a single interactive session, we shouldn't serve all 500 at once to the user (would take hours).
  // We will pick 20 questions randomly per session to test them properly.
  const selectedQuestions = useMemo(() => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 20); 
  }, [gameState]); 

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setGameState('start');
  };

  const handleStart = () => {
    setGameState('playing');
  };

  const handleComplete = (stats: Record<Topic, { total: number; correct: number }>, timeSpent: number) => {
    setQuizStats(stats);
    setQuizTime(timeSpent);
    setGameState('results');
  };

  const handleQuit = () => {
    setGameState('start');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-purple-200">
      {gameState === 'splash' && (
        <SplashScreen onComplete={() => setGameState('auth')} />
      )}

      {gameState === 'auth' && (
        <AuthScreen onLogin={handleLogin} />
      )}

      {gameState === 'start' && currentUser && (
        <StartScreen 
          onStart={handleStart} 
          onLeaderboard={() => setGameState('leaderboard')} 
        />
      )}
      
      {gameState === 'playing' && (
        <QuizScreen 
          questions={selectedQuestions} 
          onComplete={handleComplete}
          onQuit={handleQuit}
        />
      )}

      {gameState === 'results' && currentUser && (
        <ResultsScreen
          user={currentUser}
          stats={quizStats}
          timeSpent={quizTime}
          onHome={() => setGameState('start')}
          onLeaderboard={() => setGameState('leaderboard')}
        />
      )}

      {gameState === 'leaderboard' && (
        <LeaderboardScreen
          onBack={() => setGameState(currentUser ? 'start' : 'auth')}
        />
      )}
    </div>
  );
}
