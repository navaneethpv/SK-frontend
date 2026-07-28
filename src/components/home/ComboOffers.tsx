import React from 'react';
import Link from 'next/link';

export default function ComboOffers() {
  return (
    <section className="w-full py-[1.8rem] sm:py-[2.2rem] lg:py-16 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="mb-[1.4rem] lg:mb-[2.2rem]">
          <h2 className="text-[1.15rem] sm:text-[1.25rem] lg:text-[1.6rem] font-bold text-[#121316] mb-[0.3rem]">
            Build Your Bundle
          </h2>
          <p className="text-[0.75rem] sm:text-[0.8rem] lg:text-[0.9rem] text-[#6B7280]">
            Get Super Saving Deals - <span className="italic font-semibold text-[#121316]">Starting at @599</span>
          </p>
        </div>

        {/* 3 Main Bundle Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-[1.2rem] lg:mb-[1.8rem]">
          {/* Card 1: Essential Grooming Kit */}
          <div className="rounded-lg overflow-hidden bg-[#f5f5f5] shadow-[0_4px_14px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:-translate-y-1">
            <div className="relative w-full aspect-[1.1] max-h-[130px] sm:aspect-[1.15] sm:max-h-[180px] lg:aspect-[0.92] lg:max-h-none overflow-hidden">
              <img src="/bundle - combo offer/1.png" alt="Essential Grooming Kit" className="w-full h-full object-cover block" />
              <div className="absolute top-6 left-6 right-6 z-10 flex flex-col items-start gap-2">
                <Link href="/shop?bundle=grooming" className="mt-1 bg-black text-white text-[0.75rem] font-bold px-5 py-2 rounded transition-colors hover:bg-[#C39F68]">
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Premium Lifestyle Collection */}
          <div className="rounded-lg overflow-hidden bg-[#f5f5f5] shadow-[0_4px_14px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:-translate-y-1">
            <div className="relative w-full aspect-[1.1] max-h-[130px] sm:aspect-[1.15] sm:max-h-[180px] lg:aspect-[0.92] lg:max-h-none overflow-hidden">
              <img src="/bundle - combo offer/2.png" alt="Premium Lifestyle Collection" className="w-full h-full object-cover block" />
              <div className="absolute top-6 left-6 right-6 z-10 flex flex-col items-start gap-2">
                <Link href="/shop?bundle=lifestyle" className="mt-1 bg-black text-white text-[0.75rem] font-bold px-5 py-2 rounded transition-colors hover:bg-[#C39F68]">
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3: Executive Essentials */}
          <div className="rounded-lg overflow-hidden bg-[#f5f5f5] shadow-[0_4px_14px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:-translate-y-1">
            <div className="relative w-full aspect-[1.1] max-h-[130px] sm:aspect-[1.15] sm:max-h-[180px] lg:aspect-[0.92] lg:max-h-none overflow-hidden">
              <img src="/bundle - combo offer/3.png" alt="Executive Essentials" className="w-full h-full object-cover block" />
              <div className="absolute top-6 left-6 right-6 z-10 flex flex-col items-start gap-2">
                <Link href="/shop?bundle=executive" className="mt-1 bg-black text-white text-[0.75rem] font-bold px-5 py-2 rounded transition-colors hover:bg-[#C39F68]">
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Mini Offer Cards below */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-6">
          {/* Offer Card 1 */}
          <div className="bg-transparent border-0 rounded-none pt-2.5 sm:pt-3.2 pb-2.5 sm:pb-0 border-b border-[#F0EDE8] sm:border-b-0 flex items-end justify-between">
            <div className="flex flex-col gap-1.5">
              <h4 className="text-[0.82rem] sm:text-[0.88rem] lg:text-[1.05rem] font-bold text-black">Luxury Scent Box</h4>
              <span className="inline-block text-[0.62rem] font-bold px-[0.45rem] py-[0.15rem] rounded-[3px] tracking-wide self-start border-[1.5px] border-[#10B981] text-[#10B981] bg-transparent">LUXURY SCENTS</span>
              <span className="text-[0.82rem] sm:text-[0.88rem] lg:text-[1.05rem] font-extrabold text-black">₹1,099</span>
            </div>
            <button className="bg-[#27272A] text-white border-none text-[0.68rem] sm:text-[0.7rem] lg:text-[0.76rem] font-bold px-3 sm:px-3.5 lg:px-4.5 py-1.5 sm:py-2 rounded-md cursor-pointer transition-colors hover:bg-black">Build Box</button>
          </div>

          {/* Offer Card 2 */}
          <div className="bg-transparent border-0 rounded-none pt-2.5 sm:pt-3.2 pb-2.5 sm:pb-0 border-b border-[#F0EDE8] sm:border-b-0 flex items-end justify-between">
            <div className="flex flex-col gap-1.5">
              <h4 className="text-[0.82rem] sm:text-[0.88rem] lg:text-[1.05rem] font-bold text-black">Mini Perfume Box</h4>
              <span className="inline-block text-[0.62rem] font-bold px-[0.45rem] py-[0.15rem] rounded-[3px] tracking-wide self-start bg-[#FEF08A] text-[#854D0E]">BESTSELLER</span>
              <span className="text-[0.82rem] sm:text-[0.88rem] lg:text-[1.05rem] font-extrabold text-black">
                ₹599 <del className="text-[0.82rem] text-[#9CA3AF] ml-1 font-normal line-through">₹4,497</del>
              </span>
            </div>
            <button className="bg-[#27272A] text-white border-none text-[0.68rem] sm:text-[0.7rem] lg:text-[0.76rem] font-bold px-3 sm:px-3.5 lg:px-4.5 py-1.5 sm:py-2 rounded-md cursor-pointer transition-colors hover:bg-black">Build Box</button>
          </div>

          {/* Offer Card 3 */}
          <div className="bg-transparent border-0 rounded-none pt-2.5 sm:pt-3.2 pb-2.5 sm:pb-0 flex items-end justify-between">
            <div className="flex flex-col gap-1.5">
              <h4 className="text-[0.82rem] sm:text-[0.88rem] lg:text-[1.05rem] font-bold text-black">Self Grooming Kit</h4>
              <span className="inline-block text-[0.62rem] font-bold px-[0.45rem] py-[0.15rem] rounded-[3px] tracking-wide self-start border-[1.5px] border-[#06B6D4] text-[#06B6D4] bg-transparent">VALUE DEAL</span>
              <span className="text-[0.82rem] sm:text-[0.88rem] lg:text-[1.05rem] font-extrabold text-black">₹599</span>
            </div>
            <button className="bg-[#27272A] text-white border-none text-[0.68rem] sm:text-[0.7rem] lg:text-[0.76rem] font-bold px-3 sm:px-3.5 lg:px-4.5 py-1.5 sm:py-2 rounded-md cursor-pointer transition-colors hover:bg-black">Build Box</button>
          </div>
        </div>
      </div>
    </section>
  );
}
