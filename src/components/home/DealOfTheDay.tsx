import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Star, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { productAPI } from '@/api/services/productAPI';
import { getImageUrl } from '@/utils/imageHelper';
import { getProductSlug } from '@/utils/slugHelper';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/product/ProductCard';

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
    title: item.alias || item.slug || 'SK Premium Product',
    slug: getProductSlug(item),
    rating: (item.rating || 4.8).toString(),
    reviewsCount: item.review_count || 42,
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
  const { addToCart } = useCart();

  useEffect(() => {
    productAPI.getDealOfTheDayHome()
      .then((data: any) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data.map(mapProduct));
        } else {
          productAPI.getProducts({ count: '4' })
            .then((fallback: any) => {
              if (Array.isArray(fallback)) setItems(fallback.slice(0, 4).map(mapProduct));
            })
            .catch(() => {});
        }
      })
      .catch((err: any) => {
        console.warn('Deal of the day API warning:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="w-full py-16 bg-[#FAFAFA] border-t border-b border-[#EEEEEE]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-[1.2rem] font-extrabold tracking-[0.1em] text-[#111111]">DEAL OF THE DAY</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-[360px] bg-[#EAEAEA] rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="w-full py-12 lg:py-[4.5rem] bg-[#FAFAFA] border-t border-b border-[#EEEEEE]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="flex items-end justify-between mb-8">
          <div className="flex flex-col gap-[0.3rem]">
            <span className="text-[0.72rem] font-bold tracking-[0.14em] text-[#C5A059]">EXCLUSIVE OFFERS</span>
            <h2 className="text-[1.25rem] lg:text-[1.5rem] font-extrabold tracking-[0.04em] text-[#111111]">DEAL OF THE DAY</h2>
          </div>
          <Link href="/shop" className="flex items-center gap-[0.4rem] text-[0.82rem] font-bold text-[#111111] no-underline hover:text-[#C5A059] transition-colors">
            <span>Explore All Deals</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.slice(0, 4).map((item) => (
            <div key={item.id} className="group bg-white border border-[#EAEAEA] rounded-[10px] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.07)] hover:-translate-y-1 hover:border-[#D4D4D4]">
              <Link href={`/product/${item.slug}`} className="flex flex-col h-full no-underline">
                <div className="relative w-full aspect-[0.95] p-6 bg-[#F9F9F8] flex items-center justify-center overflow-hidden">
                  {item.discountBadge && (
                    <span className="absolute top-[0.8rem] left-[0.8rem] text-[0.65rem] font-bold px-[0.6rem] py-[0.25rem] rounded bg-[#C5A059] text-white tracking-[0.06em] uppercase z-10">
                      {item.discountBadge}
                    </span>
                  )}
                  <img
                    src={item.img}
                    alt={item.title}
                    className="max-w-[88%] max-h-[88%] object-contain transition-transform duration-500 group-hover:scale-106"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/hero cards/4.png';
                    }}
                  />
                </div>

                <div className="p-[1.1rem] flex flex-col gap-[0.45rem] flex-1">
                  <div className="flex items-center gap-[0.3rem] text-[0.75rem]">
                    <Star size={12} className="text-[#C5A059] fill-[#C5A059]" />
                    <span className="font-bold text-[#111111]">{item.rating}</span>
                    <span className="text-[#CCCCCC]">•</span>
                    <CheckCircle2 size={12} className="text-[#0284C7]" />
                    <span className="text-[#888888]">({item.reviewsCount})</span>
                  </div>

                  <h3 className="text-[0.92rem] font-semibold text-[#111111] leading-[1.35] line-clamp-2">{item.title}</h3>

                  <div className="flex items-baseline gap-[0.6rem] mt-[0.2rem]">
                    <span className="text-[1.05rem] font-extrabold text-[#111111]">{item.price}</span>
                    {item.originalPrice && (
                      <span className="text-[0.82rem] text-[#999999] line-through">{item.originalPrice}</span>
                    )}
                  </div>
                </div>
              </Link>

              <div className="p-[0.8rem] pt-0 pb-[1.1rem] px-[1.1rem]">
                <button
                  onClick={() =>
                    addToCart({
                      id: item.id,
                      title: item.title,
                      price: item.numericPrice,
                      originalPrice: item.numericOrigPrice,
                      img: item.img
                    }, 1, true)
                  }
                  className="w-full h-[42px] bg-[#111111] text-white border-none rounded-md text-[0.78rem] font-bold tracking-[0.08em] flex items-center justify-center gap-2 cursor-pointer transition-colors hover:bg-[#2D2D2D]"
                >
                  <ShoppingBag size={14} />
                  <span>ADD TO CART</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PopularProductsHome() {
  const [items, setItems] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

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

  if (loading || items.length === 0) return null;

  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="flex items-end justify-between mb-8">
          <div className="flex flex-col gap-[0.3rem]">
            <span className="text-[0.72rem] font-bold tracking-[0.14em] text-[#C5A059]">TRENDING SELECTIONS</span>
            <h2 className="text-[1.25rem] lg:text-[1.5rem] font-extrabold tracking-[0.04em] text-[#111111]">POPULAR PRODUCTS</h2>
          </div>
          <Link href="/shop" className="flex items-center gap-[0.4rem] text-[0.82rem] font-bold text-[#111111] no-underline hover:text-[#C5A059] transition-colors">
            <span>Explore All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.slice(0, 4).map((item) => (
            <div key={item.id} className="group bg-white border border-[#EAEAEA] rounded-[10px] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.07)] hover:-translate-y-1 hover:border-[#D4D4D4]">
              <Link href={`/product/${item.slug}`} className="flex flex-col h-full no-underline">
                <div className="relative w-full aspect-[0.95] p-6 bg-[#F9F9F8] flex items-center justify-center overflow-hidden">
                  {item.discountBadge && (
                    <span className="absolute top-[0.8rem] left-[0.8rem] text-[0.65rem] font-bold px-[0.6rem] py-[0.25rem] rounded bg-[#C5A059] text-white tracking-[0.06em] uppercase z-10">
                      {item.discountBadge}
                    </span>
                  )}
                  <img
                    src={item.img}
                    alt={item.title}
                    className="max-w-[88%] max-h-[88%] object-contain transition-transform duration-500 group-hover:scale-106"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/hero cards/4.png';
                    }}
                  />
                </div>

                <div className="p-[1.1rem] flex flex-col gap-[0.45rem] flex-1">
                  <div className="flex items-center gap-[0.3rem] text-[0.75rem]">
                    <Star size={12} className="text-[#C5A059] fill-[#C5A059]" />
                    <span className="font-bold text-[#111111]">{item.rating}</span>
                    <span className="text-[#CCCCCC]">•</span>
                    <CheckCircle2 size={12} className="text-[#0284C7]" />
                    <span className="text-[#888888]">({item.reviewsCount})</span>
                  </div>

                  <h3 className="text-[0.92rem] font-semibold text-[#111111] leading-[1.35] line-clamp-2">{item.title}</h3>

                  <div className="flex items-baseline gap-[0.6rem] mt-[0.2rem]">
                    <span className="text-[1.05rem] font-extrabold text-[#111111]">{item.price}</span>
                    {item.originalPrice && (
                      <span className="text-[0.82rem] text-[#999999] line-through">{item.originalPrice}</span>
                    )}
                  </div>
                </div>
              </Link>

              <div className="p-[0.8rem] pt-0 pb-[1.1rem] px-[1.1rem]">
                <button
                  onClick={() =>
                    addToCart({
                      id: item.id,
                      title: item.title,
                      price: item.numericPrice,
                      originalPrice: item.numericOrigPrice,
                      img: item.img
                    }, 1, true)
                  }
                  className="w-full h-[42px] bg-[#111111] text-white border-none rounded-md text-[0.78rem] font-bold tracking-[0.08em] flex items-center justify-center gap-2 cursor-pointer transition-colors hover:bg-[#2D2D2D]"
                >
                  <ShoppingBag size={14} />
                  <span>ADD TO CART</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Evergreen() {
  const [items, setItems] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

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

  if (loading || items.length === 0) return null;

  return (
    <section className="w-full py-16 bg-[#FAFAFA] border-t border-[#EEEEEE]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="flex items-end justify-between mb-8">
          <div className="flex flex-col gap-[0.3rem]">
            <span className="text-[0.72rem] font-bold tracking-[0.14em] text-[#C5A059]">TIMELESS FAVORITES</span>
            <h2 className="text-[1.25rem] lg:text-[1.5rem] font-extrabold tracking-[0.04em] text-[#111111]">EVERGREEN COLLECTION</h2>
          </div>
          <Link href="/shop" className="flex items-center gap-[0.4rem] text-[0.82rem] font-bold text-[#111111] no-underline hover:text-[#C5A059] transition-colors">
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.slice(0, 4).map((item) => (
            <div key={item.id} className="group bg-white border border-[#EAEAEA] rounded-[10px] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.07)] hover:-translate-y-1 hover:border-[#D4D4D4]">
              <Link href={`/product/${item.slug}`} className="flex flex-col h-full no-underline">
                <div className="relative w-full aspect-[0.95] p-6 bg-[#F9F9F8] flex items-center justify-center overflow-hidden">
                  {item.discountBadge && (
                    <span className="absolute top-[0.8rem] left-[0.8rem] text-[0.65rem] font-bold px-[0.6rem] py-[0.25rem] rounded bg-[#C5A059] text-white tracking-[0.06em] uppercase z-10">
                      {item.discountBadge}
                    </span>
                  )}
                  <img
                    src={item.img}
                    alt={item.title}
                    className="max-w-[88%] max-h-[88%] object-contain transition-transform duration-500 group-hover:scale-106"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/hero cards/4.png';
                    }}
                  />
                </div>

                <div className="p-[1.1rem] flex flex-col gap-[0.45rem] flex-1">
                  <div className="flex items-center gap-[0.3rem] text-[0.75rem]">
                    <Star size={12} className="text-[#C5A059] fill-[#C5A059]" />
                    <span className="font-bold text-[#111111]">{item.rating}</span>
                    <span className="text-[#CCCCCC]">•</span>
                    <CheckCircle2 size={12} className="text-[#0284C7]" />
                    <span className="text-[#888888]">({item.reviewsCount})</span>
                  </div>

                  <h3 className="text-[0.92rem] font-semibold text-[#111111] leading-[1.35] line-clamp-2">{item.title}</h3>

                  <div className="flex items-baseline gap-[0.6rem] mt-[0.2rem]">
                    <span className="text-[1.05rem] font-extrabold text-[#111111]">{item.price}</span>
                    {item.originalPrice && (
                      <span className="text-[0.82rem] text-[#999999] line-through">{item.originalPrice}</span>
                    )}
                  </div>
                </div>
              </Link>

              <div className="p-[0.8rem] pt-0 pb-[1.1rem] px-[1.1rem]">
                <button
                  onClick={() =>
                    addToCart({
                      id: item.id,
                      title: item.title,
                      price: item.numericPrice,
                      originalPrice: item.numericOrigPrice,
                      img: item.img
                    }, 1, true)
                  }
                  className="w-full h-[42px] bg-[#111111] text-white border-none rounded-md text-[0.78rem] font-bold tracking-[0.08em] flex items-center justify-center gap-2 cursor-pointer transition-colors hover:bg-[#2D2D2D]"
                >
                  <ShoppingBag size={14} />
                  <span>ADD TO CART</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
