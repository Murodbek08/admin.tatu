import { StatCard, Card, Badge } from "../components/Ui";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Newspaper,
  Users,
  ClipboardList,
  Mail,
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

const recentActivity = [
  {
    action: "Yangi ariza qabul qilindi",
    user: "Alisher Karimov",
    time: "5 daq oldin",
    type: "qabul",
  },
  {
    action: "Yangilik e'lon qilindi",
    user: "Admin",
    time: "1 soat oldin",
    type: "yangilik",
  },
  {
    action: "Ustoz yangilandi",
    user: "Admin",
    time: "3 soat oldin",
    type: "oqituvchi",
  },
  {
    action: "MSc dasturi o'zgartirildi",
    user: "Admin",
    time: "Kecha",
    type: "dastur",
  },
  {
    action: "Aloqa xabari keldi",
    user: "Nilufar",
    time: "Kecha",
    type: "aloqa",
  },
];

const quickLinks = [
  { label: "Yangi Dastur", href: "/akademik-dasturlar", icon: GraduationCap },
  { label: "Yangiliklar", href: "/yangiliklar", icon: Newspaper },
  { label: "Ustozlar", href: "/oqituvchilar", icon: Users },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={GraduationCap}
          label="Dasturlar"
          value="12"
          trend={8}
          color="blue"
        />
        <StatCard
          icon={Newspaper}
          label="Yangiliklar"
          value="47"
          trend={12}
          color="blue"
        />
        <StatCard
          icon={Users}
          label="Ustozlar"
          value="89"
          trend={3}
          color="green"
        />
        <StatCard
          icon={ClipboardList}
          label="Arizalar"
          value="234"
          trend={-5}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* So'nggi faoliyat */}
        <div className="lg:col-span-2">
          <Card>
            <div className="px-6 py-5 border-b border-slate-100 font-bold">
              So'nggi Faoliyat
            </div>
            <div className="divide-y divide-slate-50">
              {recentActivity.map((item, i) => {
                const Icon = typeIcons[item.type];
                return (
                  <div
                    key={i}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                      {Icon ? <Icon size={20} /> : null}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900">
                        {item.action}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.user} • {item.time}
                      </p>
                    </div>
                    <Badge color={typeColors[item.type]}>{item.type}</Badge>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Tezkor havolalar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase">
              Tezkor Havolalar
            </h3>
            <div className="space-y-2">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
                  >
                    {Icon ? <Icon size={18} /> : null}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
