import apiInstance from '@/api/apiInstance';

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Automatically prefix with Home/ if not already present or specialized path
  let path = endpoint.replace(/^\//, '');
  if (
    !path.startsWith('Home/') &&
    !path.startsWith('Auth/') &&
    !path.startsWith('ecommerce/') &&
    !path.startsWith('Product/') &&
    !path.startsWith('Account/') &&
    !path.startsWith('Transaction/')
  ) {
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
    const status = error?.response?.status;
    const isHtml = typeof error?.response?.data === 'string' && error?.response?.data.includes('<html');
    const msg = isHtml
      ? `HTTP ${status || 404} (${error?.response?.statusText || 'Not Found'})`
      : error?.response?.data || error?.message || error;

    console.warn(`[apiFetch] API call for "${path}" failed:`, msg);
    throw error;
  }
}
