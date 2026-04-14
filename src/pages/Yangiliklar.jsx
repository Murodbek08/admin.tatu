import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  Calendar,
  Newspaper,
  AlertCircle,
} from "lucide-react";
import { Button, Modal, FormField } from "../components/Ui";
import request from "../api";

const CAT_KEYS = [
  { value: "innovation", label: "Innovatsiya" },
  { value: "education", label: "Ta'lim" },
  { value: "event", label: "Tadbir" },
  { value: "startup", label: "Startup" },
];

const LANGS = [
  { key: "uz", label: "UZ" },
  { key: "ru", label: "RU" },
  { key: "en", label: "EN" },
];

export default function Yangiliklar() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({
    cat_key: "innovation",
    is_featured: false,
  });
  const [activeLang, setActiveLang] = useState("uz");
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await request.get("/news?select=*&order=created_at.desc");
      setData(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openEdit = (item) => {
    setEditing(item.id);
    setForm({ ...item });
    setActiveLang("uz");
    setModalOpen(true);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ cat_key: "innovation", is_featured: false });
    setActiveLang("uz");
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editing) await request.patch(`/news?id=eq.${editing}`, form);
      else await request.post("/news", form);
      fetchData();
      setModalOpen(false);
    } catch (e) {
      alert("Xatolik!");
    }
  };

  const handleDelete = async () => {
    try {
      await request.delete(`/news?id=eq.${deleteId}`);
      setData((d) => d.filter((x) => x.id !== deleteId));
      setDeleteId(null);
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = data.filter((d) =>
    d.title_uz?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-50/50 min-h-screen">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Newspaper className="text-blue-600" />
            Yangiliklar
          </h1>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              className="w-full md:w-72 pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
              placeholder="Qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={openCreate}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Qo'shish</span>
          </button>
        </div>
      </div>

      {/* --- CARDS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 rounded-[2rem] flex flex-col shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
          >
            {/* Yuqori rangli chiziq */}
            <div className="h-1.5 w-full bg-blue-500" />

            {/* Rasm */}
            <div className="relative h-48 bg-slate-100 overflow-hidden">
              <img
                src={`https://img.youtube.com/vi/${extractVideoId(item.embed_url)}/mqdefault.jpg`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                alt=""
              />
              {/* Kategoriya badge */}
              <div className="absolute top-3 left-3">
                <span className="bg-white/95 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-blue-600 border border-blue-50 shadow-sm uppercase tracking-wider">
                  {item.cat_uz ||
                    CAT_KEYS.find((c) => c.value === item.cat_key)?.label ||
                    "Yangilik"}
                </span>
              </div>
              {/* Featured yulduz */}
              {item.is_featured && (
                <div className="absolute top-3 right-3 bg-amber-400 p-1.5 rounded-full shadow-md">
                  <Star size={12} fill="white" className="text-white" />
                </div>
              )}
            </div>

            {/* Kontent */}
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold mb-3 uppercase tracking-wide">
                <Calendar size={13} />
                {item.date_label || "—"}
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight line-clamp-2">
                {item.title_uz}
              </h3>

              <p className="text-sm text-slate-400 mb-4 line-clamp-3 italic flex-1">
                {item.excerpt_uz || "Tavsif yo'q."}
              </p>
            </div>

            {/* Footer tugmalari — Akademik Dasturlar uslubi */}
            <div className="flex border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={() => openEdit(item)}
                className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold text-blue-600 hover:bg-white transition-colors"
              >
                <Edit2 size={16} /> Tahrirlash
              </button>
              <button
                onClick={() => setDeleteId(item.id)}
                className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold text-red-500 hover:bg-white transition-colors"
              >
                <Trash2 size={16} /> O'chirish
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- FORM MODAL --- */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Tahrirlash" : "Yangi yangilik"}
      >
        <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-2">
          {/* Til tabs */}
          <div className="flex bg-slate-100 p-1 rounded-2xl sticky top-0 z-20">
            {LANGS.map((l) => (
              <button
                key={l.key}
                onClick={() => setActiveLang(l.key)}
                className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
                  activeLang === l.key
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <FormField label={`SARLAVHA (${activeLang.toUpperCase()})`}>
            <input
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 transition-all"
              value={form[`title_${activeLang}`] || ""}
              onChange={(e) =>
                setForm({ ...form, [`title_${activeLang}`]: e.target.value })
              }
            />
          </FormField>

          <FormField label={`TAVSIF (${activeLang.toUpperCase()})`}>
            <textarea
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 min-h-[100px]"
              value={form[`excerpt_${activeLang}`] || ""}
              onChange={(e) =>
                setForm({ ...form, [`excerpt_${activeLang}`]: e.target.value })
              }
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="KATEGORIYA">
              <select
                className="w-full px-3 py-3 border border-slate-200 rounded-2xl text-sm bg-white outline-none"
                value={form.cat_key}
                onChange={(e) => setForm({ ...form, cat_key: e.target.value })}
              >
                {CAT_KEYS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="SANA BELGISI">
              <input
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 transition-all"
                placeholder="20 Iyun, 2024"
                value={form.date_label || ""}
                onChange={(e) =>
                  setForm({ ...form, date_label: e.target.value })
                }
              />
            </FormField>
          </div>

          <FormField label="YOUTUBE LINK">
            <input
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 transition-all"
              placeholder="https://youtube.com/embed/..."
              value={form.embed_url || ""}
              onChange={(e) => setForm({ ...form, embed_url: e.target.value })}
            />
          </FormField>

          <label className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer">
            <span className="text-sm font-bold text-slate-700">
              Asosiy sahifada ko'rsatish
            </span>
            <div
              onClick={() =>
                setForm({ ...form, is_featured: !form.is_featured })
              }
              className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${
                form.is_featured
                  ? "bg-blue-600 border-blue-600"
                  : "bg-white border-slate-300"
              }`}
            >
              {form.is_featured && (
                <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                  <path
                    d="M1 4L4.5 7.5L11 1"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </label>
        </div>

        <div className="flex gap-3 mt-8 pt-5 border-t">
          <Button
            variant="secondary"
            onClick={() => setModalOpen(false)}
            className="flex-1 rounded-2xl py-3.5"
          >
            Bekor qilish
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-white rounded-2xl py-3.5 font-bold shadow-xl shadow-blue-200"
          >
            Saqlash
          </Button>
        </div>
      </Modal>

      {/* --- DELETE MODAL --- */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="O'chirish"
      >
        <div className="text-center py-4 space-y-4">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle size={40} />
          </div>
          <p className="text-sm text-slate-500">
            Haqiqatan ham ushbu yangilikni o'chirmoqchimisiz?
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setDeleteId(null)}
              className="flex-1 rounded-2xl"
            >
              Qolsin
            </Button>
            <Button
              onClick={handleDelete}
              className="flex-1 bg-red-600 text-white rounded-2xl font-bold"
            >
              O'chirilsin
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function extractVideoId(url) {
  if (!url) return "";
  const match =
    url.match(/embed\/([^?&]+)/) ||
    url.match(/v=([^?&]+)/) ||
    url.match(/youtu\.be\/([^?&]+)/);
  return match ? match[1] : "";
}
