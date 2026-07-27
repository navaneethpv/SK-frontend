import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const router = useRouter();
  const { cart, cartCount, subtotal, isCartDrawerOpen, setIsCartDrawerOpen, updateQuantity, removeFromCart } = useCart();

  if (!isCartDrawerOpen) return null;

  const freeShippingThreshold = 1000;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="cart-drawer-overlay">
      <div className="cart-drawer-backdrop" onClick={() => setIsCartDrawerOpen(false)} />

      <div className="cart-drawer-panel">
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-row">
            <ShoppingBag size={20} color="#121316" />
            <h2 className="drawer-title">Your Cart ({cartCount})</h2>
          </div>
          <button onClick={() => setIsCartDrawerOpen(false)} className="close-btn" aria-label="Close Cart">
            <X size={22} color="#121316" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="shipping-progress-box">
          {remainingForFreeShipping > 0 ? (
            <p className="shipping-msg">
              Add <strong>₹{remainingForFreeShipping.toFixed(0)}</strong> more to get <strong>FREE Shipping</strong>!
            </p>
          ) : (
            <p className="shipping-msg success">
              🎉 Congratulations! You unlocked <strong>FREE Shipping</strong>!
            </p>
          )}
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="drawer-items-list">
          {cart.length === 0 ? (
            <div className="empty-cart-state">
              <ShoppingBag size={48} color="#D1D5DB" />
              <p className="empty-title">Your cart is empty</p>
              <p className="empty-desc">Explore our luxury fragrances and grooming essentials.</p>
              <button onClick={() => setIsCartDrawerOpen(false)} className="start-shopping-btn">
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item-row">
                <div className="item-img-box">
                  <img src={item.img} alt={item.title} className="item-img" />
                </div>

                <div className="item-details">
                  <h3 className="item-title">{item.title}</h3>
                  {item.variant && <span className="item-variant">Size: {item.variant}</span>}
                  <div className="item-price-row">
                    <span className="item-price">₹{item.price.toFixed(0)}</span>
                    {item.originalPrice && (
                      <span className="item-orig-price">₹{item.originalPrice.toFixed(0)}</span>
                    )}
                  </div>

                  <div className="qty-controls">
                    <div className="qty-picker">
                      <button onClick={() => updateQuantity(item.id, -1)} className="qty-btn">-</button>
                      <span className="qty-num">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="qty-btn">+</button>
                    </div>

                    <button onClick={() => removeFromCart(item.id)} className="remove-btn" aria-label="Remove Item">
                      <Trash2 size={16} color="#9CA3AF" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="drawer-footer">
            <div className="subtotal-row">
              <span className="subtotal-label">Subtotal</span>
              <span className="subtotal-amount">₹{subtotal.toFixed(0)}</span>
            </div>
            <p className="subtotal-note">Taxes and shipping calculated at checkout.</p>

            <div className="footer-actions-row">
              <Link href="/cart" onClick={() => setIsCartDrawerOpen(false)} className="view-cart-btn">
                View Full Cart
              </Link>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  router.push('/checkout');
                }}
                className="checkout-primary-btn"
              >
                Checkout <ArrowRight size={16} />
              </button>
            </div>

            <div className="security-guarantee">
              <ShieldCheck size={14} color="#10B981" />
              <span>100% Secure Checkout Guaranteed</span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .cart-drawer-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          justify-content: flex-end;
        }

        .cart-drawer-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          animation: fadeIn 0.3s ease;
        }

        .cart-drawer-panel {
          position: relative;
          width: 100%;
          max-width: 440px;
          height: 100%;
          background: #ffffff;
          box-shadow: -10px 0 30px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          z-index: 2;
          animation: slideLeft 0.3s ease;
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.2rem 1.5rem;
          border-bottom: 1px solid #E5E7EB;
        }

        .drawer-title-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .drawer-title {
          font-family: var(--font-sans);
          font-size: 1.1rem;
          font-weight: 700;
          color: #121316;
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.3rem;
          display: flex;
          align-items: center;
        }

        /* Shipping Box */
        .shipping-progress-box {
          background-color: #FAF8F5;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #E5E7EB;
        }

        .shipping-msg {
          font-size: 0.8rem;
          color: #4B5563;
          margin-bottom: 0.5rem;
        }

        .shipping-msg.success {
          color: #059669;
        }

        .progress-bar-track {
          width: 100%;
          height: 6px;
          background-color: #E5E7EB;
          border-radius: 99px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #EAB308 0%, #10B981 100%);
          border-radius: 99px;
          transition: width 0.4s ease;
        }

        /* Items List */
        .drawer-items-list {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .empty-cart-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          height: 100%;
          gap: 0.8rem;
        }

        .empty-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #121316;
        }

        .empty-desc {
          font-size: 0.85rem;
          color: #6B7280;
          max-width: 240px;
        }

        .start-shopping-btn {
          margin-top: 0.5rem;
          background-color: #121316;
          color: #ffffff;
          border: none;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 0.7rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
        }

        .cart-item-row {
          display: flex;
          gap: 1rem;
          padding-bottom: 1.2rem;
          border-bottom: 1px solid #F3F4F6;
        }

        .item-img-box {
          width: 76px;
          height: 76px;
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          padding: 0.4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          flex-shrink: 0;
        }

        .item-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .item-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .item-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: #121316;
          line-height: 1.3;
        }

        .item-variant {
          font-size: 0.75rem;
          color: #6B7280;
        }

        .item-price-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .item-price {
          font-size: 0.95rem;
          font-weight: 800;
          color: #121316;
        }

        .item-orig-price {
          font-size: 0.75rem;
          color: #9CA3AF;
          text-decoration: line-through;
        }

        .qty-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.4rem;
        }

        .qty-picker {
          display: flex;
          align-items: center;
          border: 1px solid #D1D5DB;
          border-radius: 4px;
          height: 28px;
        }

        .qty-btn {
          width: 26px;
          height: 100%;
          background: none;
          border: none;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          color: #374151;
        }

        .qty-num {
          padding: 0 0.5rem;
          font-size: 0.8rem;
          font-weight: 700;
          color: #121316;
        }

        .remove-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.2rem;
          display: flex;
          align-items: center;
        }

        /* Drawer Footer */
        .drawer-footer {
          padding: 1.5rem;
          border-top: 1px solid #E5E7EB;
          background-color: #ffffff;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .subtotal-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .subtotal-label {
          font-size: 0.95rem;
          font-weight: 700;
          color: #121316;
        }

        .subtotal-amount {
          font-size: 1.25rem;
          font-weight: 800;
          color: #121316;
        }

        .subtotal-note {
          font-size: 0.75rem;
          color: #6B7280;
        }

        .footer-actions-row {
          display: flex;
          gap: 0.8rem;
          margin-top: 0.4rem;
        }

        .view-cart-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #D1D5DB;
          border-radius: 6px;
          color: #121316;
          font-size: 0.8rem;
          font-weight: 700;
          height: 44px;
          transition: background 0.2s ease;
        }

        .view-cart-btn:hover {
          background: #F3F4F6;
        }

        .checkout-primary-btn {
          flex: 1.4;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          background-color: #121316;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 700;
          height: 44px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .checkout-primary-btn:hover {
          background-color: #C39F68;
        }

        .security-guarantee {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.3rem;
          font-size: 0.72rem;
          color: #6B7280;
          margin-top: 0.2rem;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
