import React from 'react';
import { format, getDaysInMonth, startOfMonth, endOfMonth, isAfter, isBefore, startOfDay } from 'date-fns';
import CalendarGrid from '../components/Calendar/CalendarGrid';
import { useAppStore } from '../store/useStore';

const CalendarPage: React.FC = () => {
  const { checkIns } = useAppStore();
  const now = new Date();
  const currentMonthStr = format(now, 'yyyy-MM');
  
  // Calculate stats
  const monthlyCheckIns = checkIns.filter(c => c.date.startsWith(currentMonthStr));
  const checkInCount = monthlyCheckIns.length;
  
  // Calculate completion rate
  // Denominator: Days passed in current month so far
  const start = startOfMonth(now);
  const end = endOfMonth(now);
  const today = startOfDay(now);
  
  let daysPassed = 0;
  for (let d = 1; d <= getDaysInMonth(now); d++) {
    const date = new Date(now.getFullYear(), now.getMonth(), d);
    if (isBefore(date, today) || date.getTime() === today.getTime()) {
      daysPassed++;
    }
  }

  const completionRate = daysPassed > 0 
    ? Math.round((checkInCount / daysPassed) * 100) 
    : 0;

  return (
    <div className="min-h-full bg-white dark:bg-slate-900 transition-colors">
      <div className="p-6 pb-0">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">历史记录</h1>
        <p className="text-gray-400 mt-1">你的坚持足迹</p>
      </div>
      <CalendarGrid />
      
      <div className="px-6 mt-4">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6">
          <h3 className="font-bold text-emerald-800 dark:text-emerald-400 mb-2">本月统计</h3>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80">打卡天数</p>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{checkInCount}</p>
            </div>
            <div>
              <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80">完成率</p>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{completionRate}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
