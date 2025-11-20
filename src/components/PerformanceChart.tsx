import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PerformanceChartProps {
  data: Array<{
    name: string;
    gasto: number;
    indicadores: number;
    compromisos: number;
    normatividad: number;
  }>;
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen de Desempeño por Módulo</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="gasto" name="Gasto" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="indicadores" name="Indicadores" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            <Bar dataKey="compromisos" name="Compromisos" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="normatividad" name="Normatividad" fill="#84cc16" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
