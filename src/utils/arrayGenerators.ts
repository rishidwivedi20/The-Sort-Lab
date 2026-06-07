import { ArrayItem } from '../types';

export type ArrayDistribution = 'random' | 'nearly_sorted' | 'reversed' | 'many_duplicates' | 'few_unique';

const generateId = () => Math.random().toString(36).substring(2, 9);

export function generateArray(size: number, distribution: ArrayDistribution): ArrayItem[] {
  let values: number[] = [];
  
  switch (distribution) {
    case 'random':
      for (let i = 0; i < size; i++) {
        values.push(Math.floor(Math.random() * 100) + 1);
      }
      break;
      
    case 'nearly_sorted':
      for (let i = 0; i < size; i++) {
        values.push(Math.floor((i / size) * 100) + 1);
      }
      // Swap a few elements
      const swapCount = Math.max(1, Math.floor(size * 0.05));
      for (let i = 0; i < swapCount; i++) {
        const idx1 = Math.floor(Math.random() * size);
        const idx2 = Math.floor(Math.random() * size);
        [values[idx1], values[idx2]] = [values[idx2], values[idx1]];
      }
      break;
      
    case 'reversed':
      for (let i = 0; i < size; i++) {
        values.push(Math.floor(((size - i) / size) * 100) + 1);
      }
      break;
      
    case 'many_duplicates':
      // Pick 5 random values
      const pool = Array.from({ length: 5 }, () => Math.floor(Math.random() * 100) + 1);
      for (let i = 0; i < size; i++) {
        values.push(pool[Math.floor(Math.random() * pool.length)]);
      }
      break;
      
    case 'few_unique':
      // Pick 3 unique values
      const poolFew = [10, 50, 90];
      for (let i = 0; i < size; i++) {
        values.push(poolFew[Math.floor(Math.random() * poolFew.length)]);
      }
      break;
  }

  // Convert to ArrayItem with stability labels for duplicates
  const valueCounts = new Map<number, number>();
  
  return values.map((val) => {
    const count = (valueCounts.get(val) || 0) + 1;
    valueCounts.set(val, count);
    
    // Label for stability tracking e.g. A, B, C...
    const label = String.fromCharCode(64 + count); 
    
    return {
      value: val,
      id: generateId(),
      label: count > 1 ? label : 'A' // if only 1, it's A. if next comes, it's B. Actually to keep it simple, always label based on occurrence.
    };
  });
}

export function parseCustomInput(input: string): ArrayItem[] | null {
  const parts = input.split(',').map(s => s.trim()).filter(s => s.length > 0);
  const values = parts.map(p => parseInt(p, 10));
  
  if (values.length === 0 || values.some(isNaN)) {
    return null; // invalid
  }

  const valueCounts = new Map<number, number>();
  return values.map((val) => {
    const count = (valueCounts.get(val) || 0) + 1;
    valueCounts.set(val, count);
    return {
      value: val,
      id: generateId(),
      label: String.fromCharCode(64 + count)
    };
  });
}
