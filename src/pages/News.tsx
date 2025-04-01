import React, { useState, useEffect } from 'react';
import { Newspaper, Calendar, User, Loader2 } from 'lucide-react';
import { getPublishedNews } from '@/services/newsService';
import { News as NewsType } from '@/lib/supabase';

const News: React.FC = () => {
  const [news, setNews] = useState<NewsType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true);
      try {
        // Carregar todas as notícias publicadas (não limitado a 5)
        const data = await getPublishedNews(20); // Carregar mais notícias para a página dedicada
        setNews(data);
      } catch (error) {
        console.error('Erro ao carregar notícias:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-[#550000]">
      {/* Header */}
      <header className="py-20 bg-[#330000]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <Newspaper className="text-[#daa520] mr-3" size={36} />
            <h1 className="text-4xl md:text-5xl font-display font-bold text-[#daa520]">
              Blog do Atlético
            </h1>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-[#daa520]" />
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-8 text-white">
              Nenhuma notícia disponível no momento.
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {news.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-[#330000] rounded-lg p-6 mb-8 shadow-lg border-l-4 border-[#daa520]"
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-[#daa520] mb-3">
                    {item.title}
                  </h2>
                  
                  <div className="flex flex-wrap items-center text-gray-300 text-sm mb-6">
                    <div className="flex items-center mr-6 mb-2">
                      <Calendar className="h-4 w-4 mr-1 text-[#daa520]" />
                      <span>{formatDate(item.created_at)}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <User className="h-4 w-4 mr-1 text-[#daa520]" />
                      <span>{item.author}</span>
                    </div>
                  </div>
                  
                  <div className="text-white whitespace-pre-line">
                    {item.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 bg-[#330000] text-white text-center">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Atlético Maneiro. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default News; 