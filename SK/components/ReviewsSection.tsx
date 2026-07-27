import React from 'react';

export default function ReviewsSection() {
  return (
    <section className="reviews-section">
      <div className="section-container">
        <div className="reviews-header-block">
          <span className="reviews-subtag">REAL RESULTS</span>
          <h2 className="reviews-main-title">LOVED BY THOUSANDS</h2>
        </div>

        <div className="reviews-3-grid">
          <div className="review-card">
            <div className="reviewer-header">
              <div className="avatar-circle">AK</div>
              <div className="reviewer-info">
                <span className="reviewer-name">Ananya K.</span>
                <span className="verified-tag">✔ Verified Buyer</span>
              </div>
            </div>
            <div className="stars-gold">★★★★★</div>
            <p className="review-quote">"The SK Noir Eau De Parfum smells divine and lasts literally all day. Everyone asks me what fragrance I am wearing!"</p>
          </div>

          <div className="review-card">
            <div className="reviewer-header">
              <div className="avatar-circle">RM</div>
              <div className="reviewer-info">
                <span className="reviewer-name">Rahul M.</span>
                <span className="verified-tag">✔ Verified Buyer</span>
              </div>
            </div>
            <div className="stars-gold">★★★★★</div>
            <p className="review-quote">"SK Organic Hair Oil changed my hair routine completely. Noticeable thickness and shine within two weeks."</p>
          </div>

          <div className="review-card">
            <div className="reviewer-header">
              <div className="avatar-circle">PS</div>
              <div className="reviewer-info">
                <span className="reviewer-name">Priya S.</span>
                <span className="verified-tag">✔ Verified Buyer</span>
              </div>
            </div>
            <div className="stars-gold">★★★★★</div>
            <p className="review-quote">"The Vitamin C Face Wash is super gentle yet powerful. Skin feels refreshed, bright, and deeply hydrated."</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .reviews-section {
          width: 100%;
          padding: 4.5rem 0 5rem 0;
          background-color: #FAF8F5;
          border-top: 1px solid #F0EDE8;
        }

        .section-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .reviews-header-block {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .reviews-subtag {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          color: #C5A059;
          display: block;
          margin-bottom: 0.3rem;
        }

        .reviews-main-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #121316;
          letter-spacing: 0.04em;
        }

        .reviews-3-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .review-card {
          background-color: #ffffff;
          border: 1px solid #EAE6DF;
          border-radius: 12px;
          padding: 1.8rem;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .review-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
          border-color: #C5A059;
        }

        .reviewer-header {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .avatar-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #121316 0%, #27272A 100%);
          color: #C5A059;
          font-size: 0.82rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .reviewer-info {
          display: flex;
          flex-direction: column;
        }

        .reviewer-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: #121316;
        }

        .verified-tag {
          font-size: 0.68rem;
          font-weight: 600;
          color: #15803D;
        }

        .stars-gold {
          color: #F59E0B;
          font-size: 0.9rem;
          letter-spacing: 0.1em;
        }

        .review-quote {
          font-size: 0.86rem;
          color: #4B5563;
          line-height: 1.55;
          font-style: italic;
        }

        @media (max-width: 1024px) {
          .reviews-section { padding: 3rem 0 3.5rem 0; }
          .reviews-header-block { margin-bottom: 1.8rem; }
          .reviews-subtag { font-size: 0.65rem; }
          .reviews-main-title { font-size: 1.25rem; }
          .reviews-3-grid { grid-template-columns: repeat(3, 1fr); gap: 1rem; }
          .review-card { padding: 1.2rem; gap: 0.6rem; }
          .review-quote { font-size: 0.8rem; line-height: 1.45; }
        }

        @media (max-width: 640px) {
          .reviews-3-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
