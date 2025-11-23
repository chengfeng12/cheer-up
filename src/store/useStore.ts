import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, CheckIn, UserSettings, UserProfile } from '../types';
import { format } from 'date-fns';

interface AppState {
  tasks: Task[];
  checkIns: CheckIn[];
  settings: UserSettings;
  user: UserProfile;
  
  // Actions
  addTask: (title: string, date?: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addCheckIn: (checkIn: CheckIn) => void;
  removeCheckIn: (date: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  login: (name: string) => void;
  logout: () => void;
  
  // Selectors
  getTasksByDate: (date: string) => Task[];
  getCheckInByDate: (date: string) => CheckIn | undefined;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      tasks: [],
      checkIns: [],
      settings: {
        theme: 'light',
        primaryColor: '#10b981', // Emerald-500
      },
      user: {
        name: '访客用户',
        isGuest: true,
      },

      addTask: (title, date = format(new Date(), 'yyyy-MM-dd')) => {
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id: crypto.randomUUID(),
              title,
              completed: false,
              date,
            },
          ],
        }));
      },

      toggleTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
      },

      addCheckIn: (checkIn) => {
        set((state) => ({
          checkIns: [
            ...state.checkIns.filter((c) => c.date !== checkIn.date),
            checkIn,
          ],
        }));
      },

      removeCheckIn: (date) => {
        set((state) => ({
          checkIns: state.checkIns.filter((c) => c.date !== date),
        }));
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      login: (name) => {
        set({
          user: {
            name,
            isGuest: false,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + name
          }
        });
      },

      logout: () => {
        set({
          user: {
            name: '访客用户',
            isGuest: true,
          }
        });
      },

      getTasksByDate: (date) => {
        return get().tasks.filter((t) => t.date === date);
      },

      getCheckInByDate: (date) => {
        return get().checkIns.find((c) => c.date === date);
      },
    }),
    {
      name: 'life-log-storage',
    }
  )
);
