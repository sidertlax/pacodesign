import { useState } from 'react';
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

interface DashboardUnidadMedidaProps {
  onClose: () => void;
  año: string;
}

// Datos mock
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

const municipiosTlaxcala = [
  'Tlaxcala', 'Apizaco', 'Huamantla', 'Chiautempan', 'Tlaxco',
  'Calpulalpan', 'Zacatelco', 'San Pablo del Monte', 'Papalotla',
  'Contla de Juan Cuamatzi', 'Tetla de la Solidaridad',
];

// Generar datos de compromisos por unidad de medida
const generateDataPorUnidad = () => {
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

  for (let i = 0; i < 100; i++) {
    data.push({
      id: i + 1,
      municipio: municipiosTlaxcala[Math.floor(Math.random() * municipiosTlaxcala.length)],
      dependencia: dependencias[Math.floor(Math.random() * dependencias.length)],
      compromiso: compromisos[Math.floor(Math.random() * compromisos.length)],
      meta: `Meta ${Math.floor(Math.random() * 3) + 1}`,
      unidadMedida: unidadesMedida[Math.floor(Math.random() * unidadesMedida.length)],
      cantidad: Math.floor(Math.random() * 1000) + 50,
      año: 2024 + Math.floor(Math.random() * 2),
    });
  }

  return data;
};

export function CompromisosDashboardUnidadMedida({ onClose, año: añoInicial }: DashboardUnidadMedidaProps) {
  const [dataCompleta] = useState(generateDataPorUnidad());
  const [unidadSeleccionada, setUnidadSeleccionada] = useState<string>('Personas beneficiadas');
  const [año, setAño] = useState(añoInicial || 'todos');
  const [dependenciaFiltro, setDependenciaFiltro] = useState('todos');
  const [municipioFiltro, setMunicipioFiltro] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filtrar datos
  const dataFiltrada = dataCompleta.filter(item => {
    const matchUnidad = item.unidadMedida === unidadSeleccionada;
    const matchAño = año === 'todos' || item.año.toString() === año;
    const matchDependencia = dependenciaFiltro === 'todos' || item.dependencia === dependenciaFiltro;
    const matchMunicipio = municipioFiltro === 'todos' || item.municipio === municipioFiltro;
    const matchSearch = item.compromiso.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.meta.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchUnidad && matchAño && matchDependencia && matchMunicipio && matchSearch;
  });

  // Calcular total acumulado
  const totalAcumulado = dataFiltrada.reduce((sum, item) => sum + item.cantidad, 0);

  // Paginación
  const totalPages = Math.ceil(dataFiltrada.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const dataPaginada = dataFiltrada.slice(startIndex, endIndex);

  // Calcular estadísticas
  const municipiosUnicos = new Set(dataFiltrada.map(d => d.municipio)).size;
  const dependenciasUnicas = new Set(dataFiltrada.map(d => d.dependencia)).size;
  const compromisosUnicos = new Set(dataFiltrada.map(d => d.compromiso)).size;

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
                  Análisis de acciones por tipo de indicador y distribución municipal
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
                    {municipiosUnicos}
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
              </div>

              {/* Filtros secundarios */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                      {dependencias.map(dep => (
                        <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">MUNICIPIO</label>
                  <Select value={municipioFiltro} onValueChange={(value) => { setMunicipioFiltro(value); setCurrentPage(1); }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los municipios</SelectItem>
                      {municipiosTlaxcala.map(mun => (
                        <SelectItem key={mun} value={mun}>{mun}</SelectItem>
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
                    setMunicipioFiltro('todos');
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
                RESULTADOS POR MUNICIPIO
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dataFiltrada.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>MUNICIPIO</TableHead>
                        <TableHead>DEPENDENCIA</TableHead>
                        <TableHead>COMPROMISO</TableHead>
                        <TableHead>META</TableHead>
                        <TableHead className="text-right">CANTIDAD</TableHead>
                        <TableHead className="text-center">AÑO</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dataPaginada.map((item, index) => (
                        <TableRow key={index} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span style={{ fontWeight: 'bold', color: '#374151' }}>{item.municipio}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-700">{item.dependencia}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-gray-700">{item.compromiso}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" style={{ borderColor: '#58267250', color: '#582672' }}>
                              {item.meta}
                            </Badge>
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
                            {totalAcumulado.toLocaleString('es-MX')}
                          </span>
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

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
      </div>
    </div>
  );
}
