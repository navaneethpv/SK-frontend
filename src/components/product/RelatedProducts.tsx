import React, { useState, useEffect } from 'react';
import { IProduct } from '@/types/product';
import { productAPI } from '@/api/services/productAPI';
import ProductCarousel, { ItemCard } from './ProductCarousel';
import { getImageUrl } from '@/utils/imageHelper';
import { getProductSlug, formatProductTitle } from '@/utils/slugHelper';

interface RelatedProductsProps {
  productId: number;
}

function mapProductToItemCard(prod: IProduct, idx: number): ItemCard {
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
    title: formatProductTitle(prod.alias || prod.slug || 'SK Related Item'),
    slug: getProductSlug(prod),
    rating: prod.rating ? prod.rating.toFixed(1) : '4.8',
    reviewsCount: prod.review_count || 45,
    discountBadge: discountBadge || undefined,
    price: `₹${numericPrice}`,
    originalPrice: originalPriceNum > numericPrice ? `₹${originalPriceNum}` : undefined,
    badgeText: prod.is_active ? 'Best Seller' : undefined,
    badgeType: 'gold',
    img: getImageUrl(rawImg, `/hero cards/${(idx % 4) + 1}.png`),
    actionText: 'Add To Cart'
  };
}

export default function RelatedProducts({ productId }: RelatedProductsProps) {
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    productAPI.getRelatedProducts(productId, 8)
      .then(data => {
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          productAPI.getProducts({ count: '8' })
            .then(fallback => setProducts(fallback.slice(0, 8)))
            .catch(() => {});
        }
      })
      .catch(() => {
        productAPI.getProducts({ count: '8' })
          .then(fallback => setProducts(fallback.slice(0, 8)))
          .catch(() => {});
      });
  }, [productId]);

  if (products.length === 0) return null;

  const carouselItems: ItemCard[] = products.map((p, idx) => mapProductToItemCard(p, idx));

  return (
    <section className="py-6 sm:py-10 border-t border-[#EAE5DC] mt-8">
      <ProductCarousel
        items={carouselItems}
        title="RELATED PRODUCTS"
        subtag="RECOMMENDED FOR YOU"
        viewAllLink="/shop"
      />
    </section>
  );
}
