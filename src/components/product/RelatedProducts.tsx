import React, { useState, useEffect } from 'react';
import { IProduct } from '@/types/product';
import { productAPI } from '@/api/services/productAPI';
import ProductCard from './ProductCard';

interface RelatedProductsProps {
  productId: number;
}

export default function RelatedProducts({ productId }: RelatedProductsProps) {
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    productAPI.getRelatedProducts(productId, 4)
      .then(data => {
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          productAPI.getProducts({ count: '4' })
            .then(fallback => setProducts(fallback.slice(0, 4)))
            .catch(() => {});
        }
      })
      .catch(() => {
        productAPI.getProducts({ count: '4' })
          .then(fallback => setProducts(fallback.slice(0, 4)))
          .catch(() => {});
      });
  }, [productId]);

  if (products.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 border-t border-[#EAE5DC] mt-16">
      <div className="relative text-center mb-10 sm:mb-12">
        <h2 className="text-[1.6rem] sm:text-[1.8rem] font-extrabold text-[#121316] tracking-tight">Related Items</h2>
        <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-[50px] h-[3px] bg-[#C39F68] rounded-full" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
