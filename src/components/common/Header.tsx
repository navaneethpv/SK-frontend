import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Search, ShoppingBag, ChevronDown, Menu, X, ArrowRight, Tag, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { productAPI } from '@/api/services/productAPI';
import { getImageUrl } from '@/utils/imageHelper';
import { getProductSlug, formatProductTitle } from '@/utils/slugHelper';
import { IProduct } from '@/types/product';

interface NavCategory {
  id: number;
  name: string;
  slug: string;
  icon?: string;
}

export default function Header() {
  const router = useRouter();
  const currentPath = router.pathname;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [productSuggestions, setProductSuggestions] = useState<IProduct[]>([]);
  const [searching, setSearching] = useState(false);

  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [navCategories, setNavCategories] = useState<NavCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { cartCount, setIsCartDrawerOpen } = useCart();

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    productAPI.getCategories()
      .then((data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: NavCategory[] = data.map((cat: any, idx: number) => ({
            id: cat.id || idx + 1,
            name: cat.name || `Category ${idx + 1}`,
            slug: cat.slug || cat.name?.toLowerCase().trim().replace(/\s+/g, '-') || 'all',
            icon: cat.icon || cat.image || undefined,
          }));
          setNavCategories(mapped);
        }
      })
      .catch((err) => {
        console.warn('Failed to load categories for header from backend:', err);
      })
      .finally(() => setLoadingCategories(false));
  }, []);

  // Fetch Live Search Suggestions by Product Name & Category
  useEffect(() => {
    if (!searchQuery.trim()) {
      setProductSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      setSearching(true);
      productAPI.getProducts()
        .then((all) => {
          if (Array.isArray(all)) {
            const q = searchQuery.toLowerCase().trim();
            const matched = all.filter((p: IProduct) => {
              const alias = (p.alias || p.slug || '').toLowerCase();
              const desc = (p.description || p.sdescription || '').toLowerCase();
              return alias.includes(q) || desc.includes(q);
            }).slice(0, 4);
            setProductSuggestions(matched);
          }
        })
        .catch(() => setProductSuggestions([]))
        .finally(() => setSearching(false));
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setProductSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnterCategories = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCategoriesDropdownOpen(true);
  };

  const handleMouseLeaveCategories = () => {
    timeoutRef.current = setTimeout(() => {
      setCategoriesDropdownOpen(false);
    }, 200);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      setProductSuggestions([]);
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const matchedCategories = searchQuery.trim()
    ? navCategories.filter(cat => cat.name.toLowerCase().includes(searchQuery.toLowerCase().trim())).slice(0, 3)
    : [];

  return (
    <header
      className={`w-screen fixed top-0 left-0 z-[1000] bg-[#121316] transition-all duration-300 ${
        isScrolled ? 'bg-[#121316]/95 backdrop-blur-[14px] shadow-[0_4px_25px_rgba(0,0,0,0.25)]' : ''
      }`}
      style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}
    >
      {/* Main Header Row */}
      <div
        className={`w-full flex items-center justify-between transition-all duration-300 bg-[#121316] ${
          isScrolled ? 'bg-transparent py-2.5 px-6 lg:px-14' : 'py-3.5 px-6 lg:px-14'
        }`}
      >
        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex lg:hidden bg-none border-none cursor-pointer p-2 min-w-[44px] min-h-[44px] items-center justify-center rounded focus-visible:outline-2 focus-visible:outline-[#C39F68] focus-visible:outline-offset-2"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={22} color="#ffffff" /> : <Menu size={22} color="#ffffff" />}
        </button>

        {/* Brand Logo */}
        <Link href="/" className="flex items-center no-underline focus-visible:outline-2 focus-visible:outline-[#C39F68] focus-visible:outline-offset-2">
          <div className="flex items-center justify-center">
            <img src={getImageUrl('/SK Logo.svg')} alt="SK Logo" className="h-10 lg:h-[46px] w-auto object-contain transition-all duration-300" />
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          <Link 
            href="/" 
            className={`text-[0.88rem] font-semibold no-underline transition-colors ${
              isActive('/') ? 'text-[#C39F68] font-bold border-b-2 border-[#C39F68] pb-0.5' : 'text-white hover:text-[#C39F68]'
            }`}
          >
            Home
          </Link>

          {/* Clean Direct Shop Link */}
          <Link
            href="/shop"
            className={`text-[0.88rem] font-semibold no-underline transition-colors ${
              isActive('/shop') ? 'text-[#C39F68] font-bold border-b-2 border-[#C39F68] pb-0.5' : 'text-white hover:text-[#C39F68]'
            }`}
          >
            Shop
          </Link>

          {/* Categories Dropdown with 3-Column API Categories */}
          <div
            className="relative py-2"
            onMouseEnter={handleMouseEnterCategories}
            onMouseLeave={handleMouseLeaveCategories}
          >
            <Link
              href="/categories"
              className={`text-[0.88rem] font-semibold no-underline cursor-pointer flex items-center gap-1.5 transition-colors ${
                categoriesDropdownOpen || isActive('/categories') ? 'text-[#C39F68] font-bold border-b-2 border-[#C39F68] pb-0.5' : 'text-white hover:text-[#C39F68]'
              }`}
            >
              <span>Categories</span>
              <ChevronDown size={13} className={`transition-transform duration-200 ${categoriesDropdownOpen ? 'rotate-180 text-[#C39F68]' : ''}`} />
            </Link>

            {categoriesDropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 animate-fade-in">
                <div className="w-[500px] sm:w-[560px] bg-white border border-[#121316] rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.18)] p-5">
                  <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-[#EAE5DC]">
                    <span className="text-[0.8rem] font-extrabold text-[#121316] uppercase tracking-wider">PRODUCT CATEGORIES</span>
                    <Link
                      href="/categories"
                      onClick={() => setCategoriesDropdownOpen(false)}
                      className="flex items-center gap-1 text-[0.75rem] font-bold text-[#C39F68] hover:underline"
                    >
                      <span>Explore All Categories</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>

                  {/* 3-Column Grid */}
                  <div className="grid grid-cols-3 gap-2.5">
                    {loadingCategories ? (
                      <div className="col-span-3 text-center py-6 text-gray-500 text-xs font-medium">
                        <div className="w-5 h-5 border-2 border-[#C39F68] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        Loading categories...
                      </div>
                    ) : navCategories.length > 0 ? (
                      navCategories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/shop?category=${cat.slug}`}
                          onClick={() => setCategoriesDropdownOpen(false)}
                          className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-[#FAF8F5] transition-all duration-200 group border border-transparent hover:border-[#EAE5DC]"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#C39F68] shrink-0 group-hover:scale-125 transition-transform" />
                          <span className="text-[0.83rem] font-semibold text-[#27272A] group-hover:text-[#C39F68] transition-colors line-clamp-1">
                            {cat.name}
                          </span>
                        </Link>
                      ))
                    ) : (
                      <div className="col-span-3 text-center py-4 text-xs text-gray-500">
                        No categories found.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link 
            href="/best-sellers" 
            className={`text-[0.88rem] font-semibold no-underline transition-colors ${
              isActive('/best-sellers') ? 'text-[#C39F68] font-bold border-b-2 border-[#C39F68] pb-0.5' : 'text-white hover:text-[#C39F68]'
            }`}
          >
            Best Sellers
          </Link>

          <Link 
            href="/about" 
            className={`text-[0.88rem] font-semibold no-underline transition-colors ${
              isActive('/about') ? 'text-[#C39F68] font-bold border-b-2 border-[#C39F68] pb-0.5' : 'text-white hover:text-[#C39F68]'
            }`}
          >
            About
          </Link>
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-3 sm:gap-4">
          {searchOpen ? (
            <div ref={searchContainerRef} className="relative">
              <form onSubmit={handleSearch} className="flex items-center bg-[#222327] border border-[#3A3C44] rounded-full px-3 py-1 animate-fade-in">
                <input
                  type="text"
                  placeholder="Search products, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-white text-[0.8rem] outline-none w-48 sm:w-64 px-1"
                  autoFocus
                />
                <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); setProductSuggestions([]); }} className="bg-transparent border-none cursor-pointer p-1 text-white" aria-label="Close search">
                  <X size={18} color="#ffffff" />
                </button>
              </form>

              {/* Autocomplete Search Suggestions Dropdown */}
              {searchQuery.trim().length > 0 && (
                <div className="absolute top-full right-0 mt-2 w-[300px] sm:w-[380px] bg-white border border-[#121316] rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] overflow-hidden z-[1050] animate-fade-in p-3">
                  
                  {/* Category Matches Section */}
                  {matchedCategories.length > 0 && (
                    <div className="mb-3 pb-2 border-b border-[#F3F4F6]">
                      <span className="text-[0.68rem] font-extrabold text-[#C39F68] uppercase tracking-wider block mb-1.5 px-2 flex items-center gap-1">
                        <Tag size={12} /> Matching Categories
                      </span>
                      <div className="flex gap-1.5 flex-wrap px-1">
                        {matchedCategories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/shop?category=${cat.slug}`}
                            onClick={() => { setSearchOpen(false); setSearchQuery(''); setProductSuggestions([]); }}
                            className="px-3 py-1 bg-[#FAF8F5] border border-[#EAE5DC] rounded-full text-[0.72rem] font-bold text-[#121316] hover:bg-[#121316] hover:text-white transition-colors"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Product Matches Section */}
                  <div>
                    <span className="text-[0.68rem] font-extrabold text-[#9CA3AF] uppercase tracking-wider block mb-2 px-2 flex items-center gap-1">
                      <Package size={12} /> Matching Products
                    </span>

                    {searching ? (
                      <div className="py-4 text-center text-xs text-gray-400">
                        Searching products...
                      </div>
                    ) : productSuggestions.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {productSuggestions.map((prod) => {
                          const rawImg = prod.icon || (prod.img && prod.img[0]?.image);
                          const numPrice = typeof prod.selling_price === 'number' && prod.selling_price > 0 ? prod.selling_price : parseFloat(prod.price) || 499;
                          const slug = getProductSlug(prod);
                          const title = formatProductTitle(prod.alias || prod.slug || 'SK Product');

                          return (
                            <Link
                              key={prod.id}
                              href={`/product/${slug}`}
                              onClick={() => { setSearchOpen(false); setSearchQuery(''); setProductSuggestions([]); }}
                              className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#FAF8F5] transition-colors group"
                            >
                              <div className="w-10 h-10 bg-[#FAF7F2] border border-[#EAE5DC] rounded-lg p-1 shrink-0 flex items-center justify-center">
                                <img src={getImageUrl(rawImg, '/hero cards/4.png')} alt={title} className="max-w-full max-h-full object-contain" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-[0.8rem] font-bold text-[#121316] group-hover:text-[#C39F68] transition-colors truncate">
                                  {title}
                                </h4>
                                <span className="text-[0.75rem] font-extrabold text-[#121316]">₹{numPrice}</span>
                              </div>
                              <ArrowRight size={14} className="text-gray-400 group-hover:text-[#C39F68] transition-colors shrink-0" />
                            </Link>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-3 text-center text-xs text-gray-400">
                        No product matches found.
                      </div>
                    )}
                  </div>

                  {/* Press Enter Footer Link */}
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="w-full mt-2 pt-2.5 border-t border-[#F3F4F6] text-center text-[0.75rem] font-bold text-[#C39F68] hover:underline cursor-pointer block"
                  >
                    View All Results for &quot;{searchQuery}&quot; →
                  </button>

                </div>
              )}
            </div>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="relative bg-transparent border-none cursor-pointer p-2 text-white hover:text-[#C39F68] transition-colors" aria-label="Search">
              <Search size={19} color="#ffffff" />
            </button>
          )}

          {/* Cart Icon Button */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="relative bg-transparent border-none cursor-pointer p-2 text-white hover:text-[#C39F68] transition-colors"
            aria-label="Shopping Cart"
          >
            <ShoppingBag size={20} color="#ffffff" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#C39F68] text-white text-[0.65rem] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#18191C] border-b border-[#2B2D33] px-6 py-5 flex flex-col gap-4 animate-fade-in">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-[0.95rem] font-bold text-white no-underline">Home</Link>
          <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="text-[0.95rem] font-bold text-white no-underline">Shop Catalogue</Link>
          <Link href="/categories" onClick={() => setMobileMenuOpen(false)} className="text-[0.95rem] font-bold text-white no-underline">Categories</Link>
          <div className="flex flex-col gap-2 pl-2 border-l-2 border-[#C39F68]">
            <span className="text-[0.75rem] font-bold text-[#C39F68] uppercase tracking-wider">Shop Categories</span>
            {navCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[0.95rem] font-semibold text-gray-300 no-underline hover:text-white"
              >
                {cat.name}
              </Link>
            ))}
          </div>
          <Link href="/best-sellers" onClick={() => setMobileMenuOpen(false)} className="text-[0.95rem] font-bold text-white no-underline">Best Sellers</Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-[0.95rem] font-bold text-white no-underline">About Us</Link>
        </div>
      )}
    </header>
  );
}
