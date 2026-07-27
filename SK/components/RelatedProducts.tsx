import React, { useState, useEffect } from 'react';
import { IProduct } from '../Pages/Interfaces/product';
import { productAPI } from '../Api/Services/productAPI';
import ProductCard from './ProductCard';

interface RelatedProductsProps {
  productId: number;
}

export default function RelatedProducts({ productId }: RelatedProductsProps) {
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    productAPI.getSimilarProducts(productId)
      .then(data => {
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          // Fetch general products as fallback mock
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
    <section className="related-section">
      <h2 className="section-title">You May Also Like</h2>
      
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <style jsx>{`
        .related-section {
          padding: 5rem 0 2rem 0;
          border-top: 1px solid hsl(var(--border));
          margin-top: 4rem;
        }

        .section-title {
          font-size: 1.8rem;
          font-weight: 800;
          margin-bottom: 3rem;
          text-align: center;
          position: relative;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: -0.6rem;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 3px;
          background-color: hsl(var(--primary));
          border-radius: 99px;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 2rem;
        }

        @media (max-width: 600px) {
          .products-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
}
