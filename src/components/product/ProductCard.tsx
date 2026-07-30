import React from 'react';
import Link from 'next/link';
import { Star, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { IProduct } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { formatProductTitle, getProductSlug } from '@/utils/slugHelper';
import { getImageUrl } from '@/utils/imageHelper';

interface ProductCardProps {
  id?: number;
  name?: string;
  img?: string;
  price?: number | string;
  originalPrice?: number | string;
  rating?: string | number;
  reviewsCount?: number;
  badgeText?: string;
  badgeType?: 'green' | 'gold' | 'none';
  product?: IProduct;
}

export default function ProductCard({
  id,
  name,
  img,
  price,
  originalPrice,
  rating = '4.8',
  reviewsCount = 45,
  badgeText,
  badgeType = 'none',
  product
}: ProductCardProps) {
  const { addToCart } = useCart();

  const cardId = id || (product ? product.id : 1);
  const rawTitle = name || (product ? product.alias || product.slug || 'SK Luxury Selection' : 'SK Luxury Selection');
  const cardTitle = formatProductTitle(rawTitle);
  const cardSlug = product ? getProductSlug(product) : getProductSlug({ id: cardId, title: rawTitle });

  const displayPrice = price !== undefined 
    ? price 
    : (product ? (typeof product.selling_price === 'number' && product.selling_price > 0 ? product.selling_price : parseFloat(product.price) || 499) : 499);

  const displayOriginalPrice = originalPrice !== undefined
    ? originalPrice
    : (product && parseFloat(product.price) > Number(displayPrice) ? parseFloat(product.price) : undefined);

  // Compute discount percentage badge
  let computedBadge = badgeText;
  if (!computedBadge && displayOriginalPrice && Number(displayOriginalPrice) > Number(displayPrice)) {
    const numOrig = Number(displayOriginalPrice);
    const numPrice = Number(displayPrice);
    const percent = Math.round(((numOrig - numPrice) / numOrig) * 100);
    if (percent > 0) computedBadge = `${percent}% OFF`;
  }

  let cardImg = img;
  if (!cardImg && product) {
    if (product.icon) cardImg = product.icon;
    else if (product.img && product.img.length > 0) cardImg = product.img[0].image;
    else cardImg = `/hero cards/${(product.id % 4) + 1}.png`;
  }
  if (!cardImg) cardImg = '/hero cards/1.png';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: Number(cardId),
      title: cardTitle,
      price: Number(displayPrice),
      originalPrice: displayOriginalPrice ? Number(displayOriginalPrice) : undefined,
      img: cardImg
    }, 1, true);
  };

  return (
    <div className="group bg-white border border-[#EAE5DC] rounded-2xl overflow-hidden relative flex flex-col justify-between transition-all duration-300 ease-out hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 hover:border-[#C39F68]">
      <Link href={`/product/${cardSlug}`} className="flex flex-col h-full no-underline">
        {/* Product Image Frame */}
        <div className="relative w-full aspect-[0.92] bg-[#FAF8F5] flex items-center justify-center p-5 overflow-hidden">
          {(computedBadge || (badgeText && badgeType !== 'none')) && (
            <span className="absolute top-3 left-3 bg-[#C39F68] text-white text-[0.65rem] font-extrabold px-2.5 py-1 rounded-md tracking-wider uppercase shadow-sm z-10">
              {computedBadge || badgeText}
            </span>
          )}
          <img
            src={getImageUrl(cardImg)}
            alt={cardTitle}
            className="max-w-[82%] max-h-[82%] object-contain filter drop-shadow-md transition-transform duration-500 ease-out group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = getImageUrl('/hero cards/4.png');
            }}
          />
        </div>

        {/* Product Meta Info */}
        <div className="p-4 pt-4 pb-2 flex flex-col gap-1.5 flex-1">
          <div className="flex items-center gap-1.5 text-[0.75rem] text-[#6B7280]">
            <Star size={13} className="text-[#C39F68] fill-[#C39F68]" />
            <span className="font-extrabold text-[#121316]">{rating}</span>
            <span className="text-[#D1D5DB]">•</span>
            <CheckCircle2 size={12} className="text-[#0284C7]" />
            <span className="text-[#6B7280]">({reviewsCount} Reviews)</span>
          </div>

          <h3 className="text-[0.92rem] font-bold text-[#121316] leading-snug line-clamp-2 transition-colors group-hover:text-[#C39F68] min-h-[2.5rem]">
            {cardTitle}
          </h3>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-[1.1rem] font-extrabold text-[#121316]">₹{displayPrice}</span>
            {displayOriginalPrice && (
              <span className="text-[0.82rem] text-[#9CA3AF] line-through font-normal">₹{displayOriginalPrice}</span>
            )}
          </div>
        </div>
      </Link>

      {/* Action CTA Button */}
      <div className="p-4 pt-1">
        <button
          onClick={handleAddToCart}
          className="w-full h-11 bg-[#121316] text-white border-none rounded-xl text-[0.8rem] font-extrabold tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:bg-[#C39F68] hover:shadow-md active:scale-98"
        >
          <ShoppingBag size={15} />
          <span>ADD TO CART</span>
        </button>
      </div>
    </div>
  );
}
