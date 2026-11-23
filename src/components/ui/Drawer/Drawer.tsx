import { type MouseEvent, type ReactNode, useEffect, useId, useRef } from 'react';
import { IconButton } from '../IconButton/IconButton';
import styles from './Drawer.module.css';

export type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function Drawer({ isOpen, onClose, title, children, footer }: DrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      // Measure the scrollbar width, so the page doesn't jump when the scrollbar disappears
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);

      dialog.showModal();
    }

    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  // close if clicking outside target
  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.drawer}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={handleClick}
    >
      <div className={styles.panel}>
        <header className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <IconButton icon="close" label="Sluiten" onClick={onClose} />
        </header>

        <div className={styles.body}>{children}</div>

        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </dialog>
  );
}
