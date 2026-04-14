import { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import {
  LayoutDashboard,
  GraduationCap,
  Newspaper,
  Users,
  ClipboardList,
  Mail,
  LogOut,
  Menu,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { path: "/akademik-dasturlar", label: "Dasturlar", icon: GraduationCap },
  { path: "/yangiliklar", label: "Yangiliklar", icon: Newspaper },
  { path: "/oqituvchilar", label: "O'qituvchilar", icon: Users },
  { path: "/qabul", label: "Qabul", icon: ClipboardList },
  { path: "/aloqa", label: "Aloqa", icon: Mail },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const currentItem = navItems.find((n) =>
    n.exact
      ? location.pathname === n.path
      : location.pathname.startsWith(n.path) && n.path !== "/",
  );

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-slate-900/30 backdrop-blur-[2px]"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Width reduced to 240px for a tighter look */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col bg-white border-r border-slate-200 transition-transform duration-300 lg:sticky lg:translate-x-0 w-[240px] shrink-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Section */}
        <div className="h-16 flex items-center px-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-[8px] font-black text-white">
              TATU
            </div>
            <div className="leading-tight">
              <h1 className="text-sm font-bold truncate w-32">Engineering</h1>
              <p className="text-[10px] font-medium text-blue-600 uppercase tracking-wider">
                Admin
              </p>
            </div>
          </div>
        </div>

        {/* Navigation - Tighter padding */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
          <p className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Menu
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon
                  size={18}
                  className={
                    location.pathname === item.path ? "text-blue-600" : ""
                  }
                />
                {item.label}
              </div>
              <ChevronRight
                size={12}
                className="opacity-0 group-hover:opacity-40 transition-opacity"
              />
            </NavLink>
          ))}
        </nav>

        {/* User & Logout - Compact Version */}
        <div className="p-3 border-t border-slate-100 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">Admin</p>
              <p className="text-[10px] text-slate-400 truncate tracking-tight">
                admin@tatu.uz
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} /> Chiqish
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header - Slimmer (h-16) */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-lg border border-slate-200 text-slate-600"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={18} />
            </button>
            <h2 className="text-md font-bold text-slate-800">
              {currentItem?.label || "Dashboard"}
            </h2>
          </div>

          <div className="text-[11px] font-medium text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full hidden sm:block">
            {new Date().toLocaleDateString("uz-UZ", {
              month: "long",
              day: "numeric",
              weekday: "short",
            })}
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar bg-slate-50">
          {/* max-w-6xl ni olib tashladik yoki w-full qildik */}
          <div className="w-full animate-in fade-in duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
