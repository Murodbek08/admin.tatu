import { useState } from "react";
import {
  Card,
  Badge,
  Button,
  Modal,
  FormField,
  EmptyState,
} from "../components/Ui";

const initialNews = [
  {
    id: 1,
    title: "Ochiq Eshiklar Kuni — Muhandislik",
    date: "20 Mart, 2026",
    category: "Tadbir",
    status: "published",
    excerpt:
      "TATU Muhandislik Maktabi ochiq eshiklar kuniga taklif etadi. Barcha dasturlar bilan tanishing.",
  },
  {
    id: 2,
    title: "MSc Sun'iy Intellekt dasturiga qabul boshlandi",
    date: "15 Mart, 2026",
    category: "Qabul",
    status: "published",
    excerpt:
      "2026-yil uchun qabul arizalari qabul qilinmoqda. Muddati: 1 Iyun 2026.",
  },
  {
    id: 3,
    title: "TATU tadqiqot markazi yangi grant yutdi",
    date: "10 Mart, 2026",
    category: "Tadqiqot",
    status: "draft",
    excerpt:
      "Xalqaro hamkorlik doirasida 500,000 USD miqdorida grant mablag'i ajratildi.",
  },
];

const emptyForm = {
  title: "",
  date: "",
  category: "Yangilik",
  status: "draft",
  excerpt: "",
};
const categories = [
  "Tadbir",
  "Qabul",
  "Tadqiqot",
  "Yangilik",
  "E'lon",
  "Hamkorlik",
];

export default function Yangiliklar() {
  const [data, setData] = useState(initialNews);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };
  const openEdit = (item) => {
    setEditing(item.id);
    setForm({ ...item });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      setData(
        data.map((d) => (d.id === editing ? { ...form, id: editing } : d)),
      );
    } else {
      setData([...data, { ...form, id: Date.now() }]);
    }
    setModalOpen(false);
  };

  const toggleStatus = (id) => {
    setData(
      data.map((d) =>
        d.id === id
          ? { ...d, status: d.status === "published" ? "draft" : "published" }
          : d,
      ),
    );
  };

  const filtered = data.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <p className="text-sm text-slate-500">{data.length} ta yangilik</p>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            className="admin-input w-48"
            placeholder="Qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={openAdd}>+ Yangi E'lon</Button>
        </div>
      </div>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState icon="📰" title="Yangilik topilmadi" />
        ) : (
          <div
            className="divide-y"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}
          >
            {filtered.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 px-6 py-4 hover:bg-white/2 transition-colors flex-wrap md:flex-nowrap"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Badge color="blue">{item.category}</Badge>
                    <Badge
                      color={item.status === "published" ? "green" : "slate"}
                    >
                      {item.status === "published"
                        ? "E'lon qilingan"
                        : "Qoralama"}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-semibold text-white mt-1.5 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {item.excerpt}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">{item.date}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleStatus(item.id)}
                    className="text-xs px-3 py-1.5 rounded-lg transition-colors font-medium"
                    style={{
                      background:
                        item.status === "published"
                          ? "rgba(100,116,139,0.15)"
                          : "rgba(34,197,94,0.12)",
                      color:
                        item.status === "published" ? "#94a3b8" : "#4ade80",
                    }}
                  >
                    {item.status === "published" ? "Yashirish" : "E'lon qilish"}
                  </button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => openEdit(item)}
                  >
                    ✏️
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteId(item.id)}
                  >
                    🗑
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Yangilikni Tahrirlash" : "Yangi E'lon Qo'shish"}
      >
        <div className="space-y-4">
          <FormField label="Sarlavha" required>
            <input
              className="admin-input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Yangilik sarlavhasi"
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Kategoriya">
              <select
                className="admin-input"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Sana">
              <input
                className="admin-input"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </FormField>
          </div>
          <FormField label="Qisqacha mazmun">
            <textarea
              className="admin-input"
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="Yangilik haqida qisqacha..."
            />
          </FormField>
          <FormField label="Holat">
            <select
              className="admin-input"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="draft">Qoralama</option>
              <option value="published">E'lon qilingan</option>
            </select>
          </FormField>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button onClick={handleSave}>💾 Saqlash</Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Tasdiqlash"
      >
        <p className="text-slate-400 text-sm mb-6">
          Bu yangilikni o'chirmoqchimisiz?
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>
            Bekor qilish
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setData(data.filter((d) => d.id !== deleteId));
              setDeleteId(null);
            }}
          >
            🗑 O'chirish
          </Button>
        </div>
      </Modal>
    </div>
  );
}
