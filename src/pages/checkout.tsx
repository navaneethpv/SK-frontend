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
  Award,
  Trash2,
  CheckSquare,
  Square
} from 'lucide-react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { useCart } from '@/context/CartContext';
import { orderAPI } from '@/api/services/orderAPI';

const DEFAULT_STORE_WHATSAPP = '919072171712';

export default function CheckoutOrderPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

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

    let orderNum = 1001;
    try {
      const savedCounter = localStorage.getItem('sk_order_counter');
      if (savedCounter && !isNaN(Number(savedCounter))) {
        orderNum = Number(savedCounter) + 1;
      }
      localStorage.setItem('sk_order_counter', String(orderNum));
    } catch { }

    const orderId = `ORD-${orderNum}`;
    setGeneratedOrderNumber(orderId);

    const orderItemsPayload = activeCartItems.map((item) => ({
      product: item.id,
      quantity: item.quantity,
      unit: 1,
      price: item.price.toFixed(2),
      amount: (item.price * item.quantity).toFixed(2),
    }));

    try {
      await orderAPI.createOrder({
        customer: 0,
        items: orderItemsPayload,
        total_amount: finalTotal.toFixed(2),
        status: 'Pending',
        order_date: new Date().toISOString(),
      }).catch((err) => {
        console.warn('Backend API call notice:', err);
      });
    } catch { }

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

    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${DEFAULT_STORE_WHATSAPP}?text=${encodedText}`;

    setOrderPlaced(true);
    clearCart();
    setIsSubmitting(false);

    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <Head>
        <title>Checkout & Place Order | SK</title>
        <meta name="description" content="Complete your purchase securely via WhatsApp order dispatch with SK." />
      </Head>

      <div className="w-full min-h-screen bg-[#F8FAFC]">
        <Header />

        <main className="pt-28 pb-20">
          <div className="max-w-[1280px] mx-auto px-6">
            {/* Breadcrumbs */}
            <div className="text-[0.85rem] text-[#64748B] mb-5">
              <Link href="/" className="hover:text-[#0F172A] transition-colors">Home</Link> &gt; <Link href="/cart" className="hover:text-[#0F172A] transition-colors">Cart</Link> &gt; <span className="text-[#0F172A] font-semibold">Checkout</span>
            </div>

            <h1 className="text-[2.25rem] font-extrabold text-[#0F172A] mb-2">Express Checkout</h1>
            <p className="text-[1rem] text-[#64748B] mb-10">Instant 1-Click WhatsApp Order Placement</p>

            {/* Order Confirmation Banner */}
            {orderPlaced ? (
              <div className="bg-white rounded-2xl p-12 text-center max-w-[600px] mx-auto shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] border border-[#E2E8F0] animate-fade-in">
                <div className="inline-flex items-center justify-center w-[90px] h-[90px] bg-[#ECFDF5] rounded-full mb-6">
                  <CheckCircle size={48} className="text-[#10B981]" />
                </div>
                <h2 className="text-[1.75rem] font-bold text-[#0F172A] mb-4">Order Placed Successfully!</h2>
                <p className="text-[1rem] text-[#64748B] leading-relaxed mb-8">
                  Your order <strong>#{generatedOrderNumber}</strong> has been generated. WhatsApp chat has opened automatically to confirm your delivery details.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <button
                    onClick={() => window.open(`https://wa.me/${DEFAULT_STORE_WHATSAPP}`, '_blank')}
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white px-7 py-3.5 rounded-xl font-bold border-none cursor-pointer hover:bg-[#1DA851] hover:-translate-y-0.5 transition-all"
                  >
                    <Send size={18} /> Open WhatsApp
                  </button>
                  <Link href="/" className="inline-flex items-center gap-2 bg-[#0F172A] text-white px-7 py-3.5 rounded-xl font-semibold no-underline hover:bg-[#1E293B] transition-colors">
                    Return to Store
                  </Link>
                </div>
              </div>
            ) : cart.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center max-w-[600px] mx-auto shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] border border-[#E2E8F0]">
                <ShoppingBag size={64} className="text-gray-300 mx-auto mb-4" />
                <h2 className="text-[1.75rem] font-bold text-[#0F172A] mb-4">Your Cart is Empty</h2>
                <p className="text-[1rem] text-[#64748B] leading-relaxed mb-8">Please add items to your shopping cart before proceeding to checkout.</p>
                <Link href="/" className="inline-flex items-center gap-2 bg-[#0F172A] text-white px-7 py-3.5 rounded-xl font-semibold no-underline hover:bg-[#C39F68] transition-colors">
                  <ArrowLeft size={18} /> Explore Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">
                {/* Customer Details Form */}
                <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#E2E8F0]">
                  <h2 className="text-[1.25rem] font-bold text-[#0F172A] flex items-center gap-3 mb-7 pb-4 border-b border-[#F1F5F9]">
                    <User size={20} className="text-[#2563EB]" />
                    <span>Shipping & Delivery Details</span>
                  </h2>

                  <form onSubmit={handlePlaceWhatsAppOrder} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-[0.875rem] font-semibold text-[#334155]">Full Name <span className="text-red-500">*</span></label>
                      <div className="relative flex items-center">
                        <User size={18} className="absolute left-4 text-[#94A3B8] pointer-events-none" />
                        <input
                          type="text"
                          name="fullName"
                          required
                          placeholder="e.g. Navaneeth Krishnan"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3.5 border-1.5 border-[#E2E8F0] rounded-xl text-[0.95rem] text-[#0F172A] outline-none bg-[#FAFAFA] focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[0.875rem] font-semibold text-[#334155]">WhatsApp Phone Number <span className="text-red-500">*</span></label>
                      <div className="relative flex items-center">
                        <Phone size={18} className="absolute left-4 text-[#94A3B8] pointer-events-none" />
                        <input
                          type="tel"
                          name="phone"
                          required
                          placeholder="e.g. 9876543210"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3.5 border-1.5 border-[#E2E8F0] rounded-xl text-[0.95rem] text-[#0F172A] outline-none bg-[#FAFAFA] focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                        />
                      </div>
                      <span className="text-[0.78rem] text-[#64748B]">Order updates and tracking will be sent to this WhatsApp number.</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[0.875rem] font-semibold text-[#334155]">Delivery Address <span className="text-red-500">*</span></label>
                      <div className="relative flex items-center">
                        <MapPin size={18} className="absolute left-4 top-4 text-[#94A3B8] pointer-events-none" />
                        <textarea
                          name="address"
                          required
                          rows={3}
                          placeholder="House / Flat No., Street, Landmark"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3.5 border-1.5 border-[#E2E8F0] rounded-xl text-[0.95rem] text-[#0F172A] outline-none bg-[#FAFAFA] focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[0.875rem] font-semibold text-[#334155]">City / Town</label>
                        <div className="relative flex items-center">
                          <Building size={18} className="absolute left-4 text-[#94A3B8] pointer-events-none" />
                          <input
                            type="text"
                            name="city"
                            placeholder="e.g. Kozhikode"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-3.5 border-1.5 border-[#E2E8F0] rounded-xl text-[0.95rem] text-[#0F172A] outline-none bg-[#FAFAFA] focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[0.875rem] font-semibold text-[#334155]">Pincode</label>
                        <div className="relative flex items-center">
                          <MapPin size={18} className="absolute left-4 text-[#94A3B8] pointer-events-none" />
                          <input
                            type="text"
                            name="pincode"
                            placeholder="e.g. 673001"
                            value={formData.pincode}
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-3.5 border-1.5 border-[#E2E8F0] rounded-xl text-[0.95rem] text-[#0F172A] outline-none bg-[#FAFAFA] focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[0.875rem] font-semibold text-[#334155]">Order Notes (Optional)</label>
                      <div className="relative flex items-center">
                        <FileText size={18} className="absolute left-4 top-4 text-[#94A3B8] pointer-events-none" />
                        <textarea
                          name="notes"
                          rows={2}
                          placeholder="Special delivery instructions or requests"
                          value={formData.notes}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3.5 border-1.5 border-[#E2E8F0] rounded-xl text-[0.95rem] text-[#0F172A] outline-none bg-[#FAFAFA] focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || activeCartItems.length === 0}
                      className="mt-4 flex items-center justify-center gap-3 w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white text-[1.05rem] font-bold py-4 px-6 rounded-2xl border-none cursor-pointer shadow-[0_8px_20px_-4px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_25px_-4px_rgba(37,211,102,0.5)] hover:-translate-y-0.5 transition-all disabled:opacity-50"
                    >
                      <Send size={20} />
                      <span>{isSubmitting ? 'Generating Order...' : `PLACE ORDER ON WHATSAPP (₹${finalTotal.toFixed(0)})`}</span>
                    </button>

                    <div className="flex items-center justify-center gap-2 text-[0.82rem] text-[#64748B] mt-2">
                      <ShieldCheck size={16} className="text-[#10B981]" />
                      <span>Safe & Secure Direct WhatsApp Dispatch</span>
                    </div>
                  </form>
                </div>

                {/* Right Summary Column */}
                <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#E2E8F0]">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9] mb-2">
                    <h2 className="text-[1.15rem] font-bold text-[#0F172A]">Order Items ({activeCartCount})</h2>
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="bg-[#F1F5F9] border border-[#CBD5E1] text-[#1E293B] text-[0.75rem] font-bold px-3 py-1 rounded-md cursor-pointer hover:bg-[#E2E8F0] transition-colors"
                    >
                      {selectedItemIds.length === cart.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>

                  <p className="text-[0.75rem] text-[#64748B] mb-4">Toggle checkboxes to include/exclude items from this order:</p>

                  <div className="flex flex-col gap-4 max-h-[340px] overflow-y-auto pr-2 mb-5">
                    {cart.map((item) => {
                      const isSelected = selectedItemIds.includes(item.id);
                      return (
                        <div key={item.id} className={`flex items-center gap-3 pb-3.5 border-b border-[#F1F5F9] transition-all ${!isSelected ? 'opacity-55 bg-[#F8FAFC] p-2 rounded-lg' : ''}`}>
                          <button
                            type="button"
                            onClick={() => toggleSelectItem(item.id)}
                            className="bg-none border-none p-1 cursor-pointer flex items-center justify-center hover:scale-110 transition-transform"
                            title={isSelected ? 'Deselect product' : 'Select product'}
                          >
                            {isSelected ? <CheckSquare size={20} className="text-[#2563EB]" /> : <Square size={20} className="text-[#94A3B8]" />}
                          </button>

                          <div className="relative w-[54px] h-[54px] rounded-xl overflow-hidden bg-[#F1F5F9] shrink-0">
                            <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                            <span className="absolute -top-0.5 -right-0.5 bg-[#2563EB] text-white text-[0.7rem] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">{item.quantity}</span>
                          </div>

                          <div className="flex-1">
                            <h4 className={`text-[0.88rem] font-semibold text-[#0F172A] line-clamp-1 ${!isSelected ? 'line-through text-[#94A3B8]' : ''}`}>{item.title}</h4>
                            {item.variant && <span className="text-[0.75rem] text-[#64748B]">{item.variant}</span>}

                            <div className="flex items-center gap-1.5 mt-1">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-6 h-6 rounded-md border border-[#CBD5E1] bg-white text-[#0F172A] text-[0.85rem] font-bold flex items-center justify-center cursor-pointer hover:bg-[#0F172A] hover:text-white transition-colors"
                                title="Decrease quantity"
                              >
                                -
                              </button>
                              <span className="text-[0.85rem] font-bold text-[#0F172A] min-w-[18px] text-center">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-6 h-6 rounded-md border border-[#CBD5E1] bg-white text-[#0F172A] text-[0.85rem] font-bold flex items-center justify-center cursor-pointer hover:bg-[#0F172A] hover:text-white transition-colors"
                                title="Increase quantity"
                              >
                                +
                              </button>
                              <span className="text-[0.75rem] text-[#64748B] ml-1">@ ₹{item.price.toFixed(0)}</span>
                            </div>

                            {!isSelected && <span className="inline-block text-[0.68rem] font-bold text-red-500 bg-red-100 px-1.5 py-0.5 rounded mt-1">Deselected</span>}
                          </div>

                          <div className="flex flex-col items-end gap-1.5">
                            <div className="text-[0.92rem] font-bold text-[#0F172A]">
                              ₹{(item.price * item.quantity).toFixed(0)}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="bg-none border-none cursor-pointer p-1 text-gray-400 hover:text-red-500 transition-colors"
                              title="Remove item from cart completely"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {activeCartItems.length === 0 && (
                    <div className="bg-red-50 border border-red-300 text-red-800 text-[0.82rem] font-semibold p-3 rounded-xl mb-5 text-center">
                      ⚠️ Please select at least one item to proceed with your order.
                    </div>
                  )}

                  <div className="flex flex-col gap-3 bg-[#F8FAFC] p-5 rounded-2xl mb-6">
                    <div className="flex justify-between text-[0.9rem] text-[#475569]">
                      <span>Items Subtotal</span>
                      <span className="font-bold text-[#0F172A]">₹{activeSubtotal.toFixed(0)}</span>
                    </div>

                    <div className="flex justify-between text-[0.9rem] text-[#475569]">
                      <span>Estimated Shipping</span>
                      <span>
                        {shippingCost === 0 ? (
                          <strong className="text-emerald-500">FREE</strong>
                        ) : (
                          `₹${shippingCost}`
                        )}
                      </span>
                    </div>

                    <div className="h-[1px] bg-[#E2E8F0] my-1" />

                    <div className="flex justify-between items-center text-[1.1rem] font-extrabold text-[#0F172A]">
                      <span>Grand Total</span>
                      <span className="text-[1.25rem] font-extrabold text-emerald-600">₹{finalTotal.toFixed(0)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-[0.85rem] text-[#475569] font-medium">
                      <Truck size={18} className="text-[#2563EB]" />
                      <span>Fast Express Dispatch</span>
                    </div>
                    <div className="flex items-center gap-3 text-[0.85rem] text-[#475569] font-medium">
                      <Award size={18} className="text-[#EAB308]" />
                      <span>100% Genuine Quality Guarantee</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
