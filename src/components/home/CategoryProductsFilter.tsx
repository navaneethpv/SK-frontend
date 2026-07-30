import React, { useState, useEffect } from 'react';
import ProductCarousel, { ItemCard } from '@/components/product/ProductCarousel';
import { productAPI } from '@/api/services/productAPI';
import { IProduct } from '@/types/product';
import { getImageUrl } from '@/utils/imageHelper';
import { getProductSlug } from '@/utils/slugHelper';

function mapProductToCard(prod: IProduct, fallbackImg: string = '/hero cards/4.png'): ItemCard {
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
    title: prod.alias || prod.slug || 'SK Product',
    slug: getProductSlug(prod),
    rating: prod.rating ? prod.rating.toFixed(1) : '4.8',
    reviewsCount: prod.review_count || 45,
    discountBadge: discountBadge || undefined,
    price: `₹${numericPrice}`,
    originalPrice: originalPriceNum > numericPrice ? `₹${originalPriceNum}` : undefined,
    badgeText: prod.is_active ? 'Best Seller' : undefined,
    badgeType: 'gold',
    img: getImageUrl(rawImg, fallbackImg),
    actionText: 'Add To Cart'
  };
}

interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  img: string;
}

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: 1, name: 'Wallets', slug: 'wallets', img: '/images/category_tile_1.png' },
  { id: 2, name: 'Belts', slug: 'belts', img: '/images/category_tile_2.png' },
  { id: 3, name: 'Perfumes', slug: 'perfumes', img: '/images/category_tile_3.png' },
  { id: 4, name: 'Watches', slug: 'watches', img: '/images/category_tile_4.png' },
  { id: 5, name: 'Skincare Tools', slug: 'skincare-tools', img: '/images/category_tile_5.png' },
  { id: 6, name: 'Footwear', slug: 'footwear', img: '/images/category_tile_6.png' }
];

export default function CategoryProductsFilter() {
  const [categoryItems, setCategoryItems] = useState<CategoryItem[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [activeCategoryProducts, setActiveCategoryProducts] = useState<ItemCard[]>([]);
  const [catProductsLoading, setCatProductsLoading] = useState<boolean>(true);

  useEffect(() => {
    productAPI.getCategories()
      .then(async (data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: CategoryItem[] = data.map((cat: any, idx: number) => ({
            id: cat.id || idx + 1,
            name: cat.name || `Category ${idx + 1}`,
            slug: cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-') || 'all',
            img: getImageUrl(cat.icon || cat.image, `/images/category_tile_${(idx % 6) + 1}.png`)
          }));
          setCategoryItems(mapped);

          // Auto-load first category's products
          const first = mapped[0];
          setActiveCategoryId(first.id);
          setCatProductsLoading(true);
          try {
            const prods = await fetchFilteredCategoryProducts(first);
            setActiveCategoryProducts(prods);
          } finally {
            setCatProductsLoading(false);
          }
        } else {
          // Fallback to default category pills if API returns empty
          setCategoryItems(DEFAULT_CATEGORIES);
          const first = DEFAULT_CATEGORIES[0];
          setActiveCategoryId(first.id);
          setCatProductsLoading(true);
          try {
            const prods = await fetchFilteredCategoryProducts(first);
            setActiveCategoryProducts(prods);
          } finally {
            setCatProductsLoading(false);
          }
        }
      })
      .catch(async (err) => {
        console.warn('CategoryProductsFilter API warning:', err);
        setCategoryItems(DEFAULT_CATEGORIES);
        const first = DEFAULT_CATEGORIES[0];
        setActiveCategoryId(first.id);
        setCatProductsLoading(true);
        try {
          const prods = await fetchFilteredCategoryProducts(first);
          setActiveCategoryProducts(prods);
        } finally {
          setCatProductsLoading(false);
        }
      });
  }, []);

  const fetchFilteredCategoryProducts = async (cat: { id: number; name: string; slug: string }): Promise<ItemCard[]> => {
    try {
      // 1. Try getCategoryProducts(cat.id) -> categories/products/${cat.id}
      let prods = await productAPI.getCategoryProducts(cat.id);

      // 2. Try products?category_id=cat.id
      if (!Array.isArray(prods) || prods.length === 0) {
        prods = await productAPI.getProducts({ category_id: String(cat.id) });
      }

      // 3. Try products?category=slug
      if (!Array.isArray(prods) || prods.length === 0) {
        prods = await productAPI.getProducts({ category: cat.slug });
      }

      // 4. Try products?group_under=cat.id
      if (!Array.isArray(prods) || prods.length === 0) {
        prods = await productAPI.getProducts({ group_under: String(cat.id) });
      }

      // 5. Smart client-side filter against all products
      if (!Array.isArray(prods) || prods.length === 0) {
        const all = await productAPI.getProducts();
        if (Array.isArray(all) && all.length > 0) {
          const cleanCatName = cat.name.toLowerCase().replace(/s$/, '').trim();
          const cleanSlug = cat.slug.toLowerCase().replace(/s$/, '').trim();

          const matched = all.filter((p: IProduct) => {
            if (p.product_group === cat.id) return true;
            const alias = (p.alias || p.slug || '').toLowerCase();
            const desc = (p.description || p.sdescription || '').toLowerCase();
            return (
              alias.includes(cleanCatName) ||
              alias.includes(cleanSlug) ||
              desc.includes(cleanCatName) ||
              desc.includes(cleanSlug)
            );
          });

          if (matched.length > 0) {
            prods = matched;
          }
        }
      }

      if (Array.isArray(prods) && prods.length > 0) {
        const uniqueMap = new Map();
        prods.forEach(p => uniqueMap.set(p.id, p));
        const uniqueList = Array.from(uniqueMap.values());
        return uniqueList.map((p, i) => mapProductToCard(p, `/hero cards/${(i % 6) + 1}.png`));
      }
    } catch (err) {
      console.warn('Category filter error:', err);
    }
    return [];
  };

  const handleCategoryPillClick = async (cat: CategoryItem) => {
    if (activeCategoryId === cat.id) return;
    setActiveCategoryId(cat.id);
    setCatProductsLoading(true);
    setActiveCategoryProducts([]);
    try {
      const prods = await fetchFilteredCategoryProducts(cat);
      setActiveCategoryProducts(prods);
    } finally {
      setCatProductsLoading(false);
    }
  };

  return (
    <section className="w-full py-8 md:py-12 bg-[#FAF8F5]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        <h2 className="text-[1.05rem] sm:text-[1.2rem] md:text-[1.45rem] font-bold text-[#121316] mb-5 md:mb-7">
          Categories
        </h2>

        {/* Category Pills */}
        <div className="flex gap-2 sm:gap-3 mb-6 overflow-x-auto flex-nowrap sm:flex-wrap pb-2">
          {(categoryItems.length > 0 ? categoryItems : DEFAULT_CATEGORIES).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryPillClick(cat)}
              className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full border text-[0.68rem] sm:text-[0.75rem] font-bold tracking-wider cursor-pointer shrink-0 transition-all duration-200 ${
                activeCategoryId === cat.id
                  ? 'border-[#121316] text-[#121316] bg-white shadow-sm'
                  : 'border-[#E5E7EB] bg-white text-[#4B5563] hover:border-[#121316]'
              }`}
            >
              {cat.name.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Products Grid / Carousel */}
        <div className="min-h-[220px]">
          {catProductsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 min-h-[220px] py-2">
              <div className="w-full h-[280px] rounded-lg bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
              <div className="w-full h-[280px] rounded-lg bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
              <div className="w-full h-[280px] rounded-lg bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
              <div className="w-full h-[280px] rounded-lg bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
            </div>
          ) : activeCategoryProducts.length > 0 ? (
            <ProductCarousel items={activeCategoryProducts} />
          ) : (
            <p className="text-center text-gray-400 text-[0.9rem] py-12">
              No products found for this category.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
