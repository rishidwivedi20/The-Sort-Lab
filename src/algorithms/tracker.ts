import { ArrayItem, SortStep, SortMetrics, StepType } from '../types';

export class SortTracker {
  steps: SortStep[] = [];
  metrics: SortMetrics = { comparisons: 0, swaps: 0, writes: 0, executionTimeMs: 0 };
  startTime: number;
  private currentArray: ArrayItem[];
  private recordSteps: boolean;

  constructor(initialArray: ArrayItem[], recordSteps: boolean = true) {
    this.currentArray = [...initialArray];
    this.startTime = performance.now();
    this.recordSteps = recordSteps;
  }

  private addStep(type: StepType, indices: number[], description: string) {
    if (!this.recordSteps) return;
    this.steps.push({
      type,
      indices,
      arrayState: [...this.currentArray],
      description,
    });
  }

  compare(i: number, j: number) {
    this.metrics.comparisons++;
    this.addStep('compare', [i, j], `Comparing values at indices ${i} and ${j}`);
  }

  swap(i: number, j: number) {
    this.metrics.swaps++;
    const temp = this.currentArray[i];
    this.currentArray[i] = this.currentArray[j];
    this.currentArray[j] = temp;
    this.addStep('swap', [i, j], `Swapping values at indices ${i} and ${j}`);
  }

  write(i: number, item: ArrayItem, description: string) {
    this.metrics.writes++;
    this.currentArray[i] = item;
    this.addStep('write', [i], description);
  }

  markPivot(i: number) {
    this.addStep('pivot', [i], `Marked index ${i} as pivot`);
  }

  markSorted(indices: number[]) {
    this.addStep('sorted', indices, `Elements at indices ${indices.join(', ')} are in final position`);
  }

  markAllSorted() {
    this.addStep('sorted', this.currentArray.map((_, i) => i), 'Array is completely sorted');
  }

  finish() {
    this.metrics.executionTimeMs = performance.now() - this.startTime;
    this.markAllSorted();
  }

  getArraySnapshot(): ArrayItem[] {
    return [...this.currentArray];
  }
}
