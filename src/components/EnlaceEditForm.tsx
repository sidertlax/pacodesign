import { useState } from 'react';
import cgpiLogo from 'figma:asset/2d625ad7f36a46709a1af6e4574d72029b82c6ea.png';
import {
  ArrowLeft,
  Save,
  Send,
  Info,
  DollarSign,
  MapPin,
  Target,
  Users,
  FileText,
  Plus,
  Trash2,
  Upload,
  AlertTriangle,
  CheckCircle2,
  X,
  Download,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { motion } from 'motion/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface EnlaceEditFormProps {
  compromiso: any;
  onClose: () => void;
  onSave: () => void;
  username: string;
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

const unidadesMedida = [
  'Personas beneficiadas',
  'Familias atendidas',
  'Obras entregadas',
  'Servicios implementados',
  'Kilómetros construidos',
  'Hectáreas reforestadas',
  'Estudiantes becados',
  'Equipos instalados',
  'Documentos emitidos',
  'Eventos realizados',
];

// Etapas de cumplimiento organizadas por categoría
const etapasCumplimiento = [
  { categoria: 'En planeación', tipo: 'Plan institucional o programa operativo' },
  { categoria: 'En planeación', tipo: 'Cronograma o carta Gantt' },
  { categoria: 'En planeación', tipo: 'Minuta o acta de reunión de trabajo' },
  { categoria: 'En planeación', tipo: 'Documento técnico de diagnóstico o anteproyecto' },
  { categoria: 'En planeación', tipo: 'Oficio de instrucción o acuerdo interno' },
  { categoria: 'En planeación', tipo: 'Documento de coordinación interinstitucional' },
  { categoria: 'En planeación', tipo: 'Informe de planeación interna' },
  { categoria: 'En planeación', tipo: 'Otro' },
  { categoria: 'En gestión', tipo: 'Oficio de solicitud presupuestal o de recursos' },
  { categoria: 'En gestión', tipo: 'Expediente técnico o administrativo' },
  { categoria: 'En gestión', tipo: 'Documento de validación normativa o dictamen técnico' },
  { categoria: 'En gestión', tipo: 'Convenio, contrato o acuerdo de coordinación' },
  { categoria: 'En gestión', tipo: 'Acta o minuta de Comité de Obra, Adquisiciones o Inversión' },
  { categoria: 'En gestión', tipo: 'Trámite o gestión ante instancia externa' },
  { categoria: 'En gestión', tipo: 'Correspondencia institucional' },
  { categoria: 'En gestión', tipo: 'Otro' },
  { categoria: 'En ejecución', tipo: 'Reporte de avance físico' },
  { categoria: 'En ejecución', tipo: 'Reporte de avance financiero' },
  { categoria: 'En ejecución', tipo: 'Informe de ejecución o de actividades' },
  { categoria: 'En ejecución', tipo: 'Acta de supervisión o visita de verificación' },
  { categoria: 'En ejecución', tipo: 'Contrato o documento de ejecución vigente' },
  { categoria: 'En ejecución', tipo: 'Evidencia fotográfica, audiovisual o georreferenciada' },
  { categoria: 'En ejecución', tipo: 'Oficios o documentos de coordinación interinstitucional en ejecución' },
  { categoria: 'En ejecución', tipo: 'Informe de beneficiarios o cobertura' },
  { categoria: 'En ejecución', tipo: 'Otro' },
  { categoria: 'Cumplido', tipo: 'Informe final de cumplimiento' },
  { categoria: 'Cumplido', tipo: 'Acta de entrega-recepción o de conclusión' },
  { categoria: 'Cumplido', tipo: 'Comunicado o constancia institucional de entrega pública' },
  { categoria: 'Cumplido', tipo: 'Reporte de beneficiarios o cobertura final' },
  { categoria: 'Cumplido', tipo: 'Acta de supervisión o verificación final' },
  { categoria: 'Cumplido', tipo: 'Dictamen o validación de la CGPI' },
  { categoria: 'Cumplido', tipo: 'Evidencia fotográfica, audiovisual o georreferenciada de resultados' },
  { categoria: 'Cumplido', tipo: 'Otro' },
];

export function EnlaceEditForm({ compromiso, onClose, onSave, username }: EnlaceEditFormProps) {
  // Estados del formulario
  const [etapa, setEtapa] = useState(compromiso.etapa);
  const [etapaSeleccionada, setEtapaSeleccionada] = useState('');
  const [mediosVerificacion, setMediosVerificacion] = useState<Array<{id: string; tipo: string; archivo: string; comentarios: string}>>([]);
  
  // Presupuestos históricos por año (solo lectura)
  const [presupuesto2021] = useState(2500000);
  const [presupuesto2022] = useState(3200000);
  const [presupuesto2023] = useState(4800000);
  const [presupuesto2024] = useState(5500000);
  
  // Presupuesto del año en curso (editable)
  const anoActual = 2025;
  const [presupuesto2025, setPresupuesto2025] = useState(6000000);
  const [presupuesto2026] = useState(0);  // Año futuro
  const [presupuesto2027] = useState(0);  // Año futuro
  
  // Comentarios CGPI y PDF para presupuesto
  const [comentariosCGPI, setComentariosCGPI] = useState<Array<{id: string; usuario: string; fecha: string; texto: string}>>([]);
  const [nuevoComentarioCGPI, setNuevoComentarioCGPI] = useState('');
  const [pdfPresupuesto, setPdfPresupuesto] = useState<string | null>(null);
  
  // Calcular total acumulado
  const presupuestoTotalAcumulado = presupuesto2021 + presupuesto2022 + presupuesto2023 + presupuesto2024 + presupuesto2025;
  
  const [cobertura, setCobertura] = useState('Municipal');
  const [municipiosSeleccionados, setMunicipiosSeleccionados] = useState<string[]>([
    'Tlaxcala',
    'Apizaco',
    'Chiautempan',
  ]);
  
  const [metas, setMetas] = useState([
    {
      id: 1,
      unidadMedida: 'Personas beneficiadas',
      descripcion: 'Familias beneficiadas con el programa',
      avance2021: 250,
      avance2022: 450,
      avance2023: 680,
      avance2024: 850,
      presupuesto: 5000000,
    },
    {
      id: 2,
      unidadMedida: 'Obras entregadas',
      descripcion: 'Infraestructura construida y entregada',
      avance2021: 5,
      avance2022: 12,
      avance2023: 18,
      avance2024: 25,
      presupuesto: 8000000,
    },
  ]);

  const [tieneBeneficiarios, setTieneBeneficiarios] = useState(true);
  const [tipoBeneficiario, setTipoBeneficiario] = useState('Personas físicas');
  const [numeroBeneficiarios, setNumeroBeneficiarios] = useState('2500');
  const [municipiosBeneficiarios, setMunicipiosBeneficiarios] = useState<string[]>([
    'Tlaxcala',
    'Apizaco',
  ]);

  const [archivos, setArchivos] = useState([
    { id: 1, nombre: 'Evidencia_Q4_2025.pdf', tipo: 'PDF', tamaño: '2.5 MB', obligatorio: true },
    { id: 2, nombre: 'Fotografias_avance.jpg', tipo: 'Imagen', tamaño: '4.2 MB', obligatorio: false },
  ]);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const presupuestoExcedido = presupuesto2025 > presupuestoTotalAcumulado;
  const presupuestoMayorAprobado = presupuesto2025 > presupuestoTotalAcumulado;

  const handleAgregarMeta = () => {
    if (metas.length < 10) {
      setMetas([
        ...metas,
        {
          id: metas.length + 1,
          unidadMedida: 'Personas beneficiadas',
          descripcion: '',
          avance2021: 0,
          avance2022: 0,
          avance2023: 0,
          avance2024: 0,
          presupuesto: 0,
        },
      ]);
    }
  };

  const handleEliminarMeta = (id: number) => {
    setMetas(metas.filter(m => m.id !== id));
  };

  const handleActualizarMeta = (id: number, campo: string, valor: any) => {
    setMetas(metas.map(m => m.id === id ? { ...m, [campo]: valor } : m));
  };

  const handleToggleMunicipio = (municipio: string) => {
    if (municipiosSeleccionados.includes(municipio)) {
      setMunicipiosSeleccionados(municipiosSeleccionados.filter(m => m !== municipio));
    } else {
      setMunicipiosSeleccionados([...municipiosSeleccionados, municipio]);
    }
  };

  const handleToggleMunicipioBeneficiario = (municipio: string) => {
    if (municipiosBeneficiarios.includes(municipio)) {
      setMunicipiosBeneficiarios(municipiosBeneficiarios.filter(m => m !== municipio));
    } else {
      setMunicipiosBeneficiarios([...municipiosBeneficiarios, municipio]);
    }
  };

  // Handlers para comentarios CGPI
  const handleAgregarComentarioCGPI = () => {
    if (nuevoComentarioCGPI.trim()) {
      const nuevoComentario = {
        id: Date.now().toString(),
        usuario: username,
        fecha: new Date().toLocaleString('es-MX'),
        texto: nuevoComentarioCGPI,
      };
      setComentariosCGPI([...comentariosCGPI, nuevoComentario]);
      setNuevoComentarioCGPI('');
    }
  };

  // Handlers para medios de verificación
  const handleAgregarMedioVerificacion = () => {
    const nuevoMedio = {
      id: Date.now().toString(),
      tipo: '',
      archivo: '',
      comentarios: '',
    };
    setMediosVerificacion([...mediosVerificacion, nuevoMedio]);
  };

  const handleEliminarMedioVerificacion = (id: string) => {
    setMediosVerificacion(mediosVerificacion.filter(m => m.id !== id));
  };

  const handleActualizarMedioVerificacion = (id: string, campo: string, valor: string) => {
    setMediosVerificacion(mediosVerificacion.map(m => 
      m.id === id ? { ...m, [campo]: valor } : m
    ));
  };

  // Obtener medios de verificación filtrados por etapa
  const getMediosVerificacionPorEtapa = (etapaCategoria: string) => {
    return etapasCumplimiento
      .filter(e => e.categoria.toLowerCase() === etapaCategoria.toLowerCase())
      .map(e => e.tipo);
  };

  const handleGuardarBorrador = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Borrador guardado exitosamente');
    }, 1000);
  };

  const handleEnviarRevision = () => {
    // Validar campos obligatorios
    const tienePDFObligatorio = archivos.some(a => a.obligatorio && a.tipo === 'PDF');
    
    if (!tienePDFObligatorio) {
      alert('Debe cargar un archivo PDF obligatorio como evidencia principal');
      return;
    }

    setShowConfirmDialog(true);
  };

  const confirmarEnvio = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowConfirmDialog(false);
      onSave();
    }, 1500);
  };

  const getEtapaColor = (etapa: string) => {
    switch (etapa) {
      case 'No iniciado': return '#9E9E9E';
      case 'En proceso': return '#1976D2';
      case '50%': return '#F9A825';
      case 'Cumplido': return '#2E7D32';
      default: return '#9E9E9E';
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
              <img 
                src={cgpiLogo} 
                alt="CGPI - Coordinación General de Planeación e Inversión" 
                className="h-10 w-auto object-contain"
              />
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline">
                    {compromiso.numero}
                  </Badge>
                  <Badge
                    className="border-0"
                    style={{
                      backgroundColor: `${getEtapaColor(etapa)}15`,
                      color: getEtapaColor(etapa),
                      fontWeight: 'bold',
                    }}
                  >
                    {etapa}
                  </Badge>
                </div>
                <h1 className="text-2xl" style={{ color: '#582672', fontWeight: 'bold' }}>
                  {compromiso.nombre}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Formulario de carga y actualización de información
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="presupuesto">Presupuesto</TabsTrigger>
            <TabsTrigger value="cobertura">Etapa y Cobertura</TabsTrigger>
            <TabsTrigger value="metas">Metas</TabsTrigger>
            <TabsTrigger value="beneficiarios">Beneficiarios</TabsTrigger>
          </TabsList>

          {/* A) INFORMACIÓN GENERAL */}
          <TabsContent value="general">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                    <Info className="w-5 h-5" />
                    A) Información General
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm text-gray-600">Nº de Compromiso</Label>
                      <div className="mt-2 p-3 bg-gray-100 rounded-lg">
                        <p className="text-sm" style={{ fontWeight: 'bold' }}>{compromiso.numero}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Campo de solo lectura</p>
                    </div>

                    <div>
                      <Label className="text-sm text-gray-600">Dependencia Responsable</Label>
                      <div className="mt-2 p-3 bg-gray-100 rounded-lg">
                        <p className="text-sm" style={{ fontWeight: 'bold' }}>
                          Secretaría de Planeación y Finanzas
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Campo de solo lectura</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-600 mb-2 block">
                      Dependencias Intervinientes
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Secretaría de Planeación y Finanzas (Principal)</Badge>
                      <Badge variant="outline">Secretaría de Obras Públicas</Badge>
                      <Badge variant="outline">Secretaría de Bienestar</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Campo de solo lectura</p>
                  </div>

                  <Separator />

                  <div>
                    <Label htmlFor="proyecto" className="text-sm text-gray-600">
                      Proyecto Asociado (Opcional)
                    </Label>
                    <Select defaultValue="ped">
                      <SelectTrigger id="proyecto" className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ped">Plan Estatal de Desarrollo 2021-2027</SelectItem>
                        <SelectItem value="otro1">Programa Sectorial de Infraestructura</SelectItem>
                        <SelectItem value="otro2">Programa de Desarrollo Social</SelectItem>
                        <SelectItem value="ninguno">Ninguno</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* B) PRESUPUESTO */}
          <TabsContent value="presupuesto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                    <DollarSign className="w-5 h-5" />
                    B) Presupuesto por Ejercicio Fiscal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Presupuesto Total Acumulado */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border-2" style={{ borderColor: '#582672' }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">PRESUPUESTO TOTAL ACUMULADO HISTÓRICO</p>
                        <p className="text-3xl" style={{ fontWeight: 'bold', color: '#582672' }}>
                          ${presupuestoTotalAcumulado.toLocaleString('es-MX')} MXN
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Suma de todos los ejercicios fiscales (2021-{anoActual})
                        </p>
                      </div>
                      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#58267220' }}>
                        <DollarSign className="w-8 h-8" style={{ color: '#582672' }} />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Presupuestos por año */}
                  <div>
                    <h3 className="text-base mb-4" style={{ fontWeight: 'bold', color: '#374151' }}>
                      PRESUPUESTO HISTÓRICO POR EJERCICIO FISCAL
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      {/* 2021 */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm text-gray-600">Ejercicio 2021</Label>
                          <Badge variant="outline" className="text-xs">Histórico</Badge>
                        </div>
                        <div className="p-3 bg-white rounded-lg">
                          <p className="text-lg" style={{ fontWeight: 'bold', color: '#374151' }}>
                            ${presupuesto2021.toLocaleString('es-MX')}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Solo lectura</p>
                      </div>

                      {/* 2022 */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm text-gray-600">Ejercicio 2022</Label>
                          <Badge variant="outline" className="text-xs">Histórico</Badge>
                        </div>
                        <div className="p-3 bg-white rounded-lg">
                          <p className="text-lg" style={{ fontWeight: 'bold', color: '#374151' }}>
                            ${presupuesto2022.toLocaleString('es-MX')}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Solo lectura</p>
                      </div>

                      {/* 2023 */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm text-gray-600">Ejercicio 2023</Label>
                          <Badge variant="outline" className="text-xs">Histórico</Badge>
                        </div>
                        <div className="p-3 bg-white rounded-lg">
                          <p className="text-lg" style={{ fontWeight: 'bold', color: '#374151' }}>
                            ${presupuesto2023.toLocaleString('es-MX')}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Solo lectura</p>
                      </div>

                      {/* 2024 */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm text-gray-600">Ejercicio 2024</Label>
                          <Badge variant="outline" className="text-xs">Histórico</Badge>
                        </div>
                        <div className="p-3 bg-white rounded-lg">
                          <p className="text-lg" style={{ fontWeight: 'bold', color: '#374151' }}>
                            ${presupuesto2024.toLocaleString('es-MX')}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Solo lectura</p>
                      </div>

                      {/* 2025 - Año actual (habilitado) */}
                      <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm" style={{ color: '#2E7D32', fontWeight: 'bold' }}>Ejercicio 2025</Label>
                          <Badge className="text-xs border-0" style={{ backgroundColor: '#2E7D32', color: 'white' }}>
                            Año actual
                          </Badge>
                        </div>
                        <div className="p-3 bg-white rounded-lg">
                          <p className="text-lg" style={{ fontWeight: 'bold', color: '#2E7D32' }}>
                            ${presupuesto2025.toLocaleString('es-MX')}
                          </p>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">Editable abajo</p>
                      </div>

                      {/* 2026 - Año futuro (solo visualización) */}
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 opacity-70">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm text-gray-600">Ejercicio 2026</Label>
                          <Badge variant="outline" className="text-xs border-blue-400 text-blue-700">Futuro</Badge>
                        </div>
                        <div className="p-3 bg-white rounded-lg">
                          <p className="text-lg text-gray-400" style={{ fontWeight: 'bold' }}>
                            ${presupuesto2026.toLocaleString('es-MX')}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Solo visualización</p>
                      </div>

                      {/* 2027 - Próximo (solo visualización) */}
                      <div className="bg-gray-100 rounded-lg p-4 border border-gray-300 opacity-60">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm text-gray-500">Ejercicio 2027</Label>
                          <Badge variant="outline" className="text-xs">Próximo</Badge>
                        </div>
                        <div className="p-3 bg-white rounded-lg">
                          <p className="text-lg text-gray-300" style={{ fontWeight: 'bold' }}>
                            ${presupuesto2027.toLocaleString('es-MX')}
                          </p>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Solo visualización</p>
                      </div>
                    </div>

                    <Separator />

                    {/* Año en curso - Editable */}
                    <div className="mt-6">
                      <h3 className="text-base mb-4" style={{ fontWeight: 'bold', color: '#374151' }}>
                        PRESUPUESTO DEL EJERCICIO FISCAL EN CURSO
                      </h3>
                      
                      <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                        <div className="flex items-center gap-2 mb-4">
                          <Badge className="border-0" style={{ backgroundColor: '#2E7D32', color: 'white' }}>
                            Ejercicio {anoActual}
                          </Badge>
                          <Badge variant="outline" className="text-xs border-green-600 text-green-700">
                            Actualización activa
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="presupuesto-actual" className="text-sm text-gray-700 mb-2 block">
                              Monto gastado en {anoActual} <span className="text-red-600">*</span>
                            </Label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                              <Input
                                id="presupuesto-actual"
                                type="number"
                                value={presupuesto2025}
                                onChange={(e) => setPresupuesto2025(Number(e.target.value))}
                                className="pl-8 text-lg"
                                style={{ fontWeight: 'bold' }}
                              />
                            </div>
                            <p className="text-xs text-gray-600 mt-2">
                              Ingrese el monto gastado en el ejercicio fiscal actual
                            </p>
                          </div>

                          <div>
                            <Label className="text-sm text-gray-700 mb-2 block">
                              Vista previa del formato
                            </Label>
                            <div className="p-4 bg-white rounded-lg border border-green-300">
                              <p className="text-xs text-gray-500 mb-1">Gasto {anoActual}:</p>
                              <p className="text-xl" style={{ fontWeight: 'bold', color: '#2E7D32' }}>
                                ${presupuesto2025.toLocaleString('es-MX')} MXN
                              </p>
                            </div>
                            <p className="text-xs text-gray-600 mt-2">
                              Así se mostrará en los reportes
                            </p>
                          </div>
                        </div>

                        <Alert className="border-blue-300 bg-blue-50 mt-4">
                          <Info className="w-4 h-4 text-blue-600" />
                          <AlertDescription className="text-sm text-blue-800">
                            <p style={{ fontWeight: 'bold' }}>Actualización de presupuesto {anoActual}</p>
                            <p className="text-xs mt-1">
                              Este es el único campo editable. Los montos de ejercicios anteriores (2021-2024) son de solo lectura.
                            </p>
                          </AlertDescription>
                        </Alert>

                        {/* Upload de PDF como medio de verificación */}
                        <div className="mt-6">
                          <Label className="text-sm text-gray-700 mb-2 block">
                            Medio de Verificación (PDF) <span className="text-red-600">*</span>
                          </Label>
                          <div className="flex items-center gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = '.pdf';
                                input.onchange = (e: any) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    setPdfPresupuesto(file.name);
                                  }
                                };
                                input.click();
                              }}
                              className="flex-shrink-0"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Subir PDF
                            </Button>
                            {pdfPresupuesto && (
                              <div className="flex items-center gap-2 flex-1 p-2 bg-white rounded border border-green-300">
                                <FileText className="w-4 h-4 text-green-600" />
                                <span className="text-sm" style={{ fontWeight: 'bold' }}>{pdfPresupuesto}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setPdfPresupuesto(null)}
                                  className="ml-auto"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-2">
                            Suba el documento PDF que comprueba el presupuesto ejercido en {anoActual}
                          </p>
                        </div>

                        {/* Módulo de comentarios CGPI */}
                        <div className="mt-6 border-t pt-6">
                          <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-5 h-5" style={{ color: '#582672' }} />
                            <h4 className="text-sm" style={{ fontWeight: 'bold', color: '#582672' }}>
                              Comentarios y Revisión CGPI
                            </h4>
                          </div>

                          {/* Lista de comentarios */}
                          {comentariosCGPI.length > 0 && (
                            <div className="space-y-2 mb-4">
                              {comentariosCGPI.map((comentario) => (
                                <div key={comentario.id} className="bg-purple-50 rounded-lg p-3 border border-purple-200">
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

                          {/* Agregar nuevo comentario */}
                          <div className="flex gap-2">
                            <Textarea
                              placeholder="Escriba observaciones o comentarios sobre el presupuesto..."
                              value={nuevoComentarioCGPI}
                              onChange={(e) => setNuevoComentarioCGPI(e.target.value)}
                              rows={3}
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              onClick={handleAgregarComentarioCGPI}
                              disabled={!nuevoComentarioCGPI.trim()}
                              style={{ backgroundColor: '#582672', color: 'white' }}
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Los comentarios ayudan a la CGPI en la revisión del presupuesto
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Resumen visual */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="text-sm mb-3" style={{ fontWeight: 'bold', color: '#1976D2' }}>
                      RESUMEN PRESUPUESTAL
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Acumulado histórico</p>
                        <p style={{ fontWeight: 'bold', color: '#374151' }}>
                          ${(presupuesto2021 + presupuesto2022 + presupuesto2023 + presupuesto2024).toLocaleString('es-MX')} MXN
                        </p>
                        <p className="text-xs text-gray-500 mt-1">2021-2024</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Ejercicio actual</p>
                        <p style={{ fontWeight: 'bold', color: '#2E7D32' }}>
                          ${presupuesto2025.toLocaleString('es-MX')} MXN
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{anoActual}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Total general</p>
                        <p style={{ fontWeight: 'bold', color: '#582672' }}>
                          ${presupuestoTotalAcumulado.toLocaleString('es-MX')} MXN
                        </p>
                        <p className="text-xs text-gray-500 mt-1">2021-{anoActual}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* C) ETAPA Y COBERTURA */}
          <TabsContent value="cobertura">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                    <MapPin className="w-5 h-5" />
                    C) Etapa y Cobertura
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* PASO 1: Selección de Etapa de Cumplimiento */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#582672', color: 'white' }}>
                        1
                      </div>
                      <h3 className="text-lg" style={{ color: '#582672', fontWeight: 'bold' }}>
                        Etapa de Cumplimiento
                      </h3>
                    </div>
                    
                    <Label htmlFor="etapa" className="text-sm text-gray-600 mb-2 block">
                      Seleccione la etapa actual del compromiso <span className="text-red-600">*</span>
                    </Label>
                    <Select value={etapaSeleccionada} onValueChange={setEtapaSeleccionada}>
                      <SelectTrigger id="etapa">
                        <SelectValue placeholder="Seleccione una etapa..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="En planeación">En planeación</SelectItem>
                        <SelectItem value="En gestión">En gestión</SelectItem>
                        <SelectItem value="En ejecución">En ejecución</SelectItem>
                        <SelectItem value="Cumplido">Cumplido</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-2">
                      La etapa seleccionada determinará los medios de verificación disponibles
                    </p>
                  </div>

                  {/* PASO 2: Medios de Verificación (solo si hay etapa seleccionada) */}
                  {etapaSeleccionada && (
                    <>
                      <Separator />
                      
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1976D2', color: 'white' }}>
                            2
                          </div>
                          <h3 className="text-lg" style={{ color: '#1976D2', fontWeight: 'bold' }}>
                            Medios de Verificación (Evidencias)
                          </h3>
                        </div>

                        <Alert className="border-blue-300 bg-blue-50 mb-4">
                          <Info className="w-4 h-4 text-blue-600" />
                          <AlertDescription className="text-sm text-blue-800">
                            Los tipos de evidencia disponibles están asociados a la etapa: <strong>{etapaSeleccionada}</strong>
                          </AlertDescription>
                        </Alert>

                        {/* Lista de medios de verificación */}
                        {mediosVerificacion.length > 0 && (
                          <div className="space-y-4 mb-4">
                            {mediosVerificacion.map((medio, index) => (
                              <Card key={medio.id} className="border-2 border-blue-100">
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between mb-3">
                                    <Badge variant="outline">Evidencia {index + 1}</Badge>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEliminarMedioVerificacion(medio.id)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>

                                  <div className="space-y-4">
                                    {/* Selector de tipo de medio */}
                                    <div>
                                      <Label className="text-sm text-gray-600 mb-2 block">
                                        Tipo de medio de verificación <span className="text-red-600">*</span>
                                      </Label>
                                      <Select 
                                        value={medio.tipo} 
                                        onValueChange={(value) => handleActualizarMedioVerificacion(medio.id, 'tipo', value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Seleccione el tipo..." />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-64">
                                          {getMediosVerificacionPorEtapa(etapaSeleccionada).map((tipo, idx) => (
                                            <SelectItem key={idx} value={tipo}>{tipo}</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    {/* Upload de archivo */}
                                    <div>
                                      <Label className="text-sm text-gray-600 mb-2 block">
                                        Archivo <span className="text-red-600">*</span>
                                      </Label>
                                      <div className="flex items-center gap-2">
                                        <Button
                                          type="button"
                                          variant="outline"
                                          onClick={() => {
                                            const input = document.createElement('input');
                                            input.type = 'file';
                                            input.accept = '.pdf,.jpg,.jpeg,.png,.mp4';
                                            input.onchange = (e: any) => {
                                              const file = e.target.files[0];
                                              if (file) {
                                                handleActualizarMedioVerificacion(medio.id, 'archivo', file.name);
                                              }
                                            };
                                            input.click();
                                          }}
                                          className="flex-shrink-0"
                                        >
                                          <Upload className="w-4 h-4 mr-2" />
                                          Subir archivo
                                        </Button>
                                        {medio.archivo && (
                                          <div className="flex items-center gap-2 flex-1 p-2 bg-green-50 rounded border border-green-300">
                                            <FileText className="w-4 h-4 text-green-600" />
                                            <span className="text-sm" style={{ fontWeight: 'bold' }}>{medio.archivo}</span>
                                          </div>
                                        )}
                                      </div>
                                      <p className="text-xs text-gray-500 mt-1">
                                        Formatos: PDF, JPG, PNG, MP4 • Máx: 50 MB
                                      </p>
                                    </div>

                                    {/* Comentarios del medio */}
                                    <div>
                                      <Label className="text-sm text-gray-600 mb-2 block">
                                        Comentarios / Observaciones
                                      </Label>
                                      <Textarea
                                        value={medio.comentarios}
                                        onChange={(e) => handleActualizarMedioVerificacion(medio.id, 'comentarios', e.target.value)}
                                        placeholder="Describa el contenido de la evidencia, contexto, o cualquier observación relevante..."
                                        rows={3}
                                      />
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}

                        {/* Botón para agregar medio de verificación */}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleAgregarMedioVerificacion}
                          className="w-full border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar Medio de Verificación
                        </Button>
                      </div>
                    </>
                  )}

                  {/* PASO 3: Cobertura (solo si hay etapa seleccionada) */}
                  {etapaSeleccionada && (
                    <>
                      <Separator />

                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#388E3C', color: 'white' }}>
                            3
                          </div>
                          <h3 className="text-lg" style={{ color: '#388E3C', fontWeight: 'bold' }}>
                            Tipo de Cobertura
                          </h3>
                        </div>

                        <Label className="text-sm text-gray-600 mb-3 block">
                          Seleccione el tipo de cobertura del compromiso <span className="text-red-600">*</span>
                        </Label>
                        <RadioGroup value={cobertura} onValueChange={setCobertura}>
                          <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <RadioGroupItem value="Estatal" id="estatal" />
                            <Label htmlFor="estatal" className="cursor-pointer flex-1">
                              <p style={{ fontWeight: 'bold' }}>Cobertura Estatal</p>
                              <p className="text-xs text-gray-500">El compromiso aplica a todo el estado</p>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors mt-2">
                            <RadioGroupItem value="Municipal" id="municipal" />
                            <Label htmlFor="municipal" className="cursor-pointer flex-1">
                              <p style={{ fontWeight: 'bold' }}>Cobertura Municipal</p>
                              <p className="text-xs text-gray-500">El compromiso aplica a municipios específicos</p>
                            </Label>
                          </div>
                        </RadioGroup>

                        {/* Selección de municipios (solo si es cobertura municipal) */}
                        {cobertura === 'Municipal' && (
                          <div className="mt-6">
                            <Label className="text-sm text-gray-600 mb-3 block">
                              Municipios Seleccionados ({municipiosSeleccionados.length})
                            </Label>

                            {/* Mini mapa visual */}
                            <div className="mb-4 p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200">
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
                                  {[...Array(municipiosSeleccionados.length)].map((_, i) => {
                                    const x = 30 + Math.random() * 40;
                                    const y = 30 + Math.random() * 40;
                                    return (
                                      <circle
                                        key={i}
                                        cx={x}
                                        cy={y}
                                        r="4"
                                        fill="#388E3C"
                                        stroke="white"
                                        strokeWidth="1"
                                      />
                                    );
                                  })}
                                </svg>
                              </div>
                            </div>

                            {/* Lista de municipios con checkboxes */}
                            <div className="border border-gray-200 rounded-lg p-4 bg-white max-h-64 overflow-y-auto">
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {municipiosTlaxcala.map((municipio) => (
                                  <div key={municipio} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`mun-${municipio}`}
                                      checked={municipiosSeleccionados.includes(municipio)}
                                      onCheckedChange={() => handleToggleMunicipio(municipio)}
                                    />
                                    <Label
                                      htmlFor={`mun-${municipio}`}
                                      className="text-sm cursor-pointer"
                                    >
                                      {municipio}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* D) METAS */}
          <TabsContent value="metas">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                      <Target className="w-5 h-5" />
                      D) Metas del Compromiso ({metas.length}/10)
                    </CardTitle>
                    <Button
                      onClick={handleAgregarMeta}
                      disabled={metas.length >= 10}
                      style={{ backgroundColor: '#582672', color: 'white' }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Meta
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {metas.length >= 10 && (
                    <Alert className="border-orange-300 bg-orange-50">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      <AlertDescription className="text-sm text-orange-800">
                        Ha alcanzado el límite máximo de 10 metas por compromiso
                      </AlertDescription>
                    </Alert>
                  )}

                  {metas.map((meta, index) => (
                    <Card key={meta.id} className="border-2 border-purple-100 bg-purple-50/30">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <Badge style={{ backgroundColor: '#582672', color: 'white' }}>
                            Meta {index + 1}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEliminarMeta(meta.id)}
                            className="hover:bg-red-100 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm text-gray-600">Unidad de Medida</Label>
                              <Select
                                value={meta.unidadMedida}
                                onValueChange={(value) => handleActualizarMeta(meta.id, 'unidadMedida', value)}
                              >
                                <SelectTrigger className="mt-2">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {unidadesMedida.map(unidad => (
                                    <SelectItem key={unidad} value={unidad}>{unidad}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className="text-sm text-gray-600">Presupuesto Asignado (MXN)</Label>
                              <Input
                                type="number"
                                value={meta.presupuesto}
                                onChange={(e) => handleActualizarMeta(meta.id, 'presupuesto', Number(e.target.value))}
                                className="mt-2"
                              />
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm text-gray-600">Descripción de la Meta</Label>
                            <Textarea
                              value={meta.descripcion}
                              onChange={(e) => handleActualizarMeta(meta.id, 'descripcion', e.target.value)}
                              placeholder="Describa la meta del compromiso..."
                              rows={2}
                              className="mt-2"
                            />
                          </div>

                          <div>
                            <Label className="text-sm text-gray-600 mb-2 block">Avance Anual</Label>
                            <div className="grid grid-cols-4 gap-3">
                              <div>
                                <Label htmlFor={`meta-${meta.id}-2021`} className="text-xs text-gray-500">
                                  2021
                                </Label>
                                <Input
                                  id={`meta-${meta.id}-2021`}
                                  type="number"
                                  value={meta.avance2021}
                                  onChange={(e) => handleActualizarMeta(meta.id, 'avance2021', Number(e.target.value))}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`meta-${meta.id}-2022`} className="text-xs text-gray-500">
                                  2022
                                </Label>
                                <Input
                                  id={`meta-${meta.id}-2022`}
                                  type="number"
                                  value={meta.avance2022}
                                  onChange={(e) => handleActualizarMeta(meta.id, 'avance2022', Number(e.target.value))}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`meta-${meta.id}-2023`} className="text-xs text-gray-500">
                                  2023
                                </Label>
                                <Input
                                  id={`meta-${meta.id}-2023`}
                                  type="number"
                                  value={meta.avance2023}
                                  onChange={(e) => handleActualizarMeta(meta.id, 'avance2023', Number(e.target.value))}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`meta-${meta.id}-2024`} className="text-xs text-gray-500">
                                  2024
                                </Label>
                                <Input
                                  id={`meta-${meta.id}-2024`}
                                  type="number"
                                  value={meta.avance2024}
                                  onChange={(e) => handleActualizarMeta(meta.id, 'avance2024', Number(e.target.value))}
                                  className="mt-1"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {metas.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Target className="w-12 h-12 mx-auto mb-4 opacity-30" />
                      <p>No hay metas registradas. Haga clic en "Agregar Meta" para comenzar.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* E) BENEFICIARIOS */}
          <TabsContent value="beneficiarios">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                    <Users className="w-5 h-5" />
                    E) Beneficiarios (Modalidad S)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="tiene-beneficiarios"
                      checked={tieneBeneficiarios}
                      onCheckedChange={(checked) => setTieneBeneficiarios(checked as boolean)}
                    />
                    <Label htmlFor="tiene-beneficiarios" className="cursor-pointer">
                      Este compromiso tiene beneficiarios directos
                    </Label>
                  </div>

                  {tieneBeneficiarios && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="tipo-beneficiario" className="text-sm text-gray-600">
                            Tipo de Beneficiario
                          </Label>
                          <Select value={tipoBeneficiario} onValueChange={setTipoBeneficiario}>
                            <SelectTrigger id="tipo-beneficiario" className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Personas físicas">Personas físicas</SelectItem>
                              <SelectItem value="Familias">Familias</SelectItem>
                              <SelectItem value="Empresas">Empresas</SelectItem>
                              <SelectItem value="Organizaciones">Organizaciones</SelectItem>
                              <SelectItem value="Instituciones">Instituciones</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="numero-beneficiarios" className="text-sm text-gray-600">
                            Número Total de Beneficiarios
                          </Label>
                          <Input
                            id="numero-beneficiarios"
                            type="number"
                            value={numeroBeneficiarios}
                            onChange={(e) => setNumeroBeneficiarios(e.target.value)}
                            className="mt-2"
                          />
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <Label className="text-sm text-gray-600 mb-3 block">
                          Municipios donde aplica ({municipiosBeneficiarios.length})
                        </Label>
                        <div className="border border-gray-200 rounded-lg p-4 bg-white max-h-64 overflow-y-auto">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {municipiosTlaxcala.map((municipio) => (
                              <div key={municipio} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`ben-${municipio}`}
                                  checked={municipiosBeneficiarios.includes(municipio)}
                                  onCheckedChange={() => handleToggleMunicipioBeneficiario(municipio)}
                                />
                                <Label
                                  htmlFor={`ben-${municipio}`}
                                  className="text-sm cursor-pointer"
                                >
                                  {municipio}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <h4 className="text-sm mb-2" style={{ fontWeight: 'bold', color: '#2E7D32' }}>
                          Resumen de Beneficiarios
                        </h4>
                        <div className="space-y-1 text-sm">
                          <p><strong>Tipo:</strong> {tipoBeneficiario}</p>
                          <p><strong>Número total:</strong> {Number(numeroBeneficiarios).toLocaleString('es-MX')}</p>
                          <p><strong>Municipios:</strong> {municipiosBeneficiarios.length}</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Botones de acción finales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8"
        >
          <Card className="border-2 border-purple-200 bg-purple-50/30">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  <p>
                    <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="text-xs mt-1">
                    Usuario: {username}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleGuardarBorrador}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        Guardando...
                      </div>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar Borrador
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleEnviarRevision}
                    disabled={isSaving}
                    style={{ backgroundColor: '#582672', color: 'white' }}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Enviar a Revisión CGPI
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Modal de confirmación */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2" style={{ color: '#582672' }}>
              <AlertTriangle className="w-5 h-5" />
              Confirmar envío a revisión
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-3 mt-3">
                <p>
                  ¿Está seguro de enviar este compromiso a revisión de la CGPI?
                </p>
                <Alert className="border-orange-300 bg-orange-50">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <AlertDescription className="text-sm text-orange-800">
                    <p style={{ fontWeight: 'bold' }}>Importante:</p>
                    <ul className="list-disc list-inside text-xs mt-2 space-y-1">
                      <li>No podrá editar la información hasta que sea revisada</li>
                      <li>La CGPI validará todos los datos ingresados</li>
                      <li>Recibirá una notificación con el resultado de la revisión</li>
                    </ul>
                  </AlertDescription>
                </Alert>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-xs text-blue-900">
                    <strong>Compromiso:</strong> {compromiso.numero} - {compromiso.nombre}
                  </p>
                  <p className="text-xs text-blue-800 mt-1">
                    <strong>Etapa actual:</strong> {etapa}
                  </p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmarEnvio}
              style={{ backgroundColor: '#582672' }}
            >
              {isSaving ? 'Enviando...' : 'Confirmar y Enviar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
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