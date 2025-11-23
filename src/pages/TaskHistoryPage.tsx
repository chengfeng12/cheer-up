import React, { useMemo } from 'react';
import { format, parseISO, isToday } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { CheckCircle2, Circle, ChevronLeft, CalendarClock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useStore';

const TaskHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { tasks } = useAppStore();

  // Group tasks by date, excluding today
  const historyGroups = useMemo(() => {
    const groups: Record<string, typeof tasks> = {};
    
    tasks.forEach(task => {
      if (!isToday(parseISO(task.date))) {
        if (!groups[task.date]) {
          groups[task.date] = [];
        }
        groups[task.date].push(task);
      }
    });

    // Sort dates descending
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [tasks]);

  return (
    <div className="p-6 min-h-full pb-24">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <ChevronLeft size={24} className="text-slate-800 dark:text-white" />
        </button>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          历史任务
        </h1>
      </header>

      {/* Content */}
      <div className="space-y-8">
        {historyGroups.length > 0 ? (
          historyGroups.map(([date, dayTasks]) => (
            <section key={date} className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">
                  {format(parseISO(date), 'M月d日', { locale: zhCN })}
                </h3>
                <span className="text-sm text-gray-400 font-medium">
                  {format(parseISO(date), 'EEEE', { locale: zhCN })}
                </span>
                <div className="h-px flex-1 bg-gray-100 dark:bg-slate-800 ml-2" />
              </div>

              <div className="space-y-3">
                {dayTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-50 dark:border-slate-700 shadow-sm"
                  >
                    <div className={`mt-0.5 ${task.completed ? 'text-emerald-500' : 'text-gray-300 dark:text-gray-600'}`}>
                      {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                    </div>
                    <span className={`flex-1 text-sm leading-relaxed break-all ${task.completed ? 'text-gray-400 line-through' : 'text-slate-700 dark:text-gray-200'}`}>
                      {task.title}
                    </span>
                  </motion.div>
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-4">
            <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center">
              <CalendarClock size={32} />
            </div>
            <p>暂无历史任务记录</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskHistoryPage;
