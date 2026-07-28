import React, { useState } from 'react';
import { IProductImage } from '@/types/product';

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
    <div className="flex flex-col gap-6 w-full">
      {/* Main Image View */}
      <div className="group bg-[#FAF7F2] border border-[#EAE5DC] rounded-2xl h-[320px] md:h-[480px] flex items-center justify-center p-6 md:p-10 overflow-hidden">
        <img
          src={activeImage}
          alt={alias}
          className="max-w-full max-h-full object-contain transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
        />
      </div>

      {/* Thumbnails Row */}
      {allImages.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {allImages.map((img) => {
            const isSelected = activeImage === img.image;
            return (
              <button
                key={img.id}
                onClick={() => setActiveImage(img.image)}
                className={`w-[65px] h-[65px] md:w-[80px] md:h-[80px] p-2 rounded-lg cursor-pointer overflow-hidden flex items-center justify-center transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                  isSelected
                    ? 'border-2 border-[#C39F68] bg-white shadow-[0_0_10px_rgba(195,159,104,0.15)]'
                    : 'border-2 border-[#EAE5DC] bg-[#FAF7F2] hover:border-[#D0C9BE]'
                }`}
                aria-label={`View thumbnail ${img.id}`}
              >
                <img src={img.image} alt={`${alias} thumbnail`} className="max-w-full max-h-full object-contain" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
