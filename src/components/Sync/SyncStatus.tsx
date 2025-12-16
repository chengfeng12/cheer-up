import React, { useState } from 'react';
import { Wifi, WifiOff, Cloud, AlertCircle, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSync } from '../../hooks/useSync';

interface SyncStatusProps {
  showDetails?: boolean;
}

const SyncStatus: React.FC<SyncStatusProps> = ({ showDetails = false }) => {
  const { isOnline, canSync, hasPendingSync } = useSync();
  const [showNotification, setShowNotification] = useState(false);
  const [lastNotification, setLastNotification] = useState<string>('');

  // 显示同步状态变化的通知
  React.useEffect(() => {
    if (!isOnline && lastNotification !== 'offline') {
      setLastNotification('offline');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } else if (isOnline && hasPendingSync && lastNotification !== 'pending') {
      setLastNotification('pending');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } else if (isOnline && !hasPendingSync && canSync && lastNotification !== 'synced') {
      setLastNotification('synced');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    }
  }, [isOnline, hasPendingSync, canSync, lastNotification]);

  const getStatusColor = () => {
    if (!isOnline) return 'text-red-500';
    if (!canSync) return 'text-gray-400';
    if (hasPendingSync) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff size={16} />;
    if (!canSync) return <Cloud size={16} />;
    if (hasPendingSync) return <Cloud size={16} />;
    return <Check size={16} />;
  };

  const getStatusText = () => {
    if (!isOnline) return '离线';
    if (!canSync) return '本地模式';
    if (hasPendingSync) return '同步中...';
    return '已同步';
  };

  const getNotificationContent = () => {
    if (!isOnline) {
      return {
        icon: <WifiOff size={20} />,
        message: '网络连接已断开',
        submessage: '数据将保存在本地',
        type: 'error'
      };
    }
    if (hasPendingSync) {
      return {
        icon: <Cloud size={20} />,
        message: '数据同步中',
        submessage: '正在保存到云端',
        type: 'warning'
      };
    }
    if (canSync) {
      return {
        icon: <Check size={20} />,
        message: '数据已同步',
        submessage: '所有更改已保存到云端',
        type: 'success'
      };
    }
    return null;
  };

  if (!showDetails) {
    return (
      <div className={`flex items-center gap-2 ${getStatusColor()}`}>
        {getStatusIcon()}
        <span className="text-xs font-medium">{getStatusText()}</span>
      </div>
    );
  }

  return (
    <>
      {/* Compact status indicator */}
      <div className={`flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700`}>
        {getStatusIcon()}
        <span className="text-sm font-medium text-slate-700 dark:text-gray-200">{getStatusText()}</span>
      </div>

      {/* Notification toast */}
      <AnimatePresence>
        {showNotification && getNotificationContent() && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-4 right-4 z-50 max-w-sm p-4 rounded-xl shadow-lg border ${
              getNotificationContent()?.type === 'error' 
                ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                : getNotificationContent()?.type === 'warning'
                ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
                : 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`${
                getNotificationContent()?.type === 'error'
                  ? 'text-red-600 dark:text-red-400'
                  : getNotificationContent()?.type === 'warning'
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-green-600 dark:text-green-400'
              }`}>
                {getNotificationContent()?.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm ${
                  getNotificationContent()?.type === 'error'
                    ? 'text-red-800 dark:text-red-200'
                    : getNotificationContent()?.type === 'warning'
                    ? 'text-yellow-800 dark:text-yellow-200'
                    : 'text-green-800 dark:text-green-200'
                }`}>
                  {getNotificationContent()?.message}
                </p>
                <p className={`text-xs mt-0.5 ${
                  getNotificationContent()?.type === 'error'
                    ? 'text-red-600 dark:text-red-400'
                    : getNotificationContent()?.type === 'warning'
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-green-600 dark:text-green-400'
                }`}>
                  {getNotificationContent()?.submessage}
                </p>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className={`text-xs p-1 rounded ${
                  getNotificationContent()?.type === 'error'
                    ? 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200'
                    : getNotificationContent()?.type === 'warning'
                    ? 'text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-200'
                    : 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200'
                }`}
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SyncStatus;