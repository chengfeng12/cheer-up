import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, User } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useHybridStore } from "../../store/useHybridStore";

const RegisterPage: React.FC = () => {
  const { register } = useHybridStore();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("请填写所有必填项");
      return;
    }

    if (password.length < 6) {
      setError("密码长度至少为6位");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await register(name.trim(), email.trim(), password.trim());
      // Register usually implies auto-login, so redirect to profile/home
      navigate("/profile", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "注册失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gray-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <button
          onClick={() => navigate("/")}
          className="mb-8 flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>返回首页</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-slate-800"
        >
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
              创建一个账号
            </h1>
            <p className="text-gray-400">开启您的 YouWare 之旅</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                昵称
              </label>
              <div className="relative group">
                <User
                  className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-emerald-500 transition-colors"
                  size={20}
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="怎么称呼您？"
                  className="w-full bg-gray-50 dark:bg-slate-800/50 text-slate-800 dark:text-white border border-gray-100 dark:border-slate-700 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                  autoFocus
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                邮箱
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-emerald-500 transition-colors"
                  size={20}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-gray-50 dark:bg-slate-800/50 text-slate-800 dark:text-white border border-gray-100 dark:border-slate-700 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                密码
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-emerald-500 transition-colors"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="至少6位字符"
                  className="w-full bg-gray-50 dark:bg-slate-800/50 text-slate-800 dark:text-white border border-gray-100 dark:border-slate-700 rounded-2xl py-3 pl-12 pr-12 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "注册中..." : "注册账号"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              已有账号？{" "}
              <Link
                to="/login"
                className="text-emerald-500 font-medium hover:text-emerald-600 transition-colors"
              >
                立即登录
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
