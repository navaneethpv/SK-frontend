import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, ShieldCheck, Tag } from 'lucide-react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { useCart } from '@/context/CartContext';

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

      <div className="w-full min-h-screen bg-white">
        <Header />

        <main className="pt-28 pb-20">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-8">
            {/* Breadcrumbs */}
            <div className="text-[0.82rem] text-[#6B7280] mb-6">
              <Link href="/" className="text-[#6B7280] hover:text-[#121316] transition-colors">Home</Link> &gt; <span className="text-[#121316] font-semibold">Shopping Cart</span>
            </div>

            <h1 className="text-[2.2rem] font-bold text-[#121316] mb-10">Shopping Cart ({cartCount})</h1>

            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 sm:py-20 px-4 sm:px-8 border border-[#E5E7EB] rounded-xl text-center gap-4">
                <ShoppingBag size={64} className="text-gray-300" />
                <h2 className="text-[1.25rem] sm:text-[1.4rem] font-bold text-[#121316]">Your cart is currently empty</h2>
                <p className="text-[0.85rem] sm:text-[0.95rem] text-[#6B7280] max-w-[400px]">Before proceeding to checkout you must add some products to your shopping cart.</p>
                <Link href="/" className="mt-4 inline-flex items-center gap-2 bg-[#121316] text-white px-6 sm:px-7 py-3 rounded-md text-[0.85rem] font-bold hover:bg-[#C39F68] transition-colors">
                  <ArrowLeft size={16} /> Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12 items-start">
                {/* Left Column: Items Table */}
                <div className="flex flex-col">
                  <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr] py-4 border-b border-[#E5E7EB] text-[0.8rem] font-bold uppercase tracking-wider text-[#6B7280]">
                    <span>Product</span>
                    <span>Quantity</span>
                    <span>Total</span>
                  </div>

                  <div className="flex flex-col">
                    {cart.map((item) => (
                      <div key={item.id} className="flex flex-col sm:grid sm:grid-cols-[2fr_1fr_1fr] items-start sm:items-center py-5 sm:py-7 border-b border-[#F3F4F6] gap-4 sm:gap-0">
                        <div className="flex items-center gap-4 sm:gap-5">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 border border-[#E5E7EB] rounded-md p-1.5 flex items-center justify-center bg-white shrink-0">
                            <img src={item.img} alt={item.title} className="max-w-full max-h-full object-contain" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <h3 className="text-[0.88rem] sm:text-[0.95rem] font-bold text-[#121316]">{item.title}</h3>
                            {item.variant && <span className="text-[0.75rem] text-[#6B7280]">Size: {item.variant}</span>}
                            <span className="text-[0.82rem] sm:text-[0.85rem] text-[#4B5563]">₹{item.price.toFixed(0)}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between w-full sm:w-auto">
                          <div className="flex items-center border border-[#D1D5DB] rounded h-8 w-fit">
                            <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-full bg-none border-none text-[1rem] font-bold cursor-pointer text-[#374151] hover:bg-gray-100">-</button>
                            <span className="px-2.5 text-[0.85rem] font-bold text-[#121316]">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-full bg-none border-none text-[1rem] font-bold cursor-pointer text-[#374151] hover:bg-gray-100">+</button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between w-full sm:w-auto pr-0 sm:pr-4">
                          <span className="text-[1rem] sm:text-[1.1rem] font-extrabold text-[#121316]">₹{(item.price * item.quantity).toFixed(0)}</span>
                          <button onClick={() => removeFromCart(item.id)} className="bg-none border-none cursor-pointer p-1.5 text-gray-400 hover:text-red-500 transition-colors" aria-label="Remove item">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 sm:pt-7">
                    <Link href="/" className="flex items-center gap-1.5 text-[0.85rem] font-semibold text-[#4B5563] hover:text-[#121316] transition-colors">
                      <ArrowLeft size={16} /> Continue Shopping
                    </Link>
                    <button onClick={clearCart} className="bg-none border-none text-[0.85rem] text-red-500 font-semibold cursor-pointer hover:underline">
                      Clear Shopping Cart
                    </button>
                  </div>
                </div>

                {/* Right Column: Summary Card */}
                <div className="bg-[#FAF8F5] border border-[#E5E7EB] rounded-xl p-8 flex flex-col gap-6">
                  <h2 className="text-[1.25rem] font-bold text-[#121316]">Order Summary</h2>

                  {/* Coupon Input */}
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="flex-1 flex items-center gap-2 bg-white border border-[#D1D5DB] rounded-md px-3 h-10">
                      <Tag size={16} className="text-gray-400" />
                      <input
                        type="text"
                        placeholder="Promo code (e.g. SK10)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full border-none outline-none text-[0.82rem]"
                      />
                    </div>
                    <button type="submit" className="bg-[#121316] text-white border-none rounded-md px-5 text-[0.8rem] font-bold cursor-pointer hover:bg-[#C39F68] transition-colors">Apply</button>
                  </form>
                  {couponSuccess && <p className="text-[0.8rem] text-emerald-500 font-bold -mt-3">✓ 10% Discount Applied!</p>}

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between text-[0.9rem] text-[#4B5563]">
                      <span>Subtotal</span>
                      <span className="font-bold text-[#121316]">₹{subtotal.toFixed(0)}</span>
                    </div>

                    {appliedDiscount > 0 && (
                      <div className="flex items-center justify-between text-[0.9rem] text-emerald-500 font-semibold">
                        <span>Promo Discount</span>
                        <span className="font-bold">-₹{appliedDiscount.toFixed(0)}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[0.9rem] text-[#4B5563]">
                      <span>Estimated Shipping</span>
                      <span>
                        {shippingCost === 0 ? <strong className="text-emerald-500">FREE</strong> : `₹${shippingCost}`}
                      </span>
                    </div>

                    <div className="h-[1px] bg-[#E5E7EB] my-1" />

                    <div className="flex items-center justify-between text-[1.1rem] font-extrabold text-[#121316]">
                      <span>Total</span>
                      <span className="text-[1.4rem] font-extrabold text-[#121316]">₹{finalTotal.toFixed(0)}</span>
                    </div>
                  </div>

                  <Link href="/checkout" className="w-full h-12 bg-[#121316] text-white border-none rounded-lg text-[0.9rem] font-bold flex items-center justify-center gap-2 hover:bg-[#C39F68] transition-colors">
                    Proceed to Checkout <ArrowRight size={18} />
                  </Link>

                  <div className="flex items-center justify-center gap-1.5 text-[0.78rem] text-[#6B7280]">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    <span>Encrypted 256-Bit SSL Checkout</span>
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
