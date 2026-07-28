import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getProductSlug } from '@/utils/slugHelper';

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
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rawPrice = item.price.replace(/[^\d.]/g, '');
    const numericPrice = parseFloat(rawPrice);
    const rawOrig = item.originalPrice ? item.originalPrice.replace(/[^\d.]/g, '') : '';
    const numericOrig = parseFloat(rawOrig);

    addToCart({
      id: item.id,
      title: item.title,
      price: isNaN(numericPrice) ? 499 : numericPrice,
      originalPrice: isNaN(numericOrig) ? undefined : numericOrig,
      img: item.img
    });
  };

  return (
    <div className="group bg-white border border-[#E5E7EB] rounded-lg overflow-hidden flex flex-col h-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] hover:border-[#D1D5DB] hover:-translate-y-1">
      <Link href={`/product/${getProductSlug(item)}`} className="flex flex-col h-full flex-1 no-underline">
        <div className="relative w-full aspect-[0.95] flex items-center justify-center p-4 bg-white">
          {item.badgeText && item.badgeType && (
            <span
              className={`absolute top-2 left-2 text-[0.62rem] font-bold px-2 py-0.5 rounded tracking-wider uppercase z-10 ${
                item.badgeType === 'green' ? 'bg-[#10B981] text-white' : 'bg-[#C5A059] text-white'
              }`}
            >
              {item.badgeText}
            </span>
          )}
          <img
            src={item.img}
            alt={item.title}
            className="max-w-[85%] max-h-[85%] object-contain transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-106"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/hero cards/4.png';
            }}
          />
        </div>

        <div className="p-3.5 flex flex-col justify-between flex-1 gap-2 border-t border-[#F3F4F6]">
          <div className="flex flex-col gap-1">
            <div className="min-h-[1.2rem]">
              {item.rating && (
                <div className="flex items-center gap-1.5 text-[0.72rem] text-[#71717A]">
                  <span className="font-bold text-[#EAB308]">★ {item.rating}</span>
                  <span className="text-[#D4D4D8]">|</span>
                  <span className="text-[#71717A]">{item.reviewsCount} Reviews</span>
                </div>
              )}
            </div>

            <h3 className="text-[0.88rem] font-bold text-[#18181B] leading-tight line-clamp-2 min-h-[2.3rem]">
              {item.title}
            </h3>

            <div className="min-h-[1.4rem]">
              {item.discountBadge && (
                <span className="inline-block bg-[#FEF2F2] text-[#EF4444] border border-[#FCA5A5] text-[0.62rem] font-extrabold px-1.5 py-0.5 rounded uppercase">
                  {item.discountBadge}
                </span>
              )}
            </div>

            <div className="min-h-[1.4rem]">
              {item.price && (
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-[0.98rem] font-extrabold text-[#18181B]">{item.price}</span>
                  {item.originalPrice && (
                    <span className="text-[0.78rem] text-[#A1A1AA] line-through font-normal">{item.originalPrice}</span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-2">
            <button
              onClick={handleAddToCart}
              className="w-full bg-[#18181B] text-white border-0 text-[0.75rem] font-bold py-2 px-3 rounded cursor-pointer transition-all duration-200 hover:bg-[#C5A059]"
            >
              {item.actionText}
            </button>
          </div>
        </div>
      </Link>
    </div>
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
    <div className="w-full relative my-8">
      {(title || subtag || viewAllLink) && (
        <div className="flex items-end justify-between mb-6">
          <div>
            {subtag && <span className="text-[0.72rem] font-bold tracking-[0.14em] text-[#C5A059] block mb-1 uppercase">{subtag}</span>}
            {title && <h2 className="text-[1.35rem] lg:text-[1.5rem] font-extrabold tracking-[0.04em] text-[#111111]">{title}</h2>}
          </div>
          {viewAllLink && (
            <Link href={viewAllLink} className="text-[0.82rem] font-bold text-[#111111] hover:text-[#C5A059] transition-colors no-underline">
              View All →
            </Link>
          )}
        </div>
      )}

      <div className="relative w-full">
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute top-1/2 -translate-y-1/2 -left-4 sm:left-1 w-[38px] h-[38px] rounded-full bg-white border border-[#E4E4E7] flex items-center justify-center cursor-pointer z-30 shadow-[0_4px_14px_rgba(0,0,0,0.12)] transition-all duration-200 hover:bg-[#121316] hover:border-[#121316] hover:scale-108 group"
            aria-label="Previous"
          >
            <ChevronLeft size={16} className="text-[#71717A] group-hover:text-white transition-colors" />
          </button>
        )}

        <div className="overflow-hidden w-full py-2">
          <div
            className="flex gap-4 lg:gap-[1.2rem] transition-transform duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="shrink-0 grow-0 w-[calc((100%-1rem)/2)] sm:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-3.6rem)/4)]"
              >
                <RenderProductCard item={item} />
              </div>
            ))}
          </div>
        </div>

        {items.length > itemsPerPage && currentIndex < maxIndex && (
          <button
            onClick={handleNext}
            className="absolute top-1/2 -translate-y-1/2 -right-4 sm:right-1 w-[38px] h-[38px] rounded-full bg-white border border-[#E4E4E7] flex items-center justify-center cursor-pointer z-30 shadow-[0_4px_14px_rgba(0,0,0,0.12)] transition-all duration-200 hover:bg-[#121316] hover:border-[#121316] hover:scale-108 group"
            aria-label="Next"
          >
            <ChevronRight size={16} className="text-[#71717A] group-hover:text-white transition-colors" />
          </button>
        )}
      </div>
    </div>
  );
}
