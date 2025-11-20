import { useState } from 'react';
import {
  ArrowLeft,
  Download,
  Clock,
  Building2,
  Users,
  Target,
  DollarSign,
  MapPin,
  TrendingUp,
  AlertCircle,
  FileText,
  Edit,
  Calendar,
  CheckCircle2,
  Info,
  Plus,
  Trash2,
  Upload,
  Save,
  Send,
  AlertTriangle,
  X,
  MessageSquare,
  Eye,
  Image as ImageIcon,
  Video,
  FileDown,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { motion } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { Alert, AlertDescription } from './ui/alert';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';

interface CompromisoDetailViewProps {
  compromiso: any;
  onClose: () => void;
}

// Municipios de Tlaxcala
const municipiosTlaxcala = [
  'Acuamanala de Miguel Hidalgo',
  'Amaxac de Guerrero',
  'Apetatitlán de Antonio Carvajal',
  'Apizaco',
  'Atlangatepec',
  'Atltzayanca',
  'Benito Juárez',
  'Calpulalpan',
  'Chiautempan',
  'Contla de Juan Cuamatzi',
  'Cuapiaxtla',
  'Cuaxomulco',
  'El Carmen Tequexquitla',
  'Emiliano Zapata',
  'Españita',
  'Huamantla',
  'Hueyotlipan',
  'Ixtacuixtla de Mariano Matamoros',
  'Ixtenco',
  'La Magdalena Tlaltelulco',
  'Lázaro Cárdenas',
  'Mazatecochco de José María Morelos',
  'Muñoz de Domingo Arenas',
  'Nanacamilpa de Mariano Arista',
  'Natívitas',
  'Panotla',
  'Papalotla de Xicohténcatl',
  'San Damián Texóloc',
  'San Francisco Tetlanohcan',
  'San Jerónimo Zacualpan',
  'San José Teacalco',
  'San Juan Huactzinco',
  'San Lorenzo Axocomanitla',
  'San Lucas Tecopilco',
  'San Pablo del Monte',
  'Sanctórum de Lázaro Cárdenas',
  'Santa Ana Nopalucan',
  'Santa Apolonia Teacalco',
  'Santa Catarina Ayometla',
  'Santa Cruz Quilehtla',
  'Santa Cruz Tlaxcala',
  'Santa Isabel Xiloxoxtla',
  'Tenancingo',
  'Teolocholco',
  'Tepetitla de Lardizábal',
  'Tepeyanco',
  'Terrenate',
  'Tetla de la Solidaridad',
  'Tetlatlahuca',
  'Tlaxcala',
  'Tlaxco',
  'Tocatlán',
  'Totolac',
  'Tzompantepec',
  'Xaloztoc',
  'Xaltocan',
  'Xicohtzinco',
  'Yauhquemehcan',
  'Zacatelco',
  'Zitlaltepec de Trinidad Sánchez Santos',
];

interface Comentario {
  id: number;
  usuario: string;
  fecha: string;
  texto: string;
  seccion: string;
}

// Generar datos detallados del compromiso
const generateCompromisoDetail = (compromiso: any) => {
  const intervinientes = [];
  for (let i = 0; i < compromiso.numIntervinientes; i++) {
    const avance = Math.floor(Math.random() * 100);
    intervinientes.push({
      id: `dep-${i + 1}`,
      nombre: `Dependencia Interviniente ${i + 1}`,
      rol: i === 0 ? 'Responsable Principal' : 'Colaborador',
    });
  }

  const historico = [];
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre'];
  for (let i = 0; i < 6; i++) {
    historico.push({
      fecha: `${meses[9 - i]} 2025`,
      avance: Math.min(100, compromiso.avance - (i * 15)),
      evento: [
        'Actualización de avance físico',
        'Revisión de cumplimiento',
        'Validación CGPI',
        'Ajuste de metas',
        'Informe trimestral',
        'Supervisión en campo',
      ][Math.floor(Math.random() * 6)],
      responsable: `Responsable ${i + 1}`,
    });
  }

  // Seleccionar municipios aleatorios para cobertura municipal
  const numMunicipios = Math.floor(Math.random() * 5) + 2;
  const municipiosSeleccionados = [];
  for (let i = 0; i < numMunicipios; i++) {
    const municipio = municipiosTlaxcala[Math.floor(Math.random() * municipiosTlaxcala.length)];
    if (!municipiosSeleccionados.includes(municipio)) {
      municipiosSeleccionados.push(municipio);
    }
  }

  return {
    ...compromiso,
    descripcionCompleta: `${compromiso.titulo}. Este compromiso busca mejorar la calidad de vida de la población mediante acciones concretas y medibles que impacten directamente en el desarrollo estatal. Se contempla la participación coordinada de múltiples dependencias para garantizar el cumplimiento de los objetivos establecidos.`,
    presupuestoAprobado: Math.floor(Math.random() * 50000000) + 5000000,
    presupuestoModificado: Math.floor(Math.random() * 55000000) + 5000000,
    presupuestoEjercido: Math.floor(Math.random() * 50000000) + 3000000,
    proyecto: 'Plan Estatal de Desarrollo 2021-2027',
    cobertura: Math.random() > 0.5 ? 'Municipal' : 'Estatal',
    municipiosSeleccionados,
    intervinientes,
    historico,
    observacionesCGPI: 'El compromiso presenta un avance satisfactorio conforme a lo programado. Se recomienda mantener la coordinación interinstitucional para garantizar el cumplimiento en tiempo y forma.',
    lineamientosAplicables: ['Lineamiento 15 - MIR', 'Lineamiento 22 - Seguimiento y evaluación'],
    metas: [
      {
        id: 1,
        unidadMedida: 'Personas beneficiadas',
        descripcion: 'Familias beneficiadas con el programa',
        avance2021: 250,
        avance2022: 450,
        avance2023: 680,
        avance2024: 850,
        presupuesto: 5000000,
        fechaReporte: '28 Oct 2025',
        reportadoPor: 'Lic. María González - Coordinadora de Seguimiento',
      },
      {
        id: 2,
        unidadMedida: 'Obras entregadas',
        descripcion: 'Infraestructura construida y entregada',
        avance2021: 5,
        avance2022: 12,
        avance2023: 18,
        avance2024: 25,
        presupuesto: 15000000,
        fechaReporte: '25 Oct 2025',
        reportadoPor: 'Ing. Carlos Hernández - Director de Obras',
      },
      {
        id: 3,
        unidadMedida: 'Servicios implementados',
        descripcion: 'Nuevos servicios públicos en operación',
        avance2021: 8,
        avance2022: 15,
        avance2023: 22,
        avance2024: 30,
        presupuesto: 8000000,
        fechaReporte: '20 Oct 2025',
        reportadoPor: 'Lic. Ana Martínez - Jefa de Servicios',
      },
    ],
    beneficiarios: {
      tipo: 'Personas físicas',
      numeroTotal: 2500,
      municipiosAplica: municipiosSeleccionados,
    },
    mediosVerificacion: [
      { id: 1, nombre: 'Evidencia_fotográfica_octubre_2025.pdf', tipo: 'PDF', fecha: '28 Oct 2025', tamaño: '2.5 MB' },
      { id: 2, nombre: 'Reporte_avance_Q3_2025.pdf', tipo: 'PDF', fecha: '15 Oct 2025', tamaño: '1.8 MB' },
      { id: 3, nombre: 'Fotografias_obra_1.jpg', tipo: 'Imagen', fecha: '10 Oct 2025', tamaño: '4.2 MB' },
      { id: 4, nombre: 'Video_inauguracion.mp4', tipo: 'Video', fecha: '05 Oct 2025', tamaño: '45.3 MB' },
    ],
  };
};

export function CompromisoDetailView({ compromiso: baseCompromiso, onClose }: CompromisoDetailViewProps) {
  const [compromiso] = useState(generateCompromisoDetail(baseCompromiso));
  const [comentarios, setComentarios] = useState<Comentario[]>([
    {
      id: 1,
      usuario: 'Ana García - CGPI',
      fecha: '28 Oct 2025 14:30',
      texto: 'Se recomienda acelerar el proceso de licitación para cumplir con los tiempos establecidos.',
      seccion: 'A',
    },
    {
      id: 2,
      usuario: 'Carlos Martínez - Auditoría',
      fecha: '25 Oct 2025 10:15',
      texto: 'Solicito aclaración sobre la diferencia entre el presupuesto modificado y el aprobado.',
      seccion: 'A',
    },
  ]);
  const [nuevoComentario, setNuevoComentario] = useState<Record<string, string>>({});
  const [mostrarComentarios, setMostrarComentarios] = useState<Record<string, boolean>>({});

  const presupuestoExcedido = compromiso.presupuestoEjercido > compromiso.presupuestoAprobado;

  const getEtapaColor = (etapa: string) => {
    switch (etapa) {
      case 'No iniciado': return '#9E9E9E';
      case 'En proceso': return '#1976D2';
      case '50%': return '#F9A825';
      case 'Cumplido': return '#2E7D32';
      default: return '#9E9E9E';
    }
  };

  const handleAgregarComentario = (seccion: string) => {
    if (nuevoComentario[seccion]?.trim()) {
      const newComment: Comentario = {
        id: comentarios.length + 1,
        usuario: 'Usuario Actual',
        fecha: new Date().toLocaleString('es-MX'),
        texto: nuevoComentario[seccion],
        seccion,
      };
      setComentarios([...comentarios, newComment]);
      setNuevoComentario({ ...nuevoComentario, [seccion]: '' });
    }
  };

  const getComentariosPorSeccion = (seccion: string) => {
    return comentarios.filter(c => c.seccion === seccion);
  };

  const ComentariosSeccion = ({ seccion, titulo }: { seccion: string; titulo: string }) => {
    const comentariosSeccion = getComentariosPorSeccion(seccion);
    const mostrar = mostrarComentarios[seccion] || false;

    return (
      <div className="mt-4 border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMostrarComentarios({ ...mostrarComentarios, [seccion]: !mostrar })}
            className="text-gray-600 hover:text-purple-700"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Comentarios ({comentariosSeccion.length})
          </Button>
        </div>

        {mostrar && (
          <div className="space-y-3">
            {comentariosSeccion.length > 0 && (
              <div className="space-y-2 mb-3">
                {comentariosSeccion.map(comentario => (
                  <div key={comentario.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-xs" style={{ fontWeight: 'bold', color: '#582672' }}>
                        {comentario.usuario}
                      </p>
                      <p className="text-xs text-gray-500">{comentario.fecha}</p>
                    </div>
                    <p className="text-sm text-gray-700">{comentario.texto}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Textarea
                placeholder="Escribe un comentario sobre esta sección..."
                value={nuevoComentario[seccion] || ''}
                onChange={(e) => setNuevoComentario({ ...nuevoComentario, [seccion]: e.target.value })}
                rows={2}
                className="flex-1"
              />
              <Button
                onClick={() => handleAgregarComentario(seccion)}
                disabled={!nuevoComentario[seccion]?.trim()}
                style={{ backgroundColor: '#582672', color: 'white' }}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const getFileIcon = (tipo: string) => {
    switch (tipo) {
      case 'PDF':
        return <FileText className="w-5 h-5 text-red-600" />;
      case 'Imagen':
        return <ImageIcon className="w-5 h-5 text-blue-600" />;
      case 'Video':
        return <Video className="w-5 h-5 text-purple-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline">
                    {compromiso.id}
                  </Badge>
                  <Badge
                    className="border-0"
                    style={{
                      backgroundColor: `${getEtapaColor(compromiso.etapa)}15`,
                      color: getEtapaColor(compromiso.etapa),
                      fontWeight: 'bold',
                    }}
                  >
                    {compromiso.etapa}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Modo visualización
                  </Badge>
                </div>
                <h1 className="text-2xl" style={{ color: '#582672', fontWeight: 'bold' }}>
                  {compromiso.titulo}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Detalle de Compromiso — Monitoreo Estratégico Gubernamental
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Círculo de progreso con jerarquía */}
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24">
                  {/* Círculo de fondo */}
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="42"
                      stroke="#E5E7EB"
                      strokeWidth="8"
                      fill="none"
                    />
                    {/* Círculo de progreso */}
                    <circle
                      cx="48"
                      cy="48"
                      r="42"
                      stroke={getEtapaColor(compromiso.etapa)}
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      strokeDashoffset={`${2 * Math.PI * 42 * (1 - compromiso.avance / 100)}`}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                    />
                  </svg>
                  {/* Porcentaje en el centro */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl" style={{ fontWeight: 'bold', color: getEtapaColor(compromiso.etapa) }}>
                      {compromiso.avance}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">Avance</p>
              </div>

              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Descargar PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* A) INFORMACIÓN GENERAL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                <Info className="w-5 h-5" />
                A) Información General
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm text-gray-600">Nombre del Compromiso</Label>
                <p className="text-sm mt-1" style={{ fontWeight: 'bold' }}>{compromiso.titulo}</p>
              </div>

              <div>
                <Label className="text-sm text-gray-600">Descripción</Label>
                <p className="text-sm mt-1 text-gray-700 leading-relaxed">{compromiso.descripcionCompleta}</p>
              </div>

              <Separator />

              {/* Dependencia Responsable con mayor jerarquía */}
              <div>
                <Label className="text-sm text-gray-600 mb-3 block">Dependencia Responsable</Label>
                <Card className="border-2 border-purple-200 bg-purple-50/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#58267220' }}>
                        <Building2 className="w-6 h-6" style={{ color: '#582672' }} />
                      </div>
                      <div>
                        <p className="text-lg" style={{ fontWeight: 'bold', color: '#582672' }}>
                          {compromiso.dependenciaResponsable}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">Principal responsable del compromiso</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Dependencias Intervinientes con mayor jerarquía */}
              <div>
                <Label className="text-sm text-gray-600 mb-3 block">Dependencias Intervinientes ({compromiso.intervinientes.length})</Label>
                <div className="flex flex-wrap gap-3">
                  {compromiso.intervinientes.map((int: any) => (
                    <Badge key={int.id} variant="outline" className="text-sm px-4 py-2 border-2" style={{ borderColor: '#58267240' }}>
                      <Building2 className="w-4 h-4 mr-2" style={{ color: '#582672' }} />
                      {int.nombre}
                      <span className="ml-2 text-xs text-gray-500">({int.rol})</span>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm text-gray-600">Proyecto al que pertenece</Label>
                <p className="text-sm mt-2" style={{ fontWeight: 'bold' }}>{compromiso.proyecto}</p>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm mb-4" style={{ fontWeight: 'bold', color: '#582672' }}>Presupuesto</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label className="text-sm text-gray-600">Aprobado</Label>
                    <div className="mt-2 p-3 bg-gray-100 rounded-lg">
                      <p className="text-lg" style={{ fontWeight: 'bold' }}>
                        ${compromiso.presupuestoAprobado.toLocaleString('es-MX')}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-600">Modificado</Label>
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-lg" style={{ fontWeight: 'bold', color: '#1976D2' }}>
                        ${compromiso.presupuestoModificado.toLocaleString('es-MX')}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-600">Ejercido</Label>
                    <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-lg" style={{ fontWeight: 'bold', color: '#2E7D32' }}>
                        ${compromiso.presupuestoEjercido.toLocaleString('es-MX')}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {((compromiso.presupuestoEjercido / compromiso.presupuestoModificado) * 100).toFixed(1)}% del modificado
                      </p>
                    </div>
                  </div>
                </div>

                {presupuestoExcedido && (
                  <Alert className="mt-4 border-orange-300 bg-orange-50">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <AlertDescription className="text-sm text-orange-800">
                      <p style={{ fontWeight: 'bold' }}>
                        El monto ejercido supera el presupuesto aprobado.
                      </p>
                      <p className="text-xs mt-1">
                        Diferencia: ${(compromiso.presupuestoEjercido - compromiso.presupuestoAprobado).toLocaleString('es-MX')}
                      </p>
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <Separator />

              {/* Beneficiarios - Reposicionado */}
              <div>
                <h3 className="text-sm mb-4 flex items-center gap-2" style={{ fontWeight: 'bold', color: '#582672' }}>
                  <Users className="w-5 h-5" />
                  Beneficiarios (Modalidad S)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-2 border-green-200 bg-green-50/30">
                    <CardContent className="p-4">
                      <Label className="text-xs text-gray-600">Tipo de Beneficiario</Label>
                      <p className="text-lg mt-2" style={{ fontWeight: 'bold', color: '#2E7D32' }}>
                        {compromiso.beneficiarios.tipo}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-green-200 bg-green-50/30">
                    <CardContent className="p-4">
                      <Label className="text-xs text-gray-600">Número Total</Label>
                      <p className="text-lg mt-2" style={{ fontWeight: 'bold', color: '#2E7D32' }}>
                        {compromiso.beneficiarios.numeroTotal.toLocaleString('es-MX')}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-green-200 bg-green-50/30">
                    <CardContent className="p-4">
                      <Label className="text-xs text-gray-600">Municipios Impactados</Label>
                      <p className="text-lg mt-2" style={{ fontWeight: 'bold', color: '#2E7D32' }}>
                        {compromiso.beneficiarios.municipiosAplica.length}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              {/* Mapa de Impacto Geográfico */}
              <div>
                <h3 className="text-sm mb-4 flex items-center gap-2" style={{ fontWeight: 'bold', color: '#582672' }}>
                  <MapPin className="w-5 h-5" />
                  Impacto Geográfico del Compromiso
                </h3>
                <Card className="border-2 border-purple-200">
                  <CardContent className="p-6">
                    <div className="relative w-full h-80 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg overflow-hidden">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        {/* Forma del estado de Tlaxcala */}
                        <path
                          d="M 20,25 L 80,20 L 85,35 L 90,55 L 75,70 L 55,75 L 35,72 L 25,65 L 15,50 Z"
                          fill="#E0E0E0"
                          stroke="#9E9E9E"
                          strokeWidth="0.5"
                        />
                        
                        {/* Puntos de municipios impactados */}
                        {compromiso.cobertura === 'Municipal' ? (
                          compromiso.municipiosSeleccionados.map((_: any, i: number) => {
                            const x = 30 + Math.random() * 40;
                            const y = 30 + Math.random() * 40;
                            return (
                              <TooltipProvider key={i}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <circle
                                      cx={x}
                                      cy={y}
                                      r="3.5"
                                      fill="#582672"
                                      stroke="white"
                                      strokeWidth="1"
                                      className="cursor-pointer hover:r-5 transition-all"
                                      style={{ filter: 'drop-shadow(0 2px 4px rgba(88, 38, 114, 0.5))' }}
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">{compromiso.municipiosSeleccionados[i]}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            );
                          })
                        ) : (
                          // Si es estatal, mostrar múltiples puntos distribuidos
                          [...Array(12)].map((_, i) => {
                            const x = 25 + (i % 4) * 15 + Math.random() * 8;
                            const y = 25 + Math.floor(i / 4) * 15 + Math.random() * 8;
                            return (
                              <circle
                                key={i}
                                cx={x}
                                cy={y}
                                r="2.5"
                                fill="#582672"
                                stroke="white"
                                strokeWidth="0.8"
                                style={{ filter: 'drop-shadow(0 1px 3px rgba(88, 38, 114, 0.4))' }}
                              />
                            );
                          })
                        )}
                      </svg>
                    </div>
                    
                    {/* Información del mapa */}
                    <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-600">Cobertura</p>
                          <p className="text-sm mt-1" style={{ fontWeight: 'bold' }}>{compromiso.cobertura}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Municipios</p>
                          <p className="text-sm mt-1" style={{ fontWeight: 'bold' }}>
                            {compromiso.cobertura === 'Municipal' 
                              ? compromiso.municipiosSeleccionados.length 
                              : '60 (Todo el estado)'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Beneficiarios</p>
                          <p className="text-sm mt-1" style={{ fontWeight: 'bold', color: '#2E7D32' }}>
                            {compromiso.beneficiarios.numeroTotal.toLocaleString('es-MX')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <ComentariosSeccion seccion="A" titulo="Información General" />
            </CardContent>
          </Card>
        </motion.div>

        {/* B) ETAPA Y COBERTURA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                <MapPin className="w-5 h-5" />
                B) Etapa y Cobertura
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm text-gray-600">Etapa de Cumplimiento</Label>
                  <div className="mt-2 p-3 rounded-lg border-2" style={{ borderColor: getEtapaColor(compromiso.etapa) + '30', backgroundColor: getEtapaColor(compromiso.etapa) + '10' }}>
                    <p className="text-lg" style={{ fontWeight: 'bold', color: getEtapaColor(compromiso.etapa) }}>
                      {compromiso.etapa}
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-gray-600">Tipo de Cobertura</Label>
                  <div className="mt-2 p-3 bg-gray-100 rounded-lg">
                    <p className="text-lg" style={{ fontWeight: 'bold' }}>
                      {compromiso.cobertura}
                    </p>
                  </div>
                </div>
              </div>

              {compromiso.cobertura === 'Municipal' && (
                <div>
                  <Label className="text-sm text-gray-600 mb-3 block">
                    Municipios Seleccionados ({compromiso.municipiosSeleccionados.length})
                  </Label>
                  
                  {/* Mini mapa visual */}
                  <div className="mb-4 p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                    <div className="relative w-full h-48 bg-white rounded-lg overflow-hidden">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        {/* Forma del estado */}
                        <path
                          d="M 20,25 L 80,20 L 85,35 L 90,55 L 75,70 L 55,75 L 35,72 L 25,65 L 15,50 Z"
                          fill="#E0E0E0"
                          stroke="#9E9E9E"
                          strokeWidth="0.5"
                        />
                        
                        {/* Puntos de municipios seleccionados */}
                        {[...Array(compromiso.municipiosSeleccionados.length)].map((_, i) => {
                          const x = 30 + Math.random() * 40;
                          const y = 30 + Math.random() * 40;
                          return (
                            <circle
                              key={i}
                              cx={x}
                              cy={y}
                              r="4"
                              fill="#582672"
                              stroke="white"
                              strokeWidth="1"
                            />
                          );
                        })}
                      </svg>
                    </div>
                  </div>

                  {/* Lista de municipios */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {compromiso.municipiosSeleccionados.map((municipio: string) => (
                        <div key={municipio} className="flex items-center gap-2 p-2 bg-purple-50 rounded">
                          <CheckCircle2 className="w-4 h-4 text-purple-600" />
                          <span className="text-sm">{municipio}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <ComentariosSeccion seccion="B" titulo="Etapa y Cobertura" />
            </CardContent>
          </Card>
        </motion.div>

        {/* C) METAS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                <Target className="w-5 h-5" />
                C) Metas del Compromiso ({compromiso.metas.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {compromiso.metas.map((meta: any, index: number) => (
                  <Card key={meta.id} className="border-2 border-purple-100 bg-purple-50/30">
                    <CardContent className="p-4">
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge style={{ backgroundColor: '#582672', color: 'white' }}>
                              Meta {index + 1}
                            </Badge>
                            <Badge variant="outline">
                              {meta.unidadMedida}
                            </Badge>
                          </div>
                          
                          {/* Información de reporte */}
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-xs text-gray-600">{meta.fechaReporte}</span>
                          </div>
                        </div>
                        <p className="text-sm mb-2" style={{ fontWeight: 'bold' }}>{meta.descripcion}</p>
                        
                        {/* Reportado por */}
                        <div className="flex items-center gap-2 mt-2 p-2 bg-white rounded border border-purple-200">
                          <Users className="w-3 h-3 text-purple-600" />
                          <p className="text-xs text-gray-700">
                            <span className="text-gray-500">Reportado por:</span> <span style={{ fontWeight: 'bold' }}>{meta.reportadoPor}</span>
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label className="text-xs text-gray-600 mb-2 block">Avance Anual</Label>
                          <div className="grid grid-cols-4 gap-3">
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <p className="text-xs text-gray-500 mb-1">2021</p>
                              <p className="text-lg" style={{ fontWeight: 'bold' }}>
                                {meta.avance2021.toLocaleString('es-MX')}
                              </p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <p className="text-xs text-gray-500 mb-1">2022</p>
                              <p className="text-lg" style={{ fontWeight: 'bold' }}>
                                {meta.avance2022.toLocaleString('es-MX')}
                              </p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <p className="text-xs text-gray-500 mb-1">2023</p>
                              <p className="text-lg" style={{ fontWeight: 'bold' }}>
                                {meta.avance2023.toLocaleString('es-MX')}
                              </p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-green-300 bg-green-50">
                              <p className="text-xs text-gray-500 mb-1">2024</p>
                              <p className="text-lg" style={{ fontWeight: 'bold', color: '#2E7D32' }}>
                                {meta.avance2024.toLocaleString('es-MX')}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs text-gray-600">Presupuesto Asignado</Label>
                          <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200">
                            <p className="text-lg" style={{ fontWeight: 'bold' }}>
                              ${meta.presupuesto.toLocaleString('es-MX')} MXN
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <ComentariosSeccion seccion="C" titulo="Metas" />
            </CardContent>
          </Card>
        </motion.div>

        {/* D) MEDIOS DE VERIFICACIÓN (Renumerado) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                <FileText className="w-5 h-5" />
                D) Medios de Verificación
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Documentos y evidencias que sustentan el avance del compromiso
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {compromiso.mediosVerificacion.map((archivo: any) => (
                  <Card key={archivo.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-100">
                          {getFileIcon(archivo.tipo)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate" style={{ fontWeight: 'bold' }}>
                            {archivo.nombre}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                            <Badge variant="outline" className="text-xs">
                              {archivo.tipo}
                            </Badge>
                            <span>{archivo.tamaño}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Subido el {archivo.fecha}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Ver archivo</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <FileDown className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Descargar</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <ComentariosSeccion seccion="D" titulo="Medios de Verificación" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Observaciones CGPI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                <AlertCircle className="w-5 h-5" />
                Observaciones de la CGPI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 leading-relaxed mb-3">{compromiso.observacionesCGPI}</p>
                <div className="flex gap-2 flex-wrap">
                  {compromiso.lineamientosAplicables.map((lin: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {lin}
                    </Badge>
                  ))}
                </div>
              </div>

              <ComentariosSeccion seccion="CGPI" titulo="Observaciones CGPI" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Resumen de todos los comentarios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="mb-8"
        >
          <Card className="border-purple-200 bg-purple-50/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                <MessageSquare className="w-5 h-5" />
                Resumen de Comentarios ({comentarios.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Total de comentarios en este compromiso: <strong>{comentarios.length}</strong>
              </p>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                {['A', 'B', 'C', 'D', 'E', 'CGPI'].map(seccion => {
                  const count = getComentariosPorSeccion(seccion).length;
                  return (
                    <div key={seccion} className="bg-white rounded-lg p-3 border border-gray-200 text-center">
                      <p className="text-xs text-gray-600 mb-1">Sección {seccion}</p>
                      <p className="text-xl" style={{ fontWeight: 'bold', color: '#582672' }}>
                        {count}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Última actualización:</strong> {compromiso.ultimaActualizacion}
              </p>
              <p className="text-xs text-gray-500">
                Coordinación General de Planeación e Inversión (CGPI) — Gobierno del Estado de Tlaxcala
              </p>
            </div>
            <div>
              <Badge variant="outline" className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                Modo solo lectura — Puedes comentar cada sección
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
