import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const router = useRouter();
  const { cart, cartCount, subtotal, isCartDrawerOpen, setIsCartDrawerOpen, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    if (isCartDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartDrawerOpen]);

  if (!isCartDrawerOpen) return null;

  const freeShippingThreshold = 1000;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[4px] animate-fade-in" onClick={() => setIsCartDrawerOpen(false)} />

      <div className="relative w-full max-w-[440px] h-full bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.2)] flex flex-col z-10 animate-slide-left">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={20} color="#121316" />
            <h2 className="text-[1.1rem] font-extrabold text-[#121316] tracking-tight">Your Cart ({cartCount})</h2>
          </div>
          <button onClick={() => setIsCartDrawerOpen(false)} className="p-1 rounded-full hover:bg-gray-100 transition-colors" aria-label="Close Cart">
            <X size={22} color="#121316" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="bg-[#FAF8F5] p-4 border-b border-[#EAE6DF] flex flex-col gap-2">
          {remainingForFreeShipping > 0 ? (
            <p className="text-[0.78rem] text-[#4B5563]">
              Add <strong className="text-[#121316]">₹{remainingForFreeShipping.toFixed(0)}</strong> more to get <strong className="text-[#121316]">FREE Shipping</strong>!
            </p>
          ) : (
            <p className="text-[0.78rem] text-[#15803D] font-medium">
              🎉 Congratulations! You unlocked <strong className="font-bold">FREE Shipping</strong>!
            </p>
          )}
          <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#C5A059] to-[#D4B06A] rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center my-auto">
              <ShoppingBag size={48} className="text-gray-300 mb-3" />
              <p className="text-[1rem] font-bold text-[#121316] mb-1">Your cart is empty</p>
              <p className="text-[0.82rem] text-[#6B7280] max-w-[240px] mb-5">Explore our luxury fragrances and grooming essentials.</p>
              <button onClick={() => setIsCartDrawerOpen(false)} className="bg-[#121316] text-white text-[0.8rem] font-bold px-6 py-2.5 rounded-md hover:bg-[#C5A059] transition-colors">
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b border-[#F3F4F6] last:border-b-0">
                <div className="w-[80px] h-[80px] bg-[#FAF7F2] border border-[#EAE5DC] rounded-lg p-2 shrink-0 flex items-center justify-center">
                  <img src={item.img} alt={item.title} className="max-w-full max-h-full object-contain" />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-[0.88rem] font-bold text-[#121316] leading-tight line-clamp-1">{item.title}</h3>
                    {item.variant && <span className="text-[0.72rem] text-[#6B7280] mt-0.5 block">Size: {item.variant}</span>}
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-[0.92rem] font-extrabold text-[#121316]">₹{item.price.toFixed(0)}</span>
                      {item.originalPrice && (
                        <span className="text-[0.78rem] text-[#9CA3AF] line-through">₹{item.originalPrice.toFixed(0)}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-[#E5E7EB] rounded-md bg-[#F9FAFB]">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 flex items-center justify-center text-[0.88rem] font-bold text-[#4B5563] hover:bg-gray-200 rounded-l-md transition-colors">-</button>
                      <span className="w-8 text-center text-[0.78rem] font-bold text-[#121316]">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 flex items-center justify-center text-[0.88rem] font-bold text-[#4B5563] hover:bg-gray-200 rounded-r-md transition-colors">+</button>
                    </div>

                    <button onClick={() => removeFromCart(item.id)} className="p-1 text-[#9CA3AF] hover:text-red-500 transition-colors" aria-label="Remove Item">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#E5E7EB] bg-white flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[0.88rem] text-[#6B7280]">Subtotal</span>
              <span className="text-[1.2rem] font-extrabold text-[#121316]">₹{subtotal.toFixed(0)}</span>
            </div>
            <p className="text-[0.72rem] text-[#9CA3AF]">Taxes and shipping calculated at checkout.</p>

            <div className="grid grid-cols-2 gap-3 mt-1">
              <Link href="/cart" onClick={() => setIsCartDrawerOpen(false)} className="flex items-center justify-center h-11 border border-[#121316] text-[#121316] text-[0.78rem] font-bold rounded-md hover:bg-gray-50 transition-colors no-underline">
                View Full Cart
              </Link>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  router.push('/checkout');
                }}
                className="flex items-center justify-center gap-2 h-11 bg-[#121316] text-white text-[0.78rem] font-bold rounded-md hover:bg-[#C5A059] transition-colors"
              >
                Checkout <ArrowRight size={16} />
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 pt-1 text-[0.72rem] text-[#10B981] font-semibold">
              <ShieldCheck size={14} color="#10B981" />
              <span>100% Secure Checkout Guaranteed</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
