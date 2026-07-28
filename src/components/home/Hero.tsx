import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

interface SlideItem {
  id: number;
  img: string;
  link: string;
  title?: string;
}

const DEFAULT_SLIDES: SlideItem[] = [
  { id: 1, img: '/banners/banner1.png', link: '/shop', title: 'SK Organic Hair Oil & Botanical Care' },
  { id: 2, img: '/banners/banner2.png', link: '/shop', title: 'SK Noir Luxury Eau De Parfum' }
];

export default function Hero() {
  const [slides] = useState<SlideItem[]>(DEFAULT_SLIDES);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);

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

  const scrollToNextSection = () => {
    if (heroRef.current) {
      const heroRect = heroRef.current.getBoundingClientRect();
      const nextTarget = window.scrollY + heroRect.bottom;
      window.scrollTo({
        top: nextTarget,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  if (slides.length === 0) {
    return null;
  }

  const slide = slides[currentSlide] || slides[0];

  return (
    <section
      ref={heroRef}
      className="w-screen relative bg-[#111111] overflow-hidden pt-[54px] md:pt-[60px] lg:pt-[72px] xl:pt-[96px]"
      style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full h-[340px] md:h-[460px] lg:h-[600px] xl:h-[850px] relative flex items-center justify-center overflow-hidden">
        {/* Background Image Slide */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={slide.img}
            alt={slide.title || 'SK Banner'}
            className="w-full h-full object-cover object-center transition-all duration-700 ease-out scale-100"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/banners/banner1.png';
            }}
          />
          {/* Subtle overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        </div>

        {/* Carousel Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white flex items-center justify-center cursor-pointer z-20 transition-all duration-300 hover:bg-black/70 hover:scale-110"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white flex items-center justify-center cursor-pointer z-20 transition-all duration-300 hover:bg-black/70 hover:scale-110"
              aria-label="Next Slide"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Carousel Indicator Dots */}
        {slides.length > 1 && (
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === idx ? 'w-8 bg-[#C39F68]' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Scroll Down Arrow Button */}
        <button
          type="button"
          onClick={scrollToNextSection}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/30 text-white flex items-center justify-center cursor-pointer z-30 transition-all duration-300 hover:bg-[#C39F68] hover:border-[#C39F68] hover:scale-110 animate-bounce shadow-lg"
          aria-label="Scroll to next section"
          title="Scroll Down"
        >
          <ChevronDown size={22} className="text-white" />
        </button>
      </div>
    </section>
  );
}
