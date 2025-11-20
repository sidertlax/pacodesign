import { useState, useEffect } from 'react';
import {
  Save,
  Send,
  Plus,
  Trash2,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Building2,
  XCircle,
  Calendar,
  Info,
  Home,
  Edit3,
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

interface EnlaceCargaGastoProps {
  userName: string;
  onVolverInicio?: () => void;
}

interface PresupuestoData {
  aprobado: number;
  modificado: number;
  pagado: number;
  justificacion?: string;
}

interface DesgloseCategoriaItem {
  id: string;
  nombre: string;
  aprobado: number;
  modificado: number;
  pagado: number;
}

interface ArchivoEvidencia {
  id: string;
  nombre: string;
  año: string;
  descripcion: string;
  fecha: string;
}

const categoriasPorTipo = {
  capitulos: [
    { id: 'cap-1000', nombre: 'Capítulo 1000 - Servicios Personales' },
    { id: 'cap-2000', nombre: 'Capítulo 2000 - Materiales y Suministros' },
    { id: 'cap-3000', nombre: 'Capítulo 3000 - Servicios Generales' },
    { id: 'cap-4000', nombre: 'Capítulo 4000 - Transferencias, Asignaciones, Subsidios' },
    { id: 'cap-5000', nombre: 'Capítulo 5000 - Bienes Muebles, Inmuebles' },
    { id: 'cap-6000', nombre: 'Capítulo 6000 - Inversión Pública' },
  ],
  proyectos: [
    { id: 'proy-01', nombre: 'Proyecto 01 - Infraestructura Educativa' },
    { id: 'proy-02', nombre: 'Proyecto 02 - Equipamiento Tecnológico' },
    { id: 'proy-03', nombre: 'Proyecto 03 - Capacitación Docente' },
    { id: 'proy-04', nombre: 'Proyecto 04 - Becas y Apoyos Estudiantiles' },
    { id: 'proy-05', nombre: 'Proyecto 05 - Mantenimiento de Instalaciones' },
  ],
};

export function EnlaceCargaGasto({ userName, onVolverInicio }: EnlaceCargaGastoProps) {
  // Información predefinida del usuario
  const dependenciaAsignada = 'Secretaría de Educación Pública';
  const añoFiscal = 2025;
  const trimestreActual = 4; // Q4 2025
  
  // Presupuesto fijo aprobado según dependencia
  const presupuestoAprobadoFijo = 285000000; // $285,000,000 MXN
  
  // Montos acumulados hasta el trimestre actual (antes de la captura actual)
  const presupuestoModificadoInicial = 278500000; // $278,500,000 MXN
  const presupuestoPagadoInicial = 186340000; // $186,340,000 MXN
  
  const [presupuesto, setPresupuesto] = useState<PresupuestoData>({
    aprobado: presupuestoAprobadoFijo,
    modificado: presupuestoModificadoInicial,
    pagado: presupuestoPagadoInicial,
    justificacion: '',
  });
  const [desglose, setDesglose] = useState<Record<string, DesgloseCategoriaItem[]>>({
    capitulos: categoriasPorTipo.capitulos.map(cat => ({
      id: cat.id,
      nombre: cat.nombre,
      aprobado: 0,
      modificado: 0,
      pagado: 0,
    })),
    proyectos: categoriasPorTipo.proyectos.map(cat => ({
      id: cat.id,
      nombre: cat.nombre,
      aprobado: 0,
      modificado: 0,
      pagado: 0,
    })),
  });
  const [archivos, setArchivos] = useState<ArchivoEvidencia[]>([]);
  const [activeDesglose, setActiveDesglose] = useState<string>('');
  const [estadoRegistro, setEstadoRegistro] = useState<'borrador' | 'enviado' | 'validado' | 'rechazado'>('borrador');
  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toLocaleDateString('es-MX'));
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Calcular totales automáticamente cuando cambie el desglose
  useEffect(() => {
    const calcularTotales = () => {
      let totalModificadoDesglose = 0;
      let totalPagadoDesglose = 0;

      // Sumar por capítulos
      desglose.capitulos.forEach(item => {
        totalModificadoDesglose += item.modificado;
        totalPagadoDesglose += item.pagado;
      });

      // Sumar por proyectos
      desglose.proyectos.forEach(item => {
        totalModificadoDesglose += item.modificado;
        totalPagadoDesglose += item.pagado;
      });

      // Actualizar presupuesto: valores iniciales + lo que el usuario está capturando
      setPresupuesto(prev => ({
        ...prev,
        aprobado: presupuestoAprobadoFijo, // Siempre fijo
        modificado: presupuestoModificadoInicial + totalModificadoDesglose, // Inicial + nueva captura
        pagado: presupuestoPagadoInicial + totalPagadoDesglose, // Inicial + nueva captura
      }));
    };

    calcularTotales();
  }, [desglose, presupuestoAprobadoFijo, presupuestoModificadoInicial, presupuestoPagadoInicial]);

  const calcularAvance = (pagado: number, modificado: number) => {
    if (modificado === 0) return 0;
    return Math.min(((pagado / modificado) * 100), 999);
  };

  const validarExcedente = () => {
    return presupuesto.pagado > presupuesto.modificado;
  };

  const handleGuardarBorrador = () => {
    setIsSaving(true);
    setTimeout(() => {
      setEstadoRegistro('borrador');
      setLastUpdate(new Date().toLocaleDateString('es-MX'));
      setShowSuccessModal(true);
      setIsSaving(false);
    }, 1000);
  };

  const handleEnviarCGPI = () => {
    if (validarExcedente() && !presupuesto.justificacion) {
      alert('Debes justificar el excedente de presupuesto antes de enviar');
      return;
    }
    setIsSending(true);
    setTimeout(() => {
      setEstadoRegistro('enviado');
      setLastUpdate(new Date().toLocaleDateString('es-MX'));
      setShowSuccessModal(true);
      setIsSending(false);
    }, 1000);
  };

  const handleAgregarArchivo = () => {
    const nuevoArchivo: ArchivoEvidencia = {
      id: `file-${Date.now()}`,
      nombre: 'documento_evidencia.pdf',
      año: añoFiscal.toString(),
      descripcion: '',
      fecha: new Date().toLocaleDateString('es-MX'),
    };
    setArchivos([...archivos, nuevoArchivo]);
  };

  const handleEliminarArchivo = (id: string) => {
    setArchivos(archivos.filter(a => a.id !== id));
  };

  const updateDesgloseItem = (tipo: string, id: string, campo: string, valor: number) => {
    setDesglose(prev => ({
      ...prev,
      [tipo]: prev[tipo].map(item =>
        item.id === id ? { ...item, [campo]: valor } : item
      ),
    }));
  };

  const getEstadoBadge = () => {
    const estados = {
      borrador: { color: '#9E9E9E', icon: Clock, label: 'BORRADOR' },
      enviado: { color: '#1976D2', icon: Send, label: 'ENVIADO A CGPI' },
      validado: { color: '#2E7D32', icon: CheckCircle2, label: 'VALIDADO' },
      rechazado: { color: '#D32F2F', icon: XCircle, label: 'RECHAZADO' },
    };
    const estado = estados[estadoRegistro];
    const Icon = estado.icon;
    
    return (
      <Badge
        className="border-0 px-3 py-1"
        style={{ backgroundColor: `${estado.color}15`, color: estado.color }}
      >
        <Icon className="w-3 h-3 mr-1" />
        {estado.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Función para contar campos completados
  const contarCompletados = (items: DesgloseCategoriaItem[]) => {
    const completados = items.filter(item => 
      item.aprobado > 0 || item.modificado > 0 || item.pagado > 0
    ).length;
    const total = items.length;
    return { completados, total };
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
          INFORMACIÓN DE GASTO
        </h1>
        <div className="h-1 w-24 rounded-full" style={{ backgroundColor: '#582672' }} />
      </motion.div>

      {/* Información de contexto */}
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
                  <p className="text-sm text-gray-600 mb-1">DEPENDENCIA ASIGNADA</p>
                  <p className="text-xl" style={{ fontWeight: 'bold', color: '#582672' }}>
                    {dependenciaAsignada}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <p className="text-sm text-gray-600">AÑO FISCAL</p>
                  </div>
                  <p className="text-2xl" style={{ fontWeight: 'bold', color: '#1976D2' }}>
                    {añoFiscal}
                  </p>
                </div>

                <div className="h-12 w-px bg-gray-300" />

                <div className="text-center">
                  <div className="flex items-center gap-2 mb-1">
                    <Info className="w-4 h-4 text-gray-600" />
                    <p className="text-sm text-gray-600">TRIMESTRE ACTUAL</p>
                  </div>
                  <p className="text-2xl" style={{ fontWeight: 'bold', color: '#1976D2' }}>
                    Q{trimestreActual}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Presupuesto anual - Solo visualización */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Card className="border-2 border-blue-100">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#1976D2', fontWeight: 'bold' }}>
                  <DollarSign className="w-5 h-5" />
                  RESUMEN PRESUPUESTAL ANUAL
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Los datos se calculan automáticamente según el desglose por capítulo y programa
                </p>
              </div>
              <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                <Info className="w-3 h-3 mr-1" />
                CALCULADO AUTOMÁTICAMENTE
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="text-sm mb-2 block text-gray-600">
                  PRESUPUESTO APROBADO
                </label>
                <p className="text-3xl mb-1" style={{ fontWeight: 'bold', color: '#374151' }}>
                  {formatCurrency(presupuesto.aprobado)}
                </p>
                <p className="text-xs text-gray-500">Total anual</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="text-sm mb-2 block text-gray-600">
                  PRESUPUESTO MODIFICADO
                </label>
                <p className="text-3xl mb-1" style={{ fontWeight: 'bold', color: '#374151' }}>
                  {formatCurrency(presupuesto.modificado)}
                </p>
                <p className="text-xs text-gray-500">Total anual</p>
              </div>

              <div className={`p-4 rounded-lg border ${validarExcedente() ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200'}`}>
                <label className={`text-sm mb-2 block ${validarExcedente() ? 'text-red-700' : 'text-gray-600'}`}>
                  PRESUPUESTO PAGADO
                </label>
                <p className="text-3xl mb-1" style={{ fontWeight: 'bold', color: validarExcedente() ? '#D32F2F' : '#374151' }}>
                  {formatCurrency(presupuesto.pagado)}
                </p>
                <p className={`text-xs ${validarExcedente() ? 'text-red-600' : 'text-gray-500'}`}>
                  {validarExcedente() ? 'Excedente detectado' : 'Total anual'}
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border-2 border-blue-200">
                <label className="text-sm mb-2 block text-blue-900">
                  % DE AVANCE
                </label>
                <p className="text-4xl mb-1" style={{ fontWeight: 'bold', color: '#1976D2' }}>
                  {calcularAvance(presupuesto.pagado, presupuesto.modificado).toFixed(1)}%
                </p>
                <p className="text-xs text-blue-700">Del presupuesto modificado</p>
              </div>
            </div>

            {validarExcedente() && (
              <Alert className="border-red-300 bg-red-50 mt-6">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-800">EXCEDENTE PRESUPUESTAL DETECTADO</AlertTitle>
                <AlertDescription className="text-red-700">
                  El presupuesto pagado ({formatCurrency(presupuesto.pagado)}) es mayor que el modificado ({formatCurrency(presupuesto.modificado)}). 
                  Debe justificar este excedente. Este dato será verificado por CGPI.
                </AlertDescription>
                <Textarea
                  className="mt-3 border-red-300"
                  placeholder="Escriba la justificación del excedente presupuestal..."
                  value={presupuesto.justificacion}
                  onChange={(e) => setPresupuesto({ ...presupuesto, justificacion: e.target.value })}
                  rows={3}
                />
              </Alert>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Desglose por categorías */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
              <FileText className="w-5 h-5" />
              DESGLOSE PRESUPUESTAL POR CATEGORÍA
            </CardTitle>
            <p className="text-sm text-gray-600">
              Capture el detalle del gasto distribuido. La información considera trimestres anteriores del año en curso.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Capítulos de gasto */}
            <div className="border rounded-lg overflow-hidden">
              <button
                onClick={() => setActiveDesglose(activeDesglose === 'capitulos' ? '' : 'capitulos')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span style={{ fontWeight: 'bold', color: '#374151' }}>
                    CAPÍTULOS DE GASTO
                  </span>
                  <Badge
                    className="border-0"
                    style={{
                      backgroundColor: contarCompletados(desglose.capitulos).completados === contarCompletados(desglose.capitulos).total && contarCompletados(desglose.capitulos).total > 0
                        ? '#2E7D3215'
                        : '#1976D215',
                      color: contarCompletados(desglose.capitulos).completados === contarCompletados(desglose.capitulos).total && contarCompletados(desglose.capitulos).total > 0
                        ? '#2E7D32'
                        : '#1976D2',
                    }}
                  >
                    {contarCompletados(desglose.capitulos).completados} / {contarCompletados(desglose.capitulos).total} completados
                  </Badge>
                </div>
                <motion.div
                  animate={{ rotate: activeDesglose === 'capitulos' ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                </motion.div>
              </button>
              
              {activeDesglose === 'capitulos' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="p-4 bg-white"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 text-sm" style={{ fontWeight: 'bold', color: '#374151' }}>
                            CONCEPTO
                          </th>
                          <th className="text-right py-3 px-4 text-sm" style={{ fontWeight: 'bold', color: '#374151' }}>
                            APROBADO
                          </th>
                          <th className="text-right py-3 px-4 text-sm" style={{ fontWeight: 'bold', color: '#374151' }}>
                            MODIFICADO
                          </th>
                          <th className="text-right py-3 px-4 text-sm" style={{ fontWeight: 'bold', color: '#374151' }}>
                            PAGADO
                          </th>
                          <th className="text-right py-3 px-4 text-sm" style={{ fontWeight: 'bold', color: '#374151' }}>
                            % AVANCE
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {desglose.capitulos.map((item) => (
                          <tr key={item.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm">{item.nombre}</td>
                            <td className="py-3 px-4">
                              <Input
                                type="number"
                                className="text-right"
                                value={item.aprobado || ''}
                                onChange={(e) => updateDesgloseItem('capitulos', item.id, 'aprobado', parseFloat(e.target.value) || 0)}
                                placeholder="0.00"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <Input
                                type="number"
                                className="text-right"
                                value={item.modificado || ''}
                                onChange={(e) => updateDesgloseItem('capitulos', item.id, 'modificado', parseFloat(e.target.value) || 0)}
                                placeholder="0.00"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <Input
                                type="number"
                                className="text-right"
                                value={item.pagado || ''}
                                onChange={(e) => updateDesgloseItem('capitulos', item.id, 'pagado', parseFloat(e.target.value) || 0)}
                                placeholder="0.00"
                              />
                            </td>
                            <td className="py-3 px-4 text-right" style={{ fontWeight: 'bold', color: '#1976D2' }}>
                              {calcularAvance(item.pagado, item.modificado).toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Proyectos */}
            <div className="border rounded-lg overflow-hidden">
              <button
                onClick={() => setActiveDesglose(activeDesglose === 'proyectos' ? '' : 'proyectos')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span style={{ fontWeight: 'bold', color: '#374151' }}>
                    PROYECTOS
                  </span>
                  <Badge
                    className="border-0"
                    style={{
                      backgroundColor: contarCompletados(desglose.proyectos).completados === contarCompletados(desglose.proyectos).total && contarCompletados(desglose.proyectos).total > 0
                        ? '#2E7D3215'
                        : '#1976D215',
                      color: contarCompletados(desglose.proyectos).completados === contarCompletados(desglose.proyectos).total && contarCompletados(desglose.proyectos).total > 0
                        ? '#2E7D32'
                        : '#1976D2',
                    }}
                  >
                    {contarCompletados(desglose.proyectos).completados} / {contarCompletados(desglose.proyectos).total} completados
                  </Badge>
                </div>
                <motion.div
                  animate={{ rotate: activeDesglose === 'proyectos' ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                </motion.div>
              </button>
              
              {activeDesglose === 'proyectos' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="p-4 bg-white"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 text-sm" style={{ fontWeight: 'bold', color: '#374151' }}>
                            CONCEPTO
                          </th>
                          <th className="text-right py-3 px-4 text-sm" style={{ fontWeight: 'bold', color: '#374151' }}>
                            APROBADO
                          </th>
                          <th className="text-right py-3 px-4 text-sm" style={{ fontWeight: 'bold', color: '#374151' }}>
                            MODIFICADO
                          </th>
                          <th className="text-right py-3 px-4 text-sm" style={{ fontWeight: 'bold', color: '#374151' }}>
                            PAGADO
                          </th>
                          <th className="text-right py-3 px-4 text-sm" style={{ fontWeight: 'bold', color: '#374151' }}>
                            % AVANCE
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {desglose.proyectos.map((item) => (
                          <tr key={item.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm">{item.nombre}</td>
                            <td className="py-3 px-4">
                              <Input
                                type="number"
                                className="text-right"
                                value={item.aprobado || ''}
                                onChange={(e) => updateDesgloseItem('proyectos', item.id, 'aprobado', parseFloat(e.target.value) || 0)}
                                placeholder="0.00"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <Input
                                type="number"
                                className="text-right"
                                value={item.modificado || ''}
                                onChange={(e) => updateDesgloseItem('proyectos', item.id, 'modificado', parseFloat(e.target.value) || 0)}
                                placeholder="0.00"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <Input
                                type="number"
                                className="text-right"
                                value={item.pagado || ''}
                                onChange={(e) => updateDesgloseItem('proyectos', item.id, 'pagado', parseFloat(e.target.value) || 0)}
                                placeholder="0.00"
                              />
                            </td>
                            <td className="py-3 px-4 text-right" style={{ fontWeight: 'bold', color: '#1976D2' }}>
                              {calcularAvance(item.pagado, item.modificado).toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Evidencia documental */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                  <Upload className="w-5 h-5" />
                  EVIDENCIA DOCUMENTAL
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Cargue archivos PDF, imágenes u oficios que respalden la información capturada
                </p>
              </div>
              <Button onClick={handleAgregarArchivo} style={{ backgroundColor: '#1976D2' }}>
                <Plus className="w-4 h-4 mr-2" />
                AGREGAR ARCHIVO
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {archivos.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <FileText className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600">No hay archivos cargados</p>
                <p className="text-sm text-gray-500 mt-1">
                  Agregue documentos de respaldo utilizando el botón superior
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {archivos.map((archivo) => (
                  <div key={archivo.id} className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50">
                    <div className="flex items-center gap-4 flex-1">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div className="flex-1 grid grid-cols-4 gap-4">
                        <Input
                          value={archivo.nombre}
                          onChange={(e) => {
                            setArchivos(archivos.map(a =>
                              a.id === archivo.id ? { ...a, nombre: e.target.value } : a
                            ));
                          }}
                          placeholder="Nombre del archivo"
                        />
                        <Input
                          value={archivo.año}
                          readOnly
                          className="bg-gray-50"
                        />
                        <Input
                          value={archivo.descripcion}
                          onChange={(e) => {
                            setArchivos(archivos.map(a =>
                              a.id === archivo.id ? { ...a, descripcion: e.target.value } : a
                            ));
                          }}
                          placeholder="Descripción"
                          className="col-span-2"
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEliminarArchivo(archivo.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Footer de acciones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-2" style={{ borderColor: '#1976D2' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Estado del registro:</span>
                  {getEstadoBadge()}
                </div>
                <p className="text-xs text-gray-500">
                  Última actualización: {lastUpdate} por {userName}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleGuardarBorrador}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <div className="animate-spin">
                      <Save className="w-4 h-4 mr-2" />
                    </div>
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  GUARDAR COMO BORRADOR
                </Button>
                <Button
                  onClick={handleEnviarCGPI}
                  style={{ backgroundColor: '#1976D2' }}
                  disabled={isSending}
                >
                  {isSending ? (
                    <div className="animate-spin">
                      <Send className="w-4 h-4 mr-2" />
                    </div>
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  ENVIAR A CGPI
                </Button>
              </div>
            </div>
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
                {/* Fondo decorativo animado */}
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
                
                <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 text-center relative">
                  {/* Ícono de éxito con animación */}
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
                      style={{ backgroundColor: i % 2 === 0 ? '#2E7D32' : '#1976D2' }}
                    />
                  ))}

                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-2xl mb-2"
                    style={{ fontWeight: 'bold', color: '#2E7D32' }}
                  >
                    {estadoRegistro === 'enviado' ? '¡Enviado exitosamente!' : '¡Guardado exitosamente!'}
                  </motion.h2>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-gray-600"
                  >
                    {estadoRegistro === 'enviado'
                      ? 'La información ha sido enviada a CGPI para validación. Recibirás una notificación con el resultado.'
                      : 'La información ha sido guardada como borrador. Puedes continuar editando más tarde.'}
                  </motion.p>
                </div>
              </div>

              {/* Detalles del registro */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="p-6 bg-gray-50 border-y"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Dependencia:</span>
                    <span className="text-sm" style={{ fontWeight: 'bold', color: '#374151' }}>
                      {dependenciaAsignada}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Año fiscal:</span>
                    <span className="text-sm" style={{ fontWeight: 'bold', color: '#374151' }}>
                      {añoFiscal}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Estado:</span>
                    {getEstadoBadge()}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Fecha:</span>
                    <span className="text-sm text-gray-500">{lastUpdate}</span>
                  </div>
                </div>
              </motion.div>

              {/* Botones de acción */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="p-6 space-y-3"
              >
                {estadoRegistro === 'enviado' && (
                  <>
                    <Button
                      onClick={() => {
                        setShowSuccessModal(false);
                        if (onVolverInicio) onVolverInicio();
                      }}
                      className="w-full"
                      style={{ backgroundColor: '#1976D2' }}
                    >
                      <Home className="w-4 h-4 mr-2" />
                      REGRESAR AL INICIO
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowSuccessModal(false)}
                      className="w-full border-2"
                      style={{ borderColor: '#1976D2', color: '#1976D2' }}
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      MODIFICAR INFORMACIÓN
                    </Button>
                  </>
                )}
                
                {estadoRegistro === 'borrador' && (
                  <Button
                    onClick={() => setShowSuccessModal(false)}
                    className="w-full"
                    style={{ backgroundColor: '#1976D2' }}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    CONTINUAR EDITANDO
                  </Button>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}