import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, tasksApi, checkInsApi, usersApi, syncApi } from '../api';
import { apiClient } from '../api/client';
import { Task, CheckIn, UserSettings, UserProfile, UserInfo } from '../types';

interface ApiState {
  // 认证状态
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
  
  // 同步状态
  isOnline: boolean;
  lastSyncAt: string | null;
  syncInProgress: boolean;
  
  // 操作
  login: (name: string, email?: string, password?: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  validateAuth: () => Promise<boolean>;
  
  // API 操作
  loadTasks: (date?: string) => Promise<Task[]>;
  createTask: (title: string, date?: string) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<Task>;
  toggleTask: (id: string) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  
  loadCheckIns: (date?: string) => Promise<CheckIn[]>;
  getCheckInByDate: (date: string) => Promise<CheckIn | null>;
  createCheckIn: (checkIn: Omit<CheckIn, 'id'>) => Promise<CheckIn>;
  upsertCheckIn: (checkIn: CheckIn) => Promise<CheckIn>;
  updateCheckIn: (id: string, updates: Partial<CheckIn>) => Promise<CheckIn>;
  deleteCheckIn: (id: string) => Promise<void>;
  
  // 用户信息操作
  loadUserInfo: () => Promise<UserInfo>;
  loadProfile: () => Promise<UserProfile>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<UserProfile>;
  loadSettings: () => Promise<UserSettings>;
  updateSettings: (updates: Partial<UserSettings>) => Promise<UserSettings>;
  
  // 同步操作
  syncToServer: (localData: { tasks: Task[], checkIns: CheckIn[] }) => Promise<void>;
  syncFromServer: () => Promise<{ tasks: Task[], checkIns: CheckIn[] }>;
}

export const useApiStore = create<ApiState>()(
  persist(
    (set, get) => ({
      // 初始状态
      isAuthenticated: false,
      user: null,
      token: null,
      isOnline: true,
      lastSyncAt: null,
      syncInProgress: false,

      // 认证操作
      login: async (name, email, password) => {
        try {
          const response = await authApi.login({ name, email, password });
          // 设置 token 到 localStorage 和 store
          apiClient.setToken(response.accessToken);
          
          // 登录后立即获取完整的用户信息
          const userInfo = await usersApi.getUserInfo();
          
          set({
            isAuthenticated: true,
            user: userInfo.profile,
            token: response.accessToken,
          });
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        }
      },

      register: async (name, email, password) => {
        try {
          const response = await authApi.register({ name, email, password });
          // 设置 token 到 localStorage 和 store
          apiClient.setToken(response.accessToken);
          
          // 注册后立即获取完整的用户信息
          const userInfo = await usersApi.getUserInfo();
          
          set({
            isAuthenticated: true,
            user: userInfo.profile,
            token: response.accessToken,
          });
        } catch (error) {
          console.error('Registration failed:', error);
          throw error;
        }
      },

      logout: () => {
        authApi.logout();
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          lastSyncAt: null,
        });
      },

      validateAuth: async () => {
        try {
          const { token } = get();
          if (!token) return false;
          
          const isValid = await authApi.validateToken();
          if (!isValid) {
            get().logout();
            return false;
          }
          
          // 验证成功后获取最新的用户信息
          try {
            const userInfo = await usersApi.getUserInfo();
            set({ user: userInfo.profile });
          } catch (error) {
            console.warn('Failed to refresh user info on auth validation:', error);
          }
          
          return true;
        } catch {
          get().logout();
          return false;
        }
      },

      // 任务操作
      loadTasks: async (date) => {
        const tasks = await tasksApi.getTasks(date);
        return tasks.map(({ id, title, completed, date }) => ({
          id,
          title,
          completed,
          date,
        }));
      },

      createTask: async (title, date) => {
        const task = await tasksApi.createTask({ title, date });
        return {
          id: task.id,
          title: task.title,
          completed: task.completed,
          date: task.date,
        };
      },

      updateTask: async (id, updates) => {
        const task = await tasksApi.updateTask(id, updates);
        return {
          id: task.id,
          title: task.title,
          completed: task.completed,
          date: task.date,
        };
      },

      toggleTask: async (id) => {
        const task = await tasksApi.toggleTask(id);
        return {
          id: task.id,
          title: task.title,
          completed: task.completed,
          date: task.date,
        };
      },

      deleteTask: async (id) => {
        await tasksApi.deleteTask(id);
      },

      // 打卡操作
      loadCheckIns: async (date) => {
        const checkIns = await checkInsApi.getCheckIns(date);
        return checkIns.map(({ id, date, mood, note }) => ({
          id,
          date,
          mood,
          note,
        }));
      },

      getCheckInByDate: async (date) => {
        const checkIn = await checkInsApi.getCheckInByDate(date);
        if (!checkIn) return null;
        
        return {
          id: checkIn.id,
          date: checkIn.date,
          mood: checkIn.mood,
          note: checkIn.note,
        };
      },

      createCheckIn: async (checkInData) => {
        const checkIn = await checkInsApi.createCheckIn(checkInData);
        return {
          id: checkIn.id,
          date: checkIn.date,
          mood: checkIn.mood,
          note: checkIn.note,
        };
      },

      upsertCheckIn: async (checkIn) => {
        const existing = await checkInsApi.getCheckInByDate(checkIn.date);
        if (existing) {
          const updated = await checkInsApi.updateCheckIn(existing.id, {
            mood: checkIn.mood,
            note: checkIn.note,
          });
          return {
            id: updated.id,
            date: updated.date,
            mood: updated.mood,
            note: updated.note,
          };
        } else {
          const created = await checkInsApi.createCheckIn({
            date: checkIn.date,
            mood: checkIn.mood,
            note: checkIn.note,
          });
          return {
            id: created.id,
            date: created.date,
            mood: created.mood,
            note: created.note,
          };
        }
      },

      updateCheckIn: async (id, updates) => {
        const checkIn = await checkInsApi.updateCheckIn(id, updates);
        return {
          id: checkIn.id,
          date: checkIn.date,
          mood: checkIn.mood,
          note: checkIn.note,
        };
      },

      deleteCheckIn: async (id) => {
        await checkInsApi.deleteCheckIn(id);
      },

      // 个人资料操作
      loadProfile: async () => {
        return usersApi.getProfile();
      },

      updateProfile: async (updates) => {
        return usersApi.updateProfile(updates);
      },

      loadSettings: async () => {
        return usersApi.getSettings();
      },
      // 统一用户信息获取
      loadUserInfo: async () => {
        return usersApi.getUserInfo();
      },
      updateSettings: async (updates) => {
        return usersApi.updateSettings(updates);
      },
      // 同步操作
      syncToServer: async (localData) => {
        set({ syncInProgress: true });
        try {
          const response = await syncApi.uploadData({
            tasks: localData.tasks,
            checkIns: localData.checkIns.map(({ id, date, mood, note }) => ({
              id,
              date,
              mood: mood as 'happy' | 'neutral' | 'sad' | undefined,
              note,
            })),
          });
          set({ lastSyncAt: response.lastSyncAt });
        } finally {
          set({ syncInProgress: false });
        }
      },

      syncFromServer: async () => {
        const { lastSyncAt } = get();
        const data = await syncApi.downloadData(lastSyncAt || undefined);
        
        const tasks = data.tasks.map(({ id, title, completed, date }) => ({
          id,
          title,
          completed,
          date,
        }));
        
        const checkIns = data.checkIns.map(({ id, date, mood, note }) => ({
          id,
          date,
          mood: mood as 'happy' | 'neutral' | 'sad' | undefined,
          note,
        }));
        
        if (data.lastSyncAt) {
          set({ lastSyncAt: data.lastSyncAt });
        }
        
        return { tasks, checkIns };
      },
    }),
    {
      name: 'api-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        lastSyncAt: state.lastSyncAt,
      }),

    }
  )
);