import { useState } from 'react';
import {
  ArrowLeft,
  Download,
  Filter,
  MapPin,
  Target,
  Building2,
  TrendingUp,
  FileText,
  AlertCircle,
  Info,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { Alert, AlertDescription } from './ui/alert';

interface DashboardMunicipioProps {
  onClose: () => void;
  año: string;
}

// Municipios de Tlaxcala con coordenadas para el mapa
const municipiosTlaxcala = [
  { id: 1, name: 'Tlaxcala', x: 50, y: 45, compromisos: 15, metas: 28, cantidad: 8500 },
  { id: 2, name: 'Apizaco', x: 45, y: 30, compromisos: 12, metas: 22, cantidad: 6200 },
  { id: 3, name: 'Huamantla', x: 75, y: 50, compromisos: 10, metas: 18, cantidad: 5100 },
  { id: 4, name: 'Chiautempan', x: 42, y: 50, compromisos: 8, metas: 15, cantidad: 4300 },
  { id: 5, name: 'Tlaxco', x: 60, y: 15, compromisos: 7, metas: 14, cantidad: 3800 },
  { id: 6, name: 'Calpulalpan', x: 25, y: 20, compromisos: 6, metas: 12, cantidad: 3200 },
  { id: 7, name: 'Zacatelco', x: 40, y: 60, compromisos: 9, metas: 17, cantidad: 4700 },
  { id: 8, name: 'San Pablo del Monte', x: 35, y: 55, compromisos: 8, metas: 16, cantidad: 4500 },
  { id: 9, name: 'Papalotla', x: 48, y: 38, compromisos: 5, metas: 10, cantidad: 2900 },
  { id: 10, name: 'Contla', x: 38, y: 48, compromisos: 6, metas: 12, cantidad: 3400 },
  { id: 11, name: 'Tetla', x: 32, y: 52, compromisos: 4, metas: 8, cantidad: 2200 },
  { id: 12, name: 'Teolocholco', x: 43, y: 55, compromisos: 5, metas: 10, cantidad: 2800 },
];

const unidadesMedida = [
  'Personas beneficiadas',
  'Obras entregadas',
  'Servicios implementados',
  'Equipamientos realizados',
  'Capacitaciones impartidas',
  'Apoyos entregados',
];

const dependencias = [
  'Secretaría de Educación Pública',
  'Secretaría de Salud',
  'Secretaría de Desarrollo Social',
  'Secretaría de Obras Públicas',
  'Secretaría de Desarrollo Económico',
  'DIF Estatal',
];

// Generar detalles por municipio
const generateDetallesMunicipio = (municipioName: string) => {
  const data = [];
  const compromisos = [
    'Construcción de centros de salud',
    'Programa de becas educativas',
    'Modernización de infraestructura vial',
    'Ampliación de red de agua potable',
    'Construcción de centros deportivos',
    'Programa de apoyo a microempresas',
    'Mejoramiento de espacios públicos',
    'Construcción de mercados municipales',
  ];

  const numRegistros = Math.floor(Math.random() * 15) + 5;

  for (let i = 0; i < numRegistros; i++) {
    data.push({
      id: i + 1,
      unidadMedida: unidadesMedida[Math.floor(Math.random() * unidadesMedida.length)],
      compromiso: compromisos[Math.floor(Math.random() * compromisos.length)],
      meta: `Meta ${Math.floor(Math.random() * 3) + 1}`,
      dependencia: dependencias[Math.floor(Math.random() * dependencias.length)],
      cantidad: Math.floor(Math.random() * 500) + 50,
      año: 2024 + Math.floor(Math.random() * 2),
    });
  }

  return data;
};

export function CompromisosDashboardMunicipio({ onClose, año: añoInicial }: DashboardMunicipioProps) {
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState<string | null>(null);
  const [año, setAño] = useState(añoInicial || 'todos');
  const [unidadFiltro, setUnidadFiltro] = useState('todos');
  const [dependenciaFiltro, setDependenciaFiltro] = useState('todos');
  const [hoveredMunicipio, setHoveredMunicipio] = useState<string | null>(null);

  // Obtener detalles del municipio seleccionado
  const detallesCompletos = municipioSeleccionado ? generateDetallesMunicipio(municipioSeleccionado) : [];

  // Filtrar detalles
  const detallesFiltrados = detallesCompletos.filter(item => {
    const matchAño = año === 'todos' || item.año.toString() === año;
    const matchUnidad = unidadFiltro === 'todos' || item.unidadMedida === unidadFiltro;
    const matchDependencia = dependenciaFiltro === 'todos' || item.dependencia === dependenciaFiltro;
    return matchAño && matchUnidad && matchDependencia;
  });

  // Calcular totales
  const totalAcciones = detallesFiltrados.length;
  const totalCantidad = detallesFiltrados.reduce((sum, item) => sum + item.cantidad, 0);
  const unidadesUnicas = new Set(detallesFiltrados.map(d => d.unidadMedida)).size;
  const dependenciasUnicas = new Set(detallesFiltrados.map(d => d.dependencia)).size;

  const municipioData = municipioSeleccionado 
    ? municipiosTlaxcala.find(m => m.name === municipioSeleccionado)
    : null;

  // Calcular color basado en cantidad
  const getColorIntensity = (cantidad: number) => {
    const maxCantidad = Math.max(...municipiosTlaxcala.map(m => m.cantidad));
    const intensity = (cantidad / maxCantidad) * 0.8 + 0.2;
    return `rgba(88, 38, 114, ${intensity})`;
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
                <h1 className="text-2xl" style={{ color: '#582672', fontWeight: 'bold' }}>
                  Dashboard por Municipio
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Análisis geográfico de acciones y compromisos por municipio
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
        {/* Mapa principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                <MapPin className="w-5 h-5" />
                MAPA INTERACTIVO DE TLAXCALA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="border-blue-300 bg-blue-50 mb-6">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  Selecciona un municipio en el mapa para ver el detalle de acciones y compromisos realizados.
                  La intensidad del color indica el nivel de actividad.
                </AlertDescription>
              </Alert>

              <div className="relative w-full bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-8 border-2 border-purple-200">
                <TooltipProvider>
                  <svg className="w-full h-[500px]" viewBox="0 0 100 100">
                    {/* Forma del estado de Tlaxcala */}
                    <path
                      d="M 20,25 L 80,20 L 85,35 L 90,55 L 75,70 L 55,75 L 35,72 L 25,65 L 15,50 Z"
                      fill="#E0E0E0"
                      stroke="#9E9E9E"
                      strokeWidth="0.3"
                    />
                    
                    {/* Municipios como círculos interactivos */}
                    {municipiosTlaxcala.map((municipio) => {
                      const isSelected = municipioSeleccionado === municipio.name;
                      const isHovered = hoveredMunicipio === municipio.name;
                      const size = isSelected ? 6 : isHovered ? 5 : 4;
                      
                      return (
                        <Tooltip key={municipio.id}>
                          <TooltipTrigger asChild>
                            <g
                              onMouseEnter={() => setHoveredMunicipio(municipio.name)}
                              onMouseLeave={() => setHoveredMunicipio(null)}
                              onClick={() => setMunicipioSeleccionado(municipio.name)}
                              className="cursor-pointer"
                            >
                              <circle
                                cx={municipio.x}
                                cy={municipio.y}
                                r={size}
                                fill={isSelected ? '#582672' : getColorIntensity(municipio.cantidad)}
                                stroke={isSelected ? '#fff' : isHovered ? '#582672' : '#fff'}
                                strokeWidth={isSelected ? '1.5' : isHovered ? '1' : '0.5'}
                                style={{
                                  filter: isSelected || isHovered ? 'drop-shadow(0 4px 8px rgba(88, 38, 114, 0.5))' : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
                                  transition: 'all 0.3s ease',
                                }}
                              />
                              {(isSelected || isHovered) && (
                                <text
                                  x={municipio.x}
                                  y={municipio.y - 8}
                                  textAnchor="middle"
                                  className="text-xs"
                                  fill="#582672"
                                  style={{ fontWeight: 'bold', fontSize: '3px' }}
                                >
                                  {municipio.name}
                                </text>
                              )}
                            </g>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <p style={{ fontWeight: 'bold' }}>{municipio.name}</p>
                              <p className="text-xs mt-1">Compromisos: {municipio.compromisos}</p>
                              <p className="text-xs">Metas: {municipio.metas}</p>
                              <p className="text-xs">Cantidad total: {municipio.cantidad.toLocaleString('es-MX')}</p>
                              <p className="text-xs text-gray-500 mt-1">Click para ver detalle</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </svg>
                </TooltipProvider>

                {/* Leyenda */}
                <div className="mt-6 flex items-center justify-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'rgba(88, 38, 114, 0.3)' }} />
                    <span>Baja actividad</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'rgba(88, 38, 114, 0.6)' }} />
                    <span>Actividad media</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'rgba(88, 38, 114, 1)' }} />
                    <span>Alta actividad</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detalle del municipio seleccionado */}
        {municipioSeleccionado && (
          <>
            {/* Header del municipio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card className="border-2" style={{ borderColor: '#582672' }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#58267220' }}>
                        <MapPin className="w-8 h-8" style={{ color: '#582672' }} />
                      </div>
                      <div>
                        <h2 className="text-2xl mb-1" style={{ color: '#582672', fontWeight: 'bold' }}>
                          {municipioSeleccionado}
                        </h2>
                        <p className="text-sm text-gray-600">
                          {municipioData?.compromisos} compromisos • {municipioData?.metas} metas
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setMunicipioSeleccionado(null)}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Volver al mapa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* KPIs del municipio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
            >
              <Card className="border-2" style={{ borderColor: '#582672' }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">TOTAL ACCIONES</p>
                      <p className="text-3xl" style={{ fontWeight: 'bold', color: '#582672' }}>
                        {totalAcciones}
                      </p>
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
                      <p className="text-sm text-gray-600 mb-1">CANTIDAD TOTAL</p>
                      <p className="text-3xl" style={{ fontWeight: 'bold', color: '#1976D2' }}>
                        {totalCantidad.toLocaleString('es-MX')}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1976D220' }}>
                      <TrendingUp className="w-6 h-6" style={{ color: '#1976D2' }} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2" style={{ borderColor: '#F57C00' }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">UNIDADES MEDIDA</p>
                      <p className="text-3xl" style={{ fontWeight: 'bold', color: '#F57C00' }}>
                        {unidadesUnicas}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F57C0020' }}>
                      <FileText className="w-6 h-6" style={{ color: '#F57C00' }} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2" style={{ borderColor: '#388E3C' }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">DEPENDENCIAS</p>
                      <p className="text-3xl" style={{ fontWeight: 'bold', color: '#388E3C' }}>
                        {dependenciasUnicas}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#388E3C20' }}>
                      <Building2 className="w-6 h-6" style={{ color: '#388E3C' }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Filtros */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                    <Filter className="w-5 h-5" />
                    FILTROS DE DETALLE
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">AÑO</label>
                      <Select value={año} onValueChange={setAño}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos los años</SelectItem>
                          <SelectItem value="2024">2024</SelectItem>
                          <SelectItem value="2025">2025</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-2">UNIDAD DE MEDIDA</label>
                      <Select value={unidadFiltro} onValueChange={setUnidadFiltro}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todas las unidades</SelectItem>
                          {unidadesMedida.map(unidad => (
                            <SelectItem key={unidad} value={unidad}>{unidad}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-2">DEPENDENCIA</label>
                      <Select value={dependenciaFiltro} onValueChange={setDependenciaFiltro}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todas las dependencias</SelectItem>
                          {dependencias.map(dep => (
                            <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      Mostrando <span style={{ fontWeight: 'bold' }}>{detallesFiltrados.length}</span> registros
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAño('todos');
                        setUnidadFiltro('todos');
                        setDependenciaFiltro('todos');
                      }}
                    >
                      Limpiar filtros
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tabla de detalle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#582672', fontWeight: 'bold' }}>
                    <FileText className="w-5 h-5" />
                    DETALLE DE ACCIONES EN {municipioSeleccionado.toUpperCase()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {detallesFiltrados.length > 0 ? (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>UNIDAD DE MEDIDA</TableHead>
                            <TableHead>COMPROMISO</TableHead>
                            <TableHead>META</TableHead>
                            <TableHead>DEPENDENCIA</TableHead>
                            <TableHead className="text-right">CANTIDAD</TableHead>
                            <TableHead className="text-center">AÑO</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {detallesFiltrados.map((item, index) => (
                            <TableRow key={index} className="hover:bg-gray-50">
                              <TableCell>
                                <Badge variant="outline" style={{ borderColor: '#58267250', color: '#582672' }}>
                                  {item.unidadMedida}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <p className="text-sm text-gray-700">{item.compromiso}</p>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm">{item.meta}</span>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Building2 className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-gray-700">{item.dependencia}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <span className="text-lg" style={{ fontWeight: 'bold', color: '#582672' }}>
                                  {item.cantidad.toLocaleString('es-MX')}
                                </span>
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge>{item.año}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                          {/* Fila de total */}
                          <TableRow className="bg-purple-50 border-t-2 border-purple-200">
                            <TableCell colSpan={4} className="text-right">
                              <span style={{ fontWeight: 'bold', color: '#582672' }}>TOTAL ACUMULADO:</span>
                            </TableCell>
                            <TableCell className="text-right">
                              <span className="text-xl" style={{ fontWeight: 'bold', color: '#582672' }}>
                                {totalCantidad.toLocaleString('es-MX')}
                              </span>
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <AlertCircle className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">No se encontraron registros con los filtros seleccionados</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}

        {/* Mensaje inicial si no hay municipio seleccionado */}
        {!municipioSeleccionado && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#58267220' }}>
                  <MapPin className="w-8 h-8" style={{ color: '#582672' }} />
                </div>
                <h3 className="text-xl mb-2" style={{ fontWeight: 'bold', color: '#582672' }}>
                  Selecciona un municipio
                </h3>
                <p className="text-sm text-gray-600">
                  Haz clic en cualquier municipio del mapa para ver el detalle de acciones y compromisos realizados
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
