import React from 'react';

export default function ReviewsSection() {
  return (
    <section className="w-full py-[2rem] sm:py-[3rem] lg:py-[4.5rem] bg-[#FAF8F5] border-t border-[#F0EDE8]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="text-center mb-[1.4rem] sm:mb-[1.8rem] lg:mb-[2.5rem]">
          <span className="text-[0.65rem] lg:text-[0.72rem] font-extrabold tracking-[0.14em] text-[#C5A059] block mb-[0.3rem]">REAL RESULTS</span>
          <h2 className="text-[1.15rem] sm:text-[1.25rem] lg:text-[1.5rem] font-extrabold text-[#121316] tracking-[0.04em]">LOVED BY THOUSANDS</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.2 sm:gap-4 lg:gap-6">
          <div className="bg-white border border-[#EAE6DF] rounded-xl p-4 sm:p-5 lg:p-7 flex flex-col gap-2.5 sm:gap-3 lg:gap-3.2 shadow-[0_4px_14px_rgba(0,0,0,0.04)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] hover:border-[#C5A059]">
            <div className="flex items-center gap-[0.8rem]">
              <div className="w-[34px] sm:w-[40px] h-[34px] sm:h-[40px] rounded-full bg-gradient-to-br from-[#121316] to-[#27272A] text-[#C5A059] text-[0.75rem] sm:text-[0.82rem] font-extrabold flex items-center justify-center">AK</div>
              <div className="flex flex-col">
                <span className="text-[0.82rem] sm:text-[0.9rem] font-bold text-[#121316]">Ananya K.</span>
                <span className="text-[0.68rem] font-semibold text-[#15803D]">✔ Verified Buyer</span>
              </div>
            </div>
            <div className="text-[#F59E0B] text-[0.9rem] tracking-[0.1em]">★★★★★</div>
            <p className="text-[0.78rem] sm:text-[0.8rem] lg:text-[0.86rem] text-[#4B5563] leading-[1.4] sm:leading-[1.45] lg:leading-[1.55] italic">"The SK Noir Eau De Parfum smells divine and lasts literally all day. Everyone asks me what fragrance I am wearing!"</p>
          </div>

          <div className="bg-white border border-[#EAE6DF] rounded-xl p-4 sm:p-5 lg:p-7 flex flex-col gap-2.5 sm:gap-3 lg:gap-3.2 shadow-[0_4px_14px_rgba(0,0,0,0.04)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] hover:border-[#C5A059]">
            <div className="flex items-center gap-[0.8rem]">
              <div className="w-[34px] sm:w-[40px] h-[34px] sm:h-[40px] rounded-full bg-gradient-to-br from-[#121316] to-[#27272A] text-[#C5A059] text-[0.75rem] sm:text-[0.82rem] font-extrabold flex items-center justify-center">RM</div>
              <div className="flex flex-col">
                <span className="text-[0.82rem] sm:text-[0.9rem] font-bold text-[#121316]">Rahul M.</span>
                <span className="text-[0.68rem] font-semibold text-[#15803D]">✔ Verified Buyer</span>
              </div>
            </div>
            <div className="text-[#F59E0B] text-[0.9rem] tracking-[0.1em]">★★★★★</div>
            <p className="text-[0.78rem] sm:text-[0.8rem] lg:text-[0.86rem] text-[#4B5563] leading-[1.4] sm:leading-[1.45] lg:leading-[1.55] italic">"SK Organic Hair Oil changed my hair routine completely. Noticeable thickness and shine within two weeks."</p>
          </div>

          <div className="bg-white border border-[#EAE6DF] rounded-xl p-4 sm:p-5 lg:p-7 flex flex-col gap-2.5 sm:gap-3 lg:gap-3.2 shadow-[0_4px_14px_rgba(0,0,0,0.04)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] hover:border-[#C5A059]">
            <div className="flex items-center gap-[0.8rem]">
              <div className="w-[34px] sm:w-[40px] h-[34px] sm:h-[40px] rounded-full bg-gradient-to-br from-[#121316] to-[#27272A] text-[#C5A059] text-[0.75rem] sm:text-[0.82rem] font-extrabold flex items-center justify-center">PS</div>
              <div className="flex flex-col">
                <span className="text-[0.82rem] sm:text-[0.9rem] font-bold text-[#121316]">Priya S.</span>
                <span className="text-[0.68rem] font-semibold text-[#15803D]">✔ Verified Buyer</span>
              </div>
            </div>
            <div className="text-[#F59E0B] text-[0.9rem] tracking-[0.1em]">★★★★★</div>
            <p className="text-[0.78rem] sm:text-[0.8rem] lg:text-[0.86rem] text-[#4B5563] leading-[1.4] sm:leading-[1.45] lg:leading-[1.55] italic">"The Vitamin C Face Wash is super gentle yet powerful. Skin feels refreshed, bright, and deeply hydrated."</p>
          </div>
        </div>
      </div>
    </section>
  );
}
