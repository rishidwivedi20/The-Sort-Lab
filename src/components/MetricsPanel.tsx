import React from 'react';
import { SortMetrics, AlgorithmInfo } from '../types';

interface MetricsPanelProps {
  metrics: SortMetrics;
  algorithm: AlgorithmInfo;
  arraySize: number;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ metrics, algorithm, arraySize }) => {
  return (
    <div className="card w-full">
      <h3 className="text-sm font-semibold text-text uppercase tracking-wider mb-4 border-b border-border pb-2">Live Metrics</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="text-xs text-textMuted uppercase tracking-wider mb-1">Algorithm</span>
          <span className="text-sm font-medium text-text">{algorithm.name}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-textMuted uppercase tracking-wider mb-1">Array Size</span>
          <span className="text-sm font-medium text-text">{arraySize} elements</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-textMuted uppercase tracking-wider mb-1">Comparisons</span>
          <span className="text-xl font-mono text-text">{metrics.comparisons.toLocaleString()}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-textMuted uppercase tracking-wider mb-1">Swaps</span>
          <span className="text-xl font-mono text-text">{metrics.swaps.toLocaleString()}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-textMuted uppercase tracking-wider mb-1">Writes</span>
          <span className="text-xl font-mono text-text">{metrics.writes.toLocaleString()}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-textMuted uppercase tracking-wider mb-1">Exec. Time (Worker)</span>
          <span className="text-xl font-mono text-text">{metrics.executionTimeMs.toFixed(2)} ms</span>
        </div>
      </div>
    </div>
  );
};
