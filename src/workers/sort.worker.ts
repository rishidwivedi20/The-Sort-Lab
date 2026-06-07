import { AlgorithmId, ArrayItem, SortMetrics, SortStep, BenchmarkResult } from '../types';
import { sortFunctionMap } from '../algorithms';
import { SortTracker } from '../algorithms/tracker';

export type WorkerMessage = 
  | { type: 'START_SORT'; payload: { algorithmId: AlgorithmId; array: ArrayItem[] } }
  | { type: 'START_BENCHMARK'; payload: { algorithmIds: AlgorithmId[]; sizes: number[]; arrays: ArrayItem[][] } };

export type WorkerResponse = 
  | { type: 'SORT_COMPLETED'; payload: { steps: SortStep[]; metrics: SortMetrics } }
  | { type: 'BENCHMARK_COMPLETED'; payload: { results: BenchmarkResult[] } }
  | { type: 'ERROR'; payload: { message: string } };

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { type, payload } = event.data;

  try {
    if (type === 'START_SORT') {
      const { algorithmId, array } = payload;
      const tracker = new SortTracker(array);
      const sortFunction = sortFunctionMap[algorithmId];
      if (!sortFunction) {
        throw new Error(`Algorithm ${algorithmId} not found`);
      }
      sortFunction(array, tracker);
      self.postMessage({
        type: 'SORT_COMPLETED',
        payload: {
          steps: tracker.steps,
          metrics: tracker.metrics,
        }
      } as WorkerResponse);
    } else if (type === 'START_BENCHMARK') {
      const { algorithmIds, sizes, arrays } = payload;
      const results: BenchmarkResult[] = [];

      for (const algorithmId of algorithmIds) {
        const sortFunction = sortFunctionMap[algorithmId];
        if (!sortFunction) continue;

        const points = [];
        for (let i = 0; i < sizes.length; i++) {
          const array = arrays[i];
          const tracker = new SortTracker(array, false);
          sortFunction([...array], tracker); // Need to pass copy? tracker constructor copies it anyway.
          
          points.push({
            size: sizes[i],
            timeMs: tracker.metrics.executionTimeMs,
            comparisons: tracker.metrics.comparisons,
            swaps: tracker.metrics.swaps,
          });
        }
        results.push({ algorithmId, points });
      }

      self.postMessage({
        type: 'BENCHMARK_COMPLETED',
        payload: { results }
      } as WorkerResponse);
    }
  } catch (error: any) {
    self.postMessage({
      type: 'ERROR',
      payload: { message: error.message }
    } as WorkerResponse);
  }
};
