import { apiClient } from './client';
import { Task } from '../types';

export interface CreateTaskRequest {
  title: string;
  date?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  completed?: boolean;
  date?: string;
}

export interface TaskResponse extends Task {
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export const tasksApi = {
  async getTasks(date?: string): Promise<TaskResponse[]> {
    const query = date ? `?date=${date}` : '';
    return apiClient.get<TaskResponse[]>(`/tasks${query}`);
  },

  async createTask(data: CreateTaskRequest): Promise<TaskResponse> {
    return apiClient.post<TaskResponse>('/tasks', data);
  },

  async updateTask(id: string, data: UpdateTaskRequest): Promise<TaskResponse> {
    return apiClient.patch<TaskResponse>(`/tasks/${id}`, data);
  },

  async toggleTask(id: string): Promise<TaskResponse> {
    return apiClient.patch<TaskResponse>(`/tasks/${id}/toggle`);
  },

  async deleteTask(id: string): Promise<void> {
    return apiClient.delete(`/tasks/${id}`);
  },
};