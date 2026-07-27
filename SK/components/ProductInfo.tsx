import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Star, ShoppingCart, Check, Heart, Scale } from 'lucide-react';
import { IProduct } from '../Pages/Interfaces/product';
import { cartAPI } from '../Api/Services/cartAPI';
import { useCart } from '../context/CartContext';

interface ProductInfoProps {
  product: IProduct;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [batterySize, setBatterySize] = useState('4.0 Ah (Recommended)');
  const [kitType, setKitType] = useState('Complete Kit');
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Math
  const price = parseFloat(product.price);
  const discount = parseFloat(product.discount || '0');
  const hasDiscount = discount > 0;
  const originalPrice = price;
  const salePrice = price - discount;
  const discountPercentage = hasDiscount ? Math.round((discount / originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    setAddingToCart(true);
    addToCart({
      id: product.id,
      title: product.alias,
      price: salePrice,
      img: product.icon || (product.img && product.img.length > 0 ? product.img[0].image : '/hero cards/1.png'),
    }, quantity, true);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
    setAddingToCart(false);
  };

  const handleBuyNow = () => {
    // Add to cart without opening side drawer, and redirect directly to checkout order page
    addToCart({
      id: product.id,
      title: product.alias,
      price: salePrice,
      img: product.icon || (product.img && product.img.length > 0 ? product.img[0].image : '/hero cards/1.png'),
    }, quantity, false);
    router.push('/checkout');
  };

  return (
    <div className="product-info-container">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        Home &gt; Shop &gt; Power Tools &gt; <span className="active">{product.alias}</span>
      </div>

      {/* Title & Tagline */}
      <h1 className="product-title">{product.alias}</h1>
      <p className="product-tagline">{product.sdescription}</p>

      {/* Ratings & Stock Availability */}
      <div className="rating-stock-row">
        <div className="ratings">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < Math.floor(product.rating || 4.5) ? 'currentColor' : 'none'}
                className="star-icon"
              />
            ))}
          </div>
          <span className="rating-text">({product.review_count || 128} Customer Reviews)</span>
        </div>
        <span className="stock-badge badge-green">In Stock</span>
      </div>

      {/* Pricing Showcase */}
      <div className="price-row">
        {hasDiscount ? (
          <>
            <span className="sale-price">${salePrice.toFixed(2)}</span>
            <span className="original-price">${originalPrice.toFixed(2)}</span>
            <span className="discount-tag">-{discountPercentage}% OFF</span>
          </>
        ) : (
          <span className="sale-price">${originalPrice.toFixed(2)}</span>
        )}
      </div>

      {/* Highlights / Specs bullets */}
      <div className="bullets-section">
        <h3 className="section-title">Key Features</h3>
        <ul className="bullets-list">
          <li>Brushless motor delivers up to 50% more runtime and lifespan</li>
          <li>Heavy-duty 2-speed metal transmission for superior durability</li>
          <li>Compact design fits into tight spaces with ergonomic grip</li>
          <li>Integrated LED worklight illuminates dark workspaces</li>
        </ul>
      </div>

      {/* Custom Variant Options */}
      <div className="variants-section">
        {/* Battery Selection */}
        <div className="variant-group">
          <label className="variant-label">Battery Capacity</label>
          <div className="variant-buttons">
            {['2.0 Ah', '4.0 Ah (Recommended)', '5.0 Ah'].map((size) => (
              <button
                key={size}
                onClick={() => setBatterySize(size)}
                className={`variant-btn ${batterySize === size ? 'selected' : ''}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Kit Selection */}
        <div className="variant-group">
          <label className="variant-label">Charger & Case Options</label>
          <div className="variant-buttons">
            {['Tool Only', 'Tool + Case', 'Complete Kit'].map((type) => (
              <button
                key={type}
                onClick={() => setKitType(type)}
                className={`variant-btn ${kitType === type ? 'selected' : ''}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quantity & Actions Bar */}
      <div className="actions-section">
        <div className="quantity-selector">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="qty-btn">-</button>
          <span className="qty-count">{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)} className="qty-btn">+</button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={addingToCart}
          className={`btn-action btn-add-cart ${addedSuccess ? 'success' : ''}`}
        >
          {addedSuccess ? (
            <><Check size={18} /> Added to Cart</>
          ) : (
            <><ShoppingCart size={18} /> Add to Cart</>
          )}
        </button>

        <button onClick={handleBuyNow} className="btn-action btn-buy-now">
          Buy Now
        </button>
      </div>

      {/* Auxiliary actions: wishlist and compare */}
      <div className="aux-actions">
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`aux-btn ${isWishlisted ? 'active' : ''}`}
        >
          <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
          {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
        </button>
        <button className="aux-btn">
          <Scale size={16} /> Add to Compare
        </button>
      </div>

      {/* Meta specifications */}
      <div className="meta-specs">
        <div className="meta-item">
          <span className="meta-label">SKU:</span>
          <span className="meta-val">SK-PD-18V-BRUSHLESS</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Categories:</span>
          <span className="meta-val">Power Tools, Cordless Drills</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Tags:</span>
          <span className="meta-val">Brushless, Cordless, Heavy Duty</span>
        </div>
      </div>

      <style jsx>{`
        .product-info-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .breadcrumbs {
          font-size: 0.85rem;
          color: hsl(var(--muted-foreground));
          display: flex;
          gap: 0.4rem;
        }

        .breadcrumbs .active {
          color: hsl(var(--foreground));
          font-weight: 500;
        }

        .product-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: hsl(var(--foreground));
          line-height: 1.2;
        }

        .product-tagline {
          font-size: 1.1rem;
          color: hsl(var(--muted-foreground));
          line-height: 1.5;
        }

        .rating-stock-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid hsl(var(--border));
          padding-bottom: 1.2rem;
        }

        .ratings {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .stars {
          display: flex;
          color: hsl(var(--rating));
        }

        .rating-text {
          font-size: 0.85rem;
          color: hsl(var(--muted-foreground));
          font-weight: 500;
        }

        .price-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 0.5rem 0;
        }

        .sale-price {
          font-size: 2rem;
          font-weight: 800;
          color: hsl(var(--foreground));
        }

        .original-price {
          font-size: 1.2rem;
          color: hsl(var(--muted-foreground));
          text-decoration: line-through;
        }

        .discount-tag {
          background-color: hsl(var(--primary));
          color: white;
          font-weight: 700;
          font-size: 0.75rem;
          padding: 0.3rem 0.6rem;
          border-radius: var(--radius-sm);
        }

        .bullets-section {
          background-color: hsl(var(--muted) / 0.4);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          border: 1px solid hsl(var(--border));
        }

        .bullets-section .section-title {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 0.8rem;
        }

        .bullets-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .bullets-list li {
          font-size: 0.9rem;
          position: relative;
          padding-left: 1.5rem;
          color: hsl(var(--muted-foreground));
        }

        .bullets-list li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: hsl(var(--primary));
          font-weight: 700;
        }

        .variants-section {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          border-top: 1px solid hsl(var(--border));
          border-bottom: 1px solid hsl(var(--border));
          padding: 1.5rem 0;
        }

        .variant-group {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .variant-label {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          color: hsl(var(--muted-foreground));
          letter-spacing: 0.05em;
        }

        .variant-buttons {
          display: flex;
          gap: 0.8rem;
          flex-wrap: wrap;
        }

        .variant-btn {
          padding: 0.6rem 1.2rem;
          border-radius: var(--radius-md);
          border: 1px solid hsl(var(--border));
          background-color: hsl(var(--background));
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .variant-btn.selected {
          background-color: hsl(var(--foreground));
          color: white;
          border-color: hsl(var(--foreground));
        }

        .variant-btn:hover:not(.selected) {
          border-color: hsl(var(--border) / 1.8);
          background-color: hsl(var(--muted));
        }

        .actions-section {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .quantity-selector {
          display: flex;
          align-items: center;
          border: 1px solid hsl(var(--border));
          border-radius: var(--radius-md);
          overflow: hidden;
          background-color: hsl(var(--muted));
          height: 48px;
        }

        .qty-btn {
          width: 40px;
          height: 100%;
          border: none;
          background: none;
          font-size: 1.2rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .qty-btn:hover {
          background-color: hsl(var(--border) / 0.4);
        }

        .qty-count {
          padding: 0 1rem;
          font-weight: 700;
          font-size: 0.95rem;
        }

        .btn-action {
          flex: 1;
          height: 48px;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: var(--transition-smooth);
          border: none;
          min-width: 140px;
        }

        .btn-add-cart {
          background-color: hsl(var(--foreground));
          color: white;
        }

        .btn-add-cart:hover {
          background-color: hsl(var(--foreground) / 0.85);
        }

        .btn-add-cart.success {
          background-color: hsl(var(--success));
        }

        .btn-buy-now {
          background-color: hsl(var(--primary));
          color: white;
        }

        .btn-buy-now:hover {
          background-color: #E04F00;
          box-shadow: 0 5px 15px hsla(var(--primary), 0.2);
        }

        .aux-actions {
          display: flex;
          gap: 1.5rem;
          margin-top: 0.5rem;
        }

        .aux-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: none;
          border: none;
          font-size: 0.85rem;
          font-weight: 600;
          color: hsl(var(--muted-foreground));
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .aux-btn:hover, .aux-btn.active {
          color: hsl(var(--primary));
        }

        .aux-btn.active {
          color: #FF2E93;
        }

        .meta-specs {
          border-top: 1px solid hsl(var(--border));
          padding-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .meta-item {
          display: flex;
          font-size: 0.85rem;
          gap: 0.5rem;
        }

        .meta-label {
          font-weight: 700;
          color: hsl(var(--foreground));
        }

        .meta-val {
          color: hsl(var(--muted-foreground));
        }
      `}</style>
    </div>
  );
}
