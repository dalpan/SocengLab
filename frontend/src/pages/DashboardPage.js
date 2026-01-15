import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Activity, FileCode, ListChecks, TrendingUp, Zap, Shield, Target, Clock } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

import { AI_PERSONAS } from '../data/aiPersonas';

export default function DashboardPage() {
  const { t } = useTranslation();
  const [simulations, setSimulations] = useState([]);
  const [stats, setStats] = useState({ challenges: 0, quizzes: 0, simulations: 0, ai_personas: 0 });
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

      const sims = Array.isArray(simsRes.data) ? simsRes.data : [];
      setSimulations(sims.slice(0, 5)); // Recent 5

      setStats({
        challenges: challengesRes.data.length,
        quizzes: quizzesRes.data.length,
        simulations: sims.length,
        ai_personas: AI_PERSONAS.length // Fixed: using available personas count
      });
    } catch (error) {
      console.error('Failed to load dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, bgClass }) => (
    <div className={`p-6 rounded-xl border border-border/50 transition-all hover:scale-105 ${bgClass}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground uppercase tracking-wide font-bold">{label}</p>
          <p className="text-4xl font-bold mt-2 font-mono tracking-tight" style={{ color }}>{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-background/50 backdrop-blur-sm`}>
          <Icon className="w-8 h-8" style={{ color }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 container mx-auto p-6 max-w-7xl animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-2">
            {t('dashboard.welcome')}
          </h1>
          <p className="text-muted-foreground font-medium text-lg">Defend the Human OS</p>
        </div>
        <div className="flex gap-2">
          <Link to="/ai-challenge">
            <Button size="lg" className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
              <Zap className="w-5 h-5 mr-2" /> Start AI Simulation
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Shield}
          label="AI Scenarios"
          value={stats.ai_personas}
          color="#3b82f6" // Blue
          bgClass="bg-blue-500/5 from-blue-500/10 bg-gradient-to-br"
        />
        <StatCard
          icon={Target}
          label="Scenarios"
          value={stats.challenges}
          color="#8b5cf6" // Purple
          bgClass="bg-purple-500/5 from-purple-500/10 bg-gradient-to-br"
        />
        <StatCard
          icon={ListChecks}
          label="Quizzes"
          value={stats.quizzes}
          color="#ec4899" // Pink
          bgClass="bg-pink-500/5 from-pink-500/10 bg-gradient-to-br"
        />
        <StatCard
          icon={Activity}
          label="Total Logs"
          value={stats.simulations}
          color="#10b981" // Green
          bgClass="bg-green-500/5 from-green-500/10 bg-gradient-to-br"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" /> Quick Actions
          </h2>
          <div className="grid gap-3">
            <Link to="/ai-challenge">
              <Button className="w-full justify-start h-14 text-lg font-semibold relative overflow-hidden group" variant="default">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center">
                  <Zap className="w-5 h-5 mr-3" />
                  Run AI Simulation
                </span>
              </Button>
            </Link>
            <Link to="/scenarios">
              <Button className="w-full justify-start h-12" variant="outline">
                <Target className="w-5 h-5 mr-3" />
                Browse Scenarios
              </Button>
            </Link>
            <Link to="/quizzes">
              <Button className="w-full justify-start h-12" variant="outline">
                <ListChecks className="w-5 h-5 mr-3" />
                Take a Quiz
              </Button>
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-muted/30 border border-border">
            <h3 className="font-semibold mb-2 text-sm text-foreground">Pro Tip</h3>
            <p className="text-sm text-muted-foreground">
              Try the new <span className="text-primary font-bold">AI Voice Clone</span> scenario in the library to test your defense against deepfakes.
            </p>
          </div>
        </div>

        {/* Recent Simulations */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Recent Activity</h2>
            <Link to="/simulations">
              <Button variant="ghost" size="sm">View All <Activity className="w-4 h-4 ml-1" /></Button>
            </Link>
          </div>

          <div className="space-y-3">
            {simulations.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-border rounded-xl bg-muted/10">
                <Activity className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No operations logged yet.</p>
                <Link to="/ai-challenge" className="text-primary hover:underline mt-2 inline-block">Start training now</Link>
              </div>
            ) : (
              simulations.map((sim, i) => (
                <div
                  key={sim.id || i}
                  className="flex items-center justify-between p-4 bg-card hover:bg-muted/50 rounded-xl border border-border/50 transition-colors group"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${sim.completed_at ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                      {(sim.simulation_type === 'ai_challenge' || sim.type === 'ai_challenge') ? <Shield className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {sim.challenge_Title || sim.title || "Untitled Operation"}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {new Date(sim.completed_at || sim.created_at || sim.started_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-mono font-bold text-lg ${sim.score >= 70 ? 'text-green-500' : 'text-orange-500'}`}>
                      {sim.score || 0}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}