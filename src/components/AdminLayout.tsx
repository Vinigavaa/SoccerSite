import React, { useState, useEffect } from 'react';
import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import {
  Users,
  Calendar,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LayoutDashboard,
  Newspaper
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { isAdmin, logout, isLoading, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificação completa de autenticação
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('auth_user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    try {
      // Verificar se o token é válido
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = tokenData.exp * 1000;
      
      if (Date.now() > expirationTime) {
        // Token expirado, redirecionar para login
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        navigate('/login');
      }
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      navigate('/login');
    }
  }, [navigate]);

  // Exibe loader durante a verificação de autenticação
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redireciona para login se não for admin ou não estiver autenticado
  if (!isAdmin || !user) {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    return <Navigate to="/login" />;
  }

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
    { icon: <Users size={20} />, label: 'Jogadores', path: '/admin/players' },
    { icon: <Calendar size={20} />, label: 'Jogos', path: '/admin/matches' },
    { icon: <BarChart3 size={20} />, label: 'Estatísticas', path: '/admin/stats' },
    { icon: <Newspaper size={20} />, label: 'Notícias', path: '/admin/noticias' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        menuItems={menuItems}
        onLogout={handleLogout}
        username={user?.username || 'Admin'}
      />

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          sidebarOpen={sidebarOpen} 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Conteúdo da página */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Componente de loading spinner
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center h-screen bg-atletico-bordo">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-atletico-gold"></div>
  </div>
);

// Componente de sidebar
interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  menuItems: Array<{
    icon: React.ReactNode;
    label: string;
    path: string;
  }>;
  onLogout: () => void;
  username: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, menuItems, onLogout, username }) => (
  <aside
    className={`fixed inset-y-0 left-0 z-50 transform ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } w-64 bg-atletico-bordo text-white transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0`}
  >
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-atletico-gold/30">
        <div className="text-atletico-gold font-display text-xl font-bold">
          Atlético Admin
        </div>
        <button
          onClick={onToggle}
          className="p-1 rounded-md hover:bg-atletico-bordo-dark lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-4 border-b border-atletico-gold/30">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-atletico-gold flex items-center justify-center text-atletico-bordo font-bold">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="text-sm">
            <div className="font-medium text-white">{username}</div>
            <div className="text-xs text-atletico-gold/70">Administrador</div>
          </div>
        </div>
      </div>

      <nav className="flex-grow py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-atletico-gold hover:text-atletico-bordo transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-atletico-gold/30">
        <Button
          variant="outline"
          onClick={onLogout}
          className="w-full border-atletico-gold text-atletico-gold hover:bg-atletico-gold hover:text-atletico-bordo"
        >
          <LogOut size={16} className="mr-2" />
          Sair
        </Button>
      </div>
    </div>
  </aside>
);

// Componente de header
interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, onToggleSidebar }) => (
  <header className="bg-white shadow-sm z-40">
    <div className="px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 lg:hidden mr-2"
        >
          <Menu size={20} />
        </button>
        <button
          onClick={onToggleSidebar}
          className="hidden lg:block p-2 rounded-md hover:bg-gray-100"
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/" className="text-atletico-bordo hover:text-atletico-gold">
          Ver site
        </Link>
      </div>
    </div>
  </header>
);

export default AdminLayout; 