import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SlidersHorizontal, Filter, ArrowUpDown, Search, X, Check } from 'lucide-react';
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

  // Mobile Filter Drawer Toggle
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

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

  const resetAllFilters = () => {
    setPricePreset('all');
    setMinPriceInput('');
    setMaxPriceInput('');
    setSearchQuery('');
    setSortBy('default');
    if (activeCategorySlug !== 'all') {
      setActiveCategorySlug('all');
      router.push('/shop', undefined, { shallow: true });
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

  // Render Filter Controls (Shared between Desktop Sidebar and Mobile Drawer)
  const renderFilterControls = () => (
    <div className="flex flex-col gap-6">
      {/* Search Input */}
      <div>
        <label className="text-[0.72rem] font-bold text-[#666666] uppercase tracking-wider block mb-2">
          Search Catalogue
        </label>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search name / batch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-7 py-2 text-[0.78rem] rounded-xl border border-gray-200 focus:outline-none focus:border-[#C39F68] bg-[#FAF8F5]"
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
      </div>

      {/* Categories List */}
      <div>
        <span className="text-[0.72rem] font-bold text-[#666666] uppercase tracking-wider block mb-2.5">
          Categories
        </span>
        <div className="flex flex-col gap-1.5 max-h-[240px] overflow-y-auto pr-1">
          {categories.map((tab) => {
            const isSelected = activeCategorySlug === tab.slug || activeCategorySlug === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleCategorySelect(tab)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[0.78rem] font-semibold text-left transition-all ${
                  isSelected
                    ? 'bg-[#111111] text-white font-bold'
                    : 'bg-white text-[#4B5563] hover:bg-[#FAF8F5] hover:text-[#111111]'
                }`}
              >
                <span className="truncate">{tab.name}</span>
                {isSelected && <Check size={14} className="text-[#C39F68] shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cost Filter Range Presets */}
      <div>
        <span className="text-[0.72rem] font-bold text-[#666666] uppercase tracking-wider block mb-2.5 flex items-center gap-1">
          <SlidersHorizontal size={13} className="text-[#C39F68]" />
          Filter by Cost
        </span>
        <div className="flex flex-col gap-1.5">
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
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[0.75rem] font-semibold text-left transition-all border ${
                pricePreset === preset.id
                  ? 'bg-[#C39F68] text-white border-[#C39F68]'
                  : 'bg-[#FAF8F5] text-[#4B5563] border-transparent hover:border-[#C39F68]'
              }`}
            >
              <span>{preset.label}</span>
              {pricePreset === preset.id && <Check size={14} className="shrink-0 ml-2" />}
            </button>
          ))}
        </div>

        {/* Custom Min / Max Price Inputs */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="text-[0.7rem] font-bold text-[#666666] block mb-2">Custom Cost Range</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min ₹"
              value={minPriceInput}
              onChange={(e) => {
                setMinPriceInput(e.target.value);
                setPricePreset('custom');
              }}
              className="w-full px-3 py-1.5 text-[0.75rem] rounded-xl border border-gray-200 focus:outline-none focus:border-[#C39F68] bg-[#FAF8F5]"
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
              className="w-full px-3 py-1.5 text-[0.75rem] rounded-xl border border-gray-200 focus:outline-none focus:border-[#C39F68] bg-[#FAF8F5]"
            />
          </div>
        </div>
      </div>

      {/* Sort Dropdown */}
      <div>
        <label className="text-[0.72rem] font-bold text-[#666666] uppercase tracking-wider block mb-2">
          Sort By Price
        </label>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full appearance-none bg-[#FAF8F5] border border-gray-200 text-[#111111] text-[0.78rem] font-bold py-2 pl-3 pr-8 rounded-xl cursor-pointer focus:outline-none focus:border-[#C39F68]"
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Cost: Low to High</option>
            <option value="price-desc">Cost: High to Low</option>
          </select>
          <ArrowUpDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Reset All Filters Button */}
      {(pricePreset !== 'all' || minPriceInput || maxPriceInput || searchQuery || sortBy !== 'default' || activeCategorySlug !== 'all') && (
        <button
          type="button"
          onClick={resetAllFilters}
          className="w-full py-2 text-xs font-bold text-[#C39F68] bg-[#FAF8F5] border border-[#EAEAEA] rounded-xl hover:bg-[#111111] hover:text-white transition-colors mt-1"
        >
          Reset All Filters
        </button>
      )}
    </div>
  );

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
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Title */}
            <div className="text-center mb-8 sm:mb-10">
              <span className="text-[0.72rem] font-bold tracking-[0.14em] text-[#C39F68] block mb-1.5 uppercase">CATALOGUE</span>
              <h1 className="text-[1.8rem] sm:text-[2.2rem] font-extrabold text-[#111111] tracking-wide mb-2">
                {activeCategorySlug !== 'all'
                  ? `${activeCategorySlug.replace(/-/g, ' ').toUpperCase()} COLLECTION`
                  : 'CURATED CATALOGUE'}
              </h1>
              <p className="text-[0.85rem] sm:text-[0.95rem] text-[#666666]">Discover premium lifestyle, fragrance, and organic grooming essentials.</p>

              {/* Active Filter Pill Badges below heading */}
              {(activeCategorySlug !== 'all' || pricePreset !== 'all' || minPriceInput || maxPriceInput || searchQuery.trim()) && (
                <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">
                  {/* Category Filter Pill */}
                  {activeCategorySlug !== 'all' && (
                    <span className="inline-flex items-center gap-3 px-4 py-2 bg-[#FAF8F5] border border-[#EAE5DC] rounded-full shadow-sm text-[#111111] transition-all">
                      <span className="flex flex-col text-left leading-tight">
                        <span className="text-[0.68rem] text-[#4B5563] font-medium">Category:</span>
                        <span className="font-extrabold text-[0.82rem] uppercase tracking-wide text-[#111111]">
                          {activeCategorySlug.replace(/-/g, ' ')}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCategorySelect({ id: 'all', name: 'ALL PRODUCTS', slug: 'all' })}
                        className="text-gray-400 hover:text-[#111111] transition-colors p-0.5 cursor-pointer"
                        aria-label="Remove category filter"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}

                  {/* Cost Filter Pill */}
                  {(pricePreset !== 'all' || minPriceInput || maxPriceInput) && (
                    <span className="inline-flex items-center gap-3 px-4 py-2 bg-[#FAF8F5] border border-[#EAE5DC] rounded-full shadow-sm text-[#111111] transition-all">
                      <span className="flex flex-col text-left leading-tight">
                        <span className="text-[0.68rem] text-[#4B5563] font-medium">Cost:</span>
                        <span className="font-extrabold text-[0.82rem] text-[#111111]">
                          {pricePreset === 'under-500' && 'Under ₹500'}
                          {pricePreset === '500-1000' && '₹500 - ₹1,000'}
                          {pricePreset === '1000-2500' && '₹1,000 - ₹2,500'}
                          {pricePreset === 'above-2500' && 'Above ₹2,500'}
                          {pricePreset === 'custom' && `₹${minPriceInput || 0} - ₹${maxPriceInput || '∞'}`}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setPricePreset('all');
                          setMinPriceInput('');
                          setMaxPriceInput('');
                        }}
                        className="text-gray-400 hover:text-[#111111] transition-colors p-0.5 cursor-pointer"
                        aria-label="Remove cost filter"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}

                  {/* Search Query Pill */}
                  {searchQuery.trim() && (
                    <span className="inline-flex items-center gap-3 px-4 py-2 bg-[#FAF8F5] border border-[#EAE5DC] rounded-full shadow-sm text-[#111111] transition-all">
                      <span className="flex flex-col text-left leading-tight">
                        <span className="text-[0.68rem] text-[#4B5563] font-medium">Search:</span>
                        <span className="font-extrabold text-[0.82rem] text-[#111111]">"{searchQuery}"</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="text-gray-400 hover:text-[#111111] transition-colors p-0.5 cursor-pointer"
                        aria-label="Remove search filter"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}

                  {/* Reset / Clear All Button */}
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-[0.75rem] font-bold text-[#C39F68] hover:text-[#111111] hover:underline cursor-pointer ml-1"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Main Responsive Grid Layout (Left Sidebar + Right Product Grid) */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

              {/* 1. Left Sidebar Filter (Desktop / Laptop / Tablet landscape) */}
              <aside className="hidden lg:block w-[280px] xl:w-[300px] shrink-0 sticky top-28">
                <div className="bg-white rounded-2xl border border-[#EAEAEA] p-5 shadow-sm">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
                    <span className="text-[0.82rem] font-extrabold text-[#111111] uppercase tracking-wider flex items-center gap-2">
                      <Filter size={16} className="text-[#C39F68]" />
                      Filters & Sort
                    </span>
                  </div>
                  {renderFilterControls()}
                </div>
              </aside>

              {/* 2. Right Products Content Area */}
              <div className="flex-1 w-full min-w-0">

                {/* Top Control Bar for Mobile / Tablet & Item Count */}
                <div className="flex items-center justify-between bg-white border border-[#EAEAEA] rounded-2xl px-4 py-3 mb-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    {/* Mobile Filter Toggle Button */}
                    <button
                      type="button"
                      onClick={() => setMobileFilterOpen(true)}
                      className="lg:hidden flex items-center gap-2 px-3.5 py-1.5 bg-[#111111] text-white rounded-xl text-[0.78rem] font-bold shadow-sm hover:bg-[#C39F68] transition-colors cursor-pointer"
                    >
                      <SlidersHorizontal size={14} />
                      <span>Filters & Sort</span>
                      {(pricePreset !== 'all' || minPriceInput || maxPriceInput || searchQuery || activeCategorySlug !== 'all') && (
                        <span className="w-2 h-2 rounded-full bg-[#C39F68]" />
                      )}
                    </button>

                    <span className="text-[0.8rem] font-semibold text-[#666666]">
                      Showing <strong className="text-[#111111]">{filteredProducts.length}</strong> products
                    </span>
                  </div>
                </div>

                {/* Product Grid */}
                {loading ? (
                  <div className="text-center py-20 text-[#6B7280]">
                    <div className="w-10 h-10 border-3 border-[#E5E7EB] border-t-[#111111] rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm font-medium">Loading shop collection...</p>
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
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
                  <div className="text-center py-16 bg-[#FAF8F5] rounded-2xl border border-gray-200 p-6">
                    <p className="text-gray-500 font-medium text-sm">No products found matching your filter criteria.</p>
                    <button
                      type="button"
                      onClick={resetAllFilters}
                      className="mt-4 inline-block px-5 py-2.5 text-xs font-bold text-white bg-[#111111] rounded-full hover:bg-[#C39F68] transition-colors cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Mobile Filter Slide-Over Drawer Modal */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-[1100] flex lg:hidden">
            {/* Dark Backdrop Overlay */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileFilterOpen(false)}
            />

            {/* Slide-out Drawer */}
            <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-[#C39F68]" />
                  <h3 className="font-extrabold text-[#111111] text-base">Filter & Sort</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 text-gray-400 hover:text-[#111111] rounded-lg cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="p-4 sm:p-5 overflow-y-auto flex-1">
                {renderFilterControls()}
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    resetAllFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="flex-1 py-2.5 px-4 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 cursor-pointer"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-2.5 px-4 text-xs font-bold text-white bg-[#111111] rounded-xl hover:bg-[#C39F68] cursor-pointer"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
}
