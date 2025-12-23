const API_BASE_URL = '/api';

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
    } catch (error: any) {
      console.error('网络请求失败:', {
        url: `${API_BASE_URL}${url}`,
        method,
        config,
        error: error.message,
      });
      throw new Error(`网络连接失败: ${error.message}`);
    }

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok || (responseData && responseData.success === false)) {
      const message = responseData.message || `HTTP error! status: ${response.status}`;
      const error = new Error(message) as any;
      error.status = response.status;
      error.code = responseData.code; // Business error code
      throw error;
    }

    return responseData;
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