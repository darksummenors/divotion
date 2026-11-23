import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithRouter } from '../../../test/test-utils';
import { Button, ButtonLink } from './Button';

describe('Button', () => {
  it('renders a real button with type="button" by default, so it never submits a form by accident', () => {
    render(<Button>Opslaan</Button>);
    expect(screen.getByRole('button', { name: 'Opslaan' })).toHaveAttribute('type', 'button');
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Opslaan</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Opslaan' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Opslaan
      </Button>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Opslaan' }));
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('ButtonLink', () => {
  it('renders a link to the given route', async () => {
    renderWithRouter(<ButtonLink to="/login">Inloggen</ButtonLink>);
    expect(await screen.findByRole('link', { name: 'Inloggen' })).toHaveAttribute('href', '/login');
  });
});
