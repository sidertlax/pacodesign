import { useState, useEffect } from 'react';
import { ArrowLeft, BarChart3, CheckCircle2, AlertTriangle, Download, FileText, TrendingUp, Search, RotateCcw, Clock, Target, Award, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Progress } from './ui/progress';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { indicadoresAPI } from '@/services/api';

interface IndicadoresGeneralModuleProps {
  onClose: () => void;
  onDependencyClick: (dep: { id: string; name: string }) => void;
  dependencies: Array<{
    id: string;
    name: string;
    modules: {
      gasto: number;
      indicadores: number;
      compromisos: number;
      normatividad: number;
    };
  }>;
}

export function IndicadoresGeneralModule({ onClose, onDependencyClick, dependencies }: IndicadoresGeneralModuleProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDependency, setSelectedDependency] = useState<string>('todas');
  const [selectedEje, setSelectedEje] = useState<string>('todos');
  const [selectedPrograma, setSelectedPrograma] = useState<string>('todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [indicadoresData, setIndicadoresData] = useState<any[]>([]);

  // Función para formatear números
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('es-MX').format(value);
  };

  // Función para calcular cumplimiento de un indicador
  const calculateCumplimiento = (meta: number, avance: number) => {
    if (meta === 0) return 0;
    return (avance / meta) * 100;
  };

  // Fetch real data from API
  useEffect(() => {
    const fetchAllIndicadores = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch indicators for all dependencies in parallel
        const promises = dependencies.map(dep =>
          indicadoresAPI.getByDependency(dep.id, 2026, 4)
            .then(response => ({
              dependencyId: dep.id,
              dependencyName: dep.name,
              indicadores: response.indicadores || []
            }))
            .catch(err => ({
              dependencyId: dep.id,
              dependencyName: dep.name,
              indicadores: []
            }))
        );

        const results = await Promise.all(promises);

        // Process results to calculate stats for each dependency
        const processedData = results.map(result => {
          const indicadores = result.indicadores;
          const total_indicadores = indicadores.length;

          // Calculate cumplimiento for each indicator
          const indicadoresConCumplimiento = indicadores.map((ind: any) => ({
            ...ind,
            cumplimiento: calculateCumplimiento(ind.meta, ind.avance)
          }));

          // Count indicators by status
          const indicadores_cumplidos = indicadoresConCumplimiento.filter(
            (ind: any) => ind.cumplimiento >= 67
          ).length;

          const indicadores_en_riesgo = indicadoresConCumplimiento.filter(
            (ind: any) => ind.cumplimiento >= 34 && ind.cumplimiento < 67
          ).length;

          const indicadores_no_cumplidos = indicadoresConCumplimiento.filter(
            (ind: any) => ind.cumplimiento < 34
          ).length;

          // Calculate ICD (average cumplimiento)
          const icd = total_indicadores > 0
            ? indicadoresConCumplimiento.reduce((sum: number, ind: any) => sum + ind.cumplimiento, 0) / total_indicadores
            : 0;

          // Determine trend (for now, stable - could be calculated from historical data)
          const trend: 'up' | 'down' | 'stable' = 'stable';

          return {
            id: result.dependencyId,
            name: result.dependencyName,
            total_indicadores,
            indicadores_cumplidos,
            indicadores_en_riesgo,
            indicadores_no_cumplidos,
            icd,
            trend,
            rawIndicadores: indicadores
          };
        });

        setIndicadoresData(processedData);
      } catch (err: any) {
        console.error('Error fetching indicadores:', err);
        setError(err.message || 'Error al cargar indicadores');
      } finally {
        setLoading(false);
      }
    };

    fetchAllIndicadores();
  }, [dependencies]);

  // Filtrar datos según búsqueda y selección
  const filteredData = indicadoresData.filter(dep => {
    const matchesSearch = dep.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDependency = selectedDependency === 'todas' || dep.id === selectedDependency;
    return matchesSearch && matchesDependency;
  });

  // Calcular totales generales
  const total_indicadores_general = indicadoresData.reduce((sum, dep) => sum + dep.total_indicadores, 0);
  const total_cumplidos_general = indicadoresData.reduce((sum, dep) => sum + dep.indicadores_cumplidos, 0);
  const total_en_riesgo_general = indicadoresData.reduce((sum, dep) => sum + dep.indicadores_en_riesgo, 0);
  const total_no_cumplidos_general = indicadoresData.reduce((sum, dep) => sum + dep.indicadores_no_cumplidos, 0);
  const icd_estatal = indicadoresData.reduce((sum, dep) => sum + dep.icd, 0) / indicadoresData.length;

  // Función para obtener color de semáforo
  const getStatusColor = (percentage: number) => {
    if (percentage >= 67) return '#2E7D32'; // Verde
    if (percentage >= 34) return '#F9A825'; // Amarillo
    return '#D32F2F'; // Rojo
  };

  // Datos para la gráfica - Top 12 dependencias
  const chartData = filteredData
    .slice(0, 12)
    .map(dep => ({
      name: dep.name.length > 35 ? dep.name.substring(0, 35) + '...' : dep.name,
      fullName: dep.name,
      ICD: dep.icd,
      total: dep.total_indicadores,
      cumplidos: dep.indicadores_cumplidos,
      enRiesgo: dep.indicadores_en_riesgo,
      noCumplidos: dep.indicadores_no_cumplidos,
    }))
    .sort((a, b) => b.ICD - a.ICD);

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const color = getStatusColor(data.ICD);
      
      return (
        <div className="bg-white p-4 border-2 rounded-lg shadow-xl" style={{ borderColor: color }}>
          <p className="font-semibold text-sm mb-3 text-gray-900">{data.fullName}</p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4 pb-2 border-b border-gray-200">
              <span className="text-xs text-gray-600">ICD (Cumplimiento):</span>
              <Badge
                className="border-0"
                style={{
                  backgroundColor: `${color}15`,
                  color: color,
                  fontWeight: 'bold',
                }}
              >
                {data.ICD.toFixed(1)}%
              </Badge>
            </div>
            
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Total de indicadores:</span>
                <span className="text-xs font-semibold text-gray-900">{data.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: '#2E7D32' }}>✓ Cumplidos:</span>
                <span className="text-xs font-semibold" style={{ color: '#2E7D32' }}>{data.cumplidos}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: '#F9A825' }}>⚠ En progreso:</span>
                <span className="text-xs font-semibold" style={{ color: '#F9A825' }}>{data.enRiesgo}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: '#D32F2F' }}>✗ Bajo cumplimiento:</span>
                <span className="text-xs font-semibold" style={{ color: '#D32F2F' }}>{data.noCumplidos}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Función para obtener símbolo de tendencia
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <span className="text-green-600">↑</span>;
    if (trend === 'down') return <span className="text-red-600">↓</span>;
    return <span className="text-gray-600">↔</span>;
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
              <div>
                <h1 className="text-3xl" style={{ color: '#582672', fontWeight: 'bold' }}>
                  Módulo de Indicadores de Desempeño (Cumplimiento)
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Seguimiento al cumplimiento de metas institucionales del Poder Ejecutivo del Estado de Tlaxcala
                </p>
              </div>
            </div>
            
            {/* Indicador circular de cumplimiento global */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Cumplimiento Global Estatal</p>
                <Badge
                  className="text-lg px-4 py-2 border-0"
                  style={{
                    backgroundColor: `${getStatusColor(icd_estatal)}15`,
                    color: getStatusColor(icd_estatal),
                    fontWeight: 'bold',
                  }}
                >
                  <motion.div
                    className="w-2.5 h-2.5 rounded-full mr-2"
                    style={{
                      backgroundColor: getStatusColor(icd_estatal),
                      boxShadow: `0 0 10px ${getStatusColor(icd_estatal)}90`,
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  ICD: {icd_estatal.toFixed(1)}%
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin mb-4" style={{ color: '#582672' }} />
            <p className="text-lg text-gray-600">Cargando indicadores de todas las dependencias...</p>
            <p className="text-sm text-gray-500 mt-2">Esto puede tomar unos segundos</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-900 mb-2">Error al cargar datos</h3>
                    <p className="text-sm text-red-700 mb-4">{error}</p>
                    <Button
                      onClick={() => window.location.reload()}
                      variant="outline"
                      className="border-red-300 hover:bg-red-100"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reintentar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Content - Only show when not loading and no error */}
        {!loading && !error && (
          <>
        {/* Barra de filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Buscador */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por nombre de dependencia o palabra clave..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Selector de dependencia */}
                <div className="w-full md:w-56">
                  <Select value={selectedDependency} onValueChange={setSelectedDependency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Dependencia / Entidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas las dependencias</SelectItem>
                      {dependencies.slice(0, 20).map(dep => (
                        <SelectItem key={dep.id} value={dep.id}>
                          {dep.name.length > 40 ? dep.name.substring(0, 40) + '...' : dep.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Selector de Eje del PED */}
                <div className="w-full md:w-56">
                  <Select value={selectedEje} onValueChange={setSelectedEje}>
                    <SelectTrigger>
                      <SelectValue placeholder="Eje del PED" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los ejes</SelectItem>
                      <SelectItem value="ped1">PED 1 - Educación de Calidad</SelectItem>
                      <SelectItem value="ped2">PED 2 - Desarrollo Social</SelectItem>
                      <SelectItem value="ped3">PED 3 - Infraestructura</SelectItem>
                      <SelectItem value="adm1">ADM 1 - Gestión Pública</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Botón de reiniciar */}
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedDependency('todas');
                    setSelectedEje('todos');
                    setSelectedPrograma('todos');
                  }}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restablecer
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Resumen global */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl mb-4" style={{ color: '#582672', fontWeight: 'bold' }}>
            Resumen Global
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            {/* Total Indicadores */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1976D215' }}>
                    <Target className="w-6 h-6" style={{ color: '#1976D2' }} />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Total de Indicadores</p>
                <p className="text-3xl text-gray-900" style={{ fontWeight: 'bold' }}>
                  {formatNumber(total_indicadores_general)}
                </p>
              </CardContent>
            </Card>

            {/* Cumplidos */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#2E7D3215' }}>
                    <CheckCircle2 className="w-6 h-6" style={{ color: '#2E7D32' }} />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Indicadores Cumplidos</p>
                <p className="text-3xl text-gray-900" style={{ fontWeight: 'bold' }}>
                  {formatNumber(total_cumplidos_general)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {((total_cumplidos_general / total_indicadores_general) * 100).toFixed(1)}% del total
                </p>
              </CardContent>
            </Card>

            {/* En Riesgo / No Cumplidos */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F9A82515' }}>
                    <AlertTriangle className="w-6 h-6" style={{ color: '#F9A825' }} />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">En Riesgo / No Cumplidos</p>
                <p className="text-3xl text-gray-900" style={{ fontWeight: 'bold' }}>
                  {formatNumber(total_en_riesgo_general + total_no_cumplidos_general)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {(((total_en_riesgo_general + total_no_cumplidos_general) / total_indicadores_general) * 100).toFixed(1)}% del total
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600">
                Datos provenientes de la MIR trimestral validada por CGPI (Coordinación General de Planeación e Inversión)
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Gráfica general */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl" style={{ color: '#582672', fontWeight: 'bold' }}>
                Gráfica General de Cumplimiento
              </CardTitle>
              <p className="text-sm text-gray-600">
                Porcentaje de cumplimiento por dependencia (ICD - Indicador de Cumplimiento de Desempeño)
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={600}>
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" domain={[0, 120]} stroke="#6b7280" />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={300}
                    stroke="#6b7280"
                    tick={{ fontSize: 12 }}
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Bar dataKey="ICD" radius={[0, 4, 4, 0]} barSize={24}>
                    {chartData.map((entry, index) => (
                      <motion.rect
                        key={`bar-${index}`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.6, delay: index * 0.05 }}
                      />
                    ))}
                    {chartData.map((entry, index) => {
                      const color = getStatusColor(entry.ICD);
                      return <rect key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: '#2E7D32' }} />
                    <span className="text-sm text-gray-700">Cumplido ≥ 67%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: '#F9A825' }} />
                    <span className="text-sm text-gray-700">En progreso 34-66%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: '#D32F2F' }} />
                    <span className="text-sm text-gray-700">Bajo cumplimiento ≤ 33%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabla resumen por dependencia */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl" style={{ color: '#582672', fontWeight: 'bold' }}>
                Tabla Resumen por Dependencia
              </CardTitle>
              <p className="text-sm text-gray-600">
                Detalle del cumplimiento de indicadores por entidad
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[350px]">Dependencia / Entidad</TableHead>
                      <TableHead className="text-center">Total de Indicadores</TableHead>
                      <TableHead className="text-center">Cumplimiento (ICD)</TableHead>
                      <TableHead className="text-center">Semáforo</TableHead>
                      <TableHead className="text-center">Tendencia</TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((dep) => {
                      const statusColor = getStatusColor(dep.icd);
                      return (
                        <TableRow 
                          key={dep.id} 
                          className="hover:bg-gray-50 transition-colors"
                          style={{
                            backgroundColor: dep.icd < 34 ? '#FEE2E2' : dep.icd < 67 ? '#FEF3C7' : '#D1FAE5'
                          }}
                        >
                          <TableCell className="font-medium">{dep.name}</TableCell>
                          <TableCell className="text-center">{dep.total_indicadores}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex flex-col items-center gap-1">
                              <Badge
                                className="border-0"
                                style={{
                                  backgroundColor: `${statusColor}15`,
                                  color: statusColor,
                                  fontWeight: 'bold',
                                }}
                              >
                                {dep.icd.toFixed(1)}%
                              </Badge>
                              <Progress 
                                value={dep.icd > 100 ? 100 : dep.icd} 
                                className="h-1.5 w-20"
                                indicatorColor={statusColor}
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center">
                              <div 
                                className="w-6 h-6 rounded-full"
                                style={{ 
                                  backgroundColor: statusColor,
                                  boxShadow: `0 0 8px ${statusColor}70`,
                                }}
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-center text-xl">
                            {getTrendIcon(dep.trend)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => onDependencyClick({ id: dep.id, name: dep.name })}
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              Ver detalle
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Observaciones CGPI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                <TrendingUp className="w-6 h-6" />
                Observaciones CGPI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 leading-relaxed mb-3">
                  Se observa avance significativo en programas de salud y educación, con un cumplimiento promedio superior al 75%. 
                  Las dependencias de infraestructura presentan rezago en algunos indicadores MIR, requiriendo ajuste de metas trimestrales 
                  y fortalecimiento de mecanismos de seguimiento.
                </p>
                <p className="text-sm text-gray-700 leading-relaxed mb-3">
                  La mayoría de las dependencias mantienen un cumplimiento medio-alto. Se recomienda reforzar la carga de evidencias 
                  documentales en aquellas entidades con avances inferiores al 50% para garantizar la transparencia y rendición de cuentas.
                </p>
                <p className="text-xs text-gray-600 mt-3 pt-3 border-t border-blue-300">
                  Validación y comentarios conforme a los Artículos 15-22 de los Lineamientos SIDERTLAX. 
                  Actualización: 28 de octubre de 2025
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
          </>
        )}
      </div>

      {/* Pie de página */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                <span style={{ fontWeight: 'bold' }}>Fecha de actualización:</span> 28 de octubre de 2025
              </p>
              <p className="text-xs text-gray-500">
                Coordinación General de Planeación e Inversión (CGPI) — Gobierno del Estado de Tlaxcala
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Descargar reporte PDF
              </Button>
              <Button variant="outline" size="sm">
                <Clock className="w-4 h-4 mr-2" />
                Ver histórico trimestral
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
