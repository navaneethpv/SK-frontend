export function getImageUrl(url?: string | null, fallback: string = '/hero cards/4.png'): string {
  // Uses environment variable or defaults to empty string for Live Domain hosting
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH !== undefined 
    ? process.env.NEXT_PUBLIC_BASE_PATH 
    : '';

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

  // 3. Local public assets in Next.js public/ folder
  if (basePath && !cleanPath.startsWith(basePath)) {
    return `${basePath}${cleanPath}`;
  }

  return cleanPath;
}
