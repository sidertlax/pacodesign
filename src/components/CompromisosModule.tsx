import { useState } from 'react';
import { CompromisosGeneralModule } from './CompromisosGeneralModule';
import { CompromisoDetailView } from './CompromisoDetailView';
import { CompromisosByDependencyView } from './CompromisosByDependencyView';
import { CompromisosDashboardUnidadMedida } from './CompromisosDashboardUnidadMedida';
import { CompromisosDashboardMunicipio } from './CompromisosDashboardMunicipio';

interface CompromisosModuleProps {
  onClose: () => void;
  dependencyId?: string;
  dependencyName?: string;
  dependencies: Array<{ id: string; name: string }>;
}

type ViewType = 'general' | 'detalle' | 'por-dependencia' | 'dashboard-unidad' | 'dashboard-municipio';

export function CompromisosModule({ 
  onClose, 
  dependencyId, 
  dependencyName,
  dependencies 
}: CompromisosModuleProps) {
  const [currentView, setCurrentView] = useState<ViewType>(
    dependencyId && dependencyName ? 'por-dependencia' : 'general'
  );
  const [selectedCompromiso, setSelectedCompromiso] = useState<any>(null);
  const [selectedDependency, setSelectedDependency] = useState<{ id: string; name: string } | null>(
    dependencyId && dependencyName ? { id: dependencyId, name: dependencyName } : null
  );
  const [añoContexto, setAñoContexto] = useState('todos');

  const handleCompromisoClick = (compromiso: any) => {
    setSelectedCompromiso(compromiso);
    setCurrentView('detalle');
  };

  const handleDependencyClick = (dep: { id: string; name: string }) => {
    setSelectedDependency(dep);
    setCurrentView('por-dependencia');
  };

  const handleDashboardUnidadClick = () => {
    setCurrentView('dashboard-unidad');
  };

  const handleDashboardMunicipioClick = () => {
    setCurrentView('dashboard-municipio');
  };

  const handleBackToGeneral = () => {
    setCurrentView('general');
    setSelectedCompromiso(null);
    setSelectedDependency(null);
  };

  const handleBackFromDetail = () => {
    // Si venimos de una vista de dependencia, volvemos ahí
    if (selectedDependency && currentView === 'detalle') {
      setCurrentView('por-dependencia');
      setSelectedCompromiso(null);
    } else {
      // Si no, volvemos a la vista general
      setCurrentView('general');
      setSelectedCompromiso(null);
    }
  };

  // Vista general de todos los compromisos
  if (currentView === 'general') {
    return (
      <CompromisosGeneralModule
        onClose={onClose}
        onCompromisoClick={handleCompromisoClick}
        onDependencyClick={handleDependencyClick}
        onDashboardUnidadClick={handleDashboardUnidadClick}
        onDashboardMunicipioClick={handleDashboardMunicipioClick}
        dependencies={dependencies}
      />
    );
  }

  // Vista de detalle de un compromiso específico
  if (currentView === 'detalle' && selectedCompromiso) {
    return (
      <CompromisoDetailView
        compromiso={selectedCompromiso}
        onClose={handleBackFromDetail}
      />
    );
  }

  // Vista filtrada por dependencia
  if (currentView === 'por-dependencia' && selectedDependency) {
    return (
      <CompromisosByDependencyView
        dependency={selectedDependency}
        onClose={handleBackToGeneral}
        onCompromisoClick={handleCompromisoClick}
      />
    );
  }

  // Dashboard por Unidad de Medida
  if (currentView === 'dashboard-unidad') {
    return (
      <CompromisosDashboardUnidadMedida
        onClose={handleBackToGeneral}
        año={añoContexto}
      />
    );
  }

  // Dashboard por Municipio
  if (currentView === 'dashboard-municipio') {
    return (
      <CompromisosDashboardMunicipio
        onClose={handleBackToGeneral}
        año={añoContexto}
      />
    );
  }

  // Fallback a vista general
  return (
    <CompromisosGeneralModule
      onClose={onClose}
      onCompromisoClick={handleCompromisoClick}
      onDependencyClick={handleDependencyClick}
      onDashboardUnidadClick={handleDashboardUnidadClick}
      onDashboardMunicipioClick={handleDashboardMunicipioClick}
      dependencies={dependencies}
    />
  );
}