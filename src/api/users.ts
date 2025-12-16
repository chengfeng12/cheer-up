import { apiClient } from './client';

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  avatar?: string;
}

export interface UpdateSettingsRequest {
  theme?: 'light' | 'dark' | 'system';
  primaryColor?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  isGuest: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  id: string;
  theme: 'light' | 'dark' | 'system';
  primaryColor: string;
  userId: string;
}

export interface UserStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  totalCheckIns: number;
}

export interface UserInfo {
  profile: UserProfile;
  settings: UserSettings;
  stats: UserStats;
}

export const usersApi = {
  async getProfile(): Promise<UserProfile> {
    return apiClient.get<UserProfile>('/users/profile');
  },

  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    return apiClient.patch<UserProfile>('/users/profile', data);
  },

  async getSettings(): Promise<UserSettings> {
    return apiClient.get<UserSettings>('/users/settings');
  },

  async updateSettings(data: UpdateSettingsRequest): Promise<UserSettings> {
    return apiClient.patch<UserSettings>('/users/settings', data);
  },

  async getStats(): Promise<UserStats> {
    return apiClient.get<UserStats>('/users/stats');
  },

  async getUserInfo(): Promise<UserInfo> {
    return apiClient.get<UserInfo>('/users/info');
  },
};