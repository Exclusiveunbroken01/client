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
