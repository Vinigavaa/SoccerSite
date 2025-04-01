import React, { useState, useEffect } from 'react';
import PlayerCard, { PlayerData } from './PlayerCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Loader2 } from 'lucide-react';
import { getAllPlayers } from '@/services/playerService';
import { Player } from '@/lib/supabase';

type PositionType = 'Goleiro' | 'Zagueiro' | 'Lateral' | 'Volante' | 'Meio-campista' | 'Atacante';

const TeamSection: React.FC = () => {
  const [activePosition, setActivePosition] = useState<string>("Todos");
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Carregar jogadores ao montar o componente
  useEffect(() => {
    const loadPlayers = async () => {
      setIsLoading(true);
      try {
        const data = await getAllPlayers();
        // Converter o formato dos dados da API para o formato esperado pelo componente
        const formattedPlayers: PlayerData[] = data.map(player => ({
          id: player.id,
          name: player.name,
          number: player.number,
          position: player.position as PositionType,
          image: player.image_url,
          stats: {
            goals: player.goals || 0,
            assists: player.assists || 0,
            saves: player.saves || 0
          }
        }));
        setPlayers(formattedPlayers);
      } catch (error) {
        console.error('Erro ao carregar jogadores:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlayers();
  }, []);
  
  // Filtrar jogadores pela posição selecionada
  const filteredPlayers = activePosition === 'Todos' 
    ? players 
    : players.filter(player => {
        // Normalizar as strings para busca
        const normalizedPosition = player.position.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f-]/g, '');
        const normalizedSearch = activePosition.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f-]/g, '');
        return normalizedPosition.includes(normalizedSearch);
      });
  
  // Criar lista de posições únicas para o filtro
  const positions = ['Todos', ...new Set(players.map(player => player.position))];
  
  return (
    <section id="team" className="py-16 bg-gradient-to-b from-atletico-bordo to-atletico-bordo-dark">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-12">
          <Users className="text-atletico-gold mr-3" size={28} />
          <h2 className="text-3xl md:text-4xl font-display font-bold text-atletico-gold">
            Nosso Elenco
          </h2>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-atletico-gold" />
          </div>
        ) : (
          <Tabs defaultValue="Todos" onValueChange={setActivePosition} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-atletico-bordo-dark border border-atletico-gold/30">
                <TabsTrigger 
                  value="Todos"
                  className="text-white data-[state=active]:bg-atletico-gold data-[state=active]:text-atletico-bordo"
                >
                  Todos
                </TabsTrigger>
                <TabsTrigger 
                  value="Goleiro"
                  className="text-white data-[state=active]:bg-atletico-gold data-[state=active]:text-atletico-bordo"
                >
                  Goleiros
                </TabsTrigger>
                <TabsTrigger 
                  value="Zagueiro"
                  className="text-white data-[state=active]:bg-atletico-gold data-[state=active]:text-atletico-bordo"
                >
                  Zagueiros
                </TabsTrigger>
                <TabsTrigger 
                  value="Lateral"
                  className="text-white data-[state=active]:bg-atletico-gold data-[state=active]:text-atletico-bordo"
                >
                  Laterais
                </TabsTrigger>
                <TabsTrigger 
                  value="Volante"
                  className="text-white data-[state=active]:bg-atletico-gold data-[state=active]:text-atletico-bordo"
                >
                  Volantes
                </TabsTrigger>
                <TabsTrigger 
                  value="Meio-campista"
                  className="text-white data-[state=active]:bg-atletico-gold data-[state=active]:text-atletico-bordo"
                >
                  Meio-Campistas
                </TabsTrigger>
                <TabsTrigger 
                  value="Atacante"
                  className="text-white data-[state=active]:bg-atletico-gold data-[state=active]:text-atletico-bordo"
                >
                  Atacantes
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value={activePosition} className="mt-0">
              {filteredPlayers.length === 0 ? (
                <div className="text-center py-8 text-atletico-white">
                  Nenhum jogador encontrado nesta posição.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {filteredPlayers.map(player => (
                    <PlayerCard key={player.id} player={player} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </section>
  );
};

export default TeamSection;
