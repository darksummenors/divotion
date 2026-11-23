/**
 * jsdom (the simulated browser Vitest uses) has <dialog> but not its methods.
 * This minimal stand-in mimics what the Drawer relies on: showModal() opens it,
 * close() closes it and fires the "close" event. Real dialog behaviour
 * (focus trap, Esc, backdrop) is tested in a real browser.
 */
if (typeof HTMLDialogElement !== 'undefined' && !HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    if (!this.hasAttribute('open')) return;
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
}

export {};
