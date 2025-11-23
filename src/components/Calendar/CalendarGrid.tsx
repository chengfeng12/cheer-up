import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isBefore,
  startOfDay
} from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, X, CheckCircle2, Circle, CalendarPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useStore';
import LoginModal from '../Auth/LoginModal';

const CalendarGrid: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { checkIns, getTasksByDate, addCheckIn, user } = useAppStore();

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth), { locale: zhCN }),
    end: endOfWeek(endOfMonth(currentMonth), { locale: zhCN }),
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const getCheckInStatus = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return checkIns.find(c => c.date === dateStr);
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
  };

  const vibrate = (pattern: number | number[]) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  const handleRetroactiveCheckIn = () => {
    if (user.isGuest) {
      vibrate(50);
      setShowLoginModal(true);
      return;
    }

    if (selectedDate) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      addCheckIn({ date: dateStr, mood: 'neutral' }); // Default mood for retroactive
      vibrate([50, 50]);
    }
  };

  const isPastDate = (date: Date) => {
    return isBefore(date, startOfDay(new Date()));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          {format(currentMonth, 'yyyy年 MMMM', { locale: zhCN })}
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-gray-300"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-gray-300"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['日', '一', '二', '三', '四', '五', '六'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        <AnimatePresence mode='popLayout'>
          {days.map((day, dayIdx) => {
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, new Date());
            const checkIn = getCheckInStatus(day);

            return (
              <motion.div
                key={day.toString()}
                onClick={() => handleDayClick(day)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: dayIdx * 0.01 }}
                className={`
                  aspect-square flex flex-col items-center justify-center rounded-xl relative cursor-pointer
                  ${!isCurrentMonth ? 'text-gray-300 dark:text-slate-700' : 'text-slate-700 dark:text-gray-200'}
                  ${isToday ? 'bg-emerald-50 dark:bg-emerald-900/20 font-bold text-emerald-600 dark:text-emerald-400' : 'hover:bg-gray-50 dark:hover:bg-slate-800'}
                `}
              >
                <span className="text-sm z-10">{format(day, 'd')}</span>
                {checkIn && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 m-1 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg -z-0 flex items-center justify-center"
                  >
                    {checkIn.mood === 'happy' && <span className="text-xs">😊</span>}
                    {checkIn.mood === 'sad' && <span className="text-xs">😔</span>}
                    {checkIn.mood === 'neutral' && <span className="text-xs">😐</span>}
                    {!checkIn.mood && <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-4" />}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Day Detail Modal */}
      <AnimatePresence>
        {selectedDate && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDate(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 relative z-10 shadow-2xl max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                    {format(selectedDate, 'M月d日', { locale: zhCN })}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {format(selectedDate, 'EEEE', { locale: zhCN })}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedDate(null)}
                  className="p-2 bg-gray-100 dark:bg-slate-800 rounded-full text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Check-in Status */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">打卡状态</h4>
                {getCheckInStatus(selectedDate) ? (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl flex items-center gap-3 text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 size={24} />
                    <span className="font-bold">已打卡</span>
                    <span className="ml-auto text-2xl">
                      {getCheckInStatus(selectedDate)?.mood === 'happy' ? '😊' : 
                       getCheckInStatus(selectedDate)?.mood === 'sad' ? '😔' : '😐'}
                    </span>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <div className="flex-1 bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl flex items-center gap-3 text-gray-400">
                      <Circle size={24} />
                      <span className="font-medium">未打卡</span>
                    </div>
                    {isPastDate(selectedDate) && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleRetroactiveCheckIn}
                        className="px-6 bg-emerald-500 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-200 dark:shadow-none"
                      >
                        <CalendarPlus size={20} />
                        补卡
                      </motion.button>
                    )}
                  </div>
                )}
              </div>

              {/* Tasks */}
              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">当日任务</h4>
                <div className="space-y-3">
                  {getTasksByDate(format(selectedDate, 'yyyy-MM-dd')).length > 0 ? (
                    getTasksByDate(format(selectedDate, 'yyyy-MM-dd')).map(task => (
                      <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
                        <div className={task.completed ? 'text-emerald-500' : 'text-gray-300'}>
                          {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                        </div>
                        <span className={`text-sm ${task.completed ? 'text-gray-400 line-through' : 'text-slate-700 dark:text-gray-200'}`}>
                          {task.title}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-400 py-4 text-sm">没有记录任务</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
};

export default CalendarGrid;
