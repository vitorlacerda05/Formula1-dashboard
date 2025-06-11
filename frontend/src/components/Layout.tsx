import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, BarChart3, Home, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    
    switch (user.type) {
      case 'administrator':
        return `Usuário: ${user.fullName}`;
      case 'team':
        return `Equipe: ${user.teamName}`;
      case 'driver':
        return `Piloto: ${user.fullName}, Equipe Atual: ${user.teamName}`;
      default:
        return user.fullName || '';
    }
  };

  const canAccessActions = user?.type === 'administrator' || user?.type === 'team';

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      {user && (
        <header className="bg-white dark:bg-gray-800 shadow-lg border-b-4 border-red-600 dark:border-red-500 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-10 rounded-full flex items-center justify-center">
                    <img src="/f1.svg" alt="f1 logo" className="w-16 h-16" />
                  </div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">F1 Dashboard</h1>
                </div>
                <div className="hidden sm:block text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full transition-colors">
                  {getUserDisplayName()}
                </div>
              </div>
              
              <nav className="flex items-center space-x-2">
                <Button
                  variant={location.pathname === '/dashboard' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center space-x-1"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
                
                <Button
                  variant={location.pathname === '/reports' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => navigate('/reports')}
                  className="flex items-center space-x-1"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Relatórios</span>
                </Button>
                
                {canAccessActions && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">Ações</span>
                  </Button>
                )}
                
                <ThemeToggle />
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 dark:text-red-400 border-red-200 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </nav>
            </div>
            
            <div className="sm:hidden pb-2">
              <div className="text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-center transition-colors">
                {getUserDisplayName()}
              </div>
            </div>
          </div>
        </header>
      )}
      
      <main className={user ? "py-6" : ""}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
