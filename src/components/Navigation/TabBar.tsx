import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';

const TabBar: React.FC = () => {
  const tabs = [
    { path: '/', icon: Home, label: '今日' },
    { path: '/calendar', icon: Calendar, label: '历史' },
    { path: '/profile', icon: User, label: '我的' },
  ];

  const handleTabClick = () => {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-gray-100 dark:border-slate-800 px-6 py-3 flex justify-between items-center z-50 pb-safe transition-colors duration-300">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          onClick={handleTabClick}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 relative ${
              isActive ? 'text-emerald-500' : 'text-gray-400 dark:text-gray-500'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="relative p-1">
                <tab.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute inset-0 bg-emerald-100 dark:bg-emerald-900/30 rounded-full -z-10 scale-125"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default TabBar;
