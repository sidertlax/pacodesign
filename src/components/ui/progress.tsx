"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress@1.1.2";

import { cn } from "./utils";

interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  value?: number;
  indicatorColor?: string;
}

function Progress({
  className,
  value,
  indicatorColor,
  ...props
}: ProgressProps) {
  // Determinar color basado en el valor si no se proporciona uno específico
  const getColor = () => {
    if (indicatorColor) return indicatorColor;
    if (!value) return '#582672'; // Color primario por defecto
    if (value > 66.6) return '#2E7D32'; // Verde
    if (value >= 33.3) return '#F9A825'; // Amarillo
    return '#D32F2F'; // Rojo
  };

  const color = getColor();

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full",
        className,
      )}
      style={{ backgroundColor: `${color}20` }}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 transition-all"
        style={{ 
          transform: `translateX(-${100 - (value || 0)}%)`,
          backgroundColor: color,
        }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
