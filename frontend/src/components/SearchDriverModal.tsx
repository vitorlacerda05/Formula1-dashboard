
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

interface SearchDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchDriverModal = ({ isOpen, onClose }: SearchDriverModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const mockDrivers = [
    { fullName: 'Lewis Hamilton', dateOfBirth: '1985-01-07', nationality: 'British' },
    { fullName: 'Sebastian Vettel', dateOfBirth: '1987-07-03', nationality: 'German' },
    { fullName: 'Fernando Alonso', dateOfBirth: '1981-07-29', nationality: 'Spanish' }
  ];

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const results = mockDrivers.filter(driver => 
        driver.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
      setLoading(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Buscar Piloto por Nome</DialogTitle>
          <DialogDescription>
            Busque pilotos que correram pela sua equipe pelo primeiro nome.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Label htmlFor="search">Primeiro nome do piloto</Label>
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="ex: Lewis, Sebastian, Fernando"
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

          {searchResults.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold">Resultados da busca:</h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {searchResults.map((driver, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium text-lg">{driver.fullName}</h5>
                        <p className="text-sm text-gray-600 mt-1">
                          Nascimento: {new Date(driver.dateOfBirth).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Badge variant="outline">{driver.nationality}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchTerm && searchResults.length === 0 && !loading && (
            <p className="text-gray-500 text-center py-4">
              Nenhum piloto encontrado com o nome "{searchTerm}" que tenha corrido pela sua equipe.
            </p>
          )}

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDriverModal;
