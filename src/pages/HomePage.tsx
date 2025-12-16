import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Plus, CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHybridStore } from '../store/useHybridStore';
import { useSync } from '../hooks/useSync';
import LoginModal from '../components/Auth/LoginModal';
import SyncStatus from '../components/Sync/SyncStatus';

const HomePage: React.FC = () => {
  const today = format(new Date(), 'yyyy-MM-dd');
  useSync(); // 初始化同步钩子
  const { 
    tasks, 
    addTask, 
    toggleTask, 
    deleteTask, 
    checkIns, 
    addCheckIn, 
    removeCheckIn,
    user,
    syncEnabled,
    pendingSync
  } = useHybridStore();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  

  
  const todaysTasks = tasks.filter(t => t.date === today);
  const isCheckedIn = checkIns.some(c => c.date === today);

  const vibrate = (pattern: number | number[]) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  const checkLogin = () => {
    if (!user) {
      vibrate(50);
      setShowLoginModal(true);
      return false;
    }
    return true;
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkLogin()) return;

    if (newTaskTitle.trim()) {
      try {
        await addTask(newTaskTitle.trim());
        setNewTaskTitle('');
        vibrate(50); // 添加任务的轻微振动
      } catch (error) {
        console.error('Failed to add task:', error);
      }
    }
  };

  const handleCheckIn = async () => {
    if (!checkLogin()) return;

    try {
      if (isCheckedIn) {
        await removeCheckIn(today);
        vibrate(50);
      } else {
        await addCheckIn({ date: today, mood: 'happy' });
        vibrate([50, 50, 100]); // 成功模式
      }
    } catch (error) {
      console.error('Failed to check in:', error);
    }
  };

  const handleToggleTask = async (id: string) => {
    if (!checkLogin()) return;
    try {
      await toggleTask(id);
      vibrate(20);
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!checkLogin()) return;
    try {
      await deleteTask(id);
      vibrate([30, 30]); // 删除模式
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <header>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">
              {format(new Date(), 'MMMM do EEEE', { locale: zhCN })}
            </p>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">
              每日专注
            </h1>
          </div>
          <SyncStatus />
        </div>
      </header>

      {/* Check-in Card */}
      <motion.div 
        whileTap={{ scale: 0.95 }}
        onClick={handleCheckIn}
        className={`
          p-6 rounded-3xl shadow-sm border transition-all cursor-pointer relative overflow-hidden
          ${isCheckedIn 
            ? 'bg-emerald-500 border-emerald-500 text-white' 
            : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800'
          }
        `}
      >
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-bold ${!isCheckedIn && 'text-slate-800 dark:text-white'}`}>
              {isCheckedIn ? '已打卡！' : '每日打卡'}
            </h3>
            <p className={`text-sm mt-1 ${isCheckedIn ? 'text-emerald-100' : 'text-gray-400'}`}>
              {isCheckedIn ? '保持连续打卡的好习惯！' : '记录今天的心情'}
            </p>
          </div>
          <motion.div 
            animate={isCheckedIn ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
            className={`
              w-12 h-12 rounded-full flex items-center justify-center
              ${isCheckedIn ? 'bg-white/20' : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500'}
            `}
          >
            <CheckCircle2 size={24} />
          </motion.div>
        </div>
      </motion.div>

      {/* Tasks Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">任务清单</h2>
          <span className="text-sm text-gray-400 font-medium">
            {todaysTasks.filter(t => t.completed).length}/{todaysTasks.length}
          </span>
        </div>

        {/* Add Task Form */}
        <form onSubmit={handleAddTask} className="mb-4 relative">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="添加新任务..."
            className="w-full bg-gray-50 dark:bg-slate-800 dark:text-white border-none rounded-2xl py-4 pl-4 pr-12 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-gray-400"
          />
          <motion.button 
            whileTap={{ scale: 0.9 }}
            type="submit"
            disabled={!newTaskTitle.trim()}
            className="absolute right-2 top-2 bottom-2 w-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:bg-gray-300 dark:disabled:bg-slate-700 transition-all"
          >
            <Plus size={20} />
          </motion.button>
        </form>

        {/* Task List */}
        <div className="space-y-3">
          <AnimatePresence mode='popLayout'>
            {todaysTasks.map(task => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-50 dark:border-slate-700 shadow-sm transition-colors"
              >
                <button 
                  onClick={() => handleToggleTask(task.id)}
                  className={`
                    flex-shrink-0 transition-colors
                    ${task.completed ? 'text-emerald-500' : 'text-gray-300 dark:text-gray-600 hover:text-emerald-400'}
                  `}
                >
                  {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>
                
                <span className={`flex-1 font-medium transition-all break-all ${task.completed ? 'text-gray-400 line-through' : 'text-slate-700 dark:text-gray-200'}`}>
                  {task.title}
                </span>

                <button 
                  onClick={() => handleDeleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all p-2"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))}
            
            {todaysTasks.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-10 text-gray-400"
              >
                <p>今天还没有任务哦。</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
};

export default HomePage;
