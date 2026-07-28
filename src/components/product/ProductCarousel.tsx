import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

export interface ItemCard {
  id: number;
  title: string;
  slug?: string;
  rating?: string;
  reviewsCount?: number;
  discountBadge?: string;
  price: string;
  originalPrice?: string;
  badgeText?: string;
  badgeType?: 'green' | 'gold' | 'none';
  img: string;
  actionText: string;
}

export function RenderProductCard({ item }: { item: ItemCard }) {
  const rawPrice = item.price ? item.price.replace(/[^\d.]/g, '') : '';
  const numericPrice = parseFloat(rawPrice);
  const rawOrig = item.originalPrice ? item.originalPrice.replace(/[^\d.]/g, '') : '';
  const numericOrig = parseFloat(rawOrig);

  return (
    <ProductCard
      id={item.id}
      name={item.title}
      img={item.img}
      price={isNaN(numericPrice) ? item.price : numericPrice}
      originalPrice={isNaN(numericOrig) ? undefined : numericOrig}
      rating={item.rating || '4.8'}
      reviewsCount={item.reviewsCount || 45}
      badgeText={item.discountBadge || item.badgeText}
      badgeType={item.badgeType || (item.discountBadge ? 'green' : 'gold')}
    />
  );
}

export default function ProductCarousel({
  items,
  title,
  subtag,
  viewAllLink
}: {
  items: ItemCard[];
  title?: string;
  subtag?: string;
  viewAllLink?: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 650) {
        setItemsPerPage(2);
      } else if (window.innerWidth <= 1100) {
        setItemsPerPage(3);
      } else {
        setItemsPerPage(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, items.length - Math.floor(itemsPerPage));

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="w-full relative my-6">
      {(title || subtag || viewAllLink) && (
        <div className="flex items-end justify-between mb-6">
          <div>
            {subtag && <span className="text-[0.72rem] font-bold tracking-[0.14em] text-[#C39F68] block mb-1 uppercase">{subtag}</span>}
            {title && <h2 className="text-[1.35rem] lg:text-[1.5rem] font-extrabold tracking-[0.04em] text-[#111111]">{title}</h2>}
          </div>
          {viewAllLink && (
            <Link href={viewAllLink} className="text-[0.82rem] font-bold text-[#111111] hover:text-[#C39F68] transition-colors no-underline">
              View All →
            </Link>
          )}
        </div>
      )}

      <div className="relative w-full">
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-5 w-10 h-10 rounded-full bg-white border border-[#E4E4E7] flex items-center justify-center cursor-pointer z-30 shadow-[0_4px_14px_rgba(0,0,0,0.12)] transition-all duration-200 hover:bg-[#121316] hover:border-[#121316] hover:scale-105 group"
            aria-label="Previous"
          >
            <ChevronLeft size={18} className="text-[#71717A] group-hover:text-white transition-colors" />
          </button>
        )}

        <div className="overflow-hidden w-full py-2">
          <div
            className="flex gap-4 lg:gap-6 transition-transform duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="shrink-0 grow-0 w-[calc((100%-1rem)/2)] sm:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-4.5rem)/4)]"
              >
                <RenderProductCard item={item} />
              </div>
            ))}
          </div>
        </div>

        {items.length > itemsPerPage && currentIndex < maxIndex && (
          <button
            onClick={handleNext}
            className="absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-5 w-10 h-10 rounded-full bg-white border border-[#E4E4E7] flex items-center justify-center cursor-pointer z-30 shadow-[0_4px_14px_rgba(0,0,0,0.12)] transition-all duration-200 hover:bg-[#121316] hover:border-[#121316] hover:scale-105 group"
            aria-label="Next"
          >
            <ChevronRight size={18} className="text-[#71717A] group-hover:text-white transition-colors" />
          </button>
        )}
      </div>
    </div>
  );
}
