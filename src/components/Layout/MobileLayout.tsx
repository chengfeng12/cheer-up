import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TabBar from '../Navigation/TabBar';
import { useAppStore } from '../../store/useStore';
import { AnimatePresence, motion } from 'framer-motion';

const MobileLayout: React.FC = () => {
  const { settings } = useAppStore();
  const location = useLocation();

  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  return (
    <div className="h-[100dvh] bg-gray-50 dark:bg-slate-950 flex justify-center transition-colors duration-300 overflow-hidden">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-xl relative flex flex-col transition-colors duration-300 overflow-hidden">
        <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="min-h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        <TabBar />
      </div>
    </div>
  );
};

export default MobileLayout;
