import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { QuantityStepper } from './QuantityStepper';

const setup = (props: Partial<Parameters<typeof QuantityStepper>[0]> = {}) => {
  const onChange = vi.fn();
  const onRemove = vi.fn();
  render(
    <QuantityStepper
      value={2}
      onChange={onChange}
      onRemove={onRemove}
      itemLabel="Monstera"
      {...props}
    />,
  );
  return { onChange, onRemove };
};

describe('QuantityStepper', () => {
  it('increases and decreases the quantity', async () => {
    const { onChange } = setup({ value: 2 });

    await userEvent.click(screen.getByRole('button', { name: 'Verhoog aantal Monstera' }));
    expect(onChange).toHaveBeenLastCalledWith(3);

    await userEvent.click(screen.getByRole('button', { name: 'Verlaag aantal Monstera' }));
    expect(onChange).toHaveBeenLastCalledWith(1);
  });

  it('turns the minus into a trash button at quantity 1', async () => {
    const { onRemove } = setup({ value: 1 });

    expect(
      screen.queryByRole('button', { name: 'Verlaag aantal Monstera' }),
    ).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Verwijder Monstera' }));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it('disables plus at the maximum', () => {
    setup({ value: 99, max: 99 });
    expect(screen.getByRole('button', { name: 'Verhoog aantal Monstera' })).toBeDisabled();
  });

  it('accepts a typed quantity when leaving the field', async () => {
    const { onChange } = setup({ value: 2 });
    const input = screen.getByRole('textbox', { name: 'Aantal Monstera' });

    await userEvent.clear(input);
    await userEvent.type(input, '12');
    await userEvent.tab();

    expect(onChange).toHaveBeenCalledWith(12);
  });

  it('ignores letters and keeps the old value for an empty field', async () => {
    const { onChange } = setup({ value: 2 });
    const input = screen.getByRole('textbox', { name: 'Aantal Monstera' });

    await userEvent.clear(input);
    await userEvent.type(input, 'abc');
    await userEvent.tab();

    expect(onChange).not.toHaveBeenCalled();
    expect(input).toHaveValue('2');
  });
});
