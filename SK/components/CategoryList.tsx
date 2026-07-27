import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface CategoryTile {
  id: number;
  name: string;
  slug: string;
  isComingSoon: boolean;
  img: string;
}

const CURATED_CATEGORY_TILES: CategoryTile[] = [
  { id: 1, name: 'Bags', slug: 'bags', isComingSoon: true, img: '/images/category_tile_1.png' },
  { id: 2, name: 'Watches', slug: 'watches', isComingSoon: true, img: '/images/category_tile_2.png' },
  { id: 3, name: 'Footwear', slug: 'footwear', isComingSoon: true, img: '/images/category_tile_3.png' },
  { id: 4, name: 'Perfumes', slug: 'perfumes', isComingSoon: false, img: '/images/category_tile_4.png' },
  { id: 5, name: 'Belts & Wallets', slug: 'wallet-belt', isComingSoon: true, img: '/images/category_tile_5.png' },
  { id: 6, name: 'Hair Care', slug: 'haircare', isComingSoon: false, img: '/images/category_tile_6.png' }
];

export default function CategoryList() {
  return (
    <section className="category-tiles-section">
      <div className="category-tiles-container">
        <div className="category-section-header">
          <div className="title-block">
            <span className="section-subtag">DISCOVER</span>
            <h2 className="section-title">CURATED COLLECTIONS</h2>
          </div>
          <Link href="/shop" className="view-all-link">
            <span>Explore All Categories</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="category-grid">
          {CURATED_CATEGORY_TILES.map((cat) => (
            <Link key={cat.id} href={`/shop?category=${cat.slug}`} className="category-tile-card">
              <div className="tile-img-wrapper">
                {cat.isComingSoon && (
                  <span className="coming-soon-badge">COMING SOON</span>
                )}
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="tile-img"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/hero cards/4.png';
                  }}
                />
                <div className="tile-overlay">
                  <span className="tile-name">{cat.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .category-tiles-section {
          width: 100%;
          background-color: #ffffff;
          padding: 4.5rem 0;
          border-bottom: 1px solid #EEEEEE;
        }

        .category-tiles-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .category-section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 2rem;
        }

        .title-block {
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

        .section-title {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: #111111;
        }

        .view-all-link {
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

        .view-all-link:hover {
          color: #C5A059;
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1.2rem;
        }

        .category-tile-card {
          display: block;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          background-color: #F7F7F7;
          border: 1px solid #EAEAEA;
          text-decoration: none;
        }

        .category-tile-card:focus-visible {
          outline: 2px solid #C5A059;
          outline-offset: 2px;
        }

        .category-tile-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
          border-color: #C5A059;
        }

        .tile-img-wrapper {
          width: 100%;
          aspect-ratio: 0.82;
          overflow: hidden;
          position: relative;
        }

        .coming-soon-badge {
          position: absolute;
          top: 0.6rem;
          right: 0.6rem;
          background: rgba(17, 17, 17, 0.88);
          backdrop-filter: blur(4px);
          color: #C5A059;
          border: 1px solid rgba(197, 160, 89, 0.4);
          font-size: 0.58rem;
          font-weight: 800;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          letter-spacing: 0.08em;
          z-index: 5;
          text-transform: uppercase;
        }

        .tile-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .category-tile-card:hover .tile-img {
          transform: scale(1.08);
        }

        .tile-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1.2rem 0.8rem 0.8rem 0.8rem;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.75) 100%);
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .tile-name {
          color: #ffffff;
          font-size: 0.88rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-shadow: 0 1px 4px rgba(0,0,0,0.6);
          text-align: center;
        }

        @media (max-width: 1024px) {
          .category-tiles-section { padding: 3rem 0; }
          .category-grid { grid-template-columns: repeat(3, 1fr); gap: 1rem; }
          .section-title { font-size: 1.25rem; }
          .section-subtag { font-size: 0.65rem; }
          .view-all-link { font-size: 0.76rem; }
          .tile-name { font-size: 0.8rem; }
        }

        @media (max-width: 640px) {
          .category-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </section>
  );
}
