import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Minus, RefreshCw } from 'lucide-react';
import { getTeamStats, updateTeamStats, TeamStats } from '@/services/teamStatsService';

const StatsManagement: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [stats, setStats] = useState<TeamStats>({
    id: 0, // Inicializar com 0 e deixar o backend definir o ID correto
    wins: 0,
    draws: 0,
    losses: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      console.log('Carregando estatísticas...');
      const data = await getTeamStats();
      if (data) {
        console.log('Estatísticas carregadas com sucesso:', data);
        setStats(data);
      } else {
        console.warn('Nenhum dado de estatísticas retornado do serviço');
        toast({
          title: "Dados não encontrados",
          description: "Não foi possível carregar as estatísticas. Usando valores padrão.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      toast({
        title: "Erro ao carregar estatísticas",
        description: "Não foi possível carregar as estatísticas da equipe.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const incrementStat = (stat: 'wins' | 'draws' | 'losses') => {
    setStats(prev => ({
      ...prev,
      [stat]: prev[stat] + 1
    }));
  };

  const decrementStat = (stat: 'wins' | 'draws' | 'losses') => {
    if (stats[stat] > 0) {
      setStats(prev => ({
        ...prev,
        [stat]: prev[stat] - 1
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Verificar se o ID é válido
      if (!stats.id) {
        console.warn('Tentando salvar estatísticas sem ID válido');
      }
      
      // Clona o objeto para evitar modificações diretas
      const statsToSave = {
        id: stats.id,
        wins: stats.wins,
        draws: stats.draws,
        losses: stats.losses
      };
      
      console.log('Salvando estatísticas:', statsToSave);
      
      const updatedStats = await updateTeamStats(statsToSave);
      
      if (updatedStats) {
        console.log('Estatísticas atualizadas com sucesso:', updatedStats);
        // Atualiza o state com os dados retornados pelo servidor
        setStats(updatedStats);
        toast({
          title: "Estatísticas atualizadas",
          description: "As estatísticas da equipe foram atualizadas com sucesso."
        });
      } else {
        console.error('Retorno nulo ao tentar salvar estatísticas');
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar as estatísticas. Tente novamente.",
          variant: "destructive"
        });
        
        // Recarregar para tentar obter dados atualizados
        await loadStats();
      }
    } catch (error) {
      console.error('Exceção ao salvar estatísticas:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as estatísticas.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-atletico-bordo" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-atletico-bordo">Estatísticas do Time</h1>
          <p className="text-gray-500">Atualize o número de vitórias, empates e derrotas do time</p>
          {stats.id > 0 && (
            <p className="text-xs text-gray-400 mt-1">ID do registro: {stats.id}</p>
          )}
        </div>
        <Button
          onClick={loadStats}
          variant="outline"
          className="border-atletico-bordo text-atletico-bordo"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Vitórias */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-green-600">Vitórias</h3>
                <div className="text-4xl font-bold mt-2">{stats.wins}</div>
              </div>
              <div className="flex justify-center space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => decrementStat('wins')}
                  disabled={stats.wins <= 0}
                  className="border-green-600 text-green-600 hover:bg-green-100"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => incrementStat('wins')}
                  className="border-green-600 text-green-600 hover:bg-green-100"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Empates */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-yellow-600">Empates</h3>
                <div className="text-4xl font-bold mt-2">{stats.draws}</div>
              </div>
              <div className="flex justify-center space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => decrementStat('draws')}
                  disabled={stats.draws <= 0}
                  className="border-yellow-600 text-yellow-600 hover:bg-yellow-100"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => incrementStat('draws')}
                  className="border-yellow-600 text-yellow-600 hover:bg-yellow-100"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Derrotas */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-red-600">Derrotas</h3>
                <div className="text-4xl font-bold mt-2">{stats.losses}</div>
              </div>
              <div className="flex justify-center space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => decrementStat('losses')}
                  disabled={stats.losses <= 0}
                  className="border-red-600 text-red-600 hover:bg-red-100"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => incrementStat('losses')}
                  className="border-red-600 text-red-600 hover:bg-red-100"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-atletico-gold hover:bg-atletico-gold-light text-atletico-bordo"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Estatísticas'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default StatsManagement; 