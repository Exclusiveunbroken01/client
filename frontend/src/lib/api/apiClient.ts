// frontend/src/lib/api/apiClient.ts
export interface ApiOptions<TBody = unknown> {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  query?: Record<string, string | number | boolean | undefined>;
  body?: TBody;
  headers?: Record<string, string>;
}

export async function apiClient<TResponse, TBody = unknown>(
  endpoint: string,
  options?: ApiOptions<TBody>
): Promise<TResponse> {
  const { method = 'GET', query, body, headers } = options || {};

  const cleanQuery = query
  ? Object.fromEntries(
      Object.entries(query).filter((entry) => entry[1] !== undefined)
    )
  : {};

  const queryString = Object.keys(cleanQuery).length > 0
  ? '?' + new URLSearchParams(
      Object.entries(cleanQuery).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString()
  : '';

  const isNextProxiedEndpoint = endpoint.startsWith('/flights') || endpoint.startsWith('/payments');
  const baseUrl = isNextProxiedEndpoint ? '/api' : process.env.NEXT_PUBLIC_API_URL;
  const url = `${baseUrl}${endpoint}${queryString}`;

  const requestHeaders: Record<string, string> = {
    ...headers,
  };

  // Avoid forcing CORS preflight on GET by not sending JSON content type
  // unless there is an actual request body.
  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: requestHeaders,
    cache: 'no-store',
  });

  if (!res.ok) {
    const rawData = await res.text();
    let parsed: unknown;
    try { parsed = JSON.parse(rawData); } catch { parsed = rawData; }
    
    let message = 'API Request failed';

    if (typeof parsed === 'object' && parsed !== null) {
      if (typeof parsed === 'object' && parsed !== null) {
		  const p = parsed as {
			message?: string;
			error?: { message?: string } | string;
		  };

		  message =
			p.message ||
			(typeof p.error === 'object' ? p.error?.message : p.error) ||
			JSON.stringify(p) ||
			message;
		}
    } else if (typeof parsed === 'string') {
      message = parsed;
    }

    // 2. FIXED: Throw the error so 'message' is actually used
    // This also prevents the code from trying to call res.json() on a failed request
    throw new Error(message);
  }

  return res.json();
}

// Shorthand methods
apiClient.get = <TResponse>(endpoint: string, options?: Omit<ApiOptions, 'method' | 'body'>) => 
  apiClient<TResponse>(endpoint, { ...options, method: 'GET' });

apiClient.post = <TResponse, TBody = unknown>(endpoint: string, body?: TBody, options?: Omit<ApiOptions<TBody>, 'method' | 'body'>) => 
  apiClient<TResponse, TBody>(endpoint, { ...options, method: 'POST', body });

apiClient.patch = <TResponse, TBody = unknown>(endpoint: string, body?: TBody, options?: Omit<ApiOptions<TBody>, 'method' | 'body'>) => 
  apiClient<TResponse, TBody>(endpoint, { ...options, method: 'PATCH', body });

apiClient.delete = <TResponse>(endpoint: string, options?: Omit<ApiOptions, 'method' | 'body'>) => 
  apiClient<TResponse>(endpoint, { ...options, method: 'DELETE' });
