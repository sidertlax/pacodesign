import { useState, useEffect } from 'react';
import { ArrowLeft, DollarSign, FileText, CheckCircle2, Download, FileSpreadsheet, Search, RotateCcw, AlertCircle, ArrowUpDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface GastoModuleProps {
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

export function GastoModule({ onClose, onDependencyClick, dependencies }: GastoModuleProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'dependencia' | 'programa' | 'unidad' | 'capitulo'>('dependencia');
  const [selectedDependency, setSelectedDependency] = useState<string>('todas');
  const [isStackedView, setIsStackedView] = useState(false); // Para alternar entre stacked y nominal
  const [sortBy, setSortBy] = useState<'relevancia' | 'menor-mayor' | 'mayor-menor' | 'semaforo'>('relevancia');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Reset page to 1 when sorting or filtering changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, searchTerm, selectedDependency]);

  // Función para formatear moneda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Generar datos presupuestales para cada dependencia
  const generateBudgetData = (depId: string, depName: string, gastoPercent: number) => {
    const baseAmount = 50000000 + Math.random() * 100000000; // 50M - 150M
    const aprobado = baseAmount;
    const modificado = aprobado * (0.95 + Math.random() * 0.15);
    // Incrementar el avance para mayor progreso visual (75% - 95%)
    const avanceAjustado = 75 + Math.random() * 20;
    const pagado = modificado * (avanceAjustado / 100);
    
    return {
      id: depId,
      name: depName,
      aprobado,
      modificado,
      pagado,
      avance: (pagado / modificado) * 100,
    };
  };

  // Datos presupuestales de todas las dependencias
  const budgetData = dependencies.map(dep => 
    generateBudgetData(dep.id, dep.name, dep.modules.gasto)
  );

  // Filtrar datos según búsqueda y selección
  const filteredDataBase = budgetData.filter(dep => {
    const matchesSearch = dep.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDependency = selectedDependency === 'todas' || dep.id === selectedDependency;
    return matchesSearch && matchesDependency;
  });

  // Ordenar datos según el criterio seleccionado
  const filteredData = [...filteredDataBase].sort((a, b) => {
    switch (sortBy) {
      case 'menor-mayor':
        return a.pagado - b.pagado;
      case 'mayor-menor':
        return b.pagado - a.pagado;
      case 'semaforo':
        // Ordenar por avance: crítico -> atención -> en tiempo
        return a.avance - b.avance;
      case 'relevancia':
      default:
        return 0; // Mantener orden original
    }
  });

  // Calcular totales generales
  const presupuesto_aprobado_general = budgetData.reduce((sum, dep) => sum + dep.aprobado, 0);
  const presupuesto_modificado_general = budgetData.reduce((sum, dep) => sum + dep.modificado, 0);
  const presupuesto_pagado_general = budgetData.reduce((sum, dep) => sum + dep.pagado, 0);
  const avance_general = (presupuesto_pagado_general / presupuesto_modificado_general) * 100;

  // Datos para la gráfica según el modo de visualización
  const getChartData = () => {
    switch (viewMode) {
      case 'programa':
        return [
          {
            name: 'Educación',
            Aprobado: 85.2,
            Modificado: 88.1,
            Pagado: 82.4,
            aprobado: 1850000000,
            modificado: 1920000000,
            pagado: 1780000000,
            avance: 92.7,
          },
          {
            name: 'Salud',
            Aprobado: 82.5,
            Modificado: 84.3,
            Pagado: 78.8,
            aprobado: 1650000000,
            modificado: 1690000000,
            pagado: 1480000000,
            avance: 87.6,
          },
          {
            name: 'Infraestructura',
            Aprobado: 78.9,
            Modificado: 81.2,
            Pagado: 74.5,
            aprobado: 980000000,
            modificado: 1010000000,
            pagado: 850000000,
            avance: 84.2,
          },
          {
            name: 'Seguridad',
            Aprobado: 88.3,
            Modificado: 90.1,
            Pagado: 85.2,
            aprobado: 650000000,
            modificado: 680000000,
            pagado: 620000000,
            avance: 91.2,
          },
          {
            name: 'Desarrollo Social',
            Aprobado: 75.6,
            Modificado: 77.8,
            Pagado: 71.3,
            aprobado: 720000000,
            modificado: 750000000,
            pagado: 630000000,
            avance: 84.0,
          },
        ];
      case 'unidad':
        return [
          {
            name: 'Planeación',
            Aprobado: 82.1,
            Modificado: 84.5,
            Pagado: 78.2,
            aprobado: 450000000,
            modificado: 470000000,
            pagado: 420000000,
            avance: 89.4,
          },
          {
            name: 'Administración',
            Aprobado: 86.3,
            Modificado: 88.7,
            Pagado: 83.5,
            aprobado: 680000000,
            modificado: 710000000,
            pagado: 650000000,
            avance: 91.5,
          },
          {
            name: 'Operación',
            Aprobado: 79.8,
            Modificado: 82.1,
            Pagado: 76.4,
            aprobado: 920000000,
            modificado: 950000000,
            pagado: 840000000,
            avance: 88.4,
          },
          {
            name: 'Evaluación',
            Aprobado: 84.5,
            Modificado: 86.2,
            Pagado: 80.8,
            aprobado: 320000000,
            modificado: 340000000,
            pagado: 310000000,
            avance: 91.2,
          },
        ];
      case 'capitulo':
        return [
          {
            name: 'Cap. 1000 - Servicios Personales',
            Aprobado: 88.5,
            Modificado: 90.2,
            Pagado: 86.1,
            aprobado: 2100000000,
            modificado: 2150000000,
            pagado: 1980000000,
            avance: 92.1,
          },
          {
            name: 'Cap. 2000 - Materiales y Suministros',
            Aprobado: 76.3,
            Modificado: 78.5,
            Pagado: 72.9,
            aprobado: 580000000,
            modificado: 600000000,
            pagado: 520000000,
            avance: 86.7,
          },
          {
            name: 'Cap. 3000 - Servicios Generales',
            Aprobado: 81.2,
            Modificado: 83.4,
            Pagado: 78.6,
            aprobado: 720000000,
            modificado: 750000000,
            pagado: 650000000,
            avance: 86.7,
          },
          {
            name: 'Cap. 4000 - Subsidios y Transferencias',
            Aprobado: 72.8,
            Modificado: 74.9,
            Pagado: 68.3,
            aprobado: 890000000,
            modificado: 920000000,
            pagado: 760000000,
            avance: 82.6,
          },
          {
            name: 'Cap. 6000 - Inversión Pública',
            Aprobado: 69.5,
            Modificado: 71.2,
            Pagado: 65.7,
            aprobado: 560000000,
            modificado: 580000000,
            pagado: 450000000,
            avance: 77.6,
          },
        ];
      default: // dependencia
        return filteredData.slice(0, 10).map(dep => ({
          name: dep.name.length > 35 ? dep.name.substring(0, 35) + '...' : dep.name,
          fullName: dep.name,
          Aprobado: (dep.aprobado / presupuesto_aprobado_general) * 100,
          Modificado: (dep.modificado / presupuesto_modificado_general) * 100,
          Pagado: (dep.pagado / presupuesto_pagado_general) * 100,
          aprobado: dep.aprobado,
          modificado: dep.modificado,
          pagado: dep.pagado,
          avance: dep.avance,
        }));
    }
  };

  const chartData = getChartData();

  // Datos para la vista stacked (distribución porcentual de conceptos)
  const getStackedData = () => {
    return filteredData.slice(0, 10).map(dep => {
      const total = dep.aprobado + dep.modificado + dep.pagado;
      const aprobadoPct = (dep.aprobado / total) * 100;
      const modificadoPct = (dep.modificado / total) * 100;
      const pagadoPct = (dep.pagado / total) * 100;
      
      // Calcular el avance para determinar el estado del semáforo
      const avance = dep.avance;
      
      return {
        name: dep.name.length > 35 ? dep.name.substring(0, 35) + '...' : dep.name,
        fullName: dep.name,
        Aprobado: aprobadoPct,
        Modificado: modificadoPct,
        Pagado: pagadoPct,
        aprobado: dep.aprobado,
        modificado: dep.modificado,
        pagado: dep.pagado,
        avance: avance,
      };
    });
  };

  const stackedData = getStackedData();

  // Función para obtener color de semáforo
  const getStatusColor = (percentage: number) => {
    if (percentage >= 85) return '#2E7D32'; // Verde
    if (percentage >= 70) return '#F9A825'; // Amarillo
    return '#D32F2F'; // Rojo
  };

  // Función para obtener el texto del semáforo
  const getStatusText = (percentage: number) => {
    if (percentage >= 85) return 'En tiempo y forma';
    if (percentage >= 70) return 'Requiere atención';
    return 'Crítico';
  };

  // Tooltip personalizado para vista normal
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-sm mb-2 text-gray-900">{data.fullName || data.name}</p>
          <div className="space-y-1">
            <p className="text-xs">
              <span style={{ color: '#1976D2' }}>■ Aprobado:</span>{' '}
              {data.Aprobado.toFixed(1)}%
              {data.aprobado && (
                <span className="text-gray-600"> ({formatCurrency(data.aprobado)})</span>
              )}
            </p>
            <p className="text-xs">
              <span style={{ color: '#F9A825' }}>■ Modificado:</span>{' '}
              {data.Modificado.toFixed(1)}%
              {data.modificado && (
                <span className="text-gray-600"> ({formatCurrency(data.modificado)})</span>
              )}
            </p>
            <p className="text-xs">
              <span style={{ color: '#2E7D32' }}>■ Pagado:</span>{' '}
              {data.Pagado.toFixed(1)}%
              {data.pagado && (
                <span className="text-gray-600"> ({formatCurrency(data.pagado)})</span>
              )}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Tooltip personalizado para vista stacked con semáforo
  const CustomStackedTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const segment = payload[0];
      const data = segment.payload;
      const dataKey = segment.dataKey;
      
      // Determinar el concepto que se está mostrando
      let concepto = '';
      let conceptoColor = '';
      let valor = 0;
      let valorMonto = 0;
      
      if (dataKey === 'Aprobado') {
        concepto = 'Aprobado';
        conceptoColor = '#1976D2';
        valor = data.Aprobado;
        valorMonto = data.aprobado;
      } else if (dataKey === 'Modificado') {
        concepto = 'Modificado';
        conceptoColor = '#F9A825';
        valor = data.Modificado;
        valorMonto = data.modificado;
      } else if (dataKey === 'Pagado') {
        concepto = 'Pagado';
        conceptoColor = '#2E7D32';
        valor = data.Pagado;
        valorMonto = data.pagado;
      }

      // Color del semáforo según el avance
      const semaforoColor = getStatusColor(data.avance);
      const semaforoTexto = getStatusText(data.avance);
      
      return (
        <div className="bg-white p-4 border-2 rounded-lg shadow-xl" style={{ borderColor: semaforoColor }}>
          <p className="font-semibold text-sm mb-3 text-gray-900">{data.fullName || data.name}</p>
          
          {/* Indicador de semáforo destacado */}
          <div 
            className="flex items-center gap-2 mb-3 p-2 rounded-md"
            style={{ backgroundColor: `${semaforoColor}15` }}
          >
            <div 
              className="w-4 h-4 rounded-full"
              style={{ 
                backgroundColor: semaforoColor,
                boxShadow: `0 0 12px ${semaforoColor}90, 0 0 20px ${semaforoColor}50`,
              }}
            />
            <div className="flex-1">
              <p className="text-xs" style={{ color: semaforoColor, fontWeight: 'bold' }}>
                {semaforoTexto}
              </p>
              <p className="text-xs text-gray-600">Avance: {data.avance.toFixed(1)}%</p>
            </div>
          </div>
          
          {/* Detalles del concepto seleccionado */}
          <div 
            className="mb-3 p-2 rounded-md border-l-4"
            style={{ 
              backgroundColor: `${conceptoColor}10`,
              borderLeftColor: conceptoColor
            }}
          >
            <p className="text-xs mb-1" style={{ color: conceptoColor, fontWeight: 'bold' }}>
              {concepto}
            </p>
            <p className="text-xs text-gray-700">
              <span style={{ fontWeight: 'bold' }}>Distribución:</span> {valor.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-700">
              <span style={{ fontWeight: 'bold' }}>Monto:</span> {formatCurrency(valorMonto)}
            </p>
          </div>
          
          {/* Resumen completo */}
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-1" style={{ fontWeight: 'bold' }}>
              Resumen Total
            </p>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-600">
                <span style={{ color: '#1976D2' }}>●</span> Aprobado: {data.Aprobado.toFixed(1)}% ({formatCurrency(data.aprobado)})
              </p>
              <p className="text-xs text-gray-600">
                <span style={{ color: '#F9A825' }}>●</span> Modificado: {data.Modificado.toFixed(1)}% ({formatCurrency(data.modificado)})
              </p>
              <p className="text-xs text-gray-600">
                <span style={{ color: '#2E7D32' }}>●</span> Pagado: {data.Pagado.toFixed(1)}% ({formatCurrency(data.pagado)})
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Componente personalizado para el eje Y con semáforo
  const CustomYAxisTick = ({ x, y, payload }: any) => {
    // Buscar el dato correspondiente en chartData para obtener el avance
    const itemData = chartData.find(item => item.name === payload.value);
    const avance = itemData?.avance || 0;
    const semaforoColor = getStatusColor(avance);

    return (
      <g transform={`translate(${x},${y})`}>
        {/* Círculo del semáforo */}
        <circle
          cx={-10}
          cy={0}
          r={5}
          fill={semaforoColor}
          stroke="#fff"
          strokeWidth={1.5}
          style={{ 
            filter: `drop-shadow(0 0 4px ${semaforoColor}80)`,
          }}
        />
        {/* Texto del nombre */}
        <text
          x={-20}
          y={0}
          dy={4}
          textAnchor="end"
          fill="#4b5563"
          fontSize={12}
        >
          {payload.value}
        </text>
      </g>
    );
  };

  // Leyenda personalizada para la gráfica
  const CustomLegend = () => {
    return (
      <div className="flex flex-wrap justify-center gap-8 pt-6 px-4 border-t border-gray-200 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: '#1976D2' }} />
          <span className="text-sm text-gray-700">
            <span style={{ fontWeight: 'bold' }}>Aprobado</span>
            <span className="text-gray-500 ml-2">{formatCurrency(presupuesto_aprobado_general)}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: '#F9A825' }} />
          <span className="text-sm text-gray-700">
            <span style={{ fontWeight: 'bold' }}>Modificado</span>
            <span className="text-gray-500 ml-2">{formatCurrency(presupuesto_modificado_general)}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: '#2E7D32' }} />
          <span className="text-sm text-gray-700">
            <span style={{ fontWeight: 'bold' }}>Pagado</span>
            <span className="text-gray-500 ml-2">{formatCurrency(presupuesto_pagado_general)}</span>
          </span>
        </div>
      </div>
    );
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
                  Módulo de Gasto
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Desempeño Presupuestal Estatal
                </p>
              </div>
            </div>
            
            {/* Indicador circular de avance */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Avance General del Gasto Estatal</p>
                <Badge
                  className="text-lg px-4 py-2 border-0"
                  style={{
                    backgroundColor: `${getStatusColor(avance_general)}15`,
                    color: getStatusColor(avance_general),
                    fontWeight: 'bold',
                  }}
                >
                  <motion.div
                    className="w-2.5 h-2.5 rounded-full mr-2"
                    style={{
                      backgroundColor: getStatusColor(avance_general),
                      boxShadow: `0 0 10px ${getStatusColor(avance_general)}90`,
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
                  {avance_general.toFixed(1)}%
                </Badge>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mt-3">
            Avance presupuestal de las dependencias del Poder Ejecutivo del Estado de Tlaxcala
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
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
                      placeholder="Buscar por nombre de dependencia..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Selector de dependencia */}
                <div className="w-full md:w-64">
                  <Select value={selectedDependency} onValueChange={setSelectedDependency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar dependencia" />
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

                {/* Botón de reiniciar */}
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedDependency('todas');
                    setViewMode('dependencia');
                  }}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restablecer vista
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Resumen presupuestal general */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl mb-4" style={{ color: '#582672', fontWeight: 'bold' }}>
            Resumen Presupuestal General
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            {/* Aprobado */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1976D215' }}>
                    <DollarSign className="w-6 h-6" style={{ color: '#1976D2' }} />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Presupuesto Aprobado</p>
                <p className="text-3xl text-gray-900" style={{ fontWeight: 'bold' }}>
                  {formatCurrency(presupuesto_aprobado_general)}
                </p>
              </CardContent>
            </Card>

            {/* Modificado */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F9A82515' }}>
                    <FileText className="w-6 h-6" style={{ color: '#F9A825' }} />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Presupuesto Modificado</p>
                <p className="text-3xl text-gray-900" style={{ fontWeight: 'bold' }}>
                  {formatCurrency(presupuesto_modificado_general)}
                </p>
              </CardContent>
            </Card>

            {/* Pagado */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#2E7D3215' }}>
                    <CheckCircle2 className="w-6 h-6" style={{ color: '#2E7D32' }} />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Presupuesto Pagado</p>
                <p className="text-3xl text-gray-900" style={{ fontWeight: 'bold' }}>
                  {formatCurrency(presupuesto_pagado_general)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Barra de progreso global */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Montos totales consolidados del ejercicio presupuestal estatal</p>
                <span className="text-sm" style={{ fontWeight: 'bold', color: getStatusColor(avance_general) }}>
                  {avance_general.toFixed(1)}%
                </span>
              </div>
              <Progress value={avance_general} className="h-3" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Gráfica general del gasto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                      Gráfica General del Gasto
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Análisis comparativo del ejercicio presupuestal
                    </p>
                  </div>
                  <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                    <TabsList className="grid w-full md:w-[500px] grid-cols-4">
                      <TabsTrigger value="dependencia">Dependencia</TabsTrigger>
                      <TabsTrigger value="programa">Programa</TabsTrigger>
                      <TabsTrigger value="unidad">Unidad</TabsTrigger>
                      <TabsTrigger value="capitulo">Capítulo</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Controles - Ordenar por */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-gray-500" />
                    <Label className="text-sm text-gray-600">Ordenar por:</Label>
                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                      <SelectTrigger className="w-[220px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevancia">Relevancia</SelectItem>
                        <SelectItem value="menor-mayor">Menor a mayor gasto</SelectItem>
                        <SelectItem value="mayor-menor">Mayor a menor gasto</SelectItem>
                        <SelectItem value="semaforo">Estatus del semáforo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Switch para vista stacked - Solo visible en modo dependencia */}
                  {viewMode === 'dependencia' && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-3"
                    >
                      <Label 
                        htmlFor="stacked-mode" 
                        className="text-sm cursor-pointer transition-all"
                        style={{ color: !isStackedView ? '#582672' : '#6b7280', fontWeight: !isStackedView ? 'bold' : 'normal' }}
                      >
                        Vista por valor nominal
                      </Label>
                      <Switch
                        id="stacked-mode"
                        checked={isStackedView}
                        onCheckedChange={setIsStackedView}
                        className="transition-all"
                        style={{
                          backgroundColor: isStackedView ? '#582672' : '#cbd5e1',
                        }}
                      />
                      <Label 
                        htmlFor="stacked-mode" 
                        className="text-sm cursor-pointer transition-all"
                        style={{ color: isStackedView ? '#582672' : '#6b7280', fontWeight: isStackedView ? 'bold' : 'normal' }}
                      >
                        Vista por distribución porcentual (stacked)
                      </Label>
                    </motion.div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === 'dependencia' && isStackedView ? (
                <motion.div
                  key="stacked-view"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Descripción de la vista stacked */}
                  <div className="mb-4 p-3 rounded-lg border border-purple-200" style={{ backgroundColor: '#58267210' }}>
                    <p className="text-xs text-gray-700">
                      <span style={{ color: '#582672', fontWeight: 'bold' }}>Vista de distribución porcentual:</span> Cada barra representa el 100% del presupuesto total de la dependencia. 
                      Los segmentos muestran la proporción de cada concepto. Pase el cursor sobre cada segmento para ver el semáforo de estado.
                    </p>
                  </div>
                  
                  {/* Vista Stacked - Distribución porcentual */}
                  <ResponsiveContainer width="100%" height={450}>
                    <BarChart
                      data={stackedData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" domain={[0, 100]} stroke="#6b7280" />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={270}
                        stroke="#6b7280"
                        tick={<CustomYAxisTick />}
                      />
                      <Tooltip content={<CustomStackedTooltip />} cursor={{ fill: 'rgba(88, 38, 114, 0.1)' }} />
                      <Legend content={<CustomLegend />} />
                      <Bar dataKey="Aprobado" stackId="a" fill="#1976D2" radius={[4, 0, 0, 4]} />
                      <Bar dataKey="Modificado" stackId="a" fill="#F9A825" />
                      <Bar dataKey="Pagado" stackId="a" fill="#2E7D32" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              ) : (
                <motion.div
                  key="normal-view"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Vista Normal - Valor nominal */}
                  <ResponsiveContainer width="100%" height={450}>
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
                        width={270}
                        stroke="#6b7280"
                        tick={<CustomYAxisTick />}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend content={<CustomLegend />} />
                      <Bar dataKey="Aprobado" fill="#1976D2" radius={[0, 4, 4, 0]} barSize={14} />
                      <Bar dataKey="Modificado" fill="#F9A825" radius={[0, 4, 4, 0]} barSize={14} />
                      <Bar dataKey="Pagado" fill="#2E7D32" radius={[0, 4, 4, 0]} barSize={14} />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              )}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Fuente: Sistema de Información Financiera (SIIF) de la Secretaría de Finanzas
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detalle rápido por dependencia */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4">
                <div>
                  <CardTitle className="text-2xl" style={{ color: '#582672', fontWeight: 'bold' }}>
                    Detalle Rápido por Dependencia
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Resumen del desempeño presupuestal de las dependencias estatales
                  </p>
                </div>
                
                {/* Ordenar por */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-gray-500" />
                    <Label className="text-sm text-gray-600">Ordenar por:</Label>
                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                      <SelectTrigger className="w-[220px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevancia">Relevancia</SelectItem>
                        <SelectItem value="menor-mayor">Menor a mayor gasto</SelectItem>
                        <SelectItem value="mayor-menor">Mayor a menor gasto</SelectItem>
                        <SelectItem value="semaforo">Estatus del semáforo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)} - {Math.min(currentPage * itemsPerPage, filteredData.length)} de {filteredData.length} dependencias
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[350px]">Dependencia / Entidad</TableHead>
                      <TableHead className="text-center">Semáforo</TableHead>
                      <TableHead className="text-center">% Avance</TableHead>
                      <TableHead className="text-right">Presupuesto Aprobado</TableHead>
                      <TableHead className="text-right">Presupuesto Modificado</TableHead>
                      <TableHead className="text-right">Presupuesto Pagado</TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((dep) => (
                      <TableRow key={dep.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          {dep.name}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ 
                                backgroundColor: getStatusColor(dep.avance),
                                boxShadow: `0 0 8px ${getStatusColor(dep.avance)}80`,
                              }}
                            />
                            <span className="text-xs" style={{ color: getStatusColor(dep.avance), fontWeight: 'bold' }}>
                              {getStatusText(dep.avance)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center gap-1">
                            <Badge
                              className="border-0"
                              style={{
                                backgroundColor: `${getStatusColor(dep.avance)}15`,
                                color: getStatusColor(dep.avance),
                                fontWeight: 'bold',
                              }}
                            >
                              {dep.avance.toFixed(1)}%
                            </Badge>
                            <Progress 
                              value={dep.avance} 
                              className="h-1.5 w-16"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {formatCurrency(dep.aprobado)}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {formatCurrency(dep.modificado)}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {formatCurrency(dep.pagado)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            onClick={() => onDependencyClick({ id: dep.id, name: dep.name })}
                            style={{ backgroundColor: '#582672' }}
                            className="hover:opacity-90"
                          >
                            Ver detalle
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginación */}
              {filteredData.length > itemsPerPage && (
                <div className="mt-6 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }, (_, i) => i + 1).map((page) => {
                        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
                        // Show first page, last page, current page, and pages around current
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        return null;
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredData.length / itemsPerPage), prev + 1))}
                          className={currentPage === Math.ceil(filteredData.length / itemsPerPage) ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Panel de observaciones CGPI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                <AlertCircle className="w-6 h-6" />
                Observaciones CGPI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  El gasto presenta avance moderado en programas de infraestructura y salud. 
                  Se recomienda revisión de las partidas del capítulo 4000 (Subsidios y Transferencias) 
                  que muestran un avance inferior al 65% del presupuesto modificado. Las dependencias 
                  con avance menor al 60% deberán presentar justificación y plan de regularización 
                  ante la Coordinación General de Planeación e Inversión.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Pie de página */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Fecha de corte:</strong> 30 de septiembre de 2025
              </p>
              <p className="text-xs text-gray-500">
                Coordinación General de Planeación e Inversión (CGPI) — Gobierno del Estado de Tlaxcala
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Descargar reporte global
              </Button>
              <Button variant="outline" size="sm">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Exportar datos
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
