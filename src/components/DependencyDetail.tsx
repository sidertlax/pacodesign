import { ArrowLeft, DollarSign, FileText, CheckCircle2, Download, History, X, User, Phone, Mail, MapPin, UserCheck, BarChart3, AlertTriangle, Clock, PlayCircle, Pause, Scale, Calendar, XCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Progress } from './ui/progress';
import { MultiSegmentProgress } from './MultiSegmentProgress';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList, PieChart, Pie } from 'recharts';
import { useState } from 'react';

interface Indicator {
  eje: string;
  aprobado: number;
  modificado: number;
  pagado: number;
}

interface ResponsibleContact {
  name: string;
  position: string;
  phone: string;
  email: string;
  directBoss: string;
  office: string;
  floor: string;
  building: string;
  address: string;
}

interface DependencyDetailProps {
  dependencia_nombre: string;
  avance_porcentual: number;
  presupuesto_aprobado: number;
  presupuesto_modificado: number;
  presupuesto_pagado: number;
  indicadores: Indicator[];
  fecha_actualizacion: string;
  dependencyId: string;
  modules: {
    gasto: number;
    indicadores: number;
    compromisos: number;
    normatividad: number;
  };
  onClose: () => void;
  onModuleClick?: (module: string) => void;
}

export function DependencyDetail({
  dependencia_nombre,
  avance_porcentual,
  presupuesto_aprobado,
  presupuesto_modificado,
  presupuesto_pagado,
  indicadores,
  fecha_actualizacion,
  dependencyId,
  modules,
  onClose,
  onModuleClick,
}: DependencyDetailProps) {
  // Estado para el tipo de vista
  const [viewType, setViewType] = useState<'programa' | 'unidades'>('programa');
  // Estado para tabs de módulos
  const [activeTab, setActiveTab] = useState<'gasto' | 'indicadores' | 'compromisos' | 'normatividad'>('gasto');

  // Calcular IEG (Indicador de Ejercicio del Gasto)
  const ieg = (presupuesto_pagado / presupuesto_modificado) * 100;

  // Datos para el responsable
  const responsibleNames = [
    'Lic. María González Hernández',
    'Ing. Carlos López Martínez',
    'Dra. Ana Patricia Rodríguez',
    'Mtro. José Luis Sánchez Torres',
    'Lic. Carmen Elena Vázquez',
    'Ing. Roberto Flores Jiménez',
    'Lic. Alejandra Morales Cruz',
    'C.P. Fernando Castro Ruiz',
    'Lic. Silvia Patricia Ramírez',
    'Ing. Miguel Ángel Herrera',
    'Lic. Gabriela Mendoza Valdez',
    'Mtro. Juan Carlos Pérez',
    'Lic. Laura Beatriz Aguilar',
    'Ing. Ricardo Domínguez Luna',
    'Dra. Isabel Cristina Vargas'
  ];

  const getRandomResponsible = (depId: string) => {
    // Use hash of string instead of parseInt for new ID format (dep-archivo-general-e)
    let hash = 0;
    for (let i = 0; i < depId.length; i++) {
      hash = ((hash << 5) - hash) + depId.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    const index = Math.abs(hash) % responsibleNames.length;
    return responsibleNames[index];
  };

  const getResponsibleContact = (depId: string): ResponsibleContact => {
    const contacts: ResponsibleContact[] = [
      {
        name: 'Lic. María González Hernández',
        position: 'Coordinadora de Planeación y Evaluación',
        phone: '(246) 465-0100 ext. 1201',
        email: 'maria.gonzalez@tlaxcala.gob.mx',
        directBoss: 'Lic. Roberto Sánchez Morales - Subsecretario',
        office: 'Oficina 201-A',
        floor: 'Segundo piso',
        building: 'Palacio de Gobierno',
        address: 'Plaza de la Constitución No. 1, Centro, Tlaxcala de Xicohténcatl, Tlax.'
      },
      {
        name: 'Ing. Carlos López Martínez',
        position: 'Director de Seguimiento de Indicadores',
        phone: '(246) 465-0100 ext. 1305',
        email: 'carlos.lopez@tlaxcala.gob.mx',
        directBoss: 'Lic. Patricia Hernández López - Directora General',
        office: 'Oficina 305-B',
        floor: 'Tercer piso',
        building: 'Torre Administrativa',
        address: 'Av. Guerrero No. 15, Col. Centro, Tlaxcala de Xicohténcatl, Tlax.'
      },
      {
        name: 'Dra. Ana Patricia Rodríguez',
        position: 'Jefa del Departamento de Evaluación',
        phone: '(246) 465-0100 ext. 1150',
        email: 'ana.rodriguez@tlaxcala.gob.mx',
        directBoss: 'C.P. Fernando Ramírez Cruz - Coordinador General',
        office: 'Oficina 150-C',
        floor: 'Primer piso',
        building: 'Edificio Central SEPE',
        address: 'Blvd. Revolución No. 2, Col. Centro, Tlaxcala de Xicohténcatl, Tlax.'
      }
    ];

    // Use hash of string instead of parseInt for new ID format (dep-archivo-general-e)
    let hash = 0;
    for (let i = 0; i < depId.length; i++) {
      hash = ((hash << 5) - hash) + depId.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    const index = Math.abs(hash) % contacts.length;
    return contacts[index];
  };

  // Colores y etiquetas de módulos
  const moduleColors = {
    gasto: '#8b5cf6',
    indicadores: '#06b6d4',
    compromisos: '#f59e0b',
    normatividad: '#84cc16',
  };

  const moduleLabels = {
    gasto: 'Gasto',
    indicadores: 'Indicadores',
    compromisos: 'Compromisos',
    normatividad: 'Normatividad',
  };

  // Preparar segmentos para el progress bar
  const getSegments = () => {
    const segments = [];
    if (modules.gasto) segments.push({ value: modules.gasto, color: moduleColors.gasto });
    if (modules.indicadores) segments.push({ value: modules.indicadores, color: moduleColors.indicadores });
    if (modules.compromisos) segments.push({ value: modules.compromisos, color: moduleColors.compromisos });
    if (modules.normatividad) segments.push({ value: modules.normatividad, color: moduleColors.normatividad });
    return segments;
  };

  const calculateAverage = () => {
    const values = [modules.gasto, modules.indicadores, modules.compromisos, modules.normatividad];
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  };

  // Función para obtener color según rango
  const getStatusColor = (value: number) => {
    if (value >= 67) return '#10b981'; // Verde
    if (value >= 34) return '#f59e0b'; // Amarillo
    return '#ef4444'; // Rojo
  };

  // Formatear moneda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Formatear número grande
  const formatLargeNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}K`;
    }
    return value.toFixed(2);
  };

  // Datos simulados para la vista de unidades
  const unidadesData = [
    {
      name: 'Unidad de Planeación',
      aprobado: 18500000,
      modificado: 19200000,
      pagado: 17800000,
    },
    {
      name: 'Unidad de Administración',
      aprobado: 32400000,
      modificado: 31800000,
      pagado: 29500000,
    },
    {
      name: 'Unidad de Operación',
      aprobado: 45600000,
      modificado: 47200000,
      pagado: 43900000,
    },
    {
      name: 'Unidad de Evaluación',
      aprobado: 21300000,
      modificado: 22100000,
      pagado: 20800000,
    },
    {
      name: 'Unidad de Desarrollo',
      aprobado: 38900000,
      modificado: 40200000,
      pagado: 37600000,
    },
  ];

  // Preparar datos para la gráfica según el tipo de vista
  const chartData = viewType === 'programa' 
    ? indicadores.map((ind) => ({
        name: ind.eje.length > 40 ? ind.eje.substring(0, 40) + '...' : ind.eje,
        fullName: ind.eje,
        Aprobado: ind.aprobado,
        aprobadoMonto: null,
        Modificado: ind.modificado,
        modificadoMonto: null,
        Pagado: ind.pagado,
        pagadoMonto: null,
      }))
    : unidadesData.map((unidad) => ({
        name: unidad.name,
        fullName: unidad.name,
        Aprobado: (unidad.aprobado / presupuesto_aprobado) * 100,
        aprobadoMonto: unidad.aprobado,
        Modificado: (unidad.modificado / presupuesto_modificado) * 100,
        modificadoMonto: unidad.modificado,
        Pagado: (unidad.pagado / presupuesto_pagado) * 100,
        pagadoMonto: unidad.pagado,
      }));

  // Colores basados en los iconos del resumen presupuestal (tonos sutiles del background)
  const chartColors = {
    aprobado: '#1976D2',      // Azul (color del icono DollarSign)
    aprobadoBg: '#1976D215',  // Fondo azul sutil
    modificado: '#F9A825',    // Anaranjado (color del icono FileText)
    modificadoBg: '#F9A82515', // Fondo anaranjado sutil
    pagado: '#2E7D32',        // Verde (color del icono CheckCircle2)
    pagadoBg: '#2E7D3215',    // Fondo verde sutil
  };

  // Custom tooltip para la gráfica
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-sm mb-2 text-gray-900">{data.fullName}</p>
          <div className="space-y-1">
            <p className="text-xs">
              <span style={{ color: chartColors.aprobado }}>■ Aprobado:</span>{' '}
              {data.Aprobado.toFixed(1)}%
              {data.aprobadoMonto && (
                <span className="text-gray-600"> ({formatCurrency(data.aprobadoMonto)})</span>
              )}
            </p>
            <p className="text-xs">
              <span style={{ color: chartColors.modificado }}>■ Modificado:</span>{' '}
              {data.Modificado.toFixed(1)}%
              {data.modificadoMonto && (
                <span className="text-gray-600"> ({formatCurrency(data.modificadoMonto)})</span>
              )}
            </p>
            <p className="text-xs">
              <span style={{ color: chartColors.pagado }}>■ Pagado:</span>{' '}
              {data.Pagado.toFixed(1)}%
              {data.pagadoMonto && (
                <span className="text-gray-600"> ({formatCurrency(data.pagadoMonto)})</span>
              )}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom label para mostrar el porcentaje y monto en las barras
  const renderCustomLabel = (props: any) => {
    const { x, y, width, height, value, payload, dataKey } = props;
    
    // Solo mostrar si hay espacio suficiente
    if (width < 50) return null;

    let monto = null;
    if (dataKey === 'Aprobado' && payload.aprobadoMonto) {
      monto = payload.aprobadoMonto;
    } else if (dataKey === 'Modificado' && payload.modificadoMonto) {
      monto = payload.modificadoMonto;
    } else if (dataKey === 'Pagado' && payload.pagadoMonto) {
      monto = payload.pagadoMonto;
    }

    return (
      <text
        x={x + width + 5}
        y={y + height / 2}
        fill="#374151"
        fontSize={11}
        textAnchor="start"
        dominantBaseline="middle"
      >
        {value.toFixed(1)}%
        {monto && ` (${formatCurrency(monto)})`}
      </text>
    );
  };

  // Leyenda personalizada con cuadrados y montos
  const CustomLegend = (props: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-8 pt-6 px-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: chartColors.aprobado }} />
          <span className="text-sm text-gray-700">
            <span style={{ fontWeight: 'bold' }}>Aprobado</span>
            <span className="text-gray-500 ml-2">{formatCurrency(presupuesto_aprobado)}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: chartColors.modificado }} />
          <span className="text-sm text-gray-700">
            <span style={{ fontWeight: 'bold' }}>Modificado</span>
            <span className="text-gray-500 ml-2">{formatCurrency(presupuesto_modificado)}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: chartColors.pagado }} />
          <span className="text-sm text-gray-700">
            <span style={{ fontWeight: 'bold' }}>Pagado</span>
            <span className="text-gray-500 ml-2">{formatCurrency(presupuesto_pagado)}</span>
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
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
                <p className="text-sm text-gray-600 mb-1">Detalle de Dependencia</p>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl" style={{ color: '#582672', fontWeight: 'bold' }}>
                    {dependencia_nombre}
                  </h1>
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Badge
                      className="text-sm px-4 py-2 border-0 backdrop-blur-sm"
                      style={{
                        backgroundColor: `${getStatusColor(avance_porcentual)}15`,
                        color: getStatusColor(avance_porcentual),
                        fontWeight: 'bold',
                      }}
                    >
                      <motion.div
                        className="w-2.5 h-2.5 rounded-full mr-2"
                        style={{
                          backgroundColor: getStatusColor(avance_porcentual),
                          boxShadow: `0 0 12px ${getStatusColor(avance_porcentual)}90, 0 0 20px ${getStatusColor(avance_porcentual)}50`,
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
                      <span>{avance_porcentual.toFixed(1)}% Avance Presupuestal</span>
                    </Badge>
                  </motion.div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-6 py-8">
        {/* Vínculo responsable y resumen general */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Vínculo responsable */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>Vínculo responsable:</span>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <button 
                          className="hover:underline font-medium transition-colors cursor-pointer text-left"
                          style={{ color: '#582672' }}
                        >
                          {getRandomResponsible(dependencyId)}
                        </button>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-96 p-4" side="top">
                        {(() => {
                          const contact = getResponsibleContact(dependencyId);
                          return (
                            <div className="space-y-3">
                              {/* Header with name and position */}
                              <div className="pb-2 border-b">
                                <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                                <p className="text-sm font-medium" style={{ color: '#582672' }}>{contact.position}</p>
                              </div>

                              {/* Contact information */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-700">
                                    <strong>Teléfono:</strong>{' '}
                                    <a 
                                      href={`tel:${contact.phone.replace(/\s/g, '')}`}
                                      className="hover:underline transition-colors"
                                      style={{ color: '#582672' }}
                                    >
                                      {contact.phone}
                                    </a>
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                  <Mail className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-700">
                                    <strong>Email:</strong>{' '}
                                    <a 
                                      href={`mailto:${contact.email}`}
                                      className="hover:underline transition-colors"
                                      style={{ color: '#582672' }}
                                    >
                                      {contact.email}
                                    </a>
                                  </span>
                                </div>

                                <div className="flex items-start gap-2 text-sm">
                                  <UserCheck className="w-4 h-4 text-gray-400 mt-0.5" />
                                  <span className="text-gray-700">
                                    <strong>Jefe Directo:</strong><br />
                                    {contact.directBoss}
                                  </span>
                                </div>

                                <div className="flex items-start gap-2 text-sm">
                                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                  <div className="text-gray-700">
                                    <strong>Ubicación:</strong><br />
                                    <span className="text-xs">
                                      {contact.office} • {contact.floor}<br />
                                      {contact.building}<br />
                                      <span className="text-gray-500">{contact.address}</span>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </HoverCardContent>
                    </HoverCard>
                  </div>

                  {/* Resumen General con Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg" style={{ color: '#582672', fontWeight: 'bold' }}>
                        Resumen General de Evaluación
                      </h3>
                      <span className="text-2xl" style={{ fontWeight: 'bold', color: '#582672' }}>
                        {calculateAverage().toFixed(1)}%
                      </span>
                    </div>
                    
                    <MultiSegmentProgress segments={getSegments()} height="14px" delay={0.3} />
                    
                    {/* Module legend with colors and percentages */}
                    <div className="mt-3 flex flex-wrap gap-4 text-sm">
                      <button
                        onClick={() => setActiveTab('gasto')}
                        className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded transition-colors cursor-pointer"
                      >
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: moduleColors.gasto }} />
                        <span className="text-gray-700">
                          {moduleLabels.gasto}: <span style={{ fontWeight: 'bold' }}>{modules.gasto.toFixed(1)}%</span>
                        </span>
                      </button>
                      <button
                        onClick={() => setActiveTab('indicadores')}
                        className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded transition-colors cursor-pointer"
                      >
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: moduleColors.indicadores }} />
                        <span className="text-gray-700">
                          {moduleLabels.indicadores}: <span style={{ fontWeight: 'bold' }}>{modules.indicadores.toFixed(1)}%</span>
                        </span>
                      </button>
                      <button
                        onClick={() => setActiveTab('compromisos')}
                        className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded transition-colors cursor-pointer"
                      >
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: moduleColors.compromisos }} />
                        <span className="text-gray-700">
                          {moduleLabels.compromisos}: <span style={{ fontWeight: 'bold' }}>{modules.compromisos.toFixed(1)}%</span>
                        </span>
                      </button>
                      <button
                        onClick={() => setActiveTab('normatividad')}
                        className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded transition-colors cursor-pointer"
                      >
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: moduleColors.normatividad }} />
                        <span className="text-gray-700">
                          {moduleLabels.normatividad}: <span style={{ fontWeight: 'bold' }}>{modules.normatividad.toFixed(1)}%</span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tabs para módulos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-6"
        >
          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
            <TabsList className="grid w-full md:w-[600px] grid-cols-4">
              <TabsTrigger value="gasto">
                <DollarSign className="w-4 h-4 mr-2" />
                Gasto
              </TabsTrigger>
              <TabsTrigger value="indicadores">
                <TrendingUp className="w-4 h-4 mr-2" />
                Indicadores
              </TabsTrigger>
              <TabsTrigger value="compromisos">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Compromisos
              </TabsTrigger>
              <TabsTrigger value="normatividad">
                <Scale className="w-4 h-4 mr-2" />
                Normatividad
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Contenido del tab de Gasto */}
        {activeTab === 'gasto' && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl text-gray-900 mb-4" style={{ color: '#582672', fontWeight: 'bold' }}>
                Resumen Presupuestal
              </h2>

          {/* Indicador IEG - Ahora primero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-6"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl mb-1" style={{ fontWeight: 'bold', color: '#582672' }}>Indicador de Ejercicio del Gasto (IEG)</p>
                    <p className="text-xs text-gray-500">
                      Calculado como: (Presupuesto Pagado / Presupuesto Modificado) × 100
                    </p>
                  </div>
                  <Badge
                    className="text-lg px-6 py-3 border-0 backdrop-blur-sm"
                    style={{
                      backgroundColor: `${getStatusColor(ieg)}15`,
                      color: getStatusColor(ieg),
                      fontWeight: 'bold',
                    }}
                  >
                    <motion.div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{
                        backgroundColor: getStatusColor(ieg),
                        boxShadow: `0 0 12px ${getStatusColor(ieg)}90, 0 0 20px ${getStatusColor(ieg)}50`,
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
                    {ieg.toFixed(1)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Aprobado */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1976D215' }}>
                      <DollarSign className="w-6 h-6" style={{ color: '#1976D2' }} />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Presupuesto Aprobado</p>
                  <p className="text-3xl text-gray-900" style={{ fontWeight: 'bold' }}>{formatCurrency(presupuesto_aprobado)}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Modificado */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F9A82515' }}>
                      <FileText className="w-6 h-6" style={{ color: '#F9A825' }} />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Presupuesto Modificado</p>
                  <p className="text-3xl text-gray-900" style={{ fontWeight: 'bold' }}>{formatCurrency(presupuesto_modificado)}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pagado */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#2E7D3215' }}>
                      <CheckCircle2 className="w-6 h-6" style={{ color: '#2E7D32' }} />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Presupuesto Pagado</p>
                  <p className="text-3xl text-gray-900" style={{ fontWeight: 'bold' }}>{formatCurrency(presupuesto_pagado)}</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Gráfica de desempeño presupuestal */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <CardTitle className="text-2xl mb-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                      Desempeño Presupuestal por Indicador
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Comparativa de presupuesto aprobado, modificado y pagado
                    </p>
                  </div>
                  <Tabs value={viewType} onValueChange={(value) => setViewType(value as 'programa' | 'unidades')}>
                    <TabsList className="grid w-[300px] grid-cols-2">
                      <TabsTrigger value="programa">Por Programa</TabsTrigger>
                      <TabsTrigger value="unidades">Por Unidades</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 5, right: 180, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" domain={[0, 100]} stroke="#6b7280" />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={200}
                      stroke="#6b7280"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend content={<CustomLegend />} />
                    <Bar
                      dataKey="Aprobado"
                      fill={chartColors.aprobado}
                      radius={[0, 4, 4, 0]}
                      barSize={12}
                    >
                      <LabelList content={renderCustomLabel} />
                    </Bar>
                    <Bar
                      dataKey="Modificado"
                      fill={chartColors.modificado}
                      radius={[0, 4, 4, 0]}
                      barSize={12}
                    >
                      <LabelList content={renderCustomLabel} />
                    </Bar>
                    <Bar
                      dataKey="Pagado"
                      fill={chartColors.pagado}
                      radius={[0, 4, 4, 0]}
                      barSize={12}
                    >
                      <LabelList content={renderCustomLabel} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Panel de observaciones */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl" style={{ color: '#582672', fontWeight: 'bold' }}>
                  Observaciones CGPI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">•</span>
                      <span>
                        La dependencia mantiene un avance adecuado en el ejercicio presupuestal del trimestre actual.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">•</span>
                      <span>
                        Se recomienda dar seguimiento puntual a los indicadores con avance menor al 70% para garantizar el cumplimiento de metas anuales.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">•</span>
                      <span>
                        Es necesario actualizar la información de indicadores de desempeño en el sistema antes del cierre trimestral.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">•</span>
                      <span>
                        La modificación presupuestal debe estar debidamente justificada y documentada conforme a la normatividad aplicable.
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Pie de página */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  <p>
                    <strong>Última actualización:</strong> {fecha_actualizacion}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Coordinación General de Planeación e Inversión (CGPI)
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Descargar PDF
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <History className="w-4 h-4" />
                    Ver Histórico
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
          </>
        )}

        {/* Contenido del tab de Indicadores */}
        {activeTab === 'indicadores' && (
          <IndicadoresTabContent dependencyId={dependencyId} dependencyName={dependencia_nombre} />
        )}

        {/* Contenido del tab de Compromisos */}
        {activeTab === 'compromisos' && (
          <CompromisosTabContent dependencyId={dependencyId} dependencyName={dependencia_nombre} />
        )}

        {/* Contenido del tab de Normatividad */}
        {activeTab === 'normatividad' && (
          <NormatividadTabContent dependencyId={dependencyId} dependencyName={dependencia_nombre} />
        )}
      </div>
    </div>
  );
}

// Componente de contenido para tab de Indicadores
function IndicadoresTabContent({ dependencyId, dependencyName }: { dependencyId: string; dependencyName: string }) {
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
      },
      {
        nombre: 'Índice de satisfacción ciudadana',
        unidad: 'Puntos',
        tipo: 'Gestión',
        eje: 'ADM - 1. MEJORA DE LA GESTIÓN PÚBLICA',
        meta: 8.5,
        avance: 7.8,
      },
      {
        nombre: 'Reducción de tiempos de respuesta',
        unidad: 'Días',
        tipo: 'Gestión',
        eje: 'ADM - 2. EFICIENCIA ADMINISTRATIVA',
        meta: 15,
        avance: 18,
      },
      {
        nombre: 'Programas implementados',
        unidad: 'Número',
        tipo: 'Gestión',
        eje: 'PED - 2. DESARROLLO SOCIAL',
        meta: 25,
        avance: 22,
      },
      {
        nombre: 'Beneficiarios atendidos',
        unidad: 'Personas',
        tipo: 'Estratégico',
        eje: 'PED - 3. INCLUSIÓN SOCIAL',
        meta: 50000,
        avance: 45800,
      },
      {
        nombre: 'Infraestructura mejorada',
        unidad: 'Unidades',
        tipo: 'Gestión',
        eje: 'PED - 1. INFRAESTRUCTURA EDUCATIVA',
        meta: 120,
        avance: 135,
      },
    ];

    return indicadoresBase.map((ind, index) => ({
      id: `ind-${index}`,
      ...ind,
      cumplimiento: (ind.avance / ind.meta) * 100,
    }));
  };

  const indicadores = generateIndicadores();
  const total_indicadores = indicadores.length;
  const indicadores_cumplidos = indicadores.filter(ind => ind.cumplimiento >= 100).length;
  const indicadores_en_riesgo = indicadores.filter(ind => ind.cumplimiento >= 67 && ind.cumplimiento < 100).length;
  const indicadores_no_cumplidos = indicadores.filter(ind => ind.cumplimiento < 67).length;
  const icd_global = indicadores.reduce((sum, ind) => sum + ind.cumplimiento, 0) / indicadores.length;

  const getStatusColor = (percentage: number) => {
    if (percentage >= 100) return '#2E7D32';
    if (percentage >= 67) return '#F9A825';
    return '#D32F2F';
  };

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
    <div className="space-y-8">
      {/* Indicador ICD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl mb-1" style={{ fontWeight: 'bold', color: '#582672' }}>
                  Indicador de Cumplimiento de Desempeño (ICD)
                </p>
                <p className="text-xs text-gray-500">
                  Promedio general del cumplimiento de metas MIR
                </p>
              </div>
              <Badge
                className="text-2xl px-6 py-3 border-0"
                style={{
                  backgroundColor: `${getStatusColor(icd_global)}15`,
                  color: getStatusColor(icd_global),
                  fontWeight: 'bold',
                }}
              >
                {icd_global.toFixed(1)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Resumen general */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h2 className="text-2xl mb-4" style={{ color: '#582672', fontWeight: 'bold' }}>
          Resumen de Indicadores
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1976D215' }}>
                  <BarChart3 className="w-6 h-6" style={{ color: '#1976D2' }} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Indicadores Programados</p>
              <p className="text-3xl text-gray-900" style={{ fontWeight: 'bold' }}>
                {total_indicadores}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#2E7D3215' }}>
                  <CheckCircle2 className="w-6 h-6" style={{ color: '#2E7D32' }} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Cumplidos</p>
              <p className="text-3xl text-gray-900" style={{ fontWeight: 'bold' }}>
                {indicadores_cumplidos}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F9A82515' }}>
                  <Clock className="w-6 h-6" style={{ color: '#F9A825' }} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">En Proceso</p>
              <p className="text-3xl text-gray-900" style={{ fontWeight: 'bold' }}>
                {indicadores_en_riesgo}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#D32F2F15' }}>
                  <AlertTriangle className="w-6 h-6" style={{ color: '#D32F2F' }} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">En Riesgo</p>
              <p className="text-3xl text-gray-900" style={{ fontWeight: 'bold' }}>
                {indicadores_no_cumplidos}
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Gráfica */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl" style={{ color: '#582672', fontWeight: 'bold' }}>
              Avance por Indicador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" domain={[0, 100]} stroke="#6b7280" />
                <YAxis type="category" dataKey="name" width={250} stroke="#6b7280" tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="Meta" fill="#1976D2" radius={[0, 4, 4, 0]} barSize={14} name="Meta (100%)" />
                <Bar dataKey="Avance" fill="#2E7D32" radius={[0, 4, 4, 0]} barSize={14} name="Avance Real" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabla */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl" style={{ color: '#582672', fontWeight: 'bold' }}>
              Detalle de Indicadores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[280px]">Indicador</TableHead>
                    <TableHead>Eje MIR</TableHead>
                    <TableHead className="text-center">Unidad</TableHead>
                    <TableHead className="text-right">Meta</TableHead>
                    <TableHead className="text-right">Avance</TableHead>
                    <TableHead className="text-center">% Cumplimiento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {indicadores.map((ind) => (
                    <TableRow key={ind.id} className={`hover:bg-gray-50 ${ind.cumplimiento < 67 ? 'bg-red-50' : ''}`}>
                      <TableCell className="font-medium">{ind.nombre}</TableCell>
                      <TableCell className="text-sm text-gray-600">{ind.eje}</TableCell>
                      <TableCell className="text-center text-sm">{ind.unidad}</TableCell>
                      <TableCell className="text-right">{formatNumber(ind.meta)}</TableCell>
                      <TableCell className="text-right">{formatNumber(ind.avance)}</TableCell>
                      <TableCell className="text-center">
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// Componente de contenido para tab de Compromisos
function CompromisosTabContent({ dependencyId, dependencyName }: { dependencyId: string; dependencyName: string }) {
  const generateCompromisos = () => {
    return [
      { folio: 'CMP-2025-001', descripcion: 'Implementación del sistema digital de atención ciudadana', etapa: 'Ejecución', avance: 75, responsable: 'Dirección de Tecnologías' },
      { folio: 'CMP-2025-002', descripcion: 'Modernización de la infraestructura educativa', etapa: 'Cumplido', avance: 100, responsable: 'Dirección de Infraestructura' },
      { folio: 'CMP-2025-003', descripcion: 'Programa de capacitación para servidores públicos', etapa: 'Gestión', avance: 45, responsable: 'Coordinación de RH' },
      { folio: 'CMP-2025-004', descripcion: 'Actualización del marco normativo institucional', etapa: 'Planeación', avance: 25, responsable: 'Dirección Jurídica' },
      { folio: 'CMP-2025-005', descripcion: 'Implementación de medidas de transparencia', etapa: 'Cumplido', avance: 100, responsable: 'Unidad de Transparencia' },
    ];
  };

  const compromisos = generateCompromisos();
  const total = compromisos.length;
  const cumplidos = compromisos.filter(c => c.etapa === 'Cumplido').length;
  const icc_global = (cumplidos / total) * 100;

  const getEtapaColor = (etapa: string) => {
    switch (etapa) {
      case 'No iniciado': return '#9E9E9E';
      case 'Planeación': return '#1976D2';
      case 'Gestión': return '#F9A825';
      case 'Ejecución': return '#FF6F00';
      case 'Cumplido': return '#2E7D32';
      default: return '#9E9E9E';
    }
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 67) return '#2E7D32';
    if (percentage >= 34) return '#F9A825';
    return '#D32F2F';
  };

  return (
    <div className="space-y-8">
      {/* Indicador ICC */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl mb-1" style={{ fontWeight: 'bold', color: '#582672' }}>
                  Indicador de Cumplimiento de Compromisos (ICC)
                </p>
                <p className="text-xs text-gray-500">
                  Porcentaje de compromisos cumplidos
                </p>
              </div>
              <Badge
                className="text-2xl px-6 py-3 border-0"
                style={{
                  backgroundColor: `${getStatusColor(icc_global)}15`,
                  color: getStatusColor(icc_global),
                  fontWeight: 'bold',
                }}
              >
                {icc_global.toFixed(1)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabla de compromisos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl" style={{ color: '#582672', fontWeight: 'bold' }}>
              Detalle de Compromisos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Folio</TableHead>
                    <TableHead className="w-[350px]">Descripción</TableHead>
                    <TableHead className="text-center">Etapa</TableHead>
                    <TableHead className="text-center">Avance</TableHead>
                    <TableHead>Responsable</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {compromisos.map((comp) => (
                    <TableRow key={comp.folio} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{comp.folio}</TableCell>
                      <TableCell>{comp.descripcion}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className="border-0"
                          style={{
                            backgroundColor: `${getEtapaColor(comp.etapa)}15`,
                            color: getEtapaColor(comp.etapa),
                            fontWeight: 'bold',
                          }}
                        >
                          {comp.etapa}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-sm" style={{ fontWeight: 'bold' }}>
                            {comp.avance}%
                          </span>
                          <Progress value={comp.avance} className="h-1.5 w-20" />
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{comp.responsable}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// Componente de contenido para tab de Normatividad
function NormatividadTabContent({ dependencyId, dependencyName }: { dependencyId: string; dependencyName: string }) {
  const documentos = [
    { id: 'doc-1', nombre: 'Ley Orgánica', estatus: 'Validado', fechaActualizacion: '15 de marzo de 2025', fechaValidacion: '20 de marzo de 2025' },
    { id: 'doc-2', nombre: 'Organigrama Institucional', estatus: 'Validado', fechaActualizacion: '10 de febrero de 2025', fechaValidacion: '15 de febrero de 2025' },
    { id: 'doc-3', nombre: 'Reglamento Interior', estatus: 'En revisión', fechaActualizacion: '5 de abril de 2025', fechaValidacion: 'Pendiente' },
    { id: 'doc-4', nombre: 'Manual de Organización', estatus: 'Validado', fechaActualizacion: '28 de enero de 2025', fechaValidacion: '5 de febrero de 2025' },
    { id: 'doc-5', nombre: 'Manual de Procedimientos', estatus: 'Pendiente', fechaActualizacion: 'No actualizado', fechaValidacion: 'Pendiente' },
  ];

  const validados = documentos.filter(d => d.estatus === 'Validado').length;
  const total = documentos.length;
  const ian_global = (validados / total) * 100;

  const getEstatusColor = (estatus: string) => {
    switch (estatus) {
      case 'Validado': return '#2E7D32';
      case 'En revisión': return '#F9A825';
      case 'Pendiente': return '#D32F2F';
      default: return '#9E9E9E';
    }
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 80) return '#2E7D32';
    if (percentage >= 40) return '#F9A825';
    return '#D32F2F';
  };

  const getEstatusIcon = (estatus: string) => {
    switch (estatus) {
      case 'Validado': return <CheckCircle2 className="w-5 h-5" />;
      case 'En revisión': return <AlertTriangle className="w-5 h-5" />;
      case 'Pendiente': return <XCircle className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Indicador IAN */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl mb-1" style={{ fontWeight: 'bold', color: '#582672' }}>
                  Indicador de Actualización Normativa (IAN)
                </p>
                <p className="text-xs text-gray-500">
                  Porcentaje de documentos normativos actualizados y validados
                </p>
              </div>
              <Badge
                className="text-2xl px-6 py-3 border-0"
                style={{
                  backgroundColor: `${getStatusColor(ian_global)}15`,
                  color: getStatusColor(ian_global),
                  fontWeight: 'bold',
                }}
              >
                {ian_global.toFixed(1)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Documentos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h2 className="text-2xl mb-4" style={{ color: '#582672', fontWeight: 'bold' }}>
          Documentos Normativos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {documentos.map((doc) => (
            <Card
              key={doc.id}
              className="hover:shadow-lg transition-shadow"
              style={{ borderLeft: `4px solid ${getEstatusColor(doc.estatus)}` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${getEstatusColor(doc.estatus)}15` }}
                  >
                    <div style={{ color: getEstatusColor(doc.estatus) }}>
                      {getEstatusIcon(doc.estatus)}
                    </div>
                  </div>
                </div>
                <p className="text-sm mb-2" style={{ fontWeight: 'bold' }}>
                  {doc.nombre}
                </p>
                <Badge
                  className="border-0 w-full justify-center"
                  style={{
                    backgroundColor: `${getEstatusColor(doc.estatus)}15`,
                    color: getEstatusColor(doc.estatus),
                    fontWeight: 'bold',
                  }}
                >
                  {doc.estatus}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Tabla */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl" style={{ color: '#582672', fontWeight: 'bold' }}>
              Detalle de Documentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Documento</TableHead>
                    <TableHead>Fecha de Actualización</TableHead>
                    <TableHead className="text-center">Estatus</TableHead>
                    <TableHead>Fecha de Validación CGPI</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentos.map((doc) => (
                    <TableRow
                      key={doc.id}
                      className={`hover:bg-gray-50 ${doc.estatus === 'Pendiente' ? 'bg-red-50' : ''}`}
                    >
                      <TableCell className="font-medium">{doc.nombre}</TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {doc.fechaActualizacion}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className="border-0"
                          style={{
                            backgroundColor: `${getEstatusColor(doc.estatus)}15`,
                            color: getEstatusColor(doc.estatus),
                            fontWeight: 'bold',
                          }}
                        >
                          {doc.estatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{doc.fechaValidacion}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
