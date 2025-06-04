
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Car } from 'lucide-react';
import { useFormValidation } from '../hooks/useFormValidation';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { errors, validate, clearAllErrors, hasErrors } = useFormValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    clearAllErrors();

    // Validar campos
    const usernameValid = validate('username', username, { required: true, minLength: 3 });
    const passwordValid = validate('password', password, { required: true, minLength: 3 });

    if (!usernameValid || !passwordValid) {
      return;
    }

    setLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Login ou senha inválidos');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
              <Car className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sistema FIA F1</h1>
          <p className="text-gray-600 dark:text-gray-300">Gestão e Relatórios da Fórmula 1</p>
        </div>

        <Card className="shadow-xl border-0 dark:bg-gray-800">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center dark:text-white">Entrar</CardTitle>
            <CardDescription className="text-center dark:text-gray-300">
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="dark:text-gray-200">Login</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu login"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) validate('username', e.target.value, { required: true, minLength: 3 });
                  }}
                  className={`transition-all focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.username ? 'border-red-500' : ''
                  }`}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="dark:text-gray-200">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) validate('password', e.target.value, { required: true, minLength: 3 });
                  }}
                  className={`transition-all focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                  <AlertDescription className="text-red-700 dark:text-red-400">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 font-semibold">Usuários de demonstração:</p>
              <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                <p><strong>admin</strong> / 123 (Administrador)</p>
                <p><strong>ferrari</strong> / 123 (Equipe)</p>
                <p><strong>hamilton</strong> / 123 (Piloto)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
