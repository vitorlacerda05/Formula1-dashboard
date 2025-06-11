
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin } from 'lucide-react';

interface CitySearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CitySearchModal = ({ isOpen, onClose }: CitySearchModalProps) => {
  const [cityName, setCityName] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const mockAirports = [
    { 
      city: 'São Paulo', 
      airport: 'Aeroporto Internacional de Guarulhos', 
      code: 'GRU', 
      distance: '25 km',
      type: 'Internacional'
    },
    { 
      city: 'São Paulo', 
      airport: 'Aeroporto de Congonhas', 
      code: 'CGH', 
      distance: '8 km',
      type: 'Doméstico'
    },
    { 
      city: 'Rio de Janeiro', 
      airport: 'Aeroporto Internacional do Galeão', 
      code: 'GIG', 
      distance: '15 km',
      type: 'Internacional'
    },
    { 
      city: 'Rio de Janeiro', 
      airport: 'Aeroporto Santos Dumont', 
      code: 'SDU', 
      distance: '2 km',
      type: 'Doméstico'
    },
    { 
      city: 'Brasília', 
      airport: 'Aeroporto Internacional de Brasília', 
      code: 'BSB', 
      distance: '12 km',
      type: 'Internacional'
    }
  ];

  const handleSearch = async () => {
    if (!cityName.trim()) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const results = mockAirports.filter(airport => 
        airport.city.toLowerCase().includes(cityName.toLowerCase())
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
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Aeroportos Brasileiros por Cidade</DialogTitle>
          <DialogDescription>
            Busque aeroportos próximos a uma cidade específica no Brasil.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Label htmlFor="citySearch">Nome da cidade</Label>
              <Input
                id="citySearch"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="ex: São Paulo, Rio de Janeiro, Brasília"
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} disabled={loading} className="bg-green-600 hover:bg-green-700">
                <Search className="w-4 h-4 mr-2" />
                {loading ? 'Buscando...' : 'Buscar'}
              </Button>
            </div>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold">Aeroportos encontrados para "{cityName}":</h4>
              <div className="space-y-3">
                {searchResults.map((airport, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-white shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <h5 className="font-medium text-lg">{airport.airport}</h5>
                        </div>
                        <p className="text-sm text-gray-600">Cidade: {airport.city}</p>
                        <p className="text-sm text-gray-600">Código: {airport.code}</p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={airport.type === 'Internacional' ? 'default' : 'secondary'}
                          className="mb-1"
                        >
                          {airport.type}
                        </Badge>
                        <p className="text-sm font-medium text-blue-600">{airport.distance}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {cityName && searchResults.length === 0 && !loading && (
            <p className="text-gray-500 text-center py-4">
              Nenhum aeroporto encontrado para a cidade "{cityName}".
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

export default CitySearchModal;
