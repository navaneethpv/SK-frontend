import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ProductCard from '@/components/product/ProductCard';
import { productAPI } from '@/api/services/productAPI';
import { IProduct } from '@/types/product';
import { getImageUrl } from '@/utils/imageHelper';
import { getProductSlug, formatProductTitle } from '@/utils/slugHelper';

interface ShopProduct {
  id: number;
  title: string;
  slug?: string;
  category: string;
  groupId?: number;
  price: number;
  originalPrice?: number;
  rating: string;
  reviewsCount: number;
  badgeText?: string;
  badgeType?: 'green' | 'gold' | 'none';
  img: string;
}

interface CategoryFilterItem {
  id: string;
  name: string;
  slug: string;
  numId?: number;
}

function mapProductToShopItem(prod: IProduct, fallbackImg: string = '/hero cards/4.png'): ShopProduct {
  const numericPrice = typeof prod.selling_price === 'number' && prod.selling_price > 0
    ? prod.selling_price
    : parseFloat(prod.price) || 499;
  const originalPriceNum = parseFloat(prod.price) || 0;
  const discountVal = parseFloat(prod.discount) || 0;

  let discountBadge = '';
  if (discountVal > 0 && originalPriceNum > 0) {
    const percent = Math.round((discountVal / originalPriceNum) * 100);
    if (percent > 0) discountBadge = `${percent}% OFF`;
  }

  const rawImg = prod.icon || (prod.img && prod.img[0]?.image);

  return {
    id: prod.id,
    title: formatProductTitle(prod.alias || prod.slug || 'SK Product'),
    slug: getProductSlug(prod),
    category: (typeof prod.product_group === 'object' && prod.product_group ? ((prod.product_group as any).slug || (prod.product_group as any).alias || 'all') : 'all').toLowerCase(),
    groupId: typeof prod.product_group === 'number' ? prod.product_group : undefined,
    price: numericPrice,
    originalPrice: originalPriceNum > numericPrice ? originalPriceNum : undefined,
    rating: prod.rating ? prod.rating.toFixed(1) : '4.8',
    reviewsCount: prod.review_count || 45,
    badgeText: discountBadge || (prod.is_active ? 'Best Seller' : undefined),
    badgeType: discountBadge ? 'green' : 'gold',
    img: getImageUrl(rawImg, fallbackImg)
  };
}

export default function ShopPage() {
  const router = useRouter();
  const { category, filter, search } = router.query;

  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [categories, setCategories] = useState<CategoryFilterItem[]>([
    { id: 'all', name: 'ALL PRODUCTS', slug: 'all' }
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>('all');

  useEffect(() => {
    // 1. Fetch categories from backend API: GET /Home/categories [{id: 1, name: "Wallets"}, ...]
    productAPI.getCategories()
      .then((data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: CategoryFilterItem[] = data.map((cat: any, idx: number) => {
            const computedSlug = cat.slug || (cat.name ? cat.name.toLowerCase().trim().replace(/\s+/g, '-') : `cat-${cat.id || idx}`);
            return {
              id: computedSlug,
              name: (cat.name || `Category ${idx + 1}`).toUpperCase(),
              slug: computedSlug,
              numId: cat.id
            };
          });
          setCategories([{ id: 'all', name: 'ALL PRODUCTS', slug: 'all' }, ...mapped]);
        }
      })
      .catch((err) => {
        console.warn('Failed to load categories for shop page:', err);
      });

    // 2. Fetch products
    productAPI.getProducts()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((prod: IProduct, idx: number) =>
            mapProductToShopItem(prod, `/hero cards/${(idx % 6) + 1}.png`)
          );
          setProducts(mapped);
        }
      })
      .catch((err) => {
        console.warn('Failed to load shop products:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Sync route query params with active filter tab
  useEffect(() => {
    if (category && typeof category === 'string') {
      setActiveCategorySlug(category.toLowerCase().trim());
    } else if (filter && typeof filter === 'string') {
      setActiveCategorySlug(filter.toLowerCase().trim());
    } else {
      setActiveCategorySlug('all');
    }
  }, [category, filter]);

  const handleCategorySelect = (tab: CategoryFilterItem) => {
    setActiveCategorySlug(tab.slug);
    if (tab.slug === 'all') {
      router.push('/shop', undefined, { shallow: true });
    } else {
      router.push(`/shop?category=${encodeURIComponent(tab.slug)}`, undefined, { shallow: true });
    }
  };

  const selectedCatObj = categories.find(c => c.slug === activeCategorySlug || c.id === activeCategorySlug);

  const filteredProducts = products.filter((product) => {
    // Search Query Filter
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      if (!product.title.toLowerCase().includes(q)) return false;
    }

    // Category Filter by Slug & ID & Name Keyword
    if (activeCategorySlug !== 'all') {
      const cleanSlug = activeCategorySlug.toLowerCase().replace(/-/g, ' ').replace(/s$/, '').trim();
      const titleLower = product.title.toLowerCase();
      const catLower = (product.category || '').toLowerCase();

      const matchesGroupId = selectedCatObj?.numId && product.groupId === selectedCatObj.numId;
      const matchesCategorySlug = catLower.includes(cleanSlug);
      const matchesTitleKeyword = titleLower.includes(cleanSlug);

      if (!matchesGroupId && !matchesCategorySlug && !matchesTitleKeyword) {
        return false;
      }
    }

    return true;
  });

  return (
    <>
      <Head>
        <title>
          {activeCategorySlug !== 'all'
            ? `${activeCategorySlug.toUpperCase().replace(/-/g, ' ')} Collection | SK`
            : 'Shop Luxury Collection | SK'}
        </title>
        <meta name="description" content="Explore SK luxury fragrances, hair care oils, leather accessories, and body care products." />
      </Head>

      <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
        <Header />

        <main className="flex-1 pt-28 pb-20">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-8">
            {/* Header Title */}
            <div className="text-center mb-10">
              <span className="text-[0.72rem] font-bold tracking-[0.14em] text-[#C39F68] block mb-1.5 uppercase">CATALOGUE</span>
              <h1 className="text-[2.2rem] font-extrabold text-[#111111] tracking-wide mb-2">
                {activeCategorySlug !== 'all'
                  ? `${activeCategorySlug.replace(/-/g, ' ').toUpperCase()} COLLECTION`
                  : 'CURATED CATALOGUE'}
              </h1>
              <p className="text-[0.95rem] text-[#666666]">Discover premium lifestyle, fragrance, and organic grooming essentials.</p>
            </div>

            {/* Dynamic Filter Tabs */}
            <div className="flex items-center justify-center gap-2.5 mb-12 flex-wrap">
              {categories.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleCategorySelect(tab)}
                  className={`px-5 py-2.5 rounded-full text-[0.75rem] font-bold tracking-wider cursor-pointer transition-all duration-200 border ${
                    activeCategorySlug === tab.slug || activeCategorySlug === tab.id
                      ? 'bg-[#111111] text-white border-[#111111] shadow-sm'
                      : 'bg-white text-[#666666] border-[#EAEAEA] hover:border-[#111111] hover:text-[#111111]'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="text-center py-20 text-[#6B7280]">
                <div className="w-10 h-10 border-3 border-[#E5E7EB] border-t-[#111111] rounded-full animate-spin mx-auto mb-4" />
                <p>Loading shop collection...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.title}
                    img={product.img}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    rating={product.rating}
                    reviewsCount={product.reviewsCount}
                    badgeText={product.badgeText}
                    badgeType={product.badgeType}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <p className="text-gray-500 font-medium text-sm">No products found for this category filter.</p>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
