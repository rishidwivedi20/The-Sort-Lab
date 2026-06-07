import { bubbleSort, selectionSort, insertionSort } from './basic';
import { mergeSort, quickSort, heapSort } from './intermediate';
import { countingSort, radixSort, shellSort, bucketSort } from './advanced';
import { AlgorithmId, AlgorithmInfo, ArrayItem } from '../types';
import { SortTracker } from './tracker';

export const sortFunctionMap: Record<AlgorithmId, (array: ArrayItem[], tracker: SortTracker) => void> = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  merge: mergeSort,
  quick: quickSort,
  heap: heapSort,
  counting: countingSort,
  radix: radixSort,
  shell: shellSort,
  bucket: bucketSort,
};

export const ALGORITHM_INFO: Record<AlgorithmId, AlgorithmInfo> = {
  bubble: {
    id: 'bubble',
    name: 'Bubble Sort',
    category: 'Basic',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: true,
    inPlace: true,
    description: 'Bubble sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.'
  },
  selection: {
    id: 'selection',
    name: 'Selection Sort',
    category: 'Basic',
    timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: false,
    inPlace: true,
    description: 'Selection sort divides the input list into two parts: a sorted sublist of items which is built up from left to right, and a sublist of the remaining unsorted items.'
  },
  insertion: {
    id: 'insertion',
    name: 'Insertion Sort',
    category: 'Basic',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: true,
    inPlace: true,
    description: 'Insertion sort iterates, consuming one input element each repetition, and grows a sorted output list. At each iteration, it removes one element from the input data, finds the location it belongs within the sorted list, and inserts it there.'
  },
  merge: {
    id: 'merge',
    name: 'Merge Sort',
    category: 'Intermediate',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)',
    stable: true,
    inPlace: false,
    description: 'Merge sort is an efficient, general-purpose, and comparison-based sorting algorithm. Most implementations produce a stable sort. It is a divide-and-conquer algorithm.'
  },
  quick: {
    id: 'quick',
    name: 'Quick Sort',
    category: 'Intermediate',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    spaceComplexity: 'O(log n)',
    stable: false,
    inPlace: true,
    description: 'Quicksort is a divide-and-conquer algorithm. It works by selecting a pivot element and partitioning the other elements into two sub-arrays, according to whether they are less than or greater than the pivot.'
  },
  heap: {
    id: 'heap',
    name: 'Heap Sort',
    category: 'Intermediate',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(1)',
    stable: false,
    inPlace: true,
    description: 'Heapsort is a comparison-based sorting algorithm. Heapsort can be thought of as an improved selection sort: like selection sort, heapsort divides its input into a sorted and an unsorted region, and it iteratively shrinks the unsorted region by extracting the largest element from it and inserting it into the sorted region.'
  },
  counting: {
    id: 'counting',
    name: 'Counting Sort',
    category: 'Advanced',
    timeComplexity: { best: 'O(n+k)', average: 'O(n+k)', worst: 'O(n+k)' },
    spaceComplexity: 'O(k)',
    stable: true,
    inPlace: false,
    description: 'Counting sort is an integer sorting algorithm that operates by counting the number of objects that possess distinct key values, and applying prefix sum on those counts to determine the positions of each key value in the output sequence.'
  },
  radix: {
    id: 'radix',
    name: 'Radix Sort',
    category: 'Advanced',
    timeComplexity: { best: 'O(nk)', average: 'O(nk)', worst: 'O(nk)' },
    spaceComplexity: 'O(n+k)',
    stable: true,
    inPlace: false,
    description: 'Radix sort is a non-comparative sorting algorithm. It avoids comparison by creating and distributing elements into buckets according to their radix. For elements with more than one significant digit, this bucketing process is repeated for each digit.'
  },
  shell: {
    id: 'shell',
    name: 'Shell Sort',
    category: 'Advanced',
    timeComplexity: { best: 'O(n log n)', average: 'O(n(log n)²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: false,
    inPlace: true,
    description: 'Shellsort is an in-place comparison sort. It can be seen as either a generalization of sorting by exchange or sorting by insertion. The method starts by sorting pairs of elements far apart from each other, then progressively reducing the gap between elements to be compared.'
  },
  bucket: {
    id: 'bucket',
    name: 'Bucket Sort',
    category: 'Advanced',
    timeComplexity: { best: 'O(n+k)', average: 'O(n+k)', worst: 'O(n²)' },
    spaceComplexity: 'O(n)',
    stable: true,
    inPlace: false,
    description: 'Bucket sort is a sorting algorithm that works by distributing the elements of an array into a number of buckets. Each bucket is then sorted individually.'
  }
};
