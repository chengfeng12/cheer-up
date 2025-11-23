import React, { useState } from 'react';
import { User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useStore';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAppStore();
  const [username, setUsername] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username.trim());
      onClose();
      setUsername('');
    }
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
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">登录 / 注册</h2>
            <p className="text-gray-400 text-sm mb-4">登录后即可开始记录您的生活</p>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">昵称</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="请输入您的昵称"
                    className="w-full bg-gray-50 dark:bg-slate-700 dark:text-white border-none rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500/20"
                    autoFocus
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={!username.trim()}
                className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold disabled:opacity-50 disabled:bg-gray-300"
              >
                进入应用
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
