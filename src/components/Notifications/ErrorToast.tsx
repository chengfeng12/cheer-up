import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useErrorStore } from '../../store/useErrorStore';
import { X, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const ErrorToast: React.FC = () => {
  const { currentError, clearError } = useErrorStore();

  // 错误自动消失（3-5秒）
  useEffect(() => {
    if (currentError && currentError.type === 'error') {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentError, clearError]);

  const getIcon = () => {
    switch (currentError?.type) {
      case 'error':
        return <AlertCircle size={20} className="flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle size={20} className="flex-shrink-0" />;
      case 'info':
        return <Info size={20} className="flex-shrink-0" />;
      default:
        return <AlertCircle size={20} className="flex-shrink-0" />;
    }
  };

  const getColors = () => {
    switch (currentError?.type) {
      case 'error':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-800 dark:text-red-200',
          icon: 'text-red-500',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-200 dark:border-yellow-800',
          text: 'text-yellow-800 dark:text-yellow-200',
          icon: 'text-yellow-500',
        };
      case 'info':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          text: 'text-blue-800 dark:text-blue-200',
          icon: 'text-blue-500',
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-900/20',
          border: 'border-gray-200 dark:border-gray-800',
          text: 'text-gray-800 dark:text-gray-200',
          icon: 'text-gray-500',
        };
    }
  };

  const colors = getColors();

  return (
    <AnimatePresence>
      {currentError && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`fixed top-4 left-4 right-4 z-50 p-4 rounded-lg border ${colors.bg} ${colors.border} shadow-lg`}
        >
          <div className="flex items-start gap-3">
            <div className={`${colors.icon} mt-0.5`}>
              {getIcon()}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${colors.text} break-words`}>
                {currentError.message}
              </p>
              
              {currentError.action && (
                <button
                  onClick={() => {
                    currentError.action.handler();
                    clearError();
                  }}
                  className={`mt-2 px-3 py-1 text-xs font-medium rounded transition-colors ${
                    currentError.type === 'error'
                      ? 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-700'
                      : currentError.type === 'warning'
                      ? 'bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-700'
                      : 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-700'
                  }`}
                >
                  {currentError.action.label}
                </button>
              )}
            </div>
            
            <button
              onClick={clearError}
              className={`ml-2 p-1 rounded transition-colors ${colors.icon} hover:bg-black/5 dark:hover:bg-white/5`}
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ErrorToast;