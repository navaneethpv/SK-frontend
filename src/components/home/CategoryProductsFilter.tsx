import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import ProductCarousel, { ItemCard } from '@/components/product/ProductCarousel';
import { productAPI } from '@/api/services/productAPI';
import { IProduct } from '@/types/product';
import { getImageUrl } from '@/utils/imageHelper';
import { getProductSlug } from '@/utils/slugHelper';

function mapProductToCard(prod: IProduct, fallbackImg: string = '/hero cards/4.png'): ItemCard {
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

  const rawImg = prod.icon || (Array.isArray(prod.img) && prod.img[0]?.image) || (typeof prod.img === 'string' ? (prod.img as string) : undefined);

  return {
    id: prod.id,
    title: prod.alias || prod.slug || 'SK Product',
    slug: getProductSlug(prod),
    rating: prod.rating ? prod.rating.toFixed(1) : '4.8',
    reviewsCount: prod.review_count || 45,
    discountBadge: discountBadge || undefined,
    price: `₹${numericPrice}`,
    originalPrice: originalPriceNum > numericPrice ? `₹${originalPriceNum}` : undefined,
    badgeText: prod.is_active ? 'Best Seller' : undefined,
    badgeType: 'gold',
    img: getImageUrl(rawImg, fallbackImg),
    actionText: 'Add To Cart'
  };
}

export default function CategoryProductsFilter() {
  const [products, setProducts] = useState<ItemCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchProducts = async () => {
      try {
        const prods = await productAPI.getProducts();

        if (isMounted) {
          if (Array.isArray(prods) && prods.length > 0) {
            const mapped = prods.map((p, idx) => mapProductToCard(p, `/hero cards/${(idx % 6) + 1}.png`));
            setProducts(mapped);
          } else {
            setProducts([]);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch products:', err);
        if (isMounted) setProducts([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="w-full py-8 md:py-12 bg-[#FAF8F5]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between mb-5 md:mb-7">
          <div>
            <h2 className="text-[1.1rem] sm:text-[1.3rem] md:text-[1.5rem] font-bold text-[#121316] tracking-tight">
              Latest Products
            </h2>
            <p className="text-[0.75rem] sm:text-[0.82rem] text-[#6B7280] mt-0.5">
              Explore our curated collection of premium essentials
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-[0.78rem] sm:text-[0.85rem] font-bold text-[#C39F68] hover:text-[#121316] transition-colors group shrink-0"
          >
            <span>View All Products</span>
            <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Products Grid / Carousel */}
        <div className="min-h-[220px]">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 min-h-[220px] py-2">
              <div className="w-full h-[280px] rounded-lg bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
              <div className="w-full h-[280px] rounded-lg bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
              <div className="w-full h-[280px] rounded-lg bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
              <div className="w-full h-[280px] rounded-lg bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
            </div>
          ) : products.length > 0 ? (
            <ProductCarousel items={products} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-[0.9rem] mb-3">No products found.</p>
              <Link
                href="/shop"
                className="inline-block px-5 py-2 text-xs font-bold text-white bg-[#121316] rounded-full hover:bg-[#C39F68] transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
