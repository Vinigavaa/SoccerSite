import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  PlusCircle, 
  MoreVertical, 
  Edit,
  Trash2, 
  FileImage,
  User,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  getAllPlayers, 
  getPlayerById, 
  createPlayer, 
  updatePlayer, 
  deletePlayer, 
  uploadPlayerImage,
  PlayerInput 
} from '@/services/playerService';
import { Player } from '@/lib/supabase';

const PlayerManagement: React.FC = () => {
  const { toast } = useToast();

  // Estados
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [isEditingPlayer, setIsEditingPlayer] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [playerImage, setPlayerImage] = useState<File | null>(null);
  const [newPlayer, setNewPlayer] = useState<PlayerInput>({
    name: "",
    number: 0,
    position: "",
    image_url: "",
    goals: 0,
    assists: 0,
    saves: 0
  });

  // Posições disponíveis - array constante para uso em todo o componente
  const POSICOES = [
    "Goleiro",
    "Zagueiro",
    "Lateral",
    "Volante",
    "Meio-campista",
    "Atacante"
  ];

  // Carregar jogadores ao iniciar o componente
  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    setIsLoading(true);
    try {
      const data = await getAllPlayers();
      setPlayers(data);
    } catch (error) {
      console.error('Erro ao carregar jogadores:', error);
      toast({
        title: "Erro ao carregar jogadores",
        description: "Não foi possível carregar a lista de jogadores.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filtragem de jogadores por busca
  const filteredPlayers = players.filter(player => 
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.position.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f-]/g, '').includes(
      searchTerm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f-]/g, '')
    ) ||
    String(player.number).includes(searchTerm)
  );

  // Manipuladores de eventos para o formulário
  const handleAddNewPlayer = () => {
    setNewPlayer({
      name: "",
      number: 0,
      position: "",
      image_url: "",
      goals: 0,
      assists: 0,
      saves: 0
    });
    setPlayerImage(null);
    setIsAddingPlayer(true);
  };

  const handleEditPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setNewPlayer({
      name: player.name,
      number: player.number,
      position: player.position,
      image_url: player.image_url,
      goals: player.goals || 0,
      assists: player.assists || 0,
      saves: player.saves || 0
    });
    setPlayerImage(null);
    setIsEditingPlayer(true);
  };

  const handlePlayerFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setNewPlayer({
        ...newPlayer,
        [name]: parseInt(value) || 0
      });
    } else {
      setNewPlayer({
        ...newPlayer,
        [name]: value
      });
    }
  };

  const handlePositionChange = (value: string) => {
    setNewPlayer({
      ...newPlayer,
      position: value
    });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPlayerImage(e.target.files[0]);
      // Cria uma prévia da imagem selecionada
      const previewUrl = URL.createObjectURL(e.target.files[0]);
      setNewPlayer({
        ...newPlayer,
        image_url: previewUrl
      });
    }
  };

  const savePlayer = async () => {
    if (!newPlayer.name || !newPlayer.position || newPlayer.number <= 0) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = newPlayer.image_url;
      
      // Fazer upload da imagem se uma nova foi selecionada
      if (playerImage) {
        const uploadedUrl = await uploadPlayerImage(playerImage);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }
      
      const playerData: PlayerInput = {
        ...newPlayer,
        image_url: imageUrl
      };
      
      if (isEditingPlayer && selectedPlayer) {
        // Atualizar jogador existente
        const updatedPlayer = await updatePlayer(selectedPlayer.id, playerData);
        if (updatedPlayer) {
          toast({
            title: "Jogador atualizado",
            description: `${newPlayer.name} foi atualizado com sucesso.`
          });
          loadPlayers(); // Recarregar a lista
        }
      } else {
        // Adicionar novo jogador
        const createdPlayer = await createPlayer(playerData);
        if (createdPlayer) {
          toast({
            title: "Jogador adicionado",
            description: `${newPlayer.name} foi adicionado ao elenco.`
          });
          loadPlayers(); // Recarregar a lista
        }
      }

      // Fechar o modal e resetar estados
      setIsAddingPlayer(false);
      setIsEditingPlayer(false);
      setSelectedPlayer(null);
      setPlayerImage(null);
    } catch (error) {
      console.error('Erro ao salvar jogador:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar os dados do jogador.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePlayer = async (playerId: number) => {
    if (window.confirm("Tem certeza que deseja excluir este jogador?")) {
      setIsSubmitting(true);
      try {
        const success = await deletePlayer(playerId);
        if (success) {
          setPlayers(players.filter(player => player.id !== playerId));
          toast({
            title: "Jogador removido",
            description: "O jogador foi removido com sucesso."
          });
        }
      } catch (error) {
        console.error('Erro ao excluir jogador:', error);
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir o jogador.",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-atletico-bordo">Gerenciamento de Jogadores</h1>
          <p className="text-gray-500">Gerencie o elenco da equipe</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            onClick={handleAddNewPlayer}
            disabled={isAddingPlayer}
            className="bg-atletico-gold hover:bg-atletico-gold-light text-atletico-bordo"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            {isAddingPlayer ? 'Adicionando...' : 'Adicionar Jogador'}
          </Button>
        </div>
      </div>

      {/* Barra de busca */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar jogador por nome, posição ou número..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Tabela de jogadores */}
      <Card>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-atletico-bordo" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Foto</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Número</TableHead>
                <TableHead>Posição</TableHead>
                <TableHead>Gols</TableHead>
                <TableHead>Assistências</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlayers.map((player) => (
                <TableRow key={player.id}>
                  <TableCell>
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img
                        src={player.image_url || '/placeholder.png'}
                        alt={player.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{player.name}</TableCell>
                  <TableCell>{player.number}</TableCell>
                  <TableCell>{player.position}</TableCell>
                  <TableCell>{player.goals || 0}</TableCell>
                  <TableCell>{player.assists || 0}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditPlayer(player)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeletePlayer(player.id)}
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
      <Dialog open={isAddingPlayer || isEditingPlayer} onOpenChange={(open) => {
        if (!open) {
          setIsAddingPlayer(false);
          setIsEditingPlayer(false);
          setSelectedPlayer(null);
          setPlayerImage(null);
          setNewPlayer({
            name: "",
            number: 0,
            position: "",
            image_url: "",
            goals: 0,
            assists: 0,
            saves: 0
          });
        }
      }}>
        <DialogContent className="sm:max-w-2xl bg-white">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl text-atletico-bordo font-bold">
              {isEditingPlayer ? 'Editar Jogador' : 'Adicionar Novo Jogador'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-6">
            <div className="mb-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-dashed border-atletico-gold p-1 bg-gray-50 flex-shrink-0">
                <img
                  src={newPlayer.image_url || '/placeholder.png'}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              
              <div className="flex-1 space-y-4 text-center sm:text-left">
                <div>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <Label
                    htmlFor="image"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-atletico-gold rounded-md shadow-sm text-sm font-medium text-atletico-bordo bg-white hover:bg-atletico-gold/10"
                  >
                    <FileImage className="mr-2 h-4 w-4" />
                    Selecionar Foto
                  </Label>
                </div>
                <p className="text-sm text-gray-500">
                  Imagem quadrada recomendada (JPG, PNG), tamanho máximo 2MB
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div className="md:col-span-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1 block">
                  Nome do Jogador*
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="name"
                    name="name"
                    value={newPlayer.name}
                    onChange={handlePlayerFormChange}
                    className="bg-white border-gray-300 focus:border-atletico-gold focus:ring-atletico-gold text-gray-900"
                    placeholder="Digite o nome completo"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="number" className="text-sm font-medium text-gray-700 mb-1 block">
                  Número*
                </Label>
                <Input
                  id="number"
                  name="number"
                  type="number"
                  value={newPlayer.number === undefined ? '' : newPlayer.number}
                  onChange={handlePlayerFormChange}
                  className="bg-white border-gray-300 focus:border-atletico-gold focus:ring-atletico-gold text-gray-900"
                  placeholder="Ex: 10"
                  required
                  min="1"
                />
              </div>
              
              <div>
                <Label htmlFor="position" className="text-sm font-medium text-gray-700 mb-1 block">
                  Posição*
                </Label>
                <Select value={newPlayer.position} onValueChange={handlePositionChange}>
                  <SelectTrigger className="bg-white border-gray-300 focus:ring-atletico-gold text-gray-900">
                    <SelectValue placeholder="Selecione a posição" />
                  </SelectTrigger>
                  <SelectContent>
                    {POSICOES.map((posicao) => (
                      <SelectItem key={posicao} value={posicao}>{posicao}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-2 border-t border-gray-200 md:col-span-2">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Estatísticas</h3>
              </div>
              
              <div>
                <Label htmlFor="goals" className="text-sm font-medium text-gray-700 mb-1 block">
                  Gols
                </Label>
                <Input
                  id="goals"
                  name="goals"
                  type="number"
                  value={newPlayer.goals === undefined ? '' : newPlayer.goals}
                  onChange={handlePlayerFormChange}
                  className="bg-white border-gray-300 focus:border-atletico-gold focus:ring-atletico-gold text-gray-900"
                  placeholder="Gols marcados"
                />
              </div>
              
              <div>
                <Label htmlFor="assists" className="text-sm font-medium text-gray-700 mb-1 block">
                  Assistências
                </Label>
                <Input
                  id="assists"
                  name="assists"
                  type="number"
                  value={newPlayer.assists === undefined ? '' : newPlayer.assists}
                  onChange={handlePlayerFormChange}
                  className="bg-white border-gray-300 focus:border-atletico-gold focus:ring-atletico-gold text-gray-900"
                  placeholder="Assistências"
                />
              </div>
              
              <div>
                <Label htmlFor="saves" className="text-sm font-medium text-gray-700 mb-1 block">
                  Defesas (para goleiros)
                </Label>
                <Input
                  id="saves"
                  name="saves"
                  type="number"
                  value={newPlayer.saves === undefined ? '' : newPlayer.saves}
                  onChange={handlePlayerFormChange}
                  className="bg-white border-gray-300 focus:border-atletico-gold focus:ring-atletico-gold text-gray-900"
                  placeholder="Defesas (goleiros)"
                />
              </div>
            </div>
            
            <div className="text-xs text-gray-500 mt-5">
              * Campos obrigatórios
            </div>
          </div>
          
          <DialogFooter className="border-t pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddingPlayer(false);
                setIsEditingPlayer(false);
              }}
              className="border-gray-300 text-gray-700"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={savePlayer}
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

export default PlayerManagement; 