import React, { useState } from 'react';
import { IProductImage } from '../Pages/Interfaces/product';

interface ProductGalleryProps {
  images: IProductImage[];
  defaultImage: string;
  alias: string;
}

export default function ProductGallery({ images, defaultImage, alias }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(defaultImage);

  // Compile all images (default + gallery list)
  const allImages = [
    { id: 0, image: defaultImage },
    ...images.map((img, i) => ({ id: img.id || i + 1, image: img.image }))
  ];

  return (
    <div className="gallery-container">
      {/* Main Image View */}
      <div className="main-image-wrapper">
        <img src={activeImage} alt={alias} className="main-image" />
      </div>

      {/* Thumbnails Row */}
      {allImages.length > 1 && (
        <div className="thumbnails-row">
          {allImages.map((img) => {
            const isSelected = activeImage === img.image;
            return (
              <button
                key={img.id}
                onClick={() => setActiveImage(img.image)}
                className={`thumbnail-btn ${isSelected ? 'selected' : ''}`}
                aria-label={`View thumbnail ${img.id}`}
              >
                <img src={img.image} alt={`${alias} thumbnail`} className="thumbnail-img" />
              </button>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .gallery-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          width: 100%;
        }

        .main-image-wrapper {
          background-color: hsl(var(--muted));
          border: 1px solid hsl(var(--border));
          border-radius: var(--radius-lg);
          height: 480px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem;
          overflow: hidden;
        }

        .main-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          transition: var(--transition-smooth);
        }

        .main-image-wrapper:hover .main-image {
          transform: scale(1.05);
        }

        .thumbnails-row {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
        }

        .thumbnail-btn {
          width: 80px;
          height: 80px;
          background-color: hsl(var(--muted));
          border: 2px solid hsl(var(--border));
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          cursor: pointer;
          overflow: hidden;
          transition: var(--transition-smooth);
        }

        .thumbnail-btn.selected {
          border-color: hsl(var(--primary));
          background-color: hsl(var(--background));
          box-shadow: 0 0 10px hsla(var(--primary), 0.15);
        }

        .thumbnail-btn:hover:not(.selected) {
          border-color: hsl(var(--border) / 1.5);
          background-color: hsl(var(--border) / 0.1);
        }

        .thumbnail-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        @media (max-width: 768px) {
          .main-image-wrapper {
            height: 320px;
            padding: 1.5rem;
          }
          .thumbnail-btn {
            width: 65px;
            height: 65px;
          }
        }
      `}</style>
    </div>
  );
}
