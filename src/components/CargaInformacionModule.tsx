import { useState } from 'react';
import {
  ArrowLeft,
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
  Download,
  DollarSign,
  Building2,
  Calendar,
  FileCheck,
  BarChart3,
  Hammer,
  BookOpen,
  User,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { motion } from 'motion/react';
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
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from './ui/alert';

interface CargaInformacionModuleProps {
  onClose: () => void;
  userName: string;
  dependencies: Array<{ id: string; name: string }>;
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
  programas: [
    { id: 'prog-01', nombre: 'Programa 01 - Educación Básica' },
    { id: 'prog-02', nombre: 'Programa 02 - Salud Pública' },
    { id: 'prog-03', nombre: 'Programa 03 - Seguridad' },
    { id: 'prog-04', nombre: 'Programa 04 - Infraestructura' },
  ],
  unidades: [
    { id: 'ur-01', nombre: 'Unidad de Administración' },
    { id: 'ur-02', nombre: 'Unidad de Planeación' },
    { id: 'ur-03', nombre: 'Unidad de Ejecución' },
  ],
};

export function CargaInformacionModule({
  onClose,
  userName,
  dependencies,
}: CargaInformacionModuleProps) {
  const [activeModule, setActiveModule] = useState('gasto');
  const [selectedDependency, setSelectedDependency] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [presupuesto, setPresupuesto] = useState<PresupuestoData>({
    aprobado: 0,
    modificado: 0,
    pagado: 0,
    justificacion: '',
  });
  const [desglose, setDesglose] = useState<Record<string, DesgloseCategoriaItem[]>>({
    capitulos: [],
    programas: [],
    unidades: [],
  });
  const [archivos, setArchivos] = useState<ArchivoEvidencia[]>([]);
  const [activeDesglose, setActiveDesglose] = useState<string>('');
  const [estadoRegistro, setEstadoRegistro] = useState<'borrador' | 'enviado' | 'validado' | 'rechazado'>('borrador');
  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toLocaleDateString('es-MX'));
  const [isFormEnabled, setIsFormEnabled] = useState(false);

  const currentYear = 2025;
  const years = Array.from({ length: 7 }, (_, i) => 2021 + i);

  const calcularAvance = (pagado: number, modificado: number) => {
    if (modificado === 0) return 0;
    return Math.min(((pagado / modificado) * 100), 999);
  };

  const validarExcedente = () => {
    return presupuesto.pagado > presupuesto.modificado;
  };

  const handleCargarInformacion = () => {
    if (selectedDependency && selectedYear) {
      setIsFormEnabled(true);
      // Inicializar desglose con datos por defecto
      const capitulosIniciales = categoriasPorTipo.capitulos.map(cat => ({
        id: cat.id,
        nombre: cat.nombre,
        aprobado: 0,
        modificado: 0,
        pagado: 0,
      }));
      const programasIniciales = categoriasPorTipo.programas.map(cat => ({
        id: cat.id,
        nombre: cat.nombre,
        aprobado: 0,
        modificado: 0,
        pagado: 0,
      }));
      const unidadesIniciales = categoriasPorTipo.unidades.map(cat => ({
        id: cat.id,
        nombre: cat.nombre,
        aprobado: 0,
        modificado: 0,
        pagado: 0,
      }));
      
      setDesglose({
        capitulos: capitulosIniciales,
        programas: programasIniciales,
        unidades: unidadesIniciales,
      });
    }
  };

  const handleGuardarBorrador = () => {
    setEstadoRegistro('borrador');
    setLastUpdate(new Date().toLocaleDateString('es-MX'));
    // Aquí iría la lógica para guardar
    alert('Información guardada como borrador');
  };

  const handleEnviarCGPI = () => {
    if (validarExcedente() && !presupuesto.justificacion) {
      alert('Debes justificar el excedente de presupuesto antes de enviar');
      return;
    }
    setEstadoRegistro('enviado');
    setLastUpdate(new Date().toLocaleDateString('es-MX'));
    alert('Información enviada a CGPI para validación');
  };

  const handleAgregarArchivo = () => {
    const nuevoArchivo: ArchivoEvidencia = {
      id: `file-${Date.now()}`,
      nombre: 'documento_evidencia.pdf',
      año: selectedYear,
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
      rechazado: { color: '#D32F2F', icon: AlertCircle, label: 'RECHAZADO' },
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

  const renderEmptyState = (titulo: string, descripcion: string) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-6"
    >
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#58267215' }}>
        <FileCheck className="w-10 h-10" style={{ color: '#582672' }} />
      </div>
      <h3 className="text-2xl mb-3" style={{ color: '#582672', fontWeight: 'bold' }}>
        {titulo}
      </h3>
      <p className="text-center text-gray-600 mb-6 max-w-md">
        {descripcion}
      </p>
      <Button variant="outline" disabled>
        PRÓXIMAMENTE
      </Button>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
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
              <div>
                <h1 className="text-3xl" style={{ color: '#582672', fontWeight: 'bold' }}>
                  CARGA DE INFORMACIÓN
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Portal de captura para Enlaces — SIDERTLAX
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-500">Usuario activo</p>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <p className="text-sm" style={{ fontWeight: 'bold' }}>{userName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación de módulos */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <Tabs value={activeModule} onValueChange={setActiveModule} className="w-full">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-0">
              <TabsTrigger
                value="gasto"
                className="px-6 py-4 rounded-none border-b-2 data-[state=active]:border-[#1976D2] data-[state=active]:bg-transparent"
                style={{ 
                  color: activeModule === 'gasto' ? '#1976D2' : '#6b7280',
                  fontWeight: activeModule === 'gasto' ? 'bold' : 'normal',
                }}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                GASTO
              </TabsTrigger>
              <TabsTrigger
                value="compromisos"
                className="px-6 py-4 rounded-none border-b-2 data-[state=active]:border-[#1976D2] data-[state=active]:bg-transparent"
                style={{ 
                  color: activeModule === 'compromisos' ? '#1976D2' : '#6b7280',
                  fontWeight: activeModule === 'compromisos' ? 'bold' : 'normal',
                }}
              >
                <FileCheck className="w-4 h-4 mr-2" />
                COMPROMISOS
              </TabsTrigger>
              <TabsTrigger
                value="indicadores"
                className="px-6 py-4 rounded-none border-b-2 data-[state=active]:border-[#1976D2] data-[state=active]:bg-transparent"
                style={{ 
                  color: activeModule === 'indicadores' ? '#1976D2' : '#6b7280',
                  fontWeight: activeModule === 'indicadores' ? 'bold' : 'normal',
                }}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                INDICADORES
              </TabsTrigger>
              <TabsTrigger
                value="normatividad"
                className="px-6 py-4 rounded-none border-b-2 data-[state=active]:border-[#1976D2] data-[state=active]:bg-transparent"
                style={{ 
                  color: activeModule === 'normatividad' ? '#1976D2' : '#6b7280',
                  fontWeight: activeModule === 'normatividad' ? 'bold' : 'normal',
                }}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                NORMATIVIDAD
              </TabsTrigger>
              <TabsTrigger
                value="obra"
                className="px-6 py-4 rounded-none border-b-2 data-[state=active]:border-[#1976D2] data-[state=active]:bg-transparent"
                style={{ 
                  color: activeModule === 'obra' ? '#1976D2' : '#6b7280',
                  fontWeight: activeModule === 'obra' ? 'bold' : 'normal',
                }}
              >
                <Hammer className="w-4 h-4 mr-2" />
                OBRA PÚBLICA
              </TabsTrigger>
            </TabsList>

            {/* Contenido: GASTO */}
            <TabsContent value="gasto" className="mt-0">
              <div className="container mx-auto px-6 py-8">
                {/* Filtros iniciales */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                        <Building2 className="w-5 h-5" />
                        SELECCIONAR INFORMACIÓN A CAPTURAR
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm mb-2 block" style={{ fontWeight: 'bold', color: '#374151' }}>
                            DEPENDENCIA / ENTIDAD
                          </label>
                          <Select value={selectedDependency} onValueChange={setSelectedDependency}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione una dependencia" />
                            </SelectTrigger>
                            <SelectContent>
                              {dependencies.slice(0, 15).map(dep => (
                                <SelectItem key={dep.id} value={dep.id}>
                                  {dep.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm mb-2 block" style={{ fontWeight: 'bold', color: '#374151' }}>
                            AÑO FISCAL
                          </label>
                          <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione un año" />
                            </SelectTrigger>
                            <SelectContent>
                              {years.map(year => (
                                <SelectItem
                                  key={year}
                                  value={year.toString()}
                                  disabled={year > currentYear}
                                >
                                  {year} {year > currentYear && '(No disponible)'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-end">
                          <Button
                            className="w-full"
                            onClick={handleCargarInformacion}
                            disabled={!selectedDependency || !selectedYear}
                            style={{
                              backgroundColor: selectedDependency && selectedYear ? '#1976D2' : undefined,
                            }}
                          >
                            {isFormEnabled ? 'EDITAR' : 'CARGAR INFORMACIÓN'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {isFormEnabled && (
                  <>
                    {/* Presupuesto anual */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="mb-6"
                    >
                      <Card className="border-2 border-blue-100">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#1976D2', fontWeight: 'bold' }}>
                            <DollarSign className="w-5 h-5" />
                            PRESUPUESTO ANUAL
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                            <div>
                              <label className="text-sm mb-2 block" style={{ fontWeight: 'bold', color: '#374151' }}>
                                PRESUPUESTO APROBADO
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                <Input
                                  type="number"
                                  className="pl-7"
                                  value={presupuesto.aprobado || ''}
                                  onChange={(e) => setPresupuesto({ ...presupuesto, aprobado: parseFloat(e.target.value) || 0 })}
                                  placeholder="0.00"
                                />
                              </div>
                              <p className="text-xs text-gray-500 mt-1">MXN</p>
                            </div>

                            <div>
                              <label className="text-sm mb-2 block" style={{ fontWeight: 'bold', color: '#374151' }}>
                                PRESUPUESTO MODIFICADO
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                <Input
                                  type="number"
                                  className="pl-7"
                                  value={presupuesto.modificado || ''}
                                  onChange={(e) => setPresupuesto({ ...presupuesto, modificado: parseFloat(e.target.value) || 0 })}
                                  placeholder="0.00"
                                />
                              </div>
                              <p className="text-xs text-gray-500 mt-1">MXN</p>
                            </div>

                            <div>
                              <label className="text-sm mb-2 block" style={{ fontWeight: 'bold', color: '#374151' }}>
                                PRESUPUESTO PAGADO
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                <Input
                                  type="number"
                                  className={`pl-7 ${validarExcedente() ? 'border-red-500' : ''}`}
                                  value={presupuesto.pagado || ''}
                                  onChange={(e) => setPresupuesto({ ...presupuesto, pagado: parseFloat(e.target.value) || 0 })}
                                  placeholder="0.00"
                                />
                              </div>
                              <p className="text-xs text-gray-500 mt-1">MXN</p>
                            </div>

                            <div>
                              <label className="text-sm mb-2 block" style={{ fontWeight: 'bold', color: '#374151' }}>
                                % DE AVANCE
                              </label>
                              <div className="flex items-center gap-2 h-10 px-3 bg-gray-100 border border-gray-200 rounded-md">
                                <span className="text-2xl" style={{ fontWeight: 'bold', color: '#1976D2' }}>
                                  {calcularAvance(presupuesto.pagado, presupuesto.modificado).toFixed(1)}%
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">Calculado automáticamente</p>
                            </div>
                          </div>

                          {validarExcedente() && (
                            <Alert className="border-red-300 bg-red-50">
                              <AlertCircle className="h-4 w-4 text-red-600" />
                              <AlertTitle className="text-red-800">Excedente detectado</AlertTitle>
                              <AlertDescription className="text-red-700">
                                El presupuesto pagado es mayor que el modificado. Debe justificar este excedente. Este dato será verificado por CGPI.
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
                            Capture el detalle del gasto distribuido por capítulo, programa y unidad responsable
                          </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Capítulos de gasto */}
                          <div className="border rounded-lg overflow-hidden">
                            <button
                              onClick={() => setActiveDesglose(activeDesglose === 'capitulos' ? '' : 'capitulos')}
                              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                              <span style={{ fontWeight: 'bold', color: '#374151' }}>
                                CAPÍTULOS DE GASTO
                              </span>
                              {activeDesglose === 'capitulos' ? (
                                <ChevronDown className="w-5 h-5 text-gray-600" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                              )}
                            </button>
                            
                            {activeDesglose === 'capitulos' && (
                              <div className="p-4 bg-white">
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
                              </div>
                            )}
                          </div>

                          {/* Programas */}
                          <div className="border rounded-lg overflow-hidden">
                            <button
                              onClick={() => setActiveDesglose(activeDesglose === 'programas' ? '' : 'programas')}
                              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                              <span style={{ fontWeight: 'bold', color: '#374151' }}>
                                PROGRAMAS
                              </span>
                              {activeDesglose === 'programas' ? (
                                <ChevronDown className="w-5 h-5 text-gray-600" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                              )}
                            </button>
                            
                            {activeDesglose === 'programas' && (
                              <div className="p-4 bg-white">
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
                                      {desglose.programas.map((item) => (
                                        <tr key={item.id} className="border-b hover:bg-gray-50">
                                          <td className="py-3 px-4 text-sm">{item.nombre}</td>
                                          <td className="py-3 px-4">
                                            <Input
                                              type="number"
                                              className="text-right"
                                              value={item.aprobado || ''}
                                              onChange={(e) => updateDesgloseItem('programas', item.id, 'aprobado', parseFloat(e.target.value) || 0)}
                                              placeholder="0.00"
                                            />
                                          </td>
                                          <td className="py-3 px-4">
                                            <Input
                                              type="number"
                                              className="text-right"
                                              value={item.modificado || ''}
                                              onChange={(e) => updateDesgloseItem('programas', item.id, 'modificado', parseFloat(e.target.value) || 0)}
                                              placeholder="0.00"
                                            />
                                          </td>
                                          <td className="py-3 px-4">
                                            <Input
                                              type="number"
                                              className="text-right"
                                              value={item.pagado || ''}
                                              onChange={(e) => updateDesgloseItem('programas', item.id, 'pagado', parseFloat(e.target.value) || 0)}
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
                              </div>
                            )}
                          </div>

                          {/* Unidades responsables */}
                          <div className="border rounded-lg overflow-hidden">
                            <button
                              onClick={() => setActiveDesglose(activeDesglose === 'unidades' ? '' : 'unidades')}
                              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                              <span style={{ fontWeight: 'bold', color: '#374151' }}>
                                UNIDADES RESPONSABLES
                              </span>
                              {activeDesglose === 'unidades' ? (
                                <ChevronDown className="w-5 h-5 text-gray-600" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                              )}
                            </button>
                            
                            {activeDesglose === 'unidades' && (
                              <div className="p-4 bg-white">
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
                                      {desglose.unidades.map((item) => (
                                        <tr key={item.id} className="border-b hover:bg-gray-50">
                                          <td className="py-3 px-4 text-sm">{item.nombre}</td>
                                          <td className="py-3 px-4">
                                            <Input
                                              type="number"
                                              className="text-right"
                                              value={item.aprobado || ''}
                                              onChange={(e) => updateDesgloseItem('unidades', item.id, 'aprobado', parseFloat(e.target.value) || 0)}
                                              placeholder="0.00"
                                            />
                                          </td>
                                          <td className="py-3 px-4">
                                            <Input
                                              type="number"
                                              className="text-right"
                                              value={item.modificado || ''}
                                              onChange={(e) => updateDesgloseItem('unidades', item.id, 'modificado', parseFloat(e.target.value) || 0)}
                                              placeholder="0.00"
                                            />
                                          </td>
                                          <td className="py-3 px-4">
                                            <Input
                                              type="number"
                                              className="text-right"
                                              value={item.pagado || ''}
                                              onChange={(e) => updateDesgloseItem('unidades', item.id, 'pagado', parseFloat(e.target.value) || 0)}
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
                              </div>
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
                              >
                                <Save className="w-4 h-4 mr-2" />
                                GUARDAR COMO BORRADOR
                              </Button>
                              <Button
                                onClick={handleEnviarCGPI}
                                style={{ backgroundColor: '#1976D2' }}
                              >
                                <Send className="w-4 h-4 mr-2" />
                                ENVIAR A CGPI
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </>
                )}

                {!isFormEnabled && (
                  <div className="text-center py-20">
                    <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">
                      Seleccione una dependencia y un año fiscal para comenzar la captura
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Contenido: COMPROMISOS */}
            <TabsContent value="compromisos" className="mt-0">
              <div className="container mx-auto px-6 py-8">
                {renderEmptyState(
                  'MÓDULO DE COMPROMISOS',
                  'El módulo de carga de compromisos ya ha sido diseñado previamente. Aquí los enlaces podrán registrar y actualizar el seguimiento de los compromisos de la Gobernadora.'
                )}
              </div>
            </TabsContent>

            {/* Contenido: INDICADORES */}
            <TabsContent value="indicadores" className="mt-0">
              <div className="container mx-auto px-6 py-8">
                {renderEmptyState(
                  'MÓDULO EN CONSTRUCCIÓN',
                  'Aquí podrás cargar indicadores de desempeño de tu dependencia. Este módulo estará disponible próximamente.'
                )}
              </div>
            </TabsContent>

            {/* Contenido: NORMATIVIDAD */}
            <TabsContent value="normatividad" className="mt-0">
              <div className="container mx-auto px-6 py-8">
                {renderEmptyState(
                  'MÓDULO EN CONSTRUCCIÓN',
                  'En este espacio podrás registrar el cumplimiento normativo y documentación oficial de tu dependencia. Disponible próximamente.'
                )}
              </div>
            </TabsContent>

            {/* Contenido: OBRA PÚBLICA */}
            <TabsContent value="obra" className="mt-0">
              <div className="container mx-auto px-6 py-8">
                {renderEmptyState(
                  'MÓDULO EN CONSTRUCCIÓN',
                  'Este módulo permitirá registrar y dar seguimiento a proyectos de obra pública e infraestructura. Estará disponible próximamente.'
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
