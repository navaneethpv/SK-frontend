import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, ChevronDown, Menu, X, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { productAPI } from '@/api/services/productAPI';
import { IProduct } from '@/types/product';
import { getProductSlug } from '@/utils/slugHelper';

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

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [navCategories, setNavCategories] = useState<NavCategory[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<Record<number, NavProduct[]>>({});
  const [isScrolled, setIsScrolled] = useState(false);

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
          const mapped: NavCategory[] = data.map((cat: any, idx: number) => ({
            id: cat.id || idx + 1,
            name: cat.name || `Category ${idx + 1}`,
            slug: cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-') || 'all',
          }));
          setNavCategories(mapped);
        }
      })
      .catch(() => { });
  }, []);

  const loadCategoryProducts = async (catId: number) => {
    if (categoryProducts[catId]) return;
    try {
      const data = await productAPI.getCategoryProducts(catId);
      if (Array.isArray(data) && data.length > 0) {
        const mapped: NavProduct[] = data.slice(0, 6).map((p: IProduct) => ({
          id: p.id,
          title: p.alias || p.slug || 'SK Product',
          slug: getProductSlug(p),
          price: `₹${typeof p.selling_price === 'number' && p.selling_price > 0 ? p.selling_price : parseFloat(p.price) || 0}`,
        }));
        setCategoryProducts(prev => ({ ...prev, [catId]: mapped }));
      } else {
        setCategoryProducts(prev => ({ ...prev, [catId]: [] }));
      }
    } catch {
      setCategoryProducts(prev => ({ ...prev, [catId]: [] }));
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className={`w-screen fixed top-0 left-0 z-[1000] bg-[#121316] transition-all duration-300 ${
      isScrolled ? 'bg-[#121316]/95 backdrop-blur-[14px] shadow-[0_4px_25px_rgba(0,0,0,0.25)]' : ''
    }`} style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}>
      {/* Main Header Row */}
      <div className={`w-full flex items-center justify-between transition-all duration-300 bg-[#121316] ${
        isScrolled ? 'bg-transparent py-2.5 px-6 lg:px-14' : 'py-3.5 px-6 lg:px-14'
      }`}>
        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex lg:hidden bg-none border-none cursor-pointer p-2 min-w-[44px] min-h-[44px] items-center justify-center rounded focus-visible:outline-2 focus-visible:outline-[#C5A059] focus-visible:outline-offset-2"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={22} color="#ffffff" /> : <Menu size={22} color="#ffffff" />}
        </button>

        {/* Brand Logo */}
        <Link href="/" className="flex items-center no-underline focus-visible:outline-2 focus-visible:outline-[#C5A059] focus-visible:outline-offset-2">
          <div className="flex items-center justify-center">
            <img src="/SK Logo.svg" alt="SK Logo" className="h-10 lg:h-[46px] w-auto object-contain transition-all duration-300" />
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          <Link href="/" className="text-[0.88rem] font-semibold text-white no-underline transition-colors hover:text-[#C5A059]">Home</Link>
          <Link href="/about" className="text-[0.88rem] font-semibold text-white no-underline transition-colors hover:text-[#C5A059]">About</Link>
          <Link href="/best-sellers" className="text-[0.88rem] font-semibold text-white no-underline transition-colors hover:text-[#C5A059]">Best Sellers</Link>
          <Link href="/products" className="text-[0.88rem] font-semibold text-white no-underline transition-colors hover:text-[#C5A059]">All Products</Link>

          {/* Dynamic Category Dropdowns */}
          {navCategories.map((cat) => (
            <div
              key={cat.id}
              className="relative"
              onMouseEnter={() => {
                setActiveDropdown(String(cat.id));
                loadCategoryProducts(cat.id);
              }}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => {
                  const next = activeDropdown === String(cat.id) ? null : String(cat.id);
                  setActiveDropdown(next);
                  if (next) loadCategoryProducts(cat.id);
                }}
                className="text-[0.88rem] font-semibold text-white bg-transparent border-none cursor-pointer flex items-center gap-1.5 transition-colors hover:text-[#C5A059]"
                type="button"
              >
                <span>{cat.name}</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${activeDropdown === String(cat.id) ? 'rotate-180 text-[#C5A059]' : ''}`} />
              </button>

              {activeDropdown === String(cat.id) && (
                <div className="absolute top-full left-0 mt-2 w-[280px] bg-[#18191C] border border-[#2D2F36] rounded-lg shadow-[0_12px_35px_rgba(0,0,0,0.4)] p-4 z-50 animate-fade-in">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#2D2F36]">
                    <span className="text-[0.82rem] font-bold text-white uppercase tracking-wider">{cat.name}</span>
                    <Link
                      href={`/shop?category=${cat.slug}`}
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-1 text-[0.72rem] font-semibold text-[#C5A059] hover:underline"
                    >
                      <span>View all</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                  <div className="flex flex-col gap-1">
                    {!categoryProducts[cat.id] ? (
                      <div className="flex items-center justify-center py-4 gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-ping" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-ping delay-100" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-ping delay-200" />
                      </div>
                    ) : categoryProducts[cat.id].length === 0 ? (
                      <span className="text-[0.78rem] text-gray-400 py-2">No products found</span>
                    ) : (
                      categoryProducts[cat.id].map((prod) => (
                        <Link
                          key={prod.id}
                          href={`/product/${prod.slug}`}
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-[#25272D] transition-colors"
                        >
                          <span className="text-[0.8rem] text-gray-200 font-medium line-clamp-1">{prod.title}</span>
                          <span className="text-[0.78rem] text-[#C5A059] font-bold shrink-0 ml-2">{prod.price}</span>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
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
            <button onClick={() => setSearchOpen(true)} className="relative bg-transparent border-none cursor-pointer p-2 text-white hover:text-[#C5A059] transition-colors" aria-label="Search">
              <Search size={19} color="#ffffff" />
            </button>
          )}

          <button onClick={() => setIsCartDrawerOpen(true)} className="relative bg-transparent border-none cursor-pointer p-2 text-white hover:text-[#C5A059] transition-colors" aria-label="Cart">
            <ShoppingBag size={19} color="#ffffff" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C5A059] text-white text-[0.62rem] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <nav className="lg:hidden bg-[#18191C] border-t border-[#2B2D34] flex flex-col p-5 gap-3 animate-fade-in">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-[0.9rem] font-medium text-white py-1">Home</Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-[0.9rem] font-medium text-white py-1">About</Link>
          <Link href="/best-sellers" onClick={() => setMobileMenuOpen(false)} className="text-[0.9rem] font-medium text-white py-1">Best Sellers</Link>
          <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="text-[0.9rem] font-medium text-white py-1">All Products</Link>
          {navCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              onClick={() => setMobileMenuOpen(false)}
              className="text-[0.9rem] font-medium text-gray-300 py-1 pl-2 border-l border-[#C5A059]"
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
