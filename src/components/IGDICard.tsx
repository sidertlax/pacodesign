import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface IGDICardProps {
  value: number;
}

export function IGDICard({ value }: IGDICardProps) {
  const getStatusColor = (val: number) => {
    if (val >= 80) return { bg: '#10b981', text: 'Adecuado', textColor: '#065f46' };
    if (val >= 60) return { bg: '#f59e0b', text: 'Moderado', textColor: '#92400e' };
    return { bg: '#ef4444', text: 'Bajo', textColor: '#991b1b' };
  };

  const status = getStatusColor(value);

  return (
    <Card className="border-2" style={{ borderColor: '#582672' }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6" style={{ color: '#582672' }} />
          Indicador Global de Desempeño Institucional (IGDI)
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  IGDI = (0.25 × IGG) + (0.25 × IGD) + (0.25 × ICC) + (0.25 × IAN)
                </p>
                <p className="text-xs mt-1 text-gray-400">
                  Cada módulo contribuye equitativamente al desempeño global
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-6xl" style={{ color: '#582672' }}>
                {value.toFixed(1)}%
              </span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: status.bg + '20', color: status.textColor }}
              >
                <span>{status.text}</span>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Gasto (IGG)</span>
                <span style={{ color: '#8b5cf6' }}>25%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Desempeño (IGD)</span>
                <span style={{ color: '#06b6d4' }}>25%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Compromisos (ICC)</span>
                <span style={{ color: '#f59e0b' }}>25%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Normatividad (IAN)</span>
                <span style={{ color: '#84cc16' }}>25%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
