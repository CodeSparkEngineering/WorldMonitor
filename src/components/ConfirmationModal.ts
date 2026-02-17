export class ConfirmationModal {
    private element: HTMLElement;
    private onConfirm: (() => void) | null = null;
    private onCancel: (() => void) | null = null;

    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'confirmation-overlay';
        this.element.innerHTML = `
      <div class="confirmation-modal">
        <div class="confirmation-header">
          <span class="confirmation-title"></span>
        </div>
        <div class="confirmation-content">
          <p class="confirmation-message"></p>
        </div>
        <div class="confirmation-footer">
          <button class="confirmation-btn-cancel">Cancel</button>
          <button class="confirmation-btn-confirm">Confirm</button>
        </div>
      </div>
    `;

        document.body.appendChild(this.element);
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.element.querySelector('.confirmation-btn-cancel')?.addEventListener('click', () => {
            this.dismiss();
        });

        this.element.querySelector('.confirmation-btn-confirm')?.addEventListener('click', () => {
            if (this.onConfirm) {
                this.onConfirm();
            }
            this.dismiss();
        });

        this.element.addEventListener('click', (e) => {
            if ((e.target as HTMLElement).classList.contains('confirmation-overlay')) {
                this.dismiss();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.element.classList.contains('active')) {
                this.dismiss();
            }
        });
    }

    public show(title: string, message: string, onConfirm: () => void, onCancel?: () => void): void {
        const titleEl = this.element.querySelector('.confirmation-title');
        const messageEl = this.element.querySelector('.confirmation-message');

        if (titleEl) titleEl.textContent = title;
        if (messageEl) messageEl.textContent = message;

        this.onConfirm = onConfirm;
        this.onCancel = onCancel || null;

        this.element.classList.add('active');
    }

    private dismiss(): void {
        this.element.classList.remove('active');
        if (this.onCancel) {
            // clear onCancel so it doesn't trigger unexpectedly if we re-use logic
            const callback = this.onCancel;
            this.onCancel = null;
            callback();
        }
        this.onConfirm = null;
    }
}
