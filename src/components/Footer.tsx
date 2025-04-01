import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Instagram, Twitter, Mail, SendIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Footer: React.FC = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "E-mail inválido",
        description: "Por favor, insira um e-mail válido.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulando tempo de resposta do servidor
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail('');
      toast({
        title: "Inscrição realizada!",
        description: "Você agora receberá nossas novidades por email.",
      });
    }, 600);
  };
  
  return (
    <footer className="bg-atletico-bordo-dark text-atletico-white border-t-4 border-atletico-gold">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-8">
          <div>
            <h3 className="text-atletico-gold font-display text-2xl font-bold mb-4">SELECAIXA</h3>
            <p className="mb-6 text-atletico-white/80">
              Siga o SELECAIXA: Onde cada torcedor é combustível para nossa jornada!
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="w-10 h-10 rounded-full bg-atletico-bordo flex items-center justify-center hover:bg-atletico-gold hover:text-atletico-bordo transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" className="w-10 h-10 rounded-full bg-atletico-bordo flex items-center justify-center hover:bg-atletico-gold hover:text-atletico-bordo transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" className="w-10 h-10 rounded-full bg-atletico-bordo flex items-center justify-center hover:bg-atletico-gold hover:text-atletico-bordo transition-colors">
                <Twitter size={20} />
              </a>
              <a href="mailto:contato@atleticomaneiro.com" className="w-10 h-10 rounded-full bg-atletico-bordo flex items-center justify-center hover:bg-atletico-gold hover:text-atletico-bordo transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-atletico-gold font-bold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-atletico-white/80 hover:text-atletico-gold transition-colors">Sobre o Clube</a>
              </li>
              <li>
                <a href="#team" className="text-atletico-white/80 hover:text-atletico-gold transition-colors">Elenco</a>
              </li>
              <li>
                <a href="#stats" className="text-atletico-white/80 hover:text-atletico-gold transition-colors">Estatísticas</a>
              </li>
              <li>
                <a href="#next-match" className="text-atletico-white/80 hover:text-atletico-gold transition-colors">Jogos</a>
              </li>
              <li>
                <a href="#" className="text-atletico-white/80 hover:text-atletico-gold transition-colors">Contato</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-atletico-gold font-bold text-lg mb-4">Newsletter</h3>
            <p className="mb-4 text-atletico-white/80">
              Inscreva-se para receber as últimas notícias e atualizações.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-grow">
                  <Input 
                    placeholder="Seu email" 
                    className="bg-white/10 border-atletico-gold/30 placeholder:text-atletico-white/50 h-11 text-base"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Email para newsletter"
                    autoComplete="email"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="glass-button sm:flex-shrink-0"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Inscrever-se
                      <SendIcon className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-atletico-gold/20 text-center text-atletico-white/60 text-sm">
          <p>© {new Date().getFullYear()} SELECAIXA. Todos os direitos reservados.</p>
          <p className="mt-2">
            <a href="#" className="hover:text-atletico-gold">Política de Privacidade</a> | 
            <a href="#" className="hover:text-atletico-gold ml-2">Termos de Uso</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
