import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  GraduationCap,
  Clock,
  LayoutGrid,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button, Modal, FormField } from "../components/Ui";
import request from "../api";

// --- KONSTANTALAR ---
const LANGUAGES = [
  { code: "uz", label: "O'zbekcha" },
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
];

const PROGRAM_OPTIONS = {
  degrees: ["Bakalavr", "Magistr", "PhD", "Bakalavr / Magistr"],
  durations: ["2 yil", "3 yil", "4 yil", "5 yil"],
  categories: [
    { code: "DS", label: "Data Science" },
    { code: "IT", label: "Information Technology" },
    { code: "CS", label: "Computer Science" },
    { code: "AI", label: "Artificial Intelligence" },
  ],
  availableTags: ["BigData", "ML", "BI", "Python", "Java", "Cloud", "UI/UX"],
  icons: [
    { name: "Grafik", val: "📊" },
    { name: "Kod", val: "💻" },
    { name: "Xavfsizlik", val: "🛡️" },
    { name: "Miya", val: "🧠" },
  ],
  colors: [
    { name: "Yashil", value: "#10b981" },
    { name: "Ko'k", value: "#3b82f6" },
    { name: "Sariq", value: "#f59e0b" },
    { name: "Qizil", value: "#ef4444" },
  ],
};

const emptyForm = {
  name_uz: "",
  name_ru: "",
  name_en: "",
  desc_uz: "",
  desc_ru: "",
  desc_en: "",
  level: "Bakalavr",
  duration: "4 yil",
  places: "",
  category_short: "IT",
  tags: "",
  icon_url: "💻",
  bg_color: "#10b981",
};

export default function AkademikDasturlar() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("uz");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const currentLang = localStorage.getItem("lang") || "uz";

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await request.get("/academic_programs?select=*&order=id.asc");
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Xavfsiz Tag Splitter - Massiv yoki String bilan ishlaydi
  const getTagsArray = (tagsData) => {
    if (!tagsData) return [];
    if (Array.isArray(tagsData)) return tagsData;
    return typeof tagsData === "string"
      ? tagsData.split(",").filter(Boolean)
      : [];
  };

  const handleSave = async () => {
    try {
      // 1. Teglarni massivga aylantiramiz (Postgres text[] uchun)
      const tagsArray =
        typeof form.tags === "string"
          ? form.tags
              .split(",")
              .filter(Boolean)
              .map((t) => t.trim())
          : form.tags || [];

      const payload = {
        ...form,
        places: Number(form.places),
        // DIQQAT: string emas, massiv yuboramiz
        tags: tagsArray,
      };

      if (editing) {
        await request.patch(`/academic_programs?id=eq.${editing}`, payload);
      } else {
        await request.post("/academic_programs", payload);
      }

      fetchData();
      setModalOpen(false);
    } catch (err) {
      console.error("Xatolik tafsiloti:", err.response?.data || err.message);
      alert("Saqlashda xatolik yuz berdi!");
    }
  };

  const filtered = data.filter((d) =>
    ["uz", "ru", "en"].some((l) =>
      d[`name_${l}`]?.toLowerCase().includes(search.toLowerCase()),
    ),
  );

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-50/50 min-h-screen">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <LayoutGrid className="text-blue-600" />
            Akademik Yo'nalishlar
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
            onClick={() => {
              setForm(emptyForm);
              setEditing(null);
              setModalOpen(true);
            }}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
          >
            <Plus size={20} />{" "}
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
            <div
              className="h-1.5 w-full"
              style={{ backgroundColor: item.bg_color }}
            />

            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-5">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl border border-slate-100 shadow-inner">
                  {item.icon_url}
                </div>
                <div className="bg-emerald-50 text-emerald-600 text-[11px] font-black px-3 py-1.5 rounded-xl border border-emerald-100 uppercase">
                  {item.category_short}
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">
                {item[`name_${currentLang}`] || item.name_uz}
              </h3>

              <p className="text-sm text-slate-400 mb-5 line-clamp-2 italic">
                {item[`desc_${currentLang}`] || "Tavsif yo'q."}
              </p>

              {/* Tags Section - Xavfsiz render */}
              <div className="flex flex-wrap gap-2 mb-6">
                {getTagsArray(item.tags).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-bold bg-slate-50 text-slate-500 px-3 py-1 rounded-full border border-slate-100 uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                  <GraduationCap size={16} /> {item.level}
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                  <Clock size={16} /> {item.duration}
                </div>
              </div>
            </div>

            <div className="flex border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={() => {
                  setEditing(item.id);
                  setForm({ ...item, tags: getTagsArray(item.tags).join(",") });
                  setModalOpen(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold text-blue-600 hover:bg-white"
              >
                <Edit2 size={16} /> Tahrirlash
              </button>
              <button
                onClick={() => setDeleteId(item.id)}
                className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold text-red-500 hover:bg-white"
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
        title={editing ? "Tahrirlash" : "Yangi yo'nalish"}
      >
        <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-2">
          <div className="flex bg-slate-100 p-1 rounded-2xl sticky top-0 z-20">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => setActiveTab(l.code)}
                className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${activeTab === l.code ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <FormField label={`Yo'nalish nomi`}>
            <input
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 transition-all"
              value={form[`name_${activeTab}`] || ""}
              onChange={(e) =>
                setForm({ ...form, [`name_${activeTab}`]: e.target.value })
              }
            />
          </FormField>

          <FormField label={`Tavsif`}>
            <textarea
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500"
              value={form[`desc_${activeTab}`] || ""}
              onChange={(e) =>
                setForm({ ...form, [`desc_${activeTab}`]: e.target.value })
              }
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Kategoriya">
              <select
                className="w-full px-3 py-3 border border-slate-200 rounded-2xl text-sm bg-white outline-none"
                value={form.category_short}
                onChange={(e) =>
                  setForm({ ...form, category_short: e.target.value })
                }
              >
                {PROGRAM_OPTIONS.categories.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Ikona">
              <select
                className="w-full px-3 py-3 border border-slate-200 rounded-2xl text-sm bg-white outline-none"
                value={form.icon_url}
                onChange={(e) => setForm({ ...form, icon_url: e.target.value })}
              >
                {PROGRAM_OPTIONS.icons.map((i) => (
                  <option key={i.val} value={i.val}>
                    {i.name} {i.val}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Daraja">
              <select
                className="w-full px-3 py-3 border border-slate-200 rounded-2xl text-sm bg-white outline-none"
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
              >
                {PROGRAM_OPTIONS.degrees.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Davomiyligi">
              <select
                className="w-full px-3 py-3 border border-slate-200 rounded-2xl text-sm bg-white outline-none"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
              >
                {PROGRAM_OPTIONS.durations.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField label="Teglarni tanlang">
            <div className="flex flex-wrap gap-2">
              {PROGRAM_OPTIONS.availableTags.map((tag) => {
                const currentTags = getTagsArray(form.tags);
                const isSelected = currentTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      const updated = isSelected
                        ? currentTags.filter((t) => t !== tag)
                        : [...currentTags, tag];
                      setForm({ ...form, tags: updated.join(",") });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${isSelected ? "bg-blue-600 border-blue-600 text-white shadow-md" : "bg-white border-slate-200 text-slate-500"}`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </FormField>
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

      {/* Delete Confirmation */}
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
            Haqiqatan ham ushbu yo'nalishni o'chirmoqchimisiz?
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
              onClick={async () => {
                await request.delete(`/academic_programs?id=eq.${deleteId}`);
                setData(data.filter((d) => d.id !== deleteId));
                setDeleteId(null);
              }}
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
