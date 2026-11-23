import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('shows the count', () => {
    const { container } = render(<Badge count={3} />);
    expect(container).toHaveTextContent('3');
  });

  it('renders nothing when the count is 0', () => {
    const { container } = render(<Badge count={0} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('caps large numbers', () => {
    const { container } = render(<Badge count={150} max={99} />);
    expect(container).toHaveTextContent('99+');
  });
});
