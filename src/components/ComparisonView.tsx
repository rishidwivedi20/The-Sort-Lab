import React, { useState, useEffect, useCallback } from 'react';
import { AlgorithmId, ArrayItem } from '../types';
import { ALGORITHM_INFO } from '../algorithms';
import { useSortController } from '../hooks/useSortController';
import { runSortWorker } from '../utils/workerHelper';
import { VisualizerCanvas } from './VisualizerCanvas';
import { MetricsPanel } from './MetricsPanel';
import { generateArray } from '../utils/arrayGenerators';

interface ComparisonViewProps {
  algorithmIds: AlgorithmId[];
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ algorithmIds }) => {
  const [algoA, setAlgoA] = useState<AlgorithmId>('quick');
  const [algoB, setAlgoB] = useState<AlgorithmId>('merge');
  const [arraySize, setArraySize] = useState<number>(50);
  
  const [initialArray, setInitialArray] = useState<ArrayItem[]>([]);
  const [stepsA, setStepsA] = useState<any[]>([]);
  const [stepsB, setStepsB] = useState<any[]>([]);
  const [metricsA, setMetricsA] = useState<any>(undefined);
  const [metricsB, setMetricsB] = useState<any>(undefined);
  const [loading, setLoading] = useState(false);

  const controllerA = useSortController({ steps: stepsA, initialArray, workerMetrics: metricsA });
  const controllerB = useSortController({ steps: stepsB, initialArray, workerMetrics: metricsB });

  const generateAndPrepare = useCallback(async () => {
    setLoading(true);
    controllerA.reset();
    controllerB.reset();
    
    const newArray = generateArray(arraySize, 'random');
    setInitialArray(newArray);

    try {
      const [resA, resB] = await Promise.all([
        runSortWorker(algoA, newArray),
        runSortWorker(algoB, newArray)
      ]);
      setStepsA(resA.steps);
      setStepsB(resB.steps);
      setMetricsA(resA.metrics);
      setMetricsB(resB.metrics);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [algoA, algoB, arraySize]);

  useEffect(() => {
    generateAndPrepare();
  }, [algoA, algoB, arraySize]); // Re-run when settings change

  const handlePlayBoth = () => {
    controllerA.play();
    controllerB.play();
  };

  const handlePauseBoth = () => {
    controllerA.pause();
    controllerB.pause();
  };

  const handleResetBoth = () => {
    controllerA.reset();
    controllerB.reset();
  };

  const isPlaying = controllerA.isPlaying || controllerB.isPlaying;

  let winner: AlgorithmId | 'tie' | null = null;
  if (controllerA.isFinished && controllerB.isFinished) {
    // Winner based on execution time
    if (stepsA.length && stepsB.length) {
      const timeA = controllerA.metrics.executionTimeMs;
      const timeB = controllerB.metrics.executionTimeMs;
      if (timeA < timeB) {
        winner = algoA;
      } else if (timeB < timeA) {
        winner = algoB;
      } else {
        winner = 'tie';
      }
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4 bg-surface p-4 rounded-lg border border-border shadow-sm">
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-text">Algorithm A:</label>
          <select value={algoA} onChange={e => setAlgoA(e.target.value as AlgorithmId)} className="select-base w-40" disabled={isPlaying || loading}>
            {algorithmIds.map(id => <option key={id} value={id}>{ALGORITHM_INFO[id].name}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-text">Algorithm B:</label>
          <select value={algoB} onChange={e => setAlgoB(e.target.value as AlgorithmId)} className="select-base w-40" disabled={isPlaying || loading}>
            {algorithmIds.map(id => <option key={id} value={id}>{ALGORITHM_INFO[id].name}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-text">Size:</label>
          <select value={arraySize} onChange={e => setArraySize(parseInt(e.target.value))} className="select-base w-24" disabled={isPlaying || loading}>
            {[10, 50, 100, 250, 500].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        
        <div className="flex-1" />
        
        <div className="flex gap-2">
          <button onClick={handleResetBoth} className="btn-secondary px-4" disabled={isPlaying || loading}>Reset</button>
          {!isPlaying ? (
            <button onClick={handlePlayBoth} className="btn-primary px-6" disabled={loading}>Race</button>
          ) : (
            <button onClick={handlePauseBoth} className="btn-secondary px-6">Pause</button>
          )}
        </div>
      </div>

      {winner && winner !== 'tie' && (
        <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 px-4 py-3 rounded-lg text-center font-medium">
          🏆 Winner: {ALGORITHM_INFO[winner].name} completed faster!
        </div>
      )}
      {winner === 'tie' && (
        <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 px-4 py-3 rounded-lg text-center font-medium">
          🤝 It's a Tie! Both completed in the same execution time.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-text text-center">{ALGORITHM_INFO[algoA].name}</h2>
          <div className="h-64">
            <VisualizerCanvas 
              array={controllerA.currentArrayState}
              currentStep={controllerA.currentStep}
              sortedIndices={controllerA.sortedIndices}
            />
          </div>
          <MetricsPanel metrics={controllerA.metrics} algorithm={ALGORITHM_INFO[algoA]} arraySize={arraySize} />
        </div>

        {/* Right Side */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-text text-center">{ALGORITHM_INFO[algoB].name}</h2>
          <div className="h-64">
            <VisualizerCanvas 
              array={controllerB.currentArrayState}
              currentStep={controllerB.currentStep}
              sortedIndices={controllerB.sortedIndices}
            />
          </div>
          <MetricsPanel metrics={controllerB.metrics} algorithm={ALGORITHM_INFO[algoB]} arraySize={arraySize} />
        </div>
      </div>
    </div>
  );
};
