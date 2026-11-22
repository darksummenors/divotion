import { formatPrice } from '../../../lib/format';

export type PriceProps = {
  amount: number;
  currency?: string;
  className?: string;
};

export function Price({ amount, currency = 'EUR', className }: PriceProps) {
  return <span className={className}>{formatPrice(amount, currency)}</span>;
}
