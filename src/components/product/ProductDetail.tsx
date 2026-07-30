import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ShieldCheck, ChevronDown, ChevronUp, ShoppingBag, Zap, Truck, RefreshCw, CheckCircle2, ChevronRight } from 'lucide-react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import DealOfTheDay from '@/components/home/DealOfTheDay';
import RelatedProducts from './RelatedProducts';
import { useCart } from '@/context/CartContext';
import { productAPI } from '@/api/services/productAPI';
import { getImageUrl } from '@/utils/imageHelper';
import { getProductSlug, slugify } from '@/utils/slugHelper';
import { IProduct } from '@/types/product';

interface ProductData {
  id: number;
  title: string;
  subtag: string;
  tagline: string;
  price: number;
  originalPrice: number;
  discountBadge: string;
  rating: string;
  reviewsCount: number;
  mainImg: string;
  gallery: string[];
  description?: string;
  categoryName?: string;
}

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImgIndex, setSelectedImgIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  const { addToCart } = useCart();

  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    description: true,
    specifications: false,
    shipping: false
  });

  const toggleAccordion = (sec: string) => {
    setOpenAccordions(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      const strId = String(id).trim();
      const numId = Number(strId);

      const mapAndSetProduct = (backendProd: IProduct) => {
        const numericPrice = typeof backendProd.selling_price === 'number' && backendProd.selling_price > 0
          ? backendProd.selling_price
          : parseFloat(backendProd.price) || 499;
        const originalPriceNum = parseFloat(backendProd.price) || numericPrice * 1.25;
        const discountVal = parseFloat(backendProd.discount) || 0;
        let discountBadge = '';
        if (discountVal > 0 && originalPriceNum > 0) {
          const percent = Math.round((discountVal / originalPriceNum) * 100);
          if (percent > 0) discountBadge = `${percent}% OFF`;
        }

        const images = backendProd.img && backendProd.img.length > 0
          ? backendProd.img.map(i => getImageUrl(i.image, '/hero cards/4.png'))
          : [getImageUrl(backendProd.icon, '/hero cards/4.png')];

        const readableSlug = getProductSlug(backendProd);
        if (readableSlug && readableSlug !== strId && typeof window !== 'undefined') {
          router.replace(`/product/${readableSlug}`, undefined, { shallow: true });
        }

        setProductData({
          id: backendProd.id,
          title: backendProd.alias || backendProd.slug || 'SK Premium Selection',
          subtag: 'OFFICIAL SK SELECTION',
          tagline: backendProd.sdescription || 'Authentic & Premium Quality Book',
          price: numericPrice,
          originalPrice: originalPriceNum,
          discountBadge: discountBadge || 'LIMITED EDITION',
          rating: backendProd.rating ? backendProd.rating.toFixed(1) : '4.9',
          reviewsCount: backendProd.review_count || 64,
          mainImg: images[0],
          gallery: images,
          description: backendProd.description,
          categoryName: (backendProd as any).category_id || backendProd.product_group ? 'Books & Literature' : 'SK Collection'
        });
      };

      if (!isNaN(numId) && String(numId) === strId) {
        productAPI.getProductById(numId)
          .then((backendProd) => {
            if (backendProd && backendProd.id) {
              mapAndSetProduct(backendProd);
            }
          })
          .catch((err) => console.warn('Get single product API error:', err))
          .finally(() => setLoading(false));
      } else {
        productAPI.getProducts()
          .then((allProducts) => {
            if (Array.isArray(allProducts) && allProducts.length > 0) {
              const matched = allProducts.find((p) => {
                const aliasSlug = slugify(p.alias || p.slug);
                return aliasSlug === strId || p.alias === strId || p.slug === strId || String(p.id) === strId;
              });

              if (matched && matched.id) {
                productAPI.getProductById(matched.id)
                  .then((detail) => mapAndSetProduct(detail || matched))
                  .catch(() => mapAndSetProduct(matched));
              } else {
                mapAndSetProduct(allProducts[0]);
              }
            }
          })
          .catch((err) => console.warn('Alias resolution error:', err))
          .finally(() => setLoading(false));
      }
    }
  }, [id]);

  if (loading || !productData) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Head>
          <title>Loading Product | SK Selection</title>
        </Head>
        <Header />
        <main className="flex-1 pt-24 sm:pt-32 pb-20">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
              <div className="h-[300px] md:h-[480px] w-full rounded-xl bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
              <div className="flex flex-col gap-5">
                <div className="h-4 w-1/3 rounded bg-gray-200 animate-pulse" />
                <div className="h-8 w-4/5 rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-3/5 rounded bg-gray-200 animate-pulse" />
                <div className="h-7 w-2/5 rounded bg-gray-200 animate-pulse" />
                <div className="h-14 w-full rounded-xl bg-gray-200 animate-pulse mt-8" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCartClick = () => {
    addToCart({
      id: productData.id,
      title: productData.title,
      price: productData.price,
      originalPrice: productData.originalPrice,
      img: productData.gallery[selectedImgIndex] || productData.mainImg
    }, quantity, true);
  };

  const handleBuyNowClick = () => {
    addToCart({
      id: productData.id,
      title: productData.title,
      price: productData.price,
      originalPrice: productData.originalPrice,
      img: productData.gallery[selectedImgIndex] || productData.mainImg
    }, quantity, false);
    router.push('/checkout');
  };

  return (
    <>
      <Head>
        <title>{productData.title} | SK</title>
        <meta name="description" content={productData.tagline} />
      </Head>

      <div className="w-full min-h-screen bg-white">
        <Header />

        <main className="pt-24 sm:pt-32 pb-20">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
            {/* Breadcrumb Bar */}
            <div className="flex items-center gap-2 text-[0.8rem] text-[#6B7280] mb-8">
              <Link href="/" className="text-[#6B7280] no-underline hover:text-[#121316] transition-colors">Home</Link>
              <ChevronRight size={13} color="#9CA3AF" />
              <Link href="/products" className="text-[#6B7280] no-underline hover:text-[#121316] transition-colors">Catalogue</Link>
              <ChevronRight size={13} color="#9CA3AF" />
              <span className="text-[#121316] font-semibold">{productData.title}</span>
            </div>

            {/* Top Detail Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 mb-20">
              {/* Left Column: Product Image Gallery */}
              <div className="flex flex-col gap-6 relative md:sticky top-0 md:top-[110px] self-start">
                <div className="relative w-full aspect-square md:aspect-[0.92] max-h-[300px] md:max-h-none border border-[#E5E7EB] rounded-xl flex items-center justify-center p-4 md:p-10 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden group">
                  {productData.discountBadge && (
                    <span className="absolute top-4 left-4 bg-[#15803D] text-white text-[0.68rem] font-extrabold px-2.5 py-1 rounded tracking-wider z-10 uppercase">
                      {productData.discountBadge}
                    </span>
                  )}
                  <img
                    src={productData.gallery[selectedImgIndex] || productData.mainImg}
                    alt={productData.title}
                    className="max-w-[90%] max-h-[90%] md:max-h-[250px] lg:max-h-[90%] object-contain transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/hero cards/4.png';
                    }}
                  />
                </div>

                {productData.gallery.length > 1 && (
                  <div className="flex gap-4">
                    {productData.gallery.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImgIndex(idx)}
                        className={`w-14 h-14 md:w-[76px] md:h-[76px] border rounded-lg p-1 bg-white cursor-pointer transition-all duration-200 ${
                          selectedImgIndex === idx ? 'border-[#C5A059] shadow-[0_0_0_2px_rgba(197,160,89,0.3)]' : 'border-[#E5E7EB]'
                        }`}
                      >
                        <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Product Information & Purchase Form */}
              <div className="flex flex-col gap-4.5">
                <span className="text-[0.68rem] lg:text-[0.72rem] font-extrabold text-[#C5A059] tracking-[0.12em] uppercase">{productData.subtag}</span>
                <h1 className="text-[1.45rem] sm:text-[1.5rem] lg:text-[2.2rem] font-extrabold text-[#121316] leading-tight tracking-[0.01em]">{productData.title}</h1>
                <p className="text-[0.82rem] lg:text-[0.95rem] text-[#4B5563] leading-relaxed">{productData.tagline}</p>

                {/* Rating Row */}
                <div className="flex items-center gap-1.5 sm:gap-2.5 text-[0.78rem] lg:text-[0.85rem]">
                  <span className="text-[#F59E0B] font-extrabold">★ {productData.rating}</span>
                  <span className="text-[#E5E7EB]">|</span>
                  <span className="text-[#4B5563] font-medium">{productData.reviewsCount} Verified Reviews</span>
                  <span className="text-[#E5E7EB]">|</span>
                  <span className="inline-flex items-center gap-1 text-[#15803D] font-bold text-[0.8rem]">
                    <CheckCircle2 size={13} color="#15803D" />
                    <span>In Stock</span>
                  </span>
                </div>

                {/* Pricing Block */}
                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex items-baseline gap-3">
                    <span className="text-[1.65rem] sm:text-[1.8rem] lg:text-[2.4rem] font-extrabold text-[#121316]">₹{productData.price * quantity}</span>
                    {productData.originalPrice > productData.price && (
                      <span className="text-[1rem] lg:text-[1.25rem] text-[#9CA3AF] line-through">₹{productData.originalPrice * quantity}</span>
                    )}
                  </div>
                  <span className="text-[0.72rem] lg:text-[0.78rem] text-[#6B7280]">Inclusive of all taxes & free shipping across India</span>
                </div>

                <div className="w-full h-[1px] bg-[#F0F0F0] my-1" />

                {/* Quantity Selector Row */}
                <div className="flex items-center gap-5">
                  <span className="text-[0.8rem] lg:text-[0.88rem] font-bold text-[#121316]">Quantity</span>
                  <div className="flex items-center border border-[#D1D5DB] rounded-lg overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 lg:w-[38px] lg:h-[38px] border-none bg-[#F9FAFB] text-[#121316] text-[0.95rem] lg:text-[1.1rem] font-bold cursor-pointer transition-colors hover:bg-[#E5E7EB] flex items-center justify-center"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-9 lg:w-[44px] text-center font-bold text-[0.85rem] lg:text-[0.95rem] text-[#121316]">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 lg:w-[38px] lg:h-[38px] border-none bg-[#F9FAFB] text-[#121316] text-[0.95rem] lg:text-[1.1rem] font-bold cursor-pointer transition-colors hover:bg-[#E5E7EB] flex items-center justify-center"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className="grid grid-cols-1 sm:grid-cols-[1.2fr_1fr] gap-4 mt-3">
                  <button
                    onClick={handleAddToCartClick}
                    className="bg-[#121316] text-white border border-transparent text-[0.74rem] lg:text-[0.85rem] font-extrabold tracking-[0.06em] py-3 lg:py-3.8 px-4 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center gap-2.5 shadow-[0_4px_14px_rgba(0,0,0,0.12)] hover:border-[#C5A059] hover:shadow-[0_8px_22px_rgba(197,160,89,0.25)] active:scale-98"
                  >
                    <ShoppingBag size={18} />
                    <span>ADD TO CART</span>
                    <span className="opacity-40">|</span>
                    <span>₹{productData.price * quantity}</span>
                  </button>

                  <button
                    onClick={handleBuyNowClick}
                    className="bg-[#C5A059] text-[#111111] border-none text-[0.74rem] lg:text-[0.85rem] font-extrabold tracking-[0.06em] py-3 lg:py-3.8 px-4 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(197,160,89,0.3)] hover:bg-[#111111] hover:text-white hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(0,0,0,0.25)] active:scale-98"
                  >
                    <Zap size={18} />
                    <span>BUY NOW</span>
                  </button>
                </div>

                {/* Trust Guarantee Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 lg:gap-3 mt-4 p-3 lg:p-4 bg-[#FAF8F5] border border-[#F0EDE8] rounded-xl">
                  <div className="flex items-center gap-1.5 lg:gap-2 text-[0.66rem] lg:text-[0.75rem] font-bold text-[#121316]">
                    <Truck size={18} color="#C5A059" />
                    <span>Free Express Shipping</span>
                  </div>
                  <div className="flex items-center gap-1.5 lg:gap-2 text-[0.66rem] lg:text-[0.75rem] font-bold text-[#121316]">
                    <ShieldCheck size={18} color="#C5A059" />
                    <span>100% Authentic Product</span>
                  </div>
                  <div className="flex items-center gap-1.5 lg:gap-2 text-[0.66rem] lg:text-[0.75rem] font-bold text-[#121316]">
                    <RefreshCw size={18} color="#C5A059" />
                    <span>Easy 7-Day Replacement</span>
                  </div>
                </div>

                {/* Accordions Block */}
                <div className="flex flex-col border-t border-[#E5E7EB] mt-6">
                  <div className="border-b border-[#E5E7EB]">
                    <button onClick={() => toggleAccordion('description')} className="w-full flex items-center justify-between py-3.5 lg:py-4 bg-none border-none text-[0.8rem] lg:text-[0.88rem] font-extrabold tracking-[0.05em] text-[#121316] cursor-pointer">
                      <span>PRODUCT DESCRIPTION</span>
                      {openAccordions.description ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {openAccordions.description && (
                      <div className="pb-4 text-[0.82rem] lg:text-[0.9rem] text-[#4B5563] leading-relaxed">
                        <p>{productData.description || 'Malabar Veerasmruthikal is an authentic, inspiring historical book highlighting courage, legacy, and timeless stories of freedom fighters. Published with high quality archival paper and durable binding for avid readers and collectors alike.'}</p>
                      </div>
                    )}
                  </div>

                  <div className="border-b border-[#E5E7EB]">
                    <button onClick={() => toggleAccordion('specifications')} className="w-full flex items-center justify-between py-3.5 lg:py-4 bg-none border-none text-[0.8rem] lg:text-[0.88rem] font-extrabold tracking-[0.05em] text-[#121316] cursor-pointer">
                      <span>SPECIFICATIONS & DETAILS</span>
                      {openAccordions.specifications ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {openAccordions.specifications && (
                      <div className="pb-4 text-[0.82rem] lg:text-[0.9rem] text-[#4B5563] leading-relaxed">
                        <ul className="list-none p-0 m-0 flex flex-col gap-2">
                          <li className="text-[0.88rem] text-[#4B5563]"><strong>Language:</strong> Malayalam</li>
                          <li className="text-[0.88rem] text-[#4B5563]"><strong>Binding:</strong> Premium Paperback</li>
                          <li className="text-[0.88rem] text-[#4B5563]"><strong>Publisher:</strong> SK Publications</li>
                          <li className="text-[0.88rem] text-[#4B5563]"><strong>Quality:</strong> 100% Guaranteed Official Edition</li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="border-b border-[#E5E7EB]">
                    <button onClick={() => toggleAccordion('shipping')} className="w-full flex items-center justify-between py-3.5 lg:py-4 bg-none border-none text-[0.8rem] lg:text-[0.88rem] font-extrabold tracking-[0.05em] text-[#121316] cursor-pointer">
                      <span>SHIPPING & RETURNS</span>
                      {openAccordions.shipping ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {openAccordions.shipping && (
                      <div className="pb-4 text-[0.82rem] lg:text-[0.9rem] text-[#4B5563] leading-relaxed">
                        <p>Orders are dispatched within 24 hours via express air courier. Delivered within 3-5 business days across India. 7-day hassle-free replacement promise for damaged or incorrect deliveries.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Deal of the Day Section */}
            <DealOfTheDay />

            {/* Related Items Section */}
            <RelatedProducts productId={productData.id} />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
