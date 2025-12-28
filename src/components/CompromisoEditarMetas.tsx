import { useState } from 'react';
import {
  Plus,
  Trash2,
  Save,
  Target,
  MapPin,
  AlertCircle,
  Check,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
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
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner@2.0.3';

interface CoberturaM municipal {
  id: string;
  municipio: string;
  cantidad: number;
  año: number;
}

interface Meta {
  id: string;
  nombre: string;
  unidadMedida: string;
  valorNumerico: number;
  coberturaEstatal: boolean;
  coberturaMunicipal: CoberturaMunicipal[];
}

interface CompromisoEditarMetasProps {
  compromisoId: string;
  compromisoNombre: string;
  metasIniciales?: Meta[];
  onGuardar: (metas: Meta[]) => void;
  onCancelar: () => void;
}

const unidadesMedidaDisponibles = [
  'Personas beneficiadas',
  'Obras entregadas',
  'Servicios implementados',
  'Equipamientos realizados',
  'Capacitaciones impartidas',
  'Apoyos entregados',
  'Kilómetros construidos',
  'Hectáreas reforestadas',
  'Familias atendidas',
  'Eventos realizados',
];

const municipiosTlaxcala = [
  'Tlaxcala', 'Apizaco', 'Huamantla', 'Chiautempan', 'Tlaxco',
  'Calpulalpan', 'Zacatelco', 'San Pablo del Monte', 'Papalotla',
  'Contla de Juan Cuamatzi', 'Tetla de la Solidaridad', 'Teolocholco',
  'Apetatitlán', 'Ixtacuixtla', 'Xaloztoc', 'Cuaxomulco',
];

export function CompromisoEditarMetas({
  compromisoId,
  compromisoNombre,
  metasIniciales = [],
  onGuardar,
  onCancelar,
}: CompromisoEditarMetasProps) {
  const [metas, setMetas] = useState<Meta[]>(
    metasIniciales.length > 0
      ? metasIniciales
      : [
          {
            id: '1',
            nombre: '',
            unidadMedida: 'Personas beneficiadas',
            valorNumerico: 0,
            coberturaEstatal: false,
            coberturaMunicipal: [],
          },
        ]
  );

  const [metaExpandida, setMetaExpandida] = useState<string | null>(metas[0]?.id || null);
  const añoActual = new Date().getFullYear();

  // Agregar nueva meta
  const agregarMeta = () => {
    const nuevaMeta: Meta = {
      id: Date.now().toString(),
      nombre: '',
      unidadMedida: 'Personas beneficiadas',
      valorNumerico: 0,
      coberturaEstatal: false,
      coberturaMunicipal: [],
    };
    setMetas([...metas, nuevaMeta]);
    setMetaExpandida(nuevaMeta.id);
  };

  // Eliminar meta
  const eliminarMeta = (metaId: string) => {
    if (metas.length === 1) {
      toast.error('Debe existir al menos una meta');
      return;
    }
    setMetas(metas.filter(m => m.id !== metaId));
    if (metaExpandida === metaId) {
      setMetaExpandida(metas[0]?.id || null);
    }
  };

  // Actualizar meta
  const actualizarMeta = (metaId: string, campo: keyof Meta, valor: any) => {
    setMetas(metas.map(meta => {
      if (meta.id === metaId) {
        // Si cambia a cobertura estatal, limpiar cobertura municipal
        if (campo === 'coberturaEstatal' && valor === true) {
          return { ...meta, [campo]: valor, coberturaMunicipal: [] };
        }
        return { ...meta, [campo]: valor };
      }
      return meta;
    }));
  };

  // Agregar cobertura municipal
  const agregarCoberturaMunicipal = (metaId: string) => {
    setMetas(metas.map(meta => {
      if (meta.id === metaId) {
        const nuevaCobertura: CoberturaMunicipal = {
          id: Date.now().toString(),
          municipio: municipiosTlaxcala[0],
          cantidad: 0,
          año: añoActual,
        };
        return {
          ...meta,
          coberturaMunicipal: [...meta.coberturaMunicipal, nuevaCobertura],
        };
      }
      return meta;
    }));
  };

  // Eliminar cobertura municipal
  const eliminarCoberturaMunicipal = (metaId: string, coberturaId: string) => {
    setMetas(metas.map(meta => {
      if (meta.id === metaId) {
        return {
          ...meta,
          coberturaMunicipal: meta.coberturaMunicipal.filter(c => c.id !== coberturaId),
        };
      }
      return meta;
    }));
  };

  // Actualizar cobertura municipal
  const actualizarCoberturaMunicipal = (
    metaId: string,
    coberturaId: string,
    campo: keyof CoberturaMunicipal,
    valor: any
  ) => {
    setMetas(metas.map(meta => {
      if (meta.id === metaId) {
        return {
          ...meta,
          coberturaMunicipal: meta.coberturaMunicipal.map(cob => {
            if (cob.id === coberturaId) {
              return { ...cob, [campo]: valor };
            }
            return cob;
          }),
        };
      }
      return meta;
    }));
  };

  // Validar antes de guardar
  const validarYGuardar = () => {
    // Validar que todas las metas tengan nombre
    const metasSinNombre = metas.filter(m => !m.nombre.trim());
    if (metasSinNombre.length > 0) {
      toast.error('Todas las metas deben tener un nombre');
      return;
    }

    // Validar que las metas no estatales tengan al menos una cobertura municipal
    const metasSinCobertura = metas.filter(m => !m.coberturaEstatal && m.coberturaMunicipal.length === 0);
    if (metasSinCobertura.length > 0) {
      toast.error('Las metas no estatales deben tener al menos una cobertura municipal');
      return;
    }

    toast.success('Metas guardadas correctamente');
    onGuardar(metas);
  };

  // Calcular total por meta
  const calcularTotalMeta = (meta: Meta) => {
    if (meta.coberturaEstatal) {
      return meta.valorNumerico;
    }
    return meta.coberturaMunicipal.reduce((sum, cob) => sum + cob.cantidad, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2" style={{ borderColor: '#582672' }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl mb-1" style={{ color: '#582672', fontWeight: 'bold' }}>
                Editar Metas del Compromiso
              </h2>
              <p className="text-sm text-gray-600">{compromisoNombre}</p>
              <Badge variant="outline" className="mt-2">
                {compromisoId}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onCancelar}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={validarYGuardar} style={{ backgroundColor: '#84cc16' }}>
                <Save className="w-4 h-4 mr-2" />
                Guardar Metas
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert informativo */}
      <Alert className="border-blue-300 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          Define las metas del compromiso y su cobertura por municipio. Si la meta es de cobertura estatal,
          marca la casilla correspondiente. De lo contrario, agrega la distribución por municipio.
        </AlertDescription>
      </Alert>

      {/* Lista de metas */}
      <div className="space-y-4">
        {metas.map((meta, index) => {
          const isExpanded = metaExpandida === meta.id;
          const totalMeta = calcularTotalMeta(meta);
          const estaCompleta = meta.nombre.trim() && (meta.coberturaEstatal || meta.coberturaMunicipal.length > 0);

          return (
            <motion.div
              key={meta.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`border-2 ${estaCompleta ? 'border-green-200' : 'border-orange-200'}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <Badge style={{ backgroundColor: '#582672', color: 'white' }}>
                        Meta {index + 1}
                      </Badge>
                      
                      {estaCompleta ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                      )}

                      <div className="flex-1">
                        <Input
                          placeholder="Nombre de la meta (ej: Familias beneficiadas con programa social)"
                          value={meta.nombre}
                          onChange={(e) => actualizarMeta(meta.id, 'nombre', e.target.value)}
                          className={!meta.nombre.trim() ? 'border-red-300' : ''}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setMetaExpandida(isExpanded ? null : meta.id)}
                      >
                        {isExpanded ? 'Contraer' : 'Expandir'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => eliminarMeta(meta.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="space-y-6">
                    {/* Configuración básica */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm mb-2 block">UNIDAD DE MEDIDA *</Label>
                        <Select
                          value={meta.unidadMedida}
                          onValueChange={(value) => actualizarMeta(meta.id, 'unidadMedida', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {unidadesMedidaDisponibles.map(unidad => (
                              <SelectItem key={unidad} value={unidad}>{unidad}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {meta.coberturaEstatal && (
                        <div>
                          <Label className="text-sm mb-2 block">VALOR NUMÉRICO *</Label>
                          <Input
                            type="number"
                            min="0"
                            value={meta.valorNumerico}
                            onChange={(e) => actualizarMeta(meta.id, 'valorNumerico', parseInt(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                      )}
                    </div>

                    {/* Checkbox de cobertura estatal */}
                    <div className="flex items-center space-x-2 p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <Checkbox
                        id={`cobertura-estatal-${meta.id}`}
                        checked={meta.coberturaEstatal}
                        onCheckedChange={(checked) => actualizarMeta(meta.id, 'coberturaEstatal', checked)}
                      />
                      <label
                        htmlFor={`cobertura-estatal-${meta.id}`}
                        className="text-sm cursor-pointer"
                        style={{ fontWeight: 'bold', color: '#582672' }}
                      >
                        Esta meta tiene cobertura estatal (sin desglose municipal)
                      </label>
                    </div>

                    {/* Cobertura Municipal */}
                    {!meta.coberturaEstatal && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <Label className="text-sm" style={{ fontWeight: 'bold', color: '#374151' }}>
                            COBERTURA POR MUNICIPIO *
                          </Label>
                          <Button
                            size="sm"
                            onClick={() => agregarCoberturaMunicipal(meta.id)}
                            style={{ backgroundColor: '#1976D2' }}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Agregar Municipio
                          </Button>
                        </div>

                        {meta.coberturaMunicipal.length > 0 ? (
                          <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>MUNICIPIO</TableHead>
                                  <TableHead>CANTIDAD</TableHead>
                                  <TableHead>AÑO</TableHead>
                                  <TableHead className="w-[100px]"></TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {meta.coberturaMunicipal.map((cobertura) => (
                                  <TableRow key={cobertura.id}>
                                    <TableCell>
                                      <Select
                                        value={cobertura.municipio}
                                        onValueChange={(value) =>
                                          actualizarCoberturaMunicipal(meta.id, cobertura.id, 'municipio', value)
                                        }
                                      >
                                        <SelectTrigger className="w-full">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {municipiosTlaxcala.map(mun => (
                                            <SelectItem key={mun} value={mun}>{mun}</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        type="number"
                                        min="0"
                                        value={cobertura.cantidad}
                                        onChange={(e) =>
                                          actualizarCoberturaMunicipal(
                                            meta.id,
                                            cobertura.id,
                                            'cantidad',
                                            parseInt(e.target.value) || 0
                                          )
                                        }
                                        placeholder="0"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Select
                                        value={cobertura.año.toString()}
                                        onValueChange={(value) =>
                                          actualizarCoberturaMunicipal(meta.id, cobertura.id, 'año', parseInt(value))
                                        }
                                      >
                                        <SelectTrigger className="w-[120px]">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {[añoActual - 1, añoActual, añoActual + 1].map(año => (
                                            <SelectItem key={año} value={año.toString()}>{año}</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </TableCell>
                                    <TableCell>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => eliminarCoberturaMunicipal(meta.id, cobertura.id)}
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}

                                {/* Fila de total */}
                                <TableRow className="bg-purple-50 border-t-2 border-purple-200">
                                  <TableCell>
                                    <span style={{ fontWeight: 'bold', color: '#582672' }}>TOTAL:</span>
                                  </TableCell>
                                  <TableCell>
                                    <span className="text-lg" style={{ fontWeight: 'bold', color: '#582672' }}>
                                      {totalMeta.toLocaleString('es-MX')}
                                    </span>
                                  </TableCell>
                                  <TableCell colSpan={2}></TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <Alert className="border-orange-300 bg-orange-50">
                            <AlertCircle className="h-4 w-4 text-orange-600" />
                            <AlertDescription className="text-orange-700">
                              Debe agregar al menos un municipio con su cantidad correspondiente.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}

                    {/* Resumen de la meta */}
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Target className="w-5 h-5 text-gray-500" />
                          <span className="text-sm text-gray-600">Resumen de la meta:</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Total acumulado</p>
                            <p className="text-xl" style={{ fontWeight: 'bold', color: '#582672' }}>
                              {totalMeta.toLocaleString('es-MX')}
                            </p>
                            <p className="text-xs text-gray-500">{meta.unidadMedida}</p>
                          </div>
                          {!meta.coberturaEstatal && (
                            <div className="text-right">
                              <p className="text-xs text-gray-500">Municipios</p>
                              <p className="text-xl" style={{ fontWeight: 'bold', color: '#1976D2' }}>
                                {meta.coberturaMunicipal.length}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Botón para agregar meta */}
      <Button
        variant="outline"
        onClick={agregarMeta}
        className="w-full border-2 border-dashed border-gray-300 hover:border-purple-400 hover:bg-purple-50"
      >
        <Plus className="w-4 h-4 mr-2" />
        Agregar Nueva Meta
      </Button>

      {/* Resumen global */}
      <Card className="border-2" style={{ borderColor: '#582672' }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">RESUMEN DEL COMPROMISO</p>
              <p className="text-lg" style={{ fontWeight: 'bold', color: '#582672' }}>
                {metas.length} meta{metas.length !== 1 ? 's' : ''} definida{metas.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Cobertura total</p>
              <p className="text-lg" style={{ fontWeight: 'bold', color: '#1976D2' }}>
                {new Set(metas.flatMap(m => m.coberturaMunicipal.map(c => c.municipio))).size} municipio(s)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
