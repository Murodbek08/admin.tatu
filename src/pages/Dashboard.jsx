import { useState, useEffect } from "react";
import { StatCard, Card, Badge } from "../components/Ui";
import { Link } from "react-router-dom";
import request from "../api"; // Axios instance
import {
  GraduationCap,
  Newspaper,
  Users,
  ClipboardList,
  Mail,
  Loader2,
} from "lucide-react";

const typeIcons = {
  qabul: ClipboardList,
  yangilik: Newspaper,
  oqituvchi: Users,
  dastur: GraduationCap,
  aloqa: Mail,
};

const typeColors = {
  qabul: "green",
  yangilik: "blue",
  oqituvchi: "orange",
  dastur: "blue",
  aloqa: "red",
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    programs: 0,
    news: 0,
    teachers: 0,
    messages: 0,
  });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Barcha ma'lumotlarni parallel ravishda olish
      const [progRes, newsRes, teachRes, msgRes] = await Promise.all([
        request.get("/academic_programs?select=count", {
          headers: { Prefer: "count=exact" },
        }),
        request.get("/news?select=count", {
          headers: { Prefer: "count=exact" },
        }),
        request.get("/faculty?select=count", {
          headers: { Prefer: "count=exact" },
        }),
        request.get("/contact_messages?order=created_at.desc&limit=5"), // So'nggi 5 ta xabar
      ]);

      setStats({
        programs: progRes.headers["content-range"]?.split("/")[1] || 0,
        news: newsRes.headers["content-range"]?.split("/")[1] || 0,
        teachers: teachRes.headers["content-range"]?.split("/")[1] || 0,
        messages: msgRes.data.length,
      });

      setRecentMessages(msgRes.data || []);
    } catch (error) {
      console.error("Dashboard yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={GraduationCap}
          label="Dasturlar"
          value={stats.programs}
          trend={+2}
          color="blue"
        />
        <StatCard
          icon={Newspaper}
          label="Yangiliklar"
          value={stats.news}
          trend={+5}
          color="blue"
        />
        <StatCard
          icon={Users}
          label="Ustozlar"
          value={stats.teachers}
          trend={+1}
          color="green"
        />
        <StatCard
          icon={Mail}
          label="Xabarlar"
          value={stats.messages || 0}
          trend={stats.messages > 0 ? 5 : 0}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* So'nggi murojaatlar (Contact Messages) */}
        <div className="lg:col-span-2">
          <Card>
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
              <span className="font-bold">So'nggi Murojaatlar</span>
              <Link
                to="/aloqa"
                className="text-xs text-blue-600 hover:underline"
              >
                Hammasini ko'rish
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {recentMessages.length > 0 ? (
                recentMessages.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                      <Mail size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate max-w-[200 md:max-w-md]">
                        {item.message}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge color="red">aloqa</Badge>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-slate-400 text-sm italic">
                  Hozircha xabarlar yo'q
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Tezkor havolalar */}
        <div className="space-y-6">
          <Card className="p-6 shadow-sm border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">
              Tezkor Boshqaruv
            </h3>
            <div className="space-y-2">
              {[
                {
                  label: "Yangi Dastur",
                  href: "/akademik-dasturlar",
                  icon: GraduationCap,
                  color: "hover:bg-blue-50 hover:text-blue-600",
                },
                {
                  label: "Yangilik qo'shish",
                  href: "/yangiliklar",
                  icon: Newspaper,
                  color: "hover:bg-indigo-50 hover:text-indigo-600",
                },
                {
                  label: "Ustoz qo'shish",
                  href: "/oqituvchilar",
                  icon: Users,
                  color: "hover:bg-emerald-50 hover:text-emerald-600",
                },
                {
                  label: "Xabarlarni o'qish",
                  href: "/aloqa",
                  icon: Mail,
                  color: "hover:bg-red-50 hover:text-red-600",
                },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-slate-600 transition-all ${link.color}`}
                >
                  <link.icon size={18} />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </Card>

          {/* Mini Info Card */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 text-white/10 group-hover:scale-110 transition-transform">
              <GraduationCap size={120} />
            </div>
            <h4 className="font-black text-xl mb-2">TUIT Admin</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Tizimni nazorat qilish va ma'lumotlarni yangilash bo'limi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
