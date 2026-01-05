import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Download,
  Filter,
  Search,
  Target,
  Building2,
  MapPin,
  TrendingUp,
  FileText,
  AlertCircle,
  Loader2,
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
import { compromisosAPI } from '../services/api';

interface DashboardUnidadMedidaProps {
  onClose: () => void;
  año: string;
  dependencies: Array<{ id: string; name: string }>;
}

interface CompromisoRow {
  id: string;
  municipio: string;
  dependencia: string;
  compromiso: string;
  meta: string;
  unidadMedida: string;
  cantidad: number;
  año: number;
  avance: number;
}

export function CompromisosDashboardUnidadMedida({ onClose, año: añoInicial, dependencies }: DashboardUnidadMedidaProps) {
  const [dataCompleta, setDataCompleta] = useState<CompromisoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [unidadesMedida, setUnidadesMedida] = useState<string[]>([]);
  const [unidadSeleccionada, setUnidadSeleccionada] = useState<string>('');
  const [año, setAño] = useState(añoInicial || 'todos');
  const [dependenciaFiltro, setDependenciaFiltro] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Fetch real data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all compromisos from all dependencies
        const promises = dependencies.map(dep =>
          compromisosAPI.getByDependency(dep.id).catch(() => ({ compromisos: [] }))
        );

        const results = await Promise.all(promises);
        const allCompromisos = results.flatMap(result => result.compromisos || []);

        // Deduplicate by compromiso_numero (same as CompromisosGeneralModule)
        const uniqueCompromisos = Array.from(
          allCompromisos.reduce((map, c) => {
            const key = c.compromiso_numero || c.id;
            if (!map.has(key)) {
              map.set(key, c);
            }
            return map;
          }, new Map()).values()
        );

        // Create dependencies map
        const depMap = new Map(dependencies.map(d => [d.id, d.name]));

        // Transform to table format (use UNIQUE compromisos only)
        const tableData: CompromisoRow[] = uniqueCompromisos.map(c => ({
          id: c.id,
          municipio: c.municipio || 'N/A', // ⚠️ MISSING IN DATABASE
          dependencia: depMap.get(c.dependency_id) || c.dependency_id,
          compromiso: c.nombre,
          meta: `${c.meta_total}`, // Just the number
          unidadMedida: c.unidad_medida,
          cantidad: c.meta_total || 0,
          año: c.año_contexto,
          avance: c.porcentaje_avance || 0
        }));

        setDataCompleta(tableData);

        // Extract unique unidades de medida
        const uniqueUnidades = Array.from(
          new Set(tableData.map(d => d.unidadMedida))
        ).sort();

        setUnidadesMedida(uniqueUnidades);

        // Set default selection to first unidad
        if (uniqueUnidades.length > 0) {
          setUnidadSeleccionada(uniqueUnidades[0]);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching compromisos:', error);
        setLoading(false);
      }
    };

    if (dependencies.length > 0) {
      fetchData();
    }
  }, [dependencies]);

  // Filtrar datos
  const dataFiltrada = dataCompleta.filter(item => {
    const matchUnidad = item.unidadMedida === unidadSeleccionada;
    const matchAño = año === 'todos' || item.año.toString() === año;
    const matchDependencia = dependenciaFiltro === 'todos' || item.dependencia === dependenciaFiltro;
    const matchSearch = item.compromiso.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.meta.toLowerCase().includes(searchTerm.toLowerCase());

    return matchUnidad && matchAño && matchDependencia && matchSearch;
  });

  // Calcular total acumulado
  const totalAcumulado = dataFiltrada.reduce((sum, item) => sum + item.cantidad, 0);

  // Paginación
  const totalPages = Math.ceil(dataFiltrada.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const dataPaginada = dataFiltrada.slice(startIndex, endIndex);

  // Calcular estadísticas
  const municipiosUnicos = new Set(dataFiltrada.filter(d => d.municipio !== 'N/A').map(d => d.municipio)).size;
  const dependenciasUnicas = new Set(dataFiltrada.map(d => d.dependencia)).size;
  const compromisosUnicos = dataFiltrada.length;

  // Get unique dependencies for filter
  const dependenciasList = Array.from(
    new Set(dataCompleta.map(d => d.dependencia))
  ).sort();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto" style={{ color: '#582672' }} />
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

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
              <div>
                <h1 className="text-2xl" style={{ color: '#582672', fontWeight: 'bold' }}>
                  Dashboard por Unidad de Medida
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Análisis de acciones por tipo de indicador — {dataCompleta.length} compromisos únicos
                </p>
              </div>
            </div>

            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar datos
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* KPIs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        >
          <Card className="border-2" style={{ borderColor: '#582672' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">TOTAL ACUMULADO</p>
                  <p className="text-3xl" style={{ fontWeight: 'bold', color: '#582672' }}>
                    {totalAcumulado.toLocaleString('es-MX')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{unidadSeleccionada}</p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#58267220' }}>
                  <Target className="w-6 h-6" style={{ color: '#582672' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2" style={{ borderColor: '#1976D2' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">MUNICIPIOS</p>
                  <p className="text-3xl" style={{ fontWeight: 'bold', color: '#1976D2' }}>
                    {municipiosUnicos > 0 ? municipiosUnicos : 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {municipiosUnicos === 0 && '⚠️ Sin datos'}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1976D220' }}>
                  <MapPin className="w-6 h-6" style={{ color: '#1976D2' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2" style={{ borderColor: '#F57C00' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">DEPENDENCIAS</p>
                  <p className="text-3xl" style={{ fontWeight: 'bold', color: '#F57C00' }}>
                    {dependenciasUnicas}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F57C0020' }}>
                  <Building2 className="w-6 h-6" style={{ color: '#F57C00' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2" style={{ borderColor: '#388E3C' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">COMPROMISOS</p>
                  <p className="text-3xl" style={{ fontWeight: 'bold', color: '#388E3C' }}>
                    {compromisosUnicos}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#388E3C20' }}>
                  <FileText className="w-6 h-6" style={{ color: '#388E3C' }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                <Filter className="w-5 h-5" />
                FILTROS DE CONSULTA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filtro principal: Unidad de Medida */}
              <div>
                <label className="block text-sm mb-2" style={{ fontWeight: 'bold', color: '#374151' }}>
                  UNIDAD DE MEDIDA * (OBLIGATORIO)
                </label>
                <Select value={unidadSeleccionada} onValueChange={setUnidadSeleccionada}>
                  <SelectTrigger className="border-2" style={{ borderColor: '#582672' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {unidadesMedida.map(unidad => (
                      <SelectItem key={unidad} value={unidad}>{unidad}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  {unidadesMedida.length} unidades de medida disponibles
                </p>
              </div>

              {/* Filtros secundarios */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">AÑO</label>
                  <Select value={año} onValueChange={(value) => { setAño(value); setCurrentPage(1); }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los años</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">DEPENDENCIA</label>
                  <Select value={dependenciaFiltro} onValueChange={(value) => { setDependenciaFiltro(value); setCurrentPage(1); }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas las dependencias</SelectItem>
                      {dependenciasList.map(dep => (
                        <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">BÚSQUEDA</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Buscar compromiso o meta..."
                      value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <p className="text-sm text-gray-600">
                  Mostrando <span style={{ fontWeight: 'bold' }}>{dataFiltrada.length}</span> registros
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setAño('todos');
                    setDependenciaFiltro('todos');
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                >
                  Limpiar filtros
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabla de resultados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                <TrendingUp className="w-5 h-5" />
                RESULTADOS
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dataFiltrada.length > 0 ? (
                <>
                  {/* Card-based layout instead of table */}
                  <div className="space-y-3">
                    {dataPaginada.map((item) => (
                      <Card key={item.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <span className="text-sm font-medium text-gray-600">{item.dependencia}</span>
                                <Badge
                                  className="ml-auto"
                                  style={{
                                    backgroundColor: item.avance >= 67 ? '#2E7D3220' : item.avance >= 34 ? '#F9A82520' : '#D32F2F20',
                                    color: item.avance >= 67 ? '#2E7D32' : item.avance >= 34 ? '#F9A825' : '#D32F2F'
                                  }}
                                >
                                  {item.avance}% avance
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <p className="text-base text-gray-900 mb-3 leading-relaxed">
                            {item.compromiso}
                          </p>

                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-4">
                              <div className="text-sm">
                                <span className="text-gray-500">Meta:</span>
                                <span className="ml-2 font-bold" style={{ color: '#582672' }}>
                                  {item.meta}
                                </span>
                              </div>
                              <div className="text-sm">
                                <span className="text-gray-500">Cantidad:</span>
                                <span className="ml-2 font-bold text-lg" style={{ color: '#582672' }}>
                                  {item.cantidad.toLocaleString('es-MX')}
                                </span>
                              </div>
                            </div>
                            <Badge variant="outline">{item.año}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Total summary card */}
                  <Card className="mt-4 border-2" style={{ borderColor: '#582672', backgroundColor: '#58267210' }}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold" style={{ color: '#582672' }}>
                          TOTAL ACUMULADO:
                        </span>
                        <span className="text-2xl font-bold" style={{ color: '#582672' }}>
                          {totalAcumulado.toLocaleString('es-MX')}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Paginación */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-600">
                        Página {currentPage} de {totalPages}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(currentPage - 1)}
                        >
                          Anterior
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(currentPage + 1)}
                        >
                          Siguiente
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No se encontraron resultados con los filtros seleccionados</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Warning about missing municipio data */}
        {municipiosUnicos === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <Card className="border-2 border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-orange-900 mb-1">
                      ⚠️ Datos de Municipio No Disponibles
                    </p>
                    <p className="text-xs text-orange-700">
                      El campo "municipio" no está presente en el archivo compromisos.xlsx.
                      Por favor solicítelo en la reunión de hoy para completar esta información.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
