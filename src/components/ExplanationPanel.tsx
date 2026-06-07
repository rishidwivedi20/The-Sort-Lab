import React, { useEffect, useRef } from 'react';
import { SortStep } from '../types';

interface ExplanationPanelProps {
  currentStep: SortStep | null;
  stepIndex: number;
  totalSteps: number;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ currentStep, stepIndex, totalSteps }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // We can also maintain a history of the last N steps if we want a scrolling terminal effect
  // But the requirement says "display contextual information... panel updates live".
  // A clean approach is to show the current operation prominently, and maybe a small history.

  return (
    <div className="card w-full flex flex-col h-full min-h-[120px]">
      <div className="flex justify-between items-center mb-2 border-b border-border pb-2">
        <h3 className="text-sm font-semibold text-text uppercase tracking-wider">Live Execution</h3>
        <span className="text-xs text-textMuted font-mono">
          Step: {stepIndex >= 0 ? stepIndex + 1 : 0} / {totalSteps}
        </span>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        {currentStep ? (
          <div className="text-center">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider mb-2 bg-gray-100 dark:bg-[#252525] text-textMuted border border-border">
              {currentStep.type}
            </span>
            <p className="text-sm md:text-base text-text transition-all duration-200">
              {currentStep.description}
            </p>
          </div>
        ) : (
          <p className="text-sm text-textMuted italic">Waiting to start...</p>
        )}
      </div>
    </div>
  );
};
