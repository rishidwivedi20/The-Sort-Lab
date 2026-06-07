import { AlgorithmId, ArrayItem } from '../types';
import { WorkerMessage, WorkerResponse } from '../workers/sort.worker';

export function runSortWorker(
  algorithmId: AlgorithmId,
  array: ArrayItem[]
): Promise<Extract<WorkerResponse, { type: 'SORT_COMPLETED' }>['payload']> {
  return new Promise((resolve, reject) => {
    // Instantiate worker
    const worker = new Worker(new URL('../workers/sort.worker.ts', import.meta.url), { type: 'module' });

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      if (event.data.type === 'SORT_COMPLETED') {
        resolve(event.data.payload);
        worker.terminate();
      } else if (event.data.type === 'ERROR') {
        reject(new Error(event.data.payload.message));
        worker.terminate();
      }
    };

    worker.onerror = (error) => {
      reject(error);
      worker.terminate();
    };

    const message: WorkerMessage = {
      type: 'START_SORT',
      payload: { algorithmId, array }
    };
    worker.postMessage(message);
  });
}

export function runBenchmarkWorker(
  algorithmIds: AlgorithmId[],
  sizes: number[],
  arrays: ArrayItem[][]
): Promise<Extract<WorkerResponse, { type: 'BENCHMARK_COMPLETED' }>['payload']> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('../workers/sort.worker.ts', import.meta.url), { type: 'module' });

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      if (event.data.type === 'BENCHMARK_COMPLETED') {
        resolve(event.data.payload);
        worker.terminate();
      } else if (event.data.type === 'ERROR') {
        reject(new Error(event.data.payload.message));
        worker.terminate();
      }
    };

    worker.onerror = (error) => {
      reject(error);
      worker.terminate();
    };

    const message: WorkerMessage = {
      type: 'START_BENCHMARK',
      payload: { algorithmIds, sizes, arrays }
    };
    worker.postMessage(message);
  });
}
