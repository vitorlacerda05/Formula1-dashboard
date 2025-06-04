
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle } from 'lucide-react';
import { useFormValidation } from '../hooks/useFormValidation';

interface NewDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewDriverModal = ({ isOpen, onClose }: NewDriverModalProps) => {
  const [formData, setFormData] = useState({
    driverRef: '',
    number: '',
    code: '',
    forename: '',
    surname: '',
    dateOfBirth: '',
    nationality: ''
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
    const validations = [
      validate('driverRef', formData.driverRef, { required: true, minLength: 2, pattern: /^[a-zA-Z0-9_-]+$/ }),
      validate('code', formData.code, { required: true, minLength: 3, maxLength: 3, pattern: /^[A-Z]{3}$/ }),
      validate('forename', formData.forename, { required: true, minLength: 2 }),
      validate('surname', formData.surname, { required: true, minLength: 2 }),
      validate('dateOfBirth', formData.dateOfBirth, { required: true }),
      validate('nationality', formData.nationality, { required: true, minLength: 2 })
    ];

    // Validar número se fornecido
    if (formData.number) {
      validations.push(validate('number', formData.number, { 
        pattern: /^\d+$/,
        custom: (value) => parseInt(value) >= 1 && parseInt(value) <= 99
      }));
    }

    if (!validations.every(v => v) || hasErrors) {
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      if (formData.driverRef === 'existing') {
        setMessage({ type: 'error', text: 'Erro: Piloto com este DriverRef já existe no sistema.' });
      } else {
        setMessage({ type: 'success', text: 'Piloto cadastrado com sucesso!' });
        setFormData({
          driverRef: '',
          number: '',
          code: '',
          forename: '',
          surname: '',
          dateOfBirth: '',
          nationality: ''
        });
      }
      setLoading(false);
    }, 1000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setMessage(null);
    
    // Validar campo em tempo real se já teve erro
    if (errors[field]) {
      switch (field) {
        case 'driverRef':
          validate(field, value, { required: true, minLength: 2, pattern: /^[a-zA-Z0-9_-]+$/ });
          break;
        case 'code':
          validate(field, value, { required: true, minLength: 3, maxLength: 3, pattern: /^[A-Z]{3}$/ });
          break;
        case 'forename':
        case 'surname':
        case 'nationality':
          validate(field, value, { required: true, minLength: 2 });
          break;
        case 'dateOfBirth':
          validate(field, value, { required: true });
          break;
        case 'number':
          if (value) {
            validate(field, value, { 
              pattern: /^\d+$/,
              custom: (value) => parseInt(value) >= 1 && parseInt(value) <= 99
            });
          }
          break;
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Cadastrar Novo Piloto</DialogTitle>
          <DialogDescription className="dark:text-gray-300">
            Preencha os dados do novo piloto para cadastrá-lo no sistema.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="driverRef" className="dark:text-gray-200">DriverRef *</Label>
              <Input
                id="driverRef"
                value={formData.driverRef}
                onChange={(e) => handleChange('driverRef', e.target.value)}
                placeholder="ex: hamilton, verstappen"
                className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.driverRef ? 'border-red-500' : ''
                }`}
              />
              {errors.driverRef && (
                <p className="text-red-500 text-sm">{errors.driverRef}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="number" className="dark:text-gray-200">Número</Label>
              <Input
                id="number"
                type="number"
                value={formData.number}
                onChange={(e) => handleChange('number', e.target.value)}
                placeholder="ex: 44, 1, 33"
                className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.number ? 'border-red-500' : ''
                }`}
              />
              {errors.number && (
                <p className="text-red-500 text-sm">{errors.number}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="code" className="dark:text-gray-200">Código *</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
              placeholder="ex: HAM, VER, LEC"
              maxLength={3}
              className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.code ? 'border-red-500' : ''
              }`}
            />
            {errors.code && (
              <p className="text-red-500 text-sm">{errors.code}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="forename" className="dark:text-gray-200">Nome *</Label>
              <Input
                id="forename"
                value={formData.forename}
                onChange={(e) => handleChange('forename', e.target.value)}
                placeholder="ex: Lewis"
                className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.forename ? 'border-red-500' : ''
                }`}
              />
              {errors.forename && (
                <p className="text-red-500 text-sm">{errors.forename}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="surname" className="dark:text-gray-200">Sobrenome *</Label>
              <Input
                id="surname"
                value={formData.surname}
                onChange={(e) => handleChange('surname', e.target.value)}
                placeholder="ex: Hamilton"
                className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.surname ? 'border-red-500' : ''
                }`}
              />
              {errors.surname && (
                <p className="text-red-500 text-sm">{errors.surname}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="dark:text-gray-200">Data de Nascimento *</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.dateOfBirth ? 'border-red-500' : ''
              }`}
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nationality" className="dark:text-gray-200">Nacionalidade *</Label>
            <Input
              id="nationality"
              value={formData.nationality}
              onChange={(e) => handleChange('nationality', e.target.value)}
              placeholder="ex: British, Dutch, Monegasque"
              className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.nationality ? 'border-red-500' : ''
              }`}
            />
            {errors.nationality && (
              <p className="text-red-500 text-sm">{errors.nationality}</p>
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
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? 'Cadastrando...' : 'Cadastrar Piloto'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewDriverModal;
