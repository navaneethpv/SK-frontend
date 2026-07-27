import React from 'react';
import Link from 'next/link';
import { Star, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { IProduct } from '../Pages/Interfaces/product';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  id?: number;
  name?: string;
  img?: string;
  price?: number | string;
  originalPrice?: number | string;
  rating?: string | number;
  reviewsCount?: number;
  badgeText?: string;
  badgeType?: 'green' | 'gold' | 'none';
  product?: IProduct;
}

export default function ProductCard({
  id,
  name,
  img,
  price,
  originalPrice,
  rating = '4.8',
  reviewsCount = 42,
  badgeText,
  badgeType = 'none',
  product
}: ProductCardProps) {
  const { addToCart } = useCart();

  const cardId = id || (product ? product.id : 1);
  const cardTitle = name || (product ? product.alias || product.slug || 'SK Luxury Product' : 'SK Luxury Product');
  
  const displayPrice = price !== undefined 
    ? price 
    : (product ? (typeof product.selling_price === 'number' && product.selling_price > 0 ? product.selling_price : parseFloat(product.price) || 499) : 499);

  const displayOriginalPrice = originalPrice !== undefined
    ? originalPrice
    : (product && parseFloat(product.price) > Number(displayPrice) ? parseFloat(product.price) : undefined);

  let cardImg = img;
  if (!cardImg && product) {
    if (product.icon) cardImg = product.icon;
    else if (product.img && product.img.length > 0) cardImg = product.img[0].image;
    else cardImg = `/hero cards/${(product.id % 4) + 1}.png`;
  }
  if (!cardImg) cardImg = '/hero cards/1.png';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: Number(cardId),
      title: cardTitle,
      price: Number(displayPrice),
      originalPrice: displayOriginalPrice ? Number(displayOriginalPrice) : undefined,
      img: cardImg
    }, 1, true);
  };

  return (
    <div className="product-luxury-card">
      <Link href={`/product/${cardId}`} className="card-link-wrapper">
        <div className="card-image-box">
          {badgeText && badgeType !== 'none' && (
            <span className={`product-badge ${badgeType}`}>{badgeText}</span>
          )}
          <img
            src={cardImg}
            alt={cardTitle}
            className="card-product-img"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/hero cards/4.png';
            }}
          />
        </div>

        <div className="card-info-content">
          <div className="rating-pill">
            <Star size={12} className="star-icon-filled" />
            <span className="rating-num">{rating}</span>
            <span className="rating-sep">•</span>
            <CheckCircle2 size={12} className="verified-check" />
            <span className="reviews-cnt">({reviewsCount})</span>
          </div>

          <h3 className="card-title">{cardTitle}</h3>

          <div className="price-row">
            <span className="current-price">₹{displayPrice}</span>
            {displayOriginalPrice && (
              <span className="strikethrough-price">₹{displayOriginalPrice}</span>
            )}
          </div>
        </div>
      </Link>

      <div className="card-action-bar">
        <button onClick={handleAddToCart} className="add-cart-btn">
          <ShoppingBag size={15} />
          <span>ADD TO CART</span>
        </button>
      </div>

      <style jsx>{`
        .product-luxury-card {
          background-color: #ffffff;
          border: 1px solid #EAEAEA;
          border-radius: 10px;
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .product-luxury-card:hover {
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.07);
          transform: translateY(-4px);
          border-color: #D4D4D4;
        }

        .card-link-wrapper {
          display: flex;
          flex-direction: column;
          height: 100%;
          text-decoration: none;
        }

        .card-image-box {
          position: relative;
          width: 100%;
          aspect-ratio: 0.95;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          background-color: #F9F9F8;
          overflow: hidden;
        }

        .card-product-img {
          max-width: 88%;
          max-height: 88%;
          object-fit: contain;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .product-luxury-card:hover .card-product-img {
          transform: scale(1.06);
        }

        .product-badge {
          position: absolute;
          top: 0.8rem;
          left: 0.8rem;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          z-index: 2;
        }

        .product-badge.green {
          background-color: #10B981;
          color: #ffffff;
        }

        .product-badge.gold {
          background-color: #C5A059;
          color: #ffffff;
        }

        .card-info-content {
          padding: 1.1rem 1.1rem 0.5rem 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          flex: 1;
        }

        .rating-pill {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          color: #666666;
        }

        :global(.star-icon-filled) {
          color: #C5A059;
          fill: #C5A059;
        }

        .rating-num {
          font-weight: 700;
          color: #111111;
        }

        .rating-sep {
          color: #CCCCCC;
        }

        :global(.verified-check) {
          color: #0284C7;
        }

        .reviews-cnt {
          color: #888888;
        }

        .card-title {
          font-size: 0.92rem;
          font-weight: 600;
          color: #111111;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.5rem;
        }

        .price-row {
          display: flex;
          align-items: baseline;
          gap: 0.6rem;
          margin-top: 0.2rem;
        }

        .current-price {
          font-size: 1.05rem;
          font-weight: 800;
          color: #111111;
        }

        .strikethrough-price {
          font-size: 0.82rem;
          color: #999999;
          text-decoration: line-through;
        }

        .card-action-bar {
          padding: 0.8rem 1.1rem 1.1rem 1.1rem;
        }

        .add-cart-btn {
          width: 100%;
          height: 42px;
          background-color: #111111;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.15s ease;
        }

        .add-cart-btn:hover {
          background-color: #2D2D2D;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
