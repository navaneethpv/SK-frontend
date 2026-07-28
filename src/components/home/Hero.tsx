import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { productAPI } from '@/api/services/productAPI';
import { getImageUrl } from '@/utils/imageHelper';

interface SlideItem {
  id: number;
  img: string;
  link: string;
  title?: string;
}

const DEFAULT_SLIDES: SlideItem[] = [
  { id: 1, img: '/banners/banner1.png', link: '/shop', title: 'SK Organic Hair Oil & Botanical Care' },
  { id: 2, img: '/banners/banner2.png', link: '/shop', title: 'SK Noir Luxury Eau De Parfum' },
  { id: 3, img: '/banners/banner3.png', link: '/shop', title: 'SK Vitamin C Brightening Serum' }
];

export default function Hero() {
  const [slides, setSlides] = useState<SlideItem[]>(DEFAULT_SLIDES);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    productAPI.getSlides()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item: any, idx: number) => {
            const rawImg = item.image || item.img || item.banner || item.file || item.icon;
            const validImg = rawImg ? getImageUrl(rawImg, DEFAULT_SLIDES[idx % DEFAULT_SLIDES.length].img) : DEFAULT_SLIDES[idx % DEFAULT_SLIDES.length].img;
            return {
              id: item.id || idx + 1,
              img: validImg,
              link: item.link || item.url || '/shop',
              title: item.title || item.name || `Banner ${idx + 1}`
            };
          });
          setSlides(mapped);
        } else {
          setSlides(DEFAULT_SLIDES);
        }
      })
      .catch((err) => {
        console.warn('Hero slides API fallback:', err);
        setSlides(DEFAULT_SLIDES);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const [isHovered, setIsHovered] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-slide effect (4.5s) with hover pause
  useEffect(() => {
    if (slides.length <= 1 || isHovered) return;

    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length, isHovered]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  if (loading) {
    return (
      <section className="w-full min-h-[720px] bg-gray-100">
        <div className="w-full min-h-[720px] flex items-center justify-center">
          <div className="w-full h-[720px] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  const slide = slides[currentSlide] || slides[0];

  return (
    <section
      className="w-screen relative bg-[#111111] overflow-hidden pt-[54px] md:pt-[60px] lg:pt-[72px] xl:pt-[96px]"
      style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full h-[280px] md:h-[380px] lg:h-[480px] xl:h-[720px] relative flex items-center justify-center overflow-hidden">
        <Link href={slide.link} className="block w-full h-full">
          <img
            src={slide.img}
            alt={slide.title || "SK Banner"}
            className="w-full h-full object-cover object-center block"
          />
        </Link>

        {slides.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute top-1/2 -translate-y-1/2 left-2 md:left-4 lg:left-8 w-8 h-8 md:w-9 md:h-9 lg:w-12 lg:h-12 rounded-full bg-white border-0 shadow-[0_4px_14px_rgba(0,0,0,0.2)] flex items-center justify-center cursor-pointer z-10 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#C5A059] hover:scale-105 group focus-visible:outline-2 focus-visible:outline-[#C5A059] focus-visible:outline-offset-2"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={18} className="text-[#121316] group-hover:text-white transition-colors" />
            </button>
            <button
              onClick={handleNext}
              className="absolute top-1/2 -translate-y-1/2 right-2 md:right-4 lg:right-8 w-8 h-8 md:w-9 md:h-9 lg:w-12 lg:h-12 rounded-full bg-white border-0 shadow-[0_4px_14px_rgba(0,0,0,0.2)] flex items-center justify-center cursor-pointer z-10 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#C5A059] hover:scale-105 group focus-visible:outline-2 focus-visible:outline-[#C5A059] focus-visible:outline-offset-2"
              aria-label="Next Slide"
            >
              <ChevronRight size={18} className="text-[#121316] group-hover:text-white transition-colors" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
