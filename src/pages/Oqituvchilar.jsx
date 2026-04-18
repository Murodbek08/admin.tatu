import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  UserCheck,
  Mail,
  Phone,
  FileText,
  AlertCircle,
  Globe,
  Link as LinkIcon,
} from "lucide-react";
import { Button, Modal, FormField } from "../components/Ui";
import request from "../api";

const LANGS = [
  { key: "uz", label: "UZ" },
  { key: "ru", label: "RU" },
  { key: "en", label: "EN" },
];

const AVATAR_COLORS = [
  "bg-blue-600",
  "bg-emerald-600",
  "bg-cyan-600",
  "bg-rose-600",
  "bg-amber-600",
  "bg-violet-600",
];

export default function FacultyAdmin() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");
  const [activeLang, setActiveLang] = useState("uz");

  const [form, setForm] = useState({
    pubs: 0,
    email: "",
    phone: "",
    telegram: "",
    instagram: "",
    facebook: "",
    // Har bir til uchun bo'sh joylar
    name_uz: "",
    name_ru: "",
    name_en: "",
    role_uz: "",
    role_ru: "",
    role_en: "",
    dept_uz: "",
    dept_ru: "",
    dept_en: "",
    research_uz: "",
    research_ru: "",
    research_en: "",
    bio_uz: "",
    bio_ru: "",
    bio_en: "",
    education_uz: "",
    education_ru: "",
    education_en: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await request.get("/faculty?select=*&order=name_uz.asc");
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

  const openCreate = () => {
    setEditing(null);
    setForm({ pubs: 0, email: "", phone: "" });
    setActiveLang("uz");
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item.id);
    setForm({ ...item });
    setActiveLang("uz");
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload = { ...form };

      if (!editing) {
        // Avtomatik generatsiya (Faqat birinchi marta)
        const name = form.name_uz || form.name_ru || form.name_en || "User";
        payload.initials = name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
        payload.avatar_cls =
          AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
        payload.image = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
      }

      if (editing) await request.patch(`/faculty?id=eq.${editing}`, payload);
      else await request.post("/faculty", payload);

      fetchData();
      setModalOpen(false);
    } catch (e) {
      alert("Saqlashda xatolik!");
    }
  };

  const handleDelete = async () => {
    try {
      await request.delete(`/faculty?id=eq.${deleteId}`);
      setData((d) => d.filter((x) => x.id !== deleteId));
      setDeleteId(null);
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = data.filter(
    (d) =>
      d.name_uz?.toLowerCase().includes(search.toLowerCase()) ||
      d.dept_uz?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <UserCheck className="text-blue-600" /> Professor-o'qituvchilar
          </h1>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm w-full md:w-64 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
              placeholder="Qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={openCreate}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <Plus size={20} />{" "}
            <span className="hidden sm:inline">Qo'shish</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className={`h-1.5 ${item.avatar_cls}`} />
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-14 h-14 rounded-2xl ${item.avatar_cls} flex items-center justify-center text-white font-black overflow-hidden`}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    item.initials
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 truncate">
                    {item.name_uz}
                  </h3>
                  <p className="text-xs text-blue-600 font-bold uppercase">
                    {item.role_uz}
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <Globe size={14} /> {item.dept_uz}
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} /> {item.email || "—"}
                </div>
                <div className="flex items-center gap-2">
                  <FileText size={14} /> {item.pubs} ta nashr
                </div>
              </div>
            </div>
            <div className="flex border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={() => openEdit(item)}
                className="flex-1 py-4 text-sm font-bold text-blue-600 hover:bg-white transition-colors flex items-center justify-center gap-2"
              >
                <Edit2 size={16} /> Tahrirlash
              </button>
              <button
                onClick={() => setDeleteId(item.id)}
                className="flex-1 py-4 text-sm font-bold text-red-500 hover:bg-white transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={16} /> O'chirish
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Tahrirlash" : "Yangi xodim"}
      >
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scroll">
          {/* Til tanlash (Akademik dasturlardagi kabi) */}
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

          {/* Har bir til uchun alohida kiritiladigan maydonlar */}
          <div className="space-y-4">
            <FormField label={`ISM-SHARIF (${activeLang.toUpperCase()})`}>
              <input
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500"
                value={form[`name_${activeLang}`] || ""}
                onChange={(e) =>
                  setForm({ ...form, [`name_${activeLang}`]: e.target.value })
                }
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label={`LAVOZIM (${activeLang.toUpperCase()})`}>
                <input
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500"
                  value={form[`role_${activeLang}`] || ""}
                  onChange={(e) =>
                    setForm({ ...form, [`role_${activeLang}`]: e.target.value })
                  }
                />
              </FormField>
              <FormField label={`KAFEDRA (${activeLang.toUpperCase()})`}>
                <input
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500"
                  value={form[`dept_${activeLang}`] || ""}
                  onChange={(e) =>
                    setForm({ ...form, [`dept_${activeLang}`]: e.target.value })
                  }
                />
              </FormField>
            </div>

            <FormField
              label={`TADQIQOT YO'NALISHI (${activeLang.toUpperCase()})`}
            >
              <input
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500"
                value={form[`research_${activeLang}`] || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [`research_${activeLang}`]: e.target.value,
                  })
                }
              />
            </FormField>

            <FormField label={`BIOGRAFIYA (${activeLang.toUpperCase()})`}>
              <textarea
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 min-h-[100px]"
                value={form[`bio_${activeLang}`] || ""}
                onChange={(e) =>
                  setForm({ ...form, [`bio_${activeLang}`]: e.target.value })
                }
              />
            </FormField>

            <FormField label={`TA'LIM (${activeLang.toUpperCase()})`}>
              <input
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500"
                value={form[`education_${activeLang}`] || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [`education_${activeLang}`]: e.target.value,
                  })
                }
              />
            </FormField>
          </div>

          <div className="h-px bg-slate-100 my-2" />
          <h4 className="text-[10px] font-black text-slate-400 tracking-widest uppercase">
            Umumiy ma'lumotlar
          </h4>

          {/* Umumiy maydonlar */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="EMAIL">
              <input
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm outline-none"
                value={form.email || ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </FormField>
            <FormField label="TELEFON">
              <input
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm outline-none"
                value={form.phone || ""}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FormField label="TG">
              <input
                className="w-full px-3 py-3 border border-slate-200 rounded-2xl text-sm outline-none"
                placeholder="t.me/.."
                value={form.telegram || ""}
                onChange={(e) => setForm({ ...form, telegram: e.target.value })}
              />
            </FormField>
            <FormField label="INSTA">
              <input
                className="w-full px-3 py-3 border border-slate-200 rounded-2xl text-sm outline-none"
                value={form.instagram || ""}
                onChange={(e) =>
                  setForm({ ...form, instagram: e.target.value })
                }
              />
            </FormField>
            <FormField label="FB">
              <input
                className="w-full px-3 py-3 border border-slate-200 rounded-2xl text-sm outline-none"
                value={form.facebook || ""}
                onChange={(e) => setForm({ ...form, facebook: e.target.value })}
              />
            </FormField>
            <FormField label="NASHRLAR">
              <input
                type="number"
                className="w-full px-3 py-3 border border-slate-200 rounded-2xl text-sm outline-none"
                value={form.pubs || 0}
                onChange={(e) =>
                  setForm({ ...form, pubs: parseInt(e.target.value) })
                }
              />
            </FormField>
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-5 border-t">
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

      {/* Delete Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="O'chirish"
      >
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle size={32} />
          </div>
          <p className="text-sm text-slate-500">
            Haqiqatan ham ushbu ma'lumotni o'chirmoqchimisiz?
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setDeleteId(null)}
              className="flex-1 rounded-2xl"
            >
              Bekor qilish
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
