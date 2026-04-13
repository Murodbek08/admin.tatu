import { useState } from "react";
import { Card, Badge, Button, Modal, EmptyState } from "../components/Ui";

const initialMessages = [
  {
    id: 1,
    name: "Nilufar Rashidova",
    email: "nilufar@gmail.com",
    phone: "+998 90 111 22 33",
    subject: "Qabul haqida savol",
    message:
      "Assalomu alaykum. MSc Sun'iy Intellekt dasturiga qabul shartlari haqida ma'lumot olmoqchiman. Qanday hujjatlar talab qilinadi?",
    date: "13 Apr, 2026",
    status: "unread",
    category: "Qabul",
  },
  {
    id: 2,
    name: "Murod Begmatov",
    email: "murod@mail.ru",
    phone: "+998 93 222 33 44",
    subject: "Hamkorlik taklifi",
    message:
      "Biz IT kompaniyamiz sizning universitetingiz bilan hamkorlik qilishni taklif qilamiz. Talabalar uchun amaliyot va ish imkoniyatlari taqdim etamiz.",
    date: "12 Apr, 2026",
    status: "read",
    category: "Hamkorlik",
  },
  {
    id: 3,
    name: "Sarvinoz Qosimova",
    email: "sarvinoz@yandex.ru",
    phone: "+998 97 333 44 55",
    subject: "O'quv materiallar",
    message:
      "Kurslarga kirish uchun qanday materiallar kerak? Darsliklar tavsiya qila olasizmi?",
    date: "11 Apr, 2026",
    status: "replied",
    category: "Ta'lim",
  },
  {
    id: 4,
    name: "Jasur Mirzoev",
    email: "jasur@gmail.com",
    phone: "+998 91 444 55 66",
    subject: "Stipendiya haqida",
    message:
      "Magistratura talabalariga stipendiya beriladimi? Qanday miqdorda?",
    date: "10 Apr, 2026",
    status: "unread",
    category: "Moliya",
  },
];

const statusConfig = {
  unread: { color: "red", label: "O'qilmagan" },
  read: { color: "slate", label: "O'qilgan" },
  replied: { color: "green", label: "Javob berildi" },
};

const categoryColors = {
  Qabul: "blue",
  Hamkorlik: "gold",
  "Ta'lim": "green",
  Moliya: "red",
  Boshqa: "slate",
};

export default function Aloqa() {
  const [data, setData] = useState(initialMessages);
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [replyText, setReplyText] = useState("");

  const openMessage = (item) => {
    setSelected(item);
    setReplyText("");
    if (item.status === "unread") {
      setData(
        data.map((d) => (d.id === item.id ? { ...d, status: "read" } : d)),
      );
      setSelected({ ...item, status: "read" });
    }
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    setData(
      data.map((d) => (d.id === selected.id ? { ...d, status: "replied" } : d)),
    );
    setSelected({ ...selected, status: "replied" });
    setReplyText("");
    alert(`Javob yuborildi: "${replyText}"`);
  };

  const handleDelete = (id) => {
    setData(data.filter((d) => d.id !== id));
    setSelected(null);
  };

  const filtered = data.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.subject.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || d.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const unreadCount = data.filter((d) => d.status === "unread").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <p className="text-sm text-slate-500">{data.length} ta xabar</p>
          {unreadCount > 0 && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-bold text-black"
              style={{ background: "var(--gold-500)" }}
            >
              {unreadCount} yangi
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {["all", "unread", "read", "replied"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
              style={{
                background:
                  filterStatus === s ? "var(--gold-500)" : "var(--navy-800)",
                color: filterStatus === s ? "#000" : "#94a3b8",
              }}
            >
              {s === "all" ? "Barchasi" : statusConfig[s]?.label}
            </button>
          ))}
          <input
            className="admin-input w-40"
            placeholder="Qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState icon="✉️" title="Xabar topilmadi" />
        ) : (
          <div
            className="divide-y"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}
          >
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => openMessage(item)}
                className="flex items-start gap-4 px-6 py-4 cursor-pointer transition-colors hover:bg-white/3 flex-wrap sm:flex-nowrap"
                style={{
                  background:
                    item.status === "unread"
                      ? "rgba(245,158,11,0.03)"
                      : "transparent",
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-black flex-shrink-0"
                  style={{ background: "var(--gold-500)" }}
                >
                  {item.name
                    .split(" ")
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span
                      className={`text-sm font-semibold ${item.status === "unread" ? "text-white" : "text-slate-300"}`}
                    >
                      {item.name}
                    </span>
                    <Badge color={categoryColors[item.category] || "slate"}>
                      {item.category}
                    </Badge>
                    {item.status === "unread" && (
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: "var(--gold-500)" }}
                      />
                    )}
                  </div>
                  <p
                    className={`text-sm mb-1 ${item.status === "unread" ? "text-slate-300" : "text-slate-500"}`}
                  >
                    {item.subject}
                  </p>
                  <p className="text-xs text-slate-600 truncate">
                    {item.message}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="text-xs text-slate-600">{item.date}</span>
                  <Badge color={statusConfig[item.status].color}>
                    {statusConfig[item.status].label}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Message Detail Modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Xabar Tafsiloti"
      >
        {selected && (
          <div className="space-y-4">
            <div
              className="p-4 rounded-xl"
              style={{ background: "var(--navy-800)" }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-black flex-shrink-0"
                  style={{ background: "var(--gold-500)" }}
                >
                  {selected.name
                    .split(" ")
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white text-sm">
                    {selected.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {selected.email} · {selected.phone}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    {selected.date}
                  </div>
                </div>
                <Badge color={categoryColors[selected.category] || "slate"}>
                  {selected.category}
                </Badge>
              </div>
              <div
                className="border-t pt-3"
                style={{ borderColor: "rgba(255,255,255,0.06)" }}
              >
                <div className="text-sm font-semibold text-white mb-2">
                  {selected.subject}
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {selected.message}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Javob yozing
              </label>
              <textarea
                className="admin-input"
                placeholder="Xabarga javob..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(selected.id)}
              >
                🗑 O'chirish
              </Button>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setSelected(null)}>
                  Yopish
                </Button>
                <Button onClick={handleReply} disabled={!replyText.trim()}>
                  📤 Javob Yuborish
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
