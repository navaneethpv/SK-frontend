import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, ChevronDown, Menu, X, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { productAPI } from '@/api/services/productAPI';
import { IProduct } from '@/types/product';
import { getProductSlug, formatProductTitle } from '@/utils/slugHelper';
import { getImageUrl } from '@/utils/imageHelper';

interface NavCategory {
  id: number;
  name: string;
  slug: string;
}

interface NavProduct {
  id: number;
  title: string;
  slug: string;
  price: string;
}

const DEFAULT_LUXURY_NAV_CATEGORIES: NavCategory[] = [
  { id: 1, name: 'Hair Care', slug: 'haircare' },
  { id: 2, name: 'Perfumes', slug: 'perfumes' },
  { id: 3, name: 'Accessories', slug: 'accessories' }
];

const DEFAULT_CATEGORY_PRODUCTS: Record<string, NavProduct[]> = {
  haircare: [
    { id: 2, title: 'SK Herbal Hair Oil 200ml', slug: 'sk-hair-oil-200ml', price: '₹335' },
    { id: 3, title: 'Vitamin C Brightening Face Wash', slug: 'vitamin-c-face-wash', price: '₹199' },
    { id: 6, title: '0.25mm Hair & Beard Derma Roller', slug: 'derma-roller', price: '₹335' }
  ],
  perfumes: [
    { id: 1, title: 'Noir Premium Fragrance - 50ml', slug: 'noir-premium-fragrance', price: '₹499' },
    { id: 5, title: 'Eau De Parfum | Amber Oud', slug: 'eau-de-parfum-amber', price: '₹899' }
  ],
  accessories: [
    { id: 3, title: 'Classic Full-Grain Leather Belt', slug: 'classic-leather-belt', price: '₹699' },
    { id: 8, title: 'Executive Leather Briefcase Bag', slug: 'executive-leather-briefcase', price: '₹2,999' },
    { id: 105, title: 'Minimalist Leather Wallet', slug: 'leather-wallet', price: '₹599' }
  ]
};

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [navCategories, setNavCategories] = useState<NavCategory[]>(DEFAULT_LUXURY_NAV_CATEGORIES);
  const [categoryProducts, setCategoryProducts] = useState<Record<number, NavProduct[]>>({});
  const [isScrolled, setIsScrolled] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { cartCount, setIsCartDrawerOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    productAPI.getCategories()
      .then((data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const filtered = data.filter((c: any) => {
            const name = (c.name || '').toLowerCase();
            return !name.includes('fiction') && !name.includes('novel');
          });
          if (filtered.length > 0) {
            const mapped: NavCategory[] = filtered.map((cat: any, idx: number) => ({
              id: cat.id || idx + 1,
              name: cat.name || `Category ${idx + 1}`,
              slug: cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-') || 'all',
            }));
            setNavCategories(mapped);
            return;
          }
        }
        setNavCategories(DEFAULT_LUXURY_NAV_CATEGORIES);
      })
      .catch(() => {
        setNavCategories(DEFAULT_LUXURY_NAV_CATEGORIES);
      });
  }, []);

  const loadCategoryProducts = async (cat: NavCategory) => {
    if (categoryProducts[cat.id]) return;
    try {
      const data = await productAPI.getCategoryProducts(cat.id);
      if (Array.isArray(data) && data.length > 0) {
        const mapped: NavProduct[] = data.slice(0, 6).map((p: IProduct) => ({
          id: p.id,
          title: formatProductTitle(p.alias || p.slug || 'SK Product'),
          slug: getProductSlug(p),
          price: `₹${typeof p.selling_price === 'number' && p.selling_price > 0 ? p.selling_price : parseFloat(p.price) || 0}`,
        }));
        setCategoryProducts(prev => ({ ...prev, [cat.id]: mapped }));
      } else {
        const fallback = DEFAULT_CATEGORY_PRODUCTS[cat.slug] || DEFAULT_CATEGORY_PRODUCTS['haircare'];
        setCategoryProducts(prev => ({ ...prev, [cat.id]: fallback }));
      }
    } catch {
      const fallback = DEFAULT_CATEGORY_PRODUCTS[cat.slug] || DEFAULT_CATEGORY_PRODUCTS['haircare'];
      setCategoryProducts(prev => ({ ...prev, [cat.id]: fallback }));
    }
  };

  const handleMouseEnterNav = (cat: NavCategory) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(String(cat.id));
    loadCategoryProducts(cat);
  };

  const handleMouseLeaveNav = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
    }
  };

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
          <Link href="/" className="text-[0.88rem] font-semibold text-white no-underline transition-colors hover:text-[#C39F68]">Home</Link>
          <Link href="/shop" className="text-[0.88rem] font-semibold text-white no-underline transition-colors hover:text-[#C39F68]">Shop</Link>

          {/* Dynamic Category Dropdowns */}
          {navCategories.map((cat) => (
            <div
              key={cat.id}
              className="relative py-2"
              onMouseEnter={() => handleMouseEnterNav(cat)}
              onMouseLeave={handleMouseLeaveNav}
            >
              <button
                onClick={() => {
                  const next = activeDropdown === String(cat.id) ? null : String(cat.id);
                  setActiveDropdown(next);
                  if (next) loadCategoryProducts(cat);
                }}
                className="text-[0.88rem] font-semibold text-white bg-transparent border-none cursor-pointer flex items-center gap-1.5 transition-colors hover:text-[#C39F68]"
                type="button"
              >
                <span>{cat.name}</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${activeDropdown === String(cat.id) ? 'rotate-180 text-[#C39F68]' : ''}`} />
              </button>

              {activeDropdown === String(cat.id) && (
                <div className="absolute top-full left-0 pt-2 z-50 animate-fade-in">
                  <div className="w-[300px] bg-white border border-[#121316] rounded-xl shadow-[0_16px_36px_rgba(0,0,0,0.15)] p-4">
                    <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#EAE5DC]">
                      <span className="text-[0.8rem] font-extrabold text-[#121316] uppercase tracking-wider">{cat.name}</span>
                      <Link
                        href={`/shop?category=${cat.slug}`}
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-1 text-[0.72rem] font-bold text-[#121316] hover:text-[#C39F68] hover:underline"
                      >
                        <span>View all</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>

                    <div className="flex flex-col gap-1">
                      {!(categoryProducts[cat.id] || DEFAULT_CATEGORY_PRODUCTS[cat.slug]) ? (
                        <div className="flex items-center justify-center py-4 gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C39F68] animate-ping" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C39F68] animate-ping delay-100" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C39F68] animate-ping delay-200" />
                        </div>
                      ) : (
                        (categoryProducts[cat.id] || DEFAULT_CATEGORY_PRODUCTS[cat.slug] || DEFAULT_CATEGORY_PRODUCTS['haircare']).map((prod) => (
                          <Link
                            key={prod.id}
                            href={`/product/${prod.slug}`}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center justify-between py-2 px-2.5 rounded-lg hover:bg-[#FAF8F5] transition-colors group/item"
                          >
                            <span className="text-[0.82rem] text-[#27272A] font-medium line-clamp-1 group-hover/item:text-[#121316] transition-colors">{prod.title}</span>
                            <span className="text-[0.78rem] text-[#C39F68] font-bold shrink-0 ml-2">{prod.price}</span>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          <Link href="/best-sellers" className="text-[0.88rem] font-semibold text-white no-underline transition-colors hover:text-[#C39F68]">Best Sellers</Link>
          <Link href="/products" className="text-[0.88rem] font-semibold text-white no-underline transition-colors hover:text-[#C39F68]">All Products</Link>
          <Link href="/about" className="text-[0.88rem] font-semibold text-white no-underline transition-colors hover:text-[#C39F68]">About</Link>
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-3 sm:gap-4">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center bg-[#222327] border border-[#3A3C44] rounded-full px-3 py-1 animate-fade-in">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-white text-[0.8rem] outline-none w-36 sm:w-48 px-1"
                autoFocus
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="bg-transparent border-none cursor-pointer p-1 text-white" aria-label="Close search">
                <X size={18} color="#ffffff" />
              </button>
            </form>
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
          {navCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              onClick={() => setMobileMenuOpen(false)}
              className="text-[0.95rem] font-semibold text-gray-300 no-underline pl-2 border-l-2 border-[#C39F68]"
            >
              {cat.name}
            </Link>
          ))}
          <Link href="/best-sellers" onClick={() => setMobileMenuOpen(false)} className="text-[0.95rem] font-bold text-white no-underline">Best Sellers</Link>
          <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="text-[0.95rem] font-bold text-white no-underline">All Products</Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-[0.95rem] font-bold text-white no-underline">About Us</Link>
        </div>
      )}
    </header>
  );
}
