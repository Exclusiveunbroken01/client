// src/app/service/domain/auth/auth.service.ts (or wherever your services live)
import { apiClient } from '@/lib/api/apiClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export async function loginService(credentials: LoginCredentials) {
  // Use apiClient so it gets the right Base URL and error handling
  return apiClient('/auth/login', {
    method: 'POST',
    body: credentials,
  });
}
