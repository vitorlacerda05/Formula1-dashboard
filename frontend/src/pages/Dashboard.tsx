
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Trophy, Calendar, Flag, Plus, Search, Upload } from 'lucide-react';
import NewTeamModal from '../components/NewTeamModal';
import NewDriverModal from '../components/NewDriverModal';
import SearchDriverModal from '../components/SearchDriverModal';
import UploadDriversModal from '../components/UploadDriversModal';

const Dashboard = () => {
  const { user } = useAuth();
  const [showNewTeam, setShowNewTeam] = useState(false);
  const [showNewDriver, setShowNewDriver] = useState(false);
  const [showSearchDriver, setShowSearchDriver] = useState(false);
  const [showUploadDrivers, setShowUploadDrivers] = useState(false);

  const adminStats = {
    totalDrivers: 847,
    totalTeams: 34,
    totalSeasons: 74,
    races: [
      { name: 'GP do Bahrein', laps: 57, time: '1:37:05.889' },
      { name: 'GP da Arábia Saudita', laps: 50, time: '1:31:12.220' },
      { name: 'GP da Austrália', laps: 58, time: '1:20:27.894' }
    ],
    teams: [
      { name: 'Red Bull Racing', points: 860 },
      { name: 'Mercedes', points: 409 },
      { name: 'Ferrari', points: 406 }
    ],
    drivers: [
      { name: 'Max Verstappen', points: 575 },
      { name: 'Sergio Perez', points: 285 },
      { name: 'Lewis Hamilton', points: 234 }
    ]
  };

  const teamStats = {
    wins: 16,
    driversCount: 23,
    firstYear: 1950,
    lastYear: 2024
  };

  const driverStats = {
    firstYear: 2007,
    lastYear: 2024,
    performance: [
      { year: 2023, circuit: 'Silverstone', points: 25, wins: 1, races: 1 },
      { year: 2023, circuit: 'Monza', points: 18, wins: 0, races: 1 },
      { year: 2022, circuit: 'Interlagos', points: 15, wins: 0, races: 1 }
    ]
  };

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
              <div className="text-2xl font-bold">{adminStats.totalDrivers}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Equipes</CardTitle>
              <Flag className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminStats.totalTeams}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Temporadas</CardTitle>
              <Calendar className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminStats.totalSeasons}</div>
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
                {adminStats.races.map((race, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{race.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{race.laps} voltas</p>
                    </div>
                    <Badge variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">{race.time}</Badge>
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
                {adminStats.teams.map((team, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
                    <p className="font-medium text-gray-900 dark:text-white">{team.name}</p>
                    <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">{team.points} pts</Badge>
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
                {adminStats.drivers.map((driver, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
                    <p className="font-medium text-gray-900 dark:text-white">{driver.name}</p>
                    <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">{driver.points} pts</Badge>
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
              <div className="text-2xl font-bold">{teamStats.wins}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pilotos Diferentes</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamStats.driversCount}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Primeiro Ano</CardTitle>
              <Calendar className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamStats.firstYear}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Último Ano</CardTitle>
              <Calendar className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamStats.lastYear}</div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                onClick={() => setShowSearchDriver(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Search className="w-4 h-4" />
                <span>Buscar Piloto por Nome</span>
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
        <SearchDriverModal isOpen={showSearchDriver} onClose={() => setShowSearchDriver(false)} />
        <UploadDriversModal isOpen={showUploadDrivers} onClose={() => setShowUploadDrivers(false)} />
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
              <div className="text-2xl font-bold">{driverStats.firstYear}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Último Ano de Atividade</CardTitle>
              <Calendar className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{driverStats.lastYear}</div>
            </CardContent>
          </Card>
        </div>

        {/* Performance by Year and Circuit */}
        <Card className="bg-card dark:bg-gray-800 border-border dark:border-gray-700 transition-colors">
          <CardHeader>
            <CardTitle className="text-card-foreground dark:text-white">Performance por Ano e Circuito</CardTitle>
            <CardDescription className="text-muted-foreground dark:text-gray-300">Detalhamento dos pontos, vitórias e corridas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {driverStats.performance.map((perf, index) => (
                <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{perf.circuit}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Ano: {perf.year}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 mb-1">{perf.points} pontos</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-300">Vitórias:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">{perf.wins}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-300">Corridas:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">{perf.races}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default Dashboard;
