// src/lib/utils/recent-searches.util.ts

import { AirportLocationValue } from '@/lib/types/server/airport.types';

const STORAGE_KEY = 'recent_airport_searches';
const MAX_ITEMS = 5;

/**
 * Get recent searches from localStorage
 */
export function getRecentSearches(): AirportLocationValue[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Add a new recent search
 */
export function addRecentSearch(item: AirportLocationValue) {
  if (typeof window === 'undefined') return;

  try {
    const current = getRecentSearches();

    // Remove duplicate if exists
    const filtered = current.filter(
      (i) => i.city_code !== item.city_code
    );

    const updated = [item, ...filtered].slice(0, MAX_ITEMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // fail silently
  }
}
