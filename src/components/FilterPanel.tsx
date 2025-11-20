import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Filter, Search, RotateCcw, DollarSign, TrendingUp, FileCheck, Scale } from 'lucide-react';

interface FilterPanelProps {
  onDependencyChange: (value: string) => void;
  onModuleToggle: (module: string, checked: boolean) => void;
  onSearchChange: (value: string) => void;
  selectedModules: Record<string, boolean>;
  onResetFilters?: () => void;
}

export function FilterPanel({
  onDependencyChange,
  onModuleToggle,
  onSearchChange,
  selectedModules,
  onResetFilters,
}: FilterPanelProps) {
  const [searchValue, setSearchValue] = useState('');

  const modules = [
    { id: 'gasto', label: 'Gasto', color: '#8b5cf6', icon: DollarSign },
    { id: 'indicadores', label: 'Indicadores de Desempeño', color: '#06b6d4', icon: TrendingUp },
    { id: 'compromisos', label: 'Compromisos', color: '#f59e0b', icon: FileCheck },
    { id: 'normatividad', label: 'Normatividad', color: '#84cc16', icon: Scale },
  ];

  const handleResetFilters = () => {
    setSearchValue('');
    onSearchChange('');
    onResetFilters?.();
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onSearchChange(value);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" style={{ color: '#582672' }} />
            Filtros
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Restablecer
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Buscar dependencia</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="search"
              placeholder="Escriba el nombre de la dependencia..."
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Selecciona dependencia</Label>
          <Select onValueChange={onDependencyChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todas las dependencias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las dependencias</SelectItem>
              <SelectItem value="secretaria-general">Secretaría General</SelectItem>
              <SelectItem value="secretaria-planeacion">Secretaría de Planeación</SelectItem>
              <SelectItem value="secretaria-finanzas">Secretaría de Finanzas</SelectItem>
              <SelectItem value="secretaria-educacion">Secretaría de Educación</SelectItem>
              <SelectItem value="secretaria-salud">Secretaría de Salud</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Mostrar módulos</Label>
          {modules.map((module) => {
            const IconComponent = module.icon;
            return (
              <div key={module.id} className="flex items-center space-x-2">
                <Checkbox
                  id={module.id}
                  checked={selectedModules[module.id]}
                  onCheckedChange={(checked) => onModuleToggle(module.id, checked as boolean)}
                />
                <label
                  htmlFor={module.id}
                  className="text-sm cursor-pointer flex items-center gap-2"
                >
                  <div
                    className="w-5 h-5 p-1 rounded flex items-center justify-center"
                    style={{ backgroundColor: module.color + '20' }}
                  >
                    <IconComponent className="w-3 h-3" style={{ color: module.color }} />
                  </div>
                  {module.label}
                </label>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
