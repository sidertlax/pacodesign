import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';

interface Segment {
  label: string;
  value: number;
  color: string;
}

interface MultiSegmentProgressProps {
  segments: Segment[];
  height?: string;
  delay?: number;
}

export function MultiSegmentProgress({ segments, height = '8px', delay = 0 }: MultiSegmentProgressProps) {
  // Calculate the average of all segments to determine the overall progress
  const averageProgress = segments.length > 0 ? segments.reduce((sum, seg) => sum + seg.value, 0) / segments.length : 0;
  
  // Calculate the total width based on average progress (max 100%)
  const totalWidth = Math.min(averageProgress, 100);

  // Get status color and text based on value
  const getStatusColor = (value: number) => {
    if (value >= 80) return '#10b981'; // Green
    if (value >= 60) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const getStatusText = (value: number) => {
    if (value >= 80) return 'En tiempo y forma';
    if (value >= 60) return 'Trabajando';
    return 'Necesita atención';
  };

  return (
    <TooltipProvider>
      <div className="w-full bg-gray-200" style={{ height }}>
        <motion.div 
          className="flex h-full" 
          style={{ width: `${totalWidth}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${totalWidth}%` }}
          transition={{ duration: 1.2, delay, ease: "easeOut" }}
        >
          {segments.map((segment, index) => {
            // Each segment takes equal space within the total progress width
            const segmentWidth = segments.length > 0 ? 100 / segments.length : 0;
            const statusColor = getStatusColor(segment.value);
            const statusText = getStatusText(segment.value);
            
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <motion.div
                    className="transition-all hover:opacity-80 cursor-pointer"
                    style={{
                      width: `${segmentWidth}%`,
                      backgroundColor: segment.color,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: delay + 0.5 + index * 0.1 }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-2">
                    <p className="text-sm">
                      {segment.label}: {segment.value.toFixed(1)}%
                    </p>
                    {/* Status badge with underglow only on circle */}
                    <Badge 
                      className="text-xs transition-all duration-200 border-0 backdrop-blur-sm"
                      style={{ 
                        backgroundColor: `${statusColor}15`,
                        color: statusColor,
                        fontWeight: 'bold'
                      }}
                    >
                      <motion.div 
                        className="w-2 h-2 rounded-full mr-1.5" 
                        style={{ 
                          backgroundColor: statusColor,
                          boxShadow: `0 0 12px ${statusColor}90, 0 0 20px ${statusColor}50`
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
                        {statusText}
                      </span>
                    </Badge>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </motion.div>
      </div>
    </TooltipProvider>
  );
}
