import React, { ReactNode } from 'react';
import { Tooltip } from './Tooltip';
import clsx from 'clsx';

interface SliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
  tooltip?: ReactNode;
}

export function Slider({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  disabled = false,
  tooltip
}: SliderProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1 flex items-center">
        {label}: {value}
        {tooltip && (
          <span className="ml-2">
            <Tooltip content={tooltip}>
              <span className="text-gray-400 cursor-help">?</span>
            </Tooltip>
          </span>
        )}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={clsx(
          'w-full h-2 bg-gray-700 rounded-lg appearance-none',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        )}
      />
    </div>
  );
}
