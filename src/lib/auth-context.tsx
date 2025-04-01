import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginWithPassword, logoutUser, AdminUser } from './supabase';

type User = AdminUser | null;

type AuthContextType = {
  user: User;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = 'auth_user';
const AUTH_TOKEN_KEY = 'auth_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const verifyAuth = async () => {
      setIsLoading(true);
      try {
        const savedUser = localStorage.getItem(AUTH_USER_KEY);
        const authToken = localStorage.getItem(AUTH_TOKEN_KEY);
        
        if (!isValidSession(savedUser, authToken)) {
          clearAuthData();
          return;
        }
        
        setUser(JSON.parse(savedUser!));
      } catch (error) {
        console.error('Erro na verificação de autenticação:', error);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };
    
    verifyAuth();
  }, []);

  const isValidSession = (savedUser: string | null, authToken: string | null): boolean => {
    if (!savedUser || !authToken) return false;
    
    try {
      const tokenParts = authToken.split('.');
      if (tokenParts.length !== 3) return false;
      
      const tokenData = JSON.parse(atob(tokenParts[1]));
      
      if (!tokenData.exp) return false;
      const expirationTime = tokenData.exp * 1000;
      
      if (Date.now() > expirationTime) return false;
      
      const userData = JSON.parse(savedUser);
      if (!userData || !userData.id || !userData.username || userData.role !== 'admin') {
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao validar token:', error);
      return false;
    }
  };

  const clearAuthData = () => {
    setUser(null);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  };

  const createAuthToken = (userData: AdminUser): string => {
    const expirationTime = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
    const tokenPayload = {
      sub: userData.id,
      username: userData.username,
      role: userData.role,
      exp: expirationTime,
      iat: Math.floor(Date.now() / 1000),
    };
    
    const tokenHeader = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const tokenBody = btoa(JSON.stringify(tokenPayload));
    const tokenSignature = btoa('signature-' + userData.id + '-' + Math.random());
    
    return `${tokenHeader}.${tokenBody}.${tokenSignature}`;
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      clearAuthData();
      
      const { data, error } = await loginWithPassword(username, password);
      
      if (error || !data.user) {
        return false;
      }
      
      const userData: AdminUser = {
        id: data.user.id,
        username: data.user.username,
        role: 'admin'
      };
      
      const token = createAuthToken(userData);
      
      setUser(userData);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      
      return true;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await logoutUser();
      clearAuthData();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAdmin: user?.role === 'admin', 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
} 