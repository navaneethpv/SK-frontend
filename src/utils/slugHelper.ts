export function slugify(text?: string | null): string {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getProductSlug(item: any): string {
  if (!item) return 'product';
  if (typeof item === 'string') return slugify(item);
  const candidate = item.slug || item.alias || item.title || item.name || item.sdescription;
  const slugified = slugify(candidate);
  if (slugified) return slugified;
  return `product-${item.id || 1}`;
}

export function formatProductTitle(text?: string | null): string {
  if (!text || typeof text !== 'string') return 'SK Selection';
  if (text.includes('-') && !text.includes(' ')) {
    return text
      .replace(/-book$/i, '')
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }
  return text;
}
