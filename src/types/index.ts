export type AlgorithmId = 
  | 'bubble' 
  | 'selection' 
  | 'insertion' 
  | 'merge' 
  | 'quick' 
  | 'heap' 
  | 'counting' 
  | 'radix' 
  | 'shell' 
  | 'bucket';

export type StepType = 'compare' | 'swap' | 'write' | 'pivot' | 'sorted' | 'info';

export interface ArrayItem {
  value: number;
  id: string;
  label?: string; // e.g. for stability visualization: 'A', 'B'
}

export interface SortStep {
  type: StepType;
  indices: number[];      // the indices involved (e.g. [i, j] for compare)
  arrayState: ArrayItem[];// snapshotted array at this step
  description: string;    // explanation, e.g. "Swapping 5 and 2"
}

export interface SortMetrics {
  comparisons: number;
  swaps: number;
  writes: number; // For out-of-place algorithms or direct overwrites
  executionTimeMs: number; // Wall-clock time recorded in worker
}

export interface AlgorithmInfo {
  id: AlgorithmId;
  name: string;
  category: 'Basic' | 'Intermediate' | 'Advanced';
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  stable: boolean;
  inPlace: boolean;
  description: string;
}

export interface BenchmarkPoint {
  size: number;
  timeMs: number;
  comparisons: number;
  swaps: number;
}

export interface BenchmarkResult {
  algorithmId: AlgorithmId;
  points: BenchmarkPoint[];
}
