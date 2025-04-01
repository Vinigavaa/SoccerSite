import React, { useEffect, useState } from 'react';
import { Menu, X, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { ANIMATIONS } from '@/lib/constants';

const ClubHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAdmin, user, logout } = useAuth();

  useEffect(() => {
    setIsLoaded(true);
    
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className="relative w-full bg-atletico-bordo">
      <div className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'py-2 bg-atletico-bordo-dark shadow-lg' : 'py-5 bg-transparent'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-atletico-gold font-display text-2xl md:text-3xl font-bold">
                SELECAIXA
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#team" className="text-atletico-white hover:text-atletico-gold transition-colors font-semibold">
                Elenco
              </a>
              <a href="#stats" className="text-atletico-white hover:text-atletico-gold transition-colors font-semibold">
                Estatísticas
              </a>
              <a href="#next-match" className="text-atletico-white hover:text-atletico-gold transition-colors font-semibold">
                Próximo Jogo
              </a>
              {isAdmin ? (
                <Link to="/admin">
                  <Button className="glass-button">
                    Painel Admin
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button className="glass-button">
                    <UserCircle className="mr-2 h-4 w-4" />
                    Área do Administrador
                  </Button>
                </Link>
              )}
            </nav>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-atletico-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X size={24} className="text-atletico-gold" />
              ) : (
                <Menu size={24} className="text-atletico-gold" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 glass-effect pt-20 px-4">
          <nav className="flex flex-col space-y-4">
            <a 
              href="#team" 
              className="text-atletico-white hover:text-atletico-gold text-xl transition-colors py-2 border-b border-atletico-gold/20"
              onClick={() => setMobileMenuOpen(false)}
            >
              Elenco
            </a>
            <a 
              href="#stats" 
              className="text-atletico-white hover:text-atletico-gold text-xl transition-colors py-2 border-b border-atletico-gold/20"
              onClick={() => setMobileMenuOpen(false)}
            >
              Estatísticas
            </a>
            <a 
              href="#next-match" 
              className="text-atletico-white hover:text-atletico-gold text-xl transition-colors py-2 border-b border-atletico-gold/20"
              onClick={() => setMobileMenuOpen(false)}
            >
              Próximo Jogo
            </a>
            {isAdmin ? (
              <Link 
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="glass-button mt-4 text-center font-bold"
              >
                Painel Admin
              </Link>
            ) : (
              <Link 
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="glass-button mt-4 text-center font-bold"
              >
                <UserCircle className="inline-block mr-2 h-4 w-4" />
                Área do Administrador
              </Link>
            )}
          </nav>
        </div>
      )}
      
      {/* Header Content */}
      <div className="container mx-auto pt-36 pb-24 text-center relative z-0">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
          {/* Escudo do Clube */}
          <div className={`w-auto h-auto md:w-64 md:h-64 ${isLoaded ? 'animate-float' : ''}`}>
            <img 
              src="/escudo.png" 
              alt="Escudo do SELECAIXA" 
              className="w-full h-full object-contain drop-shadow-xl"
            />
          </div>
          
          <div>
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold text-atletico-white mb-4 opacity-0 animate-fade-in white-text-shadow" 
                style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              SELECAIXA
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-atletico-white/90 max-w-2xl mx-auto opacity-0 animate-fade-in" 
               style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-atletico-gold-light">
                Since 2024
              </span>
            </p>
            
            <div className="mt-8 opacity-0 animate-fade-in" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
              <a href="#next-match" className="glass-button animate-pulse-custom inline-flex items-center">
                Ver Próximo Jogo
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Accent Line com gradiente */}
      <div className="h-1 w-full bg-gradient-to-r from-atletico-bordo-dark via-atletico-gold to-atletico-bordo-dark"></div>
    </header>
  );
};

export default ClubHeader;
