import { useState } from 'react';
import { ArrowLeft, BarChart3, CheckCircle2, AlertTriangle, Download, FileText, TrendingUp, Clock, Upload, CheckCircle, XCircle, Eye, Target, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
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
  // Función para formatear números
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('es-MX').format(value);
  };

  // Generar datos de indicadores
  const generateIndicadores = () => {
    const indicadoresBase = [
      {
        nombre: 'Cobertura de servicios educativos',
        unidad: 'Porcentaje',
        tipo: 'Estratégico',
        eje: 'PED - 1. EDUCACIÓN DE CALIDAD',
        meta: 95,
        avance: 87.5,
        evidencia: 'evidencia_cobertura_educativa.pdf',
        estadoValidacion: 'Validado',
        observaciones: 'Cumple parcialmente. Se requiere reforzar atención en zonas rurales.',
      },
      {
        nombre: 'Índice de satisfacción ciudadana',
        unidad: 'Puntos',
        tipo: 'Gestión',
        eje: 'ADM - 1. MEJORA DE LA GESTIÓN PÚBLICA',
        meta: 8.5,
        avance: 7.8,
        evidencia: 'evidencia_satisfaccion_ciudadana.pdf',
        estadoValidacion: 'Validado',
        observaciones: 'Avance favorable. Encuestas aplicadas según metodología aprobada.',
      },
      {
        nombre: 'Reducción de tiempos de respuesta',
        unidad: 'Días',
        tipo: 'Gestión',
        eje: 'ADM - 2. EFICIENCIA ADMINISTRATIVA',
        meta: 15,
        avance: 18,
        evidencia: 'evidencia_tiempos_respuesta.pdf',
        estadoValidacion: 'En revisión',
        observaciones: 'No cumple meta. Se requiere análisis de procesos y ajuste de indicador.',
      },
      {
        nombre: 'Programas implementados',
        unidad: 'Número',
        tipo: 'Gestión',
        eje: 'PED - 2. DESARROLLO SOCIAL',
        meta: 25,
        avance: 22,
        evidencia: 'evidencia_programas_sociales.pdf',
        estadoValidacion: 'Validado',
        observaciones: 'Buen avance. 3 programas adicionales en proceso de autorización.',
      },
      {
        nombre: 'Beneficiarios atendidos',
        unidad: 'Personas',
        tipo: 'Estratégico',
        eje: 'PED - 3. INCLUSIÓN SOCIAL',
        meta: 50000,
        avance: 45800,
        evidencia: 'evidencia_beneficiarios.pdf',
        estadoValidacion: 'Validado',
        observaciones: 'Avance del 91.6%. Padrón actualizado conforme a normativa.',
      },
      {
        nombre: 'Infraestructura mejorada',
        unidad: 'Unidades',
        tipo: 'Gestión',
        eje: 'PED - 1. INFRAESTRUCTURA EDUCATIVA',
        meta: 120,
        avance: 135,
        evidencia: 'evidencia_infraestructura.pdf',
        estadoValidacion: 'Validado',
        observaciones: 'Meta superada. Obras adicionales con recursos extraordinarios.',
      },
      {
        nombre: 'Capacitaciones realizadas',
        unidad: 'Eventos',
        tipo: 'Gestión',
        eje: 'ADM - 3. DESARROLLO DE CAPACIDADES',
        meta: 48,
        avance: 52,
        evidencia: 'evidencia_capacitaciones.pdf',
        estadoValidacion: 'Validado',
        observaciones: 'Meta cumplida. Listas de asistencia y constancias entregadas.',
      },
      {
        nombre: 'Eficiencia presupuestal',
        unidad: 'Porcentaje',
        tipo: 'Estratégico',
        eje: 'ADM - 1. PRESUPUESTO BASADO EN RESULTADOS',
        meta: 90,
        avance: 73.5,
        evidencia: 'evidencia_eficiencia_presupuestal.pdf',
        estadoValidacion: 'Rechazado',
        observaciones: 'Por debajo de meta. Evidencia requiere complemento documental.',
      },
      {
        nombre: 'Porcentaje de proyectos con PBR evaluado',
        unidad: 'Porcentaje',
        tipo: 'Estratégico',
        eje: 'ADM - 1. PRESUPUESTO BASADO EN RESULTADOS',
        meta: 90,
        avance: 85,
        evidencia: 'evidencia_pbr_evaluado.pdf',
        estadoValidacion: 'Validado',
        observaciones: 'Cumplimiento favorable. Evaluaciones conforme a lineamientos CONAC.',
      },
      {
        nombre: 'Índice de transparencia institucional',
        unidad: 'Puntos',
        tipo: 'Estratégico',
        eje: 'ADM - 1. TRANSPARENCIA Y RENDICIÓN DE CUENTAS',
        meta: 95,
        avance: 92,
        evidencia: 'evidencia_transparencia.pdf',
        estadoValidacion: 'Validado',
        observaciones: 'Cumplimiento alto. Portal de transparencia actualizado trimestralmente.',
      },
    ];

    return indicadoresBase.map((ind, index) => ({
      id: `ind-${index}`,
      ...ind,
      cumplimiento: (ind.avance / ind.meta) * 100,
    }));
  };

  const indicadores = generateIndicadores();

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
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-1" />
                                {ind.evidencia ? 'Ver PDF' : 'Sin evidencia'}
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
    </div>
  );
}
