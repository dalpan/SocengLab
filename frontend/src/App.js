import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import './i18n/config';
import './App.css';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ScenariosPage from './pages/ScenariosPage';
import QuizzesPage from './pages/QuizzesPage';
import SimulationsPage from './pages/SimulationsPage';
import SettingsPage from './pages/SettingsPage';
import InstallerPage from './pages/InstallerPage';
import SimulationPlayerPage from './pages/SimulationPlayerPage';
import AIChallengePage from './pages/AIChallengePage';
import QuizPlayerPage from './pages/QuizPlayerPage';

// Layout
import Layout from './components/Layout';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [firstRunCompleted, setFirstRunCompleted] = useState(true);

  useEffect(() => {
    // Check for auth token
    const token = localStorage.getItem('soceng_token');
    if (token) {
      setIsAuthenticated(true);
    }
    
    // Check first run status - skip if already has token (for testing/production)
    const firstRun = localStorage.getItem('soceng_first_run');
    if (!firstRun && !token) {
      setFirstRunCompleted(false);
    }
    
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-mono animate-pulse">INITIALIZING...</div>
      </div>
    );
  }

  if (!firstRunCompleted) {
    return (
      <BrowserRouter>
        <Toaster theme="dark" position="top-right" />
        <InstallerPage onComplete={() => {
          setFirstRunCompleted(true);
          localStorage.setItem('soceng_first_run', 'true');
        }} />
      </BrowserRouter>
    );
  }

  if (!isAuthenticated) {
    return (
      <BrowserRouter>
        <Toaster theme="dark" position="top-right" />
        <LoginPage onLogin={() => setIsAuthenticated(true)} />
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Toaster theme="dark" position="top-right" />
      <Layout onLogout={() => setIsAuthenticated(false)}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/scenarios" element={<ScenariosPage />} />
          <Route path="/quizzes" element={<QuizzesPage />} />
          <Route path="/quizzes/:quizId/play" element={<QuizPlayerPage />} />
          <Route path="/simulations" element={<SimulationsPage />} />
          <Route path="/simulations/:simulationId/play" element={<SimulationPlayerPage />} />
          <Route path="/ai-challenge" element={<AIChallengePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;