import { ApiError } from '@/lib/utils/errors/api-error.util';

export async function apiClient<TResponse, TBody = unknown>(
  endpoint: string,
  options?: ApiOptions<TBody>
): Promise<TResponse> {
  const { method = 'GET', query, body, headers } = options || {};

  const queryString = query
    ? '?' +
      Object.entries(query)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&')
    : '';

  const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}${queryString}`;

  const res = await fetch(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const rawData = await res.text();
    let parsed: any;
    try { parsed = JSON.parse(rawData); } catch { parsed = rawData; }
    throw new ApiError(res.status, 'API Request failed', parsed);
  }

  return res.json();
}
