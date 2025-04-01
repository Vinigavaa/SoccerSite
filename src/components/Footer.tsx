import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Footer: React.FC = () => {
  const { toast } = useToast();
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Inscrição realizada!",
      description: "Você agora receberá nossas novidades por email.",
    });
  };
  
  return (
    <footer className="bg-atletico-bordo-dark text-atletico-white border-t-4 border-atletico-gold">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
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
            <form onSubmit={handleSubscribe} className="space-y-2">
              <Input 
                placeholder="Seu email" 
                className="bg-white/10 border-atletico-gold/30 placeholder:text-atletico-white/50" 
                required
              />
              <Button type="submit" className="w-full bg-atletico-gold text-atletico-bordo hover:bg-atletico-gold-light">
                Inscrever-se
              </Button>
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
