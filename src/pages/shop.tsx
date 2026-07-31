import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SlidersHorizontal, ArrowUpDown, Search, X } from 'lucide-react';
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

  // Search & Cost Filtering States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [minPriceInput, setMinPriceInput] = useState<string>('');
  const [maxPriceInput, setMaxPriceInput] = useState<string>('');
  const [pricePreset, setPricePreset] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [apiFilteredProductIds, setApiFilteredProductIds] = useState<Set<number> | null>(null);

  // Sync search from router query
  useEffect(() => {
    if (search && typeof search === 'string' && search.trim()) {
      setSearchQuery(search.trim());
    }
  }, [search]);

  // Sync category from URL query when Next router updates query parameters
  useEffect(() => {
    const targetCategory = category || filter;
    if (targetCategory && typeof targetCategory === 'string') {
      const cleanSlug = targetCategory.toLowerCase().trim();
      if (cleanSlug !== activeCategorySlug) {
        setActiveCategorySlug(cleanSlug);
      }
    }
  }, [category, filter]);

  // Fetch API Product Filter when searchQuery changes (Product/product/filter?query=...)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setApiFilteredProductIds(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await productAPI.filterProducts(searchQuery.trim());
        if (Array.isArray(res) && res.length > 0) {
          const ids = new Set<number>();
          res.forEach((item: any) => {
            if (typeof item.product === 'number') ids.add(item.product);
            if (typeof item.id === 'number') ids.add(item.id);
          });
          setApiFilteredProductIds(ids);
        } else {
          setApiFilteredProductIds(null);
        }
      } catch (e) {
        console.warn('Error fetching Product/product/filter results:', e);
        setApiFilteredProductIds(null);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Categories AND Products
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
          if (selectedCat && selectedCat.numId) {
            prods = await productAPI.getCategoryProducts(selectedCat.numId);
            if (!Array.isArray(prods) || prods.length === 0) {
              prods = await productAPI.getProducts({ category_id: String(selectedCat.numId) });
            }
          }

          if (!Array.isArray(prods) || prods.length === 0) {
            prods = await productAPI.getProducts({ category: activeCategorySlug });
          }

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

  // Compute final filtered & sorted products by Cost/Price & Search
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // 1. Search Query & API Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        if (apiFilteredProductIds && apiFilteredProductIds.has(p.id)) return true;
        return p.title.toLowerCase().includes(q) || p.category.includes(q);
      });
    }

    // 2. Cost / Price Filtering
    let minP = minPriceInput ? parseFloat(minPriceInput) : null;
    let maxP = maxPriceInput ? parseFloat(maxPriceInput) : null;

    if (pricePreset === 'under-500') {
      maxP = 500;
    } else if (pricePreset === '500-1000') {
      minP = 500;
      maxP = 1000;
    } else if (pricePreset === '1000-2500') {
      minP = 1000;
      maxP = 2500;
    } else if (pricePreset === 'above-2500') {
      minP = 2500;
    }

    if (minP !== null && !isNaN(minP)) {
      list = list.filter((p) => p.price >= minP!);
    }
    if (maxP !== null && !isNaN(maxP)) {
      list = list.filter((p) => p.price <= maxP!);
    }

    // 3. Price Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, searchQuery, apiFilteredProductIds, pricePreset, minPriceInput, maxPriceInput, sortBy]);

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

            {/* Filter Control Box */}
            <div className="bg-white rounded-2xl border border-[#EAEAEA] p-5 mb-10 shadow-sm">
              {/* Category Pills Header */}
              <div className="mb-5">
                <span className="text-[0.72rem] font-bold text-[#666666] uppercase tracking-wider block mb-2.5">
                  Categories
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-wrap">
                  {categories.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleCategorySelect(tab)}
                      className={`px-4 py-2 rounded-full text-[0.75rem] font-bold tracking-wider cursor-pointer transition-all duration-200 border shrink-0 ${
                        activeCategorySlug === tab.slug || activeCategorySlug === tab.id
                          ? 'bg-[#111111] text-white border-[#111111] shadow-sm'
                          : 'bg-white text-[#666666] border-[#EAEAEA] hover:border-[#111111] hover:text-[#111111]'
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cost Filter & Sorting Controls */}
              <div className="pt-4 border-t border-[#EAEAEA] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Cost Range Presets */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[0.75rem] font-bold text-[#111111] flex items-center gap-1 mr-1">
                    <SlidersHorizontal size={14} className="text-[#C39F68]" />
                    Filter by Cost:
                  </span>
                  {[
                    { id: 'all', label: 'All Prices' },
                    { id: 'under-500', label: 'Under ₹500' },
                    { id: '500-1000', label: '₹500 - ₹1,000' },
                    { id: '1000-2500', label: '₹1,000 - ₹2,500' },
                    { id: 'above-2500', label: 'Above ₹2,500' }
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setPricePreset(preset.id);
                        if (preset.id !== 'custom') {
                          setMinPriceInput('');
                          setMaxPriceInput('');
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[0.72rem] font-semibold transition-all border ${
                        pricePreset === preset.id
                          ? 'bg-[#C39F68] text-white border-[#C39F68]'
                          : 'bg-[#FAF8F5] text-[#4B5563] border-transparent hover:border-[#C39F68]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}

                  {/* Custom Min / Max Price Inputs */}
                  <div className="flex items-center gap-1.5 ml-1">
                    <input
                      type="number"
                      placeholder="Min ₹"
                      value={minPriceInput}
                      onChange={(e) => {
                        setMinPriceInput(e.target.value);
                        setPricePreset('custom');
                      }}
                      className="w-20 px-2.5 py-1 text-[0.75rem] rounded-lg border border-gray-200 focus:outline-none focus:border-[#C39F68]"
                    />
                    <span className="text-gray-400 text-xs">-</span>
                    <input
                      type="number"
                      placeholder="Max ₹"
                      value={maxPriceInput}
                      onChange={(e) => {
                        setMaxPriceInput(e.target.value);
                        setPricePreset('custom');
                      }}
                      className="w-20 px-2.5 py-1 text-[0.75rem] rounded-lg border border-gray-200 focus:outline-none focus:border-[#C39F68]"
                    />
                  </div>
                </div>

                {/* Search & Sort Controls */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* Search Input using Product/product/filter */}
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search name / batch..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-7 py-1.5 text-[0.75rem] rounded-lg border border-gray-200 w-44 focus:outline-none focus:border-[#C39F68]"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  {/* Cost Sorting Dropdown */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="appearance-none bg-[#FAF8F5] border border-gray-200 text-[#111111] text-[0.75rem] font-bold py-1.5 pl-3 pr-8 rounded-lg cursor-pointer focus:outline-none focus:border-[#C39F68]"
                    >
                      <option value="default">Sort: Default</option>
                      <option value="price-asc">Cost: Low to High</option>
                      <option value="price-desc">Cost: High to Low</option>
                    </select>
                    <ArrowUpDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>
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
                <p className="text-gray-500 font-medium text-sm">No products found matching your cost or filter criteria.</p>
                {(pricePreset !== 'all' || minPriceInput || maxPriceInput || searchQuery) && (
                  <button
                    type="button"
                    onClick={() => {
                      setPricePreset('all');
                      setMinPriceInput('');
                      setMaxPriceInput('');
                      setSearchQuery('');
                      setSortBy('default');
                    }}
                    className="mt-3 inline-block px-4 py-2 text-xs font-bold text-white bg-[#111111] rounded-full hover:bg-[#C39F68] transition-colors"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
