import React, { useState } from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Youtube, Truck, ShieldCheck, RefreshCw, Award } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="site-footer">
      {/* Trust Badges Bar */}
      {/* <div className="trust-badges-bar">
        <div className="trust-container">
          <div className="trust-item">
            <Truck size={24} className="trust-icon" />
            <div className="trust-text">
              <span className="trust-title">Free Express Delivery</span>
              <span className="trust-desc">On all orders above ₹499</span>
            </div>
          </div>

          <div className="trust-item">
            <ShieldCheck size={24} className="trust-icon" />
            <div className="trust-text">
              <span className="trust-title">100% Authentic Guarantee</span>
              <span className="trust-desc">Direct from official labs</span>
            </div>
          </div>

          <div className="trust-item">
            <RefreshCw size={24} className="trust-icon" />
            <div className="trust-text">
              <span className="trust-title">Hassle-Free Returns</span>
              <span className="trust-desc">14-day return window</span>
            </div>
          </div>

          <div className="trust-item">
            <Award size={24} className="trust-icon" />
            <div className="trust-text">
              <span className="trust-title">Premium Craftsmanship</span>
              <span className="trust-desc">Pure organic formulations</span>
            </div>
          </div>
        </div>
      </div> */}

      <div className="footer-main-content">
        <div className="footer-grid-container">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <Link href="/" className="footer-logo-link">
              <img src="/SK Logo.svg" alt="SK Logo" className="footer-logo-img" />
            </Link>
            <p className="brand-description">
              SK is a luxury grooming and lifestyle brand crafting high-performance organic hair oils, artisanal fragrances, and lifestyle accessories designed for uncompromising quality.
            </p>
            <div className="social-icons-row">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Facebook">
                <Facebook size={16} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Instagram">
                <Instagram size={16} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Youtube">
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div className="footer-links-col">
            <h3 className="footer-col-title">COLLECTIONS</h3>
            <ul className="footer-links-list">
              <li><Link href="/best-sellers">Best Sellers</Link></li>
              <li><Link href="/products">All Products</Link></li>
              <li><Link href="/shop?category=haircare">Hair Care Solutions</Link></li>
              <li><Link href="/shop?category=fragrances">Eau De Parfum</Link></li>
              <li><Link href="/shop?category=grooming">Face & Body Serums</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="footer-links-col">
            <h3 className="footer-col-title">CUSTOMER CARE</h3>
            <ul className="footer-links-list">
              <li><Link href="/about">About SK</Link></li>
              <li><Link href="/checkout">Track Order</Link></li>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service">Terms of Service</Link></li>
              <li><Link href="/refund-policy">Refund & Return Policy</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="footer-newsletter-col">
            <h3 className="footer-col-title">JOIN THE CLUB</h3>
            <p className="newsletter-text">
              Subscribe to receive private sale invitations, luxury gift launches, and grooming advice.
            </p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-btn">
                JOIN
              </button>
            </form>
            {subscribed && (
              <p className="subscribed-success">Thank you for subscribing to SK!</p>
            )}
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-container">
            <p className="copyright-text">
              © {new Date().getFullYear()} SK Luxury Grooming & Lifestyle. All Rights Reserved.
            </p>
            <div className="legal-links">
              <Link href="/privacy-policy">Privacy Policy</Link>
              <span className="dot">•</span>
              <Link href="/terms-of-service">Terms of Service</Link>
              <span className="dot">•</span>
              <Link href="/refund-policy">Refund Policy</Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .site-footer {
          width: 100%;
          background-color: #111111;
          color: #ffffff;
          font-family: var(--font-sans, system-ui, -apple-system, sans-serif);
        }

        .trust-badges-bar {
          background-color: #1A1A1A;
          border-bottom: 1px solid #262626;
          padding: 2rem 0;
        }

        .trust-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        :global(.trust-icon) {
          color: #C5A059;
          flex-shrink: 0;
        }

        .trust-text {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .trust-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.02em;
        }

        .trust-desc {
          font-size: 0.75rem;
          color: #999999;
        }

        .footer-main-content {
          padding-top: 4rem;
        }

        .footer-grid-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 2rem 4rem 2rem;
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
          gap: 3rem;
        }

        .footer-brand-col {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .footer-logo-img {
          height: 52px;
          width: auto;
          object-fit: contain;
        }

        .brand-description {
          font-size: 0.85rem;
          color: #A3A3A3;
          line-height: 1.6;
        }

        .social-icons-row {
          display: flex;
          gap: 0.8rem;
          margin-top: 0.5rem;
        }

        .social-icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #222222;
          color: #CCCCCC;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .social-icon-btn:hover {
          background-color: #C5A059;
          color: #ffffff;
          transform: translateY(-2px);
        }

        .footer-links-col {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .footer-col-title {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #C5A059;
          text-transform: uppercase;
        }

        .footer-links-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .footer-links-list :global(a) {
          font-size: 0.85rem;
          color: #A3A3A3;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-links-list :global(a:hover) {
          color: #ffffff;
        }

        .footer-newsletter-col {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .newsletter-text {
          font-size: 0.85rem;
          color: #A3A3A3;
          line-height: 1.5;
        }

        .newsletter-form {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.4rem;
        }

        .newsletter-input {
          flex: 1;
          height: 42px;
          padding: 0 1rem;
          background-color: #1A1A1A;
          border: 1px solid #333333;
          border-radius: 6px;
          color: #ffffff;
          font-size: 0.82rem;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .newsletter-input:focus {
          border-color: #C5A059;
        }

        .newsletter-btn {
          height: 42px;
          padding: 0 1.2rem;
          background-color: #C5A059;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .newsletter-btn:hover {
          background-color: #B08D46;
        }

        .subscribed-success {
          font-size: 0.78rem;
          color: #10B981;
          font-weight: 600;
        }

        .footer-bottom-bar {
          border-top: 1px solid #222222;
          padding: 1.5rem 0;
          background-color: #0A0A0A;
        }

        .footer-bottom-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .copyright-text {
          font-size: 0.78rem;
          color: #737373;
        }

        .legal-links {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .legal-links :global(a) {
          font-size: 0.78rem;
          color: #737373;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .legal-links :global(a:hover) {
          color: #ffffff;
        }

        .dot {
          color: #404040;
          font-size: 0.7rem;
        }

        @media (max-width: 1024px) {
          .trust-container {
            grid-template-columns: repeat(2, 1fr);
          }
          .footer-grid-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .trust-container {
            grid-template-columns: 1fr;
          }
          .footer-grid-container {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .footer-bottom-container {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
