import { createClient } from '@supabase/supabase-js';

// Idealmente, estas variáveis deveriam estar em .env
const supabaseUrl = 'https://bunkfbfqnbyuwuhhligv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1bmtmYmZxbmJ5dXd1aGhsaWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2NDU0ODYsImV4cCI6MjA1NzIyMTQ4Nn0.I4HRxc5KIcK-lIcSix_gucRRdnSPxg1Pe-n1TbrDnlo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para as entidades principais
export type Player = {
  id: number;
  name: string;
  number: number;
  position: string;
  image_url: string;
  goals: number;
  assists: number;
  saves?: number;
  created_at: string;
}

export type Match = {
  id: number;
  opponent: string;
  location: string;
  match_date: string;
  match_time: string;
  home_goals?: number;
  away_goals?: number;
  created_at: string;
}

// Tipo para o sistema de notícias/blog
export type News = {
  id: number;
  title: string;
  content: string;
  author: string;
  is_published: boolean;
  created_at: string;
}

// Tipo para autenticação
export type AdminUser = {
  id: string;
  username: string;
  role: 'admin';
}

// Credenciais para o ambiente de desenvolvimento
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'maneiro2025';

/**
 * Realiza login com credenciais
 */
export const loginWithPassword = async (username: string, password: string) => {
  // Em produção, usaria: return await supabase.auth.signInWithPassword({ email, password });
  
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return {
      data: {
        user: {
          id: 'admin-id',
          username,
          role: 'admin' as const
        }
      },
      error: null
    };
  }
  
  return { 
    data: { user: null }, 
    error: new Error('Credenciais inválidas') 
  };
};

/**
 * Realiza logout do usuário
 */
export const logoutUser = async () => {
  // Em produção, usaria: return await supabase.auth.signOut();
  return { error: null };
}; 