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
  estatus: 'pendiente' | 'subido' | 'aprobado' | 'rechazado';
  comentarioCGPI?: string;
  obligatorio: boolean;
}

interface EtapaInfo {
  id: string;
  nombre: string;
  descripcion: string;
  evidencias: Evidencia[];
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

const MODALIDADES = [
  'Licitación Pública',
  'Invitación a cuando menos tres personas',
  'Adjudicación Directa',
  'Obra por administración',
];

const FUENTES_FINANCIAMIENTO = [
  'Recursos Estatales',
  'Recursos Federales FAIS',
  'Recursos Federales FAFEF',
  'Recursos Federales FORTAMUN',
  'Recursos Propios',
  'Crédito',
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
    modalidad: 'Licitación Pública',
    fuentesFinanciamiento: ['Recursos Estatales'],
    montoTotal: obra.montoTotal,
    beneficiarios: 1500,
    fechaInicio: '2025-03-15',
    fechaTermino: '2025-12-15',
  });

  // Estado para meta financiera
  const [metaFinanciera, setMetaFinanciera] = useState({
    metaProgramada: obra.metaProgramada,
  });

  // Estado para etapa
  const [etapaActual, setEtapaActual] = useState<string>(obra.etapa);

  // Estado para avance financiero
  const [avanceFinanciero, setAvanceFinanciero] = useState({
    avanceReal: obra.avanceFinanciero,
    fechaCaptura: new Date().toISOString().split('T')[0],
    observaciones: '',
  });

  // Estado para evidencias
  const [evidenciasPorEtapa, setEvidenciasPorEtapa] = useState<Record<string, Evidencia[]>>(
    ETAPAS_INFO.reduce((acc, etapa) => {
      acc[etapa.id] = etapa.evidencias;
      return acc;
    }, {} as Record<string, Evidencia[]>)
  );

  // Calcular IAOP
  const calcularIAOP = () => {
    if (metaFinanciera.metaProgramada === 0) return 0;
    return (avanceFinanciero.avanceReal / metaFinanciera.metaProgramada) * 100;
  };

  const iaopCalculado = calcularIAOP();

  const getSemaforoFromIAOP = (iaop: number): 'verde' | 'amarillo' | 'rojo' => {
    if (iaop >= 90) return 'verde';
    if (iaop >= 70) return 'amarillo';
    return 'rojo';
  };

  const getSemaforoColor = (semaforo: 'verde' | 'amarillo' | 'rojo'): string => {
    const colors = {
      verde: '#388E3C',
      amarillo: '#F57C00',
      rojo: '#D32F2F',
    };
    return colors[semaforo];
  };

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

  const handleGuardarMetaFinanciera = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Meta financiera registrada correctamente');
    }, 1000);
  };

  const handleCambiarEtapa = (nuevaEtapa: string) => {
    setEtapaActual(nuevaEtapa);
    toast.success(`Etapa actualizada a: ${ETAPAS_INFO.find(e => e.id === nuevaEtapa)?.nombre}`);
  };

  const handleSubirEvidencia = (etapaId: string, evidenciaId: string, file: File) => {
    // Validar que sea PDF, JPG o PNG
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

  const handleEliminarEvidencia = (etapaId: string, evidenciaId: string) => {
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar esta evidencia?');
    if (confirmar) {
      setEvidenciasPorEtapa({
        ...evidenciasPorEtapa,
        [etapaId]: evidenciasPorEtapa[etapaId].map(ev => {
          if (ev.id === evidenciaId) {
            return {
              ...ev,
              archivo: undefined,
              estatus: 'pendiente' as const,
              comentarioCGPI: undefined,
            };
          }
          return ev;
        }),
      });
      toast.success('Evidencia eliminada correctamente');
    }
  };

  const handleActualizarAvance = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Avance financiero actualizado correctamente');
    }, 1000);
  };

  const getEstatusEvidenciaInfo = (estatus: string) => {
    switch (estatus) {
      case 'pendiente':
        return {
          label: 'Pendiente',
          color: '#9E9E9E',
          bgColor: '#F5F5F5',
          icon: Clock,
        };
      case 'subido':
        return {
          label: 'Subido',
          color: '#1976D2',
          bgColor: '#E3F2FD',
          icon: Upload,
        };
      case 'aprobado':
        return {
          label: 'Aprobado',
          color: '#388E3C',
          bgColor: '#E8F5E9',
          icon: CheckCircle2,
        };
      case 'rechazado':
        return {
          label: 'Rechazado',
          color: '#D32F2F',
          bgColor: '#FFEBEE',
          icon: XCircle,
        };
      default:
        return {
          label: 'Pendiente',
          color: '#9E9E9E',
          bgColor: '#F5F5F5',
          icon: Clock,
        };
    }
  };

  // Calcular completitud de datos generales
  const camposCompletos = [
    datosGenerales.municipio,
    datosGenerales.localidad,
    datosGenerales.tipoObra,
    datosGenerales.modalidad,
    datosGenerales.fuentesFinanciamiento.length > 0,
    datosGenerales.montoTotal > 0,
    datosGenerales.beneficiarios > 0,
    datosGenerales.fechaInicio,
    datosGenerales.fechaTermino,
  ].filter(Boolean).length;

  const totalCampos = 9;
  const porcentajeCompletitud = (camposCompletos / totalCampos) * 100;

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
                  <Badge
                    style={{
                      backgroundColor: `${getSemaforoColor(getSemaforoFromIAOP(iaopCalculado))}20`,
                      color: getSemaforoColor(getSemaforoFromIAOP(iaopCalculado)),
                      border: `1px solid ${getSemaforoColor(getSemaforoFromIAOP(iaopCalculado))}`,
                    }}
                  >
                    IAOP: {iaopCalculado.toFixed(1)}%
                  </Badge>
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

              {/* Semáforo IAOP grande */}
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
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs principales */}
      <Tabs value={tabActiva} onValueChange={setTabActiva}>
        <TabsList className="grid w-full grid-cols-6 mb-6">
          <TabsTrigger value="datos-generales">Datos Generales</TabsTrigger>
          <TabsTrigger value="meta-financiera">Meta Financiera</TabsTrigger>
          <TabsTrigger value="etapa-ciclo">Etapa del Ciclo</TabsTrigger>
          <TabsTrigger value="evidencias">Evidencias</TabsTrigger>
          <TabsTrigger value="avance-real">Avance Real</TabsTrigger>
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

                {/* Datos automáticos desde SIIF */}
                <div>
                  <h3 className="text-base mb-4" style={{ fontWeight: 'bold', color: '#374151' }}>
                    INFORMACIÓN DESDE SIIF (SOLO LECTURA)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">FOLIO SIIF</label>
                      <Input value={obra.folioSIIF} disabled />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">NOMBRE DE LA OBRA</label>
                      <Input value={obra.nombreObra} disabled />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">UNIDAD RESPONSABLE</label>
                      <Input value="Secretaría de Obras Públicas" disabled />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">CLASIFICACIÓN PROGRAMÁTICA</label>
                      <Input value="K036 - Infraestructura Pública" disabled />
                    </div>
                  </div>
                </div>

                {/* Datos capturados por el enlace */}
                <div>
                  <h3 className="text-base mb-4" style={{ fontWeight: 'bold', color: '#374151' }}>
                    INFORMACIÓN CAPTURADA POR EL ENLACE
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
                        value={datosGenerales.modalidad}
                        onValueChange={(value) => setDatosGenerales({ ...datosGenerales, modalidad: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MODALIDADES.map(mod => (
                            <SelectItem key={mod} value={mod}>{mod}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                        MONTO TOTAL DE INVERSIÓN *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type="number"
                          value={datosGenerales.montoTotal}
                          onChange={(e) => setDatosGenerales({ ...datosGenerales, montoTotal: parseFloat(e.target.value) || 0 })}
                          placeholder="0.00"
                          className="pl-10"
                        />
                      </div>
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
                  <Button
                    variant="outline"
                    onClick={onVolver}
                  >
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

        {/* TAB 2: Meta Financiera */}
        <TabsContent value="meta-financiera">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                  <Target className="w-5 h-5" />
                  META DE AVANCE FINANCIERO
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-blue-300 bg-blue-50">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800">Artículo 40 - Meta Programada</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    La meta programada representa el porcentaje de avance financiero que se espera alcanzar en el periodo evaluado.
                    Este valor es fundamental para calcular el Índice de Avance de Obra Pública (IAOP).
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Input de meta */}
                  <Card className="border-2" style={{ borderColor: '#1976D2' }}>
                    <CardContent className="p-6">
                      <h3 className="text-base mb-4" style={{ fontWeight: 'bold', color: '#374151' }}>
                        REGISTRAR META PROGRAMADA
                      </h3>
                      <div>
                        <label className="block text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                          PORCENTAJE DE META (0-100%) *
                        </label>
                        <div className="relative">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={metaFinanciera.metaProgramada}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value) || 0;
                              if (value >= 0 && value <= 100) {
                                setMetaFinanciera({ ...metaFinanciera, metaProgramada: value });
                              }
                            }}
                            placeholder="0.0"
                            className="pr-8"
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            %
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Ingresa el porcentaje de avance financiero programado para este periodo
                        </p>
                      </div>

                      <Button
                        onClick={handleGuardarMetaFinanciera}
                        disabled={isSaving}
                        className="w-full mt-4"
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
                            REGISTRAR META
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Card comparativa */}
                  <Card className="border-2" style={{ borderColor: '#388E3C' }}>
                    <CardContent className="p-6">
                      <h3 className="text-base mb-4" style={{ fontWeight: 'bold', color: '#374151' }}>
                        COMPARATIVA META VS AVANCE
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-gray-600">Meta programada:</p>
                            <span className="text-lg" style={{ fontWeight: 'bold', color: '#1976D2' }}>
                              {metaFinanciera.metaProgramada.toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={metaFinanciera.metaProgramada} className="h-2" />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-gray-600">Avance financiero real:</p>
                            <span className="text-lg" style={{ fontWeight: 'bold', color: '#7B1FA2' }}>
                              {avanceFinanciero.avanceReal.toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={avanceFinanciero.avanceReal} className="h-2" />
                        </div>

                        <div className="pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <p className="text-sm" style={{ fontWeight: 'bold', color: '#374151' }}>
                              Diferencia:
                            </p>
                            <span
                              className="text-lg"
                              style={{
                                fontWeight: 'bold',
                                color: (avanceFinanciero.avanceReal - metaFinanciera.metaProgramada) >= 0 ? '#388E3C' : '#D32F2F'
                              }}
                            >
                              {(avanceFinanciero.avanceReal - metaFinanciera.metaProgramada) >= 0 ? '+' : ''}
                              {(avanceFinanciero.avanceReal - metaFinanciera.metaProgramada).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* TAB 3: Etapa del Ciclo de Vida */}
        <TabsContent value="etapa-ciclo">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                  <TrendingUp className="w-5 h-5" />
                  ETAPA DEL CICLO DE VIDA DE LA OBRA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Timeline de etapas */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-8">
                    {ETAPAS_INFO.map((etapa, index) => {
                      const isActive = etapa.id === etapaActual;
                      const isPast = ETAPAS_INFO.findIndex(e => e.id === etapaActual) > index;
                      
                      return (
                        <div key={etapa.id} className="flex flex-col items-center flex-1 relative">
                          {/* Línea conectora */}
                          {index < ETAPAS_INFO.length - 1 && (
                            <div
                              className="absolute top-6 left-1/2 w-full h-1"
                              style={{
                                backgroundColor: isPast || isActive ? '#84cc16' : '#E0E0E0',
                                zIndex: 0,
                              }}
                            />
                          )}
                          
                          {/* Círculo de etapa */}
                          <button
                            onClick={() => handleCambiarEtapa(etapa.id)}
                            className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all hover:scale-110"
                            style={{
                              backgroundColor: isActive ? '#84cc16' : isPast ? '#84cc16' : '#E0E0E0',
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

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <h4 className="text-sm mb-2" style={{ fontWeight: 'bold', color: '#F57C00' }}>
                            MEDIOS DE VERIFICACIÓN REQUERIDOS PARA ESTA ETAPA:
                          </h4>
                          <ul className="space-y-1">
                            {etapa.evidencias.map(ev => (
                              <li key={ev.id} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-yellow-600 mt-0.5">•</span>
                                <span>
                                  {ev.nombre}
                                  {ev.obligatorio && (
                                    <span className="text-red-600 ml-1">*</span>
                                  )}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {/* Alertas si faltan evidencias */}
                {evidenciasPendientes > 0 && (
                  <Alert className="border-orange-300 bg-orange-50">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <AlertTitle className="text-orange-800">Evidencias pendientes</AlertTitle>
                    <AlertDescription className="text-orange-700">
                      Faltan {evidenciasPendientes} evidencia(s) por subir para esta etapa. 
                      Dirígete a la pestaña "Evidencias" para completar la información.
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

        {/* TAB 4: Evidencias */}
        <TabsContent value="evidencias">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="space-y-4">
              {ETAPAS_INFO.map((etapa) => {
                const evidencias = evidenciasPorEtapa[etapa.id] || [];
                
                return (
                  <Card key={etapa.id}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                        <FileText className="w-5 h-5" />
                        {etapa.nombre}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {etapa.descripcion}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {evidencias.map((evidencia) => {
                        const estatusInfo = getEstatusEvidenciaInfo(evidencia.estatus);
                        const EstatusIcon = estatusInfo.icon;

                        return (
                          <Card
                            key={evidencia.id}
                            className="border-2"
                            style={{
                              borderColor: evidencia.archivo ? '#84cc16' : '#E0E0E0',
                            }}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="text-sm" style={{ fontWeight: 'bold', color: '#374151' }}>
                                      {evidencia.nombre}
                                      {evidencia.obligatorio && (
                                        <span className="text-red-600 ml-1">*</span>
                                      )}
                                    </h4>
                                  </div>
                                  <p className="text-xs text-gray-600 mb-2">
                                    {evidencia.descripcion}
                                  </p>
                                  <Badge
                                    className="flex items-center gap-1 w-fit"
                                    style={{
                                      backgroundColor: estatusInfo.bgColor,
                                      color: estatusInfo.color,
                                      border: `1px solid ${estatusInfo.color}`,
                                    }}
                                  >
                                    <EstatusIcon className="w-3 h-3" />
                                    {estatusInfo.label}
                                  </Badge>
                                </div>
                              </div>

                              {/* Si tiene archivo */}
                              {evidencia.archivo ? (
                                <div className="border-2 rounded-lg p-3 bg-green-50" style={{ borderColor: '#84cc16' }}>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#84cc1620' }}>
                                        <FileText className="w-5 h-5" style={{ color: '#84cc16' }} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm truncate" style={{ fontWeight: 'bold', color: '#374151' }}>
                                          {evidencia.archivo.nombre}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                          {formatFileSize(evidencia.archivo.tamano)} • Cargado el {new Date(evidencia.archivo.fechaCarga).toLocaleDateString('es-MX')}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        title="Ver archivo"
                                        className="hover:bg-blue-50"
                                      >
                                        <Eye className="w-4 h-4" style={{ color: '#1976D2' }} />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        title="Reemplazar archivo"
                                        className="hover:bg-orange-50"
                                        onClick={() => {
                                          const input = document.createElement('input');
                                          input.type = 'file';
                                          input.accept = '.pdf,.jpg,.jpeg,.png';
                                          input.onchange = (e) => {
                                            const file = (e.target as HTMLInputElement).files?.[0];
                                            if (file) {
                                              handleSubirEvidencia(etapa.id, evidencia.id, file);
                                            }
                                          };
                                          input.click();
                                        }}
                                      >
                                        <Edit3 className="w-4 h-4" style={{ color: '#F57C00' }} />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        title="Eliminar archivo"
                                        className="hover:bg-red-50"
                                        onClick={() => handleEliminarEvidencia(etapa.id, evidencia.id)}
                                      >
                                        <Trash2 className="w-4 h-4" style={{ color: '#D32F2F' }} />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                // Si no tiene archivo - mostrar área de subida
                                <div className="border-2 border-dashed rounded-lg p-6 bg-gray-50 hover:bg-purple-50 hover:border-purple-400 transition-all">
                                  <div className="flex flex-col items-center justify-center">
                                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                    <p className="text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                                      Arrastra tu archivo aquí o haz clic para seleccionar
                                    </p>
                                    <p className="text-xs text-gray-500 mb-3">
                                      Formato permitido: PDF, JPG, PNG • Tamaño máximo: 15 MB
                                    </p>
                                    <input
                                      type="file"
                                      accept=".pdf,.jpg,.jpeg,.png"
                                      id={`file-upload-${evidencia.id}`}
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          handleSubirEvidencia(etapa.id, evidencia.id, file);
                                        }
                                      }}
                                    />
                                    <Button
                                      onClick={() => document.getElementById(`file-upload-${evidencia.id}`)?.click()}
                                      size="sm"
                                      style={{ backgroundColor: '#84cc16' }}
                                    >
                                      <Upload className="w-4 h-4 mr-2" />
                                      SUBIR ARCHIVO
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {/* Comentario de la CGPI si existe */}
                              {evidencia.comentarioCGPI && (
                                <Alert className="border-red-300 bg-red-50 mt-3">
                                  <MessageSquare className="h-4 w-4 text-red-600" />
                                  <AlertTitle className="text-red-800">Comentario de la CGPI</AlertTitle>
                                  <AlertDescription className="text-red-700">
                                    {evidencia.comentarioCGPI}
                                  </AlertDescription>
                                </Alert>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        </TabsContent>

        {/* TAB 5: Avance Financiero Real */}
        <TabsContent value="avance-real">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                  <DollarSign className="w-5 h-5" />
                  REGISTRO DEL AVANCE FINANCIERO REAL
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Formulario de captura */}
                  <Card className="border-2" style={{ borderColor: '#1976D2' }}>
                    <CardContent className="p-6">
                      <h3 className="text-base mb-4" style={{ fontWeight: 'bold', color: '#374151' }}>
                        ACTUALIZAR AVANCE FINANCIERO
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                            AVANCE FINANCIERO REAL (%) *
                          </label>
                          <div className="relative">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              value={avanceFinanciero.avanceReal}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0;
                                if (value >= 0 && value <= 100) {
                                  setAvanceFinanciero({ ...avanceFinanciero, avanceReal: value });
                                }
                              }}
                              placeholder="0.0"
                              className="pr-8"
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                              %
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                            FECHA DE CAPTURA
                          </label>
                          <Input
                            type="date"
                            value={avanceFinanciero.fechaCaptura}
                            onChange={(e) => setAvanceFinanciero({ ...avanceFinanciero, fechaCaptura: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="block text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                            OBSERVACIONES
                          </label>
                          <Textarea
                            value={avanceFinanciero.observaciones}
                            onChange={(e) => setAvanceFinanciero({ ...avanceFinanciero, observaciones: e.target.value })}
                            placeholder="Agrega observaciones sobre el avance..."
                            rows={4}
                          />
                        </div>

                        <Button
                          onClick={handleActualizarAvance}
                          disabled={isSaving}
                          className="w-full"
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
                              ACTUALIZAR AVANCE
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Gráfica y cálculo IAOP */}
                  <Card className="border-2" style={{ borderColor: getSemaforoColor(getSemaforoFromIAOP(iaopCalculado)) }}>
                    <CardContent className="p-6">
                      <h3 className="text-base mb-4" style={{ fontWeight: 'bold', color: '#374151' }}>
                        ÍNDICE DE AVANCE DE OBRA PÚBLICA (IAOP)
                      </h3>
                      
                      {/* Indicador circular */}
                      <div className="flex flex-col items-center mb-6">
                        <div className="relative w-40 h-40">
                          <svg className="w-40 h-40 transform -rotate-90">
                            <circle
                              cx="80"
                              cy="80"
                              r="70"
                              fill="none"
                              stroke="#E0E0E0"
                              strokeWidth="12"
                            />
                            <circle
                              cx="80"
                              cy="80"
                              r="70"
                              fill="none"
                              stroke={getSemaforoColor(getSemaforoFromIAOP(iaopCalculado))}
                              strokeWidth="12"
                              strokeDasharray={`${2 * Math.PI * 70}`}
                              strokeDashoffset={`${2 * Math.PI * 70 * (1 - Math.min(iaopCalculado, 100) / 100)}`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl" style={{ fontWeight: 'bold', color: getSemaforoColor(getSemaforoFromIAOP(iaopCalculado)) }}>
                              {iaopCalculado.toFixed(1)}
                            </span>
                            <span className="text-sm text-gray-600">IAOP</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-4">
                          <div
                            className="w-8 h-8 rounded-full"
                            style={{ backgroundColor: getSemaforoColor(getSemaforoFromIAOP(iaopCalculado)) }}
                          />
                          <span className="text-sm" style={{ fontWeight: 'bold' }}>
                            {getSemaforoFromIAOP(iaopCalculado) === 'verde' && 'Alto desempeño'}
                            {getSemaforoFromIAOP(iaopCalculado) === 'amarillo' && 'Desempeño moderado'}
                            {getSemaforoFromIAOP(iaopCalculado) === 'rojo' && 'Bajo desempeño'}
                          </span>
                        </div>
                      </div>

                      {/* Fórmula */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-xs text-gray-600 mb-2">Fórmula de cálculo:</p>
                        <p className="text-sm" style={{ fontWeight: 'bold', color: '#374151' }}>
                          IAOP = (Avance Real / Meta Programada) × 100
                        </p>
                        <p className="text-xs text-gray-600 mt-2">
                          = ({avanceFinanciero.avanceReal.toFixed(1)}% / {metaFinanciera.metaProgramada.toFixed(1)}%) × 100
                        </p>
                      </div>

                      {/* Semáforo explicado */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#388E3C' }} />
                          <span className="text-gray-700">Verde: IAOP ≥ 90%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#F57C00' }} />
                          <span className="text-gray-700">Amarillo: 70% ≤ IAOP &lt; 90%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#D32F2F' }} />
                          <span className="text-gray-700">Rojo: IAOP &lt; 70%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* TAB 6: Observaciones CGPI */}
        <TabsContent value="observaciones">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                  <MessageSquare className="w-5 h-5" />
                  OBSERVACIONES Y VALIDACIONES DE LA CGPI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Resumen de observaciones */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="border-2" style={{ borderColor: '#388E3C' }}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-8 h-8" style={{ color: '#388E3C' }} />
                        <div>
                          <p className="text-2xl" style={{ fontWeight: 'bold', color: '#388E3C' }}>
                            {Object.values(evidenciasPorEtapa).flat().filter(e => e.estatus === 'aprobado').length}
                          </p>
                          <p className="text-xs text-gray-600">Aprobadas</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2" style={{ borderColor: '#1976D2' }}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Clock className="w-8 h-8" style={{ color: '#1976D2' }} />
                        <div>
                          <p className="text-2xl" style={{ fontWeight: 'bold', color: '#1976D2' }}>
                            {Object.values(evidenciasPorEtapa).flat().filter(e => e.estatus === 'subido').length}
                          </p>
                          <p className="text-xs text-gray-600">En revisión</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2" style={{ borderColor: '#D32F2F' }}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <XCircle className="w-8 h-8" style={{ color: '#D32F2F' }} />
                        <div>
                          <p className="text-2xl" style={{ fontWeight: 'bold', color: '#D32F2F' }}>
                            {Object.values(evidenciasPorEtapa).flat().filter(e => e.estatus === 'rechazado').length}
                          </p>
                          <p className="text-xs text-gray-600">Rechazadas</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Listado de observaciones por evidencia */}
                <div className="space-y-3">
                  {Object.entries(evidenciasPorEtapa).map(([etapaId, evidencias]) => {
                    const etapaInfo = ETAPAS_INFO.find(e => e.id === etapaId);
                    const evidenciasConComentarios = evidencias.filter(e => e.comentarioCGPI || e.estatus === 'rechazado' || e.estatus === 'aprobado');
                    
                    if (evidenciasConComentarios.length === 0) return null;

                    return (
                      <Card key={etapaId}>
                        <CardHeader>
                          <CardTitle className="text-base" style={{ color: '#374151' }}>
                            {etapaInfo?.nombre}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {evidenciasConComentarios.map(evidencia => {
                            const estatusInfo = getEstatusEvidenciaInfo(evidencia.estatus);
                            const EstatusIcon = estatusInfo.icon;

                            return (
                              <div
                                key={evidencia.id}
                                className="border rounded-lg p-4"
                                style={{
                                  borderColor: estatusInfo.color,
                                  backgroundColor: `${estatusInfo.color}10`,
                                }}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <p className="text-sm mb-1" style={{ fontWeight: 'bold', color: '#374151' }}>
                                      {evidencia.nombre}
                                    </p>
                                    <Badge
                                      className="flex items-center gap-1 w-fit"
                                      style={{
                                        backgroundColor: estatusInfo.bgColor,
                                        color: estatusInfo.color,
                                        border: `1px solid ${estatusInfo.color}`,
                                      }}
                                    >
                                      <EstatusIcon className="w-3 h-3" />
                                      {estatusInfo.label}
                                    </Badge>
                                  </div>
                                </div>

                                {evidencia.comentarioCGPI && (
                                  <div className="mt-3 p-3 bg-white rounded border" style={{ borderColor: estatusInfo.color }}>
                                    <p className="text-xs text-gray-600 mb-1" style={{ fontWeight: 'bold' }}>
                                      Comentario de la CGPI:
                                    </p>
                                    <p className="text-sm text-gray-700">
                                      {evidencia.comentarioCGPI}
                                    </p>
                                  </div>
                                )}

                                {evidencia.estatus === 'rechazado' && (
                                  <Button
                                    size="sm"
                                    className="mt-3"
                                    style={{ backgroundColor: '#F57C00' }}
                                    onClick={() => {
                                      setTabActiva('evidencias');
                                    }}
                                  >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Subir corrección
                                  </Button>
                                )}
                              </div>
                            );
                          })}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Estado vacío si no hay observaciones */}
                {Object.values(evidenciasPorEtapa).flat().filter(e => e.comentarioCGPI || e.estatus !== 'pendiente').length === 0 && (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No hay observaciones de la CGPI aún</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Las observaciones aparecerán aquí cuando la CGPI revise tus evidencias
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
