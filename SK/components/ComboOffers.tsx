import React from 'react';
import Link from 'next/link';

export default function ComboOffers() {
  return (
    <section className="bundle-section">
      <div className="bundle-container">
        {/* Section Header */}
        <div className="bundle-header">
          <h2 className="bundle-title">Build Your Bundle</h2>
          <p className="bundle-subtitle">Get Super Saving Deals - <span>Starting at @599</span></p>
        </div>

        {/* 3 Main Bundle Cards */}
        <div className="main-bundles-grid">
          {/* Card 1: Essential Grooming Kit */}
          <div className="bundle-card">
            <div className="bundle-card-img-wrapper">
              <img src="/bundle - combo offer/1.png" alt="Essential Grooming Kit" className="bundle-img" />
              <div className="bundle-overlay-content">
                <Link href="/shop?bundle=grooming" className="shop-bundle-btn">
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Premium Lifestyle Collection */}
          <div className="bundle-card">
            <div className="bundle-card-img-wrapper">
              <img src="/bundle - combo offer/2.png" alt="Premium Lifestyle Collection" className="bundle-img" />
              <div className="bundle-overlay-content">
                <Link href="/shop?bundle=lifestyle" className="shop-bundle-btn">
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3: Executive Essentials */}
          <div className="bundle-card">
            <div className="bundle-card-img-wrapper">
              <img src="/bundle - combo offer/3.png" alt="Executive Essentials" className="bundle-img" />
              <div className="bundle-overlay-content">
                {/* <h3 className="bundle-card-title">Executive Essentials</h3> */}
                {/* <p className="bundle-card-desc">Refined leather accessories crafted for everyday sophistication.</p> */}
                <Link href="/shop?bundle=executive" className="shop-bundle-btn">
                  {/* Shop Bundle */}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Mini Offer Cards below */}
        <div className="mini-offers-grid">
          {/* Offer Card 1 */}
          <div className="mini-offer-card">
            <div className="offer-info">
              <h4 className="offer-name">Luxury Scent Box</h4>
              <span className="offer-badge green-badge">LUXURY SCENTS</span>
              <span className="offer-price">₹1,099</span>
            </div>
            <button className="build-box-btn">Build Box</button>
          </div>

          {/* Offer Card 2 */}
          <div className="mini-offer-card">
            <div className="offer-info">
              <h4 className="offer-name">Mini Perfume Box</h4>
              <span className="offer-badge gold-badge">BESTSELLER</span>
              <span className="offer-price">₹599 <del className="strike-price">₹4,497</del></span>
            </div>
            <button className="build-box-btn">Build Box</button>
          </div>

          {/* Offer Card 3 */}
          <div className="mini-offer-card">
            <div className="offer-info">
              <h4 className="offer-name">Self Grooming Kit</h4>
              <span className="offer-badge blue-badge">VALUE DEAL</span>
              <span className="offer-price">₹599</span>
            </div>
            <button className="build-box-btn">Build Box</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bundle-section {
          width: 100%;
          padding: 4rem 0;
          background-color: #ffffff;
        }

        .bundle-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .bundle-header {
          margin-bottom: 2.2rem;
        }

        .bundle-title {
          font-family: var(--font-sans);
          font-size: 1.6rem;
          font-weight: 700;
          color: #121316;
          margin-bottom: 0.3rem;
        }

        .bundle-subtitle {
          font-size: 0.9rem;
          color: #6B7280;
        }

        .bundle-subtitle span {
          font-style: italic;
          font-weight: 600;
          color: #121316;
        }

        .main-bundles-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 1.8rem;
        }

        .bundle-card {
          border-radius: 8px;
          overflow: hidden;
          background-color: #f5f5f5;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease;
        }

        .bundle-card:hover {
          transform: translateY(-4px);
        }

        .bundle-card-img-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 0.92;
          overflow: hidden;
        }

        .bundle-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .bundle-overlay-content {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          right: 1.5rem;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .bundle-card-title {
          font-family: var(--font-sans);
          font-size: 1.25rem;
          font-weight: 700;
          color: #121316;
        }

        .bundle-card-desc {
          font-size: 0.82rem;
          color: #4B5563;
          max-width: 240px;
          line-height: 1.4;
        }

        .shop-bundle-btn {
          margin-top: 0.4rem;
          background-color: #000000;
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.5rem 1.2rem;
          border-radius: 4px;
          transition: background-color 0.2s ease;
        }

        .shop-bundle-btn:hover {
          background-color: #C39F68;
        }

        /* Mini Offer Cards */
        .mini-offers-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .mini-offer-card {
          background-color: transparent;
          border: none;
          border-radius: 0;
          padding: 0.8rem 0 0 0;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }

        .offer-info {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .offer-name {
          font-family: 'Plus Jakarta Sans', 'Outfit', sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: #000000;
        }

        .offer-badge {
          display: inline-block;
          font-size: 0.62rem;
          font-weight: 700;
          padding: 0.15rem 0.45rem;
          border-radius: 3px;
          letter-spacing: 0.03em;
          align-self: flex-start;
        }

        .green-badge {
          border: 1.5px solid #10B981;
          color: #10B981;
          background: transparent;
        }

        .gold-badge {
          background-color: #FEF08A;
          color: #854D0E;
          border: none;
        }

        .blue-badge {
          border: 1.5px solid #06B6D4;
          color: #06B6D4;
          background: transparent;
        }

        .offer-price {
          font-family: 'Plus Jakarta Sans', 'Outfit', sans-serif;
          font-size: 1.05rem;
          font-weight: 800;
          color: #000000;
        }

        .strike-price {
          font-size: 0.82rem;
          color: #9CA3AF;
          margin-left: 4px;
          font-weight: 400;
          text-decoration: line-through;
        }

        .build-box-btn {
          background-color: #27272A;
          color: #ffffff;
          border: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.76rem;
          font-weight: 700;
          padding: 0.6rem 1.15rem;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .build-box-btn:hover {
          background-color: #000000;
        }

        @media (max-width: 1024px) {
          .main-bundles-grid, .mini-offers-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
