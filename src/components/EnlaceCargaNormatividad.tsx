import { useState } from 'react';
import {
  Save,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  Building2,
  Calendar,
  Info,
  Trash2,
  Download,
  Edit3,
  Eye,
  Plus,
  X,
  Link as LinkIcon,
  Home,
  Sparkles,
  ArrowLeft,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

interface EnlaceCargaNormatividadProps {
  userName: string;
  onVolverInicio?: () => void;
}

interface DocumentoNormativo {
  id: string;
  nombreDocumento: string;
  tipoNormatividad: string;
  ambitoAplicacion: string;
  fechaPublicacion: string;
  vigenciaDesde: string;
  enlaceFuente: string;
  descripcion: string;
  nombreArchivo: string;
  tamanoArchivo: number;
  fechaCarga: string;
  usuarioCarga: string;
  estatus: 'cargado' | 'pendiente';
}

const TIPOS_NORMATIVIDAD = [
  'Ley',
  'Reglamento',
  'Lineamiento',
  'Acuerdo',
  'Manual',
  'Circular',
  'Decreto',
  'Norma Oficial',
  'Políticas',
  'Procedimiento',
  'Otro',
];

const AMBITOS_APLICACION = [
  'Federal',
  'Estatal',
  'Municipal',
  'Institucional',
];

// Datos mock de documentos precargados
const DOCUMENTOS_MOCK: DocumentoNormativo[] = [
  {
    id: 'DOC-001',
    nombreDocumento: 'Ley Federal de Presupuesto y Responsabilidad Hacendaria',
    tipoNormatividad: 'Ley',
    ambitoAplicacion: 'Federal',
    fechaPublicacion: '2006-03-30',
    vigenciaDesde: '2006-04-01',
    enlaceFuente: 'https://www.dof.gob.mx/nota_detalle.php?codigo=...',
    descripcion: 'Marco normativo principal que regula la programación, presupuestación, aprobación, ejercicio, control y evaluación de los ingresos y egresos públicos federales.',
    nombreArchivo: 'LFPRH_2024.pdf',
    tamanoArchivo: 2457600, // ~2.4 MB
    fechaCarga: '2025-01-15',
    usuarioCarga: 'enlace',
    estatus: 'cargado',
  },
  {
    id: 'DOC-002',
    nombreDocumento: 'Lineamientos de Transparencia y Acceso a la Información',
    tipoNormatividad: 'Lineamiento',
    ambitoAplicacion: 'Estatal',
    fechaPublicacion: '2023-06-15',
    vigenciaDesde: '2023-07-01',
    enlaceFuente: 'https://transparencia.tlaxcala.gob.mx/lineamientos',
    descripcion: 'Establecen los procedimientos y criterios para garantizar el derecho de acceso a la información pública gubernamental en el estado de Tlaxcala.',
    nombreArchivo: 'lineamientos_transparencia_2024.pdf',
    tamanoArchivo: 1843200, // ~1.8 MB
    fechaCarga: '2025-02-20',
    usuarioCarga: 'enlace',
    estatus: 'cargado',
  },
  {
    id: 'DOC-003',
    nombreDocumento: 'Manual de Organización de la Secretaría de Educación',
    tipoNormatividad: 'Manual',
    ambitoAplicacion: 'Institucional',
    fechaPublicacion: '2024-01-10',
    vigenciaDesde: '2024-02-01',
    enlaceFuente: 'https://sepe.tlaxcala.gob.mx/manuales/organizacion',
    descripcion: 'Define la estructura organizacional, funciones y responsabilidades de las unidades administrativas que conforman la Secretaría de Educación Pública del Estado.',
    nombreArchivo: 'manual_organizacion_sep_2024.pdf',
    tamanoArchivo: 3276800, // ~3.2 MB
    fechaCarga: '2025-03-05',
    usuarioCarga: 'enlace',
    estatus: 'cargado',
  },
];

export function EnlaceCargaNormatividad({ userName, onVolverInicio }: EnlaceCargaNormatividadProps) {
  const dependenciaAsignada = 'Secretaría de Educación Pública';
  const fechaActual = new Date().toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const [documentos, setDocumentos] = useState<DocumentoNormativo[]>(DOCUMENTOS_MOCK);
  const [modoFormulario, setModoFormulario] = useState<'nuevo' | 'editar' | null>(null);
  const [documentoEditando, setDocumentoEditando] = useState<string | null>(null);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    nombreDocumento: '',
    tipoNormatividad: '',
    ambitoAplicacion: '',
    fechaPublicacion: '',
    vigenciaDesde: '',
    enlaceFuente: '',
    descripcion: '',
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData({
      nombreDocumento: '',
      tipoNormatividad: '',
      ambitoAplicacion: '',
      fechaPublicacion: '',
      vigenciaDesde: '',
      enlaceFuente: '',
      descripcion: '',
    });
    setArchivoSeleccionado(null);
    setErrors({});
    setModoFormulario(null);
    setDocumentoEditando(null);
  };

  const handleNuevoDocumento = () => {
    resetForm();
    setModoFormulario('nuevo');
  };

  const handleEditarDocumento = (doc: DocumentoNormativo) => {
    setFormData({
      nombreDocumento: doc.nombreDocumento,
      tipoNormatividad: doc.tipoNormatividad,
      ambitoAplicacion: doc.ambitoAplicacion,
      fechaPublicacion: doc.fechaPublicacion,
      vigenciaDesde: doc.vigenciaDesde,
      enlaceFuente: doc.enlaceFuente,
      descripcion: doc.descripcion,
    });
    setDocumentoEditando(doc.id);
    setModoFormulario('editar');
  };

  const handleEliminarDocumento = (id: string) => {
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este documento? Esta acción no se puede deshacer.');
    if (confirmar) {
      setDocumentos(documentos.filter(d => d.id !== id));
    }
  };

  const handleArchivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar que sea PDF
      if (file.type !== 'application/pdf') {
        setErrors({ ...errors, archivo: 'Solo se permiten archivos PDF' });
        setArchivoSeleccionado(null);
        return;
      }
      
      // Validar tamaño máximo (10 MB)
      const maxSize = 10 * 1024 * 1024; // 10 MB
      if (file.size > maxSize) {
        setErrors({ ...errors, archivo: 'El archivo no debe superar los 10 MB' });
        setArchivoSeleccionado(null);
        return;
      }

      setArchivoSeleccionado(file);
      setErrors({ ...errors, archivo: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombreDocumento.trim()) {
      newErrors.nombreDocumento = 'El nombre del documento es obligatorio';
    }
    if (!formData.tipoNormatividad) {
      newErrors.tipoNormatividad = 'Debe seleccionar el tipo de normatividad';
    }
    if (!formData.ambitoAplicacion) {
      newErrors.ambitoAplicacion = 'Debe seleccionar el ámbito de aplicación';
    }
    if (!formData.fechaPublicacion) {
      newErrors.fechaPublicacion = 'La fecha de publicación es obligatoria';
    }
    if (!formData.vigenciaDesde) {
      newErrors.vigenciaDesde = 'La fecha de vigencia es obligatoria';
    }
    if (!formData.descripcion.trim() || formData.descripcion.length < 20) {
      newErrors.descripcion = 'La descripción debe tener al menos 20 caracteres';
    }

    // Validar archivo solo si es nuevo documento
    if (modoFormulario === 'nuevo' && !archivoSeleccionado) {
      newErrors.archivo = 'Debe cargar un archivo PDF';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGuardar = () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    // Simular guardado
    setTimeout(() => {
      if (modoFormulario === 'nuevo') {
        const nuevoDocumento: DocumentoNormativo = {
          id: `DOC-${String(documentos.length + 1).padStart(3, '0')}`,
          nombreDocumento: formData.nombreDocumento,
          tipoNormatividad: formData.tipoNormatividad,
          ambitoAplicacion: formData.ambitoAplicacion,
          fechaPublicacion: formData.fechaPublicacion,
          vigenciaDesde: formData.vigenciaDesde,
          enlaceFuente: formData.enlaceFuente,
          descripcion: formData.descripcion,
          nombreArchivo: archivoSeleccionado?.name || '',
          tamanoArchivo: archivoSeleccionado?.size || 0,
          fechaCarga: new Date().toISOString().split('T')[0],
          usuarioCarga: userName,
          estatus: 'cargado',
        };
        setDocumentos([...documentos, nuevoDocumento]);
      } else if (modoFormulario === 'editar' && documentoEditando) {
        setDocumentos(documentos.map(doc => 
          doc.id === documentoEditando
            ? {
                ...doc,
                nombreDocumento: formData.nombreDocumento,
                tipoNormatividad: formData.tipoNormatividad,
                ambitoAplicacion: formData.ambitoAplicacion,
                fechaPublicacion: formData.fechaPublicacion,
                vigenciaDesde: formData.vigenciaDesde,
                enlaceFuente: formData.enlaceFuente,
                descripcion: formData.descripcion,
                nombreArchivo: archivoSeleccionado?.name || doc.nombreArchivo,
                tamanoArchivo: archivoSeleccionado?.size || doc.tamanoArchivo,
              }
            : doc
        ));
      }

      setIsSaving(false);
      setShowSuccessModal(true);
      resetForm();
    }, 1000);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTipoColor = (tipo: string): string => {
    const colors: Record<string, string> = {
      'Ley': '#D32F2F',
      'Reglamento': '#F57C00',
      'Lineamiento': '#1976D2',
      'Acuerdo': '#7B1FA2',
      'Manual': '#388E3C',
      'Circular': '#C2185B',
      'Decreto': '#D32F2F',
      'Norma Oficial': '#0288D1',
      'Políticas': '#5D4037',
      'Procedimiento': '#00796B',
      'Otro': '#616161',
    };
    return colors[tipo] || '#616161';
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
          onClick={onVolverInicio}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
        </Button>
        <h1 className="text-3xl mb-2" style={{ color: '#582672', fontWeight: 'bold' }}>
          NORMATIVIDAD
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
                    <p className="text-sm text-gray-600">FECHA ACTUAL</p>
                  </div>
                  <p className="text-base" style={{ fontWeight: 'bold', color: '#1976D2' }}>
                    {fechaActual}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Información general */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Alert className="border-purple-300 bg-purple-50">
          <Info className="h-4 w-4 text-purple-600" />
          <AlertTitle className="text-purple-800">CARGA DE NORMATIVIDAD</AlertTitle>
          <AlertDescription className="text-purple-700">
            Registra los documentos normativos aplicables a tu dependencia. Los archivos deben estar en formato PDF y no exceder los 10 MB.
            Completa todos los campos obligatorios para poder guardar la información.
          </AlertDescription>
        </Alert>
      </motion.div>

      {/* Formulario de carga/edición */}
      {modoFormulario && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="border-2" style={{ borderColor: '#84cc16' }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                  <FileText className="w-5 h-5" />
                  {modoFormulario === 'nuevo' ? 'NUEVO DOCUMENTO NORMATIVO' : 'EDITAR DOCUMENTO NORMATIVO'}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={resetForm}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sección de carga de archivo */}
              <div>
                <h3 className="text-base mb-4" style={{ fontWeight: 'bold', color: '#374151' }}>
                  1. ARCHIVO NORMATIVO
                </h3>
                <div className="border-2 border-dashed rounded-lg p-6 bg-gray-50">
                  <div className="flex flex-col items-center justify-center">
                    {archivoSeleccionado ? (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-full"
                      >
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border-2 border-green-200">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#2E7D3220' }}>
                              <FileText className="w-6 h-6" style={{ color: '#2E7D32' }} />
                            </div>
                            <div>
                              <p className="text-sm" style={{ fontWeight: 'bold', color: '#2E7D32' }}>
                                {archivoSeleccionado.name}
                              </p>
                              <p className="text-xs text-gray-600">
                                {formatFileSize(archivoSeleccionado.size)}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setArchivoSeleccionado(null)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                          {modoFormulario === 'editar' ? 'Reemplazar archivo (opcional)' : 'Arrastra tu archivo aquí o haz clic para seleccionar'}
                        </p>
                        <p className="text-xs text-gray-500 mb-4">
                          Formato permitido: PDF • Tamaño máximo: 10 MB
                        </p>
                        <input
                          type="file"
                          accept=".pdf"
                          id="file-upload"
                          className="hidden"
                          onChange={handleArchivoChange}
                        />
                        <Button
                          onClick={() => document.getElementById('file-upload')?.click()}
                          style={{ backgroundColor: '#84cc16' }}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          SELECCIONAR ARCHIVO
                        </Button>
                      </>
                    )}
                  </div>
                  {errors.archivo && (
                    <Alert className="border-red-300 bg-red-50 mt-4">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-700">
                        {errors.archivo}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>

              {/* Metadatos del documento */}
              <div>
                <h3 className="text-base mb-4" style={{ fontWeight: 'bold', color: '#374151' }}>
                  2. INFORMACIÓN DEL DOCUMENTO
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                      NOMBRE DEL DOCUMENTO *
                    </label>
                    <Input
                      value={formData.nombreDocumento}
                      onChange={(e) => setFormData({ ...formData, nombreDocumento: e.target.value })}
                      placeholder="Ej. Ley Federal de Presupuesto y Responsabilidad Hacendaria"
                      className={errors.nombreDocumento ? 'border-red-500' : ''}
                    />
                    {errors.nombreDocumento && (
                      <p className="text-xs text-red-600 mt-1">{errors.nombreDocumento}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                      TIPO DE NORMATIVIDAD *
                    </label>
                    <Select value={formData.tipoNormatividad} onValueChange={(value) => setFormData({ ...formData, tipoNormatividad: value })}>
                      <SelectTrigger className={errors.tipoNormatividad ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Seleccione el tipo..." />
                      </SelectTrigger>
                      <SelectContent>
                        {TIPOS_NORMATIVIDAD.map(tipo => (
                          <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.tipoNormatividad && (
                      <p className="text-xs text-red-600 mt-1">{errors.tipoNormatividad}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                      ÁMBITO DE APLICACIÓN *
                    </label>
                    <Select value={formData.ambitoAplicacion} onValueChange={(value) => setFormData({ ...formData, ambitoAplicacion: value })}>
                      <SelectTrigger className={errors.ambitoAplicacion ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Seleccione el ámbito..." />
                      </SelectTrigger>
                      <SelectContent>
                        {AMBITOS_APLICACION.map(ambito => (
                          <SelectItem key={ambito} value={ambito}>{ambito}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.ambitoAplicacion && (
                      <p className="text-xs text-red-600 mt-1">{errors.ambitoAplicacion}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                      FECHA DE PUBLICACIÓN *
                    </label>
                    <Input
                      type="date"
                      value={formData.fechaPublicacion}
                      onChange={(e) => setFormData({ ...formData, fechaPublicacion: e.target.value })}
                      className={errors.fechaPublicacion ? 'border-red-500' : ''}
                    />
                    {errors.fechaPublicacion && (
                      <p className="text-xs text-red-600 mt-1">{errors.fechaPublicacion}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                      VIGENCIA DESDE *
                    </label>
                    <Input
                      type="date"
                      value={formData.vigenciaDesde}
                      onChange={(e) => setFormData({ ...formData, vigenciaDesde: e.target.value })}
                      className={errors.vigenciaDesde ? 'border-red-500' : ''}
                    />
                    {errors.vigenciaDesde && (
                      <p className="text-xs text-red-600 mt-1">{errors.vigenciaDesde}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                      ENLACE / FUENTE OFICIAL (OPCIONAL)
                    </label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        value={formData.enlaceFuente}
                        onChange={(e) => setFormData({ ...formData, enlaceFuente: e.target.value })}
                        placeholder="https://www.ejemplo.gob.mx/documento"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                      DESCRIPCIÓN / RESUMEN DEL CONTENIDO *
                    </label>
                    <Textarea
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      placeholder="Describe brevemente el contenido del documento y su aplicabilidad..."
                      rows={4}
                      className={errors.descripcion ? 'border-red-500' : ''}
                    />
                    {errors.descripcion && (
                      <p className="text-xs text-red-600 mt-1">{errors.descripcion}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Mínimo 20 caracteres • {formData.descripcion.length} / 500
                    </p>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={resetForm}
                  disabled={isSaving}
                >
                  CANCELAR
                </Button>
                <Button
                  onClick={handleGuardar}
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
                      {modoFormulario === 'nuevo' ? 'GUARDAR DOCUMENTO' : 'ACTUALIZAR DOCUMENTO'}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Listado de documentos cargados */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: modoFormulario ? 0.3 : 0.2 }}
      >
        <Card className="border-2" style={{ borderColor: '#1976D2' }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                  <FileText className="w-5 h-5" />
                  DOCUMENTOS NORMATIVOS CARGADOS
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Total de documentos: <span style={{ fontWeight: 'bold' }}>{documentos.length}</span>
                </p>
              </div>
              {!modoFormulario && (
                <Button
                  onClick={handleNuevoDocumento}
                  style={{ backgroundColor: '#84cc16' }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  NUEVO DOCUMENTO
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {documentos.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#84cc1615' }}>
                  <FileText className="w-10 h-10" style={{ color: '#84cc16' }} />
                </div>
                <h3 className="text-xl mb-2" style={{ color: '#374151', fontWeight: 'bold' }}>
                  NO HAY DOCUMENTOS CARGADOS
                </h3>
                <p className="text-gray-600 mb-6">
                  Comienza agregando el primer documento normativo de tu dependencia
                </p>
                <Button
                  onClick={handleNuevoDocumento}
                  style={{ backgroundColor: '#84cc16' }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  CARGAR PRIMER DOCUMENTO
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NOMBRE DEL DOCUMENTO</TableHead>
                      <TableHead className="w-[140px]">TIPO</TableHead>
                      <TableHead className="w-[120px]">ÁMBITO</TableHead>
                      <TableHead className="w-[140px]">FECHA PUBLICACIÓN</TableHead>
                      <TableHead className="w-[100px]">ESTATUS</TableHead>
                      <TableHead className="w-[200px] text-center">ACCIONES</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documentos.map((doc, index) => (
                      <motion.tr
                        key={doc.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <TableCell>
                          <div>
                            <p className="text-sm mb-1" style={{ fontWeight: 'bold', color: '#374151' }}>
                              {doc.nombreDocumento}
                            </p>
                            <div className="flex items-center gap-2">
                              <FileText className="w-3 h-3 text-gray-400" />
                              <p className="text-xs text-gray-500">
                                {doc.nombreArchivo} • {formatFileSize(doc.tamanoArchivo)}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className="text-xs border-0"
                            style={{
                              backgroundColor: `${getTipoColor(doc.tipoNormatividad)}15`,
                              color: getTipoColor(doc.tipoNormatividad),
                            }}
                          >
                            {doc.tipoNormatividad}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-600">{doc.ambitoAplicacion}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-600">
                            {formatDate(doc.fechaPublicacion)}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge className="text-xs border-0 bg-green-100 text-green-800">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            CARGADO
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.alert('Descargando: ' + doc.nombreArchivo)}
                              className="text-blue-600 border-blue-300 hover:bg-blue-50"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Descargar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditarDocumento(doc)}
                              className="text-purple-600 border-purple-300 hover:bg-purple-50"
                            >
                              <Edit3 className="w-3 h-3 mr-1" />
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEliminarDocumento(doc.id)}
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Modal de éxito */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header con animación de éxito */}
              <div className="relative overflow-hidden">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
                
                <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 text-center relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: 'spring', 
                      damping: 10, 
                      stiffness: 200,
                      delay: 0.2 
                    }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
                    style={{ backgroundColor: '#2E7D3220' }}
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        type: 'spring', 
                        damping: 12, 
                        stiffness: 200,
                        delay: 0.4 
                      }}
                    >
                      <CheckCircle2 className="w-12 h-12" style={{ color: '#2E7D32' }} />
                    </motion.div>
                  </motion.div>

                  {/* Partículas decorativas */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0, y: 0 }}
                      animate={{ 
                        opacity: [0, 1, 0], 
                        scale: [0, 1, 0.5],
                        y: [-20, -60, -100],
                        x: [0, (i - 3) * 15, (i - 3) * 25]
                      }}
                      transition={{ 
                        duration: 1.5, 
                        delay: 0.5 + i * 0.1,
                        ease: 'easeOut'
                      }}
                      className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
                      style={{ backgroundColor: i % 2 === 0 ? '#2E7D32' : '#84cc16' }}
                    />
                  ))}

                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-2xl mb-2"
                    style={{ fontWeight: 'bold', color: '#2E7D32' }}
                  >
                    ¡Documento guardado exitosamente!
                  </motion.h2>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-gray-600"
                  >
                    El documento normativo ha sido registrado correctamente en el sistema.
                  </motion.p>
                </div>
              </div>

              {/* Botón de acción */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="p-6"
              >
                <Button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full"
                  style={{ backgroundColor: '#84cc16' }}
                >
                  CONTINUAR
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
