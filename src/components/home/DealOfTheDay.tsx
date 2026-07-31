import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { productAPI } from '@/api/services/productAPI';
import { getImageUrl } from '@/utils/imageHelper';
import { getProductSlug, formatProductTitle } from '@/utils/slugHelper';
import ProductCarousel, { ItemCard } from '@/components/product/ProductCarousel';
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

const mapCardToItemCard = (item: CardItem): ItemCard => ({
  id: item.id,
  title: item.title,
  slug: item.slug,
  rating: item.rating,
  reviewsCount: item.reviewsCount,
  discountBadge: item.discountBadge,
  price: item.price,
  originalPrice: item.originalPrice,
  badgeText: item.discountBadge ? 'Special Offer' : undefined,
  badgeType: 'gold',
  img: item.img,
  actionText: 'Add To Cart'
});

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
      <section className="w-full py-12 bg-[#FAF8F5] border-t border-b border-[#EEEEEE]">
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

  const carouselItems: ItemCard[] = items.map(mapCardToItemCard);

  return (
    <section className="w-full py-8 lg:py-14 bg-[#FAF8F5] border-t border-b border-[#EEEEEE] animate-fade-in-up">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <ProductCarousel
          items={carouselItems}
          title="DEAL OF THE DAY"
          subtag="EXCLUSIVE OFFERS"
          viewAllLink="/shop"
        />
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
      <section className="w-full py-12 bg-white border-b border-[#EEEEEE]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          <div className="w-48 h-8 rounded animate-shimmer mb-8" />
          <ProductGridSkeleton count={4} />
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  const carouselItems: ItemCard[] = items.map(mapCardToItemCard);

  return (
    <section className="w-full py-8 lg:py-14 bg-white border-b border-[#EEEEEE] animate-fade-in-up">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <ProductCarousel
          items={carouselItems}
          title="POPULAR PRODUCTS"
          subtag="TRENDING SELECTIONS"
          viewAllLink="/shop"
        />
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

  const carouselItems: ItemCard[] = items.map(mapCardToItemCard);

  return (
    <section className="w-full py-8 lg:py-14 bg-[#FAF8F5] border-t border-[#EEEEEE] animate-fade-in-up">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <ProductCarousel
          items={carouselItems}
          title="EVERGREEN COLLECTION"
          subtag="TIMELESS FAVORITES"
          viewAllLink="/shop"
        />
      </div>
    </section>
  );
}
