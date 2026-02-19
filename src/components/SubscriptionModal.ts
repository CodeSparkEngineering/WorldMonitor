// Subscription Modal Component
// Displays pricing and handles Stripe checkout



export class SubscriptionModal {
  private modal: HTMLElement | null = null;
  // Removed unused isVisible property

  constructor() {
    this.createModal();
  }

  private createModal(): void {
    const modal = document.createElement('div');
    modal.className = 'subscription-modal';
    modal.innerHTML = `
      <div class="subscription-overlay"></div>
      <div class="subscription-content">
        <button class="subscription-close" aria-label="Close">&times;</button>
        
        <div class="form-group">
          <label>Select Plan</label>
          <select id="sub-plan">
            <option value="monthly">Monthly Access ($19.90/mo)</option>
            <option value="annual">Annual Access ($159.00/yr)</option>
          </select>
        </div>
        <div class="plan-price">
              <span class="currency">$</span>
              <span class="amount">19.90</span>
              <span class="period">/month</span>
            </div>
            <ul class="plan-features">
              <li>✓ Real-time global intelligence</li>
              <li>✓ AI-powered news summaries</li>
              <li>✓ 100+ curated data feeds</li>
              <li>✓ Interactive geospatial maps</li>
              <li>✓ Market signals & predictions</li>
              <li>✓ Unlimited access</li>
            </ul>
            <button class="plan-button" data-price-id="monthly">
              Subscribe Monthly
            </button>
          </div>

          <div class="plan-card plan-annual" data-plan="annual">
            <div class="plan-badge best-value">Best Value - Save 33%</div>
            <h3>Annual</h3>
            <div class="plan-price">
              <span class="currency">$</span>
              <span class="amount">159</span>
              <span class="period">/year</span>
            </div>
            <div class="plan-savings">Save $80/year</div>
            <ul class="plan-features">
              <li>✓ Everything in Monthly</li>
              <li>✓ Priority support</li>
              <li>✓ Early access to features</li>
              <li>✓ Cancel anytime</li>
            </ul>
            <button class="plan-button plan-button-primary" data-price-id="annual">
              Subscribe Annually
            </button>
          </div>
        </div>

        <div class="subscription-footer">
          <p>Powered by <strong>CodeSpark Engineering</strong></p>
          <p class="secure-note">🔒 Secure payment via Stripe</p>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modal = modal;

    // Event listeners
    modal.querySelector('.subscription-close')?.addEventListener('click', () => this.hide());
    modal.querySelector('.subscription-overlay')?.addEventListener('click', () => this.hide());

    // Subscribe buttons
    modal.querySelectorAll('.plan-button').forEach(button => {
      button.addEventListener('click', (e) => {
        const priceId = (e.target as HTMLElement).dataset.priceId;
        if (priceId) this.handleSubscribe(priceId);
      });
    });

    this.addStyles();
  }

  private async handleSubscribe(plan: string): Promise<void> {
    const email = prompt('Enter your email for subscription:');
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      // Get Stripe price ID from environment
      const priceId = plan === 'monthly'
        ? import.meta.env.VITE_STRIPE_MONTHLY_PRICE_ID
        : import.meta.env.VITE_STRIPE_ANNUAL_PRICE_ID;

      if (!priceId) {
        alert('Subscription not configured. Please contact support.');
        return;
      }

      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, email }),
      });

      const { sessionId, error } = await response.json();

      if (error) {
        alert(`Error: ${error}`);
        return;
      }

      // Redirect to Stripe checkout
      const stripe = (window as any).Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('[Subscription] Error:', error);
      alert('Failed to start checkout. Please try again.');
    }
  }

  show(): void {
    if (this.modal) {
      this.modal.style.display = 'flex';
    }
  }

  hide(): void {
    if (this.modal) {
      this.modal.style.display = 'none';
    }
  }

  private addStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .subscription-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10000;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }

      .subscription-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(8px);
      }

      .subscription-content {
        position: relative;
        background: linear-gradient(135deg, #1a1f1a 0%, #0f140f 100%);
        border: 1px solid rgba(76, 175, 80, 0.3);
        border-radius: 16px;
        max-width: 900px;
        max-height: 90vh;
        overflow-y: auto;
        padding: 40px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      }

      .subscription-close {
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        color: #fff;
        font-size: 32px;
        cursor: pointer;
        opacity: 0.6;
        transition: opacity 0.2s;
      }

      .subscription-close:hover {
        opacity: 1;
      }

      .subscription-header {
        text-align: center;
        margin-bottom: 40px;
      }

      .subscription-header h1 {
        font-size: 32px;
        color: #4caf50;
        margin: 0 0 10px 0;
      }

      .subscription-header p {
        color: #aaa;
        font-size: 16px;
        margin: 0;
      }

      .subscription-plans {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 24px;
        margin-bottom: 32px;
      }

      .plan-card {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 32px 24px;
        position: relative;
        transition: transform 0.2s, border-color 0.2s;
      }

      .plan-card:hover {
        transform: translateY(-4px);
        border-color: rgba(76, 175, 80, 0.5);
      }

      .plan-annual {
        border-color: rgba(76, 175, 80, 0.4);
        background: rgba(76, 175, 80, 0.08);
      }

      .plan-badge {
        position: absolute;
        top: -12px;
        left: 50%;
        transform: translateX(-50%);
        background: #4caf50;
        color: #000;
        padding: 4px 16px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
      }

      .plan-badge.best-value {
        background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
      }

      .plan-card h3 {
        font-size: 24px;
        color: #fff;
        margin: 0 0 16px 0;
        text-align: center;
      }

      .plan-price {
        text-align: center;
        margin-bottom: 8px;
      }

      .plan-price .currency {
        font-size: 24px;
        color: #4caf50;
        vertical-align: top;
      }

      .plan-price .amount {
        font-size: 48px;
        font-weight: 700;
        color: #fff;
      }

      .plan-price .period {
        font-size: 16px;
        color: #888;
      }

      .plan-savings {
        text-align: center;
        color: #ffd700;
        font-size: 14px;
        margin-bottom: 16px;
        font-weight: 600;
      }

      .plan-features {
        list-style: none;
        padding: 0;
        margin: 24px 0;
      }

      .plan-features li {
        padding: 8px 0;
        color: #ccc;
        font-size: 14px;
      }

      .plan-button {
        width: 100%;
        padding: 14px 24px;
        background: rgba(76, 175, 80, 0.2);
        border: 1px solid #4caf50;
        border-radius: 8px;
        color: #4caf50;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }

      .plan-button:hover {
        background: #4caf50;
        color: #000;
      }

      .plan-button-primary {
        background: #4caf50;
        color: #000;
      }

      .plan-button-primary:hover {
        background: #66bb6a;
      }

      .subscription-trial {
        text-align: center;
        padding: 24px 0;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        margin-bottom: 24px;
      }

      .trial-button {
        padding: 14px 32px;
        background: transparent;
        border: 2px solid #4caf50;
        border-radius: 8px;
        color: #4caf50;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }

      .trial-button:hover {
        background: rgba(76, 175, 80, 0.1);
      }

      .trial-note {
        margin: 12px 0 0 0;
        color: #888;
        font-size: 13px;
      }

      .subscription-footer {
        text-align: center;
        color: #666;
        font-size: 13px;
      }

      .subscription-footer p {
        margin: 8px 0;
      }

      .secure-note {
        color: #4caf50;
      }
    `;
    document.head.appendChild(style);
  }
}
