import { useState } from 'react';
import cgpiLogoWhite from 'figma:asset/291258f4647a47d5b6b7a797f2aa3e8d49249464.png';
import { Lock, User, AlertCircle, Shield, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { motion } from 'motion/react';

interface LoginScreenProps {
  onLogin: (username: string, userType: 'admin' | 'enlace') => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simular delay de autenticación
    setTimeout(() => {
      if (username === 'admin' && password === '12345') {
        onLogin('admin', 'admin');
      } else if (username === 'enlace' && password === '12345') {
        onLogin('enlace', 'enlace');
      } else {
        setError('Usuario o contraseña incorrectos. Por favor, verifique sus credenciales.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: 'linear-gradient(135deg, #582672 0%, #8B4789 50%, #582672 100%)',
      }}
    >
      <div className="w-full max-w-2xl">
        {/* Logo y header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-6">
            <img 
              src={cgpiLogoWhite} 
              alt="CGPI - Coordinación General de Planeación e Inversión" 
              className="h-24 w-auto object-contain flex-shrink-0"
            />
            <Separator orientation="vertical" className="h-24 bg-white" />
            <div className="text-left">
              <h1 className="text-4xl mb-2" style={{ color: 'white', fontWeight: 'bold' }}>
                SIDERTLAX
              </h1>
              <p className="text-white/90">
                Sistema de Información del Desempeño para Resultados
              </p>
            </div>
          </div>
        </motion.div>

        {/* Card de login */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-2xl">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl text-center" style={{ color: '#582672', fontWeight: 'bold' }}>
                Iniciar Sesión
              </CardTitle>
              <p className="text-center text-sm text-gray-600">
                Ingrese sus credenciales para acceder al sistema
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm">
                    Usuario
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Ingrese su usuario"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Ingrese su contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Alert className="border-red-300 bg-red-50">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <AlertDescription className="text-sm text-red-800">
                        {error}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  className="w-full text-white"
                  style={{ backgroundColor: '#582672' }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Iniciando sesión...</span>
                    </div>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-xs text-blue-900 mb-2" style={{ fontWeight: 'bold' }}>
                    Credenciales de demostración:
                  </p>
                  <div className="space-y-1 text-xs text-blue-800">
                    <p>
                      <strong>Admin:</strong> admin / 12345
                    </p>
                    <p>
                      <strong>Enlace:</strong> enlace / 12345
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-6 text-white/80 text-xs"
        >
          <p>© 2025 Gobierno del Estado de Tlaxcala</p>
          <p className="mt-1">Coordinación General de Planeación e Inversión (CGPI)</p>
        </motion.div>
      </div>
    </div>
  );
}
