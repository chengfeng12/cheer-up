import React from "react";
import {
  Settings,
  Moon,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
  LogIn,
  Sun,
  History,
} from "lucide-react";
import { useHybridStore } from "../store/useHybridStore";
import SyncSettings from "../components/Settings/SyncSettings";
import { useNavigate, useLocation } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const { user, logout, settings, updateSettings } = useHybridStore();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleTheme = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
    const y = ((rect.top + rect.height / 2) / window.innerHeight) * 100;

    const newTheme = settings.theme === "dark" ? "light" : "dark";

    // 触发全局主题动画
    const event = new CustomEvent("themeAnimation", {
      detail: {
        newTheme,
        clickX: x,
        clickY: y,
      },
    });
    window.dispatchEvent(event);

    // 立即更新主题
    updateSettings({ theme: newTheme });
  };

  const menuItems = [
    {
      icon: History,
      label: "历史任务",
      value: "",
      action: () => navigate("/history"),
    },
    {
      icon: settings.theme === "dark" ? Sun : Moon,
      label: settings.theme === "dark" ? "浅色模式" : "深色模式",
      value: settings.theme === "dark" ? "已开启" : "已关闭",
      action: (e?: React.MouseEvent) => toggleTheme(e as React.MouseEvent),
    },
    { icon: Bell, label: "消息提醒", value: "已开启", action: () => {} },
    { icon: Shield, label: "隐私设置", value: "", action: () => {} },
    { icon: Settings, label: "通用设置", value: "", action: () => {} },
  ];

  return (
    <div className="p-6 relative min-h-full">
      <header className="mb-8 flex items-center gap-4">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-2xl overflow-hidden">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            "👤"
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            {user ? user.name : "请登录"}
          </h1>
          <p className="text-gray-400 text-sm">欢迎回来</p>
        </div>
      </header>

      <div className="space-y-6">
        <SyncSettings />

        <section>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
            偏好设置
          </h3>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors">
            {menuItems.map((item, idx) => (
              <div
                key={item.label}
                onClick={(e) => {
                  // Specific logic for Theme (allow guest?) or strict login?
                  // User requested "These buttons... jump to login page"
                  // Let's enforce login for all for now as per request.
                  if (!user) {
                    navigate("/login");
                    return;
                  }

                  if (item.label === "深色模式" || item.label === "浅色模式") {
                    item.action(e);
                  } else {
                    item.action();
                  }
                }}
                className={`
                  flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors
                  ${
                    idx !== menuItems.length - 1
                      ? "border-b border-gray-50 dark:border-slate-700"
                      : ""
                  }
                  ${
                    item.label === "深色模式" || item.label === "浅色模式"
                      ? "relative"
                      : ""
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 dark:bg-slate-700 rounded-lg text-gray-600 dark:text-gray-300 transition-colors">
                    <item.icon size={20} />
                  </div>
                  <span className="font-medium text-slate-700 dark:text-gray-200">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">{item.value}</span>
                  <ChevronRight
                    size={16}
                    className="text-gray-300 dark:text-gray-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {!user ? (
          <button
            onClick={() => navigate("/login", { state: { from: location } })}
            className="w-full py-4 text-white font-medium bg-emerald-500 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200 dark:shadow-none"
          >
            <LogIn size={20} />
            立即登录
          </button>
        ) : (
          <button
            onClick={logout}
            className="w-full py-4 text-red-500 font-medium bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <LogOut size={20} />
            退出登录
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
