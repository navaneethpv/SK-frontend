import React from 'react';
import { Truck, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';

export default function TrustBar() {
  return (
    <section className="trust-bar-section">
      <div className="section-container">
        <div className="trust-bar-grid">
          <div className="trust-item">
            <div className="trust-icon-box">
              <Truck size={20} color="#C5A059" />
            </div>
            <div className="trust-text-block">
              <span className="trust-title">Free Express Shipping</span>
              <span className="trust-desc">On all orders over ₹499</span>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon-box">
              <Sparkles size={20} color="#C5A059" />
            </div>
            <div className="trust-text-block">
              <span className="trust-title">100% Organic Formulations</span>
              <span className="trust-desc">Dermatologically tested & certified</span>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon-box">
              <ShieldCheck size={20} color="#C5A059" />
            </div>
            <div className="trust-text-block">
              <span className="trust-title">Authenticity Guaranteed</span>
              <span className="trust-desc">Direct from official SK laboratory</span>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon-box">
              <RefreshCw size={20} color="#C5A059" />
            </div>
            <div className="trust-text-block">
              <span className="trust-title">7-Day Easy Returns</span>
              <span className="trust-desc">100% satisfaction promise</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .trust-bar-section {
          width: 100%;
          background-color: #FAF8F5;
          padding: 1.8rem 0;
          border-top: 1px solid #F0EDE8;
          border-bottom: 1px solid #F0EDE8;
        }

        .section-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .trust-bar-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .trust-icon-box {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background-color: #ffffff;
          border: 1px solid #EAE6DF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .trust-text-block {
          display: flex;
          flex-direction: column;
        }

        .trust-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: #121316;
          line-height: 1.2;
        }

        .trust-desc {
          font-size: 0.72rem;
          color: #6B7280;
          margin-top: 2px;
        }

        @media (max-width: 1024px) {
          .trust-bar-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .trust-bar-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
