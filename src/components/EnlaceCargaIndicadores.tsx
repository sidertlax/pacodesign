import { useState, useEffect } from 'react';
import {
  Save,
  FileText,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Building2,
  Calendar,
  Info,
  Upload,
  Trash2,
  RefreshCw,
  Lock,
  Unlock,
  FileCheck,
  ArrowLeft,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { motion, AnimatePresence } from 'motion/react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from './ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface EnlaceCargaIndicadoresProps {
  userName: string;
  onVolverInicio?: () => void;
}

interface Proyecto {
  ID_DE: string;
  ID_PROYECTO: string;
  nombreProyecto: string;
  ID_PROGRAMA: string;
  nombrePrograma: string;
  ID_LINEA: string;
  lineaAccion: string;
}

interface Indicador {
  ID_NIVEL: string;
  ID_INDICADOR: string;
  nombreIndicador: string;
  frecuencia: 'Mensual' | 'Semestral' | 'Anual';
  formula: string;
  valorBase: number;
  unidadMedida: string;
  datos: {
    numerador: number[];
    denominador: number[];
  };
  mediosVerificacion: {
    [key: string]: { archivo?: string; fecha?: string };
  };
}

const MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
const MES_ACTUAL_INDEX = 10; // Noviembre (0-based)
const MES_ACTUAL_NOMBRE = 'Noviembre';
const EJERCICIO_FISCAL = 2025;

// Datos mock de proyectos
const PROYECTOS_MOCK: Proyecto[] = [
  {
    ID_DE: 'SEP-001',
    ID_PROYECTO: 'PROJ-2025-001',
    nombreProyecto: 'Infraestructura Educativa y Equipamiento',
    ID_PROGRAMA: 'PROG-04',
    nombrePrograma: 'Educación de Calidad y Equidad',
    ID_LINEA: 'LA-2.1',
    lineaAccion: 'Fortalecimiento de la infraestructura educativa estatal',
  },
  {
    ID_DE: 'SEP-001',
    ID_PROYECTO: 'PROJ-2025-002',
    nombreProyecto: 'Capacitación y Desarrollo Docente',
    ID_PROGRAMA: 'PROG-04',
    nombrePrograma: 'Educación de Calidad y Equidad',
    ID_LINEA: 'LA-2.2',
    lineaAccion: 'Profesionalización y actualización del personal docente',
  },
  {
    ID_DE: 'SEP-001',
    ID_PROYECTO: 'PROJ-2025-003',
    nombreProyecto: 'Becas y Apoyos para Estudiantes',
    ID_PROGRAMA: 'PROG-04',
    nombrePrograma: 'Educación de Calidad y Equidad',
    ID_LINEA: 'LA-2.3',
    lineaAccion: 'Inclusión educativa y reducción de la deserción escolar',
  },
];

// Indicadores mock por proyecto
const INDICADORES_MOCK: Record<string, Indicador[]> = {
  'PROJ-2025-001': [
    {
      ID_NIVEL: 'C-01',
      ID_INDICADOR: 'IND-2025-001',
      nombreIndicador: 'Porcentaje de escuelas rehabilitadas',
      frecuencia: 'Semestral',
      formula: '(Numerador / Denominador) * 100',
      valorBase: 65,
      unidadMedida: 'Porcentaje',
      datos: {
        numerador: [5, 8, 12, 15, 18, 22, 0, 0, 0, 0, 0, 0],
        denominador: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
      },
      mediosVerificacion: {
        '5': { archivo: 'reporte_junio_2025.pdf', fecha: '30/06/2025' },
      },
    },
    {
      ID_NIVEL: 'C-02',
      ID_INDICADOR: 'IND-2025-002',
      nombreIndicador: 'Equipamiento tecnológico entregado',
      frecuencia: 'Mensual',
      formula: '(Numerador / Denominador) * 100',
      valorBase: 80,
      unidadMedida: 'Porcentaje',
      datos: {
        numerador: [120, 135, 142, 158, 165, 178, 185, 192, 198, 205, 0, 0],
        denominador: [250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250],
      },
      mediosVerificacion: {},
    },
    {
      ID_NIVEL: 'C-03',
      ID_INDICADOR: 'IND-2025-003',
      nombreIndicador: 'Avance de inversión en infraestructura',
      frecuencia: 'Anual',
      formula: '(Numerador / Denominador) * 100',
      valorBase: 100,
      unidadMedida: 'Porcentaje',
      datos: {
        numerador: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        denominador: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
      },
      mediosVerificacion: {},
    },
  ],
  'PROJ-2025-002': [
    {
      ID_NIVEL: 'C-01',
      ID_INDICADOR: 'IND-2025-004',
      nombreIndicador: 'Docentes capacitados en nuevas metodologías',
      frecuencia: 'Semestral',
      formula: '(Numerador / Denominador) * 100',
      valorBase: 70,
      unidadMedida: 'Porcentaje',
      datos: {
        numerador: [45, 92, 138, 185, 232, 280, 0, 0, 0, 0, 0, 0],
        denominador: [400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400],
      },
      mediosVerificacion: {
        '5': { archivo: 'constancias_capacitacion_jun2025.pdf', fecha: '30/06/2025' },
      },
    },
  ],
  'PROJ-2025-003': [
    {
      ID_NIVEL: 'C-01',
      ID_INDICADOR: 'IND-2025-005',
      nombreIndicador: 'Becas entregadas a estudiantes vulnerables',
      frecuencia: 'Mensual',
      formula: '(Numerador / Denominador) * 100',
      valorBase: 85,
      unidadMedida: 'Porcentaje',
      datos: {
        numerador: [850, 1020, 1180, 1350, 1520, 1680, 1840, 2010, 2180, 2340, 0, 0],
        denominador: [2800, 2800, 2800, 2800, 2800, 2800, 2800, 2800, 2800, 2800, 2800, 2800],
      },
      mediosVerificacion: {},
    },
    {
      ID_NIVEL: 'C-02',
      ID_INDICADOR: 'IND-2025-006',
      nombreIndicador: 'Reducción de deserción escolar',
      frecuencia: 'Anual',
      formula: '(Numerador / Denominador) * 100',
      valorBase: 12,
      unidadMedida: 'Porcentaje',
      datos: {
        numerador: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        denominador: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
      },
      mediosVerificacion: {},
    },
  ],
};

export function EnlaceCargaIndicadores({ userName, onVolverInicio }: EnlaceCargaIndicadoresProps) {
  const dependenciaAsignada = 'Secretaría de Educación Pública';
  
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState<string>('');
  const [indicadorActivo, setIndicadorActivo] = useState<number>(0);
  const [indicadores, setIndicadores] = useState<Indicador[]>([]);
  const [cambiosSinGuardar, setCambiosSinGuardar] = useState(false);
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<{ [key: string]: File | null }>({});

  useEffect(() => {
    if (proyectoSeleccionado) {
      const indicadoresProyecto = INDICADORES_MOCK[proyectoSeleccionado] || [];
      setIndicadores(JSON.parse(JSON.stringify(indicadoresProyecto))); // Deep copy
      setIndicadorActivo(0);
    } else {
      setIndicadores([]);
    }
  }, [proyectoSeleccionado]);

  const proyectoActual = PROYECTOS_MOCK.find(p => p.ID_PROYECTO === proyectoSeleccionado);
  const indicadorActual = indicadores[indicadorActivo];

  const handleCambiarProyecto = () => {
    if (cambiosSinGuardar) {
      const confirmar = window.confirm('Tienes cambios sin guardar. ¿Deseas continuar?');
      if (!confirmar) return;
    }
    setProyectoSeleccionado('');
    setCambiosSinGuardar(false);
  };

  const handleActualizarDato = (
    tipo: 'numerador' | 'denominador',
    mesIndex: number,
    valor: number
  ) => {
    const nuevosIndicadores = [...indicadores];
    nuevosIndicadores[indicadorActivo].datos[tipo][mesIndex] = valor;
    setIndicadores(nuevosIndicadores);
    setCambiosSinGuardar(true);
  };

  const handleGuardarIndicador = () => {
    // Simular guardado
    setTimeout(() => {
      setGuardadoExitoso(true);
      setCambiosSinGuardar(false);
      setTimeout(() => setGuardadoExitoso(false), 3000);
    }, 500);
  };

  const handleSubirArchivo = (mesIndex: number, file: File | null) => {
    if (file) {
      const nuevosIndicadores = [...indicadores];
      nuevosIndicadores[indicadorActivo].mediosVerificacion[mesIndex.toString()] = {
        archivo: file.name,
        fecha: new Date().toLocaleDateString('es-MX'),
      };
      setIndicadores(nuevosIndicadores);
      setArchivoSeleccionado({ ...archivoSeleccionado, [mesIndex]: file });
      setCambiosSinGuardar(true);
    }
  };

  const handleEliminarArchivo = (mesIndex: number) => {
    const nuevosIndicadores = [...indicadores];
    delete nuevosIndicadores[indicadorActivo].mediosVerificacion[mesIndex.toString()];
    setIndicadores(nuevosIndicadores);
    const newFiles = { ...archivoSeleccionado };
    delete newFiles[mesIndex];
    setArchivoSeleccionado(newFiles);
    setCambiosSinGuardar(true);
  };

  const calcularResultadoMes = (mesIndex: number): number => {
    if (!indicadorActual) return 0;
    const num = indicadorActual.datos.numerador[mesIndex];
    const den = indicadorActual.datos.denominador[mesIndex];
    if (den === 0) return 0;
    return (num / den) * 100;
  };

  const getMesesParaMedioVerificacion = (): number[] => {
    if (!indicadorActual) return [];
    
    switch (indicadorActual.frecuencia) {
      case 'Anual':
        return [11]; // Diciembre
      case 'Semestral':
        return [5, 11]; // Junio y Diciembre
      case 'Mensual':
        return []; // No requiere medio de verificación mensual
      default:
        return [];
    }
  };

  const esMesParaMedioVerificacion = (mesIndex: number): boolean => {
    return getMesesParaMedioVerificacion().includes(mesIndex);
  };

  const puedeEditarDenominador = (mesIndex: number): boolean => {
    // Solo en enero (índice 0) si el mes actual es enero o posterior
    return mesIndex === 0 && MES_ACTUAL_INDEX >= 0;
  };

  if (!proyectoSeleccionado) {
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
            onClick={onVolverInicio}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>
          <h1 className="text-3xl mb-2" style={{ color: '#582672', fontWeight: 'bold' }}>
            INDICADORES DE DESEMPEÑO
          </h1>
          <div className="h-1 w-24 rounded-full" style={{ backgroundColor: '#582672' }} />
        </motion.div>

        {/* Header informativo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#582672' }}>
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">DEPENDENCIA / ENTIDAD</p>
                    <p className="text-xl" style={{ fontWeight: 'bold', color: '#582672' }}>
                      {dependenciaAsignada}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <p className="text-sm text-gray-600">MES ACTUAL</p>
                    </div>
                    <p className="text-2xl" style={{ fontWeight: 'bold', color: '#1976D2' }}>
                      {MES_ACTUAL_NOMBRE}
                    </p>
                  </div>

                  <div className="h-12 w-px bg-gray-300" />

                  <div className="text-center">
                    <div className="flex items-center gap-2 mb-1">
                      <Info className="w-4 h-4 text-gray-600" />
                      <p className="text-sm text-gray-600">EJERCICIO FISCAL</p>
                    </div>
                    <p className="text-2xl" style={{ fontWeight: 'bold', color: '#1976D2' }}>
                      {EJERCICIO_FISCAL}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Selector de proyecto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2" style={{ borderColor: '#1976D2' }}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                <FileText className="w-5 h-5" />
                SELECCIÓN DE PROYECTO
              </CardTitle>
              <p className="text-sm text-gray-600">
                Selecciona un proyecto para visualizar y capturar información de sus indicadores de desempeño
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                    PROYECTO
                  </label>
                  <Select value={proyectoSeleccionado} onValueChange={setProyectoSeleccionado}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione un proyecto..." />
                    </SelectTrigger>
                    <SelectContent>
                      {PROYECTOS_MOCK.map(proyecto => (
                        <SelectItem key={proyecto.ID_PROYECTO} value={proyecto.ID_PROYECTO}>
                          <div className="flex flex-col">
                            <span style={{ fontWeight: 'bold' }}>{proyecto.nombreProyecto}</span>
                            <span className="text-xs text-gray-500">{proyecto.ID_PROYECTO}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Alert className="border-blue-300 bg-blue-50">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800">INFORMACIÓN</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    Al seleccionar un proyecto, podrás visualizar su información descriptiva y capturar datos de los indicadores asociados.
                    Total de proyectos disponibles: <span style={{ fontWeight: 'bold' }}>{PROYECTOS_MOCK.length}</span>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header informativo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#582672' }}>
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">DEPENDENCIA / ENTIDAD</p>
                  <p className="text-xl" style={{ fontWeight: 'bold', color: '#582672' }}>
                    {dependenciaAsignada}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <p className="text-sm text-gray-600">MES ACTUAL</p>
                  </div>
                  <p className="text-2xl" style={{ fontWeight: 'bold', color: '#1976D2' }}>
                    {MES_ACTUAL_NOMBRE}
                  </p>
                </div>

                <div className="h-12 w-px bg-gray-300" />

                <div className="text-center">
                  <div className="flex items-center gap-2 mb-1">
                    <Info className="w-4 h-4 text-gray-600" />
                    <p className="text-sm text-gray-600">EJERCICIO FISCAL</p>
                  </div>
                  <p className="text-2xl" style={{ fontWeight: 'bold', color: '#1976D2' }}>
                    {EJERCICIO_FISCAL}
                  </p>
                </div>

                <Button
                  variant="outline"
                  onClick={handleCambiarProyecto}
                  className="border-2"
                  style={{ borderColor: '#582672', color: '#582672' }}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  CAMBIAR PROYECTO
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Información del Proyecto */}
      {proyectoActual && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                <FileText className="w-5 h-5" />
                INFORMACIÓN DEL PROYECTO
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 mb-1">ID DEPENDENCIA/ENTIDAD</p>
                      <p className="text-sm" style={{ fontWeight: 'bold', color: '#374151' }}>
                        {proyectoActual.ID_DE}
                      </p>
                    </div>
                    <Lock className="w-4 h-4 text-gray-400 mt-1" />
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 mb-1">ID PROYECTO</p>
                      <p className="text-sm" style={{ fontWeight: 'bold', color: '#374151' }}>
                        {proyectoActual.ID_PROYECTO}
                      </p>
                    </div>
                    <Lock className="w-4 h-4 text-gray-400 mt-1" />
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex-1">
                      <p className="text-xs text-purple-700 mb-1">NOMBRE DEL PROYECTO</p>
                      <p className="text-base" style={{ fontWeight: 'bold', color: '#582672' }}>
                        {proyectoActual.nombreProyecto}
                      </p>
                    </div>
                    <Lock className="w-4 h-4 text-purple-400 mt-1" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 mb-1">PROGRAMA</p>
                      <p className="text-sm" style={{ fontWeight: 'bold', color: '#374151' }}>
                        {proyectoActual.ID_PROGRAMA} - {proyectoActual.nombrePrograma}
                      </p>
                    </div>
                    <Lock className="w-4 h-4 text-gray-400 mt-1" />
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex-1">
                      <p className="text-xs text-blue-700 mb-1">LÍNEA DE ACCIÓN - PLAN ESTATAL DE DESARROLLO</p>
                      <p className="text-sm" style={{ fontWeight: 'bold', color: '#1976D2' }}>
                        {proyectoActual.ID_LINEA} - {proyectoActual.lineaAccion}
                      </p>
                    </div>
                    <Lock className="w-4 h-4 text-blue-400 mt-1" />
                  </div>

                  <Alert className="border-purple-300 bg-purple-50">
                    <AlertCircle className="h-4 w-4 text-purple-600" />
                    <AlertDescription className="text-purple-700 text-sm">
                      Esta información es de <span style={{ fontWeight: 'bold' }}>solo lectura</span> y proviene del sistema de planeación.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Listado de indicadores */}
      {indicadores.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Alert className="border-yellow-300 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800">SIN INDICADORES</AlertTitle>
            <AlertDescription className="text-yellow-700">
              Este proyecto no tiene indicadores de desempeño asociados. Contacta al administrador del sistema.
            </AlertDescription>
          </Alert>
        </motion.div>
      ) : (
        <>
          {/* Navegación entre indicadores */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className="border-0" style={{ backgroundColor: '#58267215', color: '#582672' }}>
                      INDICADOR {indicadorActivo + 1} DE {indicadores.length}
                    </Badge>
                    {cambiosSinGuardar && (
                      <Badge className="border-0 bg-yellow-100 text-yellow-800">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        CAMBIOS SIN GUARDAR
                      </Badge>
                    )}
                    {guardadoExitoso && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Badge className="border-0 bg-green-100 text-green-800">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          GUARDADO EXITOSO
                        </Badge>
                      </motion.div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {indicadores.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setIndicadorActivo(index)}
                        className="w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all"
                        style={{
                          backgroundColor: indicadorActivo === index ? '#582672' : 'white',
                          borderColor: indicadorActivo === index ? '#582672' : '#E5E7EB',
                          color: indicadorActivo === index ? 'white' : '#374151',
                          fontWeight: 'bold',
                        }}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Información del indicador */}
          {indicadorActual && (
            <motion.div
              key={indicadorActivo}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-2 mb-6" style={{ borderColor: '#1976D2' }}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg mb-2" style={{ color: '#1976D2', fontWeight: 'bold' }}>
                        {indicadorActual.nombreIndicador}
                      </CardTitle>
                      <div className="flex items-center gap-3">
                        <Badge className="border-0" style={{ backgroundColor: '#1976D215', color: '#1976D2' }}>
                          {indicadorActual.ID_NIVEL}
                        </Badge>
                        <Badge className="border-0" style={{ backgroundColor: '#1976D215', color: '#1976D2' }}>
                          {indicadorActual.ID_INDICADOR}
                        </Badge>
                        <Badge
                          className="border-0"
                          style={{
                            backgroundColor: 
                              indicadorActual.frecuencia === 'Anual' ? '#2E7D3215' :
                              indicadorActual.frecuencia === 'Semestral' ? '#FFA00015' :
                              '#1976D215',
                            color:
                              indicadorActual.frecuencia === 'Anual' ? '#2E7D32' :
                              indicadorActual.frecuencia === 'Semestral' ? '#FFA000' :
                              '#1976D2',
                          }}
                        >
                          FRECUENCIA: {indicadorActual.frecuencia.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs text-blue-700 mb-1">FÓRMULA</p>
                      <p className="text-sm" style={{ fontWeight: 'bold', color: '#1976D2' }}>
                        {indicadorActual.formula}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">VALOR BASE</p>
                      <p className="text-2xl" style={{ fontWeight: 'bold', color: '#374151' }}>
                        {indicadorActual.valorBase}
                      </p>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-xs text-purple-700 mb-1">UNIDAD DE MEDIDA</p>
                      <p className="text-sm" style={{ fontWeight: 'bold', color: '#582672' }}>
                        {indicadorActual.unidadMedida}
                      </p>
                    </div>
                  </div>

                  {/* Tabla de captura mensual */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="py-3 px-4 text-left text-sm" style={{ fontWeight: 'bold', color: '#374151' }}>
                              CONCEPTO
                            </th>
                            {MESES.map((mes, index) => (
                              <th
                                key={mes}
                                className="py-3 px-3 text-center text-xs"
                                style={{
                                  fontWeight: 'bold',
                                  color: index === MES_ACTUAL_INDEX ? '#1976D2' : '#374151',
                                  backgroundColor: index === MES_ACTUAL_INDEX ? '#1976D215' : 'transparent',
                                }}
                              >
                                {mes}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {/* Fila Numerador */}
                          <tr className="border-b">
                            <td className="py-3 px-4 bg-green-50">
                              <div className="flex items-center gap-2">
                                <Unlock className="w-4 h-4 text-green-600" />
                                <span className="text-sm" style={{ fontWeight: 'bold', color: '#2E7D32' }}>
                                  Numerador
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">Acciones realizadas</p>
                            </td>
                            {MESES.map((_, mesIndex) => (
                              <td key={mesIndex} className="py-2 px-2">
                                <Input
                                  type="number"
                                  min="0"
                                  value={indicadorActual.datos.numerador[mesIndex] || ''}
                                  onChange={(e) => handleActualizarDato('numerador', mesIndex, parseFloat(e.target.value) || 0)}
                                  className="text-center text-sm"
                                  disabled={mesIndex > MES_ACTUAL_INDEX}
                                  style={{
                                    backgroundColor: mesIndex > MES_ACTUAL_INDEX ? '#F3F4F6' : 'white',
                                  }}
                                />
                              </td>
                            ))}
                          </tr>

                          {/* Fila Denominador */}
                          <tr className="border-b">
                            <td className="py-3 px-4 bg-orange-50">
                              <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4 text-orange-600" />
                                <span className="text-sm" style={{ fontWeight: 'bold', color: '#F57C00' }}>
                                  Denominador
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">Acciones programadas</p>
                            </td>
                            {MESES.map((_, mesIndex) => (
                              <td key={mesIndex} className="py-2 px-2">
                                <Input
                                  type="number"
                                  min="0"
                                  value={indicadorActual.datos.denominador[mesIndex] || ''}
                                  onChange={(e) => handleActualizarDato('denominador', mesIndex, parseFloat(e.target.value) || 0)}
                                  className="text-center text-sm"
                                  disabled={!puedeEditarDenominador(mesIndex)}
                                  style={{
                                    backgroundColor: !puedeEditarDenominador(mesIndex) ? '#FFF3E0' : 'white',
                                  }}
                                />
                              </td>
                            ))}
                          </tr>

                          {/* Fila Resultado % */}
                          <tr className="bg-blue-50">
                            <td className="py-3 px-4">
                              <span className="text-sm" style={{ fontWeight: 'bold', color: '#1976D2' }}>
                                Resultado (%)
                              </span>
                              <p className="text-xs text-gray-600 mt-1">Cálculo automático</p>
                            </td>
                            {MESES.map((_, mesIndex) => (
                              <td key={mesIndex} className="py-3 px-3 text-center">
                                <span
                                  className="text-sm"
                                  style={{
                                    fontWeight: 'bold',
                                    color: calcularResultadoMes(mesIndex) >= indicadorActual.valorBase ? '#2E7D32' : '#D32F2F',
                                  }}
                                >
                                  {calcularResultadoMes(mesIndex).toFixed(1)}%
                                </span>
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Medios de verificación */}
                  {getMesesParaMedioVerificacion().length > 0 && (
                    <div className="mt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <FileCheck className="w-5 h-5" style={{ color: '#582672' }} />
                        <h3 className="text-lg" style={{ fontWeight: 'bold', color: '#582672' }}>
                          MEDIOS DE VERIFICACIÓN
                        </h3>
                      </div>

                      <Alert className="border-purple-300 bg-purple-50 mb-4">
                        <Info className="h-4 w-4 text-purple-600" />
                        <AlertDescription className="text-purple-700 text-sm">
                          Según la frecuencia <span style={{ fontWeight: 'bold' }}>{indicadorActual.frecuencia}</span>, debes cargar evidencia en:{' '}
                          <span style={{ fontWeight: 'bold' }}>
                            {getMesesParaMedioVerificacion().map(i => MESES[i]).join(' y ')}
                          </span>
                        </AlertDescription>
                      </Alert>

                      <div className="grid grid-cols-2 gap-4">
                        {getMesesParaMedioVerificacion().map((mesIndex) => {
                          const medioExistente = indicadorActual.mediosVerificacion[mesIndex.toString()];
                          return (
                            <div key={mesIndex} className="border rounded-lg p-4 bg-white">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-sm" style={{ fontWeight: 'bold', color: '#374151' }}>
                                  {MESES[mesIndex]} {EJERCICIO_FISCAL}
                                </span>
                                {medioExistente ? (
                                  <Badge className="border-0 bg-green-100 text-green-800">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    CARGADO
                                  </Badge>
                                ) : (
                                  <Badge className="border-0 bg-gray-100 text-gray-600">
                                    PENDIENTE
                                  </Badge>
                                )}
                              </div>

                              {medioExistente ? (
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-200">
                                  <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-green-600" />
                                    <div>
                                      <p className="text-sm" style={{ fontWeight: 'bold', color: '#2E7D32' }}>
                                        {medioExistente.archivo}
                                      </p>
                                      <p className="text-xs text-gray-600">{medioExistente.fecha}</p>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEliminarArchivo(mesIndex)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ) : (
                                <div>
                                  <input
                                    type="file"
                                    accept=".pdf"
                                    id={`file-${mesIndex}`}
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleSubirArchivo(mesIndex, file);
                                    }}
                                  />
                                  <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => document.getElementById(`file-${mesIndex}`)?.click()}
                                    disabled={mesIndex > MES_ACTUAL_INDEX}
                                  >
                                    <Upload className="w-4 h-4 mr-2" />
                                    SUBIR ARCHIVO PDF
                                  </Button>
                                  {mesIndex > MES_ACTUAL_INDEX && (
                                    <p className="text-xs text-gray-500 mt-2 text-center">
                                      Disponible a partir de {MESES[mesIndex]}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Botón de guardar */}
                  <div className="mt-6 flex items-center justify-end gap-3">
                    <Button
                      onClick={handleGuardarIndicador}
                      disabled={!cambiosSinGuardar}
                      style={{ backgroundColor: cambiosSinGuardar ? '#1976D2' : '#9E9E9E' }}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {guardadoExitoso ? 'GUARDADO' : 'GUARDAR CAMBIOS'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}