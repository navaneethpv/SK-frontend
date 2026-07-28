import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-[#EAE5DC] rounded-2xl overflow-hidden p-3.5 flex flex-col justify-between h-[390px] lg:h-[420px] shadow-sm animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full aspect-[0.9] rounded-xl animate-shimmer mb-4" />

      {/* Content Skeleton */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="w-16 h-3 rounded animate-shimmer" />
          <div className="w-12 h-3 rounded animate-shimmer" />
        </div>

        {/* Title */}
        <div className="w-3/4 h-4 rounded animate-shimmer" />

        {/* Price */}
        <div className="flex items-center gap-2 mt-1">
          <div className="w-20 h-5 rounded animate-shimmer" />
          <div className="w-12 h-4 rounded animate-shimmer" />
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="w-full h-10 rounded-xl animate-shimmer mt-4" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CategoryGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="w-full aspect-[0.85] rounded-2xl animate-shimmer border border-[#EAE5DC]"
        />
      ))}
    </div>
  );
}
