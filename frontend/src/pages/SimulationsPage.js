import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Activity, TrendingUp, Calendar, Download } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import Pagination from '../components/Pagination';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function SimulationsPage() {
  const { t } = useTranslation();
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadSimulations();
  }, []);

  const loadSimulations = async () => {
    try {
      const token = localStorage.getItem('soceng_token');
      const response = await axios.get(`${API}/simulations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSimulations(response.data);
    } catch (error) {
      toast.error('Failed to load simulations');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (simulationId) => {
    try {
      const token = localStorage.getItem('soceng_token');
      const response = await axios.get(`${API}/reports/${simulationId}/json`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `simulation_${simulationId}_report.json`;
      a.click();
      
      toast.success('Report downloaded');
    } catch (error) {
      toast.error('Failed to download report');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-primary font-mono animate-pulse">LOADING SIMULATIONS...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">{t('nav.history')}</h1>
        <p className="text-muted-foreground font-mono">Your simulation history and reports</p>
      </div>

      {simulations.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <Activity className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground font-mono">No simulations yet. Start a challenge or quiz!</p>
        </div>
      ) : (
        <>
          <div className="glass-panel p-6">
            <div className="space-y-4">
              {simulations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((sim) => (
              <div
                key={sim.id}
                className="flex items-center justify-between p-4 bg-muted/10 rounded-lg border border-muted/30 hover:border-primary/30 transition-colors"
                data-testid={`simulation-item-${sim.id}`}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <Activity className="w-6 h-6 text-primary" />
                  <div className="flex-1">
                    <p className="font-mono font-semibold">
                      {sim.simulation_type === 'challenge' ? 'Challenge Simulation' : 'Quiz Simulation'}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(sim.started_at).toLocaleString()}</span>
                      </div>
                      {sim.participant_name && (
                        <span>Participant: {sim.participant_name}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-mono ${
                    sim.status === 'completed'
                      ? 'bg-primary/20 text-primary'
                      : sim.status === 'running'
                      ? 'bg-warning/20 text-warning'
                      : 'bg-muted/20 text-muted-foreground'
                  }`}>
                    {sim.status.toUpperCase()}
                  </span>
                  
                  {sim.score !== null && (
                    <div className="flex items-center space-x-2 px-3 py-1 bg-tertiary/20 rounded-full">
                      <TrendingUp className="w-4 h-4 text-tertiary" />
                      <span className="font-mono text-sm font-bold">{sim.score}</span>
                    </div>
                  )}
                  
                  {sim.status === 'completed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadReport(sim.id)}
                      data-testid={`download-report-${sim.id}`}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      REPORT
                    </Button>
                  )}
                </div>
              </div>
              ))}
            </div>
          </div>
          
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(simulations.length / itemsPerPage)}
            totalItems={simulations.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}