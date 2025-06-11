
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, CheckCircle, XCircle, FileText } from 'lucide-react';

interface UploadDriversModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadDriversModal = ({ isOpen, onClose }: UploadDriversModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
    setMessage(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Por favor, selecione um arquivo.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    // Simulate file processing
    setTimeout(() => {
      // Mock different outcomes based on filename
      if (selectedFile.name.includes('error')) {
        setMessage({ 
          type: 'error', 
          text: 'Erro no processamento: Piloto já existe no sistema (linha 3).' 
        });
      } else {
        const driversAdded = Math.floor(Math.random() * 5) + 1;
        setMessage({ 
          type: 'success', 
          text: `${driversAdded} pilotos foram inseridos com sucesso na equipe!` 
        });
      }
      setLoading(false);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload de Pilotos</DialogTitle>
          <DialogDescription>
            Envie um arquivo com os dados dos pilotos para inserir na equipe.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Arquivo (CSV, JSON, etc.)</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              accept=".csv,.json,.txt"
              className="cursor-pointer"
            />
            <p className="text-xs text-gray-500">
              Formatos aceitos: CSV, JSON, TXT
            </p>
          </div>

          {selectedFile && (
            <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">{selectedFile.name}</span>
              <span className="text-xs text-gray-500">
                ({(selectedFile.size / 1024).toFixed(1)} KB)
              </span>
            </div>
          )}

          {message && (
            <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              {message.type === 'success' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Formato esperado do arquivo:</h4>
            <pre className="text-xs text-gray-600 overflow-x-auto">
{`driverRef,number,code,forename,surname,dob,nationality
leclerc,16,LEC,Charles,Leclerc,1997-10-16,Monegasque
sainz,55,SAI,Carlos,Sainz,1994-09-01,Spanish`}
            </pre>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={loading || !selectedFile}
              className="bg-green-600 hover:bg-green-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              {loading ? 'Processando...' : 'Fazer Upload'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDriversModal;
