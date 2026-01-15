import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Activity, TrendingUp, Calendar, Download, Eye, Filter, BarChart3, Trash2, Shield, AlertTriangle, CheckCircle2, Clock, Search, FolderOpen, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function SimulationsPage() {
  const { t } = useTranslation();
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSimulation, setSelectedSimulation] = useState(null);

  useEffect(() => {
    loadSimulations();
  }, []);

  const loadSimulations = async () => {
    try {
      const token = localStorage.getItem('soceng_token');
      const response = await axios.get(`${API}/simulations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSimulations(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to load logs', error);
      toast.error('Failed to retrieve mission logs');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500 border-green-500/50 bg-green-500/10";
    if (score >= 60) return "text-yellow-500 border-yellow-500/50 bg-yellow-500/10";
    return "text-red-500 border-red-500/50 bg-red-500/10";
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'ai_challenge': return <Shield className="w-4 h-4" />;
      case 'quiz': return <FileText className="w-4 h-4" />;
      case 'simulation': return <Activity className="w-4 h-4" />;
      default: return <FolderOpen className="w-4 h-4" />;
    }
  };

  const filteredSimulations = simulations.filter(s => {
    if (filterType !== 'all' && (s.simulation_type || s.type) !== filterType) return false;
    if (searchTerm) {
      const title = s.challenge_Title || s.title || "Untitled";
      if (!title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    }
    return true;
  });

  if (loading) return <div className="flex h-screen items-center justify-center"><Activity className="animate-spin w-10 h-10 text-primary" /></div>;

  return (
    <div className="container mx-auto p-6 max-w-7xl animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Mission Logs
          </h1>
          <p className="text-muted-foreground mt-1">Operational history and performance debriefs</p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search logs..."
              className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-1 ring-primary outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={loadSimulations}><Activity className="w-4 h-4 mr-2" /> Refresh</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['all', 'ai_challenge', 'quiz', 'simulation'].map(type => (
              <Button
                key={type}
                variant={filterType === type ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setFilterType(type)}
                className="capitalize"
              >
                {type.replace('_', ' ')}
              </Button>
            ))}
          </div>

          {filteredSimulations.length === 0 ? (
            <Card className="p-8 text-center border-dashed border-2 border-muted">
              <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No mission logs found matching criteria.</p>
            </Card>
          ) : (
            filteredSimulations.map((sim, idx) => (
              <Card
                key={sim.id || idx}
                className={`p-4 cursor-pointer transition-all hover:bg-muted/50 border-l-4 ${selectedSimulation?.id === sim.id ? 'border-primary ring-1 ring-primary' : 'border-transparent'}`}
                onClick={() => setSelectedSimulation(sim)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${getScoreColor(sim.score || 0).split(' ')[2]}`}>
                      {getTypeIcon(sim.simulation_type || sim.type)}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">
                        {sim.title || sim.challenge_Title || (sim.simulation_type === 'ai_challenge' ? 'AI Simulation' : 'Untitled Mission')}
                      </h3>
                      <div className="flex gap-2 mt-1 items-center text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs uppercase tracking-wider">{sim.difficulty || 'Normal'}</Badge>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(sim.completed_at || sim.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold bg-muted/20 px-3 py-1 rounded-full ${sim.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                      {sim.status === 'completed' ? 'COMPLETED' : 'IN PROGRESS'}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Details Column */}
        <div className="lg:col-span-1">
          {selectedSimulation ? (
            <Card className="sticky top-6 p-0 overflow-hidden border-primary/20">
              <div className="bg-muted/50 p-6 border-b border-border">
                <h2 className="text-xl font-bold mb-2">{selectedSimulation.challenge_Title || "Mission Detail"}</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase">Type</span>
                    <span className="capitalize">{selectedSimulation.simulation_type || selectedSimulation.type}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase">Mode</span>
                    <span className="capitalize">{selectedSimulation.challenge_type || "Standard"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase">Completed</span>
                    <span>{new Date(selectedSimulation.completed_at || selectedSimulation.created_at).toLocaleTimeString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase">Result</span>
                    <Badge className={selectedSimulation.score >= 70 ? 'bg-green-500' : 'bg-red-500'}>
                      {selectedSimulation.score >= 70 ? 'PASSED' : 'FAILED'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                <h3 className="font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> Debrief Log
                </h3>
                {/* AI Challenge Results */}
                {(selectedSimulation.simulation_type === 'ai_challenge' || selectedSimulation.type === 'ai_challenge') && selectedSimulation.evaluation_results ? (
                  Object.entries(selectedSimulation.evaluation_results).map(([qid, res], i) => (
                    <div key={i} className={`text-sm p-3 rounded border ${res.isCorrect ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                      <div className="font-semibold mb-1">Question {i + 1}</div>
                      <p className="text-muted-foreground mb-2">{res.feedback}</p>
                      <div className={`text-xs font-mono uppercase ${res.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                        {res.isCorrect ? 'Outcome: Secure' : 'Outcome: Compromised'}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">Detailed event logs not available for this legacy record.</p>
                )}
              </div>

              <div className="p-4 bg-muted/30 border-t border-border flex justify-end">
                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={async () => {
                  if (!window.confirm("Delete record?")) return;
                  try {
                    await axios.delete(`${API}/simulations/${selectedSimulation.id}`, {
                      headers: { Authorization: `Bearer ${localStorage.getItem('soceng_token')}` }
                    });
                    setSimulations(prev => prev.filter(s => s.id !== selectedSimulation.id));
                    setSelectedSimulation(null);
                    toast.success("Record deleted");
                  } catch (e) { toast.error("Delete failed"); }
                }}>
                  <Trash2 className="w-4 h-4 mr-2" /> Delete Record
                </Button>
              </div>
            </Card>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground border-2 border-dashed border-gray-800 rounded-xl bg-gray-900/50">
              <div className="text-center">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Select a mission to view debrief</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
