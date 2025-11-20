import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
}

export function ModuleCard({ title, description, icon: Icon, color, onClick }: ModuleCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={onClick}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="p-3 rounded-lg" style={{ backgroundColor: color + '20' }}>
            <Icon className="w-12 h-12" style={{ color }} />
          </div>
        </div>
        <CardTitle className="mt-4">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="ghost"
          className="w-full justify-between group-hover:bg-gray-50"
          style={{ color }}
        >
          Acceder
          <ArrowRight className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
