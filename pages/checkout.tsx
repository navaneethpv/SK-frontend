import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  Send,
  Phone,
  User,
  MapPin,
  Building,
  FileText,
  CheckCircle,
  Truck,
  Sparkles,
  Trash2,
  CheckSquare,
  Square
} from 'lucide-react';
import Header from '@/SK/components/Header';
import Footer from '@/SK/components/Footer';
import { useCart } from '@/SK/context/CartContext';
import { orderAPI } from '@/SK/Api/Services/orderAPI';

// Default Store WhatsApp number for fallback (configured in ERP/backend)
const DEFAULT_STORE_WHATSAPP = '918137058308';

export default function CheckoutOrderPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  // Selected item IDs state for selecting/deselecting items directly on the order page
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>(() => cart.map((i) => i.id));

  useEffect(() => {
    setSelectedItemIds((prev) => {
      const cartIds = cart.map((i) => i.id);
      const updated = prev.filter((id) => cartIds.includes(id));
      cartIds.forEach((id) => {
        if (!prev.includes(id) && !updated.includes(id)) {
          updated.push(id);
        }
      });
      return updated;
    });
  }, [cart]);

  const toggleSelectItem = (id: number) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItemIds.length === cart.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(cart.map((i) => i.id));
    }
  };

  const activeCartItems = cart.filter((item) => selectedItemIds.includes(item.id));
  const activeCartCount = activeCartItems.reduce((total, item) => total + item.quantity, 0);
  const activeSubtotal = activeCartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Customer Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [generatedOrderNumber, setGeneratedOrderNumber] = useState('');

  const shippingCost = activeSubtotal >= 1000 || activeCartItems.length === 0 ? 0 : 99;
  const finalTotal = activeSubtotal + shippingCost;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceWhatsAppOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      alert('Please fill in your Name, WhatsApp Phone Number, and Delivery Address.');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty. Please add products before placing an order.');
      return;
    }

    if (activeCartItems.length === 0) {
      alert('Please select at least one item from your order summary list before placing an order.');
      return;
    }

    setIsSubmitting(true);

    // Auto-incrementing Order ID counter starting from ORD-1001
    let orderNum = 1001;
    try {
      const savedCounter = localStorage.getItem('sk_order_counter');
      if (savedCounter && !isNaN(Number(savedCounter))) {
        orderNum = Number(savedCounter) + 1;
      }
      localStorage.setItem('sk_order_counter', String(orderNum));
    } catch {
      // Fallback if localStorage unavailable
    }

    const orderId = `ORD-${orderNum}`;
    setGeneratedOrderNumber(orderId);

    // Format selected items list for backend API
    const orderItemsPayload = activeCartItems.map((item) => ({
      product: item.id,
      quantity: item.quantity,
      unit: 1,
      price: item.price.toFixed(2),
      amount: (item.price * item.quantity).toFixed(2),
    }));

    try {
      // 1. Submit Order to ERP Backend API (Guest Checkout)
      await orderAPI.createOrder({
        customer: 0, // Guest Customer
        items: orderItemsPayload,
        total_amount: finalTotal.toFixed(2),
        status: 'Pending',
        order_date: new Date().toISOString(),
      }).catch((err) => {
        console.warn('Backend API call notice:', err);
      });
    } catch {
      // Proceed even if backend is offline, ensuring WhatsApp message is generated
    }

    // Helper to format product titles cleanly (e.g. malabar-veerasmruthikal-book -> Malabar Veerasmruthikal Book)
    const formatTitle = (name: string) => {
      if (!name) return 'SK Product';
      if (name.includes('-') && !name.includes(' ')) {
        return name
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(' ');
      }
      return name;
    };

    // 2. Generate Clean Formatted WhatsApp Order Message
    let message = `*NEW WEBSITE ORDER #${orderId}*\n`;
    message += `------------------------------------\n`;
    message += `*Customer Details:*\n`;
    message += `• *Name:* ${formData.fullName.trim()}\n`;
    message += `• *Phone:* ${formData.phone.trim()}\n`;
    message += `• *Address:* ${formData.address.trim()}${formData.city ? `, ${formData.city.trim()}` : ''}${formData.pincode ? ` - ${formData.pincode.trim()}` : ''}\n`;
    if (formData.notes.trim()) {
      message += `• *Notes:* ${formData.notes.trim()}\n`;
    }
    message += `------------------------------------\n`;
    message += `*Order Items (${activeCartCount}):*\n`;

    activeCartItems.forEach((item, index) => {
      const cleanTitle = formatTitle(item.title);
      message += `${index + 1}. *${cleanTitle}* ${item.variant ? `(${item.variant})` : ''}\n`;
      message += `   Qty: ${item.quantity}  ×  ₹${item.price.toFixed(0)}  =  *₹${(item.price * item.quantity).toFixed(0)}*\n`;
    });

    message += `------------------------------------\n`;
    message += `• *Subtotal:* ₹${activeSubtotal.toFixed(0)}\n`;
    message += `• *Delivery:* ${shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}\n`;
    message += `*TOTAL AMOUNT:* *₹${finalTotal.toFixed(0)}*\n`;
    message += `------------------------------------\n`;
    message += `Please confirm my order and share payment/delivery details! Thank you`;

    // Safely encode text string for WhatsApp URL
    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${DEFAULT_STORE_WHATSAPP}?text=${encodedText}`;

    // Update state & redirect
    setOrderPlaced(true);
    clearCart();
    setIsSubmitting(false);

    // Open WhatsApp in a new tab / application
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <Head>
        <title>Place Order via WhatsApp | SK E-Commerce</title>
        <meta name="description" content="Enter your delivery details to place your order directly via WhatsApp." />
      </Head>

      <div className="checkout-page-wrapper">
        <Header />

        <main className="checkout-main-container">
          <div className="container">
            {/* Breadcrumbs */}
            <div className="breadcrumbs">
              <Link href="/">Home</Link> &gt; <Link href="/cart">Cart</Link> &gt; <span className="active">Order Details</span>
            </div>

            <h1 className="page-title">Complete Your Order</h1>
            <p className="page-subtitle">Fill in your details below. Your order will be formatted & sent to our team via WhatsApp.</p>

            {orderPlaced ? (
              <div className="order-success-card">
                <div className="success-icon-box">
                  <CheckCircle size={64} color="#10B981" />
                </div>
                <h2 className="success-heading">Order #{generatedOrderNumber} Created!</h2>
                <p className="success-text">
                  Your order details have been formatted and opened in <b>WhatsApp</b>.
                  If WhatsApp did not open automatically, click the button below to resend your order.
                </p>
                <div className="success-btn-row">
                  <button
                    onClick={() => {
                      const whatsappUrl = `https://wa.me/${DEFAULT_STORE_WHATSAPP}`;
                      window.open(whatsappUrl, '_blank');
                    }}
                    className="resend-wa-btn"
                  >
                    <Send size={18} /> Open WhatsApp Chat
                  </button>
                  <Link href="/" className="back-home-btn">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            ) : cart.length === 0 ? (
              <div className="empty-cart-card">
                <ShoppingBag size={64} color="#D1D5DB" />
                <h2 className="empty-heading">No items in your order list</h2>
                <p className="empty-text">Please add items to your cart before proceeding to order checkout.</p>
                <Link href="/" className="continue-btn">
                  <ArrowLeft size={16} /> Explore Products
                </Link>
              </div>
            ) : (
              <div className="checkout-grid">
                {/* Left Column: Customer Information Form */}
                <div className="form-column">
                  <div className="form-card">
                    <h2 className="form-card-title">
                      <User size={20} className="title-icon" /> Delivery Details
                    </h2>

                    <form onSubmit={handlePlaceWhatsAppOrder} className="customer-form">
                      <div className="input-group">
                        <label htmlFor="fullName">Full Name <span className="req">*</span></label>
                        <div className="input-with-icon">
                          <User size={18} className="field-icon" />
                          <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            required
                            placeholder="e.g. Rahul Sharma"
                            value={formData.fullName}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="input-group">
                        <label htmlFor="phone">WhatsApp Mobile Number <span className="req">*</span></label>
                        <div className="input-with-icon">
                          <Phone size={18} className="field-icon" />
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            required
                            placeholder="e.g. +91 9876543210"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>
                        <span className="field-hint">We will send order updates to this WhatsApp number.</span>
                      </div>

                      <div className="input-group">
                        <label htmlFor="address">Full Delivery Address <span className="req">*</span></label>
                        <div className="input-with-icon">
                          <MapPin size={18} className="field-icon icon-top" />
                          <textarea
                            id="address"
                            name="address"
                            required
                            rows={3}
                            placeholder="House / Flat No., Street, Landmark"
                            value={formData.address}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="form-row-2col">
                        <div className="input-group">
                          <label htmlFor="city">City / District</label>
                          <div className="input-with-icon">
                            <Building size={18} className="field-icon" />
                            <input
                              type="text"
                              id="city"
                              name="city"
                              placeholder="e.g. Mumbai"
                              value={formData.city}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="input-group">
                          <label htmlFor="pincode">Pincode</label>
                          <div className="input-with-icon">
                            <MapPin size={18} className="field-icon" />
                            <input
                              type="text"
                              id="pincode"
                              name="pincode"
                              placeholder="e.g. 400001"
                              value={formData.pincode}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="input-group">
                        <label htmlFor="notes">Order Notes / Instructions (Optional)</label>
                        <div className="input-with-icon">
                          <FileText size={18} className="field-icon icon-top" />
                          <textarea
                            id="notes"
                            name="notes"
                            rows={2}
                            placeholder="Preferred delivery time, gift packaging requests, etc."
                            value={formData.notes}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || activeCartItems.length === 0}
                        className="submit-whatsapp-order-btn"
                      >
                        <Send size={20} />
                        <span>{isSubmitting ? 'Formatting Order...' : 'Place Order & Send on WhatsApp'}</span>
                      </button>

                      <div className="privacy-badge">
                        <ShieldCheck size={16} color="#10B981" />
                        <span>Instant Direct WhatsApp Order Confirmation</span>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Right Column: Order Items Summary with Select / Deselect */}
                <div className="summary-column">
                  <div className="summary-card">
                    <div className="summary-card-header">
                      <h2 className="summary-title">
                        <ShoppingBag size={20} className="title-icon" /> Order Items ({activeCartItems.length}/{cart.length} Selected)
                      </h2>
                      {cart.length > 1 && (
                        <button type="button" onClick={toggleSelectAll} className="select-all-btn">
                          {selectedItemIds.length === cart.length ? 'Deselect All' : 'Select All'}
                        </button>
                      )}
                    </div>

                    <p className="select-hint-text">
                      Check or uncheck items to include or exclude them from this order.
                    </p>

                    <div className="order-items-preview">
                      {cart.map((item) => {
                        const isSelected = selectedItemIds.includes(item.id);
                        return (
                          <div key={item.id} className={`preview-item ${isSelected ? 'selected' : 'deselected'}`}>
                            <button
                              type="button"
                              onClick={() => toggleSelectItem(item.id)}
                              className={`select-checkbox-btn ${isSelected ? 'checked' : ''}`}
                              title={isSelected ? 'Deselect product' : 'Select product'}
                            >
                              {isSelected ? <CheckSquare size={20} color="#2563EB" /> : <Square size={20} color="#94A3B8" />}
                            </button>

                            <div className="item-img-box">
                              <img src={item.img} alt={item.title} />
                              <span className="qty-badge">{item.quantity}</span>
                            </div>

                            <div className="item-text-box">
                              <h4 className="item-name">{item.title}</h4>
                              {item.variant && <span className="item-var">{item.variant}</span>}

                              <div className="order-qty-control">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="order-qty-btn"
                                  title="Decrease quantity"
                                >
                                  -
                                </button>
                                <span className="order-qty-val">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="order-qty-btn"
                                  title="Increase quantity"
                                >
                                  +
                                </button>
                                <span className="order-unit-price">@ ₹{item.price.toFixed(0)}</span>
                              </div>

                              {!isSelected && <span className="deselected-badge">Deselected</span>}
                            </div>

                            <div className="item-action-col">
                              <div className="item-total-col">
                                ₹{(item.price * item.quantity).toFixed(0)}
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                className="remove-item-btn"
                                title="Remove item from cart completely"
                              >
                                <Trash2 size={16} color="#94A3B8" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {activeCartItems.length === 0 && (
                      <div className="no-selection-warning">
                        ⚠️ Please select at least one item to proceed with your order.
                      </div>
                    )}

                    <div className="price-breakdown">
                      <div className="price-row">
                        <span>Items Subtotal</span>
                        <span className="val">₹{activeSubtotal.toFixed(0)}</span>
                      </div>

                      <div className="price-row">
                        <span>Estimated Shipping</span>
                        <span className="val">
                          {shippingCost === 0 ? (
                            <strong style={{ color: '#10B981' }}>FREE</strong>
                          ) : (
                            `₹${shippingCost}`
                          )}
                        </span>
                      </div>

                      <div className="divider-line" />

                      <div className="price-row total-row">
                        <span>Grand Total</span>
                        <span className="grand-val">₹{finalTotal.toFixed(0)}</span>
                      </div>
                    </div>

                    <div className="delivery-highlights">
                      <div className="highlight-item">
                        <Truck size={18} color="#2563EB" />
                        <span>Fast Express Dispatch</span>
                      </div>
                      <div className="highlight-item">
                        <Sparkles size={18} color="#EAB308" />
                        <span>100% Genuine Quality Guarantee</span>
                      </div>
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
        .checkout-page-wrapper {
          width: 100%;
          min-height: 100vh;
          background-color: #F8FAFC;
        }

        .checkout-main-container {
          padding: 8rem 0 6rem 0;
        }

        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .breadcrumbs {
          font-size: 0.85rem;
          color: #64748B;
          margin-bottom: 1.25rem;
        }

        .page-title {
          font-size: 2.25rem;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 0.5rem;
        }

        .page-subtitle {
          font-size: 1rem;
          color: #64748B;
          margin-bottom: 2.5rem;
        }

        /* Success & Empty Card */
        .order-success-card, .empty-cart-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 4rem 2rem;
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);
          border: 1px solid #E2E8F0;
        }

        .success-icon-box {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 90px;
          height: 90px;
          background: #ECFDF5;
          border-radius: 50%;
          margin-bottom: 1.5rem;
        }

        .success-heading, .empty-heading {
          font-size: 1.75rem;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 1rem;
        }

        .success-text, .empty-text {
          font-size: 1rem;
          color: #64748B;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .success-btn-row {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .resend-wa-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #25D366;
          color: #ffffff;
          padding: 0.85rem 1.75rem;
          border-radius: 12px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .resend-wa-btn:hover {
          background: #1DA851;
          transform: translateY(-2px);
        }

        .back-home-btn, .continue-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #0F172A;
          color: #ffffff;
          padding: 0.85rem 1.75rem;
          border-radius: 12px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }

        /* Grid Layout */
        .checkout-grid {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 2rem;
          align-items: start;
        }

        @media (max-width: 992px) {
          .checkout-grid {
            grid-template-columns: 1fr;
          }
        }

        .form-card, .summary-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          border: 1px solid #E2E8F0;
        }

        .form-card-title, .summary-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0F172A;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.75rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #F1F5F9;
        }

        .customer-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-group label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #334155;
        }

        .req {
          color: #EF4444;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-with-icon input,
        .input-with-icon textarea {
          width: 100%;
          padding: 0.85rem 1rem 0.85rem 2.75rem;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          font-size: 0.95rem;
          color: #0F172A;
          outline: none;
          transition: all 0.2s ease;
          background: #FAFAFA;
        }

        .input-with-icon input:focus,
        .input-with-icon textarea:focus {
          border-color: #2563EB;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        :global(.field-icon) {
          position: absolute;
          left: 1rem;
          color: #94A3B8;
          pointer-events: none;
        }

        :global(.icon-top) {
          top: 1rem;
        }

        .field-hint {
          font-size: 0.78rem;
          color: #64748B;
        }

        .form-row-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 576px) {
          .form-row-2col {
            grid-template-columns: 1fr;
          }
        }

        .submit-whatsapp-order-btn {
          margin-top: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          width: 100%;
          background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
          color: #ffffff;
          font-size: 1.05rem;
          font-weight: 700;
          padding: 1.1rem 1.5rem;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 20px -4px rgba(37, 211, 102, 0.4);
          transition: all 0.25s ease;
        }

        .submit-whatsapp-order-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px -4px rgba(37, 211, 102, 0.5);
        }

        .privacy-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.82rem;
          color: #64748B;
          margin-top: 0.5rem;
        }

        .summary-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #F1F5F9;
          margin-bottom: 0.5rem;
        }

        .summary-card-header .summary-title {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
          font-size: 1.15rem;
        }

        .select-all-btn {
          background: #F1F5F9;
          border: 1px solid #CBD5E1;
          color: #1E293B;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.3rem 0.75rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .select-all-btn:hover {
          background: #E2E8F0;
        }

        .select-hint-text {
          font-size: 0.75rem;
          color: #64748B;
          margin-bottom: 1rem;
        }

        /* Order Summary Items */
        .order-items-preview {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: 340px;
          overflow-y: auto;
          padding-right: 0.5rem;
          margin-bottom: 1.25rem;
        }

        .preview-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding-bottom: 0.85rem;
          border-bottom: 1px solid #F1F5F9;
          transition: all 0.2s ease;
        }

        .preview-item.deselected {
          opacity: 0.55;
          background: #F8FAFC;
          padding: 0.5rem;
          border-radius: 8px;
        }

        .preview-item.deselected .item-name {
          text-decoration: line-through;
          color: #94A3B8;
        }

        .select-checkbox-btn {
          background: none;
          border: none;
          padding: 0.25rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.15s ease;
        }

        .select-checkbox-btn:hover {
          transform: scale(1.1);
        }

        .deselected-badge {
          display: inline-block;
          font-size: 0.68rem;
          font-weight: 700;
          color: #EF4444;
          background: #FEE2E2;
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          margin-top: 0.2rem;
        }

        .order-qty-control {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-top: 0.3rem;
        }

        .order-qty-btn {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          border: 1px solid #CBD5E1;
          background: #ffffff;
          color: #0F172A;
          font-size: 0.85rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .order-qty-btn:hover {
          background: #0F172A;
          color: #ffffff;
          border-color: #0F172A;
        }

        .order-qty-val {
          font-size: 0.85rem;
          font-weight: 700;
          color: #0F172A;
          min-width: 18px;
          text-align: center;
        }

        .order-unit-price {
          font-size: 0.75rem;
          color: #64748B;
          margin-left: 0.4rem;
        }

        .item-img-box {
          position: relative;
          width: 54px;
          height: 54px;
          border-radius: 10px;
          overflow: hidden;
          background: #F1F5F9;
          flex-shrink: 0;
        }

        .item-img-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .qty-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background: #2563EB;
          color: #ffffff;
          font-size: 0.7rem;
          font-weight: 700;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .item-text-box {
          flex: 1;
        }

        .item-name {
          font-size: 0.88rem;
          font-weight: 600;
          color: #0F172A;
          margin: 0 0 0.2rem 0;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .item-var {
          display: block;
          font-size: 0.75rem;
          color: #64748B;
        }

        .item-price {
          font-size: 0.8rem;
          color: #94A3B8;
        }

        .item-action-col {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.4rem;
        }

        .item-total-col {
          font-size: 0.92rem;
          font-weight: 700;
          color: #0F172A;
        }

        .remove-item-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s;
        }

        .remove-item-btn:hover {
          opacity: 0.7;
        }

        .no-selection-warning {
          background-color: #FEF2F2;
          border: 1px solid #FCA5A5;
          color: #991B1B;
          font-size: 0.82rem;
          font-weight: 600;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          margin-bottom: 1.25rem;
          text-align: center;
        }

        /* Price breakdown */
        .price-breakdown {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          background: #F8FAFC;
          padding: 1.25rem;
          border-radius: 14px;
          margin-bottom: 1.5rem;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: #475569;
        }

        .divider-line {
          height: 1px;
          background: #E2E8F0;
          margin: 0.25rem 0;
        }

        .total-row {
          font-size: 1.1rem;
          font-weight: 800;
          color: #0F172A;
        }

        .grand-val {
          color: #16A34A;
          font-size: 1.25rem;
        }

        .delivery-highlights {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .highlight-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.85rem;
          color: #475569;
          font-weight: 500;
        }
      `}</style>
    </>
  );
}
