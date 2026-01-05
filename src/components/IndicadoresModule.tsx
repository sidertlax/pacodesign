import { useState, useEffect } from 'react';
import { ArrowLeft, BarChart3, CheckCircle2, AlertTriangle, Download, FileText, TrendingUp, Clock, Upload, CheckCircle, XCircle, Eye, Target, Award } from 'lucide-react';
import { indicadoresAPI } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Progress } from './ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

interface IndicadoresModuleProps {
  onClose: () => void;
  dependencyId: string;
  dependencyName: string;
}

export function IndicadoresModule({ onClose, dependencyId, dependencyName }: IndicadoresModuleProps) {
  // State for API data
  const [indicadores, setIndicadores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndicador, setSelectedIndicador] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Función para formatear números
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('es-MX').format(value);
  };

  // Fetch indicadores from API
  useEffect(() => {
    const fetchIndicadores = async () => {
      try {
        setLoading(true);
        setError(null);

        const currentYear = new Date().getFullYear();
        const response = await indicadoresAPI.getByDependency(dependencyId, currentYear, 4);

        // Map API data to component format and calculate cumplimiento
        const mappedData = response.indicadores.map((ind: any) => ({
          ...ind,
          estadoValidacion: ind.estado_validacion === 'validado' ? 'Validado' :
                           ind.estado_validacion === 'rechazado' ? 'Rechazado' :
                           ind.estado_validacion === 'enviado' ? 'En revisión' :
                           'Sin evidencia',
          cumplimiento: (ind.avance / ind.meta) * 100,
        }));

        setIndicadores(mappedData);
      } catch (err: any) {
        console.error('Error fetching indicadores:', err);
        setError(err.message || 'Error al cargar indicadores');
        // Fallback to empty array on error
        setIndicadores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIndicadores();
  }, [dependencyId]);

  // Calcular totales
  const total_indicadores = indicadores.length;
  const indicadores_cumplidos = indicadores.filter(ind => ind.cumplimiento >= 100).length;
  const indicadores_en_riesgo = indicadores.filter(ind => ind.cumplimiento >= 70 && ind.cumplimiento < 100).length;
  const indicadores_no_cumplidos = indicadores.filter(ind => ind.cumplimiento < 70).length;
  const indicadores_reportados = indicadores.filter(ind => ind.estadoValidacion !== 'Sin evidencia').length;
  const icd_dependencia = indicadores.reduce((sum, ind) => sum + ind.cumplimiento, 0) / indicadores.length;

  // Función para obtener color de semáforo
  const getStatusColor = (percentage: number) => {
    if (percentage >= 100) return '#2E7D32'; // Verde
    if (percentage >= 67) return '#F9A825'; // Amarillo
    return '#D32F2F'; // Rojo
  };

  // Datos para la gráfica
  const chartData = indicadores.map(ind => ({
    name: ind.nombre.length > 30 ? ind.nombre.substring(0, 30) + '...' : ind.nombre,
    fullName: ind.nombre,
    Meta: 100,
    Avance: ind.cumplimiento > 100 ? 100 : ind.cumplimiento,
    Cumplimiento: ind.cumplimiento,
    metaValor: ind.meta,
    avanceValor: ind.avance,
    unidad: ind.unidad,
  }));

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const color = getStatusColor(data.Cumplimiento);
      
      return (
        <div className="bg-white p-4 border-2 rounded-lg shadow-xl" style={{ borderColor: color }}>
          <p className="font-semibold text-sm mb-2 text-gray-900">{data.fullName}</p>
          <div className="space-y-1">
            <p className="text-xs">
              <span style={{ fontWeight: 'bold' }}>Meta:</span> {formatNumber(data.metaValor)} {data.unidad}
            </p>
            <p className="text-xs">
              <span style={{ fontWeight: 'bold' }}>Avance:</span> {formatNumber(data.avanceValor)} {data.unidad}
            </p>
            <p className="text-xs">
              <span style={{ fontWeight: 'bold', color }}>Cumplimiento:</span>{' '}
              <span style={{ color }}>{data.Cumplimiento.toFixed(1)}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando indicadores...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error al cargar indicadores</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={onClose} variant="outline">
              Regresar
            </Button>
            <Button onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </div>
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
                onClick={onClose}
                className="hover:bg-gray-100 gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm">Regresar a vista general</span>
              </Button>
              <div>
                <h1 className="text-3xl" style={{ color: '#582672', fontWeight: 'bold' }}>
                  Cumplimiento de Indicadores — {dependencyName}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Evaluación del avance frente a metas programadas en la Matriz de Indicadores para Resultados (MIR)
                </p>
              </div>
            </div>
            
            {/* Indicador circular de cumplimiento */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Porcentaje promedio de cumplimiento de metas institucionales</p>
                <Badge
                  className="text-lg px-4 py-2 border-0"
                  style={{
                    backgroundColor: `${getStatusColor(icd_dependencia)}15`,
                    color: getStatusColor(icd_dependencia),
                    fontWeight: 'bold',
                  }}
                >
                  <motion.div
                    className="w-2.5 h-2.5 rounded-full mr-2"
                    style={{
                      backgroundColor: getStatusColor(icd_dependencia),
                      boxShadow: `0 0 10px ${getStatusColor(icd_dependencia)}90`,
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
                  ICD: {icd_dependencia.toFixed(1)}%
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Resumen general */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl mb-4" style={{ color: '#582672', fontWeight: 'bold' }}>
            Resumen General
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
                  {total_indicadores}
                </p>
              </CardContent>
            </Card>

            {/* Con Evidencia Reportada */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#06b6d415' }}>
                    <FileText className="w-6 h-6" style={{ color: '#06b6d4' }} />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Con Evidencia Reportada</p>
                <p className="text-3xl text-gray-900" style={{ fontWeight: 'bold' }}>
                  {indicadores_reportados}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {((indicadores_reportados / total_indicadores) * 100).toFixed(1)}% del total
                </p>
              </CardContent>
            </Card>

            {/* Cumplidos */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#2E7D3215' }}>
                    <Award className="w-6 h-6" style={{ color: '#2E7D32' }} />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Indicadores Cumplidos</p>
                <p className="text-3xl text-gray-900" style={{ fontWeight: 'bold' }}>
                  {indicadores_cumplidos}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {((indicadores_cumplidos / total_indicadores) * 100).toFixed(1)}% del total
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600">
                Fuente: MIR 2025 validada por CGPI (Coordinación General de Planeación e Inversión)
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Gráfica de avance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl" style={{ color: '#582672', fontWeight: 'bold' }}>
                Gráfica de Avance por Indicador
              </CardTitle>
              <p className="text-sm text-gray-600">
                Comparación entre meta programada y avance real de cumplimiento
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={500}>
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" domain={[0, 100]} stroke="#6b7280" />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={280}
                    stroke="#6b7280"
                    tick={{ fontSize: 12 }}
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="Meta" fill="#1976D2" radius={[0, 4, 4, 0]} barSize={16} name="Meta (100%)" />
                  <Bar dataKey="Avance" fill="#2E7D32" radius={[0, 4, 4, 0]} barSize={16} name="Avance Real" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Fuente: Sistema de Información de Desempeño para Resultados (SIDERTLAX)
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabla de detalle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl" style={{ color: '#582672', fontWeight: 'bold' }}>
                Detalle de Indicadores MIR
              </CardTitle>
              <p className="text-sm text-gray-600">
                Información detallada del cumplimiento de metas y evidencias
              </p>
            </CardHeader>
            <CardContent>
              <TooltipProvider>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Indicador</TableHead>
                        <TableHead>Eje MIR</TableHead>
                        <TableHead className="text-center">Unidad de Medida</TableHead>
                        <TableHead className="text-right">Meta Programada</TableHead>
                        <TableHead className="text-right">Avance Real</TableHead>
                        <TableHead className="text-center">% Cumplimiento</TableHead>
                        <TableHead className="text-center">Medio de Verificación</TableHead>
                        <TableHead className="text-center">Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {indicadores.map((ind) => {
                        const getValidacionColor = (estado: string) => {
                          if (estado === 'Validado') return '#2E7D32';
                          if (estado === 'En revisión') return '#F9A825';
                          if (estado === 'Rechazado') return '#D32F2F';
                          return '#6b7280';
                        };
                        
                        const getValidacionIcon = (estado: string) => {
                          if (estado === 'Validado') return <CheckCircle className="w-4 h-4" />;
                          if (estado === 'En revisión') return <Clock className="w-4 h-4" />;
                          if (estado === 'Rechazado') return <XCircle className="w-4 h-4" />;
                          return <AlertTriangle className="w-4 h-4" />;
                        };
                        
                        return (
                          <TableRow 
                            key={ind.id} 
                            className={`hover:bg-gray-50 ${ind.cumplimiento < 70 ? 'bg-red-50' : ind.cumplimiento < 100 ? 'bg-yellow-50' : 'bg-green-50'}`}
                          >
                            <TableCell className="font-medium">{ind.nombre}</TableCell>
                            <TableCell className="text-sm text-gray-600">{ind.eje}</TableCell>
                            <TableCell className="text-center text-sm">{ind.unidad}</TableCell>
                            <TableCell className="text-right">{formatNumber(ind.meta)}</TableCell>
                            <TableCell className="text-right">{formatNumber(ind.avance)}</TableCell>
                            <TableCell className="text-center">
                              <div className="flex flex-col items-center gap-1">
                                <Badge
                                  className="border-0"
                                  style={{
                                    backgroundColor: `${getStatusColor(ind.cumplimiento)}15`,
                                    color: getStatusColor(ind.cumplimiento),
                                    fontWeight: 'bold',
                                  }}
                                >
                                  {ind.cumplimiento.toFixed(1)}%
                                </Badge>
                                <Progress 
                                  value={ind.cumplimiento > 100 ? 100 : ind.cumplimiento} 
                                  className="h-1.5 w-16"
                                  indicatorColor={getStatusColor(ind.cumplimiento)}
                                />
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedIndicador(ind);
                                  setShowDetailModal(true);
                                }}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                {ind.evidencia ? 'Ver Detalle' : 'Ver Info'}
                              </Button>
                            </TableCell>
                            <TableCell className="text-center">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge
                                    className="border-0 gap-1 cursor-help"
                                    style={{
                                      backgroundColor: `${getValidacionColor(ind.estadoValidacion)}15`,
                                      color: getValidacionColor(ind.estadoValidacion),
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    {getValidacionIcon(ind.estadoValidacion)}
                                    {ind.estadoValidacion}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-sm">
                                  <p className="text-xs">{ind.observaciones}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </TooltipProvider>
            </CardContent>
          </Card>
        </motion.div>

        {/* Evidencias y Validación */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                    <FileText className="w-6 h-6" />
                    Evidencias y Validación
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Estado de documentación y validación de medios de verificación
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Subir evidencia
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-100">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Validados</p>
                        <p className="text-2xl text-gray-900" style={{ fontWeight: 'bold' }}>
                          {indicadores.filter(ind => ind.estadoValidacion === 'Validado').length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-yellow-100">
                        <Clock className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">En revisión</p>
                        <p className="text-2xl text-gray-900" style={{ fontWeight: 'bold' }}>
                          {indicadores.filter(ind => ind.estadoValidacion === 'En revisión').length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-100">
                        <XCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Rechazados</p>
                        <p className="text-2xl text-gray-900" style={{ fontWeight: 'bold' }}>
                          {indicadores.filter(ind => ind.estadoValidacion === 'Rechazado').length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span style={{ fontWeight: 'bold', color: '#582672' }}>Lineamientos SIDERTLAX - Art. 21:</span>{' '}
                  Las evidencias deben contar con sello, firma y denominación oficial de la dependencia. 
                  Los medios de verificación serán validados por la CGPI conforme a los criterios de autenticidad, 
                  suficiencia y pertinencia establecidos en la normativa aplicable.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  <span style={{ fontWeight: 'bold' }}>Fecha de validación CGPI:</span> 25 de octubre de 2025
                </p>
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
              <div className="space-y-3">
                {indicadores
                  .filter(ind => ind.observaciones)
                  .slice(0, 5)
                  .map((ind, index) => (
                    <div 
                      key={`obs-${index}`} 
                      className={`border-l-4 rounded-r-lg p-3 ${
                        ind.cumplimiento >= 100 ? 'bg-green-50 border-green-500' :
                        ind.cumplimiento >= 70 ? 'bg-yellow-50 border-yellow-500' :
                        'bg-red-50 border-red-500'
                      }`}
                    >
                      <p className="text-sm text-gray-900" style={{ fontWeight: 'bold' }}>
                        {ind.nombre}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        {ind.observaciones}
                      </p>
                    </div>
                  ))}
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-gray-700 leading-relaxed mb-2">
                  <span style={{ fontWeight: 'bold' }}>Resumen general:</span>{' '}
                  El indicador de cobertura educativa presenta avance del 92%, requiere ajuste de metas trimestrales 
                  para zonas de difícil acceso. La eficiencia presupuestal se encuentra por debajo de la meta establecida, 
                  se solicita complementar evidencia documental conforme a lineamientos.
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Comentarios y validaciones conforme al Art. 21 de los Lineamientos SIDERTLAX.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Pie de página */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Fecha de actualización:</strong> 28 de octubre de 2025
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
              <Button 
                size="sm"
                style={{ 
                  backgroundColor: '#582672', 
                  color: 'white',
                  border: 'none'
                }}
                className="hover:opacity-90"
              >
                <Upload className="w-4 h-4 mr-2" />
                Subir evidencia
              </Button>
            </div>
          </div>
        </div>
      </footer>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl" style={{ color: '#582672' }}>
              Detalle del Indicador
            </DialogTitle>
            <DialogDescription>
              Información completa del indicador y su evidencia
            </DialogDescription>
          </DialogHeader>

          {selectedIndicador && (
            <div className="space-y-6 py-4">
              {/* Indicador Info */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-semibold text-gray-500">Nombre del Indicador</label>
                  <p className="text-base font-medium text-gray-900 mt-1">{selectedIndicador.nombre}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-500">Unidad de Medida</label>
                    <p className="text-base text-gray-900 mt-1">{selectedIndicador.unidad}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-500">Tipo</label>
                    <p className="text-base text-gray-900 mt-1">{selectedIndicador.tipo}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-500">Eje Estratégico</label>
                  <p className="text-base text-gray-900 mt-1">{selectedIndicador.eje}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <label className="text-sm font-semibold text-gray-500">Meta</label>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {formatNumber(selectedIndicador.meta)}
                    </p>
                    <p className="text-xs text-gray-500">{selectedIndicador.unidad}</p>
                  </div>
                  <div className="text-center">
                    <label className="text-sm font-semibold text-gray-500">Avance</label>
                    <p className="text-2xl font-bold text-blue-600 mt-1">
                      {formatNumber(selectedIndicador.avance)}
                    </p>
                    <p className="text-xs text-gray-500">{selectedIndicador.unidad}</p>
                  </div>
                  <div className="text-center">
                    <label className="text-sm font-semibold text-gray-500">Cumplimiento</label>
                    <p
                      className="text-2xl font-bold mt-1"
                      style={{ color: getStatusColor(selectedIndicador.cumplimiento) }}
                    >
                      {selectedIndicador.cumplimiento.toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-gray-500">Progreso Visual</label>
                    <span className="text-sm text-gray-600">
                      {selectedIndicador.cumplimiento.toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={selectedIndicador.cumplimiento > 100 ? 100 : selectedIndicador.cumplimiento}
                    className="h-3"
                    indicatorColor={getStatusColor(selectedIndicador.cumplimiento)}
                  />
                </div>
              </div>

              {/* Evidencia */}
              <div className="border-t pt-4">
                <label className="text-sm font-semibold text-gray-500">Evidencia Documental</label>
                {selectedIndicador.evidencia ? (
                  <div className="mt-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{selectedIndicador.evidencia}</p>
                        <p className="text-sm text-gray-600 mt-1">Documento de respaldo cargado</p>
                      </div>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Download className="w-4 h-4 mr-2" />
                        Descargar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 p-4 bg-gray-100 rounded-lg border border-gray-300">
                    <div className="flex items-center gap-3">
                      <XCircle className="w-8 h-8 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-700">Sin evidencia cargada</p>
                        <p className="text-sm text-gray-600">No se ha subido documentación de respaldo</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Validation Status */}
              <div className="border-t pt-4">
                <label className="text-sm font-semibold text-gray-500">Estado de Validación</label>
                <div className="mt-2 flex items-center gap-2">
                  <Badge
                    className="text-base px-4 py-2"
                    style={{
                      backgroundColor: `${getValidacionColor(selectedIndicador.estadoValidacion)}15`,
                      color: getValidacionColor(selectedIndicador.estadoValidacion),
                      border: `2px solid ${getValidacionColor(selectedIndicador.estadoValidacion)}`,
                    }}
                  >
                    {selectedIndicador.estadoValidacion === 'Validado' && <CheckCircle className="w-4 h-4 mr-2" />}
                    {selectedIndicador.estadoValidacion === 'Rechazado' && <XCircle className="w-4 h-4 mr-2" />}
                    {selectedIndicador.estadoValidacion === 'En revisión' && <Clock className="w-4 h-4 mr-2" />}
                    {selectedIndicador.estadoValidacion}
                  </Badge>
                </div>
              </div>

              {/* Observaciones */}
              {selectedIndicador.observaciones && (
                <div className="border-t pt-4">
                  <label className="text-sm font-semibold text-gray-500">Observaciones</label>
                  <div className="mt-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-gray-900">{selectedIndicador.observaciones}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
