import { type KeyboardEvent, useState } from 'react';
import { IconButton } from '../IconButton/IconButton';
import styles from './QuantityStepper.module.css';

export type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  onRemove?: () => void;
  min?: number;
  max?: number;
  itemLabel: string;
};

export function QuantityStepper({
  value,
  onChange,
  onRemove,
  min = 1,
  max = 99,
  itemLabel,
}: QuantityStepperProps) {
  // While typing, the field shows the draft; otherwise it shows the real value
  const [draft, setDraft] = useState<string | null>(null);
  const showRemove = value <= min && onRemove !== undefined;

  const commit = () => {
    if (draft === null) return;

    setDraft(null);
    const parsed = Number.parseInt(draft, 10);

    if (Number.isNaN(parsed)) return;

    const next = Math.min(max, Math.max(min, parsed));

    if (next !== value) onChange(next);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') commit();
    if (event.key === 'Escape' && draft !== null) {
      event.preventDefault();
      setDraft(null);
    }
  };

  // At the minimum quantity, the minus button becomes a trash button
  return (
    <div className={styles.stepper} role="group" aria-label={`Aantal ${itemLabel}`}>
      {showRemove ? (
        <IconButton icon="trash" size="sm" label={`Verwijder ${itemLabel}`} onClick={onRemove} />
      ) : (
        <IconButton
          icon="minus"
          size="sm"
          label={`Verlaag aantal ${itemLabel}`}
          onClick={() => onChange(value - 1)}
          disabled={value <= min}
        />
      )}

      <input
        className={styles.input}
        type="text"
        inputMode="numeric"
        aria-label={`Aantal ${itemLabel}`}
        value={draft ?? String(value)}
        maxLength={String(max).length}
        onChange={(event) => setDraft(event.target.value.replace(/\D/g, ''))}
        onBlur={commit}
        onKeyDown={handleKeyDown}
      />

      <IconButton
        icon="plus"
        size="sm"
        label={`Verhoog aantal ${itemLabel}`}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
      />
    </div>
  );
}
