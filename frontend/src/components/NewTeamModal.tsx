
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle } from 'lucide-react';
import { useFormValidation } from '../hooks/useFormValidation';

interface NewTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewTeamModal = ({ isOpen, onClose }: NewTeamModalProps) => {
  const [formData, setFormData] = useState({
    constructorRef: '',
    name: '',
    nationality: '',
    url: ''
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const { errors, validate, clearAllErrors, hasErrors } = useFormValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    clearAllErrors();

    // Validar campos obrigatórios
    const constructorRefValid = validate('constructorRef', formData.constructorRef, { 
      required: true, 
      minLength: 2,
      pattern: /^[a-zA-Z0-9_-]+$/
    });
    const nameValid = validate('name', formData.name, { required: true, minLength: 2 });
    const nationalityValid = validate('nationality', formData.nationality, { required: true, minLength: 2 });

    // Validar URL se fornecida
    if (formData.url) {
      validate('url', formData.url, { 
        pattern: /^https?:\/\/.+/
      });
    }

    if (!constructorRefValid || !nameValid || !nationalityValid || hasErrors) {
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      if (formData.constructorRef === 'existing') {
        setMessage({ type: 'error', text: 'Erro: Equipe com este ConstructorRef já existe no sistema.' });
      } else {
        setMessage({ type: 'success', text: 'Equipe cadastrada com sucesso!' });
        setFormData({ constructorRef: '', name: '', nationality: '', url: '' });
      }
      setLoading(false);
    }, 1000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setMessage(null);
    
    // Validar campo em tempo real se já teve erro
    if (errors[field]) {
      if (field === 'constructorRef') {
        validate(field, value, { required: true, minLength: 2, pattern: /^[a-zA-Z0-9_-]+$/ });
      } else if (field === 'name' || field === 'nationality') {
        validate(field, value, { required: true, minLength: 2 });
      } else if (field === 'url' && value) {
        validate(field, value, { pattern: /^https?:\/\/.+/ });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Cadastrar Nova Equipe</DialogTitle>
          <DialogDescription className="dark:text-gray-300">
            Preencha os dados da nova equipe para cadastrá-la no sistema.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="constructorRef" className="dark:text-gray-200">ConstructorRef *</Label>
            <Input
              id="constructorRef"
              value={formData.constructorRef}
              onChange={(e) => handleChange('constructorRef', e.target.value)}
              placeholder="ex: ferrari, mercedes, redbull"
              className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.constructorRef ? 'border-red-500' : ''
              }`}
            />
            {errors.constructorRef && (
              <p className="text-red-500 text-sm">{errors.constructorRef}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="dark:text-gray-200">Nome da Equipe *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="ex: Scuderia Ferrari"
              className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.name ? 'border-red-500' : ''
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nationality" className="dark:text-gray-200">Nacionalidade *</Label>
            <Input
              id="nationality"
              value={formData.nationality}
              onChange={(e) => handleChange('nationality', e.target.value)}
              placeholder="ex: Italian, German, Austrian"
              className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.nationality ? 'border-red-500' : ''
              }`}
            />
            {errors.nationality && (
              <p className="text-red-500 text-sm">{errors.nationality}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="url" className="dark:text-gray-200">URL</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => handleChange('url', e.target.value)}
              placeholder="ex: https://www.ferrari.com"
              className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.url ? 'border-red-500' : ''
              }`}
            />
            {errors.url && (
              <p className="text-red-500 text-sm">{errors.url}</p>
            )}
          </div>

          {message && (
            <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'}>
              {message.type === 'success' ? (
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              )}
              <AlertDescription className={message.type === 'success' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700">
              {loading ? 'Cadastrando...' : 'Cadastrar Equipe'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTeamModal;
