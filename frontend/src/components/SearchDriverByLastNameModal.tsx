import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { dashboardApi, DriverData } from '../lib/api'; 
import { useAuth } from '../contexts/AuthContext';

interface SearchDriverByLastNameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchDriverByLastNameModal = ({ isOpen, onClose }: SearchDriverByLastNameModalProps) => {
  const { user } = useAuth();
  const [lastName, setLastName] = useState('');
  const [searchResults, setSearchResults] = useState<DriverData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!lastName.trim() || !user?.idOriginal) return;
    
    setLoading(true);
    setSearched(false);
    setError(null);
    
    try {
      const response = await dashboardApi.findDriversByLastName(user.idOriginal.toString(), lastName);
      if (response.success) {
        setSearchResults(response.data);
      } else {
        setError(response.error || 'Nenhum piloto encontrado com o sobrenome fornecido.');
        setSearchResults([]);
      }
    } catch (err) {
      setError('Ocorreu um erro ao buscar os pilotos. Tente novamente.');
      setSearchResults([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClose = () => {
    setLastName('');
    setSearchResults([]);
    setError(null);
    setSearched(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Buscar Piloto por Sobrenome</DialogTitle>
          <DialogDescription>
            Busque pilotos pelo sobrenome para ver seus detalhes.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Label htmlFor="search">Sobrenome do piloto</Label>
              <Input
                id="search"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="ex: Senna, Hamilton, Verstappen"
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                <Search className="w-4 h-4 mr-2" />
                {loading ? 'Buscando...' : 'Buscar'}
              </Button>
            </div>
          </div>

          {searched && !loading && searchResults.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold">Resultados da busca:</h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {searchResults.map((driver) => (
                  <div key={driver.piloto_id} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium text-lg text-gray-900 dark:text-white">{driver.nome_piloto}</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          Nacionalidade: {driver.nacionalidade}
                        </p>
                      </div>
                      <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                        {driver.total_pontos_ano} pts (ano)
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searched && !loading && searchResults.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              {error || `Nenhum piloto encontrado com o sobrenome "${lastName}".`}
            </p>
          )}

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={handleClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDriverByLastNameModal; 