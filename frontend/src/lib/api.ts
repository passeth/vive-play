const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  role: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  product_type: string;
  target_customer: string;
  keywords: string[];
  concept?: string;
  status: string;
  progress: number;
  created_at: string;
  updated_at: string;
  trend_count?: number;
  ai_product_name?: string;
}

export interface AISuggestion {
  id: string;
  project_id: string;
  product_name: string;
  concept: string;
  ingredients: Array<{
    name: string;
    percentage?: string;
    purpose: string;
  }>;
  design: {
    packaging: string;
    color: string;
    size: string;
    style: string;
  };
  target_price: string;
  features: string[];
  is_accepted: boolean;
  version: number;
  created_at: string;
}

export interface Trend {
  id: string;
  title: string;
  description: string;
  category_id: string;
  category_name: string;
  category_color: string;
  tags: string[];
  popularity_score: number;
  is_featured: boolean;
  created_at: string;
}

export interface TrendCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}

// API Client Class
class APIClient {
  private token: string | null = null;

  constructor() {
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async register(userData: {
    email: string;
    password: string;
    name: string;
    company?: string;
  }) {
    const response = await this.request<{
      token: string;
      user: User;
      message: string;
    }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    this.setToken(response.token);
    return response;
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.request<{
      token: string;
      user: User;
      message: string;
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    this.setToken(response.token);
    return response;
  }

  async getProfile() {
    return this.request<{ user: User }>('/api/auth/me');
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Project methods
  async getProjects() {
    return this.request<{ projects: Project[] }>('/api/projects');
  }

  async getProject(id: string) {
    return this.request<{
      project: Project;
      trends: Trend[];
      aiSuggestions: AISuggestion[];
    }>(`/api/projects/${id}`);
  }

  async createProject(projectData: {
    name: string;
    description?: string;
    productType: string;
    targetCustomer: string;
    keywords?: string[];
    concept?: string;
  }) {
    return this.request<{ project: Project }>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(id: string, updates: Partial<Project>) {
    return this.request<{ project: Project }>(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteProject(id: string) {
    return this.request<{ message: string }>(`/api/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // AI methods
  async generateAISuggestion(projectId: string, regenerate = false) {
    return this.request<{
      suggestion: AISuggestion;
      message: string;
    }>('/api/ai/generate', {
      method: 'POST',
      body: JSON.stringify({ projectId, regenerate }),
    });
  }

  async acceptAISuggestion(suggestionId: string) {
    return this.request<{ message: string }>(`/api/ai/accept/${suggestionId}`, {
      method: 'POST',
    });
  }

  async getAISuggestions(projectId: string) {
    return this.request<{ suggestions: AISuggestion[] }>(`/api/ai/suggestions/${projectId}`);
  }

  // Trend methods
  async getTrends(params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    const endpoint = `/api/trends${queryString ? `?${queryString}` : ''}`;

    return this.request<{
      trends: Trend[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalCount: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    }>(endpoint);
  }

  async getTrendCategories() {
    return this.request<{ categories: TrendCategory[] }>('/api/trends/categories');
  }

  async getTrend(id: string) {
    return this.request<{ trend: Trend }>(`/api/trends/${id}`);
  }

  async pinTrend(trendId: string, notes?: string) {
    return this.request<{ message: string }>('/api/trends/pin', {
      method: 'POST',
      body: JSON.stringify({ trendId, notes }),
    });
  }

  async unpinTrend(trendId: string) {
    return this.request<{ message: string }>(`/api/trends/pin/${trendId}`, {
      method: 'DELETE',
    });
  }

  async getUserPins(page = 1, limit = 20) {
    return this.request<{
      pins: (Trend & { notes?: string; pinned_at: string })[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalCount: number;
      };
    }>(`/api/trends/user/pins?page=${page}&limit=${limit}`);
  }

  async checkTrendPinStatus(trendId: string) {
    return this.request<{ isPinned: boolean }>(`/api/trends/${trendId}/pinned`);
  }
}

// Export singleton instance
export const apiClient = new APIClient();

// Export individual functions for easier use
export const auth = {
  register: (userData: Parameters<APIClient['register']>[0]) => apiClient.register(userData),
  login: (credentials: Parameters<APIClient['login']>[0]) => apiClient.login(credentials),
  getProfile: () => apiClient.getProfile(),
  logout: () => apiClient.clearToken(),
  isAuthenticated: () => apiClient.isAuthenticated(),
};

export const projects = {
  getAll: () => apiClient.getProjects(),
  get: (id: string) => apiClient.getProject(id),
  create: (data: Parameters<APIClient['createProject']>[0]) => apiClient.createProject(data),
  update: (id: string, updates: Parameters<APIClient['updateProject']>[1]) => 
    apiClient.updateProject(id, updates),
  delete: (id: string) => apiClient.deleteProject(id),
};

export const ai = {
  generate: (projectId: string, regenerate?: boolean) => 
    apiClient.generateAISuggestion(projectId, regenerate),
  accept: (suggestionId: string) => apiClient.acceptAISuggestion(suggestionId),
  getSuggestions: (projectId: string) => apiClient.getAISuggestions(projectId),
};

export const trends = {
  getAll: (params?: Parameters<APIClient['getTrends']>[0]) => apiClient.getTrends(params),
  getCategories: () => apiClient.getTrendCategories(),
  get: (id: string) => apiClient.getTrend(id),
  pin: (trendId: string, notes?: string) => apiClient.pinTrend(trendId, notes),
  unpin: (trendId: string) => apiClient.unpinTrend(trendId),
  getUserPins: (page?: number, limit?: number) => apiClient.getUserPins(page, limit),
  checkPinStatus: (trendId: string) => apiClient.checkTrendPinStatus(trendId),
};