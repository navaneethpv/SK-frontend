import apiInstance from '@/apiInstance';

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Automatically prefix with Home/ if not already present or specialized path
  let path = endpoint.replace(/^\//, '');
  if (!path.startsWith('Home/') && !path.startsWith('Auth/') && !path.startsWith('ecommerce/')) {
    path = `Home/${path}`;
  }

  try {
    const method = (options.method || 'GET').toLowerCase();
    let bodyData: any = undefined;

    if (options.body) {
      if (typeof options.body === 'string') {
        try {
          bodyData = JSON.parse(options.body);
        } catch (_) {
          bodyData = options.body;
        }
      } else {
        bodyData = options.body;
      }
    }

    const response = await apiInstance.request<T>({
      url: path,
      method,
      data: bodyData,
      headers: options.headers as any
    });

    return response.data;
  } catch (error: any) {
    console.warn(`[apiFetch] API call failed for endpoint "${path}":`, error?.response?.data || error?.message || error);
    throw error;
  }
}
