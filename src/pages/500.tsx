import React from 'react';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

export default function Custom500() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 flex items-center justify-center pt-32 pb-16 px-8">
        <div className="text-center max-w-[450px]">
          <h1 className="text-[3.5rem] font-extrabold text-[#121316]">500</h1>
          <p className="text-[1rem] text-[#6B7280] my-4 mb-8">Server Error - Something went wrong on our server.</p>
          <Link href="/" className="inline-block bg-[#121316] text-white px-7 py-3 rounded-md font-bold text-[0.88rem] hover:bg-[#C5A059] transition-colors">
            Return to Homepage
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
