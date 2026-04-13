import { useState } from "react";
import { Card, Badge, Button, Modal, EmptyState } from "../components/Ui";

const initialApplications = [
  {
    id: 1,
    name: "Alisher Karimov",
    program: "MSc Sun'iy Intellekt",
    date: "12 Apr, 2026",
    score: 87,
    status: "pending",
    phone: "+998 90 123 45 67",
    email: "alisher@gmail.com",
  },
  {
    id: 2,
    name: "Zilola Nazarova",
    program: "BSc Kompyuter Muhandisligi",
    date: "11 Apr, 2026",
    score: 92,
    status: "approved",
    phone: "+998 91 234 56 78",
    email: "zilola@mail.ru",
  },
  {
    id: 3,
    name: "Bobur Xasanov",
    program: "MSc Kiberxavfsizlik",
    date: "10 Apr, 2026",
    score: 78,
    status: "review",
    phone: "+998 93 345 67 89",
    email: "bobur@gmail.com",
  },
  {
    id: 4,
    name: "Malika Tosheva",
    program: "BSc Ma'lumotlar Fani",
    date: "9 Apr, 2026",
    score: 65,
    status: "rejected",
    phone: "+998 97 456 78 90",
    email: "malika@gmail.com",
  },
  {
    id: 5,
    name: "Sherzod Umarov",
    program: "MSc Sun'iy Intellekt",
    date: "8 Apr, 2026",
    score: 95,
    status: "approved",
    phone: "+998 90 567 89 01",
    email: "sherzod@tatu.uz",
  },
];

const statusConfig = {
  pending: { color: "gold", label: "Kutilmoqda" },
  review: { color: "blue", label: "Ko'rib chiqilmoqda" },
  approved: { color: "green", label: "Qabul qilindi" },
  rejected: { color: "red", label: "Rad etildi" },
};

export default function Qabul() {
  const [data, setData] = useState(initialApplications);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const changeStatus = (id, status) => {
    setData(data.map((d) => (d.id === id ? { ...d, status } : d)));
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const filtered = data.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.program.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || d.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: data.length,
    pending: 0,
    review: 0,
    approved: 0,
    rejected: 0,
  };
  data.forEach((d) => counts[d.status]++);

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(statusConfig).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setFilterStatus(key === filterStatus ? "all" : key)}
            className="rounded-xl p-4 border text-left transition-all"
            style={{
              background:
                filterStatus === key ? "var(--navy-700)" : "var(--navy-900)",
              borderColor:
                filterStatus === key
                  ? "var(--gold-500)"
                  : "rgba(255,255,255,0.06)",
            }}
          >
            <div
              className="text-2xl font-bold text-white mb-1"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {counts[key]}
            </div>
            <div className="text-xs text-slate-500">{cfg.label}</div>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterStatus === "all" ? "text-black" : "text-slate-400 hover:text-white"}`}
            style={{
              background:
                filterStatus === "all" ? "var(--gold-500)" : "var(--navy-800)",
            }}
          >
            Barchasi ({counts.all})
          </button>
        </div>
        <input
          className="admin-input w-48"
          placeholder="Qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState icon="📋" title="Ariza topilmadi" />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ariza beruvchi</th>
                  <th className="hidden md:table-cell">Dastur</th>
                  <th className="hidden sm:table-cell">Sana</th>
                  <th className="hidden lg:table-cell">Ball</th>
                  <th>Holat</th>
                  <th>Amal</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div>
                        <div className="font-medium text-white text-sm">
                          {item.name}
                        </div>
                        <div className="text-xs text-slate-600 md:hidden">
                          {item.program}
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell text-slate-400 text-xs">
                      {item.program}
                    </td>
                    <td className="hidden sm:table-cell text-slate-500 text-xs">
                      {item.date}
                    </td>
                    <td className="hidden lg:table-cell">
                      <span
                        className={`font-semibold text-sm ${item.score >= 85 ? "text-green-400" : item.score >= 70 ? "text-yellow-400" : "text-red-400"}`}
                      >
                        {item.score}
                      </span>
                    </td>
                    <td>
                      <Badge color={statusConfig[item.status].color}>
                        {statusConfig[item.status].label}
                      </Badge>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelected(item)}
                          className="text-xs px-2.5 py-1 rounded-lg text-slate-400 hover:text-white transition-colors"
                          style={{ background: "var(--navy-800)" }}
                        >
                          Ko'rish
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Ariza Ma'lumotlari"
      >
        {selected && (
          <div className="space-y-4">
            <div
              className="flex items-center gap-4 p-4 rounded-xl"
              style={{ background: "var(--navy-800)" }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-black"
                style={{ background: "var(--gold-500)" }}
              >
                {selected.name
                  .split(" ")
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <div className="font-bold text-white">{selected.name}</div>
                <div className="text-xs text-slate-500">
                  {selected.email} · {selected.phone}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Dastur", val: selected.program },
                { label: "Sana", val: selected.date },
                { label: "Test bali", val: `${selected.score} / 100` },
                { label: "Holat", val: statusConfig[selected.status].label },
              ].map((f) => (
                <div
                  key={f.label}
                  className="p-3 rounded-xl"
                  style={{ background: "var(--navy-800)" }}
                >
                  <div className="text-xs text-slate-500 mb-1">{f.label}</div>
                  <div className="text-sm font-medium text-white">{f.val}</div>
                </div>
              ))}
            </div>

            <div>
              <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold">
                Holat o'zgartirish
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(statusConfig).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => changeStatus(selected.id, key)}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all border"
                    style={{
                      background:
                        selected.status === key
                          ? "var(--gold-500)"
                          : "transparent",
                      color: selected.status === key ? "#000" : "#94a3b8",
                      borderColor:
                        selected.status === key
                          ? "var(--gold-500)"
                          : "rgba(255,255,255,0.1)",
                    }}
                  >
                    {cfg.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="secondary" onClick={() => setSelected(null)}>
                Yopish
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
