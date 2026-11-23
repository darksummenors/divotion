import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import '../../../test/dialog-polyfill';
import { Drawer } from './Drawer';

describe('Drawer', () => {
  it('is not shown while closed', () => {
    render(
      <Drawer isOpen={false} onClose={() => {}} title="Verlanglijst">
        Inhoud
      </Drawer>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens as a dialog named after its title', () => {
    render(
      <Drawer isOpen onClose={() => {}} title="Verlanglijst">
        Inhoud
      </Drawer>,
    );
    expect(screen.getByRole('dialog', { name: 'Verlanglijst' })).toHaveTextContent('Inhoud');
  });

  it('calls onClose from the close button', async () => {
    const onClose = vi.fn();
    render(
      <Drawer isOpen onClose={onClose} title="Verlanglijst">
        Inhoud
      </Drawer>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Sluiten' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when the backdrop is clicked, not when the content is clicked', async () => {
    const onClose = vi.fn();
    render(
      <Drawer isOpen onClose={onClose} title="Verlanglijst">
        Inhoud
      </Drawer>,
    );

    await userEvent.click(screen.getByText('Inhoud'));
    expect(onClose).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalled();
  });
});
