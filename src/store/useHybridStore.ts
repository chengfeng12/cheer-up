import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, CheckIn, UserSettings, UserProfile } from '../types';
import { useApiStore } from './useApiStore';
import { useErrorStore } from './useErrorStore';
import { format } from 'date-fns';

interface HybridState {
  // 本地状态（与之前相同）
  tasks: Task[];
  checkIns: CheckIn[];
  settings: UserSettings;
  user: UserProfile | null;

  // 同步设置
  syncEnabled: boolean;
  autoSync: boolean;
  pendingSync: boolean;

  // 本地和 API 都可用的操作
  addTask: (title: string, date?: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addCheckIn: (checkIn: CheckIn) => Promise<void>;
  removeCheckIn: (date: string) => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  login: (name: string, email?: string, password?: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;

  // 同步相关操作
  enableSync: () => void;
  disableSync: () => void;
  syncNow: () => Promise<void>;

  // 选择器
  getTasksByDate: (date: string) => Task[];
  getCheckInByDate: (date: string) => CheckIn | undefined;

  // 计算属性
  // 计算属性
  isAuthenticated: () => boolean;
  validateAuth: () => Promise<boolean>;
}

export const useHybridStore = create<HybridState>()(
  persist(
    (set, get) => {
      // 显示错误的辅助函数
      const showError = (message: string, type: 'error' | 'warning' = 'error') => {
        try {
          const { showError } = useErrorStore.getState();
          showError(message, type);
        } catch {
          console.error(message);
        }
      };

      // 如果启用则与 API 同步的辅助函数
      const syncWithApi = async () => {
        const { syncEnabled } = get();
        if (!syncEnabled || !get().isAuthenticated()) return;

        try {
          const apiStore = useApiStore.getState();

          // 上传本地更改到服务器
          const { tasks, checkIns } = get();
          await apiStore.syncToServer({ tasks, checkIns });

          // 从服务器下载最新数据
          const { tasks: serverTasks, checkIns: serverCheckIns } = await apiStore.syncFromServer();

          // 合并本地和服务器数据
          set({
            tasks: serverTasks,
            checkIns: serverCheckIns,
            pendingSync: false,
          });
        } catch (error) {
          const { showError } = useErrorStore.getState();
          showError('数据同步失败，请检查网络连接', 'error');
          console.error('同步失败:', error);
          set({ pendingSync: true });
        }
      };

      // 计算属性
      const isAuthenticated = () => {
        return useApiStore.getState().isAuthenticated;
      };

      return {
        // 初始状态
        tasks: [],
        checkIns: [],
        settings: {
          theme: 'light',
          primaryColor: '#10b981',
        },
        user: null,
        syncEnabled: false,
        autoSync: true,
        pendingSync: false,

        // 任务操作
        addTask: async (title: string, date: string = format(new Date(), 'yyyy-MM-dd')) => {
          const newTask = {
            id: crypto.randomUUID(),
            title,
            completed: false,
            date,
          };

          // 立即添加到本地状态
          set((state) => ({
            tasks: [...state.tasks, newTask],
            pendingSync: true,
          }));

          // 如果启用则同步到 API
          const { syncEnabled } = get();
          if (syncEnabled && isAuthenticated()) {
            try {
              const apiStore = useApiStore.getState();
              await apiStore.createTask(title, date);
              set({ pendingSync: false });
            } catch (error) {
              console.error('Failed to create task on server:', error);
              showError('创建任务失败，请稍后重试', 'warning');
            }
          }
        },

        toggleTask: async (id: string) => {
          // 立即更新本地状态
          const task = get().tasks.find((t) => t.id === id);
          if (!task) return;

          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === id ? { ...t, completed: !t.completed } : t
            ),
            pendingSync: true,
          }));

          // 如果启用则同步到 API
          const { syncEnabled } = get();
          if (syncEnabled && isAuthenticated()) {
            try {
              const apiStore = useApiStore.getState();
              await apiStore.toggleTask(id);
              set({ pendingSync: false });
            } catch (error) {
              console.error('在服务器上切换任务状态失败:', error);
              showError('更新任务状态失败', 'warning');
              // 出错时恢复本地更改
              set((state) => ({
                tasks: state.tasks.map((t) =>
                  t.id === id ? { ...t, completed: task.completed } : t
                ),
              }));
            }
          }
        },

        deleteTask: async (id: string) => {
          // 保留任务以便回滚
          const taskToDelete = get().tasks.find((t) => t.id === id);
          if (!taskToDelete) return;

          // 立即更新本地状态
          set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== id),
            pendingSync: true,
          }));

          // 如果启用则同步到 API
          const { syncEnabled } = get();
          if (syncEnabled && isAuthenticated()) {
            try {
              const apiStore = useApiStore.getState();
              await apiStore.deleteTask(id);
              set({ pendingSync: false });
            } catch (error) {
              console.error('Failed to delete task on server:', error);
              showError('删除任务失败，请稍后重试', 'warning');
              // 出错时恢复任务
              set((state) => ({
                tasks: [...state.tasks, taskToDelete],
              }));
            }
          }
        },

        // 打卡操作
        addCheckIn: async (checkIn: CheckIn) => {
          // 立即更新本地状态
          set((state) => ({
            checkIns: [
              ...state.checkIns.filter((c) => c.date !== checkIn.date),
              checkIn,
            ],
            pendingSync: true,
          }));

          // 如果启用则同步到 API
          const { syncEnabled } = get();
          if (syncEnabled && isAuthenticated()) {
            try {
              const apiStore = useApiStore.getState();
              await apiStore.upsertCheckIn(checkIn);
              set({ pendingSync: false });
            } catch (error) {
              console.error('Failed to create check-in on server:', error);
            }
          }
        },

        removeCheckIn: async (date: string) => {
          // 保留打卡记录以便回滚
          const checkInToRemove = get().checkIns.find((c) => c.date === date);
          if (!checkInToRemove) return;

          // 立即更新本地状态
          set((state) => ({
            checkIns: state.checkIns.filter((c) => c.date !== date),
            pendingSync: true,
          }));

          // 如果启用则同步到 API
          const { syncEnabled } = get();
          if (syncEnabled && isAuthenticated() && checkInToRemove.id) {
            try {
              const apiStore = useApiStore.getState();
              await apiStore.deleteCheckIn(checkInToRemove.id);
              set({ pendingSync: false });
            } catch (error) {
              console.error('Failed to delete check-in on server:', error);
              // 出错时恢复打卡记录
              set((state) => ({
                checkIns: [...state.checkIns, checkInToRemove],
              }));
            }
          }
        },

        // 设置操作
        updateSettings: async (newSettings: Partial<UserSettings>) => {
          set((state) => ({
            settings: { ...state.settings, ...newSettings },
            pendingSync: true,
          }));

          // 如果启用则同步到 API
          const { syncEnabled } = get();
          if (syncEnabled && isAuthenticated()) {
            try {
              const apiStore = useApiStore.getState();
              await apiStore.updateSettings(newSettings);
              set({ pendingSync: false });
            } catch (error) {
              const { showError } = useErrorStore.getState();
              showError('设置更新失败，请稍后重试', 'error');
              console.error('Failed to update settings on server:', error);
            }
          }
        },

        // 认证操作
        login: async (name: string, email: string, password: string) => {
          // 通过 API 登录（必需）
          try {
            const apiStore = useApiStore.getState();
            await apiStore.login('', email, password); // name is not needed for login

            set({
              user: apiStore.user!,
              syncEnabled: true,
            });
          } catch (error) {
            // const { showError } = useErrorStore.getState();
            // showError('登录失败，请检查用户名和密码', 'error');
            console.error('Login failed:', error);
            throw error;
          }
        },

        register: async (name: string, email: string, password: string) => {
          try {
            const apiStore = useApiStore.getState();
            await apiStore.register(name, email, password);

            set({
              user: apiStore.user!,
              syncEnabled: true,
            });
          } catch (error) {
            const { showError } = useErrorStore.getState();
            showError('注册失败，请稍后重试', 'error');
            console.error('Registration failed:', error);
            throw error;
          }
        },

        logout: () => {
          const apiStore = useApiStore.getState();
          apiStore.logout();

          set({
            user: null,
            syncEnabled: false,
            pendingSync: false,
          });
        },

        // 同步控制操作
        enableSync: () => {
          if (isAuthenticated()) {
            set({ syncEnabled: true });
            syncWithApi();
          }
        },

        disableSync: () => {
          set({ syncEnabled: false });
        },

        syncNow: async () => {
          await syncWithApi();
        },

        // 选择器
        getTasksByDate: (date: string) => {
          return get().tasks.filter((t) => t.date === date);
        },

        getCheckInByDate: (date: string) => {
          return get().checkIns.find((c) => c.date === date);
        },

        isAuthenticated: isAuthenticated,

        validateAuth: async () => {
          const apiStore = useApiStore.getState();
          const isValid = await apiStore.validateAuth();
          if (isValid) {
            // 同步最新的用户信息到本地 store
            set({ user: apiStore.user, syncEnabled: true });
          }
          return isValid;
        },
      };
    },
    {
      name: 'hybrid-life-log-storage',
      partialize: (state: HybridState) => ({
        tasks: state.tasks,
        checkIns: state.checkIns,
        settings: state.settings,
        user: state.user,
        syncEnabled: state.syncEnabled,
        autoSync: state.autoSync,
        pendingSync: state.pendingSync,
      }),
    }
  )
);