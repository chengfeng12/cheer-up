import { create } from 'zustand';

interface ErrorState {
  // 简单的当前错误状态
  currentError: {
    message: string;
    type: 'error' | 'warning' | 'info';
    action?: {
      label: string;
      handler: () => void;
    };
  } | null;
  
  // 显示/隐藏错误
  showError: (message: string, type?: 'error' | 'warning' | 'info', action?: { label: string; handler: () => void }) => void;
  clearError: () => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
  currentError: null,

  showError: (message, type = 'error', action) => {
    set({
      currentError: {
        message,
        type,
        action,
      },
    });

    // info 和 warning 类型自动在 3 秒后清除
    if (type !== 'error') {
      setTimeout(() => {
        set({ currentError: null });
      }, 3000);
    }
  },

  clearError: () => {
    set({ currentError: null });
  },
}));