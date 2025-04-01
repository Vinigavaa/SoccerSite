import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  CalendarIcon,
  Clock,
  MapPin,
  MoreVertical, 
  Edit, 
  Trash2,
  Plus,
  PlusCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  getAllMatches, 
  getMatchById, 
  createMatch, 
  updateMatch, 
  deleteMatch, 
  updateMatchResult,
  MatchInput 
} from '@/services/matchService';
import { Match } from '@/lib/supabase';

const MatchManagement: React.FC = () => {
  const { toast } = useToast();
  
  // Estados
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingMatch, setIsAddingMatch] = useState(false);
  const [isEditingMatch, setIsEditingMatch] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isUpdatingResult, setIsUpdatingResult] = useState(false);
  
  const [newMatch, setNewMatch] = useState<MatchInput>({
    opponent: "",
    location: "",
    match_date: "",
    match_time: "",
    home_goals: 0,
    away_goals: 0
  });

  // Carregar partidas ao iniciar o componente
  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    setIsLoading(true);
    try {
      const data = await getAllMatches();
      setMatches(data);
    } catch (error) {
      console.error('Erro ao carregar partidas:', error);
      toast({
        title: "Erro ao carregar partidas",
        description: "Não foi possível carregar a lista de partidas.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Manipuladores de eventos para o formulário
  const handleAddNewMatch = () => {
    // Gerar data padrão (hoje) e hora padrão (19:00)
    const today = new Date();
    // Garantir que a data seja corretamente formatada sem ajustes de fuso horário
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    setNewMatch({
      opponent: "",
      location: "",
      match_date: formattedDate,
      match_time: "19:00",
      home_goals: undefined,
      away_goals: undefined
    });
    setIsAddingMatch(true);
  };

  const handleEditMatch = (match: Match) => {
    setSelectedMatch(match);
    setNewMatch({
      opponent: match.opponent,
      location: match.location,
      match_date: match.match_date,
      match_time: match.match_time,
      home_goals: match.home_goals,
      away_goals: match.away_goals
    });
    setIsEditingMatch(true);
  };

  const handleUpdateResult = (match: Match) => {
    setSelectedMatch(match);
    setNewMatch({
      opponent: match.opponent,
      location: match.location,
      match_date: match.match_date,
      match_time: match.match_time,
      home_goals: match.home_goals || 0,
      away_goals: match.away_goals || 0
    });
    setIsUpdatingResult(true);
  };

  const handleMatchFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setNewMatch({
        ...newMatch,
        [name]: value ? parseInt(value) : undefined
      });
    } else {
      setNewMatch({
        ...newMatch,
        [name]: value
      });
    }
  };

  const saveMatch = async () => {
    if (!newMatch.opponent || !newMatch.location || !newMatch.match_date || !newMatch.match_time) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Evitar qualquer manipulação da data que possa causar problemas de fuso horário
      const matchData = {
        ...newMatch,
        match_date: newMatch.match_date // Preservar a data exatamente como inserida
      };
      
      if (isEditingMatch && selectedMatch) {
        // Atualizar partida existente
        const updatedMatch = await updateMatch(selectedMatch.id, matchData);
        if (updatedMatch) {
          toast({
            title: "Partida atualizada",
            description: `Partida contra ${newMatch.opponent} foi atualizada com sucesso.`
          });
          loadMatches(); // Recarregar a lista
        }
      } else if (isUpdatingResult && selectedMatch) {
        // Atualizar apenas o resultado
        const success = await updateMatchResult(
          selectedMatch.id, 
          newMatch.home_goals || 0, 
          newMatch.away_goals || 0
        );
        
        if (success) {
          toast({
            title: "Resultado registrado",
            description: `Resultado da partida contra ${selectedMatch.opponent} foi registrado.`
          });
          loadMatches(); // Recarregar a lista
        }
      } else {
        // Adicionar nova partida
        const createdMatch = await createMatch(matchData);
        if (createdMatch) {
          toast({
            title: "Partida adicionada",
            description: `Partida contra ${newMatch.opponent} foi adicionada à agenda.`
          });
          loadMatches(); // Recarregar a lista
        }
      }

      // Fechar o modal e resetar estados
      setIsAddingMatch(false);
      setIsEditingMatch(false);
      setIsUpdatingResult(false);
      setSelectedMatch(null);
      setNewMatch({
        opponent: "",
        location: "",
        match_date: "",
        match_time: "",
        home_goals: 0,
        away_goals: 0
      });
    } catch (error) {
      console.error('Erro ao salvar partida:', error);
      toast({
        title: "Erro ao salvar partida",
        description: "Não foi possível salvar a partida.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMatch = async (matchId: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta partida?")) {
      setIsSubmitting(true);
      try {
        const success = await deleteMatch(matchId);
        if (success) {
          setMatches(matches.filter(match => match.id !== matchId));
          toast({
            title: "Partida removida",
            description: "A partida foi removida com sucesso."
          });
        }
      } catch (error) {
        console.error('Erro ao excluir partida:', error);
        toast({
          title: "Erro ao excluir partida",
          description: "Não foi possível excluir a partida.",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      // Criar a data como UTC para evitar problemas de fuso horário
      const [year, month, day] = dateString.split('-');
      // Usar UTC para garantir que a data não seja alterada pelo fuso horário
      const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), 12, 0, 0));
      return format(date, "PPP", { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  const isPastMatch = (match: Match) => {
    const matchDate = new Date(match.match_date);
    const today = new Date();
    return matchDate < today;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-atletico-bordo">Gerenciamento de Partidas</h1>
          <p className="text-gray-500">Gerencie as partidas e resultados da equipe</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            onClick={handleAddNewMatch}
            disabled={isAddingMatch}
            className="bg-atletico-gold hover:bg-atletico-gold-light text-atletico-bordo"
          >
            <Plus className="mr-2 h-4 w-4" />
            {isAddingMatch ? 'Adicionando...' : 'Adicionar Partida'}
          </Button>
        </div>
      </div>

      {/* Tabela de partidas */}
      <Card>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-atletico-bordo" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Adversário</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Local</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matches.map((match) => (
                <TableRow key={match.id}>
                  <TableCell className="font-medium">
                    SELECAIXA x {match.opponent}
                  </TableCell>
                  <TableCell>{formatDate(match.match_date)}</TableCell>
                  <TableCell>{match.location}</TableCell>
                  <TableCell>
                    {match.home_goals !== null && match.away_goals !== null
                      ? `${match.home_goals} x ${match.away_goals}`
                      : 'Não iniciado'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditMatch(match)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateResult(match)}>
                          <Clock className="mr-2 h-4 w-4" />
                          Atualizar Resultado
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteMatch(match.id)}
                          className="text-red-600"
                          disabled={isSubmitting}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Modal de Criação/Edição */}
      <Dialog open={isAddingMatch || isEditingMatch || isUpdatingResult} onOpenChange={(open) => {
        if (!open) {
          setIsAddingMatch(false);
          setIsEditingMatch(false);
          setIsUpdatingResult(false);
          setSelectedMatch(null);
          setNewMatch({
            opponent: "",
            location: "",
            match_date: "",
            match_time: "",
            home_goals: 0,
            away_goals: 0
          });
        }
      }}>
        <DialogContent className="sm:max-w-2xl bg-white">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl text-atletico-bordo font-bold">
              {isEditingMatch ? 'Editar Partida' : isUpdatingResult ? 'Atualizar Resultado' : 'Adicionar Nova Partida'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-6">
            <div className="mb-6 bg-[#330000] rounded-lg p-4 text-center">
              <h3 className="text-atletico-gold text-lg font-bold mb-2">
                SELECAIXA x {newMatch.opponent || "Adversário"}
              </h3>
              {newMatch.match_date && (
                <p className="text-white text-sm">
                  {formatDate(newMatch.match_date)} • {newMatch.match_time || "19:00"}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div className="md:col-span-2">
                <Label htmlFor="opponent" className="text-sm font-medium text-gray-700 mb-1 block">
                  Nome do Adversário*
                </Label>
                <Input
                  id="opponent"
                  name="opponent"
                  value={newMatch.opponent}
                  onChange={handleMatchFormChange}
                  className="bg-white border-gray-300 focus:border-atletico-gold focus:ring-atletico-gold text-gray-900"
                  placeholder="Digite o nome do adversário"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="location" className="text-sm font-medium text-gray-700 mb-1 block">
                  Local da Partida*
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="location"
                    name="location"
                    value={newMatch.location}
                    onChange={handleMatchFormChange}
                    className="pl-10 bg-white border-gray-300 focus:border-atletico-gold focus:ring-atletico-gold text-gray-900"
                    placeholder="Nome do estádio ou local"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="match_date" className="text-sm font-medium text-gray-700 mb-1 block">
                  Data*
                </Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="match_date"
                    name="match_date"
                    type="date"
                    value={newMatch.match_date}
                    onChange={handleMatchFormChange}
                    className="pl-10 bg-white border-gray-300 focus:border-atletico-gold focus:ring-atletico-gold text-gray-900"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="match_time" className="text-sm font-medium text-gray-700 mb-1 block">
                  Horário*
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="match_time"
                    name="match_time"
                    type="time"
                    value={newMatch.match_time}
                    onChange={handleMatchFormChange}
                    className="pl-10 bg-white border-gray-300 focus:border-atletico-gold focus:ring-atletico-gold text-gray-900"
                    required
                  />
                </div>
              </div>
              
              {(isUpdatingResult || isEditingMatch) && (
                <>
                  <div className="md:col-span-2 pt-2 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Resultado da Partida</h3>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <Label className="text-sm font-medium text-center text-gray-700 mb-2 block">
                      Gols SELECAIXA
                    </Label>
                    <Input
                      id="home_goals"
                      name="home_goals"
                      type="number"
                      value={newMatch.home_goals === undefined ? '' : newMatch.home_goals}
                      onChange={handleMatchFormChange}
                      min="0"
                      className="bg-white border-gray-300 focus:border-atletico-gold focus:ring-atletico-gold text-center w-20 text-gray-900"
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <Label className="text-sm font-medium text-center text-gray-700 mb-2 block">
                      Gols {newMatch.opponent || 'Adversário'}
                    </Label>
                    <Input
                      id="away_goals"
                      name="away_goals"
                      type="number"
                      value={newMatch.away_goals === undefined ? '' : newMatch.away_goals}
                      onChange={handleMatchFormChange}
                      min="0"
                      className="bg-white border-gray-300 focus:border-atletico-gold focus:ring-atletico-gold text-center w-20 text-gray-900"
                      placeholder="0"
                    />
                  </div>
                </>
              )}
            </div>
            
            <div className="text-xs text-gray-500 mt-5">
              * Campos obrigatórios
            </div>
          </div>
          
          <DialogFooter className="border-t pt-4">
            <Button 
              variant="outline"
              onClick={() => {
                setIsAddingMatch(false);
                setIsEditingMatch(false);
                setIsUpdatingResult(false);
              }}
              className="border-gray-300 text-gray-700"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={saveMatch}
              disabled={isSubmitting}
              className="bg-atletico-gold hover:bg-atletico-gold-light text-atletico-bordo"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MatchManagement; 