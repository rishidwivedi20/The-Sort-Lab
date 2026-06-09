import { useState, useEffect, useRef, useCallback } from 'react';
import { SortStep, SortMetrics, ArrayItem } from '../types';

interface UseSortControllerProps {
  steps: SortStep[];
  initialArray: ArrayItem[];
  workerMetrics?: SortMetrics;
  onFinish?: () => void;
}

export function useSortController({ steps, initialArray, workerMetrics, onFinish }: UseSortControllerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [metrics, setMetrics] = useState<SortMetrics>({ comparisons: 0, swaps: 0, writes: 0, executionTimeMs: 0 });

  const timerRef = useRef<number | null>(null);

  // Base interval in ms (for 1x speed). Larger arrays might need a smaller base interval.
  const baseInterval = Math.max(10, 200 - Math.min(200, (initialArray.length / 100) * 150));

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(-1);
    setMetrics({ comparisons: 0, swaps: 0, writes: 0, executionTimeMs: 0 });
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    if (currentStepIndex >= steps.length - 1) return;
    setIsPlaying(true);
  }, [currentStepIndex, steps.length]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const stepForward = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [currentStepIndex, steps.length]);

  const stepBackward = useCallback(() => {
    if (currentStepIndex > -1) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  useEffect(() => {
    // Re-calculate metrics up to current step
    let comps = 0, swps = 0, wrts = 0;
    for (let i = 0; i <= currentStepIndex; i++) {
      if (steps[i].type === 'compare') comps++;
      else if (steps[i].type === 'swap') swps++;
      else if (steps[i].type === 'write') wrts++;
    }
    setMetrics({ 
      comparisons: comps, 
      swaps: swps, 
      writes: wrts,
      executionTimeMs: workerMetrics?.executionTimeMs || 0
    });
  }, [currentStepIndex, steps, workerMetrics]);

  useEffect(() => {
    if (isPlaying) {
      const interval = baseInterval / speedMultiplier;
      timerRef.current = window.setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            if (timerRef.current !== null) clearInterval(timerRef.current);
            if (onFinish) onFinish();
            return prev;
          }
          return prev + 1;
        });
      }, interval);
    } else {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, speedMultiplier, steps.length, baseInterval, onFinish]);

  const currentStep = currentStepIndex >= 0 && currentStepIndex < steps.length ? steps[currentStepIndex] : null;
  const currentArrayState = currentStep ? currentStep.arrayState : initialArray;

  // Track sorted indices up to current step
  const sortedIndices = new Set<number>();
  for (let i = 0; i <= currentStepIndex; i++) {
    if (steps[i].type === 'sorted') {
      steps[i].indices.forEach(idx => sortedIndices.add(idx));
    }
  }

  return {
    currentStepIndex,
    currentStep,
    currentArrayState,
    isPlaying,
    speedMultiplier,
    setSpeedMultiplier,
    metrics,
    play,
    pause,
    reset,
    stepForward,
    stepBackward,
    sortedIndices: Array.from(sortedIndices),
    isFinished: currentStepIndex >= 0 && currentStepIndex >= steps.length - 1,
    totalSteps: steps.length
  };
}
