import { ArrayItem } from '../types';
import { SortTracker } from './tracker';

export function countingSort(array: ArrayItem[], tracker: SortTracker) {
  if (array.length === 0) {
    tracker.finish();
    return;
  }

  let n = array.length;
  let max = tracker.getArraySnapshot()[0].value;
  for (let i = 1; i < n; i++) {
    tracker.compare(0, i); // Arbitrary comparison to find max
    if (tracker.getArraySnapshot()[i].value > max) {
      max = tracker.getArraySnapshot()[i].value;
    }
  }

  let count = new Array(max + 1).fill(0);
  let snapshot = tracker.getArraySnapshot();

  for (let i = 0; i < n; i++) {
    count[snapshot[i].value]++;
  }

  for (let i = 1; i <= max; i++) {
    count[i] += count[i - 1];
  }

  let output = new Array(n);
  // Iterate backwards for stability
  for (let i = n - 1; i >= 0; i--) {
    let val = snapshot[i].value;
    output[count[val] - 1] = snapshot[i];
    count[val]--;
  }

  for (let i = 0; i < n; i++) {
    tracker.write(i, output[i], `Writing ${output[i].value} into position ${i}`);
    tracker.markSorted([i]);
  }
  
  tracker.finish();
}

export function radixSort(array: ArrayItem[], tracker: SortTracker) {
  if (array.length === 0) {
    tracker.finish();
    return;
  }
  let n = array.length;
  let max = array[0].value;
  for (let i = 1; i < n; i++) {
    if (array[i].value > max) {
      max = array[i].value;
    }
  }

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    let output = new Array(n);
    let count = new Array(10).fill(0);
    let snapshot = tracker.getArraySnapshot();

    for (let i = 0; i < n; i++) {
      count[Math.floor(snapshot[i].value / exp) % 10]++;
    }

    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    for (let i = n - 1; i >= 0; i--) {
      let digit = Math.floor(snapshot[i].value / exp) % 10;
      output[count[digit] - 1] = snapshot[i];
      count[digit]--;
    }

    for (let i = 0; i < n; i++) {
      tracker.write(i, output[i], `Digit sorting writing ${output[i].value} to index ${i}`);
    }
  }
  tracker.markAllSorted();
  tracker.finish();
}

export function shellSort(array: ArrayItem[], tracker: SortTracker) {
  let n = array.length;
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i += 1) {
      let temp = tracker.getArraySnapshot()[i];
      let j;
      for (j = i; j >= gap; j -= gap) {
        tracker.compare(j - gap, i);
        if (tracker.getArraySnapshot()[j - gap].value > temp.value) {
          tracker.write(j, tracker.getArraySnapshot()[j - gap], `Shifting ${tracker.getArraySnapshot()[j - gap].value}`);
        } else {
          break;
        }
      }
      tracker.write(j, temp, `Placing ${temp.value}`);
    }
  }
  tracker.markAllSorted();
  tracker.finish();
}

export function bucketSort(array: ArrayItem[], tracker: SortTracker) {
  if (array.length === 0) {
    tracker.finish();
    return;
  }
  let n = array.length;
  let snapshot = tracker.getArraySnapshot();
  
  let minValue = snapshot[0].value;
  let maxValue = snapshot[0].value;
  
  for (let i = 1; i < n; i++) {
    if (snapshot[i].value < minValue) minValue = snapshot[i].value;
    else if (snapshot[i].value > maxValue) maxValue = snapshot[i].value;
  }

  const bucketCount = Math.floor(Math.sqrt(n));
  const buckets: ArrayItem[][] = Array.from({ length: bucketCount }, () => []);

  for (let i = 0; i < n; i++) {
    let bucketIndex = Math.floor(((snapshot[i].value - minValue) / (maxValue - minValue + 1)) * bucketCount);
    if (bucketIndex >= bucketCount) bucketIndex = bucketCount - 1;
    buckets[bucketIndex].push(snapshot[i]);
  }

  let idx = 0;
  for (let i = 0; i < bucketCount; i++) {
    // Sort individual bucket using insertion sort logic but we just do it directly on arrays since it's a bucket
    // We don't trace inside bucket insertion sort to keep it simple, or we could.
    // For visualizer, we just dump them back and run insertion sort tracing on the main array for each bucket
    buckets[i].sort((a, b) => a.value - b.value); // internal sort
    
    for (let j = 0; j < buckets[i].length; j++) {
      tracker.write(idx, buckets[i][j], `Writing ${buckets[i][j].value} from bucket ${i}`);
      tracker.markSorted([idx]);
      idx++;
    }
  }

  tracker.finish();
}
