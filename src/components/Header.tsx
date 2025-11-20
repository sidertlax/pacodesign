import { useState } from 'react';
import cgpiLogo from 'figma:asset/2d625ad7f36a46709a1af6e4574d72029b82c6ea.png';
import { DollarSign, TrendingUp, ClipboardCheck, Gavel, Construction, LogOut, User } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';

// Material Design Apps/Waffle Icon
function AppsIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg 
      className={className}
      style={style}
      viewBox="0 0 24 24" 
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/>
    </svg>
  );
}

const modules = [
  {
    id: 'gasto',
    name: 'Gasto',
    icon: DollarSign,
    color: '#8b5cf6',
    description: 'Seguimiento del ejercicio presupuestal'
  },
  {
    id: 'indicadores',
    name: 'Indicadores de Desempeño',
    icon: TrendingUp,
    color: '#06b6d4',
    description: 'Medición de resultados y metas'
  },
  {
    id: 'compromisos',
    name: 'Compromisos',
    icon: ClipboardCheck,
    color: '#f59e0b',
    description: 'Compromisos gubernamentales'
  },
  {
    id: 'normatividad',
    name: 'Normatividad',
    icon: Gavel,
    color: '#84cc16',
    description: 'Cumplimiento normativo'
  },
  {
    id: 'obra-publica',
    name: 'Obra Pública',
    icon: Construction,
    color: '#ef4444',
    description: 'Proyectos de infraestructura'
  }
];

interface HeaderProps {
  username?: string;
  onLogout?: () => void;
}

export function Header({ username, onLogout }: HeaderProps = {}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Background blur overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 bg-white/40 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <header className="bg-white border-b border-gray-200 relative z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src={cgpiLogo} 
                  alt="CGPI - Coordinación General de Planeación e Inversión" 
                  className="h-12 w-auto object-contain"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {username && onLogout && (
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                  <User className="w-4 h-4 text-gray-500" />
                  <div className="text-right">
                    <p className="text-sm" style={{ fontWeight: 'bold' }}>
                      {username}
                    </p>
                    <Badge variant="outline" className="text-xs mt-0.5">
                      Administrador
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onLogout}
                    className="ml-2 hover:bg-red-50 hover:text-red-700"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              )}
              
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-3 hover:bg-purple-50 transition-colors px-5 py-3 scale-150 origin-right"
                    style={{ marginRight: '20px' }}
                  >
                    <AppsIcon className="w-8 h-8" style={{ color: '#582672' }} />
                    <span className="text-gray-700" style={{ fontSize: '16px' }}>Menú</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  align="end" 
                  className="w-80 p-2 z-50"
                  sideOffset={8}
                >
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                      >
                        <div className="mb-2 px-3 py-2 border-b">
                          <h3 className="font-semibold text-gray-900">Accesos Directos</h3>
                          <p className="text-xs text-gray-500">Módulos del sistema SIDERTLAX</p>
                        </div>
                        <div className="space-y-1">
                          {modules.map((module, index) => {
                            const Icon = module.icon;
                            return (
                              <motion.button
                                key={module.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ 
                                  duration: 0.2, 
                                  delay: index * 0.05,
                                  ease: 'easeOut' 
                                }}
                                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left group"
                                onClick={() => setIsOpen(false)}
                              >
                                <div 
                                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                                  style={{ backgroundColor: `${module.color}15` }}
                                >
                                  <Icon className="w-5 h-5" style={{ color: module.color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900 text-sm">{module.name}</p>
                                  <p className="text-xs text-gray-500 truncate">{module.description}</p>
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
