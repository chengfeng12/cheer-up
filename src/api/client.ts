const API_BASE_URL = 'http://localhost:3003/api';

interface ApiClient {
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data?: any): Promise<T>;
  patch<T>(url: string, data?: any): Promise<T>;
  delete<T>(url: string): Promise<T>;
}

class ApiClientImpl implements ApiClient {
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  clearToken() {
    localStorage.removeItem('token');
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    url: string,
    data?: any
  ): Promise<T> {
    const token = this.getToken();
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    if (data && method !== 'GET') {
      config.body = JSON.stringify(data);
    }

    let response: Response;
    
    try {
      response = await fetch(`${API_BASE_URL}${url}`, config);
    } catch (error) {
      console.error('网络请求失败:', {
        url: `${API_BASE_URL}${url}`,
        method,
        config,
        error: error.message,
      });
      throw new Error(`网络连接失败: ${error.message}`);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || `HTTP error! status: ${response.status}`) as any;
      error.status = response.status;
      error.code = errorData.code;
      throw error;
    }

    return response.json();
  }

  async get<T>(url: string): Promise<T> {
    return this.request<T>('GET', url);
  }

  async post<T>(url: string, data?: any): Promise<T> {
    return this.request<T>('POST', url, data);
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    return this.request<T>('PATCH', url, data);
  }

  async delete<T>(url: string): Promise<T> {
    return this.request<T>('DELETE', url);
  }
}

export const apiClient = new ApiClientImpl();