import { useState } from 'react';
import {
  Search,
  Filter,
  Building2,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Eye,
  Download,
  RefreshCw,
  FileText,
  BarChart3,
  MapPin,
  XCircle,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { motion } from 'motion/react';
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
import { AdminObraPublicaDetailView } from './AdminObraPublicaDetailView';

interface AdminObraPublicaModuleProps {
  onBack?: () => void;
}

type EtapaObra = 'planeacion' | 'gestion' | 'contratacion' | 'ejecucion' | 'concluida';
type SemaforoIAOP = 'verde' | 'amarillo' | 'rojo';
type EstadoValidacion = 'pendiente' | 'en_revision' | 'validado' | 'rechazado';
type SituacionEvidencia = 'completa' | 'incompleta' | 'sin_cargar';

interface ObraPublica {
  id: string;
  folioSIIF: string;
  nombreObra: string;
  dependencia: string;
  municipio: string;
  tipoObra: string;
  etapa: EtapaObra;
  semaforoIAOP: SemaforoIAOP;
  iaop: number;
  estadoValidacion: EstadoValidacion;
  situacionEvidencia: SituacionEvidencia;
  montoTotal: number;
  avanceFinanciero: number;
  metaProgramada: number;
  ultimaActualizacion: string;
}

// Datos mock de obras de todas las dependencias
const OBRAS_MOCK: ObraPublica[] = [
  {
    id: 'OBR-001',
    folioSIIF: 'SIIF-2025-001',
    nombreObra: 'Construcción de Centro de Salud Rural en Tzompantepec',
    dependencia: 'Secretaría de Salud',
    municipio: 'Tzompantepec',
    tipoObra: 'Salud',
    etapa: 'ejecucion',
    semaforoIAOP: 'verde',
    iaop: 98.5,
    estadoValidacion: 'validado',
    situacionEvidencia: 'completa',
    montoTotal: 8500000,
    avanceFinanciero: 75.2,
    metaProgramada: 76.0,
    ultimaActualizacion: '2025-11-25',
  },
  {
    id: 'OBR-002',
    folioSIIF: 'SIIF-2025-002',
    nombreObra: 'Pavimentación Calle Hidalgo Fase II, Tlaxcala Centro',
    dependencia: 'Secretaría de Obras Públicas',
    municipio: 'Tlaxcala',
    tipoObra: 'Infraestructura Vial',
    etapa: 'ejecucion',
    semaforoIAOP: 'amarillo',
    iaop: 82.3,
    estadoValidacion: 'en_revision',
    situacionEvidencia: 'incompleta',
    montoTotal: 3200000,
    avanceFinanciero: 58.0,
    metaProgramada: 70.0,
    ultimaActualizacion: '2025-11-24',
  },
  {
    id: 'OBR-003',
    folioSIIF: 'SIIF-2025-003',
    nombreObra: 'Rehabilitación de Escuela Primaria "Benito Juárez"',
    dependencia: 'Secretaría de Educación Pública',
    municipio: 'Apizaco',
    tipoObra: 'Educación',
    etapa: 'contratacion',
    semaforoIAOP: 'verde',
    iaop: 95.0,
    estadoValidacion: 'validado',
    situacionEvidencia: 'completa',
    montoTotal: 1500000,
    avanceFinanciero: 0,
    metaProgramada: 0,
    ultimaActualizacion: '2025-11-23',
  },
  {
    id: 'OBR-004',
    folioSIIF: 'SIIF-2025-004',
    nombreObra: 'Ampliación Red de Agua Potable en Santa Cruz Tlaxcala',
    dependencia: 'Comisión Estatal de Agua y Saneamiento',
    municipio: 'Santa Cruz Tlaxcala',
    tipoObra: 'Hidráulica',
    etapa: 'planeacion',
    semaforoIAOP: 'rojo',
    iaop: 45.0,
    estadoValidacion: 'rechazado',
    situacionEvidencia: 'sin_cargar',
    montoTotal: 5600000,
    avanceFinanciero: 0,
    metaProgramada: 0,
    ultimaActualizacion: '2025-11-20',
  },
  {
    id: 'OBR-005',
    folioSIIF: 'SIIF-2025-005',
    nombreObra: 'Construcción de Techado en Cancha Deportiva Huamantla',
    dependencia: 'Instituto del Deporte de Tlaxcala',
    municipio: 'Huamantla',
    tipoObra: 'Deporte',
    etapa: 'gestion',
    semaforoIAOP: 'verde',
    iaop: 100.0,
    estadoValidacion: 'validado',
    situacionEvidencia: 'completa',
    montoTotal: 980000,
    avanceFinanciero: 0,
    metaProgramada: 0,
    ultimaActualizacion: '2025-11-25',
  },
  {
    id: 'OBR-006',
    folioSIIF: 'SIIF-2025-006',
    nombreObra: 'Modernización Alumbrado Público Calpulalpan',
    dependencia: 'Secretaría de Obras Públicas',
    municipio: 'Calpulalpan',
    tipoObra: 'Servicios Urbanos',
    etapa: 'ejecucion',
    semaforoIAOP: 'rojo',
    iaop: 62.0,
    estadoValidacion: 'pendiente',
    situacionEvidencia: 'incompleta',
    montoTotal: 2300000,
    avanceFinanciero: 35.0,
    metaProgramada: 55.0,
    ultimaActualizacion: '2025-11-22',
  },
  {
    id: 'OBR-007',
    folioSIIF: 'SIIF-2025-007',
    nombreObra: 'Construcción de Jardín de Niños en Chiautempan',
    dependencia: 'Secretaría de Educación Pública',
    municipio: 'Chiautempan',
    tipoObra: 'Educación',
    etapa: 'concluida',
    semaforoIAOP: 'verde',
    iaop: 100.0,
    estadoValidacion: 'validado',
    situacionEvidencia: 'completa',
    montoTotal: 4200000,
    avanceFinanciero: 100.0,
    metaProgramada: 100.0,
    ultimaActualizacion: '2025-11-26',
  },
  {
    id: 'OBR-008',
    folioSIIF: 'SIIF-2025-008',
    nombreObra: 'Construcción de Unidad Médica Rural',
    dependencia: 'Secretaría de Salud',
    municipio: 'Papalotla',
    tipoObra: 'Salud',
    etapa: 'ejecucion',
    semaforoIAOP: 'amarillo',
    iaop: 75.5,
    estadoValidacion: 'en_revision',
    situacionEvidencia: 'completa',
    montoTotal: 6200000,
    avanceFinanciero: 52.0,
    metaProgramada: 65.0,
    ultimaActualizacion: '2025-11-25',
  },
  {
    id: 'OBR-009',
    folioSIIF: 'SIIF-2025-009',
    nombreObra: 'Rehabilitación de Vialidades Centro Histórico',
    dependencia: 'Secretaría de Obras Públicas',
    municipio: 'Tlaxcala',
    tipoObra: 'Infraestructura Vial',
    etapa: 'gestion',
    semaforoIAOP: 'verde',
    iaop: 92.0,
    estadoValidacion: 'validado',
    situacionEvidencia: 'completa',
    montoTotal: 12000000,
    avanceFinanciero: 0,
    metaProgramada: 0,
    ultimaActualizacion: '2025-11-24',
  },
  {
    id: 'OBR-010',
    folioSIIF: 'SIIF-2025-010',
    nombreObra: 'Ampliación Sistema de Drenaje',
    dependencia: 'Comisión Estatal de Agua y Saneamiento',
    municipio: 'Apizaco',
    tipoObra: 'Hidráulica',
    etapa: 'planeacion',
    semaforoIAOP: 'rojo',
    iaop: 55.0,
    estadoValidacion: 'rechazado',
    situacionEvidencia: 'incompleta',
    montoTotal: 8900000,
    avanceFinanciero: 0,
    metaProgramada: 0,
    ultimaActualizacion: '2025-11-21',
  },
];

export function AdminObraPublicaModule({ onBack }: AdminObraPublicaModuleProps) {
  const [obras, setObras] = useState<ObraPublica[]>(OBRAS_MOCK);
  const [obraSeleccionada, setObraSeleccionada] = useState<ObraPublica | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroDependencia, setFiltroDependencia] = useState<string>('todas');
  const [filtroMunicipio, setFiltroMunicipio] = useState<string>('todos');
  const [filtroEtapa, setFiltroEtapa] = useState<string>('todas');
  const [filtroTipoObra, setFiltroTipoObra] = useState<string>('todos');
  const [filtroEvidencia, setFiltroEvidencia] = useState<string>('todas');
  const [filtroSemaforo, setFiltroSemaforo] = useState<string>('todos');
  const [filtroValidacion, setFiltroValidacion] = useState<string>('todos');

  // Calcular KPIs
  const totalObras = obras.length;
  const obrasIncompletas = obras.filter(o => o.situacionEvidencia !== 'completa').length;
  const obrasSinEvidencia = obras.filter(o => o.situacionEvidencia === 'sin_cargar').length;
  const obrasRojas = obras.filter(o => o.semaforoIAOP === 'rojo').length;
  const obrasAmarillas = obras.filter(o => o.semaforoIAOP === 'amarillo').length;
  const obrasVerdes = obras.filter(o => o.semaforoIAOP === 'verde').length;
  
  // Calcular IGOP global (promedio de todos los IAOP)
  const igopGlobal = obras.reduce((sum, o) => sum + o.iaop, 0) / obras.length;

  // Filtrar obras
  const obrasFiltered = obras.filter(obra => {
    const matchBusqueda = obra.nombreObra.toLowerCase().includes(busqueda.toLowerCase()) ||
                          obra.folioSIIF.toLowerCase().includes(busqueda.toLowerCase()) ||
                          obra.dependencia.toLowerCase().includes(busqueda.toLowerCase());
    const matchDependencia = filtroDependencia === 'todas' || obra.dependencia === filtroDependencia;
    const matchMunicipio = filtroMunicipio === 'todos' || obra.municipio === filtroMunicipio;
    const matchEtapa = filtroEtapa === 'todas' || obra.etapa === filtroEtapa;
    const matchTipoObra = filtroTipoObra === 'todos' || obra.tipoObra === filtroTipoObra;
    const matchEvidencia = filtroEvidencia === 'todas' || obra.situacionEvidencia === filtroEvidencia;
    const matchSemaforo = filtroSemaforo === 'todos' || obra.semaforoIAOP === filtroSemaforo;
    const matchValidacion = filtroValidacion === 'todos' || obra.estadoValidacion === filtroValidacion;
    
    return matchBusqueda && matchDependencia && matchMunicipio && matchEtapa && 
           matchTipoObra && matchEvidencia && matchSemaforo && matchValidacion;
  });

  const dependenciasUnicas = [...new Set(obras.map(o => o.dependencia))].sort();
  const municipiosUnicos = [...new Set(obras.map(o => o.municipio))].sort();
  const tiposObraUnicos = [...new Set(obras.map(o => o.tipoObra))].sort();

  const getEtapaLabel = (etapa: EtapaObra): string => {
    const labels: Record<EtapaObra, string> = {
      planeacion: 'Planeación',
      gestion: 'Gestión',
      contratacion: 'Contratación',
      ejecucion: 'Ejecución',
      concluida: 'Concluida',
    };
    return labels[etapa];
  };

  const getEtapaColor = (etapa: EtapaObra): string => {
    const colors: Record<EtapaObra, string> = {
      planeacion: '#9E9E9E',
      gestion: '#F57C00',
      contratacion: '#1976D2',
      ejecucion: '#7B1FA2',
      concluida: '#388E3C',
    };
    return colors[etapa];
  };

  const getSemaforoColor = (semaforo: SemaforoIAOP): string => {
    const colors: Record<SemaforoIAOP, string> = {
      verde: '#388E3C',
      amarillo: '#F57C00',
      rojo: '#D32F2F',
    };
    return colors[semaforo];
  };

  const getEstadoValidacionInfo = (estado: EstadoValidacion) => {
    switch (estado) {
      case 'pendiente':
        return {
          label: 'Pendiente',
          color: '#9E9E9E',
          bgColor: '#F5F5F5',
          icon: Clock,
        };
      case 'en_revision':
        return {
          label: 'En revisión',
          color: '#1976D2',
          bgColor: '#E3F2FD',
          icon: Eye,
        };
      case 'validado':
        return {
          label: 'Validado',
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

  const getSituacionEvidenciaInfo = (situacion: SituacionEvidencia) => {
    switch (situacion) {
      case 'completa':
        return {
          label: 'Completa',
          color: '#388E3C',
          bgColor: '#E8F5E9',
        };
      case 'incompleta':
        return {
          label: 'Incompleta',
          color: '#F57C00',
          bgColor: '#FFF3E0',
        };
      case 'sin_cargar':
        return {
          label: 'Sin cargar',
          color: '#D32F2F',
          bgColor: '#FFEBEE',
        };
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getSemaforoIGOPColor = (igop: number): string => {
    if (igop >= 90) return '#388E3C';
    if (igop >= 70) return '#F57C00';
    return '#D32F2F';
  };

  if (obraSeleccionada) {
    return (
      <AdminObraPublicaDetailView
        obra={obraSeleccionada}
        onVolver={() => setObraSeleccionada(null)}
        onGuardar={(obraActualizada) => {
          setObras(obras.map(o => o.id === obraActualizada.id ? obraActualizada : o));
          setObraSeleccionada(null);
        }}
      />
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Encabezado del módulo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div>
              <h1 className="text-3xl mb-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                OBRA PÚBLICA - PANEL ADMINISTRATIVO
              </h1>
              <div className="h-1 w-24 rounded-full" style={{ backgroundColor: '#582672' }} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar Reporte
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Sincronizar SIIF
            </Button>
          </div>
        </div>
        <p className="text-gray-600">
          Monitoreo, validación y control de calidad de proyectos de infraestructura pública
        </p>
      </motion.div>

      {/* KPIs Principales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      >
        <Card className="border-2" style={{ borderColor: '#1976D2' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">OBRAS TOTALES</p>
                <p className="text-3xl mb-1" style={{ fontWeight: 'bold', color: '#1976D2' }}>
                  {totalObras}
                </p>
                <p className="text-xs text-gray-500">
                  En todo el estado
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1976D220' }}>
                <Building2 className="w-6 h-6" style={{ color: '#1976D2' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2" style={{ borderColor: '#F57C00' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">INFO. INCOMPLETA</p>
                <p className="text-3xl mb-1" style={{ fontWeight: 'bold', color: '#F57C00' }}>
                  {obrasIncompletas}
                </p>
                <p className="text-xs text-gray-500">
                  Requieren atención
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F57C0020' }}>
                <AlertCircle className="w-6 h-6" style={{ color: '#F57C00' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2" style={{ borderColor: '#D32F2F' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">SIN EVIDENCIAS</p>
                <p className="text-3xl mb-1" style={{ fontWeight: 'bold', color: '#D32F2F' }}>
                  {obrasSinEvidencia}
                </p>
                <p className="text-xs text-gray-500">
                  Pendientes de carga
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D32F2F20' }}>
                <FileText className="w-6 h-6" style={{ color: '#D32F2F' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2" style={{ borderColor: getSemaforoIGOPColor(igopGlobal) }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">IGOP GLOBAL</p>
                <p className="text-3xl mb-1" style={{ fontWeight: 'bold', color: getSemaforoIGOPColor(igopGlobal) }}>
                  {igopGlobal.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500">
                  Índice Global OP
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${getSemaforoIGOPColor(igopGlobal)}20` }}>
                <TrendingUp className="w-6 h-6" style={{ color: getSemaforoIGOPColor(igopGlobal) }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Semáforos por color */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full" style={{ backgroundColor: '#388E3C' }} />
                <div>
                  <p className="text-sm text-gray-600">Semáforo Verde</p>
                  <p className="text-xl" style={{ fontWeight: 'bold', color: '#388E3C' }}>
                    {obrasVerdes} obras
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {((obrasVerdes / totalObras) * 100).toFixed(0)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full" style={{ backgroundColor: '#F57C00' }} />
                <div>
                  <p className="text-sm text-gray-600">Semáforo Amarillo</p>
                  <p className="text-xl" style={{ fontWeight: 'bold', color: '#F57C00' }}>
                    {obrasAmarillas} obras
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {((obrasAmarillas / totalObras) * 100).toFixed(0)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full" style={{ backgroundColor: '#D32F2F' }} />
                <div>
                  <p className="text-sm text-gray-600">Semáforo Rojo</p>
                  <p className="text-xl" style={{ fontWeight: 'bold', color: '#D32F2F' }}>
                    {obrasRojas} obras
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {((obrasRojas / totalObras) * 100).toFixed(0)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Barra de búsqueda y filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              {/* Búsqueda */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre de obra, folio SIIF o dependencia..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtros principales */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-2">DEPENDENCIA</label>
                  <Select value={filtroDependencia} onValueChange={setFiltroDependencia}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas las dependencias</SelectItem>
                      {dependenciasUnicas.map(dep => (
                        <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-2">MUNICIPIO</label>
                  <Select value={filtroMunicipio} onValueChange={setFiltroMunicipio}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los municipios</SelectItem>
                      {municipiosUnicos.map(mun => (
                        <SelectItem key={mun} value={mun}>{mun}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-2">ETAPA</label>
                  <Select value={filtroEtapa} onValueChange={setFiltroEtapa}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas las etapas</SelectItem>
                      <SelectItem value="planeacion">Planeación</SelectItem>
                      <SelectItem value="gestion">Gestión</SelectItem>
                      <SelectItem value="contratacion">Contratación</SelectItem>
                      <SelectItem value="ejecucion">Ejecución</SelectItem>
                      <SelectItem value="concluida">Concluida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-2">TIPO DE OBRA</label>
                  <Select value={filtroTipoObra} onValueChange={setFiltroTipoObra}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los tipos</SelectItem>
                      {tiposObraUnicos.map(tipo => (
                        <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Filtros adicionales */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-2">SITUACIÓN DE EVIDENCIA</label>
                  <Select value={filtroEvidencia} onValueChange={setFiltroEvidencia}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas las situaciones</SelectItem>
                      <SelectItem value="completa">Evidencia completa</SelectItem>
                      <SelectItem value="incompleta">Evidencia incompleta</SelectItem>
                      <SelectItem value="sin_cargar">Sin evidencia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-2">SEMÁFORO IAOP</label>
                  <Select value={filtroSemaforo} onValueChange={setFiltroSemaforo}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los semáforos</SelectItem>
                      <SelectItem value="verde">Verde (Alto desempeño)</SelectItem>
                      <SelectItem value="amarillo">Amarillo (Moderado)</SelectItem>
                      <SelectItem value="rojo">Rojo (Bajo desempeño)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-2">ESTADO DE VALIDACIÓN</label>
                  <Select value={filtroValidacion} onValueChange={setFiltroValidacion}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los estados</SelectItem>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="en_revision">En revisión</SelectItem>
                      <SelectItem value="validado">Validado</SelectItem>
                      <SelectItem value="rechazado">Rechazado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <p className="text-sm text-gray-600">
                  Mostrando <span style={{ fontWeight: 'bold' }}>{obrasFiltered.length}</span> de <span style={{ fontWeight: 'bold' }}>{totalObras}</span> obras
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setBusqueda('');
                    setFiltroDependencia('todas');
                    setFiltroMunicipio('todos');
                    setFiltroEtapa('todas');
                    setFiltroTipoObra('todos');
                    setFiltroEvidencia('todas');
                    setFiltroSemaforo('todos');
                    setFiltroValidacion('todos');
                  }}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Limpiar filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabla de obras */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
              <BarChart3 className="w-5 h-5" />
              LISTADO DE OBRAS PÚBLICAS DEL ESTADO
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>FOLIO</TableHead>
                    <TableHead>OBRA</TableHead>
                    <TableHead>DEPENDENCIA</TableHead>
                    <TableHead>MUNICIPIO</TableHead>
                    <TableHead>ETAPA</TableHead>
                    <TableHead>IAOP</TableHead>
                    <TableHead>EVIDENCIA</TableHead>
                    <TableHead>VALIDACIÓN</TableHead>
                    <TableHead className="text-right">ACCIONES</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {obrasFiltered.map((obra) => {
                    const estadoInfo = getEstadoValidacionInfo(obra.estadoValidacion);
                    const evidenciaInfo = getSituacionEvidenciaInfo(obra.situacionEvidencia);
                    const EstadoIcon = estadoInfo.icon;

                    return (
                      <TableRow key={obra.id} className="hover:bg-gray-50">
                        <TableCell>
                          <span style={{ fontWeight: 'bold', color: '#1976D2' }}>
                            {obra.folioSIIF}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p style={{ fontWeight: 'bold', color: '#374151' }} className="mb-1">
                              {obra.nombreObra}
                            </p>
                            <p className="text-xs text-gray-500">
                              {obra.tipoObra} • {formatCurrency(obra.montoTotal)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{obra.dependencia}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{obra.municipio}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            style={{
                              backgroundColor: `${getEtapaColor(obra.etapa)}20`,
                              color: getEtapaColor(obra.etapa),
                              border: `1px solid ${getEtapaColor(obra.etapa)}`,
                            }}
                          >
                            {getEtapaLabel(obra.etapa)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded-full flex-shrink-0"
                              style={{ backgroundColor: getSemaforoColor(obra.semaforoIAOP) }}
                            />
                            <span style={{ fontWeight: 'bold', color: getSemaforoColor(obra.semaforoIAOP) }}>
                              {obra.iaop.toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            style={{
                              backgroundColor: evidenciaInfo.bgColor,
                              color: evidenciaInfo.color,
                              border: `1px solid ${evidenciaInfo.color}`,
                            }}
                          >
                            {evidenciaInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className="flex items-center gap-1 w-fit"
                            style={{
                              backgroundColor: estadoInfo.bgColor,
                              color: estadoInfo.color,
                              border: `1px solid ${estadoInfo.color}`,
                            }}
                          >
                            <EstadoIcon className="w-3 h-3" />
                            {estadoInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setObraSeleccionada(obra)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Revisar
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {obrasFiltered.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No se encontraron obras con los filtros seleccionados</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setBusqueda('');
                    setFiltroDependencia('todas');
                    setFiltroMunicipio('todos');
                    setFiltroEtapa('todas');
                    setFiltroTipoObra('todos');
                    setFiltroEvidencia('todas');
                    setFiltroSemaforo('todos');
                    setFiltroValidacion('todos');
                  }}
                >
                  Limpiar filtros
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}