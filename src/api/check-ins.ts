import { apiClient } from './client';
import { CheckIn } from '../types';

export interface CreateCheckInRequest {
  date: string;
  mood?: 'happy' | 'neutral' | 'sad';
  note?: string;
}

export interface UpdateCheckInRequest {
  mood?: 'happy' | 'neutral' | 'sad';
  note?: string;
}

export interface CheckInResponse extends CheckIn {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export const checkInsApi = {
  async getCheckIns(date?: string): Promise<CheckInResponse[]> {
    const query = date ? `?date=${date}` : '';
    return apiClient.get<CheckInResponse[]>(`/check-ins${query}`);
  },

  async getCheckInByDate(date: string): Promise<CheckInResponse | null> {
    return apiClient.get<CheckInResponse | null>(`/check-ins/date/${date}`);
  },

  async createCheckIn(data: CreateCheckInRequest): Promise<CheckInResponse> {
    return apiClient.post<CheckInResponse>('/check-ins', data);
  },

  async updateCheckIn(id: string, data: UpdateCheckInRequest): Promise<CheckInResponse> {
    return apiClient.patch<CheckInResponse>(`/check-ins/${id}`, data);
  },

  async upsertCheckIn(data: CreateCheckInRequest): Promise<CheckInResponse> {
    return apiClient.post<CheckInResponse>('/check-ins/upsert', data);
  },

  async deleteCheckIn(id: string): Promise<void> {
    return apiClient.delete(`/check-ins/${id}`);
  },
};