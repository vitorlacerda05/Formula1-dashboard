import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Trophy, Calendar, Flag, Plus, Search, Upload } from 'lucide-react';
import NewTeamModal from '../components/NewTeamModal';
import NewDriverModal from '../components/NewDriverModal';
import SearchDriverByLastNameModal from '../components/SearchDriverByLastNameModal';
import UploadDriversModal from '../components/UploadDriversModal';
import { 
  dashboardApi, 
  AdminStats, 
  RaceData, 
  TeamData, 
  DriverData, 
  TeamStats, 
  DriverStats 
} from '../lib/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [showNewTeam, setShowNewTeam] = useState(false);
  const [showNewDriver, setShowNewDriver] = useState(false);
  const [showSearchDriver, setShowSearchDriver] = useState(false);
  const [showUploadDrivers, setShowUploadDrivers] = useState(false);

  // Estados para dados do admin
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [races, setRaces] = useState<RaceData[]>([]);
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [drivers, setDrivers] = useState<DriverData[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para dados da equipe e piloto
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null);
  const [driverStats, setDriverStats] = useState<DriverStats | null>(null);

  // Função para carregar dados do admin
  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsResponse, racesResponse, teamsResponse, driversResponse] = await Promise.all([
        dashboardApi.getAdminStats(),
        dashboardApi.getCurrentYearRaces(),
        dashboardApi.getCurrentYearTeams(),
        dashboardApi.getCurrentYearDrivers(),
      ]);

      if (statsResponse.success) setAdminStats(statsResponse.data);
      if (racesResponse.success) setRaces(racesResponse.data);
      if (teamsResponse.success) setTeams(teamsResponse.data);
      if (driversResponse.success) setDrivers(driversResponse.data);
    } catch (error) {
      console.error('Erro ao carregar dados do admin:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para carregar dados da equipe
  const loadTeamData = async (constructorId: string) => {
    try {
      console.log('Iniciando carregamento dos dados da equipe para ID:', constructorId);
      setLoading(true);
      const response = await dashboardApi.getTeamStats(constructorId);
      console.log('Resposta da API getTeamStats:', response);
      if (response.success) {
        setTeamStats(response.data);
        console.log('Dados da equipe carregados com sucesso:', response.data);
      } else {
        console.error('API retornou success: false para getTeamStats:', response);
      }
    } catch (error) {
      console.error('Erro ao carregar dados da equipe:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para carregar dados do piloto
  const loadDriverData = async (driverId: string) => {
    try {
      console.log('Iniciando carregamento dos dados do piloto para ID:', driverId);
      setLoading(true);
      const response = await dashboardApi.getDriverStats(driverId);
      console.log('Resposta da API getDriverStats:', response);
      if (response.success) {
        setDriverStats(response.data);
        console.log('Dados do piloto carregados com sucesso:', response.data);
      } else {
        console.error('API retornou success: false para getDriverStats:', response);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do piloto:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Dashboard useEffect - user:', user);
    console.log('Dashboard useEffect - user.type:', user?.type);
    console.log('Dashboard useEffect - user.idOriginal:', user?.idOriginal);
    
    if (user?.type === 'administrator') {
      loadAdminData();
    } else if (user?.type === 'team' && user?.idOriginal) {
      console.log('Carregando dados da equipe para ID:', user.idOriginal);
      loadTeamData(user.idOriginal.toString());
    } else if (user?.type === 'driver' && user?.idOriginal) {
      console.log('Carregando dados do piloto para ID:', user.idOriginal);
      loadDriverData(user.idOriginal.toString());
    } else {
      // Se não há condições para carregar dados, desabilita o loading
      console.log('Nenhuma condição atendida para carregar dados. Tipo:', user?.type, 'idOriginal:', user?.idOriginal);
      setLoading(false);
    }
  }, [user?.type, user?.idOriginal]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Carregando...</div>
        </div>
      </div>
    );
  }

  if (user?.type === 'administrator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Dashboard do Administrador</h2>
          <p className="text-gray-600 dark:text-gray-300 transition-colors">Visão geral do sistema de gestão da Fórmula 1</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Pilotos</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminStats?.total_pilotos || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Equipes</CardTitle>
              <Flag className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminStats?.total_escuderias || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Temporadas</CardTitle>
              <Calendar className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminStats?.total_temporadas || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Section */}
        <Card className="mb-8 bg-card dark:bg-gray-800 border-border dark:border-gray-700 transition-colors">
          <CardHeader>
            <CardTitle className="text-card-foreground dark:text-white">Ações Disponíveis</CardTitle>
            <CardDescription className="text-muted-foreground dark:text-gray-300">Gerenciar equipes e pilotos do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                onClick={() => setShowNewTeam(true)}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white"
              >
                <Plus className="w-4 h-4" />
                <span>Cadastrar Nova Equipe</span>
              </Button>
              <Button 
                onClick={() => setShowNewDriver(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4" />
                <span>Cadastrar Novo Piloto</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-card dark:bg-gray-800 border-border dark:border-gray-700 transition-colors">
            <CardHeader>
              <CardTitle className="text-card-foreground dark:text-white">Corridas do Ano Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {races.slice(0, 3).map((race, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{race.nome_corrida}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{race.max_voltas_registradas} voltas</p>
                    </div>
                    <Badge variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                      {race.duracao_estimada_formatada}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card dark:bg-gray-800 border-border dark:border-gray-700 transition-colors">
            <CardHeader>
              <CardTitle className="text-card-foreground dark:text-white">Equipes - Ano Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teams.slice(0, 3).map((team, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
                    <p className="font-medium text-gray-900 dark:text-white">{team.nome_escuderia}</p>
                    <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                      {team.total_pontos_ano} pts
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card dark:bg-gray-800 border-border dark:border-gray-700 transition-colors">
            <CardHeader>
              <CardTitle className="text-card-foreground dark:text-white">Pilotos - Ano Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {drivers.slice(0, 3).map((driver, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
                    <p className="font-medium text-gray-900 dark:text-white">{driver.nome_piloto}</p>
                    <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                      {driver.total_pontos_ano} pts
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modals */}
        <NewTeamModal isOpen={showNewTeam} onClose={() => setShowNewTeam(false)} />
        <NewDriverModal isOpen={showNewDriver} onClose={() => setShowNewDriver(false)} />
      </div>
    );
  }

  if (user?.type === 'team') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Dashboard da Equipe</h2>
          <p className="text-gray-600 dark:text-gray-300 transition-colors">Informações da {user.teamName}</p>
        </div>

        {/* Team Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vitórias</CardTitle>
              <Trophy className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamStats?.vitorias || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pilotos Diferentes</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamStats?.pilotos_unicos || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Primeiro Ano</CardTitle>
              <Calendar className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamStats?.primeiro_ano || 'N/A'}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Último Ano</CardTitle>
              <Calendar className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamStats?.ultimo_ano || 'N/A'}</div>
            </CardContent>
          </Card>
        </div>

        {/* Team Actions */}
        <Card className="bg-card dark:bg-gray-800 border-border dark:border-gray-700 transition-colors">
          <CardHeader>
            <CardTitle className="text-card-foreground dark:text-white">Ações Disponíveis</CardTitle>
            <CardDescription className="text-muted-foreground dark:text-gray-300">Gerenciar pilotos da equipe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button 
                onClick={() => setShowSearchDriver(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Search className="w-4 h-4" />
                <span>Buscar Piloto por Sobrenome</span>
              </Button>
              <Button 
                onClick={() => setShowNewDriver(true)}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white"
              >
                <Plus className="w-4 h-4" />
                <span>Cadastrar Novo Piloto</span>
              </Button>
              <Button 
                onClick={() => setShowUploadDrivers(true)}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <Upload className="w-4 h-4" />
                <span>Upload de Pilotos</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Modals */}
        <SearchDriverByLastNameModal isOpen={showSearchDriver} onClose={() => setShowSearchDriver(false)} />
        <UploadDriversModal isOpen={showUploadDrivers} onClose={() => setShowUploadDrivers(false)} />
        <NewDriverModal isOpen={showNewDriver} onClose={() => setShowNewDriver(false)} />
      </div>
    );
  }

  if (user?.type === 'driver') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Dashboard do Piloto</h2>
          <p className="text-gray-600 dark:text-gray-300 transition-colors">Estatísticas de {user.fullName}</p>
        </div>

        {/* Driver Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Primeiro Ano de Atividade</CardTitle>
              <Calendar className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{driverStats?.period?.primeiro_ano || 'N/A'}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Último Ano de Atividade</CardTitle>
              <Calendar className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{driverStats?.period?.ultimo_ano || 'N/A'}</div>
            </CardContent>
          </Card>
        </div>

        {/* Driver Actions */}
        <Card className="mb-8 bg-card dark:bg-gray-800 border-border dark:border-gray-700 transition-colors">
          <CardHeader>
            <CardTitle className="text-card-foreground dark:text-white">Ações do Piloto</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Search className="w-4 h-4" />
              <span>Visualizar Meus Relatórios</span>
            </Button>
          </CardContent>
        </Card>

        {/* Performance by Year and Circuit */}
        <Card className="bg-card dark:bg-gray-800 border-border dark:border-gray-700 transition-colors">
          <CardHeader>
            <CardTitle className="text-card-foreground dark:text-white">Performance por Ano e Circuito</CardTitle>
            <CardDescription className="text-muted-foreground dark:text-gray-300">Detalhamento dos pontos, vitórias e corridas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {driverStats?.performance?.slice(0, 3).map((perf, index) => (
                <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{perf.circuito}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Ano: {perf.ano}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 mb-1">
                        {perf.pontos} pontos
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-300">Vitórias:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">{perf.vitorias}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-300">Corridas:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">{perf.total_corridas}</span>
                    </div>
                  </div>
                </div>
              )) || (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  Nenhum dado de performance disponível
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default Dashboard;

