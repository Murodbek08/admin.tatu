import { useState } from "react";
import { useAuth } from "../context/Authcontext";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";

export default function Login() {
  
  const { login, loginError, setLoginError } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulyatsiya qilingan kutish vaqti
    await new Promise((r) => setTimeout(r, 800));
    login(username, password);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Dekorativ orqa fon elementlari */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4 animate-in fade-in zoom-in duration-500">
        {/* Logo va Sarlavha */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-xl shadow-blue-100/50 border border-slate-100 mb-6 mx-auto">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            Xush kelibsiz!
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            TATU Engineering School Admin Paneliga kirish
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl shadow-slate-200/60 border border-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Foydalanuvchi nomi
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setLoginError("");
                  }}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Maxfiy parol
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLoginError("");
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="flex items-center gap-3 text-sm font-bold text-red-500 bg-red-50 border border-red-100 rounded-2xl px-4 py-3 animate-in slide-in-from-top-2">
                <AlertCircle size={18} className="shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-slate-900 hover:bg-blue-600 disabled:bg-slate-300 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-200/20 transition-all duration-300 flex items-center justify-center gap-2 group active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Tizimga kirish
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>

          {/* Footer inside card */}
          <div className="mt-8 pt-6 border-t border-slate-50">
            <p className="text-center text-xs text-slate-400 font-medium leading-relaxed">
              Kirishda muammo bormi? <br />
              <a
                href="mailto:it@tatu.uz"
                className="text-blue-500 hover:underline font-bold"
              >
                it@tatu.uz
              </a>{" "}
              orqali yordam oling
            </p>
          </div>
        </div>

        <p className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-8">
          © 2026 TATU Engineering School
        </p>
      </div>
    </div>
  );
}
