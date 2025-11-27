import { useState } from 'react';
import {
  ArrowLeft,
  Save,
  FileText,
  AlertCircle,
  CheckCircle2,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Eye,
  Check,
  X,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  Clock,
  Upload,
  Download,
  XCircle,
  Send,
  Plus,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { motion, AnimatePresence } from 'motion/react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from './ui/alert';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from './ui/tabs';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

interface ObraPublica {
  id: string;
  folioSIIF: string;
  nombreObra: string;
  dependencia: string;
  municipio: string;
  tipoObra: string;
  etapa: string;
  semaforoIAOP: 'verde' | 'amarillo' | 'rojo';
  iaop: number;
  estadoValidacion: 'pendiente' | 'en_revision' | 'validado' | 'rechazado';
  situacionEvidencia: string;
  montoTotal: number;
  avanceFinanciero: number;
  metaProgramada: number;
  ultimaActualizacion: string;
}

interface AdminObraPublicaDetailViewProps {
  obra: ObraPublica;
  onVolver: () => void;
  onGuardar: (obra: ObraPublica) => void;
}

type EstatusEvidencia = 'pendiente' | 'subido' | 'aprobado' | 'rechazado';

interface Evidencia {
  id: string;
  nombre: string;
  descripcion: string;
  archivo?: {
    nombre: string;
    tamano: number;
    fechaCarga: string;
  };
  estatus: EstatusEvidencia;
  comentarioCGPI?: string;
  obligatorio: boolean;
}

interface Observacion {
  id: string;
  categoria: 'datos_generales' | 'etapas' | 'evidencias' | 'avance_financiero';
  titulo: string;
  descripcion: string;
  fechaCreacion: string;
  estatus: 'abierta' | 'atendida' | 'cerrada';
  respuestaDependencia?: string;
}

const ETAPAS_INFO = [
  {
    id: 'planeacion',
    nombre: 'Planeación',
    evidencias: [
      {
        id: 'ev-plan-1',
        nombre: 'PAOPS / Mención en documento oficial',
        descripcion: 'Programa Anual de Obras Públicas y Servicios',
        obligatorio: true,
        estatus: 'subido' as EstatusEvidencia,
        archivo: {
          nombre: 'paops_2025.pdf',
          tamano: 1234567,
          fechaCarga: '2025-11-20',
        },
      },
      {
        id: 'ev-plan-2',
        nombre: 'Proyecto ejecutivo',
        descripcion: 'Documento técnico que define las características de la obra',
        obligatorio: true,
        estatus: 'aprobado' as EstatusEvidencia,
        archivo: {
          nombre: 'proyecto_ejecutivo.pdf',
          tamano: 5234567,
          fechaCarga: '2025-11-18',
        },
      },
      {
        id: 'ev-plan-3',
        nombre: 'Estimación de costos / Presupuesto base',
        descripcion: 'Análisis de costos unitarios y presupuesto estimado',
        obligatorio: true,
        estatus: 'rechazado' as EstatusEvidencia,
        archivo: {
          nombre: 'presupuesto_base.xlsx',
          tamano: 456789,
          fechaCarga: '2025-11-15',
        },
        comentarioCGPI: 'Los costos unitarios no están actualizados según el tabulador vigente. Favor de revisar y actualizar.',
      },
    ],
  },
  {
    id: 'gestion',
    nombre: 'Gestión',
    evidencias: [
      {
        id: 'ev-gest-1',
        nombre: 'Permisos y licencias',
        descripcion: 'Permisos de construcción, uso de suelo, impacto ambiental',
        obligatorio: true,
        estatus: 'pendiente' as EstatusEvidencia,
      },
      {
        id: 'ev-gest-2',
        nombre: 'Oficios de autorización',
        descripcion: 'Oficios de autorización para ejecutar la obra',
        obligatorio: true,
        estatus: 'pendiente' as EstatusEvidencia,
      },
    ],
  },
  {
    id: 'contratacion',
    nombre: 'Contratación',
    evidencias: [
      {
        id: 'ev-cont-1',
        nombre: 'Convocatoria o invitación',
        descripcion: 'Documento de convocatoria pública o invitación',
        obligatorio: true,
        estatus: 'pendiente' as EstatusEvidencia,
      },
      {
        id: 'ev-cont-2',
        nombre: 'Bases / Términos de Referencia',
        descripcion: 'Bases de licitación o términos de referencia',
        obligatorio: true,
        estatus: 'pendiente' as EstatusEvidencia,
      },
      {
        id: 'ev-cont-3',
        nombre: 'Contrato o Dictamen de Adjudicación',
        descripcion: 'Contrato firmado con el proveedor',
        obligatorio: true,
        estatus: 'pendiente' as EstatusEvidencia,
      },
    ],
  },
  {
    id: 'ejecucion',
    nombre: 'Ejecución',
    evidencias: [
      {
        id: 'ev-ejec-1',
        nombre: 'Reportes de avance físico',
        descripcion: 'Reportes periódicos del avance de la obra',
        obligatorio: true,
        estatus: 'pendiente' as EstatusEvidencia,
      },
      {
        id: 'ev-ejec-2',
        nombre: 'Estimaciones o comprobantes de gasto',
        descripcion: 'Estimaciones de obra pagadas, facturas',
        obligatorio: true,
        estatus: 'pendiente' as EstatusEvidencia,
      },
      {
        id: 'ev-ejec-3',
        nombre: 'Evidencia fotográfica',
        descripcion: 'Fotografías del avance de la obra',
        obligatorio: true,
        estatus: 'pendiente' as EstatusEvidencia,
      },
    ],
  },
  {
    id: 'concluida',
    nombre: 'Concluida',
    evidencias: [
      {
        id: 'ev-conc-1',
        nombre: 'Acta de entrega-recepción',
        descripcion: 'Acta formal de entrega de la obra',
        obligatorio: true,
        estatus: 'pendiente' as EstatusEvidencia,
      },
      {
        id: 'ev-conc-2',
        nombre: 'Informe final de obra',
        descripcion: 'Informe técnico final con reporte de cumplimiento',
        obligatorio: true,
        estatus: 'pendiente' as EstatusEvidencia,
      },
      {
        id: 'ev-conc-3',
        nombre: 'Fotografías finales',
        descripcion: 'Registro fotográfico de la obra terminada',
        obligatorio: true,
        estatus: 'pendiente' as EstatusEvidencia,
      },
    ],
  },
];

const OBSERVACIONES_MOCK: Observacion[] = [
  {
    id: 'obs-1',
    categoria: 'evidencias',
    titulo: 'Presupuesto base requiere actualización',
    descripcion: 'Los costos unitarios no están actualizados según el tabulador vigente del estado de Tlaxcala 2025.',
    fechaCreacion: '2025-11-20',
    estatus: 'abierta',
  },
  {
    id: 'obs-2',
    categoria: 'datos_generales',
    titulo: 'Fecha de término inconsistente',
    descripcion: 'La fecha de término programada no es congruente con la etapa actual de la obra. Favor de verificar.',
    fechaCreacion: '2025-11-19',
    estatus: 'atendida',
    respuestaDependencia: 'Se corrigió la fecha de término a diciembre 2025.',
  },
];

export function AdminObraPublicaDetailView({ obra: obraInicial, onVolver, onGuardar }: AdminObraPublicaDetailViewProps) {
  const [tabActiva, setTabActiva] = useState('datos-generales');
  const [obra, setObra] = useState(obraInicial);
  const [isSaving, setIsSaving] = useState(false);

  // Estado para evidencias
  const [evidenciasPorEtapa, setEvidenciasPorEtapa] = useState<Record<string, Evidencia[]>>(
    ETAPAS_INFO.reduce((acc, etapa) => {
      acc[etapa.id] = etapa.evidencias;
      return acc;
    }, {} as Record<string, Evidencia[]>)
  );

  // Estado para observaciones
  const [observaciones, setObservaciones] = useState<Observacion[]>(OBSERVACIONES_MOCK);
  const [nuevaObservacion, setNuevaObservacion] = useState({
    categoria: 'datos_generales' as Observacion['categoria'],
    titulo: '',
    descripcion: '',
  });
  const [dialogObservacionAbierto, setDialogObservacionAbierto] = useState(false);

  // Estado para comentarios de evidencias
  const [comentariosEvidencia, setComentariosEvidencia] = useState<Record<string, string>>({});
  const [evidenciaSeleccionada, setEvidenciaSeleccionada] = useState<{ etapaId: string; evidenciaId: string } | null>(null);

  // Estado para el visor de archivos
  const [archivoViendose, setArchivoViendose] = useState<{ nombre: string; url: string } | null>(null);

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

  const getEstatusEvidenciaInfo = (estatus: EstatusEvidencia) => {
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
    }
  };

  const handleAprobarEvidencia = (etapaId: string, evidenciaId: string) => {
    setEvidenciasPorEtapa({
      ...evidenciasPorEtapa,
      [etapaId]: evidenciasPorEtapa[etapaId].map(ev => {
        if (ev.id === evidenciaId) {
          return {
            ...ev,
            estatus: 'aprobado' as EstatusEvidencia,
            comentarioCGPI: undefined,
          };
        }
        return ev;
      }),
    });
    toast.success('Evidencia aprobada correctamente');
  };

  const handleRechazarEvidencia = (etapaId: string, evidenciaId: string, comentario: string) => {
    if (!comentario.trim()) {
      toast.error('Debes proporcionar un comentario para rechazar la evidencia');
      return;
    }

    setEvidenciasPorEtapa({
      ...evidenciasPorEtapa,
      [etapaId]: evidenciasPorEtapa[etapaId].map(ev => {
        if (ev.id === evidenciaId) {
          return {
            ...ev,
            estatus: 'rechazado' as EstatusEvidencia,
            comentarioCGPI: comentario,
          };
        }
        return ev;
      }),
    });
    setComentariosEvidencia({ ...comentariosEvidencia, [evidenciaId]: '' });
    setEvidenciaSeleccionada(null);
    toast.success('Evidencia rechazada con comentario enviado');
  };

  const handleValidarAvance = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Avance financiero validado correctamente');
    }, 1000);
  };

  const handleRechazarAvance = (comentario: string) => {
    if (!comentario.trim()) {
      toast.error('Debes proporcionar un motivo para rechazar el avance');
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Avance rechazado con observaciones enviadas');
    }, 1000);
  };

  const handleAgregarObservacion = () => {
    if (!nuevaObservacion.titulo.trim() || !nuevaObservacion.descripcion.trim()) {
      toast.error('Debes completar todos los campos');
      return;
    }

    const nuevaObs: Observacion = {
      id: `obs-${observaciones.length + 1}`,
      categoria: nuevaObservacion.categoria,
      titulo: nuevaObservacion.titulo,
      descripcion: nuevaObservacion.descripcion,
      fechaCreacion: new Date().toISOString().split('T')[0],
      estatus: 'abierta',
    };

    setObservaciones([...observaciones, nuevaObs]);
    setNuevaObservacion({
      categoria: 'datos_generales',
      titulo: '',
      descripcion: '',
    });
    setDialogObservacionAbierto(false);
    toast.success('Observación agregada correctamente');
  };

  const handleCerrarObservacion = (obsId: string) => {
    setObservaciones(observaciones.map(obs => {
      if (obs.id === obsId) {
        return { ...obs, estatus: 'cerrada' as const };
      }
      return obs;
    }));
    toast.success('Observación cerrada');
  };

  const handleValidarDatosGenerales = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Datos generales validados correctamente');
    }, 1000);
  };

  const getCategoriaLabel = (categoria: Observacion['categoria']): string => {
    const labels = {
      datos_generales: 'Datos Generales',
      etapas: 'Etapas',
      evidencias: 'Evidencias',
      avance_financiero: 'Avance Financiero',
    };
    return labels[categoria];
  };

  const observacionesAbiertas = observaciones.filter(o => o.estatus === 'abierta').length;
  const observacionesAtendidas = observaciones.filter(o => o.estatus === 'atendida').length;

  // Calcular indicador de consistencia
  const calcularConsistencia = () => {
    let puntaje = 0;
    let total = 3;

    // Consistencia monto vs avance
    if (obra.avanceFinanciero <= 100 && obra.avanceFinanciero >= 0) puntaje++;
    
    // Meta programada realista
    if (obra.metaProgramada <= 100 && obra.metaProgramada >= 0) puntaje++;
    
    // IAOP calculado correctamente
    if (obra.metaProgramada > 0) {
      const iaopCalculado = (obra.avanceFinanciero / obra.metaProgramada) * 100;
      if (Math.abs(iaopCalculado - obra.iaop) < 1) puntaje++;
    }

    return (puntaje / total) * 100;
  };

  const consistencia = calcularConsistencia();

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
                      backgroundColor: `${getSemaforoColor(obra.semaforoIAOP)}20`,
                      color: getSemaforoColor(obra.semaforoIAOP),
                      border: `1px solid ${getSemaforoColor(obra.semaforoIAOP)}`,
                    }}
                  >
                    IAOP: {obra.iaop.toFixed(1)}%
                  </Badge>
                  {observacionesAbiertas > 0 && (
                    <Badge
                      style={{
                        backgroundColor: '#F57C0020',
                        color: '#F57C00',
                        border: '1px solid #F57C00',
                      }}
                    >
                      {observacionesAbiertas} observaciones abiertas
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl mb-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                  {obra.nombreObra}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {obra.dependencia}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {obra.municipio}, Tlaxcala
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {formatCurrency(obra.montoTotal)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Actualizado: {new Date(obra.ultimaActualizacion).toLocaleDateString('es-MX')}
                  </div>
                </div>
              </div>

              {/* Semáforo IAOP grande */}
              <div className="text-center">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-2"
                  style={{ backgroundColor: getSemaforoColor(obra.semaforoIAOP) }}
                >
                  <span className="text-2xl text-white" style={{ fontWeight: 'bold' }}>
                    {obra.iaop.toFixed(0)}
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
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="datos-generales">Datos Generales</TabsTrigger>
          <TabsTrigger value="validacion-etapas">Validación de Etapas</TabsTrigger>
          <TabsTrigger value="avance-financiero">Avance Financiero</TabsTrigger>
          <TabsTrigger value="observaciones">
            Observaciones
            {observacionesAbiertas > 0 && (
              <Badge className="ml-2" style={{ backgroundColor: '#F57C00', color: 'white' }}>
                {observacionesAbiertas}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="indicadores">Indicadores</TabsTrigger>
        </TabsList>

        {/* TAB 1: Datos Generales */}
        <TabsContent value="datos-generales">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="space-y-6">
              {/* Indicadores de consistencia */}
              <Card className="border-2" style={{ borderColor: consistencia >= 80 ? '#388E3C' : consistencia >= 60 ? '#F57C00' : '#D32F2F' }}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                    <AlertCircle className="w-5 h-5" />
                    INDICADORES DE CONSISTENCIA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm" style={{ fontWeight: 'bold', color: '#374151' }}>
                          Nivel de consistencia general
                        </p>
                        <span className="text-lg" style={{ fontWeight: 'bold', color: consistencia >= 80 ? '#388E3C' : consistencia >= 60 ? '#F57C00' : '#D32F2F' }}>
                          {consistencia.toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={consistencia} className="h-2" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm" style={{ fontWeight: 'bold', color: '#374151' }}>
                            Monto vs Avance
                          </p>
                          <p className="text-xs text-gray-600">
                            El avance financiero está dentro de rango válido
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm" style={{ fontWeight: 'bold', color: '#374151' }}>
                            Meta Programada
                          </p>
                          <p className="text-xs text-gray-600">
                            Meta programada: {obra.metaProgramada.toFixed(1)}%
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm" style={{ fontWeight: 'bold', color: '#374151' }}>
                            IAOP Calculado
                          </p>
                          <p className="text-xs text-gray-600">
                            Cálculo correcto del índice
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Datos de la obra */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                    <FileText className="w-5 h-5" />
                    DATOS GENERALES DE LA OBRA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">FOLIO SIIF</p>
                      <p className="text-sm" style={{ fontWeight: 'bold' }}>{obra.folioSIIF}</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">DEPENDENCIA EJECUTORA</p>
                      <p className="text-sm" style={{ fontWeight: 'bold' }}>{obra.dependencia}</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">MUNICIPIO</p>
                      <p className="text-sm" style={{ fontWeight: 'bold' }}>{obra.municipio}</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">TIPO DE OBRA</p>
                      <p className="text-sm" style={{ fontWeight: 'bold' }}>{obra.tipoObra}</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">MONTO TOTAL</p>
                      <p className="text-sm" style={{ fontWeight: 'bold' }}>{formatCurrency(obra.montoTotal)}</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">ETAPA ACTUAL</p>
                      <p className="text-sm" style={{ fontWeight: 'bold' }}>{obra.etapa}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setNuevaObservacion({
                          categoria: 'datos_generales',
                          titulo: '',
                          descripcion: '',
                        });
                        setDialogObservacionAbierto(true);
                      }}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Agregar observación
                    </Button>
                    <Button
                      onClick={handleValidarDatosGenerales}
                      disabled={isSaving}
                      style={{ backgroundColor: '#388E3C' }}
                    >
                      {isSaving ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                          />
                          VALIDANDO...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          MARCAR COMO VALIDADO
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </TabsContent>

        {/* TAB 2: Validación de Etapas */}
        <TabsContent value="validacion-etapas">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="space-y-4">
              {ETAPAS_INFO.map((etapa) => {
                const evidencias = evidenciasPorEtapa[etapa.id] || [];
                const evidenciasAprobadas = evidencias.filter(e => e.estatus === 'aprobado').length;
                const evidenciasRechazadas = evidencias.filter(e => e.estatus === 'rechazado').length;
                const evidenciasPendientes = evidencias.filter(e => e.estatus !== 'aprobado').length;

                return (
                  <Card key={etapa.id} className={evidenciasPendientes === 0 ? 'border-2 border-green-500' : evidenciasRechazadas > 0 ? 'border-2 border-red-500' : ''}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                          <FileText className="w-5 h-5" />
                          {etapa.nombre}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge
                            style={{
                              backgroundColor: '#388E3C20',
                              color: '#388E3C',
                              border: '1px solid #388E3C',
                            }}
                          >
                            {evidenciasAprobadas} aprobadas
                          </Badge>
                          {evidenciasRechazadas > 0 && (
                            <Badge
                              style={{
                                backgroundColor: '#D32F2F20',
                                color: '#D32F2F',
                                border: '1px solid #D32F2F',
                              }}
                            >
                              {evidenciasRechazadas} rechazadas
                            </Badge>
                          )}
                        </div>
                      </div>
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
                              borderColor: evidencia.estatus === 'aprobado' ? '#388E3C' : evidencia.estatus === 'rechazado' ? '#D32F2F' : evidencia.archivo ? '#1976D2' : '#E0E0E0',
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
                              {evidencia.archivo && (
                                <div className="border-2 rounded-lg p-3 mb-3" style={{ borderColor: '#1976D2', backgroundColor: '#E3F2FD' }}>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#1976D220' }}>
                                        <FileText className="w-5 h-5" style={{ color: '#1976D2' }} />
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
                                        onClick={() => setArchivoViendose({ nombre: evidencia.archivo!.nombre, url: '#' })}
                                      >
                                        <Eye className="w-4 h-4" style={{ color: '#1976D2' }} />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        title="Descargar archivo"
                                        className="hover:bg-green-50"
                                      >
                                        <Download className="w-4 h-4" style={{ color: '#388E3C' }} />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Comentario existente de la CGPI */}
                              {evidencia.comentarioCGPI && (
                                <Alert className="border-red-300 bg-red-50 mb-3">
                                  <MessageSquare className="h-4 w-4 text-red-600" />
                                  <AlertTitle className="text-red-800">Comentario enviado a la dependencia</AlertTitle>
                                  <AlertDescription className="text-red-700">
                                    {evidencia.comentarioCGPI}
                                  </AlertDescription>
                                </Alert>
                              )}

                              {/* Acciones de validación */}
                              {evidencia.archivo && evidencia.estatus !== 'aprobado' && (
                                <div className="space-y-3">
                                  {evidenciaSeleccionada?.evidenciaId === evidencia.id ? (
                                    <div className="space-y-2">
                                      <Textarea
                                        placeholder="Escribe el motivo del rechazo..."
                                        value={comentariosEvidencia[evidencia.id] || ''}
                                        onChange={(e) => setComentariosEvidencia({ ...comentariosEvidencia, [evidencia.id]: e.target.value })}
                                        rows={3}
                                      />
                                      <div className="flex items-center gap-2">
                                        <Button
                                          size="sm"
                                          onClick={() => handleRechazarEvidencia(etapa.id, evidencia.id, comentariosEvidencia[evidencia.id] || '')}
                                          style={{ backgroundColor: '#D32F2F' }}
                                        >
                                          <Send className="w-4 h-4 mr-2" />
                                          Enviar rechazo
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => setEvidenciaSeleccionada(null)}
                                        >
                                          Cancelar
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="sm"
                                        onClick={() => handleAprobarEvidencia(etapa.id, evidencia.id)}
                                        style={{ backgroundColor: '#388E3C' }}
                                      >
                                        <Check className="w-4 h-4 mr-2" />
                                        Aprobar
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setEvidenciaSeleccionada({ etapaId: etapa.id, evidenciaId: evidencia.id })}
                                        style={{ borderColor: '#D32F2F', color: '#D32F2F' }}
                                      >
                                        <X className="w-4 h-4 mr-2" />
                                        Rechazar
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              )}

                              {evidencia.estatus === 'aprobado' && (
                                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                                  <span className="text-sm text-green-800">
                                    Evidencia validada por la CGPI
                                  </span>
                                </div>
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

        {/* TAB 3: Avance Financiero */}
        <TabsContent value="avance-financiero">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="space-y-6">
              {/* Comparador */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                    <TrendingUp className="w-5 h-5" />
                    COMPARATIVO PROGRAMADO VS REAL
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">Meta programada:</p>
                        <span className="text-lg" style={{ fontWeight: 'bold', color: '#1976D2' }}>
                          {obra.metaProgramada.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={obra.metaProgramada} className="h-2 mb-4" />
                      
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">Avance financiero real:</p>
                        <span className="text-lg" style={{ fontWeight: 'bold', color: '#7B1FA2' }}>
                          {obra.avanceFinanciero.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={obra.avanceFinanciero} className="h-2" />
                    </div>

                    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
                      <div className="relative w-32 h-32">
                        <svg className="w-32 h-32 transform -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            fill="none"
                            stroke="#E0E0E0"
                            strokeWidth="12"
                          />
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            fill="none"
                            stroke={getSemaforoColor(obra.semaforoIAOP)}
                            strokeWidth="12"
                            strokeDasharray={`${2 * Math.PI * 56}`}
                            strokeDashoffset={`${2 * Math.PI * 56 * (1 - Math.min(obra.iaop, 100) / 100)}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl" style={{ fontWeight: 'bold', color: getSemaforoColor(obra.semaforoIAOP) }}>
                            {obra.iaop.toFixed(1)}
                          </span>
                          <span className="text-xs text-gray-600">IAOP</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Alertas automáticas */}
                  <div className="mt-6 space-y-3">
                    {obra.avanceFinanciero > obra.metaProgramada && (
                      <Alert className="border-orange-300 bg-orange-50">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <AlertTitle className="text-orange-800">Avance superior a la meta</AlertTitle>
                        <AlertDescription className="text-orange-700">
                          El avance financiero real ({obra.avanceFinanciero.toFixed(1)}%) supera la meta programada ({obra.metaProgramada.toFixed(1)}%). 
                          Verificar si es necesario ajustar la programación.
                        </AlertDescription>
                      </Alert>
                    )}

                    {obra.iaop < 70 && (
                      <Alert className="border-red-300 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertTitle className="text-red-800">IAOP en rojo</AlertTitle>
                        <AlertDescription className="text-red-700">
                          El índice de avance está por debajo del 70%. Se requiere atención inmediata de la dependencia.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-6 border-t mt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const comentario = prompt('Ingresa el motivo del rechazo:');
                        if (comentario) handleRechazarAvance(comentario);
                      }}
                      style={{ borderColor: '#D32F2F', color: '#D32F2F' }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Rechazar avance
                    </Button>
                    <Button
                      onClick={handleValidarAvance}
                      disabled={isSaving}
                      style={{ backgroundColor: '#388E3C' }}
                    >
                      {isSaving ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                          />
                          VALIDANDO...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Validar avance
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </TabsContent>

        {/* TAB 4: Observaciones */}
        <TabsContent value="observaciones">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="space-y-6">
              {/* Resumen */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-2" style={{ borderColor: '#F57C00' }}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-8 h-8" style={{ color: '#F57C00' }} />
                      <div>
                        <p className="text-2xl" style={{ fontWeight: 'bold', color: '#F57C00' }}>
                          {observacionesAbiertas}
                        </p>
                        <p className="text-xs text-gray-600">Abiertas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2" style={{ borderColor: '#1976D2' }}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-8 h-8" style={{ color: '#1976D2' }} />
                      <div>
                        <p className="text-2xl" style={{ fontWeight: 'bold', color: '#1976D2' }}>
                          {observacionesAtendidas}
                        </p>
                        <p className="text-xs text-gray-600">Atendidas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2" style={{ borderColor: '#388E3C' }}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <XCircle className="w-8 h-8" style={{ color: '#388E3C' }} />
                      <div>
                        <p className="text-2xl" style={{ fontWeight: 'bold', color: '#388E3C' }}>
                          {observaciones.filter(o => o.estatus === 'cerrada').length}
                        </p>
                        <p className="text-xs text-gray-600">Cerradas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Botón para agregar observación */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg" style={{ fontWeight: 'bold', color: '#582672' }}>
                  Listado de Observaciones
                </h3>
                <Dialog open={dialogObservacionAbierto} onOpenChange={setDialogObservacionAbierto}>
                  <DialogTrigger asChild>
                    <Button style={{ backgroundColor: '#1976D2' }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Nueva observación
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Agregar Observación</DialogTitle>
                      <DialogDescription>
                        Registra una nueva observación para la dependencia ejecutora
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <label className="block text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                          CATEGORÍA *
                        </label>
                        <Select
                          value={nuevaObservacion.categoria}
                          onValueChange={(value) => setNuevaObservacion({ ...nuevaObservacion, categoria: value as Observacion['categoria'] })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="datos_generales">Datos Generales</SelectItem>
                            <SelectItem value="etapas">Etapas</SelectItem>
                            <SelectItem value="evidencias">Evidencias</SelectItem>
                            <SelectItem value="avance_financiero">Avance Financiero</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                          TÍTULO *
                        </label>
                        <Input
                          value={nuevaObservacion.titulo}
                          onChange={(e) => setNuevaObservacion({ ...nuevaObservacion, titulo: e.target.value })}
                          placeholder="Ej. Documentación incompleta"
                        />
                      </div>

                      <div>
                        <label className="block text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                          DESCRIPCIÓN *
                        </label>
                        <Textarea
                          value={nuevaObservacion.descripcion}
                          onChange={(e) => setNuevaObservacion({ ...nuevaObservacion, descripcion: e.target.value })}
                          placeholder="Describe la observación..."
                          rows={4}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDialogObservacionAbierto(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAgregarObservacion} style={{ backgroundColor: '#1976D2' }}>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar observación
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Listado de observaciones */}
              <div className="space-y-3">
                {observaciones.map((obs) => {
                  const estatusColor = obs.estatus === 'abierta' ? '#F57C00' : obs.estatus === 'atendida' ? '#1976D2' : '#388E3C';
                  const estatusBg = obs.estatus === 'abierta' ? '#FFF3E0' : obs.estatus === 'atendida' ? '#E3F2FD' : '#E8F5E9';

                  return (
                    <Card key={obs.id} className="border-2" style={{ borderColor: estatusColor }}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                style={{
                                  backgroundColor: estatusBg,
                                  color: estatusColor,
                                  border: `1px solid ${estatusColor}`,
                                }}
                              >
                                {getCategoriaLabel(obs.categoria)}
                              </Badge>
                              <Badge
                                variant="outline"
                                style={{
                                  backgroundColor: estatusBg,
                                  color: estatusColor,
                                  border: `1px solid ${estatusColor}`,
                                }}
                              >
                                {obs.estatus === 'abierta' ? 'Abierta' : obs.estatus === 'atendida' ? 'Atendida' : 'Cerrada'}
                              </Badge>
                            </div>
                            <h4 className="text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                              {obs.titulo}
                            </h4>
                            <p className="text-sm text-gray-700 mb-2">
                              {obs.descripcion}
                            </p>
                            <p className="text-xs text-gray-500">
                              Fecha: {new Date(obs.fechaCreacion).toLocaleDateString('es-MX')}
                            </p>
                          </div>
                        </div>

                        {obs.respuestaDependencia && (
                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 mb-3">
                            <p className="text-xs text-gray-600 mb-1" style={{ fontWeight: 'bold' }}>
                              Respuesta de la dependencia:
                            </p>
                            <p className="text-sm text-gray-700">
                              {obs.respuestaDependencia}
                            </p>
                          </div>
                        )}

                        {obs.estatus === 'atendida' && (
                          <Button
                            size="sm"
                            onClick={() => handleCerrarObservacion(obs.id)}
                            style={{ backgroundColor: '#388E3C' }}
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Cerrar observación
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}

                {observaciones.length === 0 && (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No hay observaciones registradas</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </TabsContent>

        {/* TAB 5: Indicadores */}
        <TabsContent value="indicadores">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                  <BarChart3 className="w-5 h-5" />
                  INDICADORES E INTEGRACIÓN GLOBAL
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">IAOP INDIVIDUAL</p>
                    <p className="text-4xl mb-2" style={{ fontWeight: 'bold', color: getSemaforoColor(obra.semaforoIAOP) }}>
                      {obra.iaop.toFixed(1)}%
                    </p>
                    <div className="w-8 h-8 rounded-full mx-auto" style={{ backgroundColor: getSemaforoColor(obra.semaforoIAOP) }} />
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">IGOP DEPENDENCIA</p>
                    <p className="text-4xl mb-2" style={{ fontWeight: 'bold', color: '#1976D2' }}>
                      85.3%
                    </p>
                    <p className="text-xs text-gray-500">{obra.dependencia}</p>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">IGOP ESTATAL</p>
                    <p className="text-4xl mb-2" style={{ fontWeight: 'bold', color: '#388E3C' }}>
                      78.9%
                    </p>
                    <p className="text-xs text-gray-500">Estado de Tlaxcala</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-3">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar PDF
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Excel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Dialog para visor de archivos */}
      {archivoViendose && (
        <Dialog open={!!archivoViendose} onOpenChange={() => setArchivoViendose(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Visor de Archivo</DialogTitle>
              <DialogDescription>
                {archivoViendose.nombre}
              </DialogDescription>
            </DialogHeader>
            <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Vista previa del archivo</p>
                <p className="text-sm text-gray-500 mt-2">{archivoViendose.nombre}</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setArchivoViendose(null)}>
                Cerrar
              </Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Descargar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
