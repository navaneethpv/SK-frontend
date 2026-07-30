import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  Send,
  CheckCircle,
  Truck,
  Award,
  Trash2,
  CheckSquare,
  Square,
  MessageCircle
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [generatedOrderNumber, setGeneratedOrderNumber] = useState('');

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

  const shippingCost = activeSubtotal >= 1000 || activeCartItems.length === 0 ? 0 : 99;
  const finalTotal = activeSubtotal + shippingCost;

  const handlePlaceWhatsAppOrder = async () => {
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
    message += `Hi, I would like to place this order! I will share my delivery address here. Thank you!`;

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
        <title>Checkout & Place Order | SK EURO LIFESTYLE</title>
        <meta name="description" content="Complete your purchase securely via WhatsApp order dispatch with SK EURO LIFESTYLE." />
      </Head>

      <div className="w-full min-h-screen bg-[#F8FAFC]">
        <Header />

        <main className="pt-28 pb-20">
          <div className="max-w-[800px] mx-auto px-6">
            {/* Breadcrumbs */}
            <div className="text-[0.85rem] text-[#64748B] mb-5">
              <Link href="/" className="hover:text-[#0F172A] transition-colors">Home</Link> &gt; <Link href="/cart" className="hover:text-[#0F172A] transition-colors">Cart</Link> &gt; <span className="text-[#0F172A] font-semibold">Checkout</span>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-[2.25rem] font-extrabold text-[#0F172A] mb-2">1-Click Express Checkout</h1>
              <p className="text-[0.95rem] text-[#64748B]">Review your items and place your order directly via WhatsApp</p>
            </div>

            {/* Order Confirmation Banner */}
            {orderPlaced ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] border border-[#E2E8F0] animate-fade-in">
                <div className="inline-flex items-center justify-center w-[90px] h-[90px] bg-[#ECFDF5] rounded-full mb-6">
                  <CheckCircle size={48} className="text-[#10B981]" />
                </div>
                <h2 className="text-[1.75rem] font-bold text-[#0F172A] mb-4">Order Sent to WhatsApp!</h2>
                <p className="text-[1rem] text-[#64748B] leading-relaxed mb-8">
                  Your order <strong>#{generatedOrderNumber}</strong> has been generated. WhatsApp chat has opened automatically to confirm your delivery details.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <button
                    onClick={() => window.open(`https://wa.me/${DEFAULT_STORE_WHATSAPP}`, '_blank')}
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white px-7 py-3.5 rounded-xl font-bold border-none cursor-pointer hover:bg-[#1DA851] hover:-translate-y-0.5 transition-all"
                  >
                    <Send size={18} /> Open WhatsApp Chat
                  </button>
                  <Link href="/" className="inline-flex items-center gap-2 bg-[#0F172A] text-white px-7 py-3.5 rounded-xl font-semibold no-underline hover:bg-[#1E293B] transition-colors">
                    Return to Store
                  </Link>
                </div>
              </div>
            ) : cart.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] border border-[#E2E8F0]">
                <ShoppingBag size={64} className="text-gray-300 mx-auto mb-4" />
                <h2 className="text-[1.75rem] font-bold text-[#0F172A] mb-4">Your Cart is Empty</h2>
                <p className="text-[1rem] text-[#64748B] leading-relaxed mb-8">Please add items to your shopping cart before proceeding to checkout.</p>
                <Link href="/" className="inline-flex items-center gap-2 bg-[#0F172A] text-white px-7 py-3.5 rounded-xl font-semibold no-underline hover:bg-[#C39F68] transition-colors">
                  <ArrowLeft size={18} /> Explore Products
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-[0_4px_25px_rgba(0,0,0,0.05)] border border-[#E2E8F0] flex flex-col gap-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
                  <h2 className="text-[1.2rem] font-bold text-[#0F172A] flex items-center gap-2.5">
                    <ShoppingBag size={20} className="text-[#C39F68]" />
                    <span>Order Review ({activeCartCount} items)</span>
                  </h2>
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="bg-[#F1F5F9] border border-[#CBD5E1] text-[#1E293B] text-[0.75rem] font-bold px-3 py-1.5 rounded-md cursor-pointer hover:bg-[#E2E8F0] transition-colors"
                  >
                    {selectedItemIds.length === cart.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>

                <div className="flex flex-col gap-4 max-h-[380px] overflow-y-auto pr-1">
                  {cart.map((item) => {
                    const isSelected = selectedItemIds.includes(item.id);
                    return (
                      <div key={item.id} className={`flex items-center gap-3 pb-3.5 border-b border-[#F1F5F9] transition-all ${!isSelected ? 'opacity-50 bg-[#F8FAFC] p-2 rounded-xl' : ''}`}>
                        <button
                          type="button"
                          onClick={() => toggleSelectItem(item.id)}
                          className="bg-none border-none p-1 cursor-pointer flex items-center justify-center hover:scale-110 transition-transform"
                          title={isSelected ? 'Deselect product' : 'Select product'}
                        >
                          {isSelected ? <CheckSquare size={20} className="text-[#2563EB]" /> : <Square size={20} className="text-[#94A3B8]" />}
                        </button>

                        <div className="relative w-[60px] h-[60px] rounded-xl overflow-hidden bg-[#F1F5F9] shrink-0 border border-[#E2E8F0]">
                          <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                          <span className="absolute -top-0.5 -right-0.5 bg-[#2563EB] text-white text-[0.7rem] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">{item.quantity}</span>
                        </div>

                        <div className="flex-1">
                          <h4 className={`text-[0.9rem] font-semibold text-[#0F172A] line-clamp-1 ${!isSelected ? 'line-through text-[#94A3B8]' : ''}`}>{item.title}</h4>
                          {item.variant && <span className="text-[0.75rem] text-[#64748B]">{item.variant}</span>}

                          <div className="flex items-center gap-2 mt-1">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-6 h-6 rounded-md border border-[#CBD5E1] bg-white text-[#0F172A] text-[0.85rem] font-bold flex items-center justify-center cursor-pointer hover:bg-[#0F172A] hover:text-white transition-colors"
                            >
                              -
                            </button>
                            <span className="text-[0.85rem] font-bold text-[#0F172A] min-w-[18px] text-center">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-6 h-6 rounded-md border border-[#CBD5E1] bg-white text-[#0F172A] text-[0.85rem] font-bold flex items-center justify-center cursor-pointer hover:bg-[#0F172A] hover:text-white transition-colors"
                            >
                              +
                            </button>
                            <span className="text-[0.75rem] text-[#64748B] ml-1">@ ₹{item.price.toFixed(0)}</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1.5">
                          <div className="text-[0.95rem] font-bold text-[#0F172A]">
                            ₹{(item.price * item.quantity).toFixed(0)}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="bg-none border-none cursor-pointer p-1 text-gray-400 hover:text-red-500 transition-colors"
                            title="Remove item from cart"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Price Calculation Box */}
                <div className="flex flex-col gap-3 bg-[#F8FAFC] p-6 rounded-2xl border border-[#E2E8F0]">
                  <div className="flex justify-between text-[0.92rem] text-[#475569]">
                    <span>Items Subtotal</span>
                    <span className="font-bold text-[#0F172A]">₹{activeSubtotal.toFixed(0)}</span>
                  </div>

                  <div className="flex justify-between text-[0.92rem] text-[#475569]">
                    <span>Estimated Shipping</span>
                    <span>
                      {shippingCost === 0 ? (
                        <strong className="text-emerald-600">FREE</strong>
                      ) : (
                        `₹${shippingCost}`
                      )}
                    </span>
                  </div>

                  <div className="h-[1px] bg-[#E2E8F0] my-1" />

                  <div className="flex justify-between items-center text-[1.15rem] font-extrabold text-[#0F172A]">
                    <span>Grand Total</span>
                    <span className="text-[1.35rem] font-extrabold text-emerald-600">₹{finalTotal.toFixed(0)}</span>
                  </div>
                </div>

                {/* WhatsApp Place Order Button */}
                <button
                  type="button"
                  onClick={handlePlaceWhatsAppOrder}
                  disabled={isSubmitting || activeCartItems.length === 0}
                  className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white text-[1.1rem] font-bold py-4 px-6 rounded-2xl border-none cursor-pointer shadow-[0_10px_25px_-4px_rgba(37,211,102,0.4)] hover:shadow-[0_14px_30px_-4px_rgba(37,211,102,0.5)] hover:-translate-y-0.5 transition-all disabled:opacity-50"
                >
                  <MessageCircle size={22} className="fill-white" />
                  <span>{isSubmitting ? 'Opening WhatsApp...' : `PLACE ORDER ON WHATSAPP (₹${finalTotal.toFixed(0)})`}</span>
                </button>

                <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-4 flex items-center gap-3 text-[0.82rem] text-[#065F46]">
                  <ShieldCheck size={20} className="text-[#10B981] shrink-0" />
                  <span>
                    Your order details will be automatically sent to our official WhatsApp chat where you can share delivery address & payment details directly.
                  </span>
                </div>

                <div className="flex items-center justify-center gap-6 pt-2">
                  <div className="flex items-center gap-2 text-[0.8rem] text-[#64748B]">
                    <Truck size={16} className="text-[#2563EB]" />
                    <span>Fast Dispatch</span>
                  </div>
                  <div className="flex items-center gap-2 text-[0.8rem] text-[#64748B]">
                    <Award size={16} className="text-[#EAB308]" />
                    <span>100% Organic & Genuine</span>
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
