import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { productAPI } from '@/api/services/productAPI';
import { getImageUrl } from '@/utils/imageHelper';
import { getProductSlug, formatProductTitle } from '@/utils/slugHelper';
import ProductCard from '@/components/product/ProductCard';
import { ProductGridSkeleton } from '@/components/common/Skeletons';

interface CardItem {
  id: number;
  title: string;
  slug: string;
  rating: string;
  reviewsCount: number;
  discountBadge?: string;
  price: string;
  originalPrice?: string;
  numericPrice: number;
  numericOrigPrice?: number;
  img: string;
}

const mapProduct = (item: any, idx: number): CardItem => {
  const rawPrice = typeof item.selling_price === 'number' && item.selling_price > 0 ? item.selling_price : (parseFloat(item.price) || 499);
  const rawOrig = parseFloat(item.price) > rawPrice ? parseFloat(item.price) : undefined;
  const rawImg = item.icon || (item.img && item.img.length > 0 ? item.img[0].image : null);
  const validImg = rawImg ? getImageUrl(rawImg, `/hero cards/${(idx % 4) + 1}.png`) : `/hero cards/${(idx % 4) + 1}.png`;

  return {
    id: item.id || idx + 1,
    title: formatProductTitle(item.alias || item.slug || 'SK Premium Selection'),
    slug: getProductSlug(item),
    rating: (item.rating || 4.8).toString(),
    reviewsCount: item.review_count || 45,
    discountBadge: rawOrig ? 'SPECIAL OFFER' : undefined,
    price: `₹${rawPrice}`,
    originalPrice: rawOrig ? `₹${rawOrig}` : undefined,
    numericPrice: rawPrice,
    numericOrigPrice: rawOrig,
    img: validImg
  };
};

export default function DealOfTheDay() {
  const [items, setItems] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    productAPI.getDealOfTheDayHome()
      .then((data: any) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data.map(mapProduct));
        } else {
          setItems([]);
        }
      })
      .catch((err: any) => {
        console.warn('Deal of the day API warning:', err);
        setItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="w-full py-16 bg-[#FAF8F5] border-t border-b border-[#EEEEEE]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="w-48 h-8 rounded animate-shimmer" />
          </div>
          <ProductGridSkeleton count={4} />
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="w-full py-12 lg:py-20 bg-[#FAF8F5] border-t border-b border-[#EEEEEE] animate-fade-in-up">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="flex items-end justify-between mb-8">
          <div className="flex flex-col gap-1">
            <span className="text-[0.72rem] font-bold tracking-[0.15em] text-[#C39F68] uppercase">EXCLUSIVE OFFERS</span>
            <h2 className="text-[1.5rem] lg:text-[2rem] font-bold tracking-tight text-[#121316]">DEAL OF THE DAY</h2>
          </div>
          <Link href="/shop" className="flex items-center gap-2 text-[0.85rem] font-bold text-[#121316] no-underline hover:text-[#C39F68] transition-colors">
            <span>Explore All Deals</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.slice(0, 4).map((item) => (
            <ProductCard
              key={item.id}
              id={item.id}
              name={item.title}
              img={item.img}
              price={item.numericPrice}
              originalPrice={item.numericOrigPrice}
              rating={item.rating}
              reviewsCount={item.reviewsCount}
              badgeText={item.discountBadge}
              badgeType={item.discountBadge ? 'gold' : 'none'}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function PopularProductsHome() {
  const [items, setItems] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    productAPI.getPopularProductsHome()
      .then((data: any) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data.map(mapProduct));
        }
      })
      .catch((err: any) => console.warn('Popular products API warning:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="w-full py-16 bg-white border-b border-[#EEEEEE]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          <div className="w-48 h-8 rounded animate-shimmer mb-8" />
          <ProductGridSkeleton count={4} />
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="w-full py-16 bg-white border-b border-[#EEEEEE] animate-fade-in-up">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="flex items-end justify-between mb-8">
          <div className="flex flex-col gap-1">
            <span className="text-[0.72rem] font-bold tracking-[0.15em] text-[#C39F68] uppercase">TRENDING SELECTIONS</span>
            <h2 className="text-[1.5rem] lg:text-[2rem] font-bold tracking-tight text-[#121316]">POPULAR PRODUCTS</h2>
          </div>
          <Link href="/shop" className="flex items-center gap-2 text-[0.85rem] font-bold text-[#121316] no-underline hover:text-[#C39F68] transition-colors">
            <span>Explore All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.slice(0, 4).map((item) => (
            <ProductCard
              key={item.id}
              id={item.id}
              name={item.title}
              img={item.img}
              price={item.numericPrice}
              originalPrice={item.numericOrigPrice}
              rating={item.rating}
              reviewsCount={item.reviewsCount}
              badgeText={item.discountBadge}
              badgeType={item.discountBadge ? 'gold' : 'none'}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function Evergreen() {
  const [items, setItems] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    productAPI.getEvergreen()
      .then((data: any) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data.map(mapProduct));
        }
      })
      .catch((err: any) => console.warn('Evergreen API warning:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (items.length === 0) return null;

  return (
    <section className="w-full py-16 bg-[#FAF8F5] border-t border-[#EEEEEE] animate-fade-in-up">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="flex items-end justify-between mb-8">
          <div className="flex flex-col gap-1">
            <span className="text-[0.72rem] font-bold tracking-[0.15em] text-[#C39F68] uppercase">TIMELESS FAVORITES</span>
            <h2 className="text-[1.5rem] lg:text-[2rem] font-bold tracking-tight text-[#121316]">EVERGREEN COLLECTION</h2>
          </div>
          <Link href="/shop" className="flex items-center gap-2 text-[0.85rem] font-bold text-[#121316] no-underline hover:text-[#C39F68] transition-colors">
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.slice(0, 4).map((item) => (
            <ProductCard
              key={item.id}
              id={item.id}
              name={item.title}
              img={item.img}
              price={item.numericPrice}
              originalPrice={item.numericOrigPrice}
              rating={item.rating}
              reviewsCount={item.reviewsCount}
              badgeText={item.discountBadge}
              badgeType={item.discountBadge ? 'gold' : 'none'}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
