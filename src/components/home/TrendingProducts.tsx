import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import ProductCard from '@/components/product/ProductCard';
import { productAPI } from '@/api/services/productAPI';
import { IProduct } from '@/types/product';
import { getImageUrl } from '@/utils/imageHelper';
import { getProductSlug, formatProductTitle } from '@/utils/slugHelper';
import { ProductGridSkeleton } from '@/components/common/Skeletons';

interface TrendingItem {
  id: number;
  title: string;
  slug: string;
  price: number;
  originalPrice?: number;
  rating: string;
  reviewsCount: number;
  badgeText?: string;
  badgeType?: 'green' | 'gold';
  img: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

function mapToTrendingItem(prod: IProduct, idx: number): TrendingItem {
  const numericPrice = typeof prod.selling_price === 'number' && prod.selling_price > 0
    ? prod.selling_price
    : parseFloat(prod.price) || 499;
  const originalPriceNum = parseFloat(prod.price) || 0;
  const discountVal = parseFloat(prod.discount) || 0;

  let discountBadge = '';
  if (discountVal > 0 && originalPriceNum > 0) {
    const percent = Math.round((discountVal / originalPriceNum) * 100);
    if (percent > 0) discountBadge = `${percent}% OFF`;
  }

  const rawImg = prod.icon || (prod.img && prod.img[0]?.image);

  return {
    id: prod.id,
    title: formatProductTitle(prod.alias || prod.slug || 'SK Product'),
    slug: getProductSlug(prod),
    price: numericPrice,
    originalPrice: originalPriceNum > numericPrice ? originalPriceNum : undefined,
    rating: prod.rating ? prod.rating.toFixed(1) : '4.9',
    reviewsCount: prod.review_count || 58,
    badgeText: discountBadge || 'TRENDING',
    badgeType: discountBadge ? 'green' : 'gold',
    img: getImageUrl(rawImg, `/hero cards/${(idx % 6) + 1}.png`)
  };
}

export default function TrendingProducts() {
  const [products, setProducts] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    productAPI.getTrendingProducts()
      .then((data: IProduct[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((prod, idx) => mapToTrendingItem(prod, idx));
          setProducts(mapped);
        } else {
          // Fallback to general products if trending-products is empty
          return productAPI.getProducts().then((all) => {
            if (Array.isArray(all) && all.length > 0) {
              const mapped = all.slice(0, 4).map((prod, idx) => mapToTrendingItem(prod, idx));
              setProducts(mapped);
            }
          });
        }
      })
      .catch((err) => {
        console.warn('Failed to load trending products:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className="w-full py-12 lg:py-18 bg-[#FAF8F5] border-t border-b border-[#F0EDE8]"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div variants={cardVariants} className="flex flex-col md:flex-row md:items-end justify-between mb-8 lg:mb-10 gap-4">
          <div>
            <span className="text-[0.72rem] font-extrabold tracking-[0.15em] text-[#C39F68] block mb-1 uppercase">
              MOST LOVED COLLECTION
            </span>
            <h2 className="text-[1.5rem] sm:text-[1.8rem] lg:text-[2.2rem] font-bold text-[#121316] tracking-tight">
              Trending Products
            </h2>
            <p className="text-[0.88rem] sm:text-[0.95rem] text-[#6B7280] mt-1">
              Explore this week&apos;s most sought-after luxury grooming, fragrances, and accessories.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[0.85rem] font-bold text-[#121316] hover:text-[#C39F68] transition-colors no-underline self-start md:self-auto"
          >
            <span>Explore All</span>
            <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* Product Cards Grid */}
        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <motion.div key={product.id} variants={cardVariants}>
                <ProductCard
                  id={product.id}
                  name={product.title}
                  img={product.img}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  rating={product.rating}
                  reviewsCount={product.reviewsCount}
                  badgeText={product.badgeText}
                  badgeType={product.badgeType}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
