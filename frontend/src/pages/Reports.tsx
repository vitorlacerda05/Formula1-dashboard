import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, FileText, Search, MapPin, Users, Trophy, Calendar, X } from 'lucide-react';
import CitySearchModal from '../components/CitySearchModal';
import { useReportStatus } from '../contexts/ReportStatusContext'

const Reports = () => {
  const { user } = useAuth();
  const [activeReport, setActiveReport] = useState<string | null>(null);
  const [showCitySearch, setShowCitySearch] = useState(false);
  const { resultados, equipesPilotos, isLoading, isLoadingTeams, fetchResultados, fetchEquipesPilotos } = useReportStatus();

  const adminReports = [
    {
      id: 'race-status',
      title: 'Resultados por Status de Corrida',
      description: 'Quantidade de resultados agrupados por status',
      icon: BarChart3,
      color: 'bg-blue-600'
    },
    {
      id: 'airports',
      title: 'Aeroportos Brasileiros por Cidade',
      description: 'Buscar aeroportos próximos a uma cidade',
      icon: MapPin,
      color: 'bg-green-600'
    },
    {
      id: 'teams-drivers',
      title: 'Equipes com Número de Pilotos',
      description: 'Lista de equipes com estatísticas detalhadas',
      icon: Users,
      color: 'bg-purple-600'
    }
  ];

  const teamReports = [
    {
      id: 'team-drivers-wins',
      title: 'Pilotos com Primeiras Posições',
      description: 'Lista de pilotos da equipe com número de vitórias',
      icon: Trophy,
      color: 'bg-yellow-600'
    },
    {
      id: 'team-race-status',
      title: 'Resultados por Status (Equipe)',
      description: 'Status de corridas limitado à sua equipe',
      icon: BarChart3,
      color: 'bg-red-600'
    }
  ];

  const driverReports = [
    {
      id: 'driver-points',
      title: 'Pontos por Ano',
      description: 'Total de pontos obtidos por ano com detalhes',
      icon: Calendar,
      color: 'bg-blue-600'
    },
    {
      id: 'driver-race-status',
      title: 'Resultados por Status (Piloto)',
      description: 'Status das corridas em que participou',
      icon: BarChart3,
      color: 'bg-green-600'
    }
  ];

  const getReportsForUser = () => {
    switch (user?.type) {
      case 'administrator':
        return adminReports;
      case 'team':
        return teamReports;
      case 'driver':
        return driverReports;
      default:
        return [];
    }
  };

  const generateReport = (reportId: string) => {
    if (reportId === 'airports') {
      setShowCitySearch(true);
      return;
    }
    
    // Para o relatório de status que tem API real, faz a chamada
    if (reportId === 'race-status') {
      fetchResultados();
    }
    
    // Para o relatório de equipes com pilotos
    if (reportId === 'teams-drivers') {
      fetchEquipesPilotos();
    }
    
    setActiveReport(reportId);
  };

  const getReportContent = () => {
    switch (activeReport) {
      case 'race-status':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resultados por Status de Corrida</h3>
            {isLoading ? (
              <p>Carregando...</p>
            ) : (
              <div className="space-y-2">
                {Array.isArray(resultados) && resultados.length > 0 ? (
                  resultados.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{item.nome_status}</span>
                      <Badge variant="outline">{item.quantidade_resultados.toLocaleString()}</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Nenhum resultado encontrado.</p>
                )}
              </div>
            )}
          </div>
        );

      case 'teams-drivers':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Equipes com Número de Pilotos</h3>
            {isLoadingTeams ? (
              <p>Carregando...</p>
            ) : (
              <div className="space-y-4">
                {Array.isArray(equipesPilotos) && equipesPilotos.length > 0 ? (
                  equipesPilotos.map((team, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-lg">{team.nome_equipe}</h4>
                        <Badge className="bg-blue-100 text-blue-700">{team.numero_pilotos} pilotos</Badge>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">Total de Corridas:</span>
                          <span className="ml-2 font-medium">{team.total_corridas.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Média de Voltas:</span>
                          <span className="ml-2 font-medium">{team.media_voltas}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Tempo Total:</span>
                          <span className="ml-2 font-medium">{team.tempo_total_formatado}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Nenhuma equipe encontrada.</p>
                )}
              </div>
            )}
          </div>
        );

      case 'team-drivers-wins':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pilotos da Equipe - Primeiras Posições</h3>
            <div className="space-y-2">
              {[
                { driver: 'Michael Schumacher', wins: 72 },
                { driver: 'Kimi Raikkonen', wins: 21 },
                { driver: 'Felipe Massa', wins: 11 },
                { driver: 'Sebastian Vettel', wins: 14 },
                { driver: 'Charles Leclerc', wins: 5 }
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{item.driver}</span>
                  <Badge className="bg-yellow-100 text-yellow-700">{item.wins} vitórias</Badge>
                </div>
              ))}
            </div>
          </div>
        );

      case 'team-race-status':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Status de Corridas - {user?.teamName || 'Equipe'}</h3>
            <div className="space-y-2">
              {[
                { status: 'Finalizado', count: 1247 },
                { status: 'Abandonou', count: 189 },
                { status: 'Acidente', count: 67 },
                { status: 'Problema Mecânico', count: 134 },
                { status: 'Desqualificado', count: 3 }
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{item.status}</span>
                  <Badge variant="outline">{item.count}</Badge>
                </div>
              ))}
            </div>
          </div>
        );

      case 'driver-points':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pontos por Ano - {user?.fullName || 'Piloto'}</h3>
            <div className="space-y-4">
              {[
                { year: 2023, points: 234, races: [
                  { race: 'GP do Bahrein', points: 25 },
                  { race: 'GP da Arábia Saudita', points: 18 },
                  { race: 'GP da Austrália', points: 15 }
                ]},
                { year: 2022, points: 387, races: [
                  { race: 'GP de Monaco', points: 25 },
                  { race: 'GP da Espanha', points: 25 },
                  { race: 'GP do Canadá', points: 18 }
                ]}
              ].map((yearData, index) => (
                <div key={index} className="p-4 border rounded-lg bg-white">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold">{yearData.year}</h4>
                    <Badge className="bg-green-100 text-green-700">{yearData.points} pontos</Badge>
                  </div>
                  <div className="space-y-2">
                    {yearData.races.map((race, raceIndex) => (
                      <div key={raceIndex} className="flex justify-between text-sm">
                        <span>{race.race}</span>
                        <span className="font-medium">{race.points} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'driver-race-status':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Status de Corridas - {user?.fullName || 'Piloto'}</h3>
            <div className="space-y-2">
              {[
                { status: 'Finalizado', count: 287 },
                { status: 'Abandonou', count: 23 },
                { status: 'Acidente', count: 8 },
                { status: 'Problema Mecânico', count: 12 },
                { status: 'Desqualificado', count: 1 }
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{item.status}</span>
                  <Badge variant="outline">{item.count}</Badge>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const reports = getReportsForUser();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Relatórios</h2>
        <p className="text-gray-600 dark:text-gray-300 transition-colors">
          {user?.type === 'administrator' && 'Relatórios administrativos do sistema'}
          {user?.type === 'team' && `Relatórios da equipe ${user?.teamName}`}
          {user?.type === 'driver' && `Relatórios do piloto ${user?.fullName}`}
        </p>
      </div>

      {!activeReport ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => {
            const IconComponent = report.icon;
            return (
              <Card key={report.id} className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${report.color}`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription>{report.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => generateReport(report.id)} 
                    className="w-full"
                    variant="outline"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Resultado do Relatório</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setActiveReport(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {getReportContent()}
            <div className="mt-6 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setActiveReport(null)}
                className="w-full sm:w-auto"
              >
                Voltar aos Relatórios
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <CitySearchModal 
        isOpen={showCitySearch} 
        onClose={() => setShowCitySearch(false)} 
      />
    </div>
  );
};

export default Reports;
