import { EnlaceEditForm } from './EnlaceEditForm';
import { EnlaceCargaGasto } from './EnlaceCargaGasto';
import { EnlaceCargaIndicadores } from './EnlaceCargaIndicadores';
import { EnlaceCargaNormatividad } from './EnlaceCargaNormatividad';
import { EnlaceCargaObraPublica } from './EnlaceCargaObraPublica';
import { useState } from 'react';
import cgpiLogo from 'figma:asset/2d625ad7f36a46709a1af6e4574d72029b82c6ea.png';
import { 
  LogOut, 
  User,
  Search,
  Filter,
  Edit,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  DollarSign,
  BarChart3,
  BookOpen,
  Hammer,
  FileCheck,
  ArrowRight,
  Building2,
  Calendar as CalendarIcon,
  UserCheck,
  ArrowLeft,
  ListChecks,
  FileText,
  Play,
  Activity,
  Target,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { motion } from 'motion/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { EnlaceViewProps } from './EnlaceViewProps';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

type ModuloCarga = 'menu' | 'compromisos' | 'gasto' | 'indicadores' | 'normatividad' | 'obra';

// Lista de todas las dependencias posibles
const dependencias = [
  'Secretaría de Educación Pública',
  'Secretaría de Salud',
  'Secretaría de Desarrollo Social',
  'Secretaría de Obras Públicas',
  'Secretaría de Seguridad Pública',
  'Secretaría de Finanzas',
  'Secretaría de Desarrollo Económico',
  'Secretaría de Medio Ambiente',
  'DIF Estatal',
  'Comisión Estatal de Agua',
  'Instituto del Deporte',
  'Secretaría de Turismo',
];

// Generar compromisos para la dependencia del enlace
const generateCompromisosEnlace = () => {
  const compromisos = [];
  const etapas = ['No iniciado', 'En Planeación', 'En Gestión', 'En Ejecución', 'Cumplido'];
  const dependenciaEnlace = 'Secretaría de Educación Pública';
  
  for (let i = 0; i < 25; i++) {
    const etapa = etapas[Math.floor(Math.random() * 5)];
    const esResponsable = Math.random() > 0.3; // 70% de probabilidad de ser responsable
    
    // Generar dependencias asignadas
    const numDependencias = Math.floor(Math.random() * 4) + 1; // 1 a 4 dependencias
    const dependenciasAsignadas = [];
    
    // Siempre incluir la dependencia del enlace
    dependenciasAsignadas.push(dependenciaEnlace);
    
    // Agregar otras dependencias aleatorias
    const otrasDependencias = dependencias.filter(d => d !== dependenciaEnlace);
    for (let j = 1; j < numDependencias; j++) {
      const randomDep = otrasDependencias[Math.floor(Math.random() * otrasDependencias.length)];
      if (!dependenciasAsignadas.includes(randomDep)) {
        dependenciasAsignadas.push(randomDep);
      }
    }

    compromisos.push({
      id: `CG-${String(i + 1).padStart(3, '0')}`,
      numero: `CG-${String(i + 1).padStart(3, '0')}`,
      nombre: [
        'Construcción de centros de salud comunitarios',
        'Ampliación de infraestructura educativa',
        'Programa de becas para estudiantes',
        'Modernización de espacios públicos',
        'Equipamiento de unidades médicas',
        'Rehabilitación de vialidades',
        'Programa de apoyo a microempresas',
        'Construcción de mercados municipales',
        'Instalación de alumbrado público',
        'Mejoramiento de red de agua potable',
        'Programa de capacitación técnica',
        'Construcción de centros deportivos',
        'Reforestación de áreas naturales',
        'Programa de vivienda digna',
        'Modernización de transporte público',
      ][i % 15],
      etapa,
      esResponsable,
      dependenciasAsignadas,
      ultimaActualizacion: new Date(2025, 9, Math.floor(Math.random() * 30) + 1).toLocaleDateString('es-MX'),
    });
  }

  return compromisos;
};

export function EnlaceView({ username, onLogout }: EnlaceViewProps) {
  const dependenciaAsignada = 'Secretaría de Educación Pública';
  const ultimaModificacion = {
    fecha: '05 de Noviembre, 2025',
    usuario: 'enlace',
    hora: '14:35',
  };
  
  const [activeModule, setActiveModule] = useState<ModuloCarga>('menu');
  const [compromisos] = useState(generateCompromisosEnlace());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEtapa, setFilterEtapa] = useState('todos');
  const [filterRol, setFilterRol] = useState<'todos' | 'asignados' | 'interviniente'>('todos');
  const [selectedCompromiso, setSelectedCompromiso] = useState<any>(null);

  // Filtrar compromisos
  const filteredCompromisos = compromisos.filter(c => {
    const matchSearch = c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       c.numero.toLowerCase().includes(searchTerm.toLowerCase());
    const matchEtapa = filterEtapa === 'todos' || c.etapa === filterEtapa;
    const matchRol = filterRol === 'todos' || 
                     (filterRol === 'asignados' && c.esResponsable) ||
                     (filterRol === 'interviniente' && !c.esResponsable);
    return matchSearch && matchEtapa && matchRol;
  });

  const getEtapaColor = (etapa: string) => {
    switch (etapa) {
      case 'No iniciado': return '#9E9E9E';
      case 'En Planeación': return '#FF9800';
      case 'En Gestión': return '#FF5722';
      case 'En Ejecución': return '#1976D2';
      case 'Cumplido': return '#2E7D32';
      default: return '#9E9E9E';
    }
  };

  const getSemaforoAvance = (avance: number) => {
    if (avance >= 67) return '#2E7D32';
    if (avance >= 34) return '#F9A825';
    return '#D32F2F';
  };

  // Estadísticas rápidas
  const totalCompromisos = compromisos.length;
  const noIniciados = compromisos.filter(c => c.etapa === 'No iniciado').length;
  const enPlaneacion = compromisos.filter(c => c.etapa === 'En Planeación').length;
  const enGestion = compromisos.filter(c => c.etapa === 'En Gestión').length;
  const enEjecucion = compromisos.filter(c => c.etapa === 'En Ejecución').length;
  const cumplidos = compromisos.filter(c => c.etapa === 'Cumplido').length;

  // Módulos disponibles para carga
  const modulosCarga = [
    {
      id: 'compromisos' as ModuloCarga,
      titulo: 'Monitoreo Estratégico Gubernamental',
      descripcion: 'Captura y seguimiento de compromisos gubernamentales (MeG)',
      icon: FileCheck,
      color: '#f59e0b',
      disponible: true,
    },
    {
      id: 'gasto' as ModuloCarga,
      titulo: 'Ejercicio del gasto',
      descripcion: 'Registro de ejercicio presupuestal y gasto público',
      icon: DollarSign,
      color: '#8b5cf6',
      disponible: true,
    },
    {
      id: 'indicadores' as ModuloCarga,
      titulo: 'Información de Desempeño',
      descripcion: 'Captura de metas y resultados de indicadores',
      icon: BarChart3,
      color: '#06b6d4',
      disponible: true,
    },
    {
      id: 'normatividad' as ModuloCarga,
      titulo: 'Normatividad',
      descripcion: 'Registro de cumplimiento normativo y documentación',
      icon: BookOpen,
      color: '#84cc16',
      disponible: true,
    },
    {
      id: 'obra' as ModuloCarga,
      titulo: 'Obra Evalúa',
      descripcion: 'Evaluación Integral del Desempeño e Infraestructura con Resultados',
      icon: Hammer,
      color: '#582672',
      disponible: true,
    },
  ];

  const renderEmptyState = (titulo: string, descripcion: string, icono: any) => {
    const Icon = icono;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 px-6"
      >
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#58267215' }}>
          <Icon className="w-10 h-10" style={{ color: '#582672' }} />
        </div>
        <h3 className="text-2xl mb-3" style={{ color: '#582672', fontWeight: 'bold' }}>
          {titulo}
        </h3>
        <p className="text-center text-gray-600 mb-6 max-w-md">
          {descripcion}
        </p>
        <Button variant="outline" disabled>
          MÓDULO EN CONSTRUCCIÓN
        </Button>
      </motion.div>
    );
  };

  // Si hay un compromiso seleccionado, mostrar formulario de edición
  if (selectedCompromiso) {
    return (
      <EnlaceEditForm
        compromiso={selectedCompromiso}
        onClose={() => setSelectedCompromiso(null)}
        onSave={() => {
          setSelectedCompromiso(null);
          // Aquí iría la lógica de guardado
        }}
        username={username}
      />
    );
  }

  // Renderizar el módulo activo
  const renderActiveModule = () => {
    // MENÚ PRINCIPAL
    if (activeModule === 'menu') {
      return (
        <div className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <p className="text-gray-600">
              Elija el módulo al que desea acceder para registrar información de su dependencia
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modulosCarga.map((modulo, index) => {
              const Icon = modulo.icon;
              return (
                <motion.div
                  key={modulo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="h-full"
                >
                  <Card 
                    className={`hover:shadow-lg transition-all cursor-pointer border-2 flex flex-col h-full ${
                      modulo.disponible ? 'hover:border-blue-300' : 'opacity-60'
                    }`}
                    onClick={() => modulo.disponible && setActiveModule(modulo.id)}
                  >
                    <CardHeader className="flex-1">
                      <div className="flex items-start gap-4">
                        <div 
                          className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${modulo.color}15` }}
                        >
                          <Icon className="w-7 h-7" style={{ color: modulo.color }} />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2" style={{ color: '#582672' }}>
                            {modulo.titulo}
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            {modulo.descripcion}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {modulo.disponible ? (
                        <Button 
                          className="w-full"
                          style={{ backgroundColor: '#1976D2' }}
                        >
                          CARGAR INFORMACIÓN
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        <Button 
                          className="w-full"
                          variant="outline"
                          disabled
                        >
                          PRÓXIMAMENTE
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      );
    }

    // MÓDULO DE COMPROMISOS (MeG)
    if (activeModule === 'compromisos') {
      // Calcular porcentaje de cumplimiento para el semáforo general
      const porcentajeCumplimiento = totalCompromisos > 0 
        ? (cumplidos / totalCompromisos) * 100 
        : 0;
      
      const getSemaforoColor = () => {
        if (porcentajeCumplimiento >= 66) return '#2E7D32';
        if (porcentajeCumplimiento >= 33) return '#F9A825';
        return '#D32F2F';
      };
      
      const getSemaforoLabel = () => {
        if (porcentajeCumplimiento >= 66) return 'ALTO';
        if (porcentajeCumplimiento >= 33) return 'MEDIO';
        return 'BAJO';
      };

      return (
        <div className="container mx-auto px-6 py-8">
          {/* Encabezado del módulo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <Button
              variant="outline"
              onClick={() => setActiveModule('menu')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl mb-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                  MONITOREO ESTRATÉGICO GUBERNAMENTAL
                </h1>
                <div className="h-1 w-24 rounded-full" style={{ backgroundColor: '#582672' }} />
              </div>
              
              {/* Semáforo General */}
              <Card className="border-2" style={{ borderColor: getSemaforoColor() }}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: getSemaforoColor() }}
                    >
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Nivel de Cumplimiento</p>
                      <p className="text-xl" style={{ fontWeight: 'bold', color: getSemaforoColor() }}>
                        {getSemaforoLabel()} ({porcentajeCumplimiento.toFixed(1)}%)
                      </p>
                      <p className="text-xs text-gray-500">
                        {cumplidos} de {totalCompromisos} cumplidos
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* KPIs rápidos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#58267215' }}>
                      <CheckCircle2 className="w-5 h-5" style={{ color: '#582672' }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Total asignados</p>
                      <p className="text-2xl" style={{ fontWeight: 'bold' }}>{totalCompromisos}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#9E9E9E15' }}>
                      <Clock className="w-5 h-5" style={{ color: '#9E9E9E' }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">No iniciado</p>
                      <p className="text-2xl" style={{ fontWeight: 'bold' }}>{noIniciados}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FF980015' }}>
                      <ListChecks className="w-5 h-5" style={{ color: '#FF9800' }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">En Planeación</p>
                      <p className="text-2xl" style={{ fontWeight: 'bold' }}>{enPlaneacion}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FF572215' }}>
                      <Play className="w-5 h-5" style={{ color: '#FF5722' }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">En Gestión</p>
                      <p className="text-2xl" style={{ fontWeight: 'bold' }}>{enGestion}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1976D215' }}>
                      <Activity className="w-5 h-5" style={{ color: '#1976D2' }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">En Ejecución</p>
                      <p className="text-2xl" style={{ fontWeight: 'bold' }}>{enEjecucion}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#2E7D3215' }}>
                      <CheckCircle2 className="w-5 h-5" style={{ color: '#2E7D32' }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Cumplidos</p>
                      <p className="text-2xl" style={{ fontWeight: 'bold' }}>{cumplidos}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Filtros y búsqueda */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-6"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Buscar por número o nombre del compromiso..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Select value={filterEtapa} onValueChange={setFilterEtapa}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filtrar por etapa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas las etapas</SelectItem>
                      <SelectItem value="No iniciado">No iniciado</SelectItem>
                      <SelectItem value="En Planeación">En Planeación</SelectItem>
                      <SelectItem value="En Gestión">En Gestión</SelectItem>
                      <SelectItem value="En Ejecución">En Ejecución</SelectItem>
                      <SelectItem value="Cumplido">Cumplido</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterRol} onValueChange={setFilterRol}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filtrar por rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los roles</SelectItem>
                      <SelectItem value="asignados">Asignados</SelectItem>
                      <SelectItem value="interviniente">Interviniente</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('');
                      setFilterEtapa('todos');
                      setFilterRol('todos');
                    }}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Limpiar filtros
                  </Button>
                </div>

                <div className="mt-3">
                  <p className="text-sm text-gray-600">
                    Mostrando <strong>{filteredCompromisos.length}</strong> de <strong>{totalCompromisos}</strong> compromisos
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabla de compromisos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-xl" style={{ color: '#582672', fontWeight: 'bold' }}>
                  LISTADO DE COMPROMISOS ASIGNADOS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TooltipProvider>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">Nº Compromiso</TableHead>
                        <TableHead>Nombre del Compromiso</TableHead>
                        <TableHead className="w-[140px]">Etapa Actual</TableHead>
                        <TableHead className="w-[160px] text-center">Dependencias Asignadas</TableHead>
                        <TableHead className="w-[160px]">Última Actualización</TableHead>
                        <TableHead className="w-[120px] text-center">Acción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCompromisos.map((compromiso, index) => (
                        <motion.tr
                          key={compromiso.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.02 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {compromiso.numero}
                              </Badge>
                              {!compromiso.esResponsable && (
                                <Badge 
                                  className="text-xs border-0"
                                  style={{ 
                                    backgroundColor: '#FF980015',
                                    color: '#FF9800'
                                  }}
                                >
                                  Interviniente
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm" style={{ fontWeight: 'bold' }}>
                              {compromiso.nombre}
                            </p>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className="text-xs border-0"
                              style={{
                                backgroundColor: `${getEtapaColor(compromiso.etapa)}15`,
                                color: getEtapaColor(compromiso.etapa),
                              }}
                            >
                              {compromiso.etapa}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="inline-flex items-center gap-2 cursor-pointer px-3 py-1 rounded-md hover:bg-gray-100 transition-colors">
                                  <Building2 className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm" style={{ fontWeight: 'bold' }}>
                                    {compromiso.dependenciasAsignadas.length}
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs">
                                <div className="space-y-1">
                                  <p className="text-xs" style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                    Dependencias Intervinientes:
                                  </p>
                                  {compromiso.dependenciasAsignadas.map((dep: string, idx: number) => (
                                    <p key={idx} className="text-xs">
                                      • {dep}
                                    </p>
                                  ))}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <p className="text-xs text-gray-600">{compromiso.ultimaActualizacion}</p>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              size="sm"
                              onClick={() => setSelectedCompromiso(compromiso)}
                              style={{ backgroundColor: '#582672', color: 'white' }}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </Button>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </TooltipProvider>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      );
    }

    // MÓDULOS CON EMPTY STATE
    if (activeModule === 'gasto') {
      return <EnlaceCargaGasto userName={username} onVolverInicio={() => setActiveModule('menu')} />;
    }

    if (activeModule === 'indicadores') {
      return <EnlaceCargaIndicadores userName={username} onVolverInicio={() => setActiveModule('menu')} />;
    }

    if (activeModule === 'normatividad') {
      return <EnlaceCargaNormatividad userName={username} onVolverInicio={() => setActiveModule('menu')} />;
    }

    if (activeModule === 'obra') {
      return <EnlaceCargaObraPublica userName={username} onVolverInicio={() => setActiveModule('menu')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header simplificado */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <img 
                src={cgpiLogo} 
                alt="CGPI - Coordinación General de Planeación e Inversión" 
                className="h-10 w-auto object-contain"
              />
            </div>
            
            <div className="flex items-center gap-4">
              {activeModule !== 'menu' && (
                <Button
                  variant="outline"
                  onClick={() => setActiveModule('menu')}
                >
                  Volver al Menú
                </Button>
              )}
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-gray-500" />
                  <p className="text-sm" style={{ fontWeight: 'bold' }}>
                    {username}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Usuario Enlace
                </Badge>
              </div>
              <Button
                variant="outline"
                onClick={onLogout}
                className="hover:bg-red-50 hover:border-red-300 hover:text-red-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de información de la dependencia */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-purple-600 to-blue-600 border-b border-purple-700"
        style={{ background: 'linear-gradient(90deg, #582672 0%, #1976D2 100%)' }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-white" strokeWidth={1.5} />
              <div>
                <p className="text-xs text-white text-opacity-80 mb-1">DEPENDENCIA / ENTIDAD</p>
                <p className="text-lg text-white" style={{ fontWeight: 'bold' }}>
                  {dependenciaAsignada}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="h-8 w-px bg-white bg-opacity-30" />
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-6 h-6 text-white" strokeWidth={1.5} />
                <div>
                  <p className="text-xs text-white text-opacity-80 mb-1">ÚLTIMA MODIFICACIÓN</p>
                  <p className="text-sm text-white" style={{ fontWeight: 'bold' }}>
                    {ultimaModificacion.fecha} • {ultimaModificacion.hora} hrs
                  </p>
                </div>
              </div>

              <div className="h-8 w-px bg-white bg-opacity-30" />
              <div className="flex items-center gap-3">
                <UserCheck className="w-6 h-6 text-white" strokeWidth={1.5} />
                <div>
                  <p className="text-xs text-white text-opacity-80 mb-1">MODIFICADO POR</p>
                  <p className="text-sm text-white" style={{ fontWeight: 'bold' }}>
                    {ultimaModificacion.usuario}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {renderActiveModule()}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Coordinación General de Planeación e Inversión (CGPI)
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Gobierno del Estado de Tlaxcala © 2025
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}