import { ArrayItem } from '../types';
import { SortTracker } from './tracker';

export function mergeSort(array: ArrayItem[], tracker: SortTracker) {
  let n = array.length;
  // We need to operate on the main array for writes to be visible
  // Merge sort is not in-place, so we simulate copying.
  
  function merge(left: number, mid: number, right: number) {
    let currentArray = tracker.getArraySnapshot();
    let leftSub = currentArray.slice(left, mid + 1);
    let rightSub = currentArray.slice(mid + 1, right + 1);
    
    let i = 0, j = 0, k = left;
    
    while (i < leftSub.length && j < rightSub.length) {
      tracker.compare(left + i, mid + 1 + j);
      if (leftSub[i].value <= rightSub[j].value) {
        tracker.write(k, leftSub[i], `Writing ${leftSub[i].value} from left half to index ${k}`);
        i++;
      } else {
        tracker.write(k, rightSub[j], `Writing ${rightSub[j].value} from right half to index ${k}`);
        j++;
      }
      k++;
    }
    
    while (i < leftSub.length) {
      tracker.write(k, leftSub[i], `Writing remaining ${leftSub[i].value} from left half`);
      i++; k++;
    }
    while (j < rightSub.length) {
      tracker.write(k, rightSub[j], `Writing remaining ${rightSub[j].value} from right half`);
      j++; k++;
    }
  }

  function sort(left: number, right: number) {
    if (left >= right) return;
    let mid = Math.floor(left + (right - left) / 2);
    sort(left, mid);
    sort(mid + 1, right);
    merge(left, mid, right);
  }

  sort(0, n - 1);
  tracker.finish();
}

export function quickSort(array: ArrayItem[], tracker: SortTracker) {
  function partition(low: number, high: number): number {
    let pivot = tracker.getArraySnapshot()[high].value;
    tracker.markPivot(high);
    
    let i = low - 1;
    for (let j = low; j < high; j++) {
      tracker.compare(j, high);
      if (tracker.getArraySnapshot()[j].value < pivot) {
        i++;
        tracker.swap(i, j);
      }
    }
    tracker.swap(i + 1, high);
    return i + 1;
  }

  function sort(low: number, high: number) {
    if (low < high) {
      let pi = partition(low, high);
      tracker.markSorted([pi]);
      sort(low, pi - 1);
      sort(pi + 1, high);
    } else if (low === high) {
      tracker.markSorted([low]);
    }
  }

  sort(0, array.length - 1);
  tracker.finish();
}

export function heapSort(array: ArrayItem[], tracker: SortTracker) {
  let n = array.length;

  function heapify(n: number, i: number) {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    let snapshot = tracker.getArraySnapshot();
    
    if (left < n) {
      tracker.compare(left, largest);
      if (tracker.getArraySnapshot()[left].value > tracker.getArraySnapshot()[largest].value) {
        largest = left;
      }
    }

    if (right < n) {
      tracker.compare(right, largest);
      if (tracker.getArraySnapshot()[right].value > tracker.getArraySnapshot()[largest].value) {
        largest = right;
      }
    }

    if (largest !== i) {
      tracker.swap(i, largest);
      heapify(n, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    tracker.swap(0, i);
    tracker.markSorted([i]);
    heapify(i, 0);
  }
  if (n > 0) tracker.markSorted([0]);

  tracker.finish();
}
