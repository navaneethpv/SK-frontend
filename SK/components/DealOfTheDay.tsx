import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Star, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { productAPI } from '../Api/Services/productAPI';
import { IProduct } from '../Pages/Interfaces/product';
import { getImageUrl } from '../utils/imageHelper';
import { getProductSlug } from '../utils/slugHelper';
import { useCart } from '../context/CartContext';

interface CardItem {
  id: number;
  title: string;
  slug: string;
  rating?: string;
  reviewsCount?: number;
  discountBadge?: string;
  price: string;
  numericPrice: number;
  originalPrice?: string;
  numericOrigPrice?: number;
  badgeText?: string;
  badgeType?: 'green' | 'gold';
  img: string;
}

function mapProduct(prod: IProduct): CardItem {
  const sellingPrice = typeof prod.selling_price === 'number' && prod.selling_price > 0
    ? prod.selling_price
    : parseFloat(prod.price) || 499;
  const origPrice = parseFloat(prod.price) || 0;
  const discountVal = parseFloat(prod.discount) || 0;

  let discountBadge = '';
  if (discountVal > 0 && origPrice > 0) {
    const percent = Math.round((discountVal / origPrice) * 100);
    if (percent > 0) discountBadge = `${percent}% OFF`;
  }

  const rawImg = prod.icon || (prod.img && prod.img[0]?.image);

  return {
    id: prod.id,
    title: prod.alias || prod.slug || 'SK Premium Deal',
    slug: getProductSlug(prod),
    rating: prod.rating ? prod.rating.toFixed(1) : '4.8',
    reviewsCount: prod.review_count || 45,
    discountBadge: discountBadge || 'SPECIAL DEAL',
    price: `₹${sellingPrice}`,
    numericPrice: sellingPrice,
    originalPrice: origPrice > sellingPrice ? `₹${origPrice}` : undefined,
    numericOrigPrice: origPrice > sellingPrice ? origPrice : undefined,
    badgeText: 'Limited Offer',
    badgeType: 'gold',
    img: getImageUrl(rawImg, '/hero cards/4.png'),
  };
}

export default function DealOfTheDay() {
  const [items, setItems] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    productAPI.getDealOfTheDayHome()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data.map(mapProduct));
        } else {
          setItems([]);
        }
      })
      .catch((err) => {
        console.warn('Deal of the Day API warning:', err);
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="dotd-section">
        <div className="dotd-container">
          <div className="dotd-header">
            <h2 className="dotd-title">DEAL OF THE DAY</h2>
          </div>
          <div className="dotd-grid-skeleton">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="skeleton-card"></div>
            ))}
          </div>
        </div>
        <style jsx>{`
          .dotd-section { width: 100%; padding: 4rem 0; background-color: #FAFAFA; }
          .dotd-container { max-width: 1440px; margin: 0 auto; padding: 0 2rem; }
          .dotd-title { font-size: 1.2rem; font-weight: 800; letter-spacing: 0.1em; color: #111111; }
          .dotd-grid-skeleton { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-top: 1.5rem; }
          .skeleton-card { height: 360px; background-color: #EAEAEA; border-radius: 8px; animation: pulse 1.5s infinite; }
          @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
        `}</style>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="dotd-section">
      <div className="dotd-container">
        <div className="dotd-header">
          <div className="title-group">
            <span className="section-subtag">EXCLUSIVE OFFERS</span>
            <h2 className="dotd-title">DEAL OF THE DAY</h2>
          </div>
          <Link href="/shop" className="dotd-view-all">
            <span>Explore All Deals</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="dotd-grid">
          {items.slice(0, 4).map((item) => (
            <div key={item.id} className="dotd-card">
              <Link href={`/product/${item.slug}`} className="card-link">
                <div className="card-img-box">
                  {item.discountBadge && (
                    <span className="badge-tag gold">{item.discountBadge}</span>
                  )}
                  <img
                    src={item.img}
                    alt={item.title}
                    className="product-img"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/hero cards/4.png';
                    }}
                  />
                </div>

                <div className="card-details">
                  <div className="rating-row">
                    <Star size={12} className="star-filled" />
                    <span className="rating-num">{item.rating}</span>
                    <span className="rating-sep">•</span>
                    <CheckCircle2 size={12} className="verified-check" />
                    <span className="reviews">({item.reviewsCount})</span>
                  </div>

                  <h3 className="card-product-title">{item.title}</h3>

                  <div className="price-group">
                    <span className="current-price">{item.price}</span>
                    {item.originalPrice && (
                      <span className="original-price">{item.originalPrice}</span>
                    )}
                  </div>
                </div>
              </Link>

              <div className="btn-wrapper">
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
                  className="add-to-cart-btn"
                >
                  <ShoppingBag size={14} />
                  <span>ADD TO CART</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .dotd-section {
          width: 100%;
          padding: 4.5rem 0;
          background-color: #FAFAFA;
          border-top: 1px solid #EEEEEE;
          border-bottom: 1px solid #EEEEEE;
        }

        .dotd-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .dotd-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 2rem;
        }

        .title-group {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .section-subtag {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: #C5A059;
        }

        .dotd-title {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: #111111;
        }

        .dotd-view-all {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: #111111;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .dotd-view-all:hover {
          color: #C5A059;
        }

        .dotd-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .dotd-card {
          background-color: #ffffff;
          border: 1px solid #EAEAEA;
          border-radius: 10px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dotd-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.07);
          border-color: #D4D4D4;
        }

        .card-link {
          display: flex;
          flex-direction: column;
          height: 100%;
          text-decoration: none;
        }

        .card-img-box {
          position: relative;
          width: 100%;
          aspect-ratio: 0.95;
          padding: 1.5rem;
          background-color: #F9F9F8;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .badge-tag {
          position: absolute;
          top: 0.8rem;
          left: 0.8rem;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .badge-tag.gold {
          background-color: #C5A059;
          color: #ffffff;
        }

        .product-img {
          max-width: 88%;
          max-height: 88%;
          object-fit: contain;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dotd-card:hover .product-img {
          transform: scale(1.06);
        }

        .card-details {
          padding: 1.1rem 1.1rem 0.5rem 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          flex: 1;
        }

        .rating-row {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
        }

        :global(.star-filled) {
          color: #C5A059;
          fill: #C5A059;
        }

        .rating-num {
          font-weight: 700;
          color: #111111;
        }

        .rating-sep { color: #CCCCCC; }

        :global(.verified-check) {
          color: #0284C7;
        }

        .reviews { color: #888888; }

        .card-product-title {
          font-size: 0.92rem;
          font-weight: 600;
          color: #111111;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .price-group {
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

        .original-price {
          font-size: 0.82rem;
          color: #999999;
          text-decoration: line-through;
        }

        .btn-wrapper {
          padding: 0.8rem 1.1rem 1.1rem 1.1rem;
        }

        .add-to-cart-btn {
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

        .add-to-cart-btn:hover {
          background-color: #2D2D2D;
          transform: translateY(-1px);
        }

        @media (max-width: 1024px) {
          .dotd-section { padding: 2.2rem 0; }
          .dotd-header { margin-bottom: 1.2rem; }
          .dotd-title { font-size: 1.25rem; }
          .section-subtag { font-size: 0.65rem; }
          .dotd-view-all { font-size: 0.76rem; }
          .dotd-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 0.9rem;
          }
          .card-img-box {
            padding: 0.8rem;
            max-height: 140px;
          }
          .card-details { padding: 0.8rem 0.8rem 0.4rem 0.8rem; gap: 0.25rem; }
          .card-product-title { font-size: 0.8rem; line-height: 1.25; }
          .current-price { font-size: 0.92rem; }
          .original-price { font-size: 0.75rem; }
          .btn-wrapper { padding: 0.4rem 0.8rem 0.8rem 0.8rem; }
          .add-to-cart-btn { height: 34px; font-size: 0.7rem; }
        }

        @media (max-width: 640px) {
          .dotd-section { padding: 1.8rem 0; }
          .dotd-title { font-size: 1.15rem; }
          .dotd-grid { grid-template-columns: repeat(2, 1fr); gap: 0.6rem; }
          .card-img-box { max-height: 110px; padding: 0.5rem; }
          .card-details { padding: 0.6rem; gap: 0.2rem; }
          .card-product-title { font-size: 0.75rem; line-height: 1.25; }
          .current-price { font-size: 0.85rem; }
          .original-price { font-size: 0.7rem; }
          .btn-wrapper { padding: 0.3rem 0.6rem 0.6rem 0.6rem; }
          .add-to-cart-btn { height: 32px; font-size: 0.65rem; padding: 0 0.3rem; }
        }
      `}</style>
    </section>
  );
}

export function PopularProducts() {
  const [items, setItems] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    productAPI.getPopularProductsHome()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data.map(mapProduct));
        }
      })
      .catch((err) => console.warn('Popular Products API warning:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || items.length === 0) return null;

  return (
    <section className="pop-section">
      <div className="pop-container">
        <div className="pop-header">
          <div className="title-group">
            <span className="section-subtag">TRENDING NOW</span>
            <h2 className="pop-title">POPULAR PRODUCTS</h2>
          </div>
          <Link href="/shop" className="pop-view-all">
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="pop-grid">
          {items.slice(0, 4).map((item) => (
            <div key={item.id} className="pop-card">
              <Link href={`/product/${item.slug}`} className="card-link">
                <div className="card-img-box">
                  {item.discountBadge && (
                    <span className="badge-tag gold">{item.discountBadge}</span>
                  )}
                  <img
                    src={item.img}
                    alt={item.title}
                    className="product-img"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/hero cards/4.png';
                    }}
                  />
                </div>

                <div className="card-details">
                  <div className="rating-row">
                    <Star size={12} className="star-filled" />
                    <span className="rating-num">{item.rating}</span>
                    <span className="rating-sep">•</span>
                    <CheckCircle2 size={12} className="verified-check" />
                    <span className="reviews">({item.reviewsCount})</span>
                  </div>

                  <h3 className="card-product-title">{item.title}</h3>

                  <div className="price-group">
                    <span className="current-price">{item.price}</span>
                    {item.originalPrice && (
                      <span className="original-price">{item.originalPrice}</span>
                    )}
                  </div>
                </div>
              </Link>

              <div className="btn-wrapper">
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
                  className="add-to-cart-btn"
                >
                  <ShoppingBag size={14} />
                  <span>ADD TO CART</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .pop-section { width: 100%; padding: 4rem 0; background-color: #ffffff; }
        .pop-container { max-width: 1440px; margin: 0 auto; padding: 0 2rem; }
        .pop-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 2rem; }
        .title-group { display: flex; flex-direction: column; gap: 0.3rem; }
        .section-subtag { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.14em; color: #C5A059; }
        .pop-title { font-size: 1.5rem; font-weight: 800; letter-spacing: 0.04em; color: #111111; }
        .pop-view-all { display: flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; font-weight: 700; color: #111111; text-decoration: none; }
        .pop-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
        .pop-card { background-color: #ffffff; border: 1px solid #EAEAEA; border-radius: 10px; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; transition: all 0.3s ease; }
        .pop-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.07); border-color: #D4D4D4; }
        .card-link { display: flex; flex-direction: column; height: 100%; text-decoration: none; }
        .card-img-box { position: relative; width: 100%; aspect-ratio: 0.95; padding: 1.5rem; background-color: #F9F9F8; display: flex; align-items: center; justify-content: center; }
        .badge-tag { position: absolute; top: 0.8rem; left: 0.8rem; font-size: 0.65rem; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 4px; letter-spacing: 0.06em; text-transform: uppercase; }
        .badge-tag.gold { background-color: #C5A059; color: #ffffff; }
        .product-img { max-width: 88%; max-height: 88%; object-fit: contain; transition: transform 0.5s ease; }
        .pop-card:hover .product-img { transform: scale(1.06); }
        .card-details { padding: 1.1rem; display: flex; flex-direction: column; gap: 0.45rem; flex: 1; }
        .rating-row { display: flex; align-items: center; gap: 0.3rem; font-size: 0.75rem; }
        :global(.star-filled) { color: #C5A059; fill: #C5A059; }
        .rating-num { font-weight: 700; color: #111111; }
        .rating-sep { color: #CCCCCC; }
        :global(.verified-check) { color: #0284C7; }
        .reviews { color: #888888; }
        .card-product-title { font-size: 0.92rem; font-weight: 600; color: #111111; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .price-group { display: flex; align-items: baseline; gap: 0.6rem; margin-top: 0.2rem; }
        .current-price { font-size: 1.05rem; font-weight: 800; color: #111111; }
        .original-price { font-size: 0.82rem; color: #999999; text-decoration: line-through; }
        .btn-wrapper { padding: 0.8rem 1.1rem 1.1rem 1.1rem; }
        .add-to-cart-btn { width: 100%; height: 42px; background-color: #111111; color: #ffffff; border: none; border-radius: 6px; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.08em; display: flex; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; transition: background-color 0.2s ease; }
        .add-to-cart-btn:hover { background-color: #2D2D2D; }
        @media (max-width: 1024px) { .pop-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .pop-grid { grid-template-columns: 1fr; } }
      `}</style>
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
    <section className="evergreen-section">
      <div className="evergreen-container">
        <div className="evergreen-header">
          <div className="title-group">
            <span className="section-subtag">TIMELESS FAVORITES</span>
            <h2 className="evergreen-title">EVERGREEN COLLECTION</h2>
          </div>
          <Link href="/shop" className="evergreen-view-all">
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="evergreen-grid">
          {items.slice(0, 4).map((item) => (
            <div key={item.id} className="evergreen-card">
              <Link href={`/product/${item.slug}`} className="card-link">
                <div className="card-img-box">
                  {item.discountBadge && (
                    <span className="badge-tag gold">{item.discountBadge}</span>
                  )}
                  <img
                    src={item.img}
                    alt={item.title}
                    className="product-img"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/hero cards/4.png';
                    }}
                  />
                </div>

                <div className="card-details">
                  <div className="rating-row">
                    <Star size={12} className="star-filled" />
                    <span className="rating-num">{item.rating}</span>
                    <span className="rating-sep">•</span>
                    <CheckCircle2 size={12} className="verified-check" />
                    <span className="reviews">({item.reviewsCount})</span>
                  </div>

                  <h3 className="card-product-title">{item.title}</h3>

                  <div className="price-group">
                    <span className="current-price">{item.price}</span>
                    {item.originalPrice && (
                      <span className="original-price">{item.originalPrice}</span>
                    )}
                  </div>
                </div>
              </Link>

              <div className="btn-wrapper">
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
                  className="add-to-cart-btn"
                >
                  <ShoppingBag size={14} />
                  <span>ADD TO CART</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .evergreen-section { width: 100%; padding: 4rem 0; background-color: #FAFAFA; border-top: 1px solid #EEEEEE; }
        .evergreen-container { max-width: 1440px; margin: 0 auto; padding: 0 2rem; }
        .evergreen-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 2rem; }
        .title-group { display: flex; flex-direction: column; gap: 0.3rem; }
        .section-subtag { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.14em; color: #C5A059; }
        .evergreen-title { font-size: 1.5rem; font-weight: 800; letter-spacing: 0.04em; color: #111111; }
        .evergreen-view-all { display: flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; font-weight: 700; color: #111111; text-decoration: none; }
        .evergreen-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
        .evergreen-card { background-color: #ffffff; border: 1px solid #EAEAEA; border-radius: 10px; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; transition: all 0.3s ease; }
        .evergreen-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.07); border-color: #D4D4D4; }
        .card-link { display: flex; flex-direction: column; height: 100%; text-decoration: none; }
        .card-img-box { position: relative; width: 100%; aspect-ratio: 0.95; padding: 1.5rem; background-color: #F9F9F8; display: flex; align-items: center; justify-content: center; }
        .badge-tag { position: absolute; top: 0.8rem; left: 0.8rem; font-size: 0.65rem; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 4px; letter-spacing: 0.06em; text-transform: uppercase; }
        .badge-tag.gold { background-color: #C5A059; color: #ffffff; }
        .product-img { max-width: 88%; max-height: 88%; object-fit: contain; transition: transform 0.5s ease; }
        .evergreen-card:hover .product-img { transform: scale(1.06); }
        .card-details { padding: 1.1rem; display: flex; flex-direction: column; gap: 0.45rem; flex: 1; }
        .rating-row { display: flex; align-items: center; gap: 0.3rem; font-size: 0.75rem; }
        :global(.star-filled) { color: #C5A059; fill: #C5A059; }
        .rating-num { font-weight: 700; color: #111111; }
        .rating-sep { color: #CCCCCC; }
        :global(.verified-check) { color: #0284C7; }
        .reviews { color: #888888; }
        .card-product-title { font-size: 0.92rem; font-weight: 600; color: #111111; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .price-group { display: flex; align-items: baseline; gap: 0.6rem; margin-top: 0.2rem; }
        .current-price { font-size: 1.05rem; font-weight: 800; color: #111111; }
        .original-price { font-size: 0.82rem; color: #999999; text-decoration: line-through; }
        .btn-wrapper { padding: 0.8rem 1.1rem 1.1rem 1.1rem; }
        .add-to-cart-btn { width: 100%; height: 42px; background-color: #111111; color: #ffffff; border: none; border-radius: 6px; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.08em; display: flex; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; transition: background-color 0.2s ease; }
        .add-to-cart-btn:hover { background-color: #2D2D2D; }
        @media (max-width: 1024px) { .evergreen-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .evergreen-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}

