import { useCallback } from 'react';
import { useErrorStore } from '../store/useErrorStore';

interface ApiError extends Error {
  status?: number;
  code?: string;
}

export const useErrorHandler = () => {
  const { showError } = useErrorStore();

  const handleError = useCallback((error: unknown) => {
    if (error instanceof Error) {
      const apiError = error as ApiError;
      
      // 处理特定 HTTP 状态码
      if (apiError.status) {
        switch (apiError.status) {
          case 400:
            showError('请求参数有误，请检查后重试', 'warning');
            break;
          case 401:
            showError('登录已过期，请重新登录', 'error', {
              label: '重新登录',
              handler: () => {
                // 清除 token 并刷新页面
                localStorage.removeItem('token');
                window.location.reload();
              },
            });
            break;
          case 403:
            showError('没有权限执行此操作', 'error');
            break;
          case 404:
            showError('请求的资源不存在', 'warning');
            break;
          case 409:
            showError('数据冲突，可能已被其他人修改', 'warning');
            break;
          case 422:
            showError('数据验证失败，请检查输入内容', 'warning');
            break;
          case 429:
            showError('请求过于频繁，请稍后再试', 'warning');
            break;
          case 500:
            showError('服务器内部错误，请稍后重试', 'error');
            break;
          case 502:
          case 503:
          case 504:
            showError('服务暂时不可用，请稍后重试', 'error');
            break;
          default:
            showError(`请求失败 (${apiError.status}): ${apiError.message}`, 'error');
        }
      } else {
        // 处理网络错误或其他错误
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          showError('网络连接失败，请检查网络后重试', 'warning');
        } else if (error.message.includes('timeout')) {
          showError('请求超时，请稍后重试', 'warning');
        } else {
          showError(error.message, 'error');
        }
      }
    } else {
      // 处理非 Error 对象
      showError('发生了未知错误，请稍后重试', 'error');
    }
  }, [showError]);

  const withErrorHandling = useCallback(async <T, Args extends any[]>(
    fn: (...args: Args) => Promise<T>
  ) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error);
      throw error; // 重新抛出，让调用方按需处理
    }
  }, [handleError]);

  return {
    handleError,
    withErrorHandling,
    showError, // 直接暴露简单错误显示
  };
};