import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { productAPI } from '@/api/services/productAPI';
import { getImageUrl } from '@/utils/imageHelper';
import { ISlide } from '@/types/home';

interface SlideItem {
  id: number;
  img: string;
  link: string;
  title?: string;
  subtitle?: string;
  sub_title?: string;
  desc?: string;
  visibleTime?: number;
}

export default function Hero() {
  const [slides, setSlides] = useState<SlideItem[]>([]);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);

  // Fetch API slides on mount
  useEffect(() => {
    productAPI.getSlides()
      .then((data: ISlide[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const sorted = [...data].sort((a, b) => (a.priority || 0) - (b.priority || 0));

          const mapped: SlideItem[] = sorted.map((item, idx) => {
            const rawImg = item.file || item.image || item.img || item.popup;
            const targetLink = item.link1 || item.link2 || item.link || item.url || '/shop';

            return {
              id: item.id || idx + 1,
              img: getImageUrl(rawImg, ''),
              link: targetLink,
              title: item.title,
              subtitle: item.sub_title || item.subtitle,
              desc: item.desc,
              visibleTime: item.visible_time || 5
            };
          });

          setSlides(mapped.filter((s) => Boolean(s.img)));
        } else {
          setSlides([]);
        }
      })
      .catch((err) => {
        console.warn('Hero slides API notice:', err);
        setSlides([]);
      });
  }, []);

  // Auto-slide effect with hover pause
  useEffect(() => {
    if (slides.length <= 1 || isHovered) return;

    const currentItem = slides[currentSlide];
    const duration = currentItem?.visibleTime ? currentItem.visibleTime * 1000 : 4500;

    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, duration);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides, currentSlide, isHovered]);

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
      className="w-screen relative bg-[#111111] overflow-hidden pt-[58px] lg:pt-[68px]"
      style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full h-[400px] sm:h-[480px] md:h-[580px] lg:h-[660px] xl:h-[740px] relative flex items-center overflow-hidden">
        {/* Background Image Slide */}
        <a href={slide.link} className="absolute inset-0 w-full h-full block">
          {slide.img && (
            <img
              src={slide.img}
              alt={slide.title || 'SK Banner'}
              className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out scale-100"
            />
          )}
          {/* Left-heavy gradient vignette for high text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30" />
        </a>

        {/* Hero Text Content Overlay (Left Aligned Luxury Editorial Style) */}
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 xl:px-28 relative z-10 flex items-center justify-start pointer-events-none">
          <div className="max-w-[680px] text-left flex flex-col items-start gap-3.5 sm:gap-5">
            {/* Subtitle / Gold Accent Bar */}
            {(slide.subtitle || slide.sub_title) && (
              <div className="flex items-center gap-3 animate-fade-in">
                <span className="w-8 h-[2px] bg-[#C39F68]" />
                <span className="text-[0.7rem] sm:text-[0.78rem] md:text-[0.85rem] font-extrabold tracking-[0.25em] text-[#C39F68] uppercase">
                  {slide.subtitle || slide.sub_title}
                </span>
              </div>
            )}

            {/* Main Editorial Title */}
            {slide.title && (
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12] drop-shadow-md">
                {slide.title}
              </h1>
            )}

            {/* Description Paragraph */}
            {slide.desc && (
              <p className="text-xs sm:text-sm md:text-base text-gray-300 font-normal leading-relaxed max-w-lg line-clamp-3">
                {slide.desc}
              </p>
            )}

            {/* Premium CTA Button */}
            <a
              href={slide.link || '/shop'}
              className="pointer-events-auto mt-2 sm:mt-4 inline-flex items-center gap-3 bg-[#C39F68] text-[#111111] hover:bg-white hover:text-[#111111] px-7 sm:px-9 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-extrabold tracking-widest uppercase transition-all duration-300 shadow-[0_10px_30px_rgba(195,159,104,0.35)] hover:-translate-y-0.5 no-underline cursor-pointer group"
            >
              <span>EXPLORE COLLECTION</span>
              <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center cursor-pointer z-20 transition-all duration-300 hover:bg-[#C39F68] hover:border-[#C39F68] hover:scale-110"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center cursor-pointer z-20 transition-all duration-300 hover:bg-[#C39F68] hover:border-[#C39F68] hover:scale-110"
              aria-label="Next Slide"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}

        {/* Left Aligned Carousel Indicator Dots */}
        {slides.length > 1 && (
          <div className="absolute bottom-8 left-6 sm:left-12 lg:left-20 xl:left-28 flex items-center gap-2.5 z-20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === idx ? 'w-9 bg-[#C39F68]' : 'w-3 bg-white/40 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Scroll Down Button */}
        <button
          type="button"
          onClick={scrollToNextSection}
          className="absolute bottom-6 right-6 sm:right-12 hidden md:flex w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/30 text-white items-center justify-center cursor-pointer z-30 transition-all duration-300 hover:bg-[#C39F68] hover:border-[#C39F68] hover:scale-110 animate-bounce shadow-lg"
          aria-label="Scroll to next section"
          title="Scroll Down"
        >
          <ChevronDown size={20} className="text-white" />
        </button>
      </div>
    </section>
  );
}
