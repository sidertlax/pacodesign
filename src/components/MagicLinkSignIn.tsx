import { useState } from 'react';
import cgpiLogoWhite from '../assets/logo.png';
import { Mail, ArrowLeft, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { motion, AnimatePresence } from 'motion/react';

interface MagicLinkSignInProps {
  onBackToLogin: () => void;
}

export function MagicLinkSignIn({ onBackToLogin }: MagicLinkSignInProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar email
    if (!email) {
      setError('Por favor, ingrese su correo electrónico.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Por favor, ingrese un correo electrónico válido.');
      return;
    }

    setIsLoading(true);

    // Simular envío de email (2 segundos)
    setTimeout(() => {
      setIsLoading(false);
      setEmailSent(true);
    }, 2000);
  };

  const handleResendEmail = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
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
          className="text-center mb-8"
        >
          <img 
            src={cgpiLogoWhite} 
            alt="CGPI Logo" 
            className="h-20 mx-auto mb-6"
          />
          <h1 className="text-3xl text-white mb-2" style={{ fontWeight: 'bold' }}>
            SIDERTLAX
          </h1>
          <p className="text-purple-200 text-sm">
            Sistema de Información del Desempeño para Resultados del Estado de Tlaxcala
          </p>
        </motion.div>

        {/* Botón volver */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-4"
        >
          <Button
            variant="ghost"
            onClick={onBackToLogin}
            className="text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio de sesión
          </Button>
        </motion.div>

        {/* Card principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center pb-4">
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: '#582672' }}
              >
                <Mail className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl" style={{ color: '#582672', fontWeight: 'bold' }}>
                Iniciar sesión con enlace mágico
              </CardTitle>
              <p className="text-gray-600 text-sm mt-2">
                Ingrese su correo electrónico y le enviaremos un enlace seguro para acceder a la plataforma sin necesidad de contraseña
              </p>
            </CardHeader>

            <Separator />

            <CardContent className="pt-6">
              <AnimatePresence mode="wait">
                {!emailSent ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div>
                      <Label htmlFor="email" className="text-sm text-gray-700">
                        Correo Electrónico Institucional <span className="text-red-600">*</span>
                      </Label>
                      <div className="relative mt-2">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="usuario@tlaxcala.gob.mx"
                          className="pl-10"
                          disabled={isLoading}
                        />
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
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Enviando enlace...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Enviar enlace mágico
                        </>
                      )}
                    </Button>

                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="text-sm mb-2" style={{ fontWeight: 'bold', color: '#1976D2' }}>
                        ¿Cómo funciona?
                      </h4>
                      <ol className="text-xs text-gray-700 space-y-1 list-decimal list-inside">
                        <li>Ingrese su correo electrónico institucional</li>
                        <li>Recibirá un enlace seguro en su bandeja de entrada</li>
                        <li>Haga clic en el enlace para acceder automáticamente</li>
                        <li>El enlace expira en 15 minutos por seguridad</li>
                      </ol>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-8 space-y-6"
                  >
                    <div 
                      className="w-20 h-20 rounded-full mx-auto flex items-center justify-center"
                      style={{ backgroundColor: '#E8F5E9' }}
                    >
                      <CheckCircle2 className="w-12 h-12" style={{ color: '#2E7D32' }} />
                    </div>

                    <div>
                      <h3 className="text-xl mb-2" style={{ fontWeight: 'bold', color: '#582672' }}>
                        ¡Enlace enviado!
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Hemos enviado un enlace de acceso a:
                      </p>
                      <p className="text-sm mt-2" style={{ fontWeight: 'bold', color: '#582672' }}>
                        {email}
                      </p>
                    </div>

                    <Alert className="border-green-300 bg-green-50 text-left">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <AlertDescription className="text-sm text-green-800">
                        <strong>Revise su bandeja de entrada.</strong> El enlace mágico es válido por 15 minutos.
                        Si no lo encuentra, verifique la carpeta de spam o correo no deseado.
                      </AlertDescription>
                    </Alert>

                    <Separator />

                    <div className="space-y-3">
                      <p className="text-xs text-gray-500">
                        ¿No recibió el correo?
                      </p>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleResendEmail}
                        disabled={isLoading}
                        style={{ borderColor: '#582672', color: '#582672' }}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Reenviando...
                          </>
                        ) : (
                          <>
                            <Mail className="w-4 h-4 mr-2" />
                            Reenviar enlace
                          </>
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        className="w-full text-gray-600 hover:text-gray-900"
                        onClick={() => setEmailSent(false)}
                      >
                        Usar otro correo electrónico
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mt-8 text-purple-200 text-xs"
        >
          <p>
            Coordinación General de Planeación e Innovación del Gobierno del Estado de Tlaxcala
          </p>
          <p className="mt-2">
            © 2026 CGPI - Todos los derechos reservados
          </p>
        </motion.div>
      </div>
    </div>
  );
}
