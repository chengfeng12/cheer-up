import { apiClient } from './client';

export interface LoginRequest {
  name: string;
  email?: string;
  password?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
    isGuest: boolean;
  };
  accessToken: string;
}

export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/register', userData);
  },

  async validateToken(): Promise<boolean> {
    try {
      await apiClient.post('/auth/validate');
      return true;
    } catch {
      return false;
    }
  },

  logout() {
    apiClient.clearToken();
  },
};