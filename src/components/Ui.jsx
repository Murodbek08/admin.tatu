import { X, AlertCircle } from "lucide-react";

export function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border bg-white border-slate-200 shadow-sm transition-all ${className}`}
    >
      {children}
    </div>
  );
}

export function StatCard({ icon, label, value, trend, color = "blue" }) {
  const colorMap = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-100",
    },
    green: {
      bg: "bg-green-50",
      text: "text-green-600",
      border: "border-green-100",
    },
    red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-100" },
    orange: {
      bg: "bg-orange-50",
      text: "text-orange-600",
      border: "border-orange-100",
    },
  };
  const c = colorMap[color] || colorMap.blue;

  const Icon = icon;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center border ${c.bg} ${c.text} ${c.border}`}
        >
          {Icon ? <Icon size={24} /> : null}
        </div>
        {trend !== undefined && (
          <span
            className={`text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}
          >
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
      <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
        {label}
      </div>
    </Card>
  );
}

export function Badge({ children, className = "", color = "slate" }) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-green-50 text-green-700 border-green-100",
    red: "bg-red-50 text-red-700 border-red-100",
    slate: "bg-slate-50 text-slate-600 border-slate-200",
    orange: "bg-orange-50 text-orange-700 border-orange-100",
  };
  const theme = colorMap[color] || colorMap.slate;
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${theme} ${className}`}
    >
      {children}
    </span>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
}) {
  const sizeMap = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };
  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-100",
    secondary:
      "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm",
    danger: "bg-white text-red-600 border border-red-100 hover:bg-red-50",
  };
  const base = `rounded-lg font-bold transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${sizeMap[size]} ${variants[variant]} ${className}`;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={base}>
      {children}
    </button>
  );
}

export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto bg-white">{children}</div>
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, description, action }) {
  const Icon = icon;
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-slate-100">
      <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300 border border-slate-50 shadow-inner">
        {Icon ? <Icon size={44} /> : <AlertCircle size={44} />}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm mb-8 max-w-xs mx-auto">
        {description}
      </p>
      {action}
    </div>
  );
}

export function FormField({ label, children, required }) {
  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">{children}</div>
    </div>
  );
}
