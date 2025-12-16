import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHybridStore } from '../../store/useHybridStore';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useHybridStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('请填写邮箱和密码');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (isRegisterMode) {
        // Register new user (use email prefix as name)
        const name = email.split('@')[0];
        await register(name, email.trim(), password.trim());
      } else {
        // Login with email/password
        await login('', email.trim(), password.trim());
      }
      onClose();
      // Reset form
      setEmail('');
      setPassword('');
      setIsRegisterMode(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setError('');
    setEmail('');
    setPassword('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-3xl p-6 relative z-10 shadow-2xl"
          >
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
              {isRegisterMode ? '注册账号' : '登录账号'}
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              {isRegisterMode ? '创建账号以使用完整功能' : '登录账号以开始使用'}
            </p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleAuth}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">邮箱</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="请输入邮箱地址"
                    className="w-full bg-gray-50 dark:bg-slate-700 dark:text-white border-none rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500/20"
                    autoFocus
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">密码</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isRegisterMode ? "请输入密码（至少6位）" : "请输入密码"}
                    className="w-full bg-gray-50 dark:bg-slate-700 dark:text-white border-none rounded-xl py-3 pl-10 pr-12 focus:ring-2 focus:ring-emerald-500/20"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={!email.trim() || !password.trim() || isLoading}
                className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold disabled:opacity-50 disabled:bg-gray-300"
              >
                {isLoading ? '处理中...' : isRegisterMode ? '注册账号' : '登录'}
              </button>

              <button
                type="button"
                onClick={switchMode}
                className="w-full mt-3 py-3 text-emerald-600 dark:text-emerald-400 font-medium"
              >
                {isRegisterMode ? '已有账号？去登录' : '注册新账号'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;