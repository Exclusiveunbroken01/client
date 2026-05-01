import { apiClient } from '@/lib/api/apiClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  token?: string;
}

export async function loginUser(data: LoginCredentials) {
  return apiClient<AuthResponse, LoginCredentials>(
    '/auth/login',
    {
      method: 'POST',
      body: data,
    }
  );
}
