import React, { useState } from 'react';
import { Play, Pause, Square, RotateCcw, SkipForward, SkipBack } from 'lucide-react';
import { ArrayDistribution, parseCustomInput } from '../utils/arrayGenerators';
import { ArrayItem } from '../types';

interface ControlPanelProps {
  onGenerate: (size: number, distribution: ArrayDistribution) => void;
  onCustomInput: (array: ArrayItem[]) => void;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  isFinished: boolean;
  canStepForward: boolean;
  canStepBackward: boolean;
  disabled: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onGenerate,
  onCustomInput,
  isPlaying,
  onPlay,
  onPause,
  onStop,
  onReset,
  onStepForward,
  onStepBackward,
  speed,
  onSpeedChange,
  isFinished,
  canStepForward,
  canStepBackward,
  disabled
}) => {
  const [size, setSize] = useState<number>(50);
  const [distribution, setDistribution] = useState<ArrayDistribution>('random');
  const [customInput, setCustomInput] = useState('');

  const sizes = [10, 25, 50, 100, 250, 500, 1000];
  const speeds = [0.25, 0.5, 1, 2, 5];

  const handleGenerateClick = () => {
    onGenerate(size, distribution);
  };

  const handleCustomInputSubmit = () => {
    const parsed = parseCustomInput(customInput);
    if (parsed) {
      onCustomInput(parsed);
      setCustomInput('');
    } else {
      alert('Invalid input. Please enter comma-separated numbers.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="card space-y-4">
        <h3 className="text-sm font-semibold text-text uppercase tracking-wider">Dataset</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-textMuted mb-1">Distribution</label>
            <select 
              value={distribution} 
              onChange={e => setDistribution(e.target.value as ArrayDistribution)}
              className="select-base"
              disabled={disabled || isPlaying}
            >
              <option value="random">Random</option>
              <option value="nearly_sorted">Nearly Sorted</option>
              <option value="reversed">Reverse Sorted</option>
              <option value="many_duplicates">Many Duplicates</option>
              <option value="few_unique">Few Unique Values</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-textMuted mb-1">Array Size: {size}</label>
            <input 
              type="range" 
              min={0} 
              max={sizes.length - 1} 
              value={sizes.indexOf(size)} 
              onChange={e => setSize(sizes[parseInt(e.target.value)])}
              className="w-full accent-accent"
              disabled={disabled || isPlaying}
            />
            <div className="flex justify-between text-[10px] text-textMuted mt-1">
              <span>{sizes[0]}</span>
              <span>{sizes[sizes.length - 1]}</span>
            </div>
          </div>

          <button 
            onClick={handleGenerateClick}
            disabled={disabled || isPlaying}
            className="w-full btn-secondary"
          >
            Generate New Array
          </button>
        </div>

        <div className="pt-2 border-t border-border">
          <label className="block text-xs text-textMuted mb-1">Custom Input (comma separated)</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              placeholder="e.g. 5, 2, 9, 1"
              className="select-base flex-1"
              disabled={disabled || isPlaying}
            />
            <button 
              onClick={handleCustomInputSubmit}
              disabled={disabled || isPlaying || !customInput}
              className="btn-secondary px-3"
            >
              Load
            </button>
          </div>
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="text-sm font-semibold text-text uppercase tracking-wider">Controls</h3>
        
        <div className="flex justify-center gap-2">
          <button 
            onClick={onStepBackward} 
            disabled={disabled || isPlaying || !canStepBackward}
            className="btn-ghost p-2 rounded-full"
            title="Step Backward"
          >
            <SkipBack size={20} />
          </button>
          
          {!isPlaying && !isFinished ? (
            <button 
              onClick={onPlay} 
              disabled={disabled || !canStepForward}
              className="btn-primary p-3 rounded-full shadow-md shadow-accent/20"
              title="Play"
            >
              <Play size={24} className="ml-1" />
            </button>
          ) : (
            <button 
              onClick={onPause} 
              disabled={disabled || isFinished}
              className="btn-secondary p-3 rounded-full"
              title="Pause"
            >
              <Pause size={24} />
            </button>
          )}

          <button 
            onClick={onStepForward} 
            disabled={disabled || isPlaying || !canStepForward}
            className="btn-ghost p-2 rounded-full"
            title="Step Forward"
          >
            <SkipForward size={20} />
          </button>
        </div>

        <div className="flex justify-center gap-2 pt-2">
          <button 
            onClick={onReset} 
            disabled={disabled || isPlaying}
            className="btn-secondary py-1 px-3 text-xs flex items-center gap-1"
          >
            <RotateCcw size={14} /> Reset
          </button>
          <button 
            onClick={onStop} 
            disabled={disabled || (!isPlaying && !canStepBackward)}
            className="btn-secondary py-1 px-3 text-xs flex items-center gap-1 text-red-500 hover:text-red-600 dark:hover:text-red-400"
          >
            <Square size={14} /> Stop
          </button>
        </div>

        <div className="pt-4 border-t border-border">
          <label className="block text-xs text-textMuted mb-2 text-center">Playback Speed</label>
          <div className="flex justify-center bg-background rounded-md p-1 border border-border">
            {speeds.map(s => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`flex-1 py-1 text-xs rounded transition-colors ${speed === s ? 'bg-surface text-text shadow-sm' : 'text-textMuted hover:text-text'}`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
