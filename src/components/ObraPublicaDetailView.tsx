import { useState } from 'react';
import {
  ArrowLeft,
  Save,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  Building2,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  Info,
  Trash2,
  Eye,
  Edit3,
  Target,
  TrendingUp,
  Clock,
  AlertTriangle,
  XCircle,
  MessageSquare,
  Check,
  X,
  Download,
  Play,
  FileCheck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from './ui/tabs';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';

interface ObraPublica {
  id: string;
  folioSIIF: string;
  nombreObra: string;
  municipio: string;
  etapa: 'planeacion' | 'gestion' | 'contratacion' | 'ejecucion' | 'concluida';
  estadoCarga: 'completa' | 'incompleta';
  semaforoIAOP: 'verde' | 'amarillo' | 'rojo';
  iaop: number;
  montoTotal: number;
  avanceFinanciero: number;
  metaProgramada: number;
  tipoObra: string;
  evidenciasCompletas: boolean;
}

interface ObraPublicaDetailViewProps {
  obra: ObraPublica;
  onVolver: () => void;
  onGuardar: (obra: ObraPublica) => void;
}

interface Evidencia {
  id: string;
  nombre: string;
  descripcion: string;
  archivo?: {
    nombre: string;
    tamano: number;
    fechaCarga: string;
  };
  estatus: 'pendiente' | 'subido' | 'validacion' | 'aprobado' | 'rechazado';
  comentarioCGPI?: string;
  comentarioEnlace?: string;
  obligatorio: boolean;
}

interface EtapaInfo {
  id: string;
  nombre: string;
  descripcion: string;
  evidencias: Evidencia[];
}

interface AvanceMensual {
  mes: number;
  porcentajeReal: number;
  comentario: string;
  fechaCaptura: string;
}

interface ObservacionCGPI {
  id: string;
  fecha: string;
  usuario: string;
  comentario: string;
  tipo: 'info' | 'alerta' | 'critico';
}

const MUNICIPIOS_TLAXCALA = [
  'Tlaxcala', 'Apizaco', 'Huamantla', 'Chiautempan', 'Calpulalpan',
  'Tzompantepec', 'Santa Cruz Tlaxcala', 'Zacatelco', 'Papalotla',
  'Contla de Juan Cuamatzi', 'San Pablo del Monte', 'Tetla de la Solidaridad',
];

const TIPOS_OBRA = [
  'Infraestructura Vial',
  'Educación',
  'Salud',
  'Hidráulica',
  'Servicios Urbanos',
  'Deporte',
  'Cultura',
  'Equipamiento Urbano',
];

const MODALIDADES_CONTRATACION = [
  'Licitación Pública',
  'Invitación a cuando menos tres personas',
  'Adjudicación Directa',
  'Obra por administración',
];

const MODALIDADES_OBRA = [
  'Construcción',
  'Rehabilitación',
  'Modernización',
  'Equipamiento',
  'Ampliación',
];

const ETAPAS_INFO: EtapaInfo[] = [
  {
    id: 'planeacion',
    nombre: 'Planeación',
    descripcion: 'Fase inicial donde se define el proyecto, sus objetivos y se realiza la planeación técnica y presupuestal.',
    evidencias: [
      {
        id: 'ev-plan-1',
        nombre: 'PAOPS / Mención en documento oficial',
        descripcion: 'Programa Anual de Obras Públicas y Servicios o documento que justifique la inclusión de la obra',
        obligatorio: true,
        estatus: 'pendiente',
      },
      {
        id: 'ev-plan-2',
        nombre: 'Proyecto ejecutivo',
        descripcion: 'Documento técnico que define las características de la obra, planos, especificaciones técnicas',
        obligatorio: true,
        estatus: 'pendiente',
      },
      {
        id: 'ev-plan-3',
        nombre: 'Estimación de costos / Presupuesto base',
        descripcion: 'Análisis de costos unitarios, catálogo de conceptos y presupuesto estimado',
        obligatorio: true,
        estatus: 'pendiente',
      },
    ],
  },
  {
    id: 'gestion',
    nombre: 'Gestión',
    descripcion: 'Fase donde se obtienen los permisos, licencias y autorizaciones necesarias para ejecutar la obra.',
    evidencias: [
      {
        id: 'ev-gest-1',
        nombre: 'Permisos y licencias',
        descripcion: 'Permisos de construcción, uso de suelo, impacto ambiental según aplique',
        obligatorio: true,
        estatus: 'pendiente',
      },
      {
        id: 'ev-gest-2',
        nombre: 'Oficios de autorización',
        descripcion: 'Oficios de autorización para ejecutar la obra, liberación de recursos',
        obligatorio: true,
        estatus: 'pendiente',
      },
      {
        id: 'ev-gest-3',
        nombre: 'Estudios técnicos complementarios',
        descripcion: 'Estudios de mecánica de suelos, topografía, impacto ambiental, etc.',
        obligatorio: false,
        estatus: 'pendiente',
      },
    ],
  },
  {
    id: 'contratacion',
    nombre: 'Contratación',
    descripcion: 'Proceso de selección del contratista mediante la modalidad de contratación aplicable.',
    evidencias: [
      {
        id: 'ev-cont-1',
        nombre: 'Convocatoria o invitación',
        descripcion: 'Documento de convocatoria pública o invitación a participar en el proceso',
        obligatorio: true,
        estatus: 'pendiente',
      },
      {
        id: 'ev-cont-2',
        nombre: 'Bases / Términos de Referencia',
        descripcion: 'Bases de licitación o términos de referencia del proyecto',
        obligatorio: true,
        estatus: 'pendiente',
      },
      {
        id: 'ev-cont-3',
        nombre: 'Contrato o Dictamen de Adjudicación',
        descripcion: 'Contrato firmado con el proveedor o dictamen de adjudicación directa',
        obligatorio: true,
        estatus: 'pendiente',
      },
    ],
  },
  {
    id: 'ejecucion',
    nombre: 'Ejecución',
    descripcion: 'Fase de construcción física de la obra con seguimiento y supervisión continua.',
    evidencias: [
      {
        id: 'ev-ejec-1',
        nombre: 'Reportes de avance físico',
        descripcion: 'Reportes periódicos del avance de la obra, bitácora de obra',
        obligatorio: true,
        estatus: 'subido',
        archivo: {
          nombre: 'reporte_avance_nov_2025.pdf',
          tamano: 2456789,
          fechaCarga: '2025-11-20',
        },
      },
      {
        id: 'ev-ejec-2',
        nombre: 'Estimaciones o comprobantes de gasto',
        descripcion: 'Estimaciones de obra pagadas, facturas y comprobantes de erogación',
        obligatorio: true,
        estatus: 'aprobado',
        archivo: {
          nombre: 'estimaciones_1_5.pdf',
          tamano: 5234567,
          fechaCarga: '2025-11-18',
        },
      },
      {
        id: 'ev-ejec-3',
        nombre: 'Evidencia fotográfica',
        descripcion: 'Fotografías del avance de la obra, antes, durante y progreso',
        obligatorio: true,
        estatus: 'rechazado',
        comentarioCGPI: 'Las fotografías no muestran claramente los avances. Se requieren fotos con fechas y mejor calidad.',
        archivo: {
          nombre: 'fotos_avance_octubre.pdf',
          tamano: 8456123,
          fechaCarga: '2025-10-25',
        },
      },
    ],
  },
  {
    id: 'concluida',
    nombre: 'Concluida',
    descripcion: 'Obra terminada con entrega formal y finiquito del contrato.',
    evidencias: [
      {
        id: 'ev-conc-1',
        nombre: 'Acta de entrega-recepción',
        descripcion: 'Acta formal de entrega de la obra a la dependencia o beneficiarios',
        obligatorio: true,
        estatus: 'pendiente',
      },
      {
        id: 'ev-conc-2',
        nombre: 'Informe final de obra',
        descripcion: 'Informe técnico final con reporte de cumplimiento de metas y especificaciones',
        obligatorio: true,
        estatus: 'pendiente',
      },
      {
        id: 'ev-conc-3',
        nombre: 'Fotografías finales',
        descripcion: 'Registro fotográfico de la obra terminada y en operación',
        obligatorio: true,
        estatus: 'pendiente',
      },
    ],
  },
];

export function ObraPublicaDetailView({ obra: obraInicial, onVolver, onGuardar }: ObraPublicaDetailViewProps) {
  const [tabActiva, setTabActiva] = useState('datos-generales');
  const [obra, setObra] = useState(obraInicial);
  const [isSaving, setIsSaving] = useState(false);

  // Estado para datos generales
  const [datosGenerales, setDatosGenerales] = useState({
    municipio: obra.municipio,
    localidad: 'Centro',
    tipoObra: obra.tipoObra,
    modalidadContratacion: 'Licitación Pública',
    modalidadObra: 'Construcción',
    montoTotal: obra.montoTotal,
    beneficiarios: 1500,
    fechaInicio: '2025-03-15',
    fechaTermino: '2025-12-15',
  });

  // Estado para etapa
  const [etapaActual, setEtapaActual] = useState<string>(obra.etapa);

  // Estado para evidencias
  const [evidenciasPorEtapa, setEvidenciasPorEtapa] = useState<Record<string, Evidencia[]>>(
    ETAPAS_INFO.reduce((acc, etapa) => {
      acc[etapa.id] = etapa.evidencias;
      return acc;
    }, {} as Record<string, Evidencia[]>)
  );

  // Estado para plan financiero
  const [planFinanciero, setPlanFinanciero] = useState({
    duracionMeses: 9,
    porcentajesPorMes: [10, 12, 15, 13, 12, 10, 10, 10, 8],
    guardado: false,
  });

  // Estado para avances mensuales
  const [avancesMensuales, setAvancesMensuales] = useState<AvanceMensual[]>([
    { mes: 1, porcentajeReal: 12, comentario: 'Inicio de obra según programa', fechaCaptura: '2025-04-15' },
    { mes: 2, porcentajeReal: 23, comentario: 'Avance conforme a lo programado', fechaCaptura: '2025-05-10' },
  ]);

  // Estado para nuevo avance
  const [nuevoAvance, setNuevoAvance] = useState({
    mes: 3,
    porcentajeReal: 0,
    comentario: '',
  });

  // Observaciones CGPI (mock)
  const [observacionesCGPI] = useState<ObservacionCGPI[]>([
    {
      id: 'obs-1',
      fecha: '2025-11-15',
      usuario: 'admin',
      comentario: 'Se requiere actualizar las evidencias fotográficas con mayor detalle y fechas visibles.',
      tipo: 'alerta',
    },
    {
      id: 'obs-2',
      fecha: '2025-11-10',
      usuario: 'admin',
      comentario: 'Documentación aprobada. Seguir con el calendario programado.',
      tipo: 'info',
    },
  ]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleGuardarDatosGenerales = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Datos generales guardados correctamente');
    }, 1000);
  };

  const handleCambiarEtapa = (nuevaEtapa: string) => {
    setEtapaActual(nuevaEtapa);
    toast.success(`Etapa actualizada a: ${ETAPAS_INFO.find(e => e.id === nuevaEtapa)?.nombre}`);
  };

  const handleSubirEvidencia = (etapaId: string, evidenciaId: string, file: File) => {
    // Validar formato
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Formato no permitido', {
        description: 'Solo se permiten archivos PDF, JPG o PNG',
      });
      return;
    }

    // Validar tamaño máximo (15 MB)
    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Archivo muy grande', {
        description: 'El archivo no debe superar los 15 MB',
      });
      return;
    }

    setEvidenciasPorEtapa({
      ...evidenciasPorEtapa,
      [etapaId]: evidenciasPorEtapa[etapaId].map(ev => {
        if (ev.id === evidenciaId) {
          return {
            ...ev,
            archivo: {
              nombre: file.name,
              tamano: file.size,
              fechaCarga: new Date().toISOString().split('T')[0],
            },
            estatus: 'subido' as const,
          };
        }
        return ev;
      }),
    });

    toast.success('Evidencia cargada correctamente');
  };

  const handleActualizarComentarioEvidencia = (etapaId: string, evidenciaId: string, comentario: string) => {
    setEvidenciasPorEtapa({
      ...evidenciasPorEtapa,
      [etapaId]: evidenciasPorEtapa[etapaId].map(ev => {
        if (ev.id === evidenciaId) {
          return { ...ev, comentarioEnlace: comentario };
        }
        return ev;
      }),
    });
  };

  const handleGuardarPlanFinanciero = () => {
    const totalPorcentaje = planFinanciero.porcentajesPorMes.reduce((sum, p) => sum + p, 0);
    if (totalPorcentaje !== 100) {
      toast.error('Error en el plan financiero', {
        description: `El total debe sumar 100%. Actualmente: ${totalPorcentaje}%`,
      });
      return;
    }

    setPlanFinanciero({ ...planFinanciero, guardado: true });
    toast.success('Plan financiero guardado correctamente');
  };

  const handleGuardarAvanceMensual = () => {
    if (nuevoAvance.porcentajeReal <= 0) {
      toast.error('Debe ingresar un porcentaje válido');
      return;
    }

    setAvancesMensuales([
      ...avancesMensuales,
      {
        ...nuevoAvance,
        fechaCaptura: new Date().toISOString().split('T')[0],
      },
    ]);

    setNuevoAvance({ mes: nuevoAvance.mes + 1, porcentajeReal: 0, comentario: '' });
    toast.success('Avance mensual registrado correctamente');
  };

  const getEstatusEvidenciaInfo = (estatus: string) => {
    switch (estatus) {
      case 'pendiente':
        return { label: 'Pendiente', color: '#9E9E9E', bgColor: '#F5F5F5', icon: Clock };
      case 'subido':
        return { label: 'Subido', color: '#1976D2', bgColor: '#E3F2FD', icon: Upload };
      case 'validacion':
        return { label: 'En validación', color: '#F57C00', bgColor: '#FFF3E0', icon: AlertCircle };
      case 'aprobado':
        return { label: 'Aprobado', color: '#388E3C', bgColor: '#E8F5E9', icon: CheckCircle2 };
      case 'rechazado':
        return { label: 'Rechazado', color: '#D32F2F', bgColor: '#FFEBEE', icon: XCircle };
      default:
        return { label: 'Pendiente', color: '#9E9E9E', bgColor: '#F5F5F5', icon: Clock };
    }
  };

  // Calcular completitud de datos generales
  const camposCompletos = [
    datosGenerales.municipio,
    datosGenerales.localidad,
    datosGenerales.tipoObra,
    datosGenerales.modalidadContratacion,
    datosGenerales.modalidadObra,
    datosGenerales.montoTotal > 0,
    datosGenerales.beneficiarios > 0,
    datosGenerales.fechaInicio,
    datosGenerales.fechaTermino,
  ].filter(Boolean).length;

  const totalCampos = 9;
  const porcentajeCompletitud = (camposCompletos / totalCampos) * 100;

  // Calcular IAOP
  const totalAvanceReal = avancesMensuales.length > 0 
    ? avancesMensuales[avancesMensuales.length - 1].porcentajeReal 
    : 0;
  const metaProgramadaActual = planFinanciero.porcentajesPorMes
    .slice(0, avancesMensuales.length)
    .reduce((sum, p) => sum + p, 0);
  const iaopCalculado = metaProgramadaActual > 0 ? (totalAvanceReal / metaProgramadaActual) * 100 : 0;

  const getSemaforoFromIAOP = (iaop: number): 'verde' | 'amarillo' | 'rojo' => {
    if (iaop >= 90) return 'verde';
    if (iaop >= 70) return 'amarillo';
    return 'rojo';
  };

  const getSemaforoColor = (semaforo: 'verde' | 'amarillo' | 'rojo'): string => {
    const colors = { verde: '#388E3C', amarillo: '#F57C00', rojo: '#D32F2F' };
    return colors[semaforo];
  };

  // Contar evidencias por estatus
  const evidenciasEtapaActual = evidenciasPorEtapa[etapaActual] || [];
  const evidenciasPendientes = evidenciasEtapaActual.filter(e => e.estatus === 'pendiente').length;
  const evidenciasRechazadas = evidenciasEtapaActual.filter(e => e.estatus === 'rechazado').length;

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Encabezado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Button
          variant="outline"
          onClick={onVolver}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al listado
        </Button>

        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-0">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge style={{ backgroundColor: '#1976D2', color: 'white' }}>
                    {obra.folioSIIF}
                  </Badge>
                  {etapaActual === 'ejecucion' && (
                    <Badge
                      style={{
                        backgroundColor: `${getSemaforoColor(getSemaforoFromIAOP(iaopCalculado))}20`,
                        color: getSemaforoColor(getSemaforoFromIAOP(iaopCalculado)),
                        border: `1px solid ${getSemaforoColor(getSemaforoFromIAOP(iaopCalculado))}`,
                      }}
                    >
                      IAOP: {iaopCalculado.toFixed(1)}%
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl mb-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                  {obra.nombreObra}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {datosGenerales.municipio}, Tlaxcala
                  </div>
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {datosGenerales.tipoObra}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {formatCurrency(datosGenerales.montoTotal)}
                  </div>
                </div>
              </div>

              {/* Semáforo IAOP (solo en ejecución) */}
              {etapaActual === 'ejecucion' && (
                <div className="text-center">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-2"
                    style={{ backgroundColor: getSemaforoColor(getSemaforoFromIAOP(iaopCalculado)) }}
                  >
                    <span className="text-2xl text-white" style={{ fontWeight: 'bold' }}>
                      {iaopCalculado.toFixed(0)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">IAOP</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs principales - Reordenados */}
      <Tabs value={tabActiva} onValueChange={setTabActiva}>
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="datos-generales">Datos Generales</TabsTrigger>
          <TabsTrigger value="etapa-evidencias">Etapa y Evidencias</TabsTrigger>
          <TabsTrigger value="plan-financiero" disabled={etapaActual !== 'ejecucion'}>
            Plan Financiero
          </TabsTrigger>
          <TabsTrigger value="avance-real" disabled={etapaActual !== 'ejecucion'}>
            Avance Real
          </TabsTrigger>
          <TabsTrigger value="observaciones">Observaciones CGPI</TabsTrigger>
        </TabsList>

        {/* TAB 1: Datos Generales */}
        <TabsContent value="datos-generales">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                  <FileText className="w-5 h-5" />
                  DATOS GENERALES DE LA OBRA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Barra de completitud */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm" style={{ fontWeight: 'bold', color: '#1976D2' }}>
                      Completitud de información
                    </p>
                    <span className="text-sm" style={{ fontWeight: 'bold', color: '#1976D2' }}>
                      {camposCompletos}/{totalCampos} campos
                    </span>
                  </div>
                  <Progress value={porcentajeCompletitud} className="h-2" />
                </div>

                {/* Datos precargados (solo lectura) */}
                <div>
                  <h3 className="text-base mb-4" style={{ fontWeight: 'bold', color: '#374151' }}>
                    INFORMACIÓN PRECARGADA DESDE SIIF (SOLO LECTURA)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">FOLIO SIIF</label>
                      <Input value={obra.folioSIIF} disabled className="bg-gray-100" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-600 mb-1">NOMBRE DE LA OBRA</label>
                      <Input value={obra.nombreObra} disabled className="bg-gray-100" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">MONTO TOTAL</label>
                      <Input value={formatCurrency(datosGenerales.montoTotal)} disabled className="bg-gray-100" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">UNIDAD RESPONSABLE</label>
                      <Input value="Secretaría de Obras Públicas" disabled className="bg-gray-100" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    <Info className="w-3 h-3 inline mr-1" />
                    Estos datos provienen del SIIF y no pueden ser modificados desde este módulo.
                  </p>
                </div>

                {/* Datos complementarios (editables) */}
                <div>
                  <h3 className="text-base mb-4" style={{ fontWeight: 'bold', color: '#374151' }}>
                    INFORMACIÓN COMPLEMENTARIA (EDITABLE)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                        MUNICIPIO *
                      </label>
                      <Select
                        value={datosGenerales.municipio}
                        onValueChange={(value) => setDatosGenerales({ ...datosGenerales, municipio: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MUNICIPIOS_TLAXCALA.map(mun => (
                            <SelectItem key={mun} value={mun}>{mun}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                        LOCALIDAD *
                      </label>
                      <Input
                        value={datosGenerales.localidad}
                        onChange={(e) => setDatosGenerales({ ...datosGenerales, localidad: e.target.value })}
                        placeholder="Nombre de la localidad"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                        TIPO DE OBRA *
                      </label>
                      <Select
                        value={datosGenerales.tipoObra}
                        onValueChange={(value) => setDatosGenerales({ ...datosGenerales, tipoObra: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIPOS_OBRA.map(tipo => (
                            <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                        MODALIDAD DE CONTRATACIÓN *
                      </label>
                      <Select
                        value={datosGenerales.modalidadContratacion}
                        onValueChange={(value) => setDatosGenerales({ ...datosGenerales, modalidadContratacion: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MODALIDADES_CONTRATACION.map(mod => (
                            <SelectItem key={mod} value={mod}>{mod}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                        MODALIDAD DE OBRA *
                      </label>
                      <Select
                        value={datosGenerales.modalidadObra}
                        onValueChange={(value) => setDatosGenerales({ ...datosGenerales, modalidadObra: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MODALIDADES_OBRA.map(mod => (
                            <SelectItem key={mod} value={mod}>{mod}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                        BENEFICIARIOS ESTIMADOS *
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type="number"
                          value={datosGenerales.beneficiarios}
                          onChange={(e) => setDatosGenerales({ ...datosGenerales, beneficiarios: parseInt(e.target.value) || 0 })}
                          placeholder="0"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                        FECHA DE INICIO PROGRAMADA *
                      </label>
                      <Input
                        type="date"
                        value={datosGenerales.fechaInicio}
                        onChange={(e) => setDatosGenerales({ ...datosGenerales, fechaInicio: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                        FECHA DE TÉRMINO PROGRAMADA *
                      </label>
                      <Input
                        type="date"
                        value={datosGenerales.fechaTermino}
                        onChange={(e) => setDatosGenerales({ ...datosGenerales, fechaTermino: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={onVolver}>
                    CANCELAR
                  </Button>
                  <Button
                    onClick={handleGuardarDatosGenerales}
                    disabled={isSaving}
                    style={{ backgroundColor: '#84cc16' }}
                  >
                    {isSaving ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        GUARDANDO...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        GUARDAR CAMBIOS
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* TAB 2: Etapa del Ciclo + Evidencias (FUSIONADO) */}
        <TabsContent value="etapa-evidencias">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                  <TrendingUp className="w-5 h-5" />
                  ETAPA DEL CICLO Y EVIDENCIAS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Timeline de etapas */}
                <div className="relative">
                  <p className="text-sm text-gray-600 mb-4">
                    Selecciona la etapa actual de la obra. Las evidencias correspondientes se mostrarán debajo.
                  </p>
                  <div className="flex items-center justify-between mb-8">
                    {ETAPAS_INFO.map((etapa, index) => {
                      const isActive = etapa.id === etapaActual;
                      const etapaActualIndex = ETAPAS_INFO.findIndex(e => e.id === etapaActual);
                      const isPast = etapaActualIndex > index;
                      
                      return (
                        <div key={etapa.id} className="flex flex-col items-center flex-1 relative">
                          {/* Línea conectora - solo verde hasta la etapa actual */}
                          {index < ETAPAS_INFO.length - 1 && (
                            <div
                              className="absolute top-6 left-1/2 w-full h-1"
                              style={{
                                backgroundColor: isPast ? '#84cc16' : '#E0E0E0',
                                zIndex: 0,
                              }}
                            />
                          )}
                          
                          {/* Círculo de etapa */}
                          <button
                            onClick={() => handleCambiarEtapa(etapa.id)}
                            className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all hover:scale-110"
                            style={{
                              backgroundColor: isActive || isPast ? '#84cc16' : '#E0E0E0',
                              border: `3px solid ${isActive ? '#582672' : 'transparent'}`,
                            }}
                          >
                            {isPast || isActive ? (
                              <CheckCircle2 className="w-6 h-6 text-white" />
                            ) : (
                              <span className="text-white" style={{ fontWeight: 'bold' }}>
                                {index + 1}
                              </span>
                            )}
                          </button>
                          
                          {/* Nombre de etapa */}
                          <p
                            className="text-xs text-center"
                            style={{
                              fontWeight: isActive ? 'bold' : 'normal',
                              color: isActive ? '#582672' : '#374151',
                            }}
                          >
                            {etapa.nombre}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Información de la etapa actual */}
                {ETAPAS_INFO.map(etapa => {
                  if (etapa.id !== etapaActual) return null;
                  
                  return (
                    <Card key={etapa.id} className="border-2" style={{ borderColor: '#84cc16' }}>
                      <CardContent className="p-6">
                        <h3 className="text-lg mb-2" style={{ fontWeight: 'bold', color: '#582672' }}>
                          {etapa.nombre}
                        </h3>
                        <p className="text-sm text-gray-700 mb-4">
                          {etapa.descripcion}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}

                {/* Evidencias dinámicas por etapa */}
                <div>
                  <h3 className="text-base mb-4" style={{ fontWeight: 'bold', color: '#374151' }}>
                    MEDIOS DE VERIFICACIÓN PARA ESTA ETAPA
                  </h3>

                  <div className="space-y-4">
                    {evidenciasEtapaActual.map((evidencia) => {
                      const estatusInfo = getEstatusEvidenciaInfo(evidencia.estatus);
                      const EstatusIcon = estatusInfo.icon;

                      return (
                        <Card key={evidencia.id} className="border hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              {/* Icono de estado */}
                              <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: estatusInfo.bgColor }}
                              >
                                <EstatusIcon className="w-6 h-6" style={{ color: estatusInfo.color }} />
                              </div>

                              <div className="flex-1">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="text-sm" style={{ fontWeight: 'bold', color: '#374151' }}>
                                        {evidencia.nombre}
                                      </h4>
                                      {evidencia.obligatorio && (
                                        <Badge variant="outline" style={{ color: '#D32F2F', borderColor: '#D32F2F' }}>
                                          Obligatorio
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-600">{evidencia.descripcion}</p>
                                  </div>
                                  <Badge style={{ backgroundColor: estatusInfo.bgColor, color: estatusInfo.color }}>
                                    {estatusInfo.label}
                                  </Badge>
                                </div>

                                {/* Archivo subido */}
                                {evidencia.archivo && (
                                  <div className="bg-gray-50 p-3 rounded-lg mb-3">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-gray-500" />
                                        <div>
                                          <p className="text-sm" style={{ fontWeight: 'bold' }}>
                                            {evidencia.archivo.nombre}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {formatFileSize(evidencia.archivo.tamano)} • Subido el {new Date(evidencia.archivo.fechaCarga).toLocaleDateString('es-MX')}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm">
                                          <Eye className="w-4 h-4 mr-1" />
                                          Ver
                                        </Button>
                                        <Button variant="outline" size="sm">
                                          <Download className="w-4 h-4 mr-1" />
                                          Descargar
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Comentario CGPI si está rechazado */}
                                {evidencia.estatus === 'rechazado' && evidencia.comentarioCGPI && (
                                  <Alert className="border-red-300 bg-red-50 mb-3">
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                    <AlertTitle className="text-red-800">Comentario de CGPI</AlertTitle>
                                    <AlertDescription className="text-red-700">
                                      {evidencia.comentarioCGPI}
                                    </AlertDescription>
                                  </Alert>
                                )}

                                {/* Comentario del enlace */}
                                <div className="mb-3">
                                  <label className="block text-xs text-gray-600 mb-1">
                                    COMENTARIOS DEL ENLACE (OPCIONAL)
                                  </label>
                                  <Textarea
                                    value={evidencia.comentarioEnlace || ''}
                                    onChange={(e) => handleActualizarComentarioEvidencia(etapaActual, evidencia.id, e.target.value)}
                                    placeholder="Agrega comentarios sobre esta evidencia..."
                                    rows={2}
                                    className="text-sm"
                                  />
                                </div>

                                {/* Acciones */}
                                <div className="flex items-center gap-2">
                                  {evidencia.estatus === 'pendiente' || evidencia.estatus === 'rechazado' ? (
                                    <label>
                                      <input
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            handleSubirEvidencia(etapaActual, evidencia.id, file);
                                          }
                                        }}
                                      />
                                      <Button
                                        type="button"
                                        size="sm"
                                        style={{ backgroundColor: '#1976D2' }}
                                        onClick={(e) => {
                                          (e.currentTarget.previousElementSibling as HTMLInputElement)?.click();
                                        }}
                                      >
                                        <Upload className="w-4 h-4 mr-1" />
                                        {evidencia.estatus === 'rechazado' ? 'Resubir evidencia' : 'Subir evidencia'}
                                      </Button>
                                    </label>
                                  ) : (
                                    <label>
                                      <input
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            handleSubirEvidencia(etapaActual, evidencia.id, file);
                                          }
                                        }}
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                          (e.currentTarget.previousElementSibling as HTMLInputElement)?.click();
                                        }}
                                      >
                                        <Edit3 className="w-4 h-4 mr-1" />
                                        Reemplazar
                                      </Button>
                                    </label>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Alertas */}
                {evidenciasPendientes > 0 && (
                  <Alert className="border-orange-300 bg-orange-50">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <AlertTitle className="text-orange-800">Evidencias pendientes</AlertTitle>
                    <AlertDescription className="text-orange-700">
                      Faltan {evidenciasPendientes} evidencia(s) por subir para esta etapa.
                    </AlertDescription>
                  </Alert>
                )}

                {evidenciasRechazadas > 0 && (
                  <Alert className="border-red-300 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-800">Evidencias rechazadas</AlertTitle>
                    <AlertDescription className="text-red-700">
                      Tienes {evidenciasRechazadas} evidencia(s) rechazada(s) por la CGPI. 
                      Revisa los comentarios y sube las correcciones necesarias.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* TAB 3: Plan Financiero (solo en Ejecución) */}
        <TabsContent value="plan-financiero">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {etapaActual !== 'ejecucion' ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#F57C0020' }}>
                    <AlertCircle className="w-8 h-8" style={{ color: '#F57C00' }} />
                  </div>
                  <h3 className="text-xl mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                    Plan financiero no disponible
                  </h3>
                  <p className="text-sm text-gray-600">
                    El plan financiero y el avance se habilitan cuando la obra esté en etapa de Ejecución.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                    <Target className="w-5 h-5" />
                    PLAN FINANCIERO (META PROGRAMADA)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert className="border-blue-300 bg-blue-50">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-800">Información importante</AlertTitle>
                    <AlertDescription className="text-blue-700">
                      Una vez guardado, el plan financiero queda fijo (solo lectura) y no podrá ser modificado. 
                      Asegúrate de que la distribución mensual es correcta antes de guardar.
                    </AlertDescription>
                  </Alert>

                  {!planFinanciero.guardado ? (
                    <>
                      <div>
                        <label className="block text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                          DURACIÓN ESTIMADA (MESES) *
                        </label>
                        <Input
                          type="number"
                          min="1"
                          max="24"
                          value={planFinanciero.duracionMeses}
                          onChange={(e) => {
                            const meses = parseInt(e.target.value) || 1;
                            setPlanFinanciero({
                              ...planFinanciero,
                              duracionMeses: meses,
                              porcentajesPorMes: Array(meses).fill(Math.floor(100 / meses)),
                            });
                          }}
                          className="w-48"
                        />
                      </div>

                      <div>
                        <h4 className="text-sm mb-3" style={{ fontWeight: 'bold', color: '#374151' }}>
                          DISTRIBUCIÓN MENSUAL DE EROGACIÓN (%)
                        </h4>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                          {planFinanciero.porcentajesPorMes.map((porcentaje, index) => (
                            <div key={index}>
                              <label className="block text-xs text-gray-600 mb-1">Mes {index + 1}</label>
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                value={porcentaje}
                                onChange={(e) => {
                                  const nuevos = [...planFinanciero.porcentajesPorMes];
                                  nuevos[index] = parseFloat(e.target.value) || 0;
                                  setPlanFinanciero({ ...planFinanciero, porcentajesPorMes: nuevos });
                                }}
                              />
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm" style={{ fontWeight: 'bold' }}>TOTAL:</span>
                            <span
                              className="text-xl"
                              style={{
                                fontWeight: 'bold',
                                color: planFinanciero.porcentajesPorMes.reduce((sum, p) => sum + p, 0) === 100 ? '#388E3C' : '#D32F2F',
                              }}
                            >
                              {planFinanciero.porcentajesPorMes.reduce((sum, p) => sum + p, 0).toFixed(1)}%
                            </span>
                          </div>
                          {planFinanciero.porcentajesPorMes.reduce((sum, p) => sum + p, 0) !== 100 && (
                            <p className="text-xs text-red-600 mt-2">
                              El total debe sumar exactamente 100%
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-4 border-t">
                        <Button
                          onClick={handleGuardarPlanFinanciero}
                          style={{ backgroundColor: '#84cc16' }}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          GUARDAR PLAN FINANCIERO
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div>
                      <Alert className="border-green-300 bg-green-50 mb-6">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-800">Plan financiero guardado</AlertTitle>
                        <AlertDescription className="text-green-700">
                          El plan está registrado y ya no puede ser modificado.
                        </AlertDescription>
                      </Alert>

                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {planFinanciero.porcentajesPorMes.map((porcentaje, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                            <p className="text-xs text-gray-600 mb-1">Mes {index + 1}</p>
                            <p className="text-lg" style={{ fontWeight: 'bold', color: '#1976D2' }}>
                              {porcentaje}%
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>
        </TabsContent>

        {/* TAB 4: Avance Real (solo en Ejecución) */}
        <TabsContent value="avance-real">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {etapaActual !== 'ejecucion' ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#F57C0020' }}>
                    <AlertCircle className="w-8 h-8" style={{ color: '#F57C00' }} />
                  </div>
                  <h3 className="text-xl mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                    Avance real no disponible
                  </h3>
                  <p className="text-sm text-gray-600">
                    El plan financiero y el avance se habilitan cuando la obra esté en etapa de Ejecución.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                    <TrendingUp className="w-5 h-5" />
                    AVANCE REAL (SEGUIMIENTO MENSUAL)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Capturar nuevo avance */}
                  <Card className="border-2" style={{ borderColor: '#1976D2' }}>
                    <CardContent className="p-6">
                      <h4 className="text-base mb-4" style={{ fontWeight: 'bold', color: '#374151' }}>
                        REGISTRAR AVANCE MENSUAL
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                            MES *
                          </label>
                          <Select
                            value={nuevoAvance.mes.toString()}
                            onValueChange={(value) => setNuevoAvance({ ...nuevoAvance, mes: parseInt(value) })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: planFinanciero.duracionMeses }, (_, i) => i + 1).map(mes => (
                                <SelectItem key={mes} value={mes.toString()}>Mes {mes}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                            % REAL DEL MES *
                          </label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={nuevoAvance.porcentajeReal}
                            onChange={(e) => setNuevoAvance({ ...nuevoAvance, porcentajeReal: parseFloat(e.target.value) || 0 })}
                            placeholder="0.0"
                          />
                        </div>

                        <div className="md:col-span-1">
                          <label className="block text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                            ACCIÓN
                          </label>
                          <Button
                            onClick={handleGuardarAvanceMensual}
                            className="w-full"
                            style={{ backgroundColor: '#84cc16' }}
                          >
                            <Save className="w-4 h-4 mr-2" />
                            GUARDAR
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                          COMENTARIO (OPCIONAL)
                        </label>
                        <Textarea
                          value={nuevoAvance.comentario}
                          onChange={(e) => setNuevoAvance({ ...nuevoAvance, comentario: e.target.value })}
                          placeholder="Comentarios sobre el avance del mes..."
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Historial de avances */}
                  <div>
                    <h4 className="text-base mb-4" style={{ fontWeight: 'bold', color: '#374151' }}>
                      HISTORIAL DE AVANCES REGISTRADOS
                    </h4>

                    <div className="space-y-3">
                      {avancesMensuales.map((avance, index) => {
                        const metaMes = planFinanciero.porcentajesPorMes[avance.mes - 1] || 0;
                        const iaopMes = metaMes > 0 ? (avance.porcentajeReal / metaMes) * 100 : 0;
                        const semaforoMes = getSemaforoFromIAOP(iaopMes);

                        return (
                          <Card key={index} className="border">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <Badge style={{ backgroundColor: '#1976D2', color: 'white' }}>
                                      Mes {avance.mes}
                                    </Badge>
                                    <div
                                      className="w-6 h-6 rounded-full"
                                      style={{ backgroundColor: getSemaforoColor(semaforoMes) }}
                                      title={`IAOP: ${iaopMes.toFixed(1)}%`}
                                    />
                                  </div>

                                  <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                      <p className="text-xs text-gray-600">% Programado</p>
                                      <p style={{ fontWeight: 'bold', color: '#374151' }}>{metaMes}%</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-600">% Real</p>
                                      <p style={{ fontWeight: 'bold', color: '#7B1FA2' }}>{avance.porcentajeReal}%</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-600">IAOP</p>
                                      <p style={{ fontWeight: 'bold', color: getSemaforoColor(semaforoMes) }}>
                                        {iaopMes.toFixed(1)}%
                                      </p>
                                    </div>
                                  </div>

                                  {avance.comentario && (
                                    <p className="text-xs text-gray-600 mt-2 italic">
                                      <MessageSquare className="w-3 h-3 inline mr-1" />
                                      {avance.comentario}
                                    </p>
                                  )}

                                  <p className="text-xs text-gray-500 mt-2">
                                    Registrado el {new Date(avance.fechaCaptura).toLocaleDateString('es-MX')}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}

                      {avancesMensuales.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>No hay avances registrados aún</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </TabsContent>

        {/* TAB 5: Observaciones CGPI */}
        <TabsContent value="observaciones">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                  <MessageSquare className="w-5 h-5" />
                  OBSERVACIONES DE LA CGPI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-blue-300 bg-blue-50">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-700">
                    Las observaciones son comentarios de seguimiento realizados por la Coordinación General de Planeación e Inversión.
                    Esta sección es de solo lectura para el usuario Enlace.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  {observacionesCGPI.map((obs) => {
                    const tipoConfig = {
                      info: { color: '#1976D2', bgColor: '#E3F2FD', icon: Info, label: 'INFORMACIÓN' },
                      alerta: { color: '#F57C00', bgColor: '#FFF3E0', icon: AlertCircle, label: 'ALERTA' },
                      critico: { color: '#D32F2F', bgColor: '#FFEBEE', icon: AlertTriangle, label: 'CRÍTICO' },
                    };
                    const config = tipoConfig[obs.tipo];
                    const IconComponent = config.icon;

                    return (
                      <Card key={obs.id} className="border" style={{ borderColor: config.color }}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: config.bgColor }}
                            >
                              <IconComponent className="w-5 h-5" style={{ color: config.color }} />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge style={{ backgroundColor: config.bgColor, color: config.color }}>
                                  {config.label}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {new Date(obs.fecha).toLocaleDateString('es-MX', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}
                                </span>
                              </div>

                              <p className="text-sm text-gray-700 mb-2">{obs.comentario}</p>

                              <p className="text-xs text-gray-500">
                                Por: <span style={{ fontWeight: 'bold' }}>{obs.usuario}</span>
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}

                  {observacionesCGPI.length === 0 && (
                    <div className="text-center py-12">
                      <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500">No hay observaciones registradas</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
