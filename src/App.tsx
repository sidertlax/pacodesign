import { useState, useEffect } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { MagicLinkSignIn } from "./components/MagicLinkSignIn";
import { EnlaceView } from "./components/EnlaceView";
import { Header } from "./components/Header";
import { FilterPanel } from "./components/FilterPanel";
import { DependencyTable } from "./components/DependencyTable";
import { ModuleCard } from "./components/ModuleCard";
import { DependencyDetail } from "./components/DependencyDetail";
import { GastoModule } from "./components/GastoModule";
import { IndicadoresGeneralModule } from "./components/IndicadoresGeneralModule";
import { IndicadoresModule } from "./components/IndicadoresModule";
import { CompromisosModule } from "./components/CompromisosModule";
import { NormatividadModule } from "./components/NormatividadModule";
import { AdminObraPublicaModule } from "./components/AdminObraPublicaModule";
import {
  DollarSign,
  TrendingUp,
  FileCheck,
  Scale,
  HardHat,
} from "lucide-react";
import { dependenciesAPI, indicadoresAPI, compromisosAPI } from "./services/api";

// Mock data for 60 dependencies
const generateDependencies = () => {
  const dependencyNames = [
    "Secretaría General",
    "Secretaría de Planeación y Finanzas",
    "Secretaría de Educación Pública",
    "Secretaría de Salud",
    "Secretaría de Obras Públicas, Desarrollo Urbano y Vivienda",
    "Secretaría de Desarrollo Económico",
    "Secretaría de Turismo",
    "Secretaría de Bienestar",
    "Secretaría de Desarrollo Agrario, Territorial y Urbano",
    "Secretaría del Medio Ambiente y Recursos Naturales",
    "Oficialía Mayor",
    "Coordinación de Radio, Cine y Televisión",
    "Coordinación General de Comunicación Social",
    "Coordinación General de Ecología",
    "Coordinación de Archivos",
    "Instituto Tlaxcalteca de Desarrollo Municipal",
    "Instituto Tlaxcalteca de la Cultura",
    "Instituto del Deporte de Tlaxcala",
    "Instituto Tlaxcalteca de la Juventud",
    "Sistema Estatal para el Desarrollo Integral de la Familia",
    "Procuraduría General de Justicia",
    "Instituto de Acceso a la Información Pública",
    "Comisión Estatal de Derechos Humanos",
    "Tribunal de Justicia Administrativa",
    "Contraloría del Ejecutivo",
    "Coordinación General de Asuntos Jurídicos",
    "Sistema de Agua Potable y Alcantarillado",
    "Junta de Agua Potable y Alcantarillado de Tlaxcala",
    "Comisión Estatal de Infraestructura",
    "Instituto Tlaxcalteca de Asistencia Especializada",
    "Colegio de Educación Profesional Técnica",
    "Colegio de Bachilleres del Estado",
    "Universidad Politécnica de Tlaxcala",
    "Universidad Tecnológica de Tlaxcala",
    "Instituto Tecnológico Superior de Tlaxcala",
    "Centro de Educación Continua",
    "Instituto de Capacitación para el Trabajo",
    "Consejo Estatal de Población",
    "Secretaría de Seguridad Ciudadana",
    "Fiscalía General del Estado",
    "Centro de Control de Confianza",
    "Academia de Seguridad Pública",
    "Sistema de Transporte Público",
    "Junta Local de Conciliación y Arbitraje",
    "Instituto de la Función Registral",
    "Servicios de Salud del Estado",
    "Hospital de la Mujer",
    "Hospital General de Tlaxcala",
    "Instituto Estatal de Alfabetización",
    "Patronato del Centro de Readaptación Social",
    "Fideicomiso Fondo de Pensiones",
    "Comité de Planeación para el Desarrollo",
    "Consejo de Ciencia y Tecnología",
    "Promotora de Desarrollo Rural",
    "Fondo de Garantía y Fomento",
    "Instituto de Servicio Civil",
    "Comisión Estatal del Agua",
    "Consejo Regulador del Transporte",
    "Instituto Electoral de Tlaxcala",
    "Defensoría Pública",
  ];

  return dependencyNames.map((name, index) => {
    // Create variety in status distribution
    // ~30% "En tiempo y forma" (>80%), ~40% "Trabajando" (60-80%), ~30% "Necesita atención" (<60%)
    let baseRange;
    const statusType = index % 10; // Create patterns for variety

    if (statusType < 3) {
      // "En tiempo y forma" - 80-95%
      baseRange = { min: 80, range: 15 };
    } else if (statusType < 7) {
      // "Trabajando" - 60-80%
      baseRange = { min: 60, range: 20 };
    } else {
      // "Necesita atención" - 35-60%
      baseRange = { min: 35, range: 25 };
    }

    return {
      id: `dep-${index}`,
      name,
      modules: {
        gasto:
          Math.random() * baseRange.range +
          baseRange.min +
          (Math.random() * 10 - 5),
        indicadores:
          Math.random() * baseRange.range +
          baseRange.min +
          (Math.random() * 10 - 5),
        compromisos:
          Math.random() * baseRange.range +
          baseRange.min +
          (Math.random() * 10 - 5),
        normatividad:
          Math.random() * baseRange.range +
          baseRange.min +
          (Math.random() * 10 - 5),
      },
    };
  });
};

// Fetch real dependencies from API (replaced mock generator)
// const dependencies = generateDependencies();

// Función para generar datos de detalle de dependencia
const generateDependencyDetail = (
  depId: string,
  depName: string,
) => {
  const baseAmount = 1000000 + Math.random() * 50000000; // 1M - 51M
  const aprobado = baseAmount;
  const modificado = aprobado * (0.95 + Math.random() * 0.15); // 95% - 110% del aprobado
  const pagado = modificado * (0.65 + Math.random() * 0.3); // 65% - 95% del modificado

  return {
    dependencia_nombre: depName,
    avance_porcentual: (pagado / modificado) * 100,
    presupuesto_aprobado: aprobado,
    presupuesto_modificado: modificado,
    presupuesto_pagado: pagado,
    indicadores: [
      {
        eje: "ADM - 1. PRESUPUESTO BASADO EN RESULTADOS EVALUACIÓN Y SEGUIMIENTO",
        aprobado: 75 + Math.random() * 20,
        modificado: 70 + Math.random() * 20,
        pagado: 65 + Math.random() * 20,
      },
      {
        eje: "PED - 1. EJECUCIÓN DE OBRAS DE INFRAESTRUCTURA EDUCATIVA",
        aprobado: 85 + Math.random() * 15,
        modificado: 80 + Math.random() * 15,
        pagado: 75 + Math.random() * 15,
      },
      {
        eje: "PED - 1. EJECUCIÓN DE OBRAS DE INFRAESTRUCTURA VIAL Y URBANA",
        aprobado: 90 + Math.random() * 10,
        modificado: 85 + Math.random() * 10,
        pagado: 80 + Math.random() * 10,
      },
      {
        eje: "PED - 1. EJECUCIÓN DE OBRAS Y SERVICIOS DE IMPACTO SOCIAL",
        aprobado: 80 + Math.random() * 15,
        modificado: 75 + Math.random() * 15,
        pagado: 70 + Math.random() * 15,
      },
    ],
    fecha_actualizacion: new Date().toLocaleDateString(
      "es-MX",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    ),
  };
};

export default function App() {
  // Estados de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showMagicLink, setShowMagicLink] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    username: string;
    userType: "admin" | "enlace";
  } | null>(null);

  const [selectedModules, setSelectedModules] = useState({
    gasto: true,
    indicadores: true,
    compromisos: true,
    normatividad: true,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDependency, setSelectedDependency] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Real dependencies from API
  const [dependencies, setDependencies] = useState<any[]>([]);
  const [loadingDependencies, setLoadingDependencies] = useState(true);

  // Fetch real dependencies on mount
  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        setLoadingDependencies(true);
        const response = await dependenciesAPI.getAll();

        // Fetch statistics for each dependency in parallel
        const currentYear = new Date().getFullYear();
        const currentQuarter = 4; // Default to Q4

        const depsWithStats = await Promise.all(
          response.dependencies.map(async (dep: any) => {
            try {
              // Fetch statistics for Indicadores and Compromisos in parallel
              const [indicadoresStats, compromisosStats] = await Promise.all([
                indicadoresAPI.getStatistics(dep.id, currentYear, currentQuarter).catch(() => ({ statistics: { percentage: 0 } })),
                compromisosAPI.getStatistics(dep.id).catch(() => ({ statistics: { percentage: 0 } }))
              ]);

              // Ensure percentages are valid numbers
              const indicadoresPercent = indicadoresStats?.statistics?.percentage || 0;
              const compromisosPercent = compromisosStats?.statistics?.percentage || 0;

              // Debug logging
              console.log(`Stats for ${dep.name}:`, {
                indicadores: indicadoresPercent,
                compromisos: compromisosPercent
              });

              return {
                id: dep.id,
                name: dep.name,
                modules: {
                  gasto: Math.floor(Math.random() * 30) + 70, // Still mock - no gasto statistics endpoint yet
                  indicadores: isNaN(indicadoresPercent) ? 0 : Math.min(100, Math.max(0, indicadoresPercent)),
                  compromisos: isNaN(compromisosPercent) ? 0 : Math.min(100, Math.max(0, compromisosPercent)),
                  normatividad: Math.floor(Math.random() * 30) + 70, // Still mock
                }
              };
            } catch (error) {
              console.error(`Error fetching stats for ${dep.name}:`, error);
              // Fallback to mock data for this dependency
              return {
                id: dep.id,
                name: dep.name,
                modules: {
                  gasto: Math.floor(Math.random() * 30) + 70,
                  indicadores: Math.floor(Math.random() * 30) + 70,
                  compromisos: Math.floor(Math.random() * 30) + 70,
                  normatividad: Math.floor(Math.random() * 30) + 70,
                }
              };
            }
          })
        );

        setDependencies(depsWithStats);
      } catch (error) {
        console.error('Error fetching dependencies:', error);
        // Fallback to mock data if API fails
        setDependencies(generateDependencies());
      } finally {
        setLoadingDependencies(false);
      }
    };
    fetchDependencies();
  }, []);
  const [currentView, setCurrentView] = useState<
    | "dashboard"
    | "gasto"
    | "indicadores"
    | "compromisos"
    | "normatividad"
    | "obra"
  >("dashboard");
  const [moduleViewDependency, setModuleViewDependency] =
    useState<{ id: string; name: string } | null>(null);

  const handleModuleToggle = (
    module: string,
    checked: boolean,
  ) => {
    setSelectedModules((prev) => ({
      ...prev,
      [module]: checked,
    }));
  };

  const handleResetFilters = () => {
    setSelectedModules({
      gasto: true,
      indicadores: true,
      compromisos: true,
      normatividad: true,
    });
    setSearchTerm("");
  };

  const handleLogin = (
    username: string,
    userType: "admin" | "enlace",
  ) => {
    setCurrentUser({ username, userType });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    // Reset all views to default
    setCurrentView("dashboard");
    setSelectedDependency(null);
    setModuleViewDependency(null);
  };

  const modules = [
    {
      title: "Gasto",
      description:
        "Seguimiento y control del ejercicio presupuestal de las dependencias",
      icon: DollarSign,
      color: "#8b5cf6",
      view: "gasto" as const,
    },
    {
      title: "Indicadores de Desempeño",
      description:
        "Evaluación de metas y resultados de los programas presupuestarios",
      icon: TrendingUp,
      color: "#06b6d4",
      view: "indicadores" as const,
    },
    {
      title: "MeG",
      description:
        "Monitoreo Estratégico Gubernamental donde se puede dar seguimiento de compromisos y políticas",
      icon: FileCheck,
      color: "#f59e0b",
      view: "compromisos" as const,
    },
    {
      title: "Normatividad",
      description:
        "Cumplimiento de disposiciones normativas y marco legal aplicable",
      icon: Scale,
      color: "#84cc16",
      view: "normatividad" as const,
    },
    {
      title: "ObraEvalúa",
      description:
        "Evaluación Integral del Desempeño e Infraestructura con Resultados",
      icon: HardHat,
      color: "#582672",
      view: "obra" as const,
    },
  ];

  // Si no está autenticado, mostrar LoginScreen
  if (!isAuthenticated) {
    // Si está en la vista de Magic Link
    if (showMagicLink) {
      return (
        <MagicLinkSignIn
          onBackToLogin={() => setShowMagicLink(false)}
        />
      );
    }
    
    // Mostrar LoginScreen por defecto
    return (
      <LoginScreen
        onLogin={handleLogin}
        onShowMagicLink={() => setShowMagicLink(true)}
      />
    );
  }

  // Si es usuario enlace, mostrar su vista específica
  if (currentUser?.userType === "enlace") {
    return (
      <EnlaceView
        username={currentUser.username}
        onLogout={handleLogout}
      />
    );
  }

  // Si hay una dependencia seleccionada, mostrar su detalle
  if (selectedDependency && currentView === "dashboard") {
    // Wait for dependencies to load before showing detail
    if (loadingDependencies || dependencies.length === 0) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando detalles...</p>
          </div>
        </div>
      );
    }

    // Encontrar la dependencia para obtener los datos de módulos
    const dependency = dependencies.find(
      (d) => d.id === selectedDependency.id,
    );

    // If dependency not found, show error and go back
    if (!dependency) {
      console.error('Dependency not found:', selectedDependency.id);
      setTimeout(() => setSelectedDependency(null), 0);
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: Dependencia no encontrada</p>
            <button
              onClick={() => setSelectedDependency(null)}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      );
    }

    const detailData = generateDependencyDetail(
      selectedDependency.id,
      selectedDependency.name,
    );

    return (
      <DependencyDetail
        {...detailData}
        dependencyId={selectedDependency.id}
        modules={dependency.modules}
        onClose={() => setSelectedDependency(null)}
        onModuleClick={(module) => {
          setModuleViewDependency(selectedDependency);
          setCurrentView(module as any);
        }}
      />
    );
  }

  // Si está en la vista del Módulo de Gasto
  if (currentView === "gasto") {
    return (
      <GastoModule
        onClose={() => {
          setCurrentView("dashboard");
          setModuleViewDependency(null);
        }}
        onDependencyClick={(dep) => setSelectedDependency(dep)}
        dependencies={dependencies}
      />
    );
  }

  // Si está en la vista del Módulo de Indicadores
  if (currentView === "indicadores") {
    // Si viene desde una dependencia específica, mostrar vista detallada
    if (moduleViewDependency) {
      return (
        <IndicadoresModule
          onClose={() => {
            // Si venía desde DependencyDetail, volver a dashboard y restaurar la dependencia seleccionada
            // Si venía desde IndicadoresGeneralModule, solo limpiar moduleViewDependency para volver a la vista general
            setModuleViewDependency(null);
          }}
          dependencyId={moduleViewDependency.id}
          dependencyName={moduleViewDependency.name}
        />
      );
    }

    // Si no, mostrar vista general estatal
    return (
      <IndicadoresGeneralModule
        onClose={() => {
          setCurrentView("dashboard");
        }}
        onDependencyClick={(dep) => {
          setModuleViewDependency(dep);
        }}
        dependencies={dependencies}
      />
    );
  }

  // Si está en la vista del Módulo de Compromisos
  if (currentView === "compromisos") {
    return (
      <CompromisosModule
        onClose={() => {
          if (moduleViewDependency) {
            setSelectedDependency(moduleViewDependency);
            setModuleViewDependency(null);
          }
          setCurrentView("dashboard");
        }}
        dependencyId={moduleViewDependency?.id}
        dependencyName={moduleViewDependency?.name}
        dependencies={dependencies}
      />
    );
  }

  // Si está en la vista del Módulo de Normatividad
  if (currentView === "normatividad") {
    const targetDep = moduleViewDependency || dependencies[0];
    return (
      <NormatividadModule
        onClose={() => {
          if (moduleViewDependency) {
            setSelectedDependency(moduleViewDependency);
            setModuleViewDependency(null);
          }
          setCurrentView("dashboard");
        }}
        dependencyId={targetDep.id}
        dependencyName={targetDep.name}
      />
    );
  }

  // Si está en la vista del Módulo de Obra Pública
  if (currentView === "obra") {
    return (
      <AdminObraPublicaModule
        onBack={() => {
          if (moduleViewDependency) {
            setSelectedDependency(moduleViewDependency);
            setModuleViewDependency(null);
          }
          setCurrentView("dashboard");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        username={currentUser?.username}
        onLogout={handleLogout}
      />

      <main className="container mx-auto px-6 py-8">
        {/* Module Cards */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {modules.map((module, index) => (
              <ModuleCard
                key={index}
                title={module.title}
                description={module.description}
                icon={module.icon}
                color={module.color}
                onClick={() => setCurrentView(module.view)}
              />
            ))}
          </div>
        </div>

        {/* Filter and Dependencies Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <FilterPanel
              onDependencyChange={(value) =>
                console.log("Dependency:", value)
              }
              onModuleToggle={handleModuleToggle}
              onSearchChange={setSearchTerm}
              selectedModules={selectedModules}
              onResetFilters={handleResetFilters}
            />
          </div>
          <div className="lg:col-span-3">
            {loadingDependencies ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando dependencias y estadísticas...</p>
              </div>
            ) : (
              <DependencyTable
                dependencies={dependencies}
                searchTerm={searchTerm}
                selectedModules={selectedModules}
                onDependencyClick={(dep) =>
                  setSelectedDependency({
                    id: dep.id,
                    name: dep.name,
                  })
                }
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-sm text-gray-600">
                Coordinación General de Planeación e Inversión
                (CGPI)
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Gobierno del Estado de Tlaxcala • Sistema de
                Información del Desempeño para Resultados
              </p>
            </div>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} Estado de Tlaxcala
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}