import { supabase, News } from '@/lib/supabase';

export interface NewsInput {
  title: string;
  content: string;
  author: string;
  is_published: boolean;
}

/**
 * Busca todas as notícias no banco de dados
 */
export const getAllNews = async (): Promise<News[]> => {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar notícias:', error);
      return [];
    }

    return data as News[];
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    return [];
  }
};

/**
 * Busca apenas as notícias publicadas
 */
export const getPublishedNews = async (limit: number = 5): Promise<News[]> => {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Erro ao buscar notícias publicadas:', error);
      return [];
    }

    return data as News[];
  } catch (error) {
    console.error('Erro ao buscar notícias publicadas:', error);
    return [];
  }
};

/**
 * Busca uma notícia específica por ID
 */
export const getNewsById = async (id: number): Promise<News | null> => {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Erro ao buscar notícia ${id}:`, error);
      return null;
    }

    return data as News;
  } catch (error) {
    console.error(`Erro ao buscar notícia ${id}:`, error);
    return null;
  }
};

/**
 * Cria uma nova notícia
 */
export const createNews = async (news: NewsInput): Promise<News | null> => {
  try {
    const { data, error } = await supabase
      .from('news')
      .insert([news])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar notícia:', error);
      return null;
    }

    return data as News;
  } catch (error) {
    console.error('Erro ao criar notícia:', error);
    return null;
  }
};

/**
 * Atualiza uma notícia existente
 */
export const updateNews = async (id: number, news: Partial<NewsInput>): Promise<News | null> => {
  try {
    const { data, error } = await supabase
      .from('news')
      .update(news)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Erro ao atualizar notícia ${id}:`, error);
      return null;
    }

    return data as News;
  } catch (error) {
    console.error(`Erro ao atualizar notícia ${id}:`, error);
    return null;
  }
};

/**
 * Exclui uma notícia
 */
export const deleteNews = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Erro ao excluir notícia ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Erro ao excluir notícia ${id}:`, error);
    return false;
  }
}; 