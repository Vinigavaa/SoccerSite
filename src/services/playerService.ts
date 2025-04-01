import { supabase, Player } from '@/lib/supabase';

// Interface para criação/atualização de jogador
export interface PlayerInput {
  name: string;
  number: number;
  position: string;
  image_url: string;
  goals: number;
  assists: number;
  saves?: number;
}

// Buscar todos os jogadores
export const getAllPlayers = async (): Promise<Player[]> => {
  try {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('number', { ascending: true });
    
    if (error) {
      console.error('Erro ao buscar jogadores:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Erro ao buscar jogadores:', err);
    
    // Dados simulados - remover em produção
    return [
      {
        id: 1,
        name: "Carlos Silva",
        number: 9,
        position: "Atacante",
        image_url: "https://via.placeholder.com/300x300?text=Carlos",
        goals: 8,
        assists: 5,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        name: "Robson Junior",
        number: 7,
        position: "Atacante",
        image_url: "https://via.placeholder.com/300x300?text=Robson",
        goals: 6,
        assists: 3,
        created_at: new Date().toISOString()
      }
    ];
  }
};

// Buscar jogador pelo ID
export const getPlayerById = async (id: number): Promise<Player | null> => {
  try {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Erro ao buscar jogador ${id}:`, error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error(`Erro ao buscar jogador ${id}:`, err);
    return null;
  }
};

// Criar jogador
export const createPlayer = async (playerData: PlayerInput): Promise<Player | null> => {
  try {
    const { data, error } = await supabase
      .from('players')
      .insert([playerData])
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar jogador:', error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Erro ao criar jogador:', err);
    
    // Simulação de retorno durante desenvolvimento - remover em produção
    return {
      id: Math.floor(Math.random() * 1000),
      name: playerData.name,
      number: playerData.number,
      position: playerData.position,
      image_url: playerData.image_url,
      goals: playerData.goals || 0,
      assists: playerData.assists || 0,
      saves: playerData.saves,
      created_at: new Date().toISOString()
    };
  }
};

// Atualizar jogador
export const updatePlayer = async (id: number, playerData: Partial<PlayerInput>): Promise<Player | null> => {
  try {
    const { data, error } = await supabase
      .from('players')
      .update(playerData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Erro ao atualizar jogador ${id}:`, error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error(`Erro ao atualizar jogador ${id}:`, err);
    return null;
  }
};

// Excluir jogador
export const deletePlayer = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Erro ao excluir jogador ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error(`Erro ao excluir jogador ${id}:`, err);
    return false;
  }
};

// Upload de imagem de jogador
export const uploadPlayerImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `player-${Date.now()}.${fileExt}`;
    const filePath = `player-images/${fileName}`;
    
    const { error } = await supabase.storage
      .from('player-images')
      .upload(filePath, file);
    
    if (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      return null;
    }
    
    const { data } = supabase.storage
      .from('player-images')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (err) {
    console.error('Erro ao fazer upload da imagem:', err);
    return 'https://via.placeholder.com/300x300?text=Player';
  }
}; 