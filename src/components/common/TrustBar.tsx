import React from 'react';
import { Truck, ShieldCheck, Award, RefreshCw } from 'lucide-react';

export default function TrustBar() {
  return (
    <section className="w-full bg-[#FAF8F5] py-[1rem] sm:py-[1.2rem] lg:py-[1.8rem] border-t border-b border-[#F0EDE8]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div className="flex items-center gap-[0.8rem]">
            <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-[42px] lg:h-[42px] rounded-full bg-white border border-[#EAE6DF] flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <Truck size={20} color="#C5A059" />
            </div>
            <div className="flex flex-col">
              <span className="text-[0.72rem] sm:text-[0.76rem] lg:text-[0.82rem] font-bold text-[#121316] leading-tight">Free Express Shipping</span>
              <span className="text-[0.62rem] sm:text-[0.66rem] lg:text-[0.72rem] text-[#6B7280] mt-[2px]">On all orders over ₹499</span>
            </div>
          </div>

          <div className="flex items-center gap-[0.8rem]">
            <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-[42px] lg:h-[42px] rounded-full bg-white border border-[#EAE6DF] flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <Award size={20} color="#C5A059" />
            </div>
            <div className="flex flex-col">
              <span className="text-[0.72rem] sm:text-[0.76rem] lg:text-[0.82rem] font-bold text-[#121316] leading-tight">100% Organic Formulations</span>
              <span className="text-[0.62rem] sm:text-[0.66rem] lg:text-[0.72rem] text-[#6B7280] mt-[2px]">Dermatologically tested & certified</span>
            </div>
          </div>

          <div className="flex items-center gap-[0.8rem]">
            <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-[42px] lg:h-[42px] rounded-full bg-white border border-[#EAE6DF] flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <ShieldCheck size={20} color="#C5A059" />
            </div>
            <div className="flex flex-col">
              <span className="text-[0.72rem] sm:text-[0.76rem] lg:text-[0.82rem] font-bold text-[#121316] leading-tight">Authenticity Guaranteed</span>
              <span className="text-[0.62rem] sm:text-[0.66rem] lg:text-[0.72rem] text-[#6B7280] mt-[2px]">Direct from official SK laboratory</span>
            </div>
          </div>

          <div className="flex items-center gap-[0.8rem]">
            <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-[42px] lg:h-[42px] rounded-full bg-white border border-[#EAE6DF] flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <RefreshCw size={20} color="#C5A059" />
            </div>
            <div className="flex flex-col">
              <span className="text-[0.72rem] sm:text-[0.76rem] lg:text-[0.82rem] font-bold text-[#121316] leading-tight">7-Day Easy Returns</span>
              <span className="text-[0.62rem] sm:text-[0.66rem] lg:text-[0.72rem] text-[#6B7280] mt-[2px]">100% satisfaction promise</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
