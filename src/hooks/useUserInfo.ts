import { useEffect } from 'react';
import { useApiStore } from '../store/useApiStore';

export const useUserInfo = () => {
  const { isAuthenticated, loadUserInfo } = useApiStore();

  useEffect(() => {
    const initializeUserInfo = async () => {
      if (isAuthenticated) {
        try {
          // 应用启动时自动获取用户信息
          await loadUserInfo();
        } catch (error) {
          console.error('Failed to load user info on app startup:', error);
        }
      }
    };

    initializeUserInfo();
  }, [isAuthenticated, loadUserInfo]);

  // 返回获取用户信息的便捷方法
  const refreshUserInfo = async () => {
    if (isAuthenticated) {
      try {
        return await loadUserInfo();
      } catch (error) {
        console.error('Failed to refresh user info:', error);
        throw error;
      }
    }
    return null;
  };

  return {
    refreshUserInfo,
  };
};