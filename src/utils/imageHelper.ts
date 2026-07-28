export function getImageUrl(url?: string | null, fallback: string = '/hero cards/4.png'): string {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return fallback;
  }
  const clean = url.trim();

  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:')) {
    return clean;
  }

  // Handle relative backend paths like "media/..." or "/media/..."
  const backendBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.1.95:8000";
  const path = clean.startsWith('/') ? clean : `/${clean}`;
  return `${backendBase.replace(/\/$/, '')}${path}`;
}
