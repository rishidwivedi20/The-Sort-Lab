import React, { useState } from 'react';
import { AlgorithmId, BenchmarkResult } from '../types';
import { ALGORITHM_INFO } from '../algorithms';
import { runBenchmarkWorker } from '../utils/workerHelper';
import { generateArray } from '../utils/arrayGenerators';

interface BenchmarkViewProps {
  algorithmIds: AlgorithmId[];
}

export const BenchmarkView: React.FC<BenchmarkViewProps> = ({ algorithmIds }) => {
  const [selectedAlgos, setSelectedAlgos] = useState<Set<AlgorithmId>>(new Set(['merge', 'quick', 'heap']));
  const [results, setResults] = useState<BenchmarkResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [metricType, setMetricType] = useState<'timeMs' | 'comparisons' | 'swaps'>('timeMs');

  const sizes = [100, 500, 1000, 2000, 5000];

  const handleToggle = (id: AlgorithmId) => {
    const newSet = new Set(selectedAlgos);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedAlgos(newSet);
  };

  const handleRun = async () => {
    if (selectedAlgos.size === 0) return;
    setLoading(true);
    setResults(null);
    try {
      const arrays = sizes.map(size => generateArray(size, 'random'));
      const algosList = Array.from(selectedAlgos);
      const res = await runBenchmarkWorker(algosList, sizes, arrays);
      setResults(res.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Color palette for lines
  const colors = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // yellow
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f97316', // orange
    '#6366f1', // indigo
    '#14b8a6', // teal
  ];

  // SVG Chart Calculation
  let maxMetric = 0;
  if (results) {
    results.forEach(res => {
      res.points.forEach(p => {
        if (p[metricType] > maxMetric) maxMetric = p[metricType];
      });
    });
  }
  // Ensure we don't divide by 0
  if (maxMetric === 0) maxMetric = 1;

  const chartHeight = 300;
  const chartWidth = 600;
  const paddingX = 60;
  const paddingY = 40;
  const innerWidth = chartWidth - paddingX * 2;
  const innerHeight = chartHeight - paddingY * 2;

  const mapX = (size: number) => paddingX + ((sizes.indexOf(size) / (sizes.length - 1)) * innerWidth);
  const mapY = (val: number) => chartHeight - paddingY - ((val / maxMetric) * innerHeight);

  return (
    <div className="flex flex-col gap-6">
      <div className="card space-y-4">
        <h3 className="text-lg font-semibold text-text">Benchmark Configuration</h3>
        <p className="text-sm text-textMuted">Select algorithms to race against each other on randomly generated arrays of sizes: {sizes.join(', ')}.</p>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {algorithmIds.map((id, index) => {
            const isSelected = selectedAlgos.has(id);
            return (
              <button
                key={id}
                onClick={() => handleToggle(id)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  isSelected 
                    ? 'bg-accent/10 border-accent text-accent' 
                    : 'bg-surface border-border text-textMuted hover:border-gray-400'
                }`}
              >
                {ALGORITHM_INFO[id].name}
              </button>
            );
          })}
        </div>

        <div className="flex justify-end pt-4 border-t border-border mt-4">
          <button 
            onClick={handleRun}
            disabled={loading || selectedAlgos.size === 0}
            className="btn-primary px-8 py-2"
          >
            {loading ? 'Running...' : 'Run Benchmark'}
          </button>
        </div>
      </div>

      {results && (
        <div className="card space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-text">Results</h3>
            <select 
              value={metricType} 
              onChange={e => setMetricType(e.target.value as any)}
              className="select-base w-40"
            >
              <option value="timeMs">Execution Time (ms)</option>
              <option value="comparisons">Comparisons</option>
              <option value="swaps">Swaps</option>
            </select>
          </div>

          <div className="w-full overflow-x-auto pb-4">
            <svg 
              width={chartWidth} 
              height={chartHeight} 
              className="mx-auto block"
              style={{ minWidth: '600px' }}
            >
              {/* Axes */}
              <line x1={paddingX} y1={paddingY} x2={paddingX} y2={chartHeight - paddingY} stroke="var(--color-border)" strokeWidth="1" />
              <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="var(--color-border)" strokeWidth="1" />
              
              {/* X Axis Labels */}
              {sizes.map((size, i) => (
                <text key={`x-${i}`} x={mapX(size)} y={chartHeight - paddingY + 20} textAnchor="middle" fill="var(--color-text-muted)" fontSize="12">
                  {size}
                </text>
              ))}

              {/* Y Axis Labels */}
              {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => {
                const val = maxMetric * tick;
                const y = mapY(val);
                return (
                  <g key={`y-${i}`}>
                    <line x1={paddingX - 5} y1={y} x2={paddingX} y2={y} stroke="var(--color-border)" strokeWidth="1" />
                    <line x1={paddingX} y1={y} x2={chartWidth - paddingX} y2={y} stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />
                    <text x={paddingX - 10} y={y + 4} textAnchor="end" fill="var(--color-text-muted)" fontSize="10">
                      {val > 1000 ? (val/1000).toFixed(1) + 'k' : Math.round(val)}
                    </text>
                  </g>
                );
              })}

              {/* Lines */}
              {results.map((res, index) => {
                const color = colors[index % colors.length];
                const points = res.points.map(p => `${mapX(p.size)},${mapY(p[metricType])}`).join(' ');
                
                return (
                  <g key={res.algorithmId}>
                    <polyline
                      fill="none"
                      stroke={color}
                      strokeWidth="2"
                      points={points}
                      className="transition-all duration-500 ease-in-out"
                    />
                    {res.points.map((p, i) => (
                      <circle
                        key={i}
                        cx={mapX(p.size)}
                        cy={mapY(p[metricType])}
                        r="4"
                        fill="var(--color-surface)"
                        stroke={color}
                        strokeWidth="2"
                        className="transition-all duration-500 ease-in-out"
                      >
                        <title>{`${ALGORITHM_INFO[res.algorithmId].name}: Size ${p.size} = ${p[metricType].toFixed(1)}`}</title>
                      </circle>
                    ))}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex flex-wrap gap-4 justify-center mt-4 border-t border-border pt-4">
            {results.map((res, index) => (
              <div key={res.algorithmId} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }}></div>
                <span className="text-sm text-text">{ALGORITHM_INFO[res.algorithmId].name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
