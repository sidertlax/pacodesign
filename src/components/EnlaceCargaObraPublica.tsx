import { useState } from 'react';
import {
  ArrowLeft,
  Search,
  Filter,
  Building2,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Eye,
  Download,
  RefreshCw,
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
import { ObraPublicaDetailView } from './ObraPublicaDetailView';

interface EnlaceCargaObraPublicaProps {
  userName: string;
  onVolverInicio?: () => void;
}

type EtapaObra = 'planeacion' | 'gestion' | 'contratacion' | 'ejecucion' | 'concluida';
type EstadoCarga = 'completa' | 'incompleta';
type SemaforoIAOP = 'verde' | 'amarillo' | 'rojo';

interface ObraPublica {
  id: string;
  folioSIIF: string;
  nombreObra: string;
  municipio: string;
  etapa: EtapaObra;
  estadoCarga: EstadoCarga;
  semaforoIAOP: SemaforoIAOP;
  iaop: number;
  montoTotal: number;
  avanceFinanciero: number;
  metaProgramada: number;
  tipoObra: string;
  evidenciasCompletas: boolean;
}

// Datos mock de obras
const OBRAS_MOCK: ObraPublica[] = [
  {
    id: 'OBR-001',
    folioSIIF: 'SIIF-2025-001',
    nombreObra: 'Construcción de Centro de Salud Rural en Tzompantepec',
    municipio: 'Tzompantepec',
    etapa: 'ejecucion',
    estadoCarga: 'completa',
    semaforoIAOP: 'verde',
    iaop: 98.5,
    montoTotal: 8500000,
    avanceFinanciero: 75.2,
    metaProgramada: 76.0,
    tipoObra: 'Salud',
    evidenciasCompletas: true,
  },
  {
    id: 'OBR-002',
    folioSIIF: 'SIIF-2025-002',
    nombreObra: 'Pavimentación Calle Hidalgo Fase II, Tlaxcala Centro',
    municipio: 'Tlaxcala',
    etapa: 'ejecucion',
    estadoCarga: 'incompleta',
    semaforoIAOP: 'amarillo',
    iaop: 82.3,
    montoTotal: 3200000,
    avanceFinanciero: 58.0,
    metaProgramada: 70.0,
    tipoObra: 'Infraestructura Vial',
    evidenciasCompletas: false,
  },
  {
    id: 'OBR-003',
    folioSIIF: 'SIIF-2025-003',
    nombreObra: 'Rehabilitación de Escuela Primaria "Benito Juárez"',
    municipio: 'Apizaco',
    etapa: 'contratacion',
    estadoCarga: 'completa',
    semaforoIAOP: 'verde',
    iaop: 95.0,
    montoTotal: 1500000,
    avanceFinanciero: 0,
    metaProgramada: 0,
    tipoObra: 'Educación',
    evidenciasCompletas: true,
  },
  {
    id: 'OBR-004',
    folioSIIF: 'SIIF-2025-004',
    nombreObra: 'Ampliación Red de Agua Potable en Santa Cruz Tlaxcala',
    municipio: 'Santa Cruz Tlaxcala',
    etapa: 'planeacion',
    estadoCarga: 'incompleta',
    semaforoIAOP: 'rojo',
    iaop: 45.0,
    montoTotal: 5600000,
    avanceFinanciero: 0,
    metaProgramada: 0,
    tipoObra: 'Hidráulica',
    evidenciasCompletas: false,
  },
  {
    id: 'OBR-005',
    folioSIIF: 'SIIF-2025-005',
    nombreObra: 'Construcción de Techado en Cancha Deportiva Huamantla',
    municipio: 'Huamantla',
    etapa: 'gestion',
    estadoCarga: 'completa',
    semaforoIAOP: 'verde',
    iaop: 100.0,
    montoTotal: 980000,
    avanceFinanciero: 0,
    metaProgramada: 0,
    tipoObra: 'Deporte',
    evidenciasCompletas: true,
  },
  {
    id: 'OBR-006',
    folioSIIF: 'SIIF-2025-006',
    nombreObra: 'Modernización Alumbrado Público Calpulalpan',
    municipio: 'Calpulalpan',
    etapa: 'ejecucion',
    estadoCarga: 'incompleta',
    semaforoIAOP: 'rojo',
    iaop: 62.0,
    montoTotal: 2300000,
    avanceFinanciero: 35.0,
    metaProgramada: 55.0,
    tipoObra: 'Servicios Urbanos',
    evidenciasCompletas: false,
  },
  {
    id: 'OBR-007',
    folioSIIF: 'SIIF-2025-007',
    nombreObra: 'Construcción de Jardín de Niños en Chiautempan',
    municipio: 'Chiautempan',
    etapa: 'concluida',
    estadoCarga: 'completa',
    semaforoIAOP: 'verde',
    iaop: 100.0,
    montoTotal: 4200000,
    avanceFinanciero: 100.0,
    metaProgramada: 100.0,
    tipoObra: 'Educación',
    evidenciasCompletas: true,
  },
];

export function EnlaceCargaObraPublica({ userName, onVolverInicio }: EnlaceCargaObraPublicaProps) {
  const dependenciaAsignada = 'Secretaría de Obras Públicas';
  const fechaActual = new Date().toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const [obras, setObras] = useState<ObraPublica[]>(OBRAS_MOCK);
  const [obraSeleccionada, setObraSeleccionada] = useState<ObraPublica | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEtapa, setFiltroEtapa] = useState<string>('todas');
  const [filtroMunicipio, setFiltroMunicipio] = useState<string>('todos');
  const [filtroSemaforo, setFiltroSemaforo] = useState<string>('todos');
  const [filtroEvidencia, setFiltroEvidencia] = useState<string>('todos');

  // Calcular indicadores
  const obrasFiltered = obras.filter(obra => {
    const matchBusqueda = obra.nombreObra.toLowerCase().includes(busqueda.toLowerCase()) ||
                          obra.folioSIIF.toLowerCase().includes(busqueda.toLowerCase());
    const matchEtapa = filtroEtapa === 'todas' || obra.etapa === filtroEtapa;
    const matchMunicipio = filtroMunicipio === 'todos' || obra.municipio === filtroMunicipio;
    const matchSemaforo = filtroSemaforo === 'todos' || obra.semaforoIAOP === filtroSemaforo;
    const matchEvidencia = filtroEvidencia === 'todos' || 
                           (filtroEvidencia === 'completas' && obra.evidenciasCompletas) ||
                           (filtroEvidencia === 'incompletas' && !obra.evidenciasCompletas);
    
    return matchBusqueda && matchEtapa && matchMunicipio && matchSemaforo && matchEvidencia;
  });

  const totalObras = obras.length;
  const obrasEnEjecucion = obras.filter(o => o.etapa === 'ejecucion').length;
  const obrasPendientesIniciar = obras.filter(o => o.estadoCarga === 'incompleta').length;
  const obrasSinEvidencias = obras.filter(o => !o.evidenciasCompletas).length;
  const iaopPromedio = obras.reduce((sum, o) => sum + o.iaop, 0) / obras.length;

  const municipiosUnicos = [...new Set(obras.map(o => o.municipio))].sort();

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

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (obraSeleccionada) {
    return (
      <ObraPublicaDetailView
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
        <Button
          variant="outline"
          onClick={onVolverInicio}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
        </Button>
        <h1 className="text-3xl mb-2" style={{ color: '#582672', fontWeight: 'bold' }}>
          OBRA PÚBLICA
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
                  <p className="text-sm text-gray-600 mb-1">DEPENDENCIA / ENTIDAD EJECUTORA</p>
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

      {/* Indicadores rápidos */}
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
                <p className="text-3xl" style={{ fontWeight: 'bold', color: '#1976D2' }}>
                  {totalObras}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1976D220' }}>
                <FileText className="w-6 h-6" style={{ color: '#1976D2' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2" style={{ borderColor: '#F57C00' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">OBRAS EN EJECUCIÓN</p>
                <p className="text-3xl" style={{ fontWeight: 'bold', color: '#7B1FA2' }}>
                  {obrasEnEjecucion}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#7B1FA220' }}>
                <TrendingUp className="w-6 h-6" style={{ color: '#7B1FA2' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2" style={{ borderColor: '#F57C00' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">PENDIENTES DE INICIAR</p>
                <p className="text-3xl" style={{ fontWeight: 'bold', color: '#F57C00' }}>
                  {obrasPendientesIniciar}
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
                <p className="text-3xl" style={{ fontWeight: 'bold', color: '#D32F2F' }}>
                  {obrasSinEvidencias}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D32F2F20' }}>
                <AlertCircle className="w-6 h-6" style={{ color: '#D32F2F' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2" style={{ borderColor: '#388E3C' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">IAOP PROMEDIO</p>
                <p className="text-3xl" style={{ fontWeight: 'bold', color: '#388E3C' }}>
                  {iaopPromedio.toFixed(1)}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#388E3C20' }}>
                <TrendingUp className="w-6 h-6" style={{ color: '#388E3C' }} />
              </div>
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
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre de obra o folio SIIF..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtros */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-2">FILTRAR POR ETAPA</label>
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
                  <label className="block text-xs text-gray-600 mb-2">FILTRAR POR MUNICIPIO</label>
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
                  <label className="block text-xs text-gray-600 mb-2">FILTRAR POR SEMÁFORO</label>
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
                  <label className="block text-xs text-gray-600 mb-2">FILTRAR POR EVIDENCIAS</label>
                  <Select value={filtroEvidencia} onValueChange={setFiltroEvidencia}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas las obras</SelectItem>
                      <SelectItem value="completas">Evidencias completas</SelectItem>
                      <SelectItem value="incompletas">Evidencias incompletas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <p className="text-sm text-gray-600">
                  Mostrando <span style={{ fontWeight: 'bold' }}>{obrasFiltered.length}</span> de <span style={{ fontWeight: 'bold' }}>{totalObras}</span> obras
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sincronizar SIIF
                  </Button>
                </div>
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
              <FileText className="w-5 h-5" />
              LISTADO DE OBRAS PÚBLICAS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>FOLIO SIIF</TableHead>
                    <TableHead>NOMBRE DE LA OBRA</TableHead>
                    <TableHead>MUNICIPIO</TableHead>
                    <TableHead>ETAPA</TableHead>
                    <TableHead>ESTADO DE CARGA</TableHead>
                    <TableHead>IAOP</TableHead>
                    <TableHead>SEMÁFORO</TableHead>
                    <TableHead className="text-right">ACCIONES</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {obrasFiltered.map((obra) => (
                    <TableRow key={obra.id} className="hover:bg-gray-50">
                      <TableCell>
                        <span style={{ fontWeight: 'bold', color: '#1976D2' }}>
                          {obra.folioSIIF}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-md">
                          <p style={{ fontWeight: 'bold', color: '#374151' }}>
                            {obra.nombreObra}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {obra.tipoObra} • {formatCurrency(obra.montoTotal)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{obra.municipio}</TableCell>
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
                        <Badge
                          variant={obra.estadoCarga === 'completa' ? 'default' : 'outline'}
                          style={obra.estadoCarga === 'completa' ? {
                            backgroundColor: '#388E3C20',
                            color: '#388E3C',
                            border: '1px solid #388E3C',
                          } : {
                            backgroundColor: '#F57C0020',
                            color: '#F57C00',
                            border: '1px solid #F57C00',
                          }}
                        >
                          {obra.estadoCarga === 'completa' ? 'Completa' : 'Incompleta'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span style={{ fontWeight: 'bold', color: getSemaforoColor(obra.semaforoIAOP) }}>
                          {obra.iaop.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: getSemaforoColor(obra.semaforoIAOP) }}
                            title={`Semáforo ${obra.semaforoIAOP}`}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setObraSeleccionada(obra)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver detalle
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
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
                    setFiltroEtapa('todas');
                    setFiltroMunicipio('todos');
                    setFiltroSemaforo('todos');
                    setFiltroEvidencia('todos');
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