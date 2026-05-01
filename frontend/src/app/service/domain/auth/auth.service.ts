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

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export async function loginService(payload: LoginPayload) {
  return apiClient<LoginResponse, LoginPayload>('/auth/login', {
    method: 'POST',
    body: payload,
    headers: {
      // IMPORTANT for cookie sessions
      'Content-Type': 'application/json',
    },
  });
}
