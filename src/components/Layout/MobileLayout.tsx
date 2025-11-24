import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TabBar from '../Navigation/TabBar';
import { useAppStore } from '../../store/useStore';
import { AnimatePresence, motion } from 'framer-motion';
import ThemeTransition from '../ThemeTransition';

const MobileLayout: React.FC = () => {
  const { settings } = useAppStore();
  const location = useLocation();
  const [themeAnimating, setThemeAnimating] = useState(false);
  const [themeAnimationData, setThemeAnimationData] = useState({
    newTheme: settings.theme as 'light' | 'dark',
    clickX: 50,
    clickY: 50
  });

  // Hide TabBar on history page
  const hideTabBar = location.pathname === '/history';

  // Listen for theme animation trigger
  useEffect(() => {
    const handleThemeAnimation = (event: CustomEvent) => {
      const { newTheme, clickX, clickY } = event.detail;
      setThemeAnimationData({ newTheme, clickX, clickY });
      setThemeAnimating(true);
      
      setTimeout(() => {
        setThemeAnimating(false);
      }, 500);
    };

    window.addEventListener('themeAnimation', handleThemeAnimation as EventListener);
    
    return () => {
      window.removeEventListener('themeAnimation', handleThemeAnimation as EventListener);
    };
  }, []);

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
        <main className={`flex-1 overflow-y-auto scrollbar-hide relative ${hideTabBar ? 'pb-0' : 'pb-20'}`}>
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
        {!hideTabBar && <TabBar />}
      </div>
      
      <ThemeTransition
        isAnimating={themeAnimating}
        newTheme={themeAnimationData.newTheme}
        clickX={themeAnimationData.clickX}
        clickY={themeAnimationData.clickY}
      />
    </div>
  );
};

export default MobileLayout;
