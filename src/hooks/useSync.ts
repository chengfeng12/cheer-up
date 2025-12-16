import { useEffect } from 'react';
import { useHybridStore } from '../store/useHybridStore';
import { useApiStore } from '../store/useApiStore';

export const useSync = () => {
  const { 
    isAuthenticated, 
    syncEnabled, 
    autoSync, 
    pendingSync,
    syncNow
  } = useHybridStore();

  const { 
    syncFromServer, 
    syncToServer 
  } = useApiStore();

  // 应用启动时如果已认证则初始化同步
  useEffect(() => {
    if (isAuthenticated() && syncEnabled) {
      const initializeSync = async () => {
        try {
          // 从服务器下载新数据
          const { tasks, checkIns } = await syncFromServer();
          console.log('从服务器同步数据成功:', { tasks, checkIns });
        } catch (error) {
          console.error('初始同步失败:', error);
        }
      };

      initializeSync();
    }
  }, [isAuthenticated, syncEnabled]);

  // 在线时自动同步
  useEffect(() => {
    if (!isAuthenticated() || !syncEnabled || !autoSync || !pendingSync) return;

    const syncInterval = setInterval(async () => {
      try {
        const { tasks, checkIns } = useHybridStore.getState();
        await syncToServer({ tasks, checkIns });
      } catch (error) {
        console.error('自动同步失败:', error);
      }
    }, 30000); // 每30秒同步一次

    return () => clearInterval(syncInterval);
  }, [isAuthenticated, syncEnabled, autoSync, pendingSync]);

  // 处理在线/离线状态
  useEffect(() => {
    const handleOnline = () => {
      console.log('应用在线');
      // 重新上线时触发同步
      if (isAuthenticated() && syncEnabled && pendingSync) {
        const { tasks, checkIns } = useHybridStore.getState();
        syncToServer({ tasks, checkIns }).catch(console.error);
      }
    };

    const handleOffline = () => {
      console.log('应用离线');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isAuthenticated, syncEnabled, pendingSync]);

  return {
    isOnline: navigator.onLine,
    canSync: isAuthenticated() && syncEnabled,
    hasPendingSync: pendingSync,
    manualSync: syncNow,
  };
};