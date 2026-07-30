import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import TrustBar from '@/components/common/TrustBar';
import { productAPI } from '@/api/services/productAPI';
import { IAbout } from '@/types/home';
import { getImageUrl } from '@/utils/imageHelper';
import { Building2, MapPin, Phone, MessageCircle, Mail, Globe } from 'lucide-react';

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

  // Collect images returned by the API
  const mainLogo = aboutData?.logo;
  const galleryImages = [aboutData?.img1, aboutData?.img2, aboutData?.img3].filter(
    (img): img is string => Boolean(img && typeof img === 'string')
  );

  // Collect paragraph items returned by the API
  const paragraphs = [aboutData?.para1, aboutData?.para2, aboutData?.para3].filter(
    (p): p is string => Boolean(p && typeof p === 'string' && p.trim())
  );

  return (
    <>
      <Head>
        <title>{aboutData?.title ? `${aboutData.title} | SK EURO LIFESTYLE` : 'About Us | SK EURO LIFESTYLE'}</title>
        <meta 
          name="description" 
          content={aboutData?.para1 || aboutData?.description || 'Learn more about SK EURO LIFESTYLE.'} 
        />
      </Head>

      <Header />

      <main className="min-h-[70vh] bg-[#FAF8F5] pt-24 sm:pt-32 pb-20 text-[#121316]">
        <div className="max-w-[880px] mx-auto px-4 sm:px-6 space-y-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#121316]">
              {aboutData?.title || 'About Us'}
            </h1>
            <div className="w-12 h-0.5 bg-[#C5A059] mx-auto mt-4 rounded-full" />
          </div>

          {/* Content Card */}
          {loading ? (
            <div className="bg-white rounded-2xl p-12 border border-[#EAE6DF] text-center shadow-sm">
              <div className="w-8 h-8 border-3 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-500 font-medium">Loading details...</p>
            </div>
          ) : aboutData ? (
            <div className="bg-white rounded-2xl p-6 sm:p-10 md:p-12 border border-[#EAE6DF] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-8">
              
              {/* Brand Logo if present */}
              {mainLogo && (
                <div className="flex justify-center pb-6 border-b border-[#F0EDE8]">
                  <img 
                    src={getImageUrl(mainLogo)} 
                    alt={aboutData.title || 'SK Store'} 
                    className="max-h-20 sm:max-h-24 object-contain"
                  />
                </div>
              )}

              {/* Description lead text */}
              {aboutData.description && (
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-normal text-center max-w-2xl mx-auto">
                  {aboutData.description}
                </p>
              )}

              {/* API Paragraphs (para1, para2, para3) */}
              {paragraphs.length > 0 && (
                <div className="space-y-4 text-gray-700 text-base leading-relaxed">
                  {paragraphs.map((para, idx) => (
                    <p key={idx} className="leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              )}

              {/* Rich HTML Content if available */}
              {aboutData.content && (
                <div 
                  className="text-gray-800 text-base leading-relaxed space-y-4 pt-2
                    [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[#121316] [&_h1]:mt-6 [&_h1]:mb-3
                    [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#121316] [&_h2]:mt-6 [&_h2]:mb-3
                    [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[#121316] [&_h3]:mt-4 [&_h3]:mb-2
                    [&_p]:leading-relaxed [&_p]:mb-4
                    [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ul]:mb-4
                    [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_ol]:mb-4
                    [&_strong]:font-semibold [&_strong]:text-[#121316]"
                  dangerouslySetInnerHTML={{ __html: aboutData.content }} 
                />
              )}

              {/* Gallery Images (img1, img2, img3) */}
              {galleryImages.length > 0 && (
                <div className="pt-6 border-t border-[#F0EDE8]">
                  <div className={`grid gap-4 ${
                    galleryImages.length === 1 
                      ? 'grid-cols-1 max-w-md mx-auto' 
                      : galleryImages.length === 2 
                      ? 'grid-cols-1 sm:grid-cols-2' 
                      : 'grid-cols-1 sm:grid-cols-3'
                  }`}>
                    {galleryImages.map((img, idx) => (
                      <div 
                        key={idx} 
                        className="overflow-hidden rounded-xl border border-[#EAE6DF] bg-[#FAF8F5] aspect-video sm:aspect-square flex items-center justify-center p-2"
                      >
                        <img 
                          src={getImageUrl(img)} 
                          alt={`About Image ${idx + 1}`} 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 border border-[#EAE6DF] text-center shadow-sm">
              <p className="text-gray-600">No about information available at the moment.</p>
            </div>
          )}

          {/* Company Details & Customer Care Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[#EAE6DF] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
            <div className="flex items-center gap-3.5 border-b border-[#F0EDE8] pb-5">
              <div className="w-11 h-11 rounded-xl bg-[#FDF8F0] border border-[#F5E6CD] flex items-center justify-center text-[#C5A059] shrink-0">
                <Building2 size={22} />
              </div>
              <div>
                <span className="text-[0.7rem] font-bold tracking-[0.14em] text-[#C5A059] uppercase block mb-0.5">
                  MANUFACTURED & MARKETED BY
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#121316]">
                  SK EURO LIFESTYLE
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#333333]">
              {/* Address */}
              <div className="bg-[#FAF8F5] p-5 rounded-xl border border-[#F0EDE8] flex items-start gap-3.5">
                <MapPin className="text-[#C5A059] shrink-0 mt-0.5" size={20} />
                <div>
                  <h3 className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-1">Office & Manufacturing Address</h3>
                  <p className="text-sm font-medium text-gray-800 leading-relaxed">
                    Choorakode - 679336 Palakkad Dt,<br />
                    Kerala, India
                  </p>
                </div>
              </div>

              {/* Customer Care Contacts */}
              <div className="bg-[#FAF8F5] p-5 rounded-xl border border-[#F0EDE8] space-y-3">
                <h3 className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-2">Customer Care & Support</h3>
                
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="text-[#C5A059] shrink-0" size={17} />
                  <a href="tel:+914662236207" className="text-gray-800 hover:text-[#C5A059] font-semibold transition-colors">
                    +91 466 2236 207
                  </a>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <MessageCircle className="text-[#25D366] shrink-0" size={17} />
                  <a href="https://wa.me/919072171712" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-[#C5A059] font-semibold transition-colors">
                    +91 9072 17 17 12
                  </a>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Mail className="text-[#C5A059] shrink-0" size={17} />
                  <a href="mailto:support@skeurolifestyle.com" className="text-gray-800 hover:text-[#C5A059] font-semibold transition-colors">
                    support@skeurolifestyle.com
                  </a>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Globe className="text-[#C5A059] shrink-0" size={17} />
                  <a href="https://www.skeurolifestyle.com" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-[#C5A059] font-semibold transition-colors">
                    www.skeurolifestyle.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Store Trust Features */}
        <div className="mt-16">
          <TrustBar />
        </div>
      </main>

      <Footer />
    </>
  );
}

