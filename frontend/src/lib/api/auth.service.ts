import { apiClient } from '@/lib/api/apiClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

export async function loginUser(payload: LoginCredentials) {
  return apiClient<AuthResponse, LoginCredentials>(
    '/auth/login',
    {
      method: 'POST',
      body: payload,
    }
  );
}
