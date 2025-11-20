import { useState } from 'react';
import { 
  ArrowLeft, 
  FileCheck, 
  Download, 
  Filter,
  Search,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Building2,
  ChevronRight,
  Target,
  DollarSign,
  Map as MapIcon,
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
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface CompromisosGeneralModuleProps {
  onClose: () => void;
  onCompromisoClick: (compromiso: any) => void;
  onDependencyClick: (dep: { id: string; name: string }) => void;
  dependencies: Array<{ id: string; name: string }>;
}

// Municipios de Tlaxcala con coordenadas aproximadas para el mapa
const municipiosTlaxcala = [
  { name: 'Tlaxcala', x: 50, y: 45, compromisos: 15, avance: 78, presupuesto: 45000000 },
  { name: 'Apizaco', x: 45, y: 30, compromisos: 12, avance: 65, presupuesto: 38000000 },
  { name: 'Huamantla', x: 75, y: 50, compromisos: 10, avance: 82, presupuesto: 32000000 },
  { name: 'Chiautempan', x: 42, y: 50, compromisos: 8, avance: 55, presupuesto: 28000000 },
  { name: 'Tlaxco', x: 60, y: 15, compromisos: 7, avance: 70, presupuesto: 25000000 },
  { name: 'Calpulalpan', x: 25, y: 20, compromisos: 6, avance: 45, presupuesto: 22000000 },
  { name: 'Zacatelco', x: 40, y: 60, compromisos: 9, avance: 88, presupuesto: 30000000 },
  { name: 'San Pablo del Monte', x: 35, y: 55, compromisos: 8, avance: 92, presupuesto: 27000000 },
  { name: 'Papalotla de Xicohténcatl', x: 48, y: 38, compromisos: 5, avance: 60, presupuesto: 18000000 },
  { name: 'Contla de Juan Cuamatzi', x: 38, y: 48, compromisos: 6, avance: 75, presupuesto: 20000000 },
  { name: 'Apetatitlán de Antonio Carvajal', x: 52, y: 42, compromisos: 5, avance: 68, presupuesto: 19000000 },
  { name: 'Xaloztoc', x: 70, y: 55, compromisos: 4, avance: 50, presupuesto: 15000000 },
  { name: 'Ixtacuixtla de Mariano Matamoros', x: 55, y: 55, compromisos: 6, avance: 72, presupuesto: 21000000 },
  { name: 'Tetla de la Solidaridad', x: 32, y: 52, compromisos: 4, avance: 80, presupuesto: 16000000 },
  { name: 'Teolocholco', x: 43, y: 55, compromisos: 5, avance: 63, presupuesto: 17000000 },
];

// Ejes del Plan Estatal
const ejesPlanEstatal = [
  'Eje 1: Desarrollo Social y Combate a la Pobreza',
  'Eje 2: Crecimiento Económico Sostenible',
  'Eje 3: Infraestructura y Movilidad',
  'Eje 4: Medio Ambiente y Desarrollo Sustentable',
  'Eje 5: Gobierno Eficaz y Transparente',
  'Eje 6: Seguridad y Justicia',
];

// Generar 300 compromisos de la gobernadora
const generateCompromisos = () => {
  const compromisosBase = [
    { titulo: 'Construcción de hospitales de segundo nivel en zonas rurales', categoria: 'Salud', eje: 0 },
    { titulo: 'Ampliación de cobertura educativa en nivel medio superior', categoria: 'Educación', eje: 0 },
    { titulo: 'Modernización de infraestructura carretera estatal', categoria: 'Infraestructura', eje: 2 },
    { titulo: 'Programa de vivienda digna para familias vulnerables', categoria: 'Vivienda', eje: 0 },
    { titulo: 'Implementación de centros de atención ciudadana digital', categoria: 'Gobierno Digital', eje: 4 },
    { titulo: 'Fortalecimiento de seguridad pública municipal', categoria: 'Seguridad', eje: 5 },
    { titulo: 'Programa estatal de becas educativas', categoria: 'Educación', eje: 0 },
    { titulo: 'Recuperación y preservación de zonas arqueológicas', categoria: 'Cultura', eje: 1 },
    { titulo: 'Ampliación de red de agua potable en comunidades rurales', categoria: 'Infraestructura', eje: 2 },
    { titulo: 'Creación de centros de desarrollo infantil', categoria: 'Bienestar Social', eje: 0 },
    { titulo: 'Modernización del transporte público estatal', categoria: 'Movilidad', eje: 2 },
    { titulo: 'Programa de apoyo a microempresas locales', categoria: 'Desarrollo Económico', eje: 1 },
    { titulo: 'Reforestación y conservación de áreas naturales', categoria: 'Medio Ambiente', eje: 3 },
    { titulo: 'Construcción de mercados municipales modernos', categoria: 'Desarrollo Económico', eje: 1 },
    { titulo: 'Programa de atención integral a personas con discapacidad', categoria: 'Bienestar Social', eje: 0 },
    { titulo: 'Digitalización de trámites y servicios gubernamentales', categoria: 'Gobierno Digital', eje: 4 },
    { titulo: 'Mejoramiento de centros de salud comunitarios', categoria: 'Salud', eje: 0 },
    { titulo: 'Programa de capacitación técnica para jóvenes', categoria: 'Educación', eje: 1 },
    { titulo: 'Construcción de espacios deportivos en municipios', categoria: 'Deporte', eje: 0 },
    { titulo: 'Implementación de energías renovables en edificios públicos', categoria: 'Medio Ambiente', eje: 3 },
  ];

  const etapas = ['No iniciado', 'En proceso', '50%', 'Cumplido'];
  const prioridades = ['Alta', 'Media', 'Baja'];

  const compromisos = [];
  for (let i = 0; i < 300; i++) {
    const base = compromisosBase[i % compromisosBase.length];
    const etapaIndex = Math.floor(Math.random() * 4);
    const etapa = etapas[etapaIndex];
    
    let avance = 0;
    if (etapa === 'No iniciado') avance = 0;
    else if (etapa === 'En proceso') avance = Math.floor(Math.random() * 40) + 10;
    else if (etapa === '50%') avance = Math.floor(Math.random() * 20) + 45;
    else if (etapa === 'Cumplido') avance = 100;

    const numIntervinientes = Math.floor(Math.random() * 5) + 2;
    const prioridad = prioridades[Math.floor(Math.random() * 3)];
    const presupuestoAprobado = Math.floor(Math.random() * 30000000) + 5000000;
    const presupuestoModificado = presupuestoAprobado + Math.floor(Math.random() * 5000000) - 2000000;
    const presupuestoEjercido = Math.floor(presupuestoModificado * (avance / 100));
    const municipio = municipiosTlaxcala[Math.floor(Math.random() * municipiosTlaxcala.length)].name;

    compromisos.push({
      id: `CG-${String(i + 1).padStart(3, '0')}`,
      titulo: `${base.titulo} ${i > 19 ? `- Fase ${Math.floor(i / 20) + 1}` : ''}`,
      categoria: base.categoria,
      eje: ejesPlanEstatal[base.eje],
      etapa,
      avance,
      prioridad,
      dependenciaResponsable: `Dependencia ${Math.floor(Math.random() * 20) + 1}`,
      numIntervinientes,
      ultimaActualizacion: new Date(2025, 9, Math.floor(Math.random() * 30) + 1).toLocaleDateString('es-MX'),
      metaGeneral: `${Math.floor(Math.random() * 500) + 100} ${['personas beneficiadas', 'obras entregadas', 'servicios implementados'][Math.floor(Math.random() * 3)]}`,
      presupuestoAprobado,
      presupuestoModificado,
      presupuestoEjercido,
      municipio,
      año: 2024 + Math.floor(Math.random() * 2),
    });
  }

  return compromisos;
};

export function CompromisosGeneralModule({ 
  onClose, 
  onCompromisoClick,
  onDependencyClick,
  dependencies
}: CompromisosGeneralModuleProps) {
  const [compromisos] = useState(generateCompromisos());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEtapa, setFilterEtapa] = useState('todos');
  const [filterDependencia, setFilterDependencia] = useState('todos');
  const [filterMunicipio, setFilterMunicipio] = useState('todos');
  const [filterAño, setFilterAño] = useState('todos');
  const [filterEje, setFilterEje] = useState('todos');
  const [hoveredMunicipio, setHoveredMunicipio] = useState<string | null>(null);

  // Calcular estadísticas
  const total = compromisos.length;
  const noIniciados = compromisos.filter(c => c.etapa === 'No iniciado').length;
  const enProceso = compromisos.filter(c => c.etapa === 'En proceso').length;
  const al50 = compromisos.filter(c => c.etapa === '50%').length;
  const cumplidos = compromisos.filter(c => c.etapa === 'Cumplido').length;

  const totalPresupuestoAprobado = compromisos.reduce((acc, c) => acc + c.presupuestoAprobado, 0);
  const totalPresupuestoModificado = compromisos.reduce((acc, c) => acc + c.presupuestoModificado, 0);
  const totalPresupuestoEjercido = compromisos.reduce((acc, c) => acc + c.presupuestoEjercido, 0);

  // Calcular presupuesto y beneficiados por año
  const presupuestoPorAño = {
    2021: { presupuesto: 2450000000, beneficiados: 185000 },
    2022: { presupuesto: 2780000000, beneficiados: 225000 },
    2023: { presupuesto: 3120000000, beneficiados: 268000 },
    2024: { presupuesto: compromisos.filter(c => c.año === 2024).reduce((acc, c) => acc + c.presupuestoEjercido, 0), beneficiados: 312000 },
    2025: { presupuesto: compromisos.filter(c => c.año === 2025).reduce((acc, c) => acc + c.presupuestoEjercido, 0), beneficiados: 145000 },
  };

  const acumuladoHistorico = {
    presupuesto: Object.values(presupuestoPorAño).reduce((acc, year) => acc + year.presupuesto, 0),
    beneficiados: Object.values(presupuestoPorAño).reduce((acc, year) => acc + year.beneficiados, 0),
  };

  const avanceGlobal = compromisos.reduce((acc, c) => acc + c.avance, 0) / total;
  const cumplimientoGlobal = (cumplidos / total) * 100;

  // Semáforo global
  const getSemaforoGlobal = () => {
    if (cumplimientoGlobal >= 60) return { color: '#2E7D32', label: 'En tiempo' };
    if (cumplimientoGlobal >= 40) return { color: '#F9A825', label: 'Requiere atención' };
    return { color: '#D32F2F', label: 'En riesgo' };
  };

  const semaforoGlobal = getSemaforoGlobal();

  // Datos para gráficas
  const pieData = [
    { name: 'No iniciado', value: noIniciados, color: '#9E9E9E' },
    { name: 'En proceso', value: enProceso, color: '#1976D2' },
    { name: '50%', value: al50, color: '#F9A825' },
    { name: 'Cumplido', value: cumplidos, color: '#2E7D32' },
  ].filter(item => item.value > 0);

  // Datos por dependencia para gráfica de barras horizontales
  const dependenciaData = Object.entries(
    compromisos.reduce((acc, c) => {
      if (!acc[c.dependenciaResponsable]) {
        acc[c.dependenciaResponsable] = { total: 0, avanceSum: 0 };
      }
      acc[c.dependenciaResponsable].total += 1;
      acc[c.dependenciaResponsable].avanceSum += c.avance;
      return acc;
    }, {} as Record<string, { total: number; avanceSum: number }>)
  )
    .map(([name, data]) => ({
      name: name.replace('Dependencia ', 'Dep. '),
      compromisos: data.total,
      avance: Math.round(data.avanceSum / data.total),
    }))
    .sort((a, b) => b.avance - a.avance)
    .slice(0, 10);

  // Filtrar compromisos
  const filteredCompromisos = compromisos.filter(c => {
    const matchSearch = c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchEtapa = filterEtapa === 'todos' || c.etapa === filterEtapa;
    const matchDependencia = filterDependencia === 'todos' || c.dependenciaResponsable === filterDependencia;
    const matchMunicipio = filterMunicipio === 'todos' || c.municipio === filterMunicipio;
    const matchAño = filterAño === 'todos' || c.año.toString() === filterAño;
    const matchEje = filterEje === 'todos' || c.eje === filterEje;

    return matchSearch && matchEtapa && matchDependencia && matchMunicipio && matchAño && matchEje;
  });

  const getEtapaColor = (etapa: string) => {
    switch (etapa) {
      case 'No iniciado': return '#9E9E9E';
      case 'En proceso': return '#1976D2';
      case '50%': return '#F9A825';
      case 'Cumplido': return '#2E7D32';
      default: return '#9E9E9E';
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'Alta': return '#D32F2F';
      case 'Media': return '#F9A825';
      case 'Baja': return '#1976D2';
      default: return '#9E9E9E';
    }
  };

  const getSemaforoAvance = (avance: number) => {
    if (avance >= 67) return '#2E7D32';
    if (avance >= 34) return '#F9A825';
    return '#D32F2F';
  };

  const getMunicipioColor = (avance: number) => {
    if (avance >= 75) return '#2E7D32';
    if (avance >= 50) return '#66BB6A';
    if (avance >= 25) return '#FFA726';
    return '#EF5350';
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
                  Monitoreo Estratégico Gubernamental (MeG)
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Compromisos de la Gobernadora — Sistema de seguimiento y evaluación
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Índice de cumplimiento global</p>
                <Badge
                  className="text-lg px-4 py-2 border-0"
                  style={{
                    backgroundColor: `${semaforoGlobal.color}15`,
                    color: semaforoGlobal.color,
                    fontWeight: 'bold',
                  }}
                >
                  <motion.div
                    className="w-2.5 h-2.5 rounded-full mr-2"
                    style={{
                      backgroundColor: semaforoGlobal.color,
                      boxShadow: `0 0 10px ${semaforoGlobal.color}90`,
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
                  {cumplimientoGlobal.toFixed(1)}% — {semaforoGlobal.label}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* KPIs principales - Bento UI Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl mb-4" style={{ color: '#582672', fontWeight: 'bold' }}>
            Resumen Ejecutivo
          </h2>
          
          {/* Grid Bento: Compromisos a la izquierda, Presupuesto a la derecha */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Grupo 1: Compromisos - Bento Layout */}
            <Card className="hover:shadow-xl transition-all border-2 border-purple-100" style={{ background: 'linear-gradient(135deg, #58267205 0%, #58267210 100%)' }}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                  <Target className="w-5 h-5" />
                  Estado de Compromisos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {/* Total - Destacado */}
                  <div className="col-span-2">
                    <Card className="border-2 border-purple-200 bg-white hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#58267220' }}>
                              <Target className="w-8 h-8" style={{ color: '#582672' }} />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Total de Compromisos</p>
                              <p className="text-4xl" style={{ fontWeight: 'bold', color: '#582672' }}>{total}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className="text-lg px-4 py-2 border-0" style={{ backgroundColor: '#58267215', color: '#582672', fontWeight: 'bold' }}>
                              {avanceGlobal.toFixed(1)}%
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">Avance global</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* No iniciado */}
                  <Card className="hover:shadow-md transition-shadow bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#9E9E9E15' }}>
                          <Clock className="w-4 h-4" style={{ color: '#9E9E9E' }} />
                        </div>
                        <p className="text-xs text-gray-600">No iniciado</p>
                      </div>
                      <p className="text-2xl mb-1" style={{ fontWeight: 'bold' }}>{noIniciados}</p>
                      <p className="text-xs text-gray-500">{((noIniciados/total)*100).toFixed(1)}%</p>
                    </CardContent>
                  </Card>

                  {/* En proceso */}
                  <Card className="hover:shadow-md transition-shadow bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1976D215' }}>
                          <FileCheck className="w-4 h-4" style={{ color: '#1976D2' }} />
                        </div>
                        <p className="text-xs text-gray-600">En proceso</p>
                      </div>
                      <p className="text-2xl mb-1" style={{ fontWeight: 'bold' }}>{enProceso}</p>
                      <p className="text-xs text-gray-500">{((enProceso/total)*100).toFixed(1)}%</p>
                    </CardContent>
                  </Card>

                  {/* 50% */}
                  <Card className="hover:shadow-md transition-shadow bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F9A82515' }}>
                          <TrendingUp className="w-4 h-4" style={{ color: '#F9A825' }} />
                        </div>
                        <p className="text-xs text-gray-600">Al 50%</p>
                      </div>
                      <p className="text-2xl mb-1" style={{ fontWeight: 'bold' }}>{al50}</p>
                      <p className="text-xs text-gray-500">{((al50/total)*100).toFixed(1)}%</p>
                    </CardContent>
                  </Card>

                  {/* Cumplidos - Destacado */}
                  <Card className="border-2 border-green-200 hover:shadow-md transition-shadow bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#2E7D3220' }}>
                          <CheckCircle2 className="w-4 h-4" style={{ color: '#2E7D32' }} />
                        </div>
                        <p className="text-xs" style={{ fontWeight: 'bold', color: '#2E7D32' }}>Cumplidos</p>
                      </div>
                      <p className="text-2xl mb-1" style={{ fontWeight: 'bold', color: '#2E7D32' }}>{cumplidos}</p>
                      <p className="text-xs text-gray-500">{((cumplidos/total)*100).toFixed(1)}%</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Grupo 2: Presupuesto - Bento Layout */}
            <Card className="hover:shadow-xl transition-all border-2 border-blue-100" style={{ background: 'linear-gradient(135deg, #1976D205 0%, #1976D210 100%)' }}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#1976D2', fontWeight: 'bold' }}>
                  <DollarSign className="w-5 h-5" />
                  Presupuesto Total
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[500px] overflow-y-auto space-y-3 pr-2">
                {/* Acumulado Histórico - Destacado - PRIMERO */}
                <Card className="border-2 border-green-200 hover:shadow-md transition-shadow bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#2E7D3220' }}>
                          <DollarSign className="w-5 h-5" style={{ color: '#2E7D32' }} />
                        </div>
                        <div>
                          <Badge className="text-xs mb-1 border-0" style={{ backgroundColor: '#2E7D3220', color: '#2E7D32', fontWeight: 'bold' }}>
                            Acumulado Histórico
                          </Badge>
                          <p className="text-xs text-gray-600">2021 - 2025</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-3xl mb-1" style={{ fontWeight: 'bold', color: '#2E7D32' }}>
                      ${(acumuladoHistorico.presupuesto / 1000000).toFixed(1)}M
                    </p>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" style={{ color: '#2E7D32' }} />
                      <p className="text-sm" style={{ fontWeight: 'bold', color: '#2E7D32' }}>
                        {acumuladoHistorico.beneficiados.toLocaleString('es-MX')} beneficiados
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Año 2025 - EN CURSO CON ESTILO FOCUS */}
                <Card className="border-2 hover:shadow-lg transition-all bg-white shadow-md" style={{ borderColor: '#1976D2', background: 'linear-gradient(135deg, #1976D205 0%, #1976D210 100%)' }}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center animate-pulse" style={{ backgroundColor: '#1976D230' }}>
                          <DollarSign className="w-5 h-5" style={{ color: '#1976D2' }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="text-xs border-0" style={{ backgroundColor: '#1976D2', color: 'white', fontWeight: 'bold' }}>
                              2025
                            </Badge>
                            <Badge className="text-xs border-0" style={{ backgroundColor: '#F9A82520', color: '#F9A825', fontWeight: 'bold' }}>
                              En curso
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-700">Ejercicio fiscal actual</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-2xl mb-1" style={{ fontWeight: 'bold', color: '#1976D2' }}>
                      ${(presupuestoPorAño[2025].presupuesto / 1000000).toFixed(1)}M
                    </p>
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3" style={{ color: '#1976D2' }} />
                      <p className="text-xs" style={{ fontWeight: 'bold', color: '#1976D2' }}>
                        {presupuestoPorAño[2025].beneficiados.toLocaleString('es-MX')} beneficiados
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Año 2024 */}
                <Card className="hover:shadow-md transition-shadow bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#58267215' }}>
                          <DollarSign className="w-5 h-5" style={{ color: '#582672' }} />
                        </div>
                        <div>
                          <Badge variant="outline" className="text-xs mb-1">2024</Badge>
                          <p className="text-xs text-gray-600">Ejercicio fiscal</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-2xl mb-1" style={{ fontWeight: 'bold' }}>
                      ${(presupuestoPorAño[2024].presupuesto / 1000000).toFixed(1)}M
                    </p>
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3 text-gray-500" />
                      <p className="text-xs text-gray-600">{presupuestoPorAño[2024].beneficiados.toLocaleString('es-MX')} beneficiados</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Año 2023 */}
                <Card className="hover:shadow-md transition-shadow bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#58267215' }}>
                          <DollarSign className="w-5 h-5" style={{ color: '#582672' }} />
                        </div>
                        <div>
                          <Badge variant="outline" className="text-xs mb-1">2023</Badge>
                          <p className="text-xs text-gray-600">Ejercicio fiscal</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-2xl mb-1" style={{ fontWeight: 'bold' }}>
                      ${(presupuestoPorAño[2023].presupuesto / 1000000).toFixed(1)}M
                    </p>
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3 text-gray-500" />
                      <p className="text-xs text-gray-600">{presupuestoPorAño[2023].beneficiados.toLocaleString('es-MX')} beneficiados</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Año 2022 */}
                <Card className="hover:shadow-md transition-shadow bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#58267215' }}>
                          <DollarSign className="w-5 h-5" style={{ color: '#582672' }} />
                        </div>
                        <div>
                          <Badge variant="outline" className="text-xs mb-1">2022</Badge>
                          <p className="text-xs text-gray-600">Ejercicio fiscal</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-2xl mb-1" style={{ fontWeight: 'bold' }}>
                      ${(presupuestoPorAño[2022].presupuesto / 1000000).toFixed(1)}M
                    </p>
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3 text-gray-500" />
                      <p className="text-xs text-gray-600">{presupuestoPorAño[2022].beneficiados.toLocaleString('es-MX')} beneficiados</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Año 2021 */}
                <Card className="hover:shadow-md transition-shadow bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#58267215' }}>
                          <DollarSign className="w-5 h-5" style={{ color: '#582672' }} />
                        </div>
                        <div>
                          <Badge variant="outline" className="text-xs mb-1">2021</Badge>
                          <p className="text-xs text-gray-600">Ejercicio fiscal</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-2xl mb-1" style={{ fontWeight: 'bold' }}>
                      ${(presupuestoPorAño[2021].presupuesto / 1000000).toFixed(1)}M
                    </p>
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3 text-gray-500" />
                      <p className="text-xs text-gray-600">{presupuestoPorAño[2021].beneficiados.toLocaleString('es-MX')} beneficiados</p>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Mapa y Gráfica de barras */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
            {/* Mapa interactivo de Tlaxcala - 70% width */}
            <Card className="lg:col-span-7 border-2 border-purple-200 hover:shadow-xl transition-all">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                  <MapIcon className="w-5 h-5" />
                  Mapa de Compromisos por Municipio
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Avance promedio de compromisos por municipio — Cobertura geográfica estatal
                </p>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-[450px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-2 border-gray-300 overflow-hidden shadow-inner">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Forma simplificada del estado de Tlaxcala */}
                    <path
                      d="M 20,25 L 80,20 L 85,35 L 90,55 L 75,70 L 55,75 L 35,72 L 25,65 L 15,50 Z"
                      fill="#E0E0E0"
                      stroke="#9E9E9E"
                      strokeWidth="0.5"
                    />
                    
                    {/* Municipios como círculos */}
                    <TooltipProvider>
                      {municipiosTlaxcala.map((municipio) => (
                        <Tooltip key={municipio.name}>
                          <TooltipTrigger asChild>
                            <circle
                              cx={municipio.x}
                              cy={municipio.y}
                              r={3 + (municipio.compromisos / 3)}
                              fill={getMunicipioColor(municipio.avance)}
                              stroke="white"
                              strokeWidth="0.5"
                              className="cursor-pointer transition-all hover:r-8"
                              onMouseEnter={() => setHoveredMunicipio(municipio.name)}
                              onMouseLeave={() => setHoveredMunicipio(null)}
                              style={{
                                filter: hoveredMunicipio === municipio.name ? 'brightness(1.2)' : 'none',
                                opacity: hoveredMunicipio === municipio.name ? 1 : 0.85,
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-xs">
                              <p style={{ fontWeight: 'bold' }}>{municipio.name}</p>
                              <p>Compromisos: {municipio.compromisos}</p>
                              <p>Avance: {municipio.avance}%</p>
                              <p>Presupuesto: ${(municipio.presupuesto / 1000000).toFixed(1)}M</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </TooltipProvider>
                  </svg>
                  
                  {/* Leyenda */}
                  <div className="absolute bottom-4 left-4 bg-white/95 p-3 rounded-lg shadow-md">
                    <p className="text-xs mb-2" style={{ fontWeight: 'bold' }}>Avance:</p>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#2E7D32' }} />
                        <span className="text-xs">75-100%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#66BB6A' }} />
                        <span className="text-xs">50-74%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFA726' }} />
                        <span className="text-xs">25-49%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#EF5350' }} />
                        <span className="text-xs">0-24%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gráfica de barras horizontales por dependencia - 30% width */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                  <Building2 className="w-5 h-5" />
                  Top 10 Dependencias
                </CardTitle>
                <p className="text-xs text-gray-600">
                  Por porcentaje de avance
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={450}>
                  <BarChart data={dependenciaData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" domain={[0, 100]} stroke="#6b7280" style={{ fontSize: '10px' }} />
                    <YAxis type="category" dataKey="name" width={60} stroke="#6b7280" style={{ fontSize: '9px' }} />
                    <RechartsTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                              <p className="text-sm" style={{ fontWeight: 'bold' }}>{payload[0].payload.name.replace('Dep. ', 'Dependencia ')}</p>
                              <p className="text-xs text-gray-600">Compromisos: {payload[0].payload.compromisos}</p>
                              <p className="text-xs" style={{ color: '#582672', fontWeight: 'bold' }}>Avance: {payload[0].value}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="avance" fill="#582672" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Filtros y búsqueda */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Primera fila: Búsqueda */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por nombre o folio del compromiso..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Segunda fila: Filtros */}
                <div className="flex items-center gap-4 flex-wrap">
                  <Select value={filterDependencia} onValueChange={setFilterDependencia}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Dependencia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas las dependencias</SelectItem>
                      {dependencies.slice(0, 10).map(dep => (
                        <SelectItem key={dep.id} value={dep.name}>{dep.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filterMunicipio} onValueChange={setFilterMunicipio}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Municipio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los municipios</SelectItem>
                      {municipiosTlaxcala.map(m => (
                        <SelectItem key={m.name} value={m.name}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filterEtapa} onValueChange={setFilterEtapa}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Etapa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas las etapas</SelectItem>
                      <SelectItem value="No iniciado">No iniciado</SelectItem>
                      <SelectItem value="En proceso">En proceso</SelectItem>
                      <SelectItem value="50%">50%</SelectItem>
                      <SelectItem value="Cumplido">Cumplido</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterAño} onValueChange={setFilterAño}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Año" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los años</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterEje} onValueChange={setFilterEje}>
                    <SelectTrigger className="w-[280px]">
                      <SelectValue placeholder="Eje del Plan Estatal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los ejes</SelectItem>
                      {ejesPlanEstatal.map(eje => (
                        <SelectItem key={eje} value={eje}>{eje}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('');
                      setFilterEtapa('todos');
                      setFilterDependencia('todos');
                      setFilterMunicipio('todos');
                      setFilterAño('todos');
                      setFilterEje('todos');
                    }}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Limpiar filtros
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Mostrando <strong>{filteredCompromisos.length}</strong> de <strong>{total}</strong> compromisos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lista de compromisos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h2 className="text-2xl mb-4" style={{ color: '#582672', fontWeight: 'bold' }}>
            Catálogo de Compromisos
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            {filteredCompromisos.map((compromiso, index) => (
              <motion.div
                key={compromiso.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.01 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onCompromisoClick(compromiso)}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {compromiso.id}
                          </Badge>
                          <Badge
                            className="text-xs border-0"
                            style={{
                              backgroundColor: `${getEtapaColor(compromiso.etapa)}15`,
                              color: getEtapaColor(compromiso.etapa),
                            }}
                          >
                            {compromiso.etapa}
                          </Badge>
                          <Badge
                            className="text-xs border-0"
                            style={{
                              backgroundColor: `${getPrioridadColor(compromiso.prioridad)}15`,
                              color: getPrioridadColor(compromiso.prioridad),
                            }}
                          >
                            Prioridad {compromiso.prioridad}
                          </Badge>
                        </div>
                        
                        <h3 className="text-lg mb-2" style={{ fontWeight: 'bold' }}>
                          {compromiso.titulo}
                        </h3>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-3 flex-wrap">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            <span>{compromiso.dependenciaResponsable}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{compromiso.numIntervinientes} intervinientes</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapIcon className="w-4 h-4" />
                            <span>{compromiso.municipio}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            <span>${(compromiso.presupuestoEjercido / 1000000).toFixed(1)}M ejercido</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-600">Avance</span>
                              <span className="text-xs" style={{ fontWeight: 'bold', color: getSemaforoAvance(compromiso.avance) }}>
                                {compromiso.avance}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="h-2 rounded-full transition-all"
                                style={{
                                  width: `${compromiso.avance}%`,
                                  backgroundColor: getSemaforoAvance(compromiso.avance),
                                }}
                              />
                            </div>
                          </div>
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: getSemaforoAvance(compromiso.avance),
                              boxShadow: `0 0 8px ${getSemaforoAvance(compromiso.avance)}90`,
                            }}
                          />
                        </div>
                      </div>

                      <Button variant="ghost" size="icon">
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Fecha de actualización:</strong> 4 de noviembre de 2025
              </p>
              <p className="text-xs text-gray-500">
                Coordinación General de Planeación e Inversión (CGPI) — Gobierno del Estado de Tlaxcala
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Descargar catálogo completo
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}