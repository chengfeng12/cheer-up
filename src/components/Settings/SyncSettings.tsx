import React, { useState } from 'react';
import { Cloud, CloudOff, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHybridStore } from '../../store/useHybridStore';

const SyncSettings: React.FC = () => {
  const { 
    syncEnabled, 
    autoSync, 
    pendingSync, 
    enableSync, 
    disableSync, 
    syncNow,
    updateSettings,
    isAuthenticated 
  } = useHybridStore();

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncToggle = () => {
    if (syncEnabled) {
      disableSync();
    } else {
      enableSync();
    }
  };

  const handleAutoSyncToggle = () => {
    updateSettings({ autoSync: !autoSync } as any);
  };

  const handleManualSync = async () => {
    if (!isAuthenticated || !syncEnabled) return;
    
    setIsSyncing(true);
    try {
      await syncNow();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">数据同步</h3>
        
        {!isAuthenticated && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-blue-500 mt-0.5" size={20} />
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  需要登录账号
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  请先登录或注册账号以启用云端同步功能
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Sync Toggle */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                syncEnabled ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
              }`}>
                {syncEnabled ? <Cloud size={20} /> : <CloudOff size={20} />}
              </div>
              <div>
                <p className="font-medium text-slate-800 dark:text-white">云端同步</p>
                <p className="text-xs text-gray-400">
                  {syncEnabled ? '数据已同步到云端' : '仅在本地存储'}
                </p>
              </div>
            </div>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSyncToggle}
              disabled={!isAuthenticated}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                !isAuthenticated ? 'bg-gray-300' : syncEnabled ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
            >
              <motion.div
                animate={{ x: syncEnabled ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </motion.button>
          </div>

          {/* Auto Sync Toggle */}
          {syncEnabled && (
            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  autoSync ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <RefreshCw size={20} />
                </div>
                <div>
                  <p className="font-medium text-slate-800 dark:text-white">自动同步</p>
                  <p className="text-xs text-gray-400">
                    {autoSync ? '自动同步数据更改' : '仅手动同步'}
                  </p>
                </div>
              </div>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAutoSyncToggle}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  autoSync ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <motion.div
                  animate={{ x: autoSync ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </motion.button>
            </div>
          )}

          {/* Sync Status */}
          {syncEnabled && (
            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  pendingSync ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                }`}>
                  {pendingSync ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <RefreshCw size={20} />
                    </motion.div>
                  ) : (
                    <RefreshCw size={20} />
                  )}
                </div>
                <div>
                  <p className="font-medium text-slate-800 dark:text-white">同步状态</p>
                  <p className="text-xs text-gray-400">
                    {pendingSync ? '正在同步...' : '同步完成'}
                  </p>
                </div>
              </div>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleManualSync}
                disabled={isSyncing || pendingSync}
                className="px-3 py-1.5 text-sm bg-emerald-500 text-white rounded-lg disabled:opacity-50 disabled:bg-gray-300"
              >
                {isSyncing ? '同步中' : '立即同步'}
              </motion.button>
            </div>
          )}

          {/* Info */}
          {syncEnabled && (
            <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
              <h4 className="font-medium text-slate-800 dark:text-white mb-2">同步说明</h4>
              <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <li>• 数据会自动保存到云端服务器</li>
                <li>• 多设备间登录同一账号可同步数据</li>
                <li>• 本地数据会优先保存，确保数据安全</li>
                <li>• 可随时关闭同步，数据仍保留在本地</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SyncSettings;