import React, { useState, useEffect, useRef } from 'react';
import { Newspaper, Calendar, User, Loader2, ChevronRight } from 'lucide-react';
import { getPublishedNews } from '@/services/newsService';
import { News } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const NewsSection: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleItems, setVisibleItems] = useState<{[key: number]: boolean}>({});
  const newsRefs = useRef<{[key: number]: HTMLDivElement | null}>({});

  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true);
      try {
        // Carregar apenas as 5 notícias mais recentes
        const data = await getPublishedNews(5);
        setNews(data);
        
        // Inicializa todos os itens como não-visíveis
        const initialVisibility: {[key: number]: boolean} = {};
        data.forEach((item, index) => {
          initialVisibility[index] = false;
        });
        setVisibleItems(initialVisibility);
      } catch (error) {
        console.error('Erro ao carregar notícias:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();
    
    // Configurar o observador de interseção após carregar notícias
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setVisibleItems(prev => ({...prev, [index]: true}));
          }
        });
      },
      { threshold: 0.2 }
    );

    // Observar os elementos de notícia
    return () => {
      Object.values(newsRefs.current).forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
      observer.disconnect();
    };
  }, []);
  
  useEffect(() => {
    // Configurar observers depois que as notícias são carregadas
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setVisibleItems(prev => ({...prev, [index]: true}));
          }
        });
      },
      { threshold: 0.2 }
    );
    
    // Adicionar observers para cada referência
    Object.entries(newsRefs.current).forEach(([key, ref]) => {
      if (ref) observer.observe(ref);
    });
    
    return () => observer.disconnect();
  }, [news]);

  const formatDate = (dateString: string): string => {
    try {
      // Usar UTC para evitar problemas com fuso horário
      const [datePart] = dateString.split('T');
      const [year, month, day] = datePart.split('-').map(Number);
      
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC'
      }).format(new Date(Date.UTC(year, month - 1, day)));
    } catch (error) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <section id="news" className="py-16 bg-atletico-bordo-dark">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-12">
            <Newspaper className="text-atletico-gold mr-3" size={28} />
            <h2 className="text-3xl md:text-4xl font-display font-bold text-atletico-gold">
              Últimas Notícias
            </h2>
          </div>
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-atletico-gold" />
          </div>
        </div>
      </section>
    );
  }

  if (news.length === 0) {
    return (
      <section id="news" className="py-16 bg-atletico-bordo-dark">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-12">
            <Newspaper className="text-atletico-gold mr-3" size={28} />
            <h2 className="text-3xl md:text-4xl font-display font-bold text-atletico-gold">
              Últimas Notícias
            </h2>
          </div>
          <Card className="glass-card p-8 text-center">
            <p className="text-atletico-white text-lg">
              Nenhuma notícia disponível no momento.
            </p>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="news" className="py-16 bg-atletico-bordo-dark relative">
      {/* Padrão de fundo */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-center mb-12">
          <Newspaper className="text-atletico-gold mr-3" size={28} />
          <h2 className="text-3xl md:text-4xl font-display font-bold text-atletico-gold">
            Últimas Notícias
          </h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {news.map((item, index) => (
            <div 
              key={item.id}
              ref={el => newsRefs.current[index] = el}
              data-index={index}
              className={`glass-card p-0 overflow-hidden transition-all duration-700 transform ${
                visibleItems[index] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="md:flex">
                <div className="md:w-1/3 bg-gradient-to-br from-atletico-bordo to-atletico-bordo-dark p-6 flex flex-col justify-center items-center">
                  <span className="text-4xl font-display font-bold text-atletico-gold">
                    {formatDate(item.created_at).split('/')[0]}
                  </span>
                  <span className="text-lg text-atletico-white">
                    {new Date(item.created_at).toLocaleString('pt-BR', { month: 'short' })}
                  </span>
                  <span className="text-lg text-atletico-white/70">
                    {new Date(item.created_at).getFullYear()}
                  </span>
                </div>
                
                <div className="md:w-2/3 p-6">
                  <h3 className="text-xl md:text-2xl font-bold text-atletico-gold mb-3">
                    {item.title}
                  </h3>
                  
                  <div className="flex flex-wrap items-center text-gray-300 text-sm mb-4">
                    <div className="flex items-center mr-6 mb-2">
                      <User className="h-4 w-4 mr-1 text-atletico-gold" />
                      <span>{item.author}</span>
                    </div>
                  </div>
                  
                  <div className="text-white line-clamp-3 mb-4 whitespace-pre-line">
                    {item.content}
                  </div>
                  
                  <Button variant="link" className="text-atletico-gold p-0 flex items-center group">
                    Leia mais 
                    <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-10">
          <Button className="glass-button">
            Ver Todas as Notícias
            <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection; 