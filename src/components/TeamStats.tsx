import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Trophy, Target, Loader2 } from 'lucide-react';
import { getTeamStats } from '@/services/teamStatsService';

const TeamStats: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTeamStats();
  }, []);

  const loadTeamStats = async () => {
    try {
      const data = await getTeamStats();
      if (data) {
        setStats(data);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-atletico-bordo-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-atletico-gold text-center mb-12 white-text-shadow">
            Estatísticas
          </h2>
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-atletico-gold" />
          </div>
        </div>
      </section>
    );
  }

  if (!stats) {
    return (
      <section className="py-16 bg-atletico-bordo-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-atletico-gold text-center mb-12 white-text-shadow">
            Estatísticas
          </h2>
          <div className="text-center py-8 text-atletico-gold">
            Nenhuma estatística disponível no momento.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-atletico-bordo-dark relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">        
        <h3 className="text-2xl md:text-3xl font-display font-bold text-white text-center mb-8 white-text-shadow">
          Desempenho da Equipe
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card rounded-lg shadow-xl p-6 text-center transform hover:-translate-y-1 transition-transform duration-300">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <Trophy className="text-green-500" size={28} />
            </div>
            <h3 className="text-lg font-semibold text-atletico-gold mb-2">Vitórias</h3>
            <p className="text-4xl font-display font-bold text-white">{stats.wins}</p>
          </div>
          
          <div className="glass-card rounded-lg shadow-xl p-6 text-center transform hover:-translate-y-1 transition-transform duration-300">
            <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
              <Target className="text-yellow-500" size={28} />
            </div>
            <h3 className="text-lg font-semibold text-atletico-gold mb-2">Empates</h3>
            <p className="text-4xl font-display font-bold text-white">{stats.draws}</p>
          </div>
          
          <div className="glass-card rounded-lg shadow-xl p-6 text-center transform hover:-translate-y-1 transition-transform duration-300">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <Target className="text-red-500" size={28} />
            </div>
            <h3 className="text-lg font-semibold text-atletico-gold mb-2">Derrotas</h3>
            <p className="text-4xl font-display font-bold text-white">{stats.losses}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamStats;
