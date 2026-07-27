import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { productAPI } from '../Api/Services/productAPI';
import { getImageUrl } from '../utils/imageHelper';

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
      <section className="hero-section">
        <div className="hero-banner-container loading-skeleton">
          <div className="skeleton-pulse"></div>
        </div>
        <style jsx>{`
          .hero-section { width: 100%; min-height: 420px; background-color: #f3f4f6; }
          .hero-banner-container { width: 100%; min-height: 420px; display: flex; align-items: center; justify-content: center; }
          .skeleton-pulse { width: 100%; height: 420px; background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%); background-size: 200% 100%; animation: pulse 1.5s infinite; }
          @keyframes pulse { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        `}</style>
      </section>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  const slide = slides[currentSlide] || slides[0];

  return (
    <section
      className="hero-section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="hero-banner-container">
        <Link href={slide.link} className="hero-banner-link">
          <img
            src={slide.img}
            alt={slide.title || "SK Banner"}
            className="hero-banner-img"
          />
        </Link>

        {slides.length > 1 && (
          <>
            <button onClick={handlePrev} className="carousel-arrow left-arrow" aria-label="Previous Slide">
              <ChevronLeft size={18} color="#121316" />
            </button>
            <button onClick={handleNext} className="carousel-arrow right-arrow" aria-label="Next Slide">
              <ChevronRight size={18} color="#121316" />
            </button>
          </>
        )}
      </div>

      <style jsx>{`
        .hero-section {
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          margin-right: calc(-50vw + 50%);
          position: relative;
          background-color: #111111;
          padding-top: 96px;
          overflow: hidden;
        }

        .hero-banner-container {
          width: 100%;
          height: 520px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .hero-banner-link {
          display: block;
          width: 100%;
          height: 100%;
        }

        .hero-banner-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }

        .carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #ffffff;
          border: none;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .carousel-arrow:focus-visible {
          outline: 2px solid #C5A059;
          outline-offset: 2px;
        }

        .carousel-arrow:hover {
          background: #C5A059;
          transform: translateY(-50%) scale(1.05);
        }

        .carousel-arrow:hover :global(svg) {
          color: #ffffff !important;
          stroke: #ffffff !important;
        }

        .left-arrow {
          left: 2rem;
        }

        .right-arrow {
          right: 2rem;
        }

        @media (max-width: 1024px) {
          .hero-section {
            padding-top: 86px;
          }
          .hero-banner-container {
            height: 420px;
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            padding-top: 76px;
          }
          .hero-banner-container {
            height: 300px;
          }
          .left-arrow, .right-arrow {
            width: 40px;
            height: 40px;
          }
          .left-arrow { left: 0.8rem; }
          .right-arrow { right: 0.8rem; }
        }

        @media (max-width: 480px) {
          .hero-section {
            padding-top: 70px;
          }
          .hero-banner-container {
            height: 220px;
          }
        }
      `}</style>
    </section>
  );
}
