import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { EyeIcon, EyeOffIcon, UserIcon, KeyIcon, Lock, AlertTriangle } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { login, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Verificar se já está autenticado
    if (isAdmin) {
      navigate('/admin');
    }
    
    // Verificar se foi redirecionado para login com mensagem de erro
    const params = new URLSearchParams(location.search);
    const authError = params.get('error');
    
    if (authError === 'session-expired') {
      toast({
        title: "Sessão expirada",
        description: "Sua sessão expirou. Por favor, faça login novamente.",
        variant: "destructive",
      });
    } else if (authError === 'auth-required') {
      toast({
        title: "Autenticação necessária",
        description: "Você precisa estar autenticado para acessar esta página.",
        variant: "destructive",
      });
    }
  }, [isAdmin, navigate, location, toast]);
  
  // Verificar tentativas de login
  useEffect(() => {
    if (loginAttempts >= 5) {
      setIsBlocked(true);
      toast({
        title: "Muitas tentativas de login",
        description: "Por segurança, aguarde alguns minutos antes de tentar novamente.",
        variant: "destructive",
      });
      
      // Desbloquear após 2 minutos
      const timer = setTimeout(() => {
        setIsBlocked(false);
        setLoginAttempts(0);
      }, 2 * 60 * 1000);
      
      return () => clearTimeout(timer);
    }
  }, [loginAttempts, toast]);
  
  const validateForm = (): boolean => {
    setErrorMessage('');
    
    if (!username.trim()) {
      setErrorMessage('O nome de usuário é obrigatório');
      return false;
    }
    
    if (!password.trim()) {
      setErrorMessage('A senha é obrigatória');
      return false;
    }
    
    if (password.length < 6) {
      setErrorMessage('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBlocked) {
      toast({
        title: "Acesso bloqueado",
        description: "Muitas tentativas de login. Tente novamente mais tarde.",
        variant: "destructive",
      });
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await login(username, password);
      
      if (success) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao painel administrativo.",
        });
        navigate('/admin');
      } else {
        setLoginAttempts(prev => prev + 1);
        toast({
          title: "Erro ao fazer login",
          description: "Usuário ou senha incorretos.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro durante o login:', error);
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro durante o login. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-atletico-bordo flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 bg-white shadow-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-atletico-gold rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-atletico-bordo" />
          </div>
          <h1 className="text-2xl font-bold text-atletico-bordo">Área Administrativa</h1>
          <p className="text-gray-500 mt-2">Atlético Maneiro</p>
        </div>
        
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 text-sm">{errorMessage}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-gray-700">
              Nome de usuário
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="username"
                type="text"
                placeholder="Digite seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 bg-white border-gray-300"
                disabled={isSubmitting || isBlocked}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Senha
            </label>
            <div className="relative">
              <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 bg-white border-gray-300"
                disabled={isSubmitting || isBlocked}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full mt-6 bg-atletico-gold hover:bg-atletico-gold-light text-atletico-bordo font-bold"
            disabled={isLoading || isSubmitting || isBlocked}
          >
            {isLoading || isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <a href="/" className="text-atletico-bordo hover:text-atletico-gold text-sm">
            Voltar para o site
          </a>
        </div>
      </Card>
    </div>
  );
};

export default Login; 