import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Activity, FileCode, ListChecks, TrendingUp, Clock } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function DashboardPage() {
  const { t } = useTranslation();
  const [simulations, setSimulations] = useState([]);
  const [stats, setStats] = useState({ challenges: 0, quizzes: 0, simulations: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('soceng_token');
      const headers = { Authorization: `Bearer ${token}` };

      const [simsRes, challengesRes, quizzesRes] = await Promise.all([
        axios.get(`${API}/simulations`, { headers }),
        axios.get(`${API}/challenges`, { headers }),
        axios.get(`${API}/quizzes`, { headers })
      ]);

      setSimulations(simsRes.data.slice(0, 10));
      setStats({
        challenges: challengesRes.data.length,
        quizzes: quizzesRes.data.length,
        simulations: simsRes.data.length
      });
    } catch (error) {
      console.error('Failed to load dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="glass-panel p-6 hover:border-primary/30 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground uppercase tracking-wide font-mono">{label}</p>
          <p className="text-4xl font-bold mt-2" style={{ color }}>{value}</p>
        </div>
        <Icon className="w-12 h-12 opacity-20" style={{ color }} />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-primary font-mono animate-pulse">LOADING...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">{t('dashboard.welcome')}</h1>
        <p className="text-muted-foreground font-mono">{t('app.tagline')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={FileCode}
          label={t('nav.scenarios')}
          value={stats.challenges}
          color="#00e5ff"
        />
        <StatCard
          icon={ListChecks}
          label={t('nav.quizzes')}
          value={stats.quizzes}
          color="#ff0057"
        />
        <StatCard
          icon={Activity}
          label={t('nav.history')}
          value={stats.simulations}
          color="#8cff4d"
        />
      </div>

      {/* Quick Actions */}
      <div className="glass-panel p-6">
        <h2 className="text-2xl font-bold mb-4">{t('dashboard.quick_actions')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/scenarios">
            <Button className="w-full justify-start" variant="outline">
              <FileCode className="w-5 h-5 mr-3" />
              {t('dashboard.browse_challenges')}
            </Button>
          </Link>
          <Link to="/quizzes">
            <Button className="w-full justify-start" variant="outline">
              <ListChecks className="w-5 h-5 mr-3" />
              {t('dashboard.take_quiz')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Simulations */}
      <div className="glass-panel p-6">
        <h2 className="text-2xl font-bold mb-4">{t('dashboard.recent_simulations')}</h2>
        {simulations.length === 0 ? (
          <p className="text-muted-foreground text-center py-8 font-mono">
            No history yet. Start your first challenge!
          </p>
        ) : (
          <div className="space-y-3">
            {simulations.map((sim) => (
              <div
                key={sim.id}
                className="flex items-center justify-between p-4 bg-muted/10 rounded-lg border border-muted/30 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <Activity className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-mono text-sm">
                      {sim.simulation_type === 'challenge' ? 'Challenge' : 'Quiz'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(sim.started_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-mono ${
                    sim.status === 'completed'
                      ? 'bg-primary/20 text-primary'
                      : 'bg-warning/20 text-warning'
                  }`}>
                    {sim.status.toUpperCase()}
                  </span>
                  {sim.score !== null && (
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-tertiary" />
                      <span className="font-mono text-sm">{sim.score}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}