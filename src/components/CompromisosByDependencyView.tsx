import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Building2,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Filter,
  ChevronRight,
  Loader2,
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
import { compromisosAPI } from '../services/api';

interface CompromisosByDependencyViewProps {
  dependency: { id: string; name: string };
  onClose: () => void;
  onCompromisoClick: (compromiso: any) => void;
}

// Map API data to component format
const mapApiDataToView = (apiData: any[]) => {
  return apiData.map(c => {
    // Map fase to etapa
    let etapa = 'No iniciado';
    if (c.fase === 'cumplido') etapa = 'Cumplido';
    else if (c.fase === 'en_proceso') {
      // Map based on progress for en_proceso
      if (c.porcentaje_avance >= 50) etapa = 'Ejecución';
      else if (c.porcentaje_avance >= 25) etapa = 'Gestión';
      else etapa = 'Planeación';
    } else if (c.fase === 'no_iniciado') etapa = 'No iniciado';

    return {
      id: c.id,
      titulo: c.nombre,
      etapa,
      avance: c.porcentaje_avance,
      rol: 'Responsable Principal', // This dependency is responsible
      categoria: c.categoria || 'General',
      ultimaActualizacion: new Date(c.updated_at).toLocaleDateString('es-MX'),
      _original: c,
    };
  });
};

export function CompromisosByDependencyView({
  dependency,
  onClose,
  onCompromisoClick,
}: CompromisosByDependencyViewProps) {
  const [compromisos, setCompromisos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterEstatus, setFilterEstatus] = useState('todos');
  const [filterRol, setFilterRol] = useState('todos');

  // Fetch compromisos for this dependency
  useEffect(() => {
    const fetchCompromisos = async () => {
      try {
        setLoading(true);
        const result = await compromisosAPI.getByDependency(dependency.id);
        const mappedData = mapApiDataToView(result.compromisos || []);
        setCompromisos(mappedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching compromisos:', err);
        setError('Error al cargar los compromisos');
      } finally {
        setLoading(false);
      }
    };

    fetchCompromisos();
  }, [dependency.id]);

  // Calcular KPIs
  const totalCompromisos = compromisos.length;
  const comoResponsable = compromisos.filter(c => c.rol === 'Responsable Principal').length;
  const comoColaborador = compromisos.filter(c => c.rol === 'Colaborador').length;
  const cumplidos = compromisos.filter(c => c.etapa === 'Cumplido').length;
  const enRiesgo = compromisos.filter(c => c.avance < 34 && c.etapa !== 'No iniciado').length;
  const avancePromedio = compromisos.reduce((acc, c) => acc + c.avance, 0) / totalCompromisos;

  // Filtrar compromisos
  const filteredCompromisos = compromisos.filter(c => {
    const matchEstatus = filterEstatus === 'todos' || c.etapa === filterEstatus;
    const matchRol = filterRol === 'todos' || c.rol === filterRol;
    return matchEstatus && matchRol;
  });

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

  const getSemaforoAvance = (avance: number) => {
    if (avance >= 67) return '#2E7D32';
    if (avance >= 34) return '#F9A825';
    return '#D32F2F';
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto" style={{ color: '#582672' }} />
          <p className="mt-4 text-gray-600">Cargando compromisos...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 mx-auto text-red-500" />
          <p className="mt-4 text-gray-600">{error}</p>
          <Button onClick={onClose} className="mt-4">
            Volver
          </Button>
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
                <h1 className="text-3xl" style={{ color: '#582672', fontWeight: 'bold' }}>
                  Compromisos por Dependencia
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  <Building2 className="w-4 h-4 inline mr-2" />
                  {dependency.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* KPIs de la dependencia */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl mb-4" style={{ color: '#582672', fontWeight: 'bold' }}>
            Indicadores de Desempeño
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#58267215' }}>
                    <Target className="w-6 h-6" style={{ color: '#582672' }} />
                  </div>
                  <Badge variant="outline" className="text-xs">Total</Badge>
                </div>
                <p className="text-3xl mb-1" style={{ fontWeight: 'bold' }}>{totalCompromisos}</p>
                <p className="text-sm text-gray-600">Compromisos asignados</p>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Como responsable:</span>
                    <span style={{ fontWeight: 'bold' }}>{comoResponsable}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>Como colaborador:</span>
                    <span style={{ fontWeight: 'bold' }}>{comoColaborador}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#2E7D3215' }}>
                    <TrendingUp className="w-6 h-6" style={{ color: '#2E7D32' }} />
                  </div>
                  <Badge variant="outline" className="text-xs">Promedio</Badge>
                </div>
                <p className="text-3xl mb-1" style={{ fontWeight: 'bold', color: getSemaforoAvance(avancePromedio) }}>
                  {avancePromedio.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">Avance promedio</p>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${avancePromedio}%`,
                        backgroundColor: getSemaforoAvance(avancePromedio),
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#2E7D3215' }}>
                    <CheckCircle2 className="w-6 h-6" style={{ color: '#2E7D32' }} />
                  </div>
                  <Badge className="text-xs border-0" style={{ backgroundColor: '#2E7D3215', color: '#2E7D32' }}>
                    {((cumplidos / totalCompromisos) * 100).toFixed(0)}%
                  </Badge>
                </div>
                <p className="text-3xl mb-1" style={{ fontWeight: 'bold' }}>{cumplidos}</p>
                <p className="text-sm text-gray-600">Compromisos cumplidos</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#D32F2F15' }}>
                    <AlertTriangle className="w-6 h-6" style={{ color: '#D32F2F' }} />
                  </div>
                  <Badge className="text-xs border-0" style={{ backgroundColor: '#D32F2F15', color: '#D32F2F' }}>
                    Atención
                  </Badge>
                </div>
                <p className="text-3xl mb-1" style={{ fontWeight: 'bold' }}>{enRiesgo}</p>
                <p className="text-sm text-gray-600">Compromisos críticos</p>
                <p className="text-xs text-gray-500 mt-2">
                  Requieren atención prioritaria
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 flex-wrap">
                <Select value={filterEstatus} onValueChange={setFilterEstatus}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filtrar por estatus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estatus</SelectItem>
                    <SelectItem value="No iniciado">No iniciado</SelectItem>
                    <SelectItem value="Planeación">Planeación</SelectItem>
                    <SelectItem value="Gestión">Gestión</SelectItem>
                    <SelectItem value="Ejecución">Ejecución</SelectItem>
                    <SelectItem value="Cumplido">Cumplido</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterRol} onValueChange={setFilterRol}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filtrar por participación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas las participaciones</SelectItem>
                    <SelectItem value="Responsable Principal">Como responsable</SelectItem>
                    <SelectItem value="Colaborador">Como colaborador</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterEstatus('todos');
                    setFilterRol('todos');
                  }}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Limpiar filtros
                </Button>

                <div className="ml-auto">
                  <p className="text-sm text-gray-600">
                    Mostrando <strong>{filteredCompromisos.length}</strong> de <strong>{totalCompromisos}</strong> compromisos
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
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2 className="text-2xl mb-4" style={{ color: '#582672', fontWeight: 'bold' }}>
            Compromisos Asignados
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
                            variant="outline"
                            className={`text-xs ${compromiso.rol === 'Responsable Principal' ? 'border-purple-500 text-purple-700' : ''}`}
                          >
                            {compromiso.rol}
                          </Badge>
                        </div>

                        <h3 className="text-lg mb-2" style={{ fontWeight: 'bold' }}>
                          {compromiso.titulo}
                        </h3>

                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                          <span>Categoría: {compromiso.categoria}</span>
                          <span>Actualizado: {compromiso.ultimaActualizacion}</span>
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
                <strong>Fecha de actualización:</strong> 30 de octubre de 2025
              </p>
              <p className="text-xs text-gray-500">
                Coordinación General de Planeación e Inversión (CGPI) — Gobierno del Estado de Tlaxcala
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
