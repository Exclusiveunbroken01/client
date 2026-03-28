// src/app/service/domain/utilities/airport.service.ts

import { apiClient } from '@/lib/api/apiClient';

export async function searchAirportService(query: string) {
  if (!query.trim()) return [];

  return apiClient('/flights/airports', {
    query: { keyword: query },
  });
}
