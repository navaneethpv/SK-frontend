import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '@/SK/components/Header';
import Footer from '@/SK/components/Footer';
import { productAPI } from '@/SK/Api/Services/productAPI';
import { IAbout } from '@/SK/Pages/Interfaces/home';

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<IAbout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productAPI.getAbouts()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAboutData(data[0]);
        }
      })
      .catch((err) => {
        console.error('Error fetching about data:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Head>
        <title>About Us | SK Store</title>
        <meta name="description" content="Learn more about SK Store." />
      </Head>

      <Header />

      <main className="about-page">
        <div className="container">
          <h1 className="page-title">About Us</h1>
          
          {loading ? (
            <div className="loading-spinner">Loading...</div>
          ) : aboutData ? (
            <div className="about-content">
              {aboutData.logo && (
                <div className="about-logo-wrapper">
                  <img src={aboutData.logo} alt="About SK" className="about-logo" />
                </div>
              )}
              {aboutData.title && <h2 className="about-subtitle">{aboutData.title}</h2>}
              {aboutData.description && <p className="about-desc">{aboutData.description}</p>}
              {aboutData.content && (
                <div 
                  className="about-html" 
                  dangerouslySetInnerHTML={{ __html: aboutData.content }} 
                />
              )}
            </div>
          ) : (
            <div className="empty-state">
              <p>No information available at the moment.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .about-page {
          min-height: 60vh;
          padding: 8rem 0 4rem; /* to account for absolute header */
          background-color: #FAF8F5;
        }

        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .page-title {
          font-family: 'Outfit', sans-serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: #121316;
          margin-bottom: 2rem;
          text-align: center;
        }

        .about-content {
          background: #ffffff;
          border-radius: 12px;
          padding: 3rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }

        .about-logo-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .about-logo {
          max-height: 120px;
          object-fit: contain;
        }

        .about-subtitle {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1.8rem;
          font-weight: 600;
          color: #121316;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .about-desc {
          font-size: 1.1rem;
          line-height: 1.6;
          color: #4B5563;
          margin-bottom: 2rem;
          text-align: center;
        }

        .about-html {
          font-size: 1.05rem;
          line-height: 1.7;
          color: #374151;
        }
        
        .about-html :global(p) {
          margin-bottom: 1rem;
        }

        .about-html :global(h1), 
        .about-html :global(h2), 
        .about-html :global(h3) {
          color: #121316;
          margin: 1.5rem 0 1rem;
        }

        .loading-spinner {
          text-align: center;
          padding: 4rem;
          color: #6B7280;
          font-size: 1.1rem;
        }

        .empty-state {
          text-align: center;
          padding: 4rem;
          color: #6B7280;
          background: #ffffff;
          border-radius: 12px;
        }

        @media (max-width: 768px) {
          .about-page {
            padding: 6rem 0 3rem;
          }
          
          .about-content {
            padding: 2rem 1.5rem;
          }

          .page-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </>
  );
}
