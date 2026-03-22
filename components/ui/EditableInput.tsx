import { useState, useEffect, ChangeEvent, FocusEvent } from 'react';
import clsx from 'clsx';
// Assuming you already have a Tooltip component — adjust if needed
import Tooltip from './Tooltip'; // or wherever it lives

interface EditableInputProps {
  label: string;
  value: number;                    // controlled value from parent (always a number)
  onChange: (newValue: number) => void;
  disabled?: boolean;
  tooltip?: string;
  step?: number;
  min?: number;
  max?: number;
  placeholder?: string;             // optional
  className?: string;               // optional extra classes for the input
}

/**
 * A number input that allows natural typing (empty, partial decimals, etc.)
 * while only calling onChange with valid numbers.
 * Reverts to last valid value on blur if input is invalid/empty.
 */
export function EditableInput({
  label,
  value,
  onChange,
  disabled = false,
  tooltip,
  step = 0.01,
  min,
  max,
  placeholder = '',
  className = '',
}: EditableInputProps) {
  const [displayValue, setDisplayValue] = useState<string>(value.toString());

  // Keep local display in sync when parent value changes externally
  useEffect(() => {
    setDisplayValue(value.toString());
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    // Allow any typing — even invalid states
    setDisplayValue(input);

    // Try to parse — only call onChange if we get a real number
    const num = parseFloat(input);
    if (!isNaN(num)) {
      // Optional: enforce min/max right away
      let clamped = num;
      if (min !== undefined) clamped = Math.max(min, clamped);
      if (max !== undefined) clamped = Math.min(max, clamped);

      onChange(clamped);
    }
    // If invalid → parent keeps previous valid number (intentional)
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const input = e.target.value.trim();
    const num = parseFloat(input);

    if (isNaN(num) || input === '') {
      // Revert to last known valid value from parent
      setDisplayValue(value.toString());
    } else {
      // Clean up display (remove trailing decimal junk if any)
      const cleaned = num.toString();
      setDisplayValue(cleaned);
      onChange(num); // make sure parent has clean value
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1 flex items-center">
        {label}
        {tooltip && (
          <span className="ml-2">
            <Tooltip content={tooltip}>
              <span className="text-gray-400 cursor-help">?</span>
            </Tooltip>
          </span>
        )}
      </label>

      <input
        type="text"                     // ← using text instead of number → better control
        inputMode="decimal"             // good mobile keyboard (numbers + decimal)
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder={placeholder}
        step={step}                     // still works with inputMode
        min={min}
        max={max}
        className={clsx(
          'w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm',
          'focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500',
          disabled && 'opacity-50 cursor-not-allowed bg-gray-800',
          className
        )}
      />
    </div>
  );
}