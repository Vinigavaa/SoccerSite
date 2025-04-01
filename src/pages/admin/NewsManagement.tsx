import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, 
  Plus, 
  Pencil, 
  Trash2, 
  Calendar, 
  User, 
  Check, 
  X,
  Newspaper,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  getAllNews, 
  createNews, 
  updateNews, 
  deleteNews,
  NewsInput
} from '@/services/newsService';
import { News } from '@/lib/supabase';

const NewsManagement: React.FC = () => {
  const { toast } = useToast();
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [newsInput, setNewsInput] = useState<NewsInput>({
    title: '',
    content: '',
    author: '',
    is_published: true
  });

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setIsLoading(true);
    try {
      const data = await getAllNews();
      setNews(data);
    } catch (error) {
      console.error('Erro ao carregar notícias:', error);
      toast({
        title: "Erro ao carregar notícias",
        description: "Não foi possível carregar as notícias.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setNewsInput({
      title: '',
      content: '',
      author: '',
      is_published: true
    });
  };

  const handleOpenCreateDialog = () => {
    resetForm();
    setFormMode('create');
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (newsItem: News) => {
    setSelectedNews(newsItem);
    setNewsInput({
      title: newsItem.title,
      content: newsItem.content,
      author: newsItem.author,
      is_published: newsItem.is_published
    });
    setFormMode('edit');
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (newsItem: News) => {
    setSelectedNews(newsItem);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewsInput(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setNewsInput(prev => ({
      ...prev,
      is_published: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (formMode === 'create') {
        const result = await createNews(newsInput);
        if (result) {
          toast({
            title: "Notícia criada",
            description: "A notícia foi criada com sucesso."
          });
          setNews(prev => [result, ...prev]);
          setIsDialogOpen(false);
        }
      } else if (formMode === 'edit' && selectedNews) {
        const result = await updateNews(selectedNews.id, newsInput);
        if (result) {
          toast({
            title: "Notícia atualizada",
            description: "A notícia foi atualizada com sucesso."
          });
          setNews(prev => 
            prev.map(item => item.id === selectedNews.id ? result : item)
          );
          setIsDialogOpen(false);
        }
      }
    } catch (error) {
      console.error('Erro ao salvar notícia:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar a notícia.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedNews) return;

    setIsSaving(true);
    try {
      const success = await deleteNews(selectedNews.id);
      if (success) {
        toast({
          title: "Notícia excluída",
          description: "A notícia foi excluída com sucesso."
        });
        setNews(prev => prev.filter(item => item.id !== selectedNews.id));
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error('Erro ao excluir notícia:', error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir a notícia.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-atletico-bordo" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-atletico-bordo">Gerenciamento de Notícias</h1>
          <p className="text-gray-500">Gerencie as notícias do site</p>
        </div>
        <Button 
          onClick={handleOpenCreateDialog}
          className="bg-atletico-gold hover:bg-atletico-gold-light text-atletico-bordo"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Notícia
        </Button>
      </div>

      <Card className="p-6">
        {news.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhuma notícia encontrada. Clique em "Nova Notícia" para criar uma.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {news.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.author}</TableCell>
                    <TableCell>{formatDate(item.created_at)}</TableCell>
                    <TableCell>
                      {item.is_published ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Check className="mr-1 h-3 w-3" />
                          Publicada
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <X className="mr-1 h-3 w-3" />
                          Rascunho
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEditDialog(item)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDeleteDialog(item)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Dialog para criar/editar notícia */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-w-[95vw] bg-gray-50 border border-atletico-gold/30 p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
          <DialogHeader className="border-b border-gray-200 pb-4">
            <DialogTitle className="text-atletico-bordo text-xl">
              {formMode === 'create' ? 'Nova Notícia' : 'Editar Notícia'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-800 font-medium flex items-center">
                <Newspaper className="h-4 w-4 mr-1 text-atletico-bordo" />
                Título
              </Label>
              <Input
                id="title"
                name="title"
                value={newsInput.title}
                onChange={handleInputChange}
                placeholder="Digite o título da notícia"
                className="border-gray-300 focus:border-atletico-gold focus:ring-atletico-gold bg-white text-gray-900 h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author" className="text-gray-800 font-medium flex items-center">
                <User className="h-4 w-4 mr-1 text-atletico-bordo" />
                Autor
              </Label>
              <Input
                id="author"
                name="author"
                value={newsInput.author}
                onChange={handleInputChange}
                placeholder="Nome do autor"
                className="border-gray-300 focus:border-atletico-gold focus:ring-atletico-gold bg-white text-gray-900 h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content" className="text-gray-800 font-medium flex items-center">
                <span className="flex items-center">
                  <FileText className="h-4 w-4 mr-1 text-atletico-bordo" />
                  Conteúdo
                </span>
              </Label>
              <Textarea
                id="content"
                name="content"
                value={newsInput.content}
                onChange={handleInputChange}
                placeholder="Digite o conteúdo da notícia"
                className="min-h-[150px] sm:min-h-[200px] border-gray-300 focus:border-atletico-gold focus:ring-atletico-gold bg-white text-gray-900 resize-y"
                required
              />
            </div>
            <div className="flex items-center space-x-2 bg-white p-3 rounded-md border border-gray-200">
              <Checkbox
                id="is_published"
                checked={newsInput.is_published}
                onCheckedChange={handleCheckboxChange}
                className="border-atletico-bordo text-atletico-gold focus:ring-atletico-gold"
              />
              <Label htmlFor="is_published" className="cursor-pointer text-gray-800 flex items-center">
                <Check className="h-4 w-4 mr-1 text-green-500" />
                Publicar imediatamente
              </Label>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-3 border-t border-gray-200 pt-4 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSaving}
                className="border-atletico-bordo text-atletico-bordo hover:bg-atletico-bordo/10 w-full sm:w-auto order-2 sm:order-1"
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-atletico-gold hover:bg-atletico-gold-light text-atletico-bordo w-full sm:w-auto order-1 sm:order-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Newspaper className="mr-2 h-4 w-4" />
                    {formMode === 'create' ? 'Criar Notícia' : 'Salvar Alterações'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para confirmar exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md max-w-[95vw] bg-gray-50 border border-red-200 p-4 sm:p-6">
          <DialogHeader className="border-b border-gray-200 pb-4">
            <DialogTitle className="text-red-600 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Confirmar Exclusão
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-gray-800">Tem certeza que deseja excluir a notícia "{selectedNews?.title}"?</p>
            <p className="text-sm text-gray-500">Esta ação não pode ser desfeita.</p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 border-t border-gray-200 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSaving}
              className="border-gray-300 text-gray-700 w-full sm:w-auto order-2 sm:order-1"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              disabled={isSaving}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 w-full sm:w-auto order-1 sm:order-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewsManagement; 