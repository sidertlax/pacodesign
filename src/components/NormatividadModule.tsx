import { useState } from 'react';
import { ArrowLeft, Scale, Download, Clock, CheckCircle2, AlertTriangle, XCircle, FileText, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Progress } from './ui/progress';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface NormatividadModuleProps {
  onClose: () => void;
  dependencyId: string;
  dependencyName: string;
}

export function NormatividadModule({ onClose, dependencyId, dependencyName }: NormatividadModuleProps) {
  // Generar datos de documentos normativos
  const generateDocumentos = () => {
    return [
      {
        id: 'doc-1',
        nombre: 'Ley Orgánica',
        descripcion: 'Ley Orgánica de la Administración Pública del Estado de Tlaxcala',
        estatus: 'Validado',
        fechaActualizacion: '15 de marzo de 2025',
        fechaValidacion: '20 de marzo de 2025',
        observaciones: 'Documento actualizado conforme a las reformas del periodo 2024-2025',
      },
      {
        id: 'doc-2',
        nombre: 'Organigrama Institucional',
        descripcion: 'Estructura orgánica actualizada de la dependencia',
        estatus: 'Validado',
        fechaActualizacion: '10 de febrero de 2025',
        fechaValidacion: '15 de febrero de 2025',
        observaciones: 'Organigrama alineado con las atribuciones vigentes',
      },
      {
        id: 'doc-3',
        nombre: 'Reglamento Interior',
        descripcion: 'Reglamento Interior de la dependencia',
        estatus: 'En revisión',
        fechaActualizacion: '5 de abril de 2025',
        fechaValidacion: 'Pendiente',
        observaciones: 'En proceso de validación por la Dirección Jurídica',
      },
      {
        id: 'doc-4',
        nombre: 'Manual de Organización',
        descripcion: 'Manual de Organización General de la dependencia',
        estatus: 'Validado',
        fechaActualizacion: '28 de enero de 2025',
        fechaValidacion: '5 de febrero de 2025',
        observaciones: 'Manual actualizado con las nuevas unidades administrativas',
      },
      {
        id: 'doc-5',
        nombre: 'Manual de Procedimientos',
        descripcion: 'Manual de Procedimientos administrativos y operativos',
        estatus: 'Pendiente',
        fechaActualizacion: 'No actualizado',
        fechaValidacion: 'Pendiente',
        observaciones: 'Se requiere actualización urgente conforme a los nuevos lineamientos',
      },
    ];
  };

  const documentos = generateDocumentos();

  // Calcular totales
  const validados = documentos.filter(d => d.estatus === 'Validado').length;
  const enRevision = documentos.filter(d => d.estatus === 'En revisión').length;
  const pendientes = documentos.filter(d => d.estatus === 'Pendiente').length;
  const total = documentos.length;
  
  // Calcular IAN (Indicador de Actualización Normativa)
  const ian_global = (validados / total) * 100;

  // Función para obtener color según estatus
  const getEstatusColor = (estatus: string) => {
    switch (estatus) {
      case 'Validado':
        return '#2E7D32'; // Verde
      case 'En revisión':
        return '#F9A825'; // Amarillo
      case 'Pendiente':
        return '#D32F2F'; // Rojo
      default:
        return '#9E9E9E';
    }
  };

  // Función para obtener icono según estatus
  const getEstatusIcon = (estatus: string) => {
    switch (estatus) {
      case 'Validado':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'En revisión':
        return <AlertTriangle className="w-5 h-5" />;
      case 'Pendiente':
        return <XCircle className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  // Función para obtener color de semáforo según IAN
  const getStatusColor = (percentage: number) => {
    if (percentage >= 80) return '#2E7D32'; // Verde
    if (percentage >= 40) return '#F9A825'; // Amarillo
    return '#D32F2F'; // Rojo
  };

  // Datos para gráfica de pie
  const pieData = [
    { name: 'Validado', value: validados, color: '#2E7D32' },
    { name: 'En revisión', value: enRevision, color: '#F9A825' },
    { name: 'Pendiente', value: pendientes, color: '#D32F2F' },
  ].filter(item => item.value > 0);

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-sm mb-1" style={{ color: data.payload.color }}>
            {data.name}
          </p>
          <p className="text-xs text-gray-600">
            {data.value} documentos ({((data.value / total) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Leyenda personalizada para donut chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        style={{ fontSize: '14px', fontWeight: 'bold' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
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
                  Módulo de Normatividad
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {dependencyName}
                </p>
              </div>
            </div>
            
            {/* Indicador circular de actualización */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Porcentaje de documentos normativos actualizados y validados</p>
                <Badge
                  className="text-lg px-4 py-2 border-0"
                  style={{
                    backgroundColor: `${getStatusColor(ian_global)}15`,
                    color: getStatusColor(ian_global),
                    fontWeight: 'bold',
                  }}
                >
                  <motion.div
                    className="w-2.5 h-2.5 rounded-full mr-2"
                    style={{
                      backgroundColor: getStatusColor(ian_global),
                      boxShadow: `0 0 10px ${getStatusColor(ian_global)}90`,
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
                  IAN: {ian_global.toFixed(1)}%
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Resumen general - Tarjetas de documentos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl mb-4" style={{ color: '#582672', fontWeight: 'bold' }}>
            Documentos Normativos Requeridos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            {documentos.map((doc) => (
              <Card 
                key={doc.id}
                className="hover:shadow-lg transition-shadow"
                style={{
                  borderLeft: `4px solid ${getEstatusColor(doc.estatus)}`,
                }}
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

          {/* Barra de progreso global */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">
                  Avance de actualización normativa ({validados} de {total} documentos validados)
                </p>
                <span className="text-sm" style={{ fontWeight: 'bold', color: getStatusColor(ian_global) }}>
                  {ian_global.toFixed(1)}%
                </span>
              </div>
              <Progress value={ian_global} className="h-3" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Gráfica y tabla */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Gráfica de donut */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl" style={{ color: '#582672', fontWeight: 'bold' }}>
                  Distribución de Estatus
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Proporción de documentos por estatus
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomLabel}
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                {/* Leyenda */}
                <div className="flex flex-col gap-2 mt-4">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-gray-700">{item.name}</span>
                      </div>
                      <span className="text-sm" style={{ fontWeight: 'bold' }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabla de detalle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl" style={{ color: '#582672', fontWeight: 'bold' }}>
                  Detalle de Documentos
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Información detallada de cada documento normativo
                </p>
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
                        <TableHead className="text-center">Verificación</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documentos.map((doc) => (
                        <TableRow 
                          key={doc.id} 
                          className={`hover:bg-gray-50 ${doc.estatus === 'Pendiente' ? 'bg-red-50' : ''}`}
                        >
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{doc.nombre}</p>
                              <p className="text-xs text-gray-500">{doc.descripcion}</p>
                            </div>
                          </TableCell>
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
                          <TableCell className="text-sm">
                            {doc.fechaValidacion}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button 
                              size="sm" 
                              variant="outline"
                              disabled={doc.estatus === 'Pendiente'}
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              Ver PDF
                            </Button>
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

        {/* Tabla de observaciones por documento */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl" style={{ color: '#582672', fontWeight: 'bold' }}>
                Observaciones por Documento
              </CardTitle>
              <p className="text-sm text-gray-600">
                Detalles y comentarios sobre cada documento normativo
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documentos.map((doc) => (
                  <div 
                    key={doc.id}
                    className="p-4 rounded-lg border"
                    style={{ 
                      borderColor: getEstatusColor(doc.estatus),
                      backgroundColor: `${getEstatusColor(doc.estatus)}05`,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${getEstatusColor(doc.estatus)}15` }}
                      >
                        <div style={{ color: getEstatusColor(doc.estatus) }}>
                          {getEstatusIcon(doc.estatus)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm mb-1" style={{ fontWeight: 'bold' }}>
                          {doc.nombre}
                        </p>
                        <p className="text-xs text-gray-600">
                          {doc.observaciones}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
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
                <Scale className="w-6 h-6" />
                Observaciones Generales CGPI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 leading-relaxed mb-2">
                  La dependencia ha cumplido con la actualización de {validados} de {total} documentos normativos requeridos. 
                  {pendientes > 0 && (
                    <span className="text-red-700" style={{ fontWeight: 'bold' }}>
                      {' '}Se requiere atención inmediata en {pendientes} documento(s) pendiente(s) de actualización.
                    </span>
                  )}
                  {enRevision > 0 && (
                    <span> {enRevision} documento(s) se encuentra(n) en proceso de revisión por la Dirección Jurídica.</span>
                  )}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Con base en el Art. 35 de los Lineamientos SIDERTLAX.
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
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
