import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Award, TrendingUp, Shield } from 'lucide-react';

// Alinhado com as posições utilizadas no sistema
type PlayerPosition = 'Goleiro' | 'Zagueiro' | 'Lateral' | 'Volante' | 'Meio-campista' | 'Atacante';

export interface PlayerData {
  id: number;
  name: string;
  number: number;
  position: PlayerPosition;
  image: string;
  stats: {
    goals: number;
    assists: number;
    saves?: number;
  };
}

interface PlayerCardProps {
  player: PlayerData;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const getPositionColor = (position: PlayerPosition): string => {
    switch (position) {
      case 'Goleiro': return 'bg-yellow-500';
      case 'Zagueiro': return 'bg-blue-500';
      case 'Lateral': return 'bg-green-500';
      case 'Volante': return 'bg-indigo-500';
      case 'Meio-campista': return 'bg-purple-500';
      case 'Atacante': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getPositionIcon = (position: PlayerPosition) => {
    switch (position) {
      case 'Goleiro': return <Shield size={16} />;
      case 'Zagueiro': return <Shield size={16} />;
      case 'Lateral': return <TrendingUp size={16} />;
      case 'Volante': return <Shield size={16} />;
      case 'Meio-campista': return <TrendingUp size={16} />;
      case 'Atacante': return <Award size={16} />;
      default: return <Star size={16} />;
    }
  };

  return (
    <div 
      className="perspective-3d w-full cursor-pointer hover:z-10" 
      onClick={handleFlip}
    >
      <div className={`relative transition-all duration-500 transform-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front of card */}
        <Card className={`relative overflow-hidden h-[360px] border-0 shadow-lg ${isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-atletico-bordo-dark to-atletico-bordo"></div>
          
          {/* Glass overlay */}
          <div className="absolute inset-0 glass-effect"></div>
          
          {/* Content */}
          <div className="relative z-10 p-4 flex flex-col items-center h-full">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-atletico-gold my-2 shadow-lg">
              <img 
                src={player.image || 'https://via.placeholder.com/150?text=Player'} 
                alt={player.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>
            
            <Badge className={`${getPositionColor(player.position as PlayerPosition)} text-white mt-2 flex items-center gap-1`}>
              {getPositionIcon(player.position)}
              {player.position}
            </Badge>
            
            <h3 className="mt-2 text-xl font-display font-bold text-atletico-white white-text-shadow">{player.name}</h3>
            <div className="text-4xl font-display font-bold text-atletico-gold mt-1">{player.number}</div>
            
            <div className="mt-auto flex items-center text-sm text-atletico-white/80">
              <span className="animate-pulse-custom">Clique para ver estatísticas</span>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-atletico-gold/10 rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-atletico-gold/10 rounded-tr-full"></div>
          </div>
        </Card>
        
        {/* Back of card */}
        <Card className={`p-4 absolute inset-0 h-[360px] rotate-y-180 backface-hidden border-0 shadow-lg ${isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-atletico-gold-light via-white to-atletico-gold-light"></div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col h-full">
            <h3 className="text-xl font-display font-bold text-atletico-bordo text-center mb-4 purple-text-shadow">
              {player.name} <span className="text-atletico-bordo-dark">|</span> #{player.number}
            </h3>
            
            <div className="flex-1 flex flex-col justify-center">
              <div className="stats-grid grid grid-cols-1 gap-6">
                
                {player.position === 'Goleiro' ? (
                  <div className="stat-item bg-atletico-bordo/10 rounded-lg p-4 transform transition-all duration-500">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-atletico-bordo-dark font-semibold uppercase">Defesas</span>
                      <Shield className="h-5 w-5 text-atletico-bordo-dark" />
                    </div>
                    <div className="text-3xl font-display font-bold text-atletico-bordo">
                      {player.stats.saves || 0}
                    </div>
                    <div className="w-full h-2 bg-atletico-bordo/20 rounded-full mt-2">
                      <div 
                        className="h-full bg-atletico-bordo rounded-full transition-all duration-1000" 
                        style={{ width: `${Math.min(100, (player.stats.saves || 0) * 5)}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="stat-item bg-atletico-bordo/10 rounded-lg p-4 transform transition-all duration-500">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-atletico-bordo-dark font-semibold uppercase">Gols</span>
                        <Award className="h-5 w-5 text-atletico-bordo-dark" />
                      </div>
                      <div className="text-3xl font-display font-bold text-atletico-bordo">
                        {player.stats.goals || 0}
                      </div>
                      <div className="w-full h-2 bg-atletico-bordo/20 rounded-full mt-2">
                        <div 
                          className="h-full bg-atletico-bordo rounded-full transition-all duration-1000" 
                          style={{ width: `${Math.min(100, (player.stats.goals || 0) * 10)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="stat-item bg-atletico-bordo/10 rounded-lg p-4 transform transition-all duration-500">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-atletico-bordo-dark font-semibold uppercase">Assistências</span>
                        <TrendingUp className="h-5 w-5 text-atletico-bordo-dark" />
                      </div>
                      <div className="text-3xl font-display font-bold text-atletico-bordo">
                        {player.stats.assists || 0}
                      </div>
                      <div className="w-full h-2 bg-atletico-bordo/20 rounded-full mt-2">
                        <div 
                          className="h-full bg-atletico-bordo rounded-full transition-all duration-1000" 
                          style={{ width: `${Math.min(100, (player.stats.assists || 0) * 10)}%` }}
                        ></div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="mt-auto text-sm text-atletico-bordo text-center">
              Clique para voltar
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PlayerCard;
