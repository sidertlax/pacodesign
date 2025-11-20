import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { MultiSegmentProgress } from './MultiSegmentProgress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { Building2, User, Phone, Mail, MapPin, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface Dependency {
  id: string;
  name: string;
  modules: {
    gasto: number;
    indicadores: number;
    compromisos: number;
    normatividad: number;
  };
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

interface DependencyTableProps {
  dependencies: Dependency[];
  searchTerm: string;
  selectedModules: Record<string, boolean>;
  onDependencyClick?: (dep: Dependency) => void;
}

export function DependencyTable({
  dependencies,
  searchTerm,
  selectedModules,
  onDependencyClick,
}: DependencyTableProps) {
  const [sortBy, setSortBy] = useState('relevancia');

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

  const filteredDependencies = dependencies.filter((dep) =>
    dep.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSegments = (modules: Dependency['modules']) => {
    return Object.entries(modules)
      .filter(([key]) => selectedModules[key])
      .map(([key, value]) => ({
        label: moduleLabels[key as keyof typeof moduleLabels],
        value,
        color: moduleColors[key as keyof typeof moduleColors],
      }));
  };

  const calculateAverage = (modules: Dependency['modules']) => {
    const activeModules = Object.entries(modules).filter(([key]) => selectedModules[key]);
    if (activeModules.length === 0) return 0;
    const sum = activeModules.reduce((acc, [, value]) => acc + value, 0);
    return sum / activeModules.length;
  };

  const getStatusColor = (average: number) => {
    if (average >= 80) return '#10b981'; // Green
    if (average >= 60) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const getStatusText = (average: number) => {
    if (average >= 80) return 'En tiempo y forma';
    if (average >= 60) return 'Trabajando';
    return 'Necesita atención';
  };

  // Animated counter component
  const AnimatedCounter = ({ value, delay = 0 }: { value: number; delay?: number }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          setCount((prev) => {
            const increment = value / 50; // Animate over ~50 frames
            const next = prev + increment;
            if (next >= value) {
              clearInterval(interval);
              return value;
            }
            return next;
          });
        }, 20); // 20ms intervals for smooth animation

        return () => clearInterval(interval);
      }, delay);

      return () => clearTimeout(timer);
    }, [value, delay]);

    return <span>{count.toFixed(1)}%</span>;
  };

  // Generate random responsible names
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
    // Use dependency ID to ensure consistent random selection
    const index = parseInt(depId.replace('dep-', '')) % responsibleNames.length;
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
        address: 'Calle Lardizábal y Uribe No. 2, Centro, Tlaxcala de Xicohténcatl, Tlax.'
      },
      {
        name: 'Mtro. José Luis Sánchez Torres',
        position: 'Especialista en Gestión Pública',
        phone: '(246) 465-0100 ext. 1420',
        email: 'jose.sanchez@tlaxcala.gob.mx',
        directBoss: 'Lic. Carmen Delgado Soto - Secretaria de Administración',
        office: 'Oficina 420-A',
        floor: 'Cuarto piso',
        building: 'Secretaría de Administración',
        address: 'Av. Juárez No. 54, Col. Centro, Tlaxcala de Xicohténcatl, Tlax.'
      },
      {
        name: 'Lic. Carmen Elena Vázquez',
        position: 'Analista de Compromisos Gubernamentales',
        phone: '(246) 465-0100 ext. 1380',
        email: 'carmen.vazquez@tlaxcala.gob.mx',
        directBoss: 'Lic. Jorge Alberto Morales - Secretario Particular',
        office: 'Oficina 180-D',
        floor: 'Primer piso',
        building: 'Casa de Gobierno',
        address: 'Plaza de la Constitución No. 1, Centro, Tlaxcala de Xicohténcatl, Tlax.'
      },
      {
        name: 'Ing. Roberto Flores Jiménez',
        position: 'Especialista en Obras Públicas',
        phone: '(246) 465-0100 ext. 1555',
        email: 'roberto.flores@tlaxcala.gob.mx',
        directBoss: 'Arq. Fernando Castro Ruiz - Director de Obras',
        office: 'Oficina 255-B',
        floor: 'Segundo piso',
        building: 'Secretaría de Obras Públicas',
        address: 'Blvd. Revolución No. 8, Col. La Loma, Tlaxcala de Xicohténcatl, Tlax.'
      },
      {
        name: 'Lic. Alejandra Morales Cruz',
        position: 'Coordinadora de Normatividad',
        phone: '(246) 465-0100 ext. 1225',
        email: 'alejandra.morales@tlaxcala.gob.mx',
        directBoss: 'Lic. Patricia Morales Sánchez - Consejera Jurídica',
        office: 'Oficina 225-A',
        floor: 'Segundo piso',
        building: 'Consejería Jurídica',
        address: 'Av. Independencia No. 3, Centro, Tlaxcala de Xicohténcatl, Tlax.'
      },
      {
        name: 'C.P. Fernando Castro Ruiz',
        position: 'Director de Proyectos Estratégicos',
        phone: '(246) 465-0100 ext. 1600',
        email: 'fernando.castro@tlaxcala.gob.mx',
        directBoss: 'Ing. Ricardo López Hernández - Secretario de Desarrollo',
        office: 'Oficina 300-A',
        floor: 'Tercer piso',
        building: 'Torre de Desarrollo Urbano',
        address: 'Periférico Norte No. 1001, Fraccionamiento Los Álamos, Tlaxcala, Tlax.'
      },
      {
        name: 'Lic. Silvia Patricia Ramírez',
        position: 'Coordinadora de Recursos Humanos',
        phone: '(246) 465-0100 ext. 1175',
        email: 'silvia.ramirez@tlaxcala.gob.mx',
        directBoss: 'Lic. Alberto Mendoza García - Director General',
        office: 'Oficina 175-C',
        floor: 'Primer piso',
        building: 'Edificio de Recursos Humanos',
        address: 'Av. Morelos No. 12, Col. Centro, Tlaxcala de Xicohténcatl, Tlax.'
      },
      {
        name: 'Ing. Miguel Ángel Herrera',
        position: 'Jefe de Departamento Técnico',
        phone: '(246) 465-0100 ext. 1340',
        email: 'miguel.herrera@tlaxcala.gob.mx',
        directBoss: 'Ing. Carlos Domínguez Ruiz - Coordinador Técnico',
        office: 'Oficina 340-B',
        floor: 'Tercer piso',
        building: 'Centro de Servicios Técnicos',
        address: 'Calle Hidalgo No. 25, Col. Centro, Tlaxcala de Xicohténcatl, Tlax.'
      },
      {
        name: 'Lic. Gabriela Mendoza Valdez',
        position: 'Analista de Indicadores de Desempeño',
        phone: '(246) 465-0100 ext. 1290',
        email: 'gabriela.mendoza@tlaxcala.gob.mx',
        directBoss: 'Lic. Fernando Soto Martínez - Subdirector',
        office: 'Oficina 290-A',
        floor: 'Segundo piso',
        building: 'Centro de Análisis y Estadística',
        address: 'Av. Universidad No. 1, Col. Adolfo López Mateos, Tlaxcala, Tlax.'
      },
      {
        name: 'Mtro. Juan Carlos Pérez',
        position: 'Coordinador de Planeación Estratégica',
        phone: '(246) 465-0100 ext. 1455',
        email: 'juancarlos.perez@tlaxcala.gob.mx',
        directBoss: 'Dra. María Elena Rodríguez - Directora de Planeación',
        office: 'Oficina 455-D',
        floor: 'Cuarto piso',
        building: 'Instituto de Planeación',
        address: 'Blvd. Mariano Sánchez No. 202, Col. La Loma, Tlaxcala, Tlax.'
      },
      {
        name: 'Lic. Laura Beatriz Aguilar',
        position: 'Especialista en Transparencia y Rendición de Cuentas',
        phone: '(246) 465-0100 ext. 1380',
        email: 'laura.aguilar@tlaxcala.gob.mx',
        directBoss: 'Lic. Ricardo Hernández López - Comisionado',
        office: 'Oficina 380-C',
        floor: 'Tercer piso',
        building: 'Instituto de Acceso a la Información',
        address: 'Av. Constitución No. 33, Centro, Tlaxcala de Xicohténcatl, Tlax.'
      },
      {
        name: 'Ing. Ricardo Domínguez Luna',
        position: 'Director de Infraestructura y Mantenimiento',
        phone: '(246) 465-0100 ext. 1520',
        email: 'ricardo.dominguez@tlaxcala.gob.mx',
        directBoss: 'Arq. José María Castro - Secretario de Obras',
        office: 'Oficina 520-A',
        floor: 'Quinto piso',
        building: 'Torre de Infraestructura',
        address: 'Libramiento Norte Km 1.5, Col. Industrial, Tlaxcala, Tlax.'
      },
      {
        name: 'Dra. Isabel Cristina Vargas',
        position: 'Coordinadora de Evaluación y Seguimiento',
        phone: '(246) 465-0100 ext. 1610',
        email: 'isabel.vargas@tlaxcala.gob.mx',
        directBoss: 'Dr. Antonio Mendoza Ruiz - Secretario de Educación',
        office: 'Oficina 610-B',
        floor: 'Sexto piso',
        building: 'Secretaría de Educación Pública',
        address: 'Av. de los Maestros No. 101, Col. Centro, Tlaxcala de Xicohténcatl, Tlax.'
      }
    ];
    
    const index = parseInt(depId.replace('dep-', '')) % contacts.length;
    return contacts[index];
  };

  // Sort dependencies based on selected option
  const sortedDependencies = [...filteredDependencies].sort((a, b) => {
    if (sortBy === 'mayor-menor') {
      return calculateAverage(b.modules) - calculateAverage(a.modules);
    } else if (sortBy === 'menor-mayor') {
      return calculateAverage(a.modules) - calculateAverage(b.modules);
    }
    // Default: relevancia (original order)
    return 0;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" style={{ color: '#582672' }} />
              Avance por Dependencia
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              {filteredDependencies.length} de {dependencies.length} dependencias
            </p>
          </div>
          <div className="w-64">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevancia">Relevancia</SelectItem>
                <SelectItem value="mayor-menor">De mayor a menor cumplimiento</SelectItem>
                <SelectItem value="menor-mayor">De menor a mayor cumplimiento</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {sortedDependencies.map((dep, index) => {
              const segments = getSegments(dep.modules);
              const average = calculateAverage(dep.modules);

              return (
                <motion.div
                  key={dep.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onClick={() => onDependencyClick?.(dep)}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h4 className="text-xl text-gray-900" style={{ fontWeight: 'bold' }}>{dep.name}</h4>
                        {/* Status badge with underglow */}
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                        >
                          <Badge 
                            className="text-sm transition-all duration-200 border-0 backdrop-blur-sm"
                            style={{ 
                              backgroundColor: `${getStatusColor(average)}15`,
                              color: getStatusColor(average),
                              fontWeight: 'bold'
                            }}
                          >
                            <motion.div 
                              className="w-2.5 h-2.5 rounded-full mr-2" 
                              style={{ 
                                backgroundColor: getStatusColor(average),
                                boxShadow: `0 0 12px ${getStatusColor(average)}90, 0 0 20px ${getStatusColor(average)}50`
                              }}
                              animate={{ 
                                scale: [1, 1.2, 1],
                                opacity: [0.8, 1, 0.8]
                              }}
                              transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                            <span>
                              {getStatusText(average)}
                            </span>
                          </Badge>
                        </motion.div>
                      </div>
                      <span className="text-3xl" style={{ color: '#582672', fontWeight: 'bold' }}>
                        <AnimatedCounter value={average} delay={index * 100 + 500} />
                      </span>
                    </div>
                    
                    {/* Responsible person */}
                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>Vínculo responsable:</span>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <button 
                            className="hover:underline font-medium transition-colors cursor-pointer text-left"
                            style={{ color: '#582672' }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {getRandomResponsible(dep.id)}
                          </button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-96 p-4" side="top">
                          {(() => {
                            const contact = getResponsibleContact(dep.id);
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
                    
                    <MultiSegmentProgress segments={segments} height="12px" delay={index * 0.1 + 0.6} />
                    
                    {/* Module legend with colors and percentages */}
                    <div className="mt-3 flex flex-wrap gap-4 text-sm">
                      {selectedModules.gasto && (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3" style={{ backgroundColor: moduleColors.gasto }} />
                          <span className="text-gray-700">
                            {moduleLabels.gasto}: <span className="font-bold" style={{ fontSize: '1.5em' }}>{dep.modules.gasto.toFixed(1)}%</span>
                          </span>
                        </div>
                      )}
                      {selectedModules.indicadores && (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3" style={{ backgroundColor: moduleColors.indicadores }} />
                          <span className="text-gray-700">
                            {moduleLabels.indicadores}: <span className="font-bold" style={{ fontSize: '1.5em' }}>{dep.modules.indicadores.toFixed(1)}%</span>
                          </span>
                        </div>
                      )}
                      {selectedModules.compromisos && (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3" style={{ backgroundColor: moduleColors.compromisos }} />
                          <span className="text-gray-700">
                            {moduleLabels.compromisos}: <span className="font-bold" style={{ fontSize: '1.5em' }}>{dep.modules.compromisos.toFixed(1)}%</span>
                          </span>
                        </div>
                      )}
                      {selectedModules.normatividad && (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3" style={{ backgroundColor: moduleColors.normatividad }} />
                          <span className="text-gray-700">
                            {moduleLabels.normatividad}: <span className="font-bold" style={{ fontSize: '1.5em' }}>{dep.modules.normatividad.toFixed(1)}%</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}