// src/lib/api/auth.service.ts

// 1. Define the interface for the login data
export interface LoginCredentials {
  email: string;
  password: string;
}

// 2. Define the expected shape of your successful response (Optional but recommended)
export interface AuthResponse {
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      name?: string;
    };
  };
  message?: string;
}

// 3. Update the function to use the specific type
export async function loginUser(data: LoginCredentials) {
  const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const response = await res.json();

  if (!res.ok) {
    // Assuming ApiError is imported or defined elsewhere in your project
    throw new Error(response.message || 'Login failed');
  }

  return response.data;
}
