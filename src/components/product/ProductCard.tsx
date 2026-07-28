import React from 'react';
import Link from 'next/link';
import { Star, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { IProduct } from '@/types/product';
import { useCart } from '@/context/CartContext';

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
  reviewsCount = 42,
  badgeText,
  badgeType = 'none',
  product
}: ProductCardProps) {
  const { addToCart } = useCart();

  const cardId = id || (product ? product.id : 1);
  const cardTitle = name || (product ? product.alias || product.slug || 'SK Luxury Product' : 'SK Luxury Product');
  
  const displayPrice = price !== undefined 
    ? price 
    : (product ? (typeof product.selling_price === 'number' && product.selling_price > 0 ? product.selling_price : parseFloat(product.price) || 499) : 499);

  const displayOriginalPrice = originalPrice !== undefined
    ? originalPrice
    : (product && parseFloat(product.price) > Number(displayPrice) ? parseFloat(product.price) : undefined);

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
    <div className="group bg-white border border-[#EAEAEA] rounded-[10px] overflow-hidden relative flex flex-col justify-between transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.07)] hover:-translate-y-1 hover:border-[#D4D4D4]">
      <Link href={`/product/${cardId}`} className="flex flex-col h-full no-underline">
        <div className="relative w-full aspect-[0.95] flex items-center justify-center p-6 bg-[#F9F9F8] overflow-hidden">
          {badgeText && badgeType !== 'none' && (
            <span
              className={`absolute top-[0.8rem] left-[0.8rem] text-[0.65rem] font-bold px-[0.6rem] py-[0.25rem] rounded tracking-[0.06em] uppercase z-10 ${
                badgeType === 'green' ? 'bg-[#10B981] text-white' : 'bg-[#C5A059] text-white'
              }`}
            >
              {badgeText}
            </span>
          )}
          <img
            src={cardImg}
            alt={cardTitle}
            className="max-w-[88%] max-h-[88%] object-contain transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-106"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/hero cards/4.png';
            }}
          />
        </div>

        <div className="p-[1.1rem] pb-[0.5rem] flex flex-col gap-[0.45rem] flex-1">
          <div className="flex items-center gap-[0.3rem] text-[0.75rem] text-[#666666]">
            <Star size={12} className="text-[#C5A059] fill-[#C5A059]" />
            <span className="font-bold text-[#111111]">{rating}</span>
            <span className="text-[#CCCCCC]">•</span>
            <CheckCircle2 size={12} className="text-[#0284C7]" />
            <span className="text-[#888888]">({reviewsCount})</span>
          </div>

          <h3 className="text-[0.92rem] font-semibold text-[#111111] leading-[1.35] line-clamp-2 min-h-[2.5rem]">
            {cardTitle}
          </h3>

          <div className="flex items-baseline gap-[0.6rem] mt-[0.2rem]">
            <span className="text-[1.05rem] font-extrabold text-[#111111]">₹{displayPrice}</span>
            {displayOriginalPrice && (
              <span className="text-[0.82rem] text-[#999999] line-through">₹{displayOriginalPrice}</span>
            )}
          </div>
        </div>
      </Link>

      <div className="p-[0.8rem] pt-0 pb-[1.1rem] px-[1.1rem]">
        <button
          onClick={handleAddToCart}
          className="w-full h-[42px] bg-[#111111] text-white border-none rounded-md text-[0.78rem] font-bold tracking-[0.08em] flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:bg-[#2D2D2D] hover:-translate-y-[1px]"
        >
          <ShoppingBag size={15} />
          <span>ADD TO CART</span>
        </button>
      </div>
    </div>
  );
}
