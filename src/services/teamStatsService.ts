import { supabase } from '@/lib/supabase';

export interface TeamStats {
  id: number;
  wins: number;
  draws: number;
  losses: number;
  created_at?: string;
}

/**
 * Busca as estatísticas do time
 */
export const getTeamStats = async (): Promise<TeamStats | null> => {
  try {
    // Primeiro, verificar se existe algum registro
    const { count, error: countError } = await supabase
      .from('team_stats')
      .select('*', { count: 'exact', head: true });
    
    // Se não existir registro ou houver erro, criar um registro padrão
    if (countError || count === 0) {
      console.log('Nenhum registro de estatísticas encontrado, criando padrão...');
      return await createDefaultStats();
    }
    
    // Buscar o registro existente
    const { data, error } = await supabase
      .from('team_stats')
      .select('*')
      .limit(1)
      .order('id', { ascending: true })
      .single();
    
    if (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return null;
    }
    
    console.log('Estatísticas carregadas com sucesso:', data);
    return data as TeamStats;
  } catch (err) {
    console.error('Erro ao buscar estatísticas:', err);
    return null;
  }
};

/**
 * Cria um registro padrão de estatísticas caso não exista
 */
const createDefaultStats = async (): Promise<TeamStats | null> => {
  try {
    const defaultStats = {
      wins: 0,
      draws: 0,
      losses: 0
    };
    
    const { data, error } = await supabase
      .from('team_stats')
      .insert([defaultStats])
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar estatísticas padrão:', error);
      return null;
    }
    
    console.log('Estatísticas padrão criadas:', data);
    return data as TeamStats;
  } catch (err) {
    console.error('Erro ao criar estatísticas padrão:', err);
    return null;
  }
};

/**
 * Atualiza as estatísticas do time
 */
export const updateTeamStats = async (stats: Partial<TeamStats>): Promise<TeamStats | null> => {
  try {
    if (!stats.id) {
      console.error('ID não fornecido para atualização');
      // Se não tiver ID, tenta buscar o primeiro registro
      const currentStats = await getTeamStats();
      if (!currentStats || !currentStats.id) {
        console.error('Não foi possível determinar qual registro atualizar');
        return null;
      }
      stats.id = currentStats.id;
    }
    
    // Remover propriedades que não devem ser atualizadas
    const { created_at, ...updateData } = stats as any;
    
    // Loga o que será enviado
    console.log(`Atualizando registro de estatísticas com ID ${stats.id}:`, updateData);
    
    // Busca o registro antes para garantir que existe
    const { data: existingRecord, error: checkError } = await supabase
      .from('team_stats')
      .select('*')
      .eq('id', stats.id)
      .single();
    
    if (checkError) {
      console.error(`Registro com ID ${stats.id} não encontrado:`, checkError);
      // Tenta criar um novo registro
      return await createDefaultStats();
    }
    
    // Agora faz o update sabendo que o registro existe
    const { data, error } = await supabase
      .from('team_stats')
      .update({
        wins: updateData.wins,
        draws: updateData.draws,
        losses: updateData.losses
      })
      .eq('id', stats.id)
      .select()
      .single();
    
    if (error) {
      console.error(`Erro ao atualizar estatísticas (ID ${stats.id}):`, error);
      return null;
    }
    
    console.log('Estatísticas atualizadas com sucesso:', data);
    return data as TeamStats;
  } catch (err) {
    console.error('Erro ao atualizar estatísticas:', err);
    return null;
  }
}; 