import React from 'react';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

function Error({ statusCode }: { statusCode?: number }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 flex items-center justify-center pt-32 pb-16 px-8">
        <div className="text-center max-w-[450px]">
          <h1 className="text-[3.5rem] font-extrabold text-[#121316]">{statusCode || 'Error'}</h1>
          <p className="text-[1rem] text-[#6B7280] my-4 mb-8">
            {statusCode
              ? `An error ${statusCode} occurred on server`
              : 'An unexpected error occurred on client'}
          </p>
          <Link href="/" className="inline-block bg-[#121316] text-white px-7 py-3 rounded-md font-bold text-[0.88rem] hover:bg-[#C5A059] transition-colors">
            Return to Homepage
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

Error.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
