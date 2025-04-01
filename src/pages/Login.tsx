import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { EyeIcon, EyeOffIcon, UserIcon, KeyIcon, Lock, AlertTriangle, HomeIcon } from 'lucide-react';

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
    <div className="min-h-screen bg-atletico-bordo flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md p-4 sm:p-6 bg-white shadow-xl relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute top-0 right-0 w-full h-24 bg-atletico-bordo-dark/10 -skew-y-6 transform origin-top-right z-0"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-atletico-gold rounded-full flex items-center justify-center mb-4 shadow-md">
              <Lock className="h-8 w-8 text-atletico-bordo" />
            </div>
            <h1 className="text-2xl font-bold text-atletico-bordo">Área Administrativa</h1>
            <p className="text-gray-500 mt-2">SELECAIXA</p>
          </div>
          
          {errorMessage && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 text-sm">{errorMessage}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700 flex items-center">
                <UserIcon className="inline-block h-4 w-4 mr-1 text-atletico-bordo" />
                Nome de usuário
              </label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-3 bg-white border-gray-300 h-11"
                  disabled={isSubmitting || isBlocked}
                  required
                  autoComplete="username"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center">
                <KeyIcon className="inline-block h-4 w-4 mr-1 text-atletico-bordo" />
                Senha
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 bg-white border-gray-300 h-11"
                  disabled={isSubmitting || isBlocked}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-11 mt-6 text-base bg-atletico-gold hover:bg-atletico-gold-light text-atletico-bordo font-bold transition-all duration-300"
              disabled={isLoading || isSubmitting || isBlocked}
            >
              {isLoading || isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entrando...
                </span>
              ) : "Entrar"}
            </Button>
          </form>
          
          <div className="mt-8 flex justify-center">
            <a href="/" className="flex items-center text-atletico-bordo hover:text-atletico-gold transition-colors">
              <HomeIcon className="h-4 w-4 mr-1" />
              <span>Voltar para o site</span>
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login; 