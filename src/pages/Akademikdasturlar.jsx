import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Calendar,
  Users,
  Clock,
  Tag,
  GraduationCap,
  Globe,
  AlignLeft,
} from "lucide-react";
import {
  Badge,
  Button,
  Modal,
  FormField,
  EmptyState,
  Card,
} from "../components/Ui";
import request from "../api";

const LANGUAGES = [
  { code: "uz", label: "O'zbekcha" },
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
];

const PROGRAM_OPTIONS = {
  degrees: [
    "Bakalavr",
    "Magistr",
    "PhD",
    "Bakalavr / Magistr",
    "Magistr / PhD",
  ],
  categories: [
    { code: "CS", label: "Computer Science (CS)" },
    { code: "CE", label: "Computer Engineering (CE)" },
    { code: "IT", label: "Information Technology (IT)" },
    { code: "DS", label: "Data Science (DS)" },
    { code: "EE", label: "Electrical Engineering (EE)" },
    { code: "AI", label: "Artificial Intelligence (AI)" },
  ],
  colors: [
    { name: "Ko'k", value: "#3b82f6" },
    { name: "Yashil", value: "#22c55e" },
    { name: "Sariq", value: "#eab308" },
    { name: "Binafsha", value: "#a855f7" },
    { name: "Qizil", value: "#ef4444" },
    { name: "Yalpiz", value: "#14b8a6" },
  ],
};

const today = new Date().toISOString().split("T")[0];

const emptyForm = {
  name_uz: "",
  name_ru: "",
  name_en: "",
  desc_uz: "",
  desc_ru: "",
  desc_en: "", // Tavsiflar qo'shildi
  level: PROGRAM_OPTIONS.degrees[0],
  duration: "4 yil",
  places: "",
  admission: today,
  tags: "",
  status: "active",
  category_code: PROGRAM_OPTIONS.categories[0].code,
  bg_color: PROGRAM_OPTIONS.colors[0].value,
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

  const handleSave = async () => {
    // Teaglarni massivga o'tkazish
    const tagsArray =
      typeof form.tags === "string"
        ? form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : form.tags;

    const payload = { ...form, places: Number(form.places), tags: tagsArray };

    try {
      if (editing)
        await request.patch(`/academic_programs?id=eq.${editing}`, payload);
      else await request.post("/academic_programs", payload);
      fetchData();
      setModalOpen(false);
    } catch (err) {
      alert("Xatolik yuz berdi!");
    }
  };

  const filtered = data.filter((d) =>
    ["uz", "ru", "en"].some((l) =>
      d[`name_${l}`]?.toLowerCase().includes(search.toLowerCase()),
    ),
  );

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen text-slate-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="text-blue-600" /> Akademik Dasturlar
          </h1>
          <p className="text-slate-500 text-sm italic">
            Boshqaruv paneli / Yo'nalishlar
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg outline-none w-full sm:w-64 focus:ring-2 focus:ring-blue-500"
              placeholder="Qidiruv..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            onClick={() => {
              setForm(emptyForm);
              setEditing(null);
              setActiveTab("uz");
              setModalOpen(true);
            }}
            className="bg-blue-600 text-white flex items-center gap-2"
          >
            <Plus size={18} /> Yangi qo'shish
          </Button>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <Card
            key={item.id}
            className="bg-white border-slate-200 shadow-sm group overflow-hidden"
          >
            <div className="h-1.5" style={{ background: item.bg_color }} />
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-2">
                  <Badge className="bg-blue-50 text-blue-700">
                    {item.level}
                  </Badge>
                  <Badge
                    className={
                      item.status === "hot"
                        ? "bg-orange-50 text-orange-600"
                        : "bg-green-50 text-green-600"
                    }
                  >
                    {item.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditing(item.id);
                      setForm({ ...item, tags: item.tags?.join(", ") });
                      setModalOpen(true);
                    }}
                    className="text-blue-600 p-1 hover:bg-blue-50 rounded"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="text-red-600 p-1 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                {item[`name_${currentLang}`] || item.name_uz}
              </h3>
              <p className="text-slate-500 text-sm mt-2 line-clamp-2">
                {item[`desc_${currentLang}`] || item.desc_uz}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-500 border-t pt-3">
                <div className="flex items-center gap-2">
                  <Clock size={15} /> {item.duration}
                </div>
                <div className="flex items-center gap-2">
                  <Users size={15} /> {item.places} o'rin
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Tahrirlash" : "Yangi yo'nalish"}
      >
        <div className="space-y-5 max-h-[75vh] overflow-y-auto px-1">
          {/* Tillar uchun Tablar */}
          <div className="bg-slate-100 p-1 rounded-lg flex gap-1 sticky top-0 z-10">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setActiveTab(lang.code)}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === lang.code ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Dinamik Inputlar (Tanlangan tilga qarab) */}
          <div className="space-y-4 animate-in fade-in duration-300">
            <FormField
              label={`Yo'nalish nomi (${activeTab.toUpperCase()})`}
              required
            >
              <input
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={form[`name_${activeTab}`]}
                onChange={(e) =>
                  setForm({ ...form, [`name_${activeTab}`]: e.target.value })
                }
                placeholder={`${activeTab} tilida sarlavha...`}
              />
            </FormField>

            <FormField label={`Tavsif (${activeTab.toUpperCase()})`}>
              <textarea
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                value={form[`desc_${activeTab}`] || ""}
                onChange={(e) =>
                  setForm({ ...form, [`desc_${activeTab}`]: e.target.value })
                }
                placeholder={`${activeTab} tilida batafsil ma'lumot...`}
              />
            </FormField>
          </div>

          <hr className="border-slate-100" />

          {/* Umumiy Sozlamalar */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Daraja">
              <select
                className="w-full px-3 py-2 border rounded-lg bg-white"
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
              >
                {PROGRAM_OPTIONS.degrees.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Kategoriya">
              <select
                className="w-full px-3 py-2 border rounded-lg bg-white"
                value={form.category_code}
                onChange={(e) =>
                  setForm({ ...form, category_code: e.target.value })
                }
              >
                {PROGRAM_OPTIONS.categories.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="O'rinlar soni">
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg"
                value={form.places}
                onChange={(e) => setForm({ ...form, places: e.target.value })}
              />
            </FormField>
            <FormField label="Muddati">
              <select
                className="w-full px-3 py-2 border rounded-lg bg-white"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
              >
                <option>2 yil</option>
                <option>3 yil</option>
                <option>4 yil</option>
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Qabul sanasi">
              <input
                type="date"
                className="w-full px-3 py-2 border rounded-lg"
                value={form.admission}
                onChange={(e) =>
                  setForm({ ...form, admission: e.target.value })
                }
              />
            </FormField>
            <FormField label="Kartochka rangi">
              <div className="flex gap-1.5 py-1">
                {PROGRAM_OPTIONS.colors.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setForm({ ...form, bg_color: c.value })}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${form.bg_color === c.value ? "border-slate-800 scale-125" : "border-transparent"}`}
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
            </FormField>
          </div>

          <FormField label="Teglar (vergul bilan ajrating)">
            <div className="relative">
              <Tag
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="Veb, Dizayn, AI"
              />
            </div>
          </FormField>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Bekor qilish
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 text-white px-8">
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
        <p className="text-slate-600 mb-6">
          Ushbu yo'nalishni o'chirib tashlamoqchimisiz? Ma'lumotni qayta tiklab
          bo'lmaydi.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>
            Yo'q
          </Button>
          <Button
            onClick={async () => {
              await request.delete(`/academic_programs?id=eq.${deleteId}`);
              setData(data.filter((d) => d.id !== deleteId));
              setDeleteId(null);
            }}
            className="bg-red-600 text-white"
          >
            Ha, o'chirilsin
          </Button>
        </div>
      </Modal>
    </div>
  );
}
