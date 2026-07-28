import React from 'react';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

export default function Custom500() {
  return (
    <div className="error-page-wrapper">
      <Header />
      <main className="error-main">
        <div className="error-card">
          <h1 className="error-code">500</h1>
          <p className="error-message">Server Error - Something went wrong on our server.</p>
          <Link href="/" className="home-btn">
            Return to Homepage
          </Link>
        </div>
      </main>
      <Footer />

      <style jsx>{`
        .error-page-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: #ffffff;
        }
        .error-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8rem 2rem 4rem 2rem;
        }
        .error-card {
          text-align: center;
          max-width: 450px;
        }
        .error-code {
          font-size: 3.5rem;
          font-weight: 800;
          color: #121316;
        }
        .error-message {
          font-size: 1rem;
          color: #6B7280;
          margin: 1rem 0 2rem 0;
        }
        .home-btn {
          display: inline-block;
          background-color: #121316;
          color: #ffffff;
          padding: 0.8rem 1.8rem;
          border-radius: 6px;
          font-weight: 700;
          font-size: 0.88rem;
        }
      `}</style>
    </div>
  );
}
