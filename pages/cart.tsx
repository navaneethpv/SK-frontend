import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, ShieldCheck, Tag } from 'lucide-react';
import Header from '@/SK/components/Header';
import Footer from '@/SK/components/Footer';
import { useCart } from '@/SK/context/CartContext';

export default function CartPage() {
  const { cart, cartCount, subtotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponSuccess, setCouponSuccess] = useState(false);

  const shippingCost = subtotal >= 1000 || subtotal === 0 ? 0 : 99;
  const finalTotal = Math.max(0, subtotal - appliedDiscount + shippingCost);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'SK10' || couponCode.trim().toUpperCase() === 'WELCOME') {
      const discount = subtotal * 0.1;
      setAppliedDiscount(discount);
      setCouponSuccess(true);
    } else if (couponCode.trim()) {
      alert('Invalid Promo Code. Try "SK10" for 10% OFF!');
    }
  };

  return (
    <>
      <Head>
        <title>Your Shopping Cart | SK</title>
        <meta name="description" content="View items in your SK shopping cart, apply promotional discount codes, and proceed to checkout." />
      </Head>

      <div className="cart-page-wrapper">
        <Header />

        <main className="cart-main-container">
          <div className="container">
            {/* Breadcrumbs */}
            <div className="breadcrumbs">
              <Link href="/">Home</Link> &gt; <span className="active">Shopping Cart</span>
            </div>

            <h1 className="page-title">Shopping Cart ({cartCount})</h1>

            {cart.length === 0 ? (
              <div className="empty-cart-card">
                <ShoppingBag size={64} color="#D1D5DB" />
                <h2 className="empty-heading">Your cart is currently empty</h2>
                <p className="empty-text">Before proceeding to checkout you must add some products to your shopping cart.</p>
                <Link href="/" className="continue-btn">
                  <ArrowLeft size={16} /> Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="cart-content-grid">
                {/* Left Column: Items Table */}
                <div className="items-column">
                  <div className="items-header-bar">
                    <span>Product</span>
                    <span>Quantity</span>
                    <span>Total</span>
                  </div>

                  <div className="items-list">
                    {cart.map((item) => (
                      <div key={item.id} className="cart-item-card">
                        <div className="product-info-group">
                          <div className="img-box">
                            <img src={item.img} alt={item.title} />
                          </div>
                          <div className="details-box">
                            <h3 className="item-name">{item.title}</h3>
                            {item.variant && <span className="item-variant">Size: {item.variant}</span>}
                            <span className="item-unit-price">₹{item.price.toFixed(0)}</span>
                          </div>
                        </div>

                        <div className="qty-group">
                          <div className="qty-picker">
                            <button onClick={() => updateQuantity(item.id, -1)} className="qty-btn">-</button>
                            <span className="qty-val">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="qty-btn">+</button>
                          </div>
                        </div>

                        <div className="total-group">
                          <span className="item-total-price">₹{(item.price * item.quantity).toFixed(0)}</span>
                          <button onClick={() => removeFromCart(item.id)} className="delete-btn" aria-label="Remove item">
                            <Trash2 size={16} color="#9CA3AF" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="cart-table-footer">
                    <Link href="/" className="back-link">
                      <ArrowLeft size={16} /> Continue Shopping
                    </Link>
                    <button onClick={clearCart} className="clear-cart-link">
                      Clear Shopping Cart
                    </button>
                  </div>
                </div>

                {/* Right Column: Summary Card */}
                <div className="summary-column">
                  <div className="summary-card">
                    <h2 className="summary-title">Order Summary</h2>

                    {/* Coupon Input */}
                    <form onSubmit={handleApplyCoupon} className="coupon-form">
                      <div className="coupon-input-box">
                        <Tag size={16} color="#9CA3AF" />
                        <input
                          type="text"
                          placeholder="Promo code (e.g. SK10)"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="coupon-input"
                        />
                      </div>
                      <button type="submit" className="apply-coupon-btn">Apply</button>
                    </form>
                    {couponSuccess && <p className="coupon-msg">✓ 10% Discount Applied!</p>}

                    <div className="summary-lines">
                      <div className="summary-line">
                        <span>Subtotal</span>
                        <span className="line-val">₹{subtotal.toFixed(0)}</span>
                      </div>

                      {appliedDiscount > 0 && (
                        <div className="summary-line discount">
                          <span>Promo Discount</span>
                          <span className="line-val">-₹{appliedDiscount.toFixed(0)}</span>
                        </div>
                      )}

                      <div className="summary-line">
                        <span>Estimated Shipping</span>
                        <span className="line-val">
                          {shippingCost === 0 ? <strong style={{ color: '#10B981' }}>FREE</strong> : `₹${shippingCost}`}
                        </span>
                      </div>

                      <div className="divider-line" />

                      <div className="summary-line total-line">
                        <span>Total</span>
                        <span className="total-val">₹{finalTotal.toFixed(0)}</span>
                      </div>
                    </div>

                    <Link href="/checkout" className="checkout-btn">
                      Proceed to Checkout <ArrowRight size={18} />
                    </Link>

                    <div className="secure-badge">
                      <ShieldCheck size={16} color="#10B981" />
                      <span>Encrypted 256-Bit SSL Checkout</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>

      <style jsx>{`
        .cart-page-wrapper {
          width: 100%;
          min-height: 100vh;
          background-color: #ffffff;
        }

        .cart-main-container {
          padding: 8rem 0 6rem 0;
        }

        .container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .breadcrumbs {
          font-size: 0.82rem;
          color: #6B7280;
          margin-bottom: 1.5rem;
        }

        .breadcrumbs a {
          color: #6B7280;
        }

        .breadcrumbs .active {
          color: #121316;
          font-weight: 600;
        }

        .page-title {
          font-family: var(--font-sans);
          font-size: 2.2rem;
          font-weight: 700;
          color: #121316;
          margin-bottom: 2.5rem;
        }

        .empty-cart-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 5rem 2rem;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          text-align: center;
          gap: 1rem;
        }

        .empty-heading {
          font-size: 1.4rem;
          font-weight: 700;
          color: #121316;
        }

        .empty-text {
          font-size: 0.95rem;
          color: #6B7280;
          max-width: 400px;
        }

        .continue-btn {
          margin-top: 1rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #121316;
          color: #ffffff;
          padding: 0.8rem 1.8rem;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 700;
        }

        /* Content Grid */
        .cart-content-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 3rem;
          align-items: start;
        }

        .items-column {
          display: flex;
          flex-direction: column;
        }

        .items-header-bar {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          padding: 1rem 0;
          border-bottom: 1px solid #E5E7EB;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #6B7280;
        }

        .items-list {
          display: flex;
          flex-direction: column;
        }

        .cart-item-card {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          align-items: center;
          padding: 1.8rem 0;
          border-bottom: 1px solid #F3F4F6;
        }

        .product-info-group {
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }

        .img-box {
          width: 80px;
          height: 80px;
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          padding: 0.4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          flex-shrink: 0;
        }

        .img-box img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .details-box {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .item-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: #121316;
        }

        .item-variant {
          font-size: 0.78rem;
          color: #6B7280;
        }

        .item-unit-price {
          font-size: 0.85rem;
          color: #4B5563;
        }

        .qty-picker {
          display: flex;
          align-items: center;
          border: 1px solid #D1D5DB;
          border-radius: 4px;
          height: 32px;
          width: fit-content;
        }

        .qty-btn {
          width: 30px;
          height: 100%;
          background: none;
          border: none;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          color: #374151;
        }

        .qty-val {
          padding: 0 0.6rem;
          font-size: 0.85rem;
          font-weight: 700;
          color: #121316;
        }

        .total-group {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-right: 1rem;
        }

        .item-total-price {
          font-size: 1.1rem;
          font-weight: 800;
          color: #121316;
        }

        .delete-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.4rem;
        }

        .cart-table-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1.8rem;
        }

        .back-link {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: #4B5563;
        }

        .clear-cart-link {
          background: none;
          border: none;
          font-size: 0.85rem;
          color: #EF4444;
          cursor: pointer;
          font-weight: 600;
        }

        /* Summary Column */
        .summary-card {
          background-color: #FAF8F5;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .summary-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #121316;
        }

        .coupon-form {
          display: flex;
          gap: 0.5rem;
        }

        .coupon-input-box {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #ffffff;
          border: 1px solid #D1D5DB;
          border-radius: 6px;
          padding: 0 0.8rem;
          height: 40px;
        }

        .coupon-input {
          width: 100%;
          border: none;
          outline: none;
          font-size: 0.82rem;
        }

        .apply-coupon-btn {
          background-color: #121316;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          padding: 0 1.2rem;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
        }

        .coupon-msg {
          font-size: 0.8rem;
          color: #10B981;
          font-weight: 700;
          margin-top: -0.8rem;
        }

        .summary-lines {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .summary-line {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.9rem;
          color: #4B5563;
        }

        .summary-line.discount {
          color: #10B981;
          font-weight: 600;
        }

        .line-val {
          font-weight: 700;
          color: #121316;
        }

        .divider-line {
          height: 1px;
          background-color: #E5E7EB;
          margin: 0.4rem 0;
        }

        .total-line {
          font-size: 1.1rem;
          font-weight: 800;
          color: #121316;
        }

        .total-val {
          font-size: 1.4rem;
          font-weight: 800;
          color: #121316;
        }

        .checkout-btn {
          width: 100%;
          height: 50px;
          background-color: #121316;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .checkout-btn:hover {
          background-color: #C39F68;
        }

        .secure-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          font-size: 0.78rem;
          color: #6B7280;
        }

        @media (max-width: 1024px) {
          .cart-content-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
