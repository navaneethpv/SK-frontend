export function getImageUrl(url?: string | null, fallback: string = '/hero cards/4.png'): string {
  const target = (url && typeof url === 'string' && url.trim()) ? url.trim() : fallback;

  // 1. External absolute URLs or Data URIs
  if (target.startsWith('http://') || target.startsWith('https://') || target.startsWith('data:')) {
    return target;
  }

  const cleanPath = target.startsWith('/') ? target : `/${target}`;

  // 2. Backend API media files (starts with /media/)
  if (cleanPath.startsWith('/media/')) {
    const backendBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.1.95:8000";
    return `${backendBase.replace(/\/$/, '')}${cleanPath}`;
  }

  // 3. Local public assets in Next.js public/ folder (e.g. /images/..., /banners/..., /SK Logo.svg)
  // Ensures /SK is prepended for XAMPP subfolder hosting
  const basePath = '/SK';
  if (cleanPath.startsWith(basePath)) {
    return cleanPath;
  }

  return `${basePath}${cleanPath}`;
}
