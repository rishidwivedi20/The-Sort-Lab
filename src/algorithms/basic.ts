import { ArrayItem } from '../types';
import { SortTracker } from './tracker';

export function bubbleSort(array: ArrayItem[], tracker: SortTracker) {
  let n = array.length;
  let swapped = false;
  for (let i = 0; i < n - 1; i++) {
    swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      tracker.compare(j, j + 1);
      if (tracker.getArraySnapshot()[j].value > tracker.getArraySnapshot()[j + 1].value) {
        tracker.swap(j, j + 1);
        swapped = true;
      }
    }
    tracker.markSorted([n - i - 1]);
    if (!swapped) break;
  }
  tracker.finish();
}

export function selectionSort(array: ArrayItem[], tracker: SortTracker) {
  let n = array.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    tracker.markPivot(minIdx);
    for (let j = i + 1; j < n; j++) {
      tracker.compare(j, minIdx);
      if (tracker.getArraySnapshot()[j].value < tracker.getArraySnapshot()[minIdx].value) {
        minIdx = j;
        tracker.markPivot(minIdx);
      }
    }
    if (minIdx !== i) {
      tracker.swap(i, minIdx);
    }
    tracker.markSorted([i]);
  }
  tracker.finish();
}

export function insertionSort(array: ArrayItem[], tracker: SortTracker) {
  let n = array.length;
  tracker.markSorted([0]);
  for (let i = 1; i < n; i++) {
    let j = i;
    while (j > 0) {
      tracker.compare(j - 1, j);
      if (tracker.getArraySnapshot()[j - 1].value > tracker.getArraySnapshot()[j].value) {
        tracker.swap(j - 1, j);
        j--;
      } else {
        break;
      }
    }
    // Note: The prefix 0..i is sorted, but its exact position might change.
    // For visual clarity, we might not mark them as permanently sorted until the end.
  }
  tracker.finish();
}
