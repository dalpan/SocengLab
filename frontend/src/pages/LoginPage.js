import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Terminal, Lock } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function LoginPage({ onLogin }) {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/login`, {
        username,
        password
      });

      localStorage.setItem('soceng_token', response.data.token);
      localStorage.setItem('soceng_user', JSON.stringify(response.data.user));
      toast.success('Login successful');
      onLogin();
    } catch (error) {
      toast.error(t('auth.invalid_credentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 grid-bg">
      <div className="glass-panel p-8 max-w-md w-full">
        <div className="mb-8 text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Terminal className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold glitch text-primary">
              SOCENG_LAB
            </h1>
          </div>
          <p className="text-muted-foreground font-mono text-sm">
            {t('app.tagline')}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="font-mono uppercase text-xs">
              {t('auth.username')}
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="font-mono"
              placeholder="soceng"
              required
              data-testid="username-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="font-mono uppercase text-xs">
              {t('auth.password')}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="font-mono"
              placeholder="••••••••••••"
              required
              data-testid="password-input"
            />
          </div>

          <Button
            type="submit"
            className="w-full uppercase tracking-wider"
            disabled={loading}
            data-testid="login-submit-btn"
          >
            <Lock className="w-4 h-4 mr-2" />
            {loading ? t('auth.authenticating') : t('auth.login')}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-muted/10 rounded border border-muted/30">
          <p className="text-xs text-muted-foreground text-center font-mono">
            Default: soceng / Cialdini@2025!
          </p>
        </div>
      </div>
    </div>
  );
}