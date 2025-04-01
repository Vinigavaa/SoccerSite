import { supabase, Match } from '@/lib/supabase';

// Interface para criação/atualização de jogo
export interface MatchInput {
  opponent: string;
  location: string;
  match_date: string;
  match_time: string;
  home_goals?: number;
  away_goals?: number;
}

// Buscar todos os jogos
export const getAllMatches = async (): Promise<Match[]> => {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('match_date', { ascending: true });
    
    if (error) {
      console.error('Erro ao buscar jogos:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Erro ao buscar jogos:', err);
    
    // Dados simulados para desenvolvimento
    return [
      {
        id: 1,
        opponent: "Flamengo FC",
        location: "Estádio Trilho Dourado",
        match_date: "2023-09-30",
        match_time: "16:00",
        home_goals: 2,
        away_goals: 1,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        opponent: "Palmeiras",
        location: "Estádio Allianz Parque",
        match_date: "2023-10-15",
        match_time: "19:30",
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        opponent: "São Paulo FC",
        location: "Estádio Trilho Dourado",
        match_date: "2023-10-28",
        match_time: "20:00",
        created_at: new Date().toISOString()
      }
    ];
  }
};

// Buscar jogo pelo ID
export const getMatchById = async (id: number): Promise<Match | null> => {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Erro ao buscar jogo ${id}:`, error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error(`Erro ao buscar jogo ${id}:`, err);
    return null;
  }
};

// Criar jogo
export const createMatch = async (matchData: MatchInput): Promise<Match | null> => {
  try {
    const { data, error } = await supabase
      .from('matches')
      .insert([matchData])
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar jogo:', error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Erro ao criar jogo:', err);
    
    // Simulação de retorno durante desenvolvimento
    return {
      id: Math.floor(Math.random() * 1000),
      opponent: matchData.opponent,
      location: matchData.location,
      match_date: matchData.match_date,
      match_time: matchData.match_time,
      home_goals: matchData.home_goals,
      away_goals: matchData.away_goals,
      created_at: new Date().toISOString()
    };
  }
};

// Atualizar jogo
export const updateMatch = async (id: number, matchData: Partial<MatchInput>): Promise<Match | null> => {
  try {
    const { data, error } = await supabase
      .from('matches')
      .update(matchData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Erro ao atualizar jogo ${id}:`, error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error(`Erro ao atualizar jogo ${id}:`, err);
    return null;
  }
};

// Excluir jogo
export const deleteMatch = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Erro ao excluir jogo ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error(`Erro ao excluir jogo ${id}:`, err);
    return false;
  }
};

// Atualizar resultado do jogo
export const updateMatchResult = async (
  id: number, 
  homeGoals: number, 
  awayGoals: number
): Promise<Match | null> => {
  return updateMatch(id, { home_goals: homeGoals, away_goals: awayGoals });
}; 