import { useState } from 'react';
import { CompromisosGeneralModule } from './CompromisosGeneralModule';
import { CompromisoDetailView } from './CompromisoDetailView';
import { CompromisosByDependencyView } from './CompromisosByDependencyView';

interface CompromisosModuleProps {
  onClose: () => void;
  dependencyId?: string;
  dependencyName?: string;
  dependencies: Array<{ id: string; name: string }>;
}

type ViewType = 'general' | 'detalle' | 'por-dependencia';

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

  const handleCompromisoClick = (compromiso: any) => {
    setSelectedCompromiso(compromiso);
    setCurrentView('detalle');
  };

  const handleDependencyClick = (dep: { id: string; name: string }) => {
    setSelectedDependency(dep);
    setCurrentView('por-dependencia');
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

  // Fallback a vista general
  return (
    <CompromisosGeneralModule
      onClose={onClose}
      onCompromisoClick={handleCompromisoClick}
      onDependencyClick={handleDependencyClick}
      dependencies={dependencies}
    />
  );
}
