import { apiFetch } from '../baseUrl';
import { IProduct } from '@/types/product';
import { ICategory, IProductGroup } from '@/types/category';
import { IBrand } from '@/types/brand';
import {
  ISlide,
  IFlair,
  ISocialMedia,
  IVideoBanner,
  IPolicy,
  IAbout,
  IBlog,
  IVersion,
  ITestimonial,
  ISearchHint,
  IAuthor
} from '@/types/home';

// Helper to safely extract an array from plain arrays or paginated DRF objects ({ results: [...] }, { data: [...] })
function ensureArray<T>(res: any): T[] {
  if (Array.isArray(res)) return res;
  if (res && typeof res === 'object') {
    if (Array.isArray(res.results)) return res.results;
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.products)) return res.products;
    if (Array.isArray(res.items)) return res.items;
  }
  return [];
}

export const productAPI = {
  // 1. Slides / Hero Banners
  getSlides: async (): Promise<ISlide[]> => {
    return apiFetch<ISlide[]>('slides');
  },

  // 2. Promotional Flairs
  getFlairs: async (): Promise<IFlair[]> => {
    return apiFetch<IFlair[]>('flairs');
  },

  // 3. Social Medias
  getSocialMedias: async (): Promise<ISocialMedia[]> => {
    return apiFetch<ISocialMedia[]>('social-medias');
  },

  // 4. Video Banners
  getVideoBanners: async (): Promise<IVideoBanner[]> => {
    return apiFetch<IVideoBanner[]>('video-banners');
  },

  // 5. Site Policies
  getPolicies: async (): Promise<IPolicy[]> => {
    return apiFetch<IPolicy[]>('policies');
  },

  // 6. About Info
  getAbouts: async (): Promise<IAbout[]> => {
    return apiFetch<IAbout[]>('Home/abouts');
  },

  // 7. Product Groups
  getProductGroups: async (): Promise<IProductGroup[]> => {
    return apiFetch<IProductGroup[]>('product-groups');
  },

  // 8. Product Group by ID
  getProductGroupById: async (pk: number): Promise<IProductGroup> => {
    return apiFetch<IProductGroup>(`product-groups/${pk}`);
  },

  // 9. Single Product by ID
  getProductById: async (id: number): Promise<IProduct> => {
    return apiFetch<IProduct>(`products/${id}`);
  },

  // 10. Get all products with query parameters
  getProducts: async (params?: Record<string, string>): Promise<IProduct[]> => {
    let query = '';
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams(params);
      query = `?${searchParams.toString()}`;
    }
    return apiFetch<IProduct[]>(`products${query}`);
  },

  // 11. Blogs
  getBlogs: async (): Promise<IBlog[]> => {
    return apiFetch<IBlog[]>('blogs');
  },

  // 12. Blog by ID
  getBlogById: async (id: number): Promise<IBlog> => {
    return apiFetch<IBlog>(`blogs/${id}`);
  },

  // 13. API Version
  getVersion: async (): Promise<IVersion> => {
    return apiFetch<IVersion>('version');
  },

  // 14. Trending Products
  getTrendingProducts: async (): Promise<IProduct[]> => {
    return apiFetch<IProduct[]>('trending-products');
  },

  // 15. Trending Product Groups
  getTrendingProductGroups: async (): Promise<IProductGroup[]> => {
    return apiFetch<IProductGroup[]>('trending-product-groups');
  },

  // 16. Trending Product Group Detail
  getTrendingProductGroupById: async (pk: number): Promise<IProductGroup> => {
    return apiFetch<IProductGroup>(`trending-product-groups/${pk}`);
  },

  // 17. Similar Products
  getSimilarProducts: async (productId: number, count: number = 4): Promise<IProduct[]> => {
    return apiFetch<IProduct[]>(`similar-products/${productId}/${count}`);
  },

  // 18. All Offers
  getOffers: async (): Promise<IProduct[]> => {
    return apiFetch<IProduct[]>('offers');
  },

  // 19. Offers with limited count
  getOfferProductsByCount: async (count: number): Promise<IProduct[]> => {
    return apiFetch<IProduct[]>(`offers/${count}`);
  },

  // 20. Best Selling Categories
  getBestSellingCategories: async (count: number = 6): Promise<ICategory[]> => {
    return apiFetch<ICategory[]>(`Home/best-selling-categories/${count}`);
  },

  // 20b. Combo Categories for Home Page Bundle Section
  getComboCategories: async (count: number = 3): Promise<ICategory[]> => {
    return apiFetch<ICategory[]>(`Home/combo-categories/${count}`);
  },

  // 20c. Combo Products for Home Page Bundle Section
  getComboProducts: async (): Promise<IProduct[]> => {
    return apiFetch<IProduct[]>('Home/combo-products');
  },

  // 21. New Arrivals
  getNewArrivals: async (): Promise<IProduct[]> => {
    return apiFetch<IProduct[]>('new-arrivals');
  },

  // 22. Best Sellers
  getBestSellers: async (): Promise<IProduct[]> => {
    return apiFetch<IProduct[]>('best-sellers');
  },

  // 23. Home Testimonials
  getHomeTestimonials: async (): Promise<ITestimonial[]> => {
    return apiFetch<ITestimonial[]>('home-testimonials');
  },

  // 24. Feature / Highlighted Products
  getFeatureProducts: async (): Promise<IProduct[]> => {
    return apiFetch<IProduct[]>('feature-products');
  },

  // 25. Product Search Hint
  getProductSearchHint: async (query?: string): Promise<ISearchHint[]> => {
    const q = query ? `?q=${encodeURIComponent(query)}` : '';
    return apiFetch<ISearchHint[]>(`products/search-hint${q}`);
  },

  // 26. Product Group Search Hint
  getProductGroupSearchHint: async (query?: string): Promise<ISearchHint[]> => {
    const q = query ? `?q=${encodeURIComponent(query)}` : '';
    return apiFetch<ISearchHint[]>(`product-groups/search-hint${q}`);
  },

  // 27. Related Products
  getRelatedProducts: async (productId: number, count: number = 4): Promise<IProduct[]> => {
    return apiFetch<IProduct[]>(`Home/related-products/${productId}/${count}`);
  },

  // 28. Authors
  getAuthors: async (): Promise<IAuthor[]> => {
    return apiFetch<IAuthor[]>('authors');
  },

  // 29. Evergreen Products
  getEvergreen: async (): Promise<IProduct[]> => {
    return apiFetch<IProduct[]>('evergreen');
  },

  // 30. Popular Products Home (Last 7 days)
  getPopularProductsHome: async (): Promise<IProduct[]> => {
    return apiFetch<IProduct[]>('popular-products-home');
  },

  // 31. Deal Of The Day Home
  getDealOfTheDayHome: async (): Promise<IProduct[]> => {
    return apiFetch<IProduct[]>('deal-of-the-day-home');
  },

  // 32. Best Sellers Home
  getBestSellersHome: async (): Promise<IProduct[]> => {
    return apiFetch<IProduct[]>('best-sellers-home');
  },

  // 33. Product Search
  searchProducts: async (query: string): Promise<IProduct[]> => {
    return apiFetch<IProduct[]>(`search?q=${encodeURIComponent(query)}`);
  },

  // 34. Brands List
  getBrands: async (): Promise<IBrand[]> => {
    return apiFetch<IBrand[]>('brands');
  },

  // 35. Brand Detail
  getBrandById: async (brandId: number): Promise<IBrand> => {
    return apiFetch<IBrand>(`brands/${brandId}`);
  },

  // 36. Complete Sale Order By Feedback
  completeSaleOrderByFeedback: async (saleOrderId: number, data?: any): Promise<any> => {
    return apiFetch<any>(`complete-sale-order-by-feedback/${saleOrderId}`, {
      method: 'POST',
      body: JSON.stringify(data || {})
    });
  },

  // 37. Sale Order Feedback
  getSaleOrderFeedback: async (saleOrderId: number): Promise<any> => {
    return apiFetch<any>(`feedbacks/sale-order/${saleOrderId}`);
  },

  // 38. All Categories List (Home/categories)
  getCategories: async (): Promise<ICategory[]> => {
    const res = await apiFetch<any>('Home/categories');
    return ensureArray<ICategory>(res);
  },

  // 39. Category Products by Category PK
  getCategoryProducts: async (pk: number): Promise<IProduct[]> => {
    const res = await apiFetch<any>(`categories/products/${pk}`);
    return ensureArray<IProduct>(res);
  },

  // 40. Author Products
  getAuthorProducts: async (authorId: number): Promise<IProduct[]> => {
    return apiFetch<IProduct[]>(`author-products/${authorId}`);
  },

  // 41. Latest Products
  getLatestProducts: async (): Promise<IProduct[]> => {
    return apiFetch<IProduct[]>('latest-products');
  }
};
