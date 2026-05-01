import { apiClient } from '@/lib/api/apiClient';

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export async function registerService(payload: RegisterPayload) {
  return apiClient('/auth/register', {
    method: 'POST',
    body: payload,
  });
}

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
