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

function getInitialCategorySlug(): string {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category') || params.get('filter');
    if (cat && cat.trim()) return cat.toLowerCase().trim();
  }
  return 'all';
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

  const groupNum = typeof prod.product_group === 'number'
    ? prod.product_group
    : (prod.product_group as any)?.id || (prod as any).group_under || (prod as any).category;

  return {
    id: prod.id,
    title: formatProductTitle(prod.alias || prod.slug || 'SK Product'),
    slug: getProductSlug(prod),
    category: (typeof prod.product_group === 'object' && prod.product_group ? ((prod.product_group as any).slug || (prod.product_group as any).alias || 'all') : 'all').toLowerCase(),
    groupId: typeof groupNum === 'number' ? groupNum : undefined,
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
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>(getInitialCategorySlug);

  // 1. Sync category from URL query when Next router updates query parameters
  useEffect(() => {
    const targetCategory = category || filter;
    if (targetCategory && typeof targetCategory === 'string') {
      const cleanSlug = targetCategory.toLowerCase().trim();
      if (cleanSlug !== activeCategorySlug) {
        setActiveCategorySlug(cleanSlug);
      }
    }
  }, [category, filter]);

  // 2. Fetch Categories AND Products in a single atomic flow to eliminate flickering
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      try {
        // A. Load Categories List
        let catList = categories;
        if (catList.length <= 1) {
          const rawCats = await productAPI.getCategories();
          if (Array.isArray(rawCats) && rawCats.length > 0) {
            const mapped: CategoryFilterItem[] = rawCats.map((cat: any, idx: number) => {
              const computedSlug = cat.slug || (cat.name ? cat.name.toLowerCase().trim().replace(/\s+/g, '-') : `cat-${cat.id || idx}`);
              return {
                id: computedSlug,
                name: (cat.name || `Category ${idx + 1}`).toUpperCase(),
                slug: computedSlug,
                numId: cat.id
              };
            });
            catList = [{ id: 'all', name: 'ALL PRODUCTS', slug: 'all' }, ...mapped];
            if (isMounted) setCategories(catList);
          }
        }

        // B. Find Selected Category Object
        const selectedCat = catList.find(c => c.slug === activeCategorySlug || c.id === activeCategorySlug);

        // C. Fetch Target Category Products
        let prods: IProduct[] = [];
        if (activeCategorySlug === 'all') {
          prods = await productAPI.getProducts();
        } else {
          // Priority 1: Exact category products by ID
          if (selectedCat && selectedCat.numId) {
            prods = await productAPI.getCategoryProducts(selectedCat.numId);
            if (!Array.isArray(prods) || prods.length === 0) {
              prods = await productAPI.getProducts({ category_id: String(selectedCat.numId) });
            }
          }

          // Priority 2: Query by category slug
          if (!Array.isArray(prods) || prods.length === 0) {
            prods = await productAPI.getProducts({ category: activeCategorySlug });
          }

          // Priority 3: Fallback client-side filter
          if (!Array.isArray(prods) || prods.length === 0) {
            const allProds = await productAPI.getProducts();
            if (Array.isArray(allProds) && allProds.length > 0) {
              const cleanSlug = activeCategorySlug.toLowerCase().replace(/-/g, ' ').replace(/s$/, '').trim();
              prods = allProds.filter((p: any) => {
                const pGroup = typeof p.product_group === 'number'
                  ? p.product_group
                  : (p.product_group as any)?.id || p.group_under || p.category;

                if (selectedCat?.numId && pGroup === selectedCat.numId) return true;

                const titleLower = (p.alias || p.slug || '').toLowerCase();
                const catLower = (p.category || '').toString().toLowerCase();

                return titleLower.includes(cleanSlug) || catLower.includes(cleanSlug);
              });
            }
          }
        }

        if (isMounted) {
          if (Array.isArray(prods)) {
            const mapped = prods.map((prod: IProduct, idx: number) =>
              mapProductToShopItem(prod, `/hero cards/${(idx % 6) + 1}.png`)
            );
            setProducts(mapped);
          } else {
            setProducts([]);
          }
        }
      } catch (err) {
        console.warn('Error loading shop category data:', err);
        if (isMounted) setProducts([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [activeCategorySlug]);

  const handleCategorySelect = (tab: CategoryFilterItem) => {
    if (activeCategorySlug === tab.slug) return;
    setActiveCategorySlug(tab.slug);
    if (tab.slug === 'all') {
      router.push('/shop', undefined, { shallow: true });
    } else {
      router.push(`/shop?category=${encodeURIComponent(tab.slug)}`, undefined, { shallow: true });
    }
  };

  const filteredProducts = products.filter((product) => {
    // Search Query Filter
    if (search && typeof search === 'string' && search.trim()) {
      const q = search.toLowerCase().trim();
      if (!product.title.toLowerCase().includes(q)) return false;
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
              <div className="text-center py-16 bg-[#FAF8F5] rounded-2xl border border-gray-200">
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
