import React, { useState, useEffect, useCallback } from 'react';
import { Moon, Sun, Code2, FlaskConical, LayoutDashboard, GitCompare, Activity } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useSortController } from '../hooks/useSortController';
import { generateArray, ArrayDistribution } from '../utils/arrayGenerators';
import { runSortWorker } from '../utils/workerHelper';
import { ALGORITHM_INFO } from '../algorithms';
import { AlgorithmId, ArrayItem } from '../types';

import { VisualizerCanvas } from '../components/VisualizerCanvas';
import { ControlPanel } from '../components/ControlPanel';
import { MetricsPanel } from '../components/MetricsPanel';
import { InfoPanel } from '../components/InfoPanel';
import { ExplanationPanel } from '../components/ExplanationPanel';
import { ComparisonView } from '../components/ComparisonView';
import { BenchmarkView } from '../components/BenchmarkView';

type ViewMode = 'single' | 'compare' | 'benchmark';

export const Dashboard: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  
  const [algorithmId, setAlgorithmId] = useState<AlgorithmId>('bubble');
  const [initialArray, setInitialArray] = useState<ArrayItem[]>([]);
  const [steps, setSteps] = useState<any[]>([]);
  const [workerMetrics, setWorkerMetrics] = useState<any>(undefined);
  const [loading, setLoading] = useState(false);
  const [showStabilityLabels, setShowStabilityLabels] = useState(false);

  const controller = useSortController({
    steps,
    initialArray,
    workerMetrics,
  });

  const generateAndPrepare = useCallback(async (size: number, distribution: ArrayDistribution) => {
    setLoading(true);
    controller.reset();
    
    const newArray = generateArray(size, distribution);
    setInitialArray(newArray);

    try {
      const res = await runSortWorker(algorithmId, newArray);
      setSteps(res.steps);
      setWorkerMetrics(res.metrics);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [algorithmId, controller]);

  const handleCustomInput = useCallback(async (customArray: ArrayItem[]) => {
    setLoading(true);
    controller.reset();
    setInitialArray(customArray);

    try {
      const res = await runSortWorker(algorithmId, customArray);
      setSteps(res.steps);
      setWorkerMetrics(res.metrics);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [algorithmId, controller]);

  // Initial load
  useEffect(() => {
    if (viewMode === 'single' && initialArray.length === 0) {
      generateAndPrepare(50, 'random');
    }
  }, [viewMode]);

  // Re-run worker when algorithm changes, keeping same array
  useEffect(() => {
    if (viewMode === 'single' && initialArray.length > 0) {
      const reCalculate = async () => {
        setLoading(true);
        controller.reset();
        try {
          const res = await runSortWorker(algorithmId, initialArray);
          setSteps(res.steps);
          setWorkerMetrics(res.metrics);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      reCalculate();
    }
  }, [algorithmId]);

  const algorithmIds = Object.keys(ALGORITHM_INFO) as AlgorithmId[];

  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-200">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="h-6 w-6 rounded-[5px]">
              <rect width="64" height="64" rx="14" fill="#0D1117" /> 
              <rect x="14" y="32" width="6" height="20" rx="3" fill="#8B949E" />
              <rect x="26" y="20" width="6" height="32" rx="3" fill="#8B949E" />
              <rect x="38" y="12" width="6" height="40" rx="3" fill="#58A6FF" />
              <rect x="50" y="24" width="6" height="28" rx="3" fill="#3FB950" />
            </svg>
            <h1 className="text-lg font-semibold tracking-tight text-text hidden sm:block">The Sort Lab</h1>
          </div>
          
          <div className="flex bg-background border border-border p-1 rounded-lg">
            <button
              onClick={() => setViewMode('single')}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${viewMode === 'single' ? 'bg-surface text-text shadow-sm' : 'text-textMuted hover:text-text'}`}
            >
              <LayoutDashboard size={16} /> <span className="hidden sm:inline">Visualizer</span>
            </button>
            <button
              onClick={() => setViewMode('compare')}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${viewMode === 'compare' ? 'bg-surface text-text shadow-sm' : 'text-textMuted hover:text-text'}`}
            >
              <GitCompare size={16} /> <span className="hidden sm:inline">Compare</span>
            </button>
            <button
              onClick={() => setViewMode('benchmark')}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${viewMode === 'benchmark' ? 'bg-surface text-text shadow-sm' : 'text-textMuted hover:text-text'}`}
            >
              <Activity size={16} /> <span className="hidden sm:inline">Benchmark</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            {viewMode === 'single' && (
              <select 
                value={algorithmId}
                onChange={e => setAlgorithmId(e.target.value as AlgorithmId)}
                className="select-base w-40 hidden md:block"
                disabled={controller.isPlaying || loading}
              >
                {algorithmIds.map(id => (
                  <option key={id} value={id}>{ALGORITHM_INFO[id].name}</option>
                ))}
              </select>
            )}
            <button onClick={toggleTheme} className="btn-ghost p-2 rounded-full" title="Toggle Theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <a href="#" className="btn-ghost p-2 rounded-full hidden sm:flex" title="Source Code">
              <Code2 size={20} />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        {viewMode === 'compare' && <ComparisonView algorithmIds={algorithmIds} />}
        {viewMode === 'benchmark' && <BenchmarkView algorithmIds={algorithmIds} />}
        
        {viewMode === 'single' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Panel */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              <div className="md:hidden">
                <select 
                  value={algorithmId}
                  onChange={e => setAlgorithmId(e.target.value as AlgorithmId)}
                  className="select-base w-full mb-4"
                  disabled={controller.isPlaying || loading}
                >
                  {algorithmIds.map(id => (
                    <option key={id} value={id}>{ALGORITHM_INFO[id].name}</option>
                  ))}
                </select>
              </div>
              <ControlPanel 
                onGenerate={generateAndPrepare}
                onCustomInput={handleCustomInput}
                isPlaying={controller.isPlaying}
                onPlay={controller.play}
                onPause={controller.pause}
                onStop={controller.reset}
                onReset={controller.reset}
                onStepForward={controller.stepForward}
                onStepBackward={controller.stepBackward}
                speed={controller.speedMultiplier}
                onSpeedChange={controller.setSpeedMultiplier}
                isFinished={controller.isFinished}
                canStepForward={controller.currentStepIndex < steps.length - 1}
                canStepBackward={controller.currentStepIndex > -1}
                disabled={loading}
              />
              
              <div className="card">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={showStabilityLabels} 
                    onChange={e => setShowStabilityLabels(e.target.checked)}
                    className="accent-accent"
                  />
                  <span className="text-sm text-text">Show Stability Labels</span>
                </label>
                <p className="text-[10px] text-textMuted mt-1">
                  Helpful for small array sizes. Adds letters (A, B) to identical values to track stability.
                </p>
              </div>
            </div>

            {/* Center Panel */}
            <div className="lg:col-span-6 flex flex-col gap-6 h-full">
              <div className="card flex-1 min-h-[400px] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-text">{ALGORITHM_INFO[algorithmId].name}</h2>
                  {loading && <span className="text-xs text-accent animate-pulse">Generating steps...</span>}
                </div>
                <div className="flex-1 relative">
                  <VisualizerCanvas 
                    array={controller.currentArrayState}
                    currentStep={controller.currentStep}
                    sortedIndices={controller.sortedIndices}
                    showStabilityLabels={showStabilityLabels}
                  />
                </div>
              </div>
              <ExplanationPanel 
                currentStep={controller.currentStep} 
                stepIndex={controller.currentStepIndex} 
                totalSteps={steps.length} 
              />
            </div>

            {/* Right Panel */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              <MetricsPanel 
                metrics={controller.metrics} 
                algorithm={ALGORITHM_INFO[algorithmId]} 
                arraySize={initialArray.length} 
              />
              <InfoPanel algorithm={ALGORITHM_INFO[algorithmId]} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
