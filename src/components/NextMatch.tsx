import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getAllMatches } from '@/services/matchService';
import { Match } from '@/lib/supabase';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const NextMatch: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [nextMatch, setNextMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Carregar partidas ao montar o componente
  useEffect(() => {
    const loadNextMatch = async () => {
      setIsLoading(true);
      try {
        const matches = await getAllMatches();
        
        // Filtrar para mostrar apenas partidas que ainda não aconteceram
        const now = new Date();
        const futureMatches = matches.filter(match => {
          const parts = match.match_date.split('-').map(Number);
          const timeParts = match.match_time.split(':').map(Number);
          const matchDate = new Date(parts[0], parts[1] - 1, parts[2], timeParts[0], timeParts[1]);
          return matchDate > now;
        });
        
        // Ordenar por data para pegar a mais próxima
        futureMatches.sort((a, b) => {
          const partsA = a.match_date.split('-').map(Number);
          const timePartsA = a.match_time.split(':').map(Number);
          const dateA = new Date(partsA[0], partsA[1] - 1, partsA[2], timePartsA[0], timePartsA[1]);
          
          const partsB = b.match_date.split('-').map(Number);
          const timePartsB = b.match_time.split(':').map(Number);
          const dateB = new Date(partsB[0], partsB[1] - 1, partsB[2], timePartsB[0], timePartsB[1]);
          
          return dateA.getTime() - dateB.getTime();
        });
        
        // Obter a próxima partida
        if (futureMatches.length > 0) {
          setNextMatch(futureMatches[0]);
        }
      } catch (error) {
        console.error('Erro ao carregar próxima partida:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNextMatch();
  }, []);
  
  useEffect(() => {
    if (!nextMatch) return;
    
    const calculateTimeLeft = () => {
      // Criar data no fuso horário local
      const parts = nextMatch.match_date.split('-').map(Number);
      const timeParts = nextMatch.match_time.split(':').map(Number);
      
      // Usar fuso horário local, sem UTC
      const matchDateTime = new Date(
        parts[0],            // Ano
        parts[1] - 1,        // Mês (0-11)
        parts[2],            // Dia
        timeParts[0],        // Hora
        timeParts[1],        // Minutos
        0                    // Segundos
      );
      
      const now = new Date();
      const difference = matchDateTime.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        // Match has already happened
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [nextMatch]);
  
  const formatDate = (dateString: string) => {
    try {
      // Criar data no fuso horário local para exibição
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
      };
      
      return date.toLocaleDateString('pt-BR', options);
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return dateString;
    }
  };
  
  if (isLoading) {
    return (
      <section id="next-match" className="py-16 bg-atletico-bordo-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-atletico-gold text-center mb-12">
            Próximo Jogo
          </h2>
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-atletico-gold" />
          </div>
        </div>
      </section>
    );
  }
  
  if (!nextMatch) {
    return (
      <section id="next-match" className="py-16 bg-atletico-bordo-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-atletico-gold text-center mb-12">
            Próximo Jogo
          </h2>
          <Card className="max-w-3xl mx-auto overflow-hidden bg-atletico-bordo border-2 border-atletico-gold/50">
            <div className="p-6 md:p-8 text-center">
              <p className="text-atletico-white text-xl">
                Não há partidas agendadas no momento.
              </p>
            </div>
          </Card>
        </div>
      </section>
    );
  }
  
  return (
    <section id="next-match" className="py-16 bg-atletico-bordo-dark">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-atletico-gold text-center mb-12">
          Próximo Jogo
        </h2>
        
        <Card className="max-w-3xl mx-auto overflow-hidden bg-atletico-bordo border-2 border-atletico-gold/50">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-center md:text-left mb-6 md:mb-0">
                <div className="mb-3 flex items-center justify-center md:justify-start">
                  <Calendar className="w-5 h-5 text-atletico-gold mr-2" />
                  <span className="text-atletico-white">{formatDate(nextMatch.match_date)}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <Clock className="w-5 h-5 text-atletico-gold mr-2" />
                  <span className="text-atletico-white">{nextMatch.match_time}</span>
                </div>
                <div className="mt-3 text-atletico-white/80">
                  {nextMatch.location}
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="text-xl font-bold text-atletico-white">
                  SELECAIXA <span className="text-atletico-gold">vs</span> {nextMatch.opponent}
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-center text-atletico-gold font-semibold mb-4">CONTAGEM REGRESSIVA</h3>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="bg-atletico-bordo-dark p-3 rounded-lg">
                  <div className="text-2xl md:text-3xl font-display font-bold text-atletico-gold">
                    {timeLeft.days}
                  </div>
                  <div className="text-xs text-atletico-white/80 uppercase">Dias</div>
                </div>
                <div className="bg-atletico-bordo-dark p-3 rounded-lg">
                  <div className="text-2xl md:text-3xl font-display font-bold text-atletico-gold">
                    {timeLeft.hours}
                  </div>
                  <div className="text-xs text-atletico-white/80 uppercase">Horas</div>
                </div>
                <div className="bg-atletico-bordo-dark p-3 rounded-lg">
                  <div className="text-2xl md:text-3xl font-display font-bold text-atletico-gold">
                    {timeLeft.minutes}
                  </div>
                  <div className="text-xs text-atletico-white/80 uppercase">Minutos</div>
                </div>
                <div className="bg-atletico-bordo-dark p-3 rounded-lg">
                  <div className="text-2xl md:text-3xl font-display font-bold text-atletico-gold">
                    {timeLeft.seconds}
                  </div>
                  <div className="text-xs text-atletico-white/80 uppercase">Segundos</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default NextMatch;
