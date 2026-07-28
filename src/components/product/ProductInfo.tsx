import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Star, ShoppingCart, Check, Heart, Scale } from 'lucide-react';
import { IProduct } from '@/types/product';
import { useCart } from '@/context/CartContext';

interface ProductInfoProps {
  product: IProduct;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [batterySize, setBatterySize] = useState('4.0 Ah (Recommended)');
  const [kitType, setKitType] = useState('Complete Kit');
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Math
  const price = parseFloat(product.price);
  const discount = parseFloat(product.discount || '0');
  const hasDiscount = discount > 0;
  const originalPrice = price;
  const salePrice = price - discount;
  const discountPercentage = hasDiscount ? Math.round((discount / originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    setAddingToCart(true);
    addToCart({
      id: product.id,
      title: product.alias,
      price: salePrice,
      img: product.icon || (product.img && product.img.length > 0 ? product.img[0].image : '/hero cards/1.png'),
    }, quantity, true);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
    setAddingToCart(false);
  };

  const handleBuyNow = () => {
    addToCart({
      id: product.id,
      title: product.alias,
      price: salePrice,
      img: product.icon || (product.img && product.img.length > 0 ? product.img[0].image : '/hero cards/1.png'),
    }, quantity, false);
    router.push('/checkout');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumbs */}
      <div className="text-[0.85rem] text-[#6B7280] flex gap-1.5 items-center">
        <span>Home</span> &gt; <span>Shop</span> &gt; <span>Power Tools</span> &gt; <span className="text-[#121316] font-medium">{product.alias}</span>
      </div>

      {/* Title & Tagline */}
      <div>
        <h1 className="text-[2.2rem] font-extrabold text-[#121316] leading-tight mb-2">{product.alias}</h1>
        <p className="text-[1.1rem] text-[#6B7280] leading-relaxed">{product.sdescription}</p>
      </div>

      {/* Ratings & Stock Availability */}
      <div className="flex items-center justify-between border-b border-[#EAE5DC] pb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex text-[#C39F68]">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < Math.floor(product.rating || 4.5) ? 'currentColor' : 'none'}
                className="text-[#C39F68]"
              />
            ))}
          </div>
          <span className="text-[0.85rem] text-[#6B7280] font-medium">({product.review_count || 128} Customer Reviews)</span>
        </div>
        <span className="bg-[#15803D]/10 text-[#15803D] font-semibold text-[0.75rem] px-2.5 py-1 rounded uppercase tracking-wider">In Stock</span>
      </div>

      {/* Pricing Showcase */}
      <div className="flex items-center gap-4 my-1">
        {hasDiscount ? (
          <>
            <span className="text-[2rem] font-extrabold text-[#121316]">₹{salePrice.toFixed(2)}</span>
            <span className="text-[1.2rem] text-[#6B7280] line-through">₹{originalPrice.toFixed(2)}</span>
            <span className="bg-[#C39F68] text-white font-bold text-[0.75rem] px-2.5 py-1 rounded">-{discountPercentage}% OFF</span>
          </>
        ) : (
          <span className="text-[2rem] font-extrabold text-[#121316]">₹{originalPrice.toFixed(2)}</span>
        )}
      </div>

      {/* Highlights / Specs bullets */}
      <div className="bg-[#FAF7F2]/60 rounded-md p-6 border border-[#EAE5DC]">
        <h3 className="text-[1rem] font-bold mb-3 text-[#121316]">Key Features</h3>
        <ul className="list-none space-y-2.5 p-0 m-0">
          <li className="relative pl-6 text-[0.9rem] text-[#6B7280] before:content-['✓'] before:absolute before:left-0 before:text-[#C39F68] before:font-bold">Brushless motor delivers up to 50% more runtime and lifespan</li>
          <li className="relative pl-6 text-[0.9rem] text-[#6B7280] before:content-['✓'] before:absolute before:left-0 before:text-[#C39F68] before:font-bold">Heavy-duty 2-speed metal transmission for superior durability</li>
          <li className="relative pl-6 text-[0.9rem] text-[#6B7280] before:content-['✓'] before:absolute before:left-0 before:text-[#C39F68] before:font-bold">Compact design fits into tight spaces with ergonomic grip</li>
          <li className="relative pl-6 text-[0.9rem] text-[#6B7280] before:content-['✓'] before:absolute before:left-0 before:text-[#C39F68] before:font-bold">Integrated LED worklight illuminates dark workspaces</li>
        </ul>
      </div>

      {/* Custom Variant Options */}
      <div className="flex flex-col gap-5 border-y border-[#EAE5DC] py-6">
        {/* Battery Selection */}
        <div className="flex flex-col gap-2.5">
          <label className="text-[0.85rem] font-bold uppercase text-[#6B7280] tracking-wider">Battery Capacity</label>
          <div className="flex gap-3 flex-wrap">
            {['2.0 Ah', '4.0 Ah (Recommended)', '5.0 Ah'].map((size) => (
              <button
                key={size}
                onClick={() => setBatterySize(size)}
                className={`px-5 py-2.5 rounded-md border text-[0.85rem] font-semibold cursor-pointer transition-all duration-300 ${
                  batterySize === size
                    ? 'bg-[#121316] text-white border-[#121316]'
                    : 'border-[#EAE5DC] bg-white text-[#121316] hover:border-gray-400 hover:bg-[#FAF7F2]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Kit Selection */}
        <div className="flex flex-col gap-2.5">
          <label className="text-[0.85rem] font-bold uppercase text-[#6B7280] tracking-wider">Charger & Case Options</label>
          <div className="flex gap-3 flex-wrap">
            {['Tool Only', 'Tool + Case', 'Complete Kit'].map((type) => (
              <button
                key={type}
                onClick={() => setKitType(type)}
                className={`px-5 py-2.5 rounded-md border text-[0.85rem] font-semibold cursor-pointer transition-all duration-300 ${
                  kitType === type
                    ? 'bg-[#121316] text-white border-[#121316]'
                    : 'border-[#EAE5DC] bg-white text-[#121316] hover:border-gray-400 hover:bg-[#FAF7F2]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quantity & Actions Bar */}
      <div className="flex gap-4 items-center flex-wrap">
        <div className="flex items-center border border-[#EAE5DC] rounded-md bg-[#FAF7F2] h-12 overflow-hidden">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full border-none bg-none text-[1.2rem] font-semibold cursor-pointer hover:bg-gray-200 transition-colors">-</button>
          <span className="px-4 font-bold text-[0.95rem] text-[#121316]">{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-full border-none bg-none text-[1.2rem] font-semibold cursor-pointer hover:bg-gray-200 transition-colors">+</button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={addingToCart}
          className={`flex-1 h-12 rounded-md font-bold text-[0.95rem] cursor-pointer flex items-center justify-center gap-2 border-none min-w-[140px] transition-all duration-300 ${
            addedSuccess ? 'bg-[#15803D] text-white' : 'bg-[#121316] text-white hover:bg-[#121316]/85'
          }`}
        >
          {addedSuccess ? (
            <><Check size={18} /> Added to Cart</>
          ) : (
            <><ShoppingCart size={18} /> Add to Cart</>
          )}
        </button>

        <button onClick={handleBuyNow} className="flex-1 h-12 rounded-md font-bold text-[0.95rem] cursor-pointer flex items-center justify-center gap-2 border-none min-w-[140px] bg-[#C39F68] text-white hover:bg-[#B08D46] transition-all duration-300">
          Buy Now
        </button>
      </div>

      {/* Auxiliary actions: wishlist and compare */}
      <div className="flex gap-6 mt-2">
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`flex items-center gap-1.5 bg-none border-none text-[0.85rem] font-semibold cursor-pointer transition-colors ${
            isWishlisted ? 'text-[#FF2E93]' : 'text-[#6B7280] hover:text-[#C39F68]'
          }`}
        >
          <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
          {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
        </button>
        <button className="flex items-center gap-1.5 bg-none border-none text-[0.85rem] font-semibold text-[#6B7280] hover:text-[#C39F68] cursor-pointer transition-colors">
          <Scale size={16} /> Add to Compare
        </button>
      </div>

      {/* Meta specifications */}
      <div className="border-t border-[#EAE5DC] pt-6 flex flex-col gap-2.5">
        <div className="flex text-[0.85rem] gap-2">
          <span className="font-bold text-[#121316]">SKU:</span>
          <span className="text-[#6B7280]">SK-PD-18V-BRUSHLESS</span>
        </div>
        <div className="flex text-[0.85rem] gap-2">
          <span className="font-bold text-[#121316]">Categories:</span>
          <span className="text-[#6B7280]">Power Tools, Cordless Drills</span>
        </div>
        <div className="flex text-[0.85rem] gap-2">
          <span className="font-bold text-[#121316]">Tags:</span>
          <span className="text-[#6B7280]">Brushless, Cordless, Heavy Duty</span>
        </div>
      </div>
    </div>
  );
}
