import React, { useState } from 'react';
import { Star, ThumbsUp } from 'lucide-react';

interface TabContainerProps {
  description: string;
  details?: string | null;
}

export default function TabContainer({ description, details }: TabContainerProps) {
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');

  // Hardcoded mockup specs reflecting power tools
  const specs = [
    { label: 'Voltage', value: '18V' },
    { label: 'Motor Type', value: 'Brushless (BL Motor)' },
    { label: 'Max Torque', value: '60 N.m (Newton Meters)' },
    { label: 'No-load Speed', value: '0-500 / 0-1,900 RPM' },
    { label: 'Chuck Size', value: '13mm (1/2") Keyless Chuck' },
    { label: 'Impact Rate', value: '0-7,500 / 0-28,500 BPM' },
    { label: 'Weight (incl. Battery)', value: '1.8 kg' }
  ];

  // Hardcoded mockup reviews
  const reviews = [
    {
      id: 1,
      user: 'John D.',
      date: 'July 15, 2026',
      rating: 5,
      title: 'Amazing power and build quality',
      comment: 'This drill is a beast. The brushless motor is extremely quiet and the battery runtime with the 4.0Ah pack is outstanding. Strongly recommend!'
    },
    {
      id: 2,
      user: 'Robert M.',
      date: 'June 28, 2026',
      rating: 4,
      title: 'Very reliable tool',
      comment: 'Used it on concrete and timber projects. The hammer action is robust. The chuck grips bits tightly. Only minor issue is it is a bit heavy with the 5.0Ah pack.'
    }
  ];

  return (
    <div className="tab-container">
      {/* Tabs Header */}
      <div className="tabs-header">
        <button
          onClick={() => setActiveTab('desc')}
          className={`tab-btn ${activeTab === 'desc' ? 'active' : ''}`}
        >
          Description
        </button>
        <button
          onClick={() => setActiveTab('specs')}
          className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
        >
          Specifications
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
        >
          Reviews ({reviews.length})
        </button>
      </div>

      {/* Tab Content Panels */}
      <div className="tab-content">
        {/* Description Panel */}
        {activeTab === 'desc' && (
          <div className="panel desc-panel">
            <h2 className="panel-title">Product Details</h2>
            <p className="panel-text">{description}</p>
            {details && (
              <>
                <h3 className="panel-subtitle">Usage and Maintenance</h3>
                <p className="panel-text">{details}</p>
              </>
            )}
            <h3 className="panel-subtitle">What's in the Box</h3>
            <ul className="package-list">
              <li>1x SK Professional Brushless Hammer Drill</li>
              <li>2x 18V Lithium-Ion Battery Packs</li>
              <li>1x Intelligent Rapid Charger</li>
              <li>1x Heavy-Duty Protective Carrying Case</li>
              <li>1x Belt Clip & Auxiliary Handle</li>
            </ul>
          </div>
        )}

        {/* Specifications Panel */}
        {activeTab === 'specs' && (
          <div className="panel specs-panel">
            <h2 className="panel-title">Technical Specifications</h2>
            <div className="table-wrapper">
              <table className="specs-table">
                <tbody>
                  {specs.map((spec, i) => (
                    <tr key={i} className="specs-row">
                      <td className="spec-label">{spec.label}</td>
                      <td className="spec-value">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reviews Panel */}
        {activeTab === 'reviews' && (
          <div className="panel reviews-panel">
            <h2 className="panel-title">Customer Feedback</h2>
            
            <div className="reviews-summary">
              <div className="summary-left">
                <span className="avg-score">4.5</span>
                <span className="out-of">out of 5</span>
                <div className="summary-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < 4 ? 'currentColor' : 'none'} className="star-rating" />
                  ))}
                </div>
              </div>
              
              <div className="summary-right">
                {/* Visual rating bars */}
                {[5, 4, 3, 2, 1].map((rating) => {
                  const percentage = rating === 5 ? 75 : rating === 4 ? 20 : 5;
                  return (
                    <div key={rating} className="rating-bar-row">
                      <span className="bar-label">{rating} ★</span>
                      <div className="bar-outer">
                        <div className="bar-inner" style={{ width: `${percentage}%` }}></div>
                      </div>
                      <span className="bar-percentage">{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Individual Reviews List */}
            <div className="reviews-list">
              {reviews.map((rev) => (
                <div key={rev.id} className="review-card">
                  <div className="review-header">
                    <div className="user-details">
                      <div className="user-avatar">{rev.user.charAt(0)}</div>
                      <div>
                        <h4 className="user-name">{rev.user}</h4>
                        <span className="review-date">{rev.date}</span>
                      </div>
                    </div>
                    
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          fill={i < rev.rating ? 'currentColor' : 'none'}
                          className="star-rating"
                        />
                      ))}
                    </div>
                  </div>

                  <h4 className="review-title">{rev.title}</h4>
                  <p className="review-comment">{rev.comment}</p>
                  
                  <button className="helpful-btn" aria-label="Helpful button">
                    <ThumbsUp size={14} /> Was this helpful?
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .tab-container {
          background-color: hsl(var(--background));
          border: 1px solid hsl(var(--border));
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }

        .tabs-header {
          display: flex;
          background-color: hsl(var(--muted));
          border-bottom: 1px solid hsl(var(--border));
        }

        .tab-btn {
          flex: 1;
          padding: 1.2rem;
          border: none;
          background: none;
          font-weight: 700;
          font-size: 0.95rem;
          color: hsl(var(--muted-foreground));
          cursor: pointer;
          transition: var(--transition-smooth);
          border-bottom: 2px solid transparent;
        }

        .tab-btn.active {
          color: hsl(var(--primary));
          border-bottom-color: hsl(var(--primary));
          background-color: hsl(var(--background));
        }

        .tab-btn:hover:not(.active) {
          color: hsl(var(--foreground));
          background-color: hsl(var(--border) / 0.2);
        }

        .tab-content {
          padding: 3rem;
        }

        .panel {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .panel-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: hsl(var(--foreground));
        }

        .panel-subtitle {
          font-size: 1.1rem;
          font-weight: 700;
          margin-top: 1rem;
        }

        .panel-text {
          font-size: 0.95rem;
          color: hsl(var(--muted-foreground));
          line-height: 1.6;
        }

        .package-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding-left: 0.5rem;
        }

        .package-list li {
          font-size: 0.9rem;
          color: hsl(var(--muted-foreground));
          position: relative;
          padding-left: 1.2rem;
        }

        .package-list li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: hsl(var(--primary));
          font-weight: 800;
        }

        .specs-table {
          width: 100%;
          border-collapse: collapse;
        }

        .specs-row {
          border-bottom: 1px solid hsl(var(--border));
        }

        .specs-row:last-child {
          border: none;
        }

        .spec-label {
          padding: 1rem;
          font-weight: 700;
          color: hsl(var(--foreground));
          width: 30%;
          background-color: hsl(var(--muted) / 0.3);
        }

        .spec-value {
          padding: 1rem;
          color: hsl(var(--muted-foreground));
        }

        .reviews-summary {
          display: flex;
          gap: 4rem;
          align-items: center;
          background-color: hsl(var(--muted) / 0.3);
          padding: 2rem;
          border-radius: var(--radius-md);
          border: 1px solid hsl(var(--border));
          margin-bottom: 2rem;
        }

        .summary-left {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
        }

        .avg-score {
          font-size: 3rem;
          font-weight: 800;
          color: hsl(var(--foreground));
          line-height: 1;
        }

        .out-of {
          font-size: 0.85rem;
          color: hsl(var(--muted-foreground));
          font-weight: 600;
        }

        .summary-stars {
          display: flex;
          color: hsl(var(--rating));
          margin-top: 0.4rem;
        }

        .summary-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .rating-bar-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .bar-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: hsl(var(--muted-foreground));
          width: 30px;
        }

        .bar-outer {
          flex: 1;
          height: 8px;
          background-color: hsl(var(--border));
          border-radius: 99px;
          overflow: hidden;
        }

        .bar-inner {
          height: 100%;
          background-color: hsl(var(--rating));
          border-radius: 99px;
        }

        .bar-percentage {
          font-size: 0.85rem;
          color: hsl(var(--muted-foreground));
          width: 35px;
          text-align: right;
        }

        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .review-card {
          border-bottom: 1px solid hsl(var(--border));
          padding-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .review-card:last-child {
          border: none;
          padding-bottom: 0;
        }

        .review-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .user-details {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: hsl(var(--primary) / 0.1);
          color: hsl(var(--primary));
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-name {
          font-size: 0.95rem;
          font-weight: 700;
        }

        .review-date {
          font-size: 0.8rem;
          color: hsl(var(--muted-foreground));
        }

        .review-title {
          font-size: 1.05rem;
          font-weight: 700;
        }

        .review-comment {
          font-size: 0.9rem;
          color: hsl(var(--muted-foreground));
          line-height: 1.5;
        }

        .helpful-btn {
          align-self: flex-start;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: none;
          border: none;
          font-size: 0.8rem;
          font-weight: 600;
          color: hsl(var(--muted-foreground));
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .helpful-btn:hover {
          color: hsl(var(--primary));
        }

        @media (max-width: 768px) {
          .tab-content {
            padding: 1.5rem;
          }
          .reviews-summary {
            flex-direction: column;
            gap: 1.5rem;
            align-items: flex-start;
            padding: 1.2rem;
          }
          .summary-right {
            width: 100%;
          }
          .spec-label {
            width: 40%;
          }
        }
      `}</style>
    </div>
  );
}
