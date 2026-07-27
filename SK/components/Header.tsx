import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, ChevronDown, Menu, X, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { productAPI } from '../Api/Services/productAPI';
import { IProduct } from '../Pages/Interfaces/product';
import { getProductSlug } from '../utils/slugHelper';

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
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
      {/* Top Banner Notice */}
      <div className="top-bar-notice">
        <span>Complimentary Express Shipping on Orders Over ₹499 • 100% Authentic Organic Formulations</span>
      </div>

      {/* Main Header Row */}
      <div className="main-header-row">
        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-toggle-btn"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={22} color="#ffffff" /> : <Menu size={22} color="#ffffff" />}
        </button>

        {/* Brand Logo */}
        <Link href="/" className="logo-link">
          <div className="logo-wrapper">
            <img src="/SK Logo.svg" alt="SK Logo" className="logo-img" />
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <Link href="/" className="header-nav-link">Home</Link>
          <Link href="/about" className="header-nav-link">About</Link>
          <Link href="/best-sellers" className="header-nav-link">Best Sellers</Link>
          <Link href="/products" className="header-nav-link">All Products</Link>

          {/* Dynamic Category Dropdowns */}
          {navCategories.map((cat) => (
            <div
              key={cat.id}
              className={`nav-dropdown ${activeDropdown === String(cat.id) ? 'open' : ''}`}
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
                className="header-nav-link dropdown-btn"
                type="button"
              >
                <span>{cat.name}</span>
                <ChevronDown size={13} className="chevron-icon" />
              </button>

              <div className="dropdown-popup">
                <div className="dropdown-header-row">
                  <span className="dropdown-cat-title">{cat.name}</span>
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    onClick={() => setActiveDropdown(null)}
                    className="dropdown-view-all"
                  >
                    <span>View all</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
                <div className="dropdown-divider" />
                <div className="dropdown-menu-list">
                  {!categoryProducts[cat.id] ? (
                    <div className="dropdown-loading">
                      <span className="loading-dot" />
                      <span className="loading-dot" />
                      <span className="loading-dot" />
                    </div>
                  ) : categoryProducts[cat.id].length === 0 ? (
                    <span className="dropdown-empty">No products found</span>
                  ) : (
                    categoryProducts[cat.id].map((prod) => (
                      <Link
                        key={prod.id}
                        href={`/product/${prod.slug}`}
                        onClick={() => setActiveDropdown(null)}
                        className="menu-item-link"
                      >
                        <span className="item-title">{prod.title}</span>
                        <span className="item-price">{prod.price}</span>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>
          ))}
        </nav>

        {/* Right Action Icons */}
        <div className="header-actions">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="search-inline-form">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-inline-input"
                autoFocus
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="icon-btn" aria-label="Close search">
                <X size={18} color="#ffffff" />
              </button>
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="icon-btn" aria-label="Search">
              <Search size={19} color="#ffffff" />
            </button>
          )}

          <button onClick={() => setIsCartDrawerOpen(true)} className="icon-btn cart-btn" aria-label="Cart">
            <ShoppingBag size={19} color="#ffffff" />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <nav className="mobile-nav">
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
          <Link href="/best-sellers" onClick={() => setMobileMenuOpen(false)}>Best Sellers</Link>
          <Link href="/products" onClick={() => setMobileMenuOpen(false)}>All Products</Link>
          {navCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      )}

      <style jsx>{`
        .site-header {
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          margin-right: calc(-50vw + 50%);
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1000;
          background-color: #121316;
          transition: background-color 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease;
        }

        .site-header.scrolled {
          background-color: rgba(18, 19, 22, 0.95);
          backdrop-filter: blur(14px);
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.25);
        }

        .top-bar-notice {
          background-color: #0A0A0A;
          color: #D4AF37;
          font-size: 0.7rem;
          font-weight: 600;
          text-align: center;
          padding: 0.35rem 1rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: max-height 0.3s ease, padding 0.3s ease, opacity 0.3s ease;
          max-height: 34px;
          opacity: 1;
          overflow: hidden;
        }

        .site-header.scrolled .top-bar-notice {
          max-height: 0;
          padding: 0;
          opacity: 0;
        }

        .main-header-row {
          width: 100%;
          max-width: 100%;
          padding: 0.8rem 3.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #121316;
          transition: padding 0.3s ease, background 0.3s ease;
        }

        .site-header.scrolled .main-header-row {
          background: transparent;
          padding: 0.6rem 3.5rem;
        }

        .mobile-toggle-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          min-width: 44px;
          min-height: 44px;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
        }

        .mobile-toggle-btn:focus-visible,
        .icon-btn:focus-visible,
        .logo-link:focus-visible {
          outline: 2px solid #C5A059;
          outline-offset: 2px;
        }

        .logo-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 52px;
        }

        .logo-img {
          height: 50px;
          width: auto;
          object-fit: contain;
          transition: transform 0.3s ease;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
        }

        .logo-link:hover .logo-img { transform: scale(1.04); }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 1.8rem;
          flex-wrap: nowrap;
        }

        :global(.header-nav-link) {
          font-family: var(--font-sans, system-ui, -apple-system, sans-serif);
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: #ffffff;
          text-transform: uppercase;
          cursor: pointer;
          position: relative;
          padding: 0.5rem 0;
          background: transparent;
          border: none;
          white-space: nowrap;
          text-decoration: none;
          text-shadow: 0 1px 4px rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          gap: 0.3rem;
          transition: color 0.2s ease;
        }

        :global(.header-nav-link:hover) {
          color: #C5A059;
        }

        .dropdown-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        :global(.chevron-icon) {
          transition: transform 0.2s ease;
        }

        .nav-dropdown.open :global(.chevron-icon) {
          transform: rotate(180deg);
        }

        .nav-dropdown {
          position: relative;
        }

        .dropdown-popup {
          position: absolute;
          top: 100%;
          left: 0;
          min-width: 250px;
          max-width: 290px;
          background-color: #ffffff;
          border: 1px solid #EAEAEA;
          border-radius: 8px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
          padding: 0.9rem;
          opacity: 0;
          visibility: hidden;
          margin-top: 10px;
          transform: translateY(4px);
          transition: all 0.2s ease;
          z-index: 2000;
        }

        .dropdown-popup::before {
          content: '';
          position: absolute;
          top: -10px;
          left: 0;
          right: 0;
          height: 10px;
          background: transparent;
        }

        .nav-dropdown:hover .dropdown-popup,
        .nav-dropdown.open .dropdown-popup {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .dropdown-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .dropdown-cat-title {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #111111;
          text-transform: uppercase;
        }

        :global(.dropdown-view-all) {
          font-size: 0.72rem;
          font-weight: 700;
          color: #C5A059;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }

        .dropdown-divider {
          height: 1px;
          background-color: #EAEAEA;
          margin: 0.6rem 0;
        }

        .dropdown-menu-list {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        :global(.menu-item-link) {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.45rem 0.6rem;
          border-radius: 5px;
          text-decoration: none;
          transition: background-color 0.15s ease;
        }

        :global(.menu-item-link:hover) {
          background-color: #F7F7F7;
        }

        .item-title {
          font-size: 0.82rem;
          color: #222222;
          font-weight: 500;
        }

        .item-price {
          font-size: 0.78rem;
          color: #C5A059;
          font-weight: 700;
        }

        .dropdown-empty {
          font-size: 0.78rem;
          color: #999999;
          padding: 0.4rem 0;
        }

        .dropdown-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.8rem 0;
        }

        .loading-dot {
          width: 6px;
          height: 6px;
          background-color: #C5A059;
          border-radius: 50%;
          animation: pulseDot 1s infinite alternate;
        }

        @keyframes pulseDot {
          from { opacity: 0.3; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1.2); }
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          position: relative;
          color: #ffffff;
          padding: 0.4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        }

        .icon-btn:hover { transform: scale(1.1); }

        .cart-badge {
          position: absolute;
          top: 0;
          right: -2px;
          background-color: #C5A059;
          color: #ffffff;
          font-size: 0.62rem;
          font-weight: 800;
          width: 17px;
          height: 17px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .search-inline-form {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          padding: 0.2rem 0.6rem;
        }

        .search-inline-input {
          background: transparent;
          border: none;
          outline: none;
          color: #ffffff;
          font-size: 0.82rem;
          width: 140px;
        }

        .search-inline-input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }

        .mobile-nav {
          display: flex;
          flex-direction: column;
          background-color: #111111;
          border-top: 1px solid #222222;
          padding: 1rem 2rem;
        }

        .mobile-nav :global(a) {
          color: #ffffff;
          padding: 0.7rem 0;
          font-size: 0.88rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          border-bottom: 1px solid #1E1E1E;
        }

        @media (max-width: 1024px) {
          .main-header-row {
            padding: 0.5rem 1.5rem;
          }
          .site-header.scrolled .main-header-row {
            padding: 0.4rem 1.5rem;
          }
          .logo-wrapper { height: 40px; }
          .logo-img { height: 38px; }
          .top-bar-notice {
            font-size: 0.64rem;
            padding: 0.25rem 0.5rem;
          }
          .desktop-nav { display: none; }
          .mobile-toggle-btn { display: flex; }
        }
      `}</style>
    </header>
  );
}
