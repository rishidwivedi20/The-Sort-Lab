import React, { useMemo } from 'react';
import { ArrayItem, SortStep } from '../types';

interface VisualizerCanvasProps {
  array: ArrayItem[];
  currentStep: SortStep | null;
  sortedIndices: number[];
  showStabilityLabels?: boolean;
}

export const VisualizerCanvas: React.FC<VisualizerCanvasProps> = ({ 
  array, 
  currentStep, 
  sortedIndices, 
  showStabilityLabels = false 
}) => {
  const maxVal = useMemo(() => {
    if (array.length === 0) return 1;
    return Math.max(...array.map(a => a.value));
  }, [array]);

  return (
    <div className="w-full h-full min-h-[300px] flex items-end justify-center gap-[1px] md:gap-[2px] p-4 bg-background rounded-lg border border-border">
      {array.map((item, index) => {
        let stateClass = 'bg-state-default';
        let zIndex = 0;

        if (sortedIndices.includes(index)) {
          stateClass = 'bg-state-sorted';
        }

        if (currentStep) {
          if (currentStep.indices.includes(index)) {
            zIndex = 10;
            switch (currentStep.type) {
              case 'compare':
                stateClass = 'bg-state-comparing';
                break;
              case 'swap':
                stateClass = 'bg-state-swapping';
                break;
              case 'write':
                stateClass = 'bg-state-swapping'; // Highlight writes same as swaps
                break;
              case 'pivot':
                stateClass = 'bg-state-pivot';
                break;
              case 'sorted':
                stateClass = 'bg-state-sorted';
                break;
            }
          }
        }

        const heightPercentage = Math.max(1, (item.value / maxVal) * 100);

        return (
          <div
            key={item.id}
            style={{ 
              height: `${heightPercentage}%`,
              width: `${100 / array.length}%`,
              minWidth: '2px',
              zIndex
            }}
            className={`rounded-t-sm transition-colors duration-200 relative flex justify-center ${stateClass}`}
            title={`Value: ${item.value} ${showStabilityLabels ? `(Label: ${item.label})` : ''}`}
          >
            {showStabilityLabels && array.length <= 50 && (
              <div className="absolute -top-6 text-xs font-bold text-text bg-surface border border-border px-1 rounded shadow-sm">
                {item.label}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
