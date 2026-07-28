import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { productAPI } from '@/api/services/productAPI';
import { IAbout } from '@/types/home';

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<IAbout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productAPI.getAbouts()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAboutData(data[0]);
        }
      })
      .catch((err) => {
        console.error('Error fetching about data:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Head>
        <title>About Us | SK Store</title>
        <meta name="description" content="Learn more about SK Store." />
      </Head>

      <Header />

      <main className="min-h-[60vh] pt-24 md:pt-32 pb-16 bg-[#FAF8F5]">
        <div className="max-w-[900px] mx-auto px-6">
          <h1 className="text-[2rem] md:text-[2.5rem] font-bold text-[#121316] mb-8 text-center">About Us</h1>
          
          {loading ? (
            <div className="text-center py-16 text-[#6B7280] text-[1.1rem]">Loading...</div>
          ) : aboutData ? (
            <div className="bg-white rounded-xl p-6 md:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              {aboutData.logo && (
                <div className="flex justify-center mb-8">
                  <img src={aboutData.logo} alt="About SK" className="max-h-[120px] object-contain" />
                </div>
              )}
              {aboutData.title && <h2 className="text-[1.8rem] font-semibold text-[#121316] mb-6 text-center">{aboutData.title}</h2>}
              {aboutData.description && <p className="text-[1.1rem] leading-relaxed text-[#4B5563] mb-8 text-center">{aboutData.description}</p>}
              {aboutData.content && (
                <div 
                  className="text-[1.05rem] leading-loose text-[#374151] [&_p]:mb-4 [&_h1]:text-[#121316] [&_h1]:mt-6 [&_h1]:mb-4 [&_h2]:text-[#121316] [&_h2]:mt-6 [&_h2]:mb-4 [&_h3]:text-[#121316] [&_h3]:mt-6 [&_h3]:mb-4" 
                  dangerouslySetInnerHTML={{ __html: aboutData.content }} 
                />
              )}
            </div>
          ) : (
            <div className="text-center py-16 text-[#6B7280] bg-white rounded-xl">
              <p>No information available at the moment.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
