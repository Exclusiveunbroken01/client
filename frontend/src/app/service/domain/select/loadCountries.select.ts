import { TCountryListResponse } from '@/lib/hooks/defaults/countries.hook';

let cachedCountries: TCountryListResponse | null = null;

export async function serviceLoadCountries() {
  if (cachedCountries) return cachedCountries;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/countries`,
    {
      cache: 'no-store', // ensures fresh data in SSR
    }
  );

  if (!res.ok) {
    throw new Error('Failed to load countries');
  }

  const data: TCountryListResponse = await res.json();

  cachedCountries = data;

  return data;
}
