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
  {
    path: "/akademik-dasturlar",
    label: "Akademik Dasturlar",
    icon: GraduationCap,
  },
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

  const getPageTitle = () => {
    const item = navItems.find((n) =>
      n.exact
        ? location.pathname === n.path
        : location.pathname.startsWith(n.path) && n.path !== "/",
    );
    return item?.label || "Dashboard";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-slate-900/40 backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-transform duration-300 ease-in-out
          lg:sticky lg:translate-x-0 lg:z-auto bg-white border-r border-slate-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ width: "280px", minWidth: "280px" }}
      >
        {/* Brand */}
        <div className="px-6 py-6 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-blue-200">
              TATU
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-slate-900 truncate tracking-tight">
                Engineering School
              </div>
              <div className="text-[11px] font-medium text-blue-600 uppercase tracking-widest">
                Admin Panel
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar">
          <div className="mb-4 px-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              Asosiy Menyu
            </span>
          </div>
          <ul className="space-y-1.5">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.exact}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                      isActive
                        ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100/50"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      size={20}
                      className="transition-transform group-hover:scale-110"
                    />
                    {item.label}
                  </div>
                  <ChevronRight
                    size={14}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User / Logout Section */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
          <div className="flex items-center gap-3 px-3 py-3 mb-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-700 border border-slate-200">
              A
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-slate-900 truncate">
                Admin
              </div>
              <div className="text-[11px] text-slate-500 truncate font-medium">
                admin@tatu.uz
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors group"
          >
            <LogOut
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
            Chiqish
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>

            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-none mb-1">
                {getPageTitle()}
              </h2>
              <p className="text-[12px] font-medium text-slate-400 hidden sm:block capitalize">
                {new Date().toLocaleDateString("uz-UZ", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* System Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-100 bg-green-50/50">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[11px] text-green-700 font-bold uppercase tracking-wider hidden sm:inline">
              Online
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto custom-scrollbar bg-slate-50/50">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
