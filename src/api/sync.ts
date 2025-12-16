import { apiClient } from './client';
import { Task, CheckIn } from '../types';

export interface SyncData {
  tasks: Array<{
    id: string;
    title: string;
    completed: boolean;
    date: string;
    createdAt?: string;
    updatedAt?: string;
  }>;
  checkIns: Array<{
    id: string;
    date: string;
    mood?: string;
    note?: string;
    createdAt?: string;
    updatedAt?: string;
  }>;
  lastSyncAt?: string;
}

export interface SyncResponse {
  message: string;
  lastSyncAt: string;
}

export const syncApi = {
  async uploadData(data: SyncData): Promise<SyncResponse> {
    return apiClient.post<SyncResponse>('/sync/upload', data);
  },

  async downloadData(lastSyncAt?: string): Promise<SyncData> {
    const query = lastSyncAt ? `?lastSyncAt=${lastSyncAt}` : '';
    return apiClient.get<SyncData>(`/sync/download${query}`);
  },
};