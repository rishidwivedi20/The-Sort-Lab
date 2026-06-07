import React from 'react';
import { AlgorithmInfo } from '../types';

interface InfoPanelProps {
  algorithm: AlgorithmInfo;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ algorithm }) => {
  return (
    <div className="card w-full flex flex-col gap-4">
      <div className="border-b border-border pb-3">
        <h2 className="text-lg font-semibold text-text">{algorithm.name}</h2>
        <span className="text-xs text-textMuted uppercase tracking-wider">{algorithm.category} Algorithm</span>
      </div>
      
      <p className="text-sm text-text leading-relaxed">
        {algorithm.description}
      </p>

      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-text uppercase tracking-wider border-b border-border pb-1">Time Complexity</h3>
          <div className="flex justify-between text-sm">
            <span className="text-textMuted">Best</span>
            <span className="font-mono text-text">{algorithm.timeComplexity.best}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-textMuted">Average</span>
            <span className="font-mono text-text">{algorithm.timeComplexity.average}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-textMuted">Worst</span>
            <span className="font-mono text-text">{algorithm.timeComplexity.worst}</span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-text uppercase tracking-wider border-b border-border pb-1">Properties</h3>
          <div className="flex justify-between text-sm">
            <span className="text-textMuted">Space</span>
            <span className="font-mono text-text">{algorithm.spaceComplexity}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-textMuted">Stable</span>
            <span className={`font-medium ${algorithm.stable ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {algorithm.stable ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-textMuted">In-Place</span>
            <span className={`font-medium ${algorithm.inPlace ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {algorithm.inPlace ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
