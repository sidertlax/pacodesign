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
  ArrowLeft,
  Clock,
  FileCheck,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
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
import { toast } from 'sonner@2.0.3';

interface EnlaceCargaNormatividadProps {
  userName: string;
  onVolverInicio?: () => void;
}

// Tipos de documentos normativos obligatorios
const DOCUMENTOS_OBLIGATORIOS = [
  {
    id: 'doc-1',
    nombre: 'I. Extracto de la Ley Orgánica de la Administración Pública Estatal aplicable',
    codigo: 'LEY_ORGANICA',
  },
  {
    id: 'doc-2',
    nombre: 'II. Organigrama institucional',
    codigo: 'ORGANIGRAMA',
  },
  {
    id: 'doc-3',
    nombre: 'III. Reglamento Interior',
    codigo: 'REGLAMENTO',
  },
  {
    id: 'doc-4',
    nombre: 'IV. Manual de Organización',
    codigo: 'MANUAL_ORG',
  },
  {
    id: 'doc-5',
    nombre: 'V. Manuales de Procedimientos',
    codigo: 'MANUAL_PROC',
  },
];

// Estatus del Enlace (controlado por el usuario enlace)
type EstatusEnlace = 'pendiente' | 'solicitado' | 'subido' | 'en_validacion';

// Estatus de CGPI (controlado por el administrador)
type EstatusCGPI = '' | 'recibido' | 'revisado' | 'requiere_atencion';

interface DocumentoNormativo {
  id: string;
  codigo: string;
  nombre: string;
  estatusEnlace: EstatusEnlace;
  estatusCGPI: EstatusCGPI;
  archivo?: {
    nombre: string;
    tamano: number;
    fechaCarga: string;
    url: string;
  };
}

export function EnlaceCargaNormatividad({ userName, onVolverInicio }: EnlaceCargaNormatividadProps) {
  const dependenciaAsignada = 'Secretaría de Educación Pública';
  const fechaActual = new Date().toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Estado inicial de documentos - solo doc-2 y doc-4 tienen archivos subidos como ejemplo
  const [documentos, setDocumentos] = useState<DocumentoNormativo[]>(
    DOCUMENTOS_OBLIGATORIOS.map((doc, index) => {
      // Documentos de ejemplo precargados
      if (doc.id === 'doc-2') {
        return {
          ...doc,
          estatusEnlace: 'en_validacion' as EstatusEnlace,
          estatusCGPI: 'revisado' as EstatusCGPI,
          archivo: {
            nombre: 'organigrama_sepe_2025.pdf',
            tamano: 1856340,
            fechaCarga: '2025-11-20',
            url: '#',
          },
        };
      }
      if (doc.id === 'doc-4') {
        return {
          ...doc,
          estatusEnlace: 'subido' as EstatusEnlace,
          estatusCGPI: 'recibido' as EstatusCGPI,
          archivo: {
            nombre: 'manual_organizacion_2025.pdf',
            tamano: 2945678,
            fechaCarga: '2025-11-22',
            url: '#',
          },
        };
      }
      return {
        ...doc,
        estatusEnlace: 'pendiente' as EstatusEnlace,
        estatusCGPI: '' as EstatusCGPI,
      };
    })
  );

  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);

  // Calcular métricas para la semaforización
  const documentosSubidos = documentos.filter(d => d.archivo).length;
  const documentosValidados = documentos.filter(d => d.estatusCGPI === 'revisado').length;
  const totalDocumentos = documentos.length;

  const handleFileSelect = (docId: string, file: File) => {
    // Validar que sea PDF
    if (file.type !== 'application/pdf') {
      toast.error('Error de formato', {
        description: 'Solo se permiten archivos PDF',
      });
      return;
    }

    // Validar tamaño máximo (10 MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Archivo muy grande', {
        description: 'El archivo no debe superar los 10 MB',
      });
      return;
    }

    // Actualizar documento con el archivo
    setDocumentos(documentos.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          archivo: {
            nombre: file.name,
            tamano: file.size,
            fechaCarga: new Date().toISOString().split('T')[0],
            url: URL.createObjectURL(file),
          },
          estatusEnlace: 'subido' as EstatusEnlace,
        };
      }
      return doc;
    }));

    toast.success('Archivo cargado', {
      description: `El documento ${file.name} se ha cargado correctamente`,
    });
  };

  const handleDragOver = (e: React.DragEvent, docId: string) => {
    e.preventDefault();
    setDragOverId(docId);
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e: React.DragEvent, docId: string) => {
    e.preventDefault();
    setDragOverId(null);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(docId, file);
    }
  };

  const handleEliminarArchivo = (docId: string) => {
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este archivo?');
    if (confirmar) {
      setDocumentos(documentos.map(doc => {
        if (doc.id === docId) {
          return {
            ...doc,
            archivo: undefined,
            estatusEnlace: 'pendiente' as EstatusEnlace,
            estatusCGPI: '' as EstatusCGPI,
          };
        }
        return doc;
      }));
      toast.success('Archivo eliminado correctamente');
    }
  };

  const handleCambiarEstatusEnlace = (docId: string, nuevoEstatus: EstatusEnlace) => {
    setDocumentos(documentos.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          estatusEnlace: nuevoEstatus,
        };
      }
      return doc;
    }));
    toast.success('Estatus actualizado correctamente');
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

  const getEstatusEnlaceInfo = (estatus: EstatusEnlace) => {
    switch (estatus) {
      case 'pendiente':
        return {
          label: 'Pendiente de subir',
          color: '#9E9E9E',
          bgColor: '#F5F5F5',
          icon: Clock,
        };
      case 'solicitado':
        return {
          label: 'Solicitado',
          color: '#F57C00',
          bgColor: '#FFF3E0',
          icon: AlertCircle,
        };
      case 'subido':
        return {
          label: 'Subido',
          color: '#1976D2',
          bgColor: '#E3F2FD',
          icon: FileCheck,
        };
      case 'en_validacion':
        return {
          label: 'En validación',
          color: '#7B1FA2',
          bgColor: '#F3E5F5',
          icon: FileText,
        };
    }
  };

  const getEstatusCGPIInfo = (estatus: EstatusCGPI) => {
    switch (estatus) {
      case '':
        return {
          label: 'Sin revisar',
          color: '#9E9E9E',
          bgColor: '#F5F5F5',
          icon: XCircle,
        };
      case 'recibido':
        return {
          label: 'Recibido',
          color: '#1976D2',
          bgColor: '#E3F2FD',
          icon: FileCheck,
        };
      case 'revisado':
        return {
          label: 'Revisado',
          color: '#388E3C',
          bgColor: '#E8F5E9',
          icon: CheckCircle2,
        };
      case 'requiere_atencion':
        return {
          label: 'Requiere atención',
          color: '#D32F2F',
          bgColor: '#FFEBEE',
          icon: AlertTriangle,
        };
    }
  };

  const getSemaforoColor = () => {
    const porcentajeSubidos = (documentosSubidos / totalDocumentos) * 100;
    const porcentajeValidados = (documentosValidados / totalDocumentos) * 100;

    // Si todos están validados
    if (porcentajeValidados === 100) {
      return '#388E3C'; // Verde
    }
    // Si al menos 60% están subidos
    if (porcentajeSubidos >= 60) {
      return '#F57C00'; // Naranja
    }
    // Si menos del 60% están subidos
    return '#D32F2F'; // Rojo
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

      {/* Semaforización / Score del módulo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Card className="border-2" style={{ borderColor: getSemaforoColor() }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${getSemaforoColor()}20` }}
                >
                  <FileText className="w-8 h-8" style={{ color: getSemaforoColor() }} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">EVALUACIÓN DEL MÓDULO DE NORMATIVIDAD</p>
                  <p className="text-2xl mb-1" style={{ fontWeight: 'bold', color: getSemaforoColor() }}>
                    {documentosValidados}/{totalDocumentos} documentos validados
                  </p>
                  <p className="text-sm text-gray-600">
                    Documentos subidos: <span style={{ fontWeight: 'bold', color: '#1976D2' }}>
                      {documentosSubidos}/{totalDocumentos}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Indicador de progreso circular */}
                <div className="text-center">
                  <div className="relative w-24 h-24">
                    <svg className="w-24 h-24 transform -rotate-90">
                      {/* Círculo de fondo */}
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        fill="none"
                        stroke="#E0E0E0"
                        strokeWidth="8"
                      />
                      {/* Círculo de progreso */}
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        fill="none"
                        stroke={getSemaforoColor()}
                        strokeWidth="8"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - (documentosValidados / totalDocumentos))}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl" style={{ fontWeight: 'bold', color: getSemaforoColor() }}>
                        {Math.round((documentosValidados / totalDocumentos) * 100)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Completitud</p>
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
        transition={{ delay: 0.15 }}
        className="mb-6"
      >
        <Alert className="border-purple-300 bg-purple-50">
          <Info className="h-4 w-4 text-purple-600" />
          <AlertTitle className="text-purple-800">GESTIÓN DE DOCUMENTOS NORMATIVOS OBLIGATORIOS</AlertTitle>
          <AlertDescription className="text-purple-700">
            Sube los 5 documentos normativos obligatorios para tu dependencia. Los archivos deben estar en formato PDF y no exceder los 10 MB.
            Actualiza el estatus de cada documento conforme avances en el proceso de carga y validación.
          </AlertDescription>
        </Alert>
      </motion.div>

      {/* Listado de documentos normativos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {documentos.map((doc, index) => {
          const estatusEnlaceInfo = getEstatusEnlaceInfo(doc.estatusEnlace);
          const estatusCGPIInfo = getEstatusCGPIInfo(doc.estatusCGPI);
          const isExpanded = expandedDocId === doc.id;
          const EstatusEnlaceIcon = estatusEnlaceInfo.icon;
          const EstatusCGPIIcon = estatusCGPIInfo.icon;

          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + index * 0.05 }}
            >
              <Card className="border-2 hover:shadow-lg transition-shadow" style={{ borderColor: doc.archivo ? '#84cc16' : '#E0E0E0' }}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-base mb-3" style={{ color: '#374151' }}>
                        {doc.nombre}
                      </CardTitle>
                      
                      {/* Badges de estatus */}
                      <div className="flex flex-wrap items-center gap-3">
                        {/* Estatus del Enlace */}
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Estatus de carga:</p>
                          <Badge
                            className="flex items-center gap-1 px-3 py-1"
                            style={{
                              backgroundColor: estatusEnlaceInfo.bgColor,
                              color: estatusEnlaceInfo.color,
                              border: `1px solid ${estatusEnlaceInfo.color}`,
                            }}
                          >
                            <EstatusEnlaceIcon className="w-3 h-3" />
                            {estatusEnlaceInfo.label}
                          </Badge>
                        </div>

                        {/* Estatus de CGPI */}
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Estatus de validación CGPI:</p>
                          <Badge
                            className="flex items-center gap-1 px-3 py-1"
                            style={{
                              backgroundColor: estatusCGPIInfo.bgColor,
                              color: estatusCGPIInfo.color,
                              border: `1px solid ${estatusCGPIInfo.color}`,
                            }}
                          >
                            <EstatusCGPIIcon className="w-3 h-3" />
                            {estatusCGPIInfo.label}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Botón para expandir/colapsar */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExpandedDocId(isExpanded ? null : doc.id)}
                    >
                      {isExpanded ? 'Ocultar' : 'Gestionar'}
                    </Button>
                  </div>
                </CardHeader>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <CardContent className="pt-0 space-y-4">
                        {/* Selector de estatus del enlace */}
                        <div>
                          <label className="block text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                            ACTUALIZAR ESTATUS DE CARGA
                          </label>
                          <Select
                            value={doc.estatusEnlace}
                            onValueChange={(value) => handleCambiarEstatusEnlace(doc.id, value as EstatusEnlace)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pendiente">Pendiente de subir</SelectItem>
                              <SelectItem value="solicitado">Solicitado</SelectItem>
                              <SelectItem value="subido">Subido</SelectItem>
                              <SelectItem value="en_validacion">En validación</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Área de archivo */}
                        {doc.archivo ? (
                          // Visualizador de archivo
                          <div className="border-2 rounded-lg p-4" style={{ borderColor: '#84cc16', backgroundColor: '#F0FDF4' }}>
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#84cc1620' }}>
                                  <FileText className="w-6 h-6" style={{ color: '#84cc16' }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm mb-1 break-words" style={{ fontWeight: 'bold', color: '#374151' }}>
                                    {doc.archivo.nombre}
                                  </p>
                                  <p className="text-xs text-gray-600 mb-1">
                                    Tamaño: {formatFileSize(doc.archivo.tamano)}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    Fecha de carga: {formatDate(doc.archivo.fechaCarga)}
                                  </p>
                                </div>
                              </div>

                              {/* Acciones del archivo */}
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  title="Ver documento"
                                  className="hover:bg-blue-50"
                                >
                                  <Eye className="w-4 h-4" style={{ color: '#1976D2' }} />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  title="Reemplazar documento"
                                  className="hover:bg-orange-50"
                                  onClick={() => {
                                    const input = document.createElement('input');
                                    input.type = 'file';
                                    input.accept = '.pdf';
                                    input.onchange = (e) => {
                                      const file = (e.target as HTMLInputElement).files?.[0];
                                      if (file) {
                                        handleFileSelect(doc.id, file);
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
                                  title="Eliminar documento"
                                  className="hover:bg-red-50"
                                  onClick={() => handleEliminarArchivo(doc.id)}
                                >
                                  <Trash2 className="w-4 h-4" style={{ color: '#D32F2F' }} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // File drop para subir
                          <div
                            className={`border-2 border-dashed rounded-lg p-8 transition-all ${
                              dragOverId === doc.id
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-300 bg-gray-50 hover:border-purple-400 hover:bg-purple-50'
                            }`}
                            onDragOver={(e) => handleDragOver(e, doc.id)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, doc.id)}
                          >
                            <div className="flex flex-col items-center justify-center">
                              <Upload className="w-12 h-12 text-gray-400 mb-4" />
                              <p className="text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                                Arrastra tu archivo aquí o haz clic para seleccionar
                              </p>
                              <p className="text-xs text-gray-500 mb-4">
                                Formato permitido: PDF • Tamaño máximo: 10 MB
                              </p>
                              <input
                                type="file"
                                accept=".pdf"
                                id={`file-upload-${doc.id}`}
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleFileSelect(doc.id, file);
                                  }
                                }}
                              />
                              <Button
                                onClick={() => document.getElementById(`file-upload-${doc.id}`)?.click()}
                                style={{ backgroundColor: '#84cc16' }}
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                SELECCIONAR ARCHIVO
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Información adicional si el documento requiere atención */}
                        {doc.estatusCGPI === 'requiere_atencion' && (
                          <Alert className="border-red-300 bg-red-50">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <AlertTitle className="text-red-800">Requiere atención</AlertTitle>
                            <AlertDescription className="text-red-700">
                              La CGPI ha marcado este documento para revisión. Por favor, verifica y actualiza el archivo si es necesario.
                            </AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Información de ayuda al final */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="text-sm mb-3" style={{ fontWeight: 'bold', color: '#1976D2' }}>
              INFORMACIÓN SOBRE LOS ESTATUS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                  Estatus de carga (controlado por ti):
                </p>
                <ul className="space-y-1 text-gray-700">
                  <li>• <strong>Pendiente de subir:</strong> No has iniciado el proceso</li>
                  <li>• <strong>Solicitado:</strong> Has solicitado el documento internamente</li>
                  <li>• <strong>Subido:</strong> Has cargado el archivo al sistema</li>
                  <li>• <strong>En validación:</strong> Has enviado el documento a revisión</li>
                </ul>
              </div>
              <div>
                <p className="mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                  Estatus de validación CGPI (controlado por administrador):
                </p>
                <ul className="space-y-1 text-gray-700">
                  <li>• <strong>Sin revisar:</strong> Aún no ha sido revisado por CGPI</li>
                  <li>• <strong>Recibido:</strong> CGPI ha recibido el documento</li>
                  <li>• <strong>Revisado:</strong> CGPI ha validado el documento ✓</li>
                  <li>• <strong>Requiere atención:</strong> Necesita correcciones</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
