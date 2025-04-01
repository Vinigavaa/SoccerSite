import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, Calendar, BarChart3, PlusCircle, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const quickActions = [
    {
      icon: <Users size={24} />,
      title: 'Gerenciar Jogadores',
      description: 'Adicione ou edite informações dos jogadores',
      path: '/admin/players'
    },
    {
      icon: <Calendar size={24} />,
      title: 'Gerenciar Jogos',
      description: 'Configure partidas e resultados',
      path: '/admin/matches'
    },
    {
      icon: <BarChart3 size={24} />,
      title: 'Estatísticas',
      description: 'Visualize dados e métricas da equipe',
      path: '/admin/stats'
    }
  ];

  const recentActivities = [
    { text: 'Novo jogador adicionado: João Silva', time: 'Hoje, 14:30' },
    { text: 'Resultado atualizado: Atlético 2 x 1 Flamengo', time: 'Hoje, 13:15' },
    { text: 'Estatísticas atualizadas', time: 'Hoje, 12:00' },
    { text: 'Novo jogador adicionado: Pedro Santos', time: 'Ontem, 16:45' },
    { text: 'Resultado atualizado: Atlético 3 x 0 Vasco', time: 'Ontem, 15:30' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-atletico-bordo">Dashboard</h1>
          <p className="text-gray-500">Bem-vindo ao painel de administração</p>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <Card key={index} className="p-6 border border-atletico-gold/30 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="p-2 bg-atletico-gold/10 rounded-lg">
                {action.icon}
              </div>
              <Link to={action.path}>
                <Button variant="ghost" size="sm" className="text-atletico-bordo">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Acessar
                </Button>
              </Link>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-atletico-bordo">
              {action.title}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {action.description}
            </p>
          </Card>
        ))}
      </div>

      {/* Atividades Recentes */}
      <Card className="p-6 border border-atletico-gold/30 shadow-md">
        <h2 className="text-lg font-semibold text-atletico-bordo mb-4">
          Atividades Recentes
        </h2>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start justify-between py-2 border-b last:border-0">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-700">{activity.text}</span>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard; 