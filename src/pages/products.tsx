import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ProductsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/shop');
  }, [router]);

  return null;
}
