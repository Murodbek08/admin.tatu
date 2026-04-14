
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Loader2,
  Mail,
  Phone,
  Send,
  Instagram,
  Facebook,
  GraduationCap,
  BookOpen,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

// --- O'z Supabase URL va ANON KEY ni kiriting ---
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

// ─── Ko'p tilli tablar ───────────────────────────────────────
const LANGS = [
  { code: "uz", label: "O'zbekcha" },
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
];

const ROLES = [
  "Dekan",
  "Professor",
  "Dotsent",
  "O'qituvchi",
  "Assistent",
  "Kafedra mudiri",
];
const DEGREES = ["BSc", "MSc", "PhD", "Professor"];
const AVATAR_COLORS = [
  { label: "Ko'k", value: "#2563eb" },
  { label: "Yashil", value: "#059669" },
  { label: "Sariq", value: "#d97706" },
  { label: "Qizil", value: "#dc2626" },
  { label: "Binafsha", value: "#7c3aed" },
  { label: "Havorang", value: "#0891b2" },
];

const EMPTY_FORM = {
  name_uz: "",
  name_ru: "",
  name_en: "",
  role_uz: "O'qituvchi",
  role_ru: "",
  role_en: "",
  dept_uz: "",
  dept_ru: "",
  dept_en: "",
  bio_uz: "",
  bio_ru: "",
  bio_en: "",
  research_uz: "",
  research_ru: "",
  research_en: "",
  education: "",
  pubs: 0,
  email: "",
  phone: "",
  telegram: "",
  instagram: "",
  facebook: "",
  image_url: "",
  initials: "",
  avatar_color: "#2563eb",
  status: "active",
};

// ─── Toast komponent ─────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      className={`fixed bottom-6 right-6 z-[99999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-bold transition-all
      ${type === "success" ? "bg-emerald-600" : "bg-red-600"}`}
    >
      {type === "success" ? (
        <CheckCircle size={18} />
      ) : (
        <AlertCircle size={18} />
      )}
      {msg}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
}

// ─── Asosiy komponent ────────────────────────────────────────
export default function Oqituvchilar() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = yangi
  const [form, setForm] = useState(EMPTY_FORM);
  const [langTab, setLangTab] = useState("uz");
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);

  const notify = (msg, type = "success") => setToast({ msg, type });

  // ── Fetch ──────────────────────────────────────────────────
  const fetchData = async () => {
    setLoading(true);
    const { data: rows, error } = await supabase
      .from("faculty")
      .select("*")
      .order("id", { ascending: true });
    if (error) notify("Ma'lumot yuklanmadi!", "error");
    else setData(rows || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ── Initials avtomatik ─────────────────────────────────────
  const autoInitials = (name) =>
    (name || "")
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0] || "")
      .join("")
      .toUpperCase();

  const handleNameChange = (val) => {
    const updated = { ...form, name_uz: val };
    if (!form.initials || form.initials === autoInitials(form.name_uz)) {
      updated.initials = autoInitials(val);
    }
    setForm(updated);
  };

  // ── Modal ochish ───────────────────────────────────────────
  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setLangTab("uz");
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item.id);
    setForm({ ...EMPTY_FORM, ...item });
    setLangTab("uz");
    setModalOpen(true);
  };

  // ── Save ───────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.name_uz.trim()) return notify("Ism (UZ) majburiy!", "error");
    setSaving(true);
    const payload = { ...form, pubs: Number(form.pubs) || 0 };

    let error;
    if (editing) {
      ({ error } = await supabase
        .from("faculty")
        .update(payload)
        .eq("id", editing));
    } else {
      delete payload.id;
      ({ error } = await supabase.from("faculty").insert(payload));
    }

    if (error) notify("Saqlashda xatolik: " + error.message, "error");
    else {
      notify(
        editing ? "Muvaffaqiyatli yangilandi!" : "Muvaffaqiyatli qo'shildi!",
      );
      setModalOpen(false);
      fetchData();
    }
    setSaving(false);
  };

  // ── Delete ─────────────────────────────────────────────────
  const handleDelete = async () => {
    const { error } = await supabase
      .from("faculty")
      .delete()
      .eq("id", deleteId);
    if (error) notify("O'chirishda xatolik!", "error");
    else {
      notify("O'qituvchi o'chirildi!");
      setData(data.filter((d) => d.id !== deleteId));
    }
    setDeleteId(null);
  };

  // ── Filter ─────────────────────────────────────────────────
  const filtered = data.filter((d) => {
    const q = search.toLowerCase();
    return (
      d.name_uz?.toLowerCase().includes(q) ||
      d.dept_uz?.toLowerCase().includes(q) ||
      d.email?.toLowerCase().includes(q)
    );
  });

  // ── Field setter ───────────────────────────────────────────
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div className="space-y-6">
      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <p className="text-sm text-slate-500">
          {loading ? "Yuklanmoqda..." : `${data.length} ta o'qituvchi`}
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              className="admin-input pl-9 w-48"
              placeholder="Qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} /> O'qituvchi Qo'shish
          </button>
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
          <Loader2 size={22} className="animate-spin" />
          <span className="text-sm font-semibold">Yuklanmoqda...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-16 text-center text-slate-500">
          <div className="text-4xl mb-3">👨‍🏫</div>
          <p className="font-semibold">O'qituvchi topilmadi</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-5"
            >
              {/* Avatar + Ism */}
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0 overflow-hidden"
                  style={{ backgroundColor: item.avatar_color || "#2563eb" }}
                >
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name_uz}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    item.initials
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">
                    {item.name_uz}
                  </h3>
                  <p className="text-xs text-slate-500">{item.role_uz}</p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                    item.status === "active"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-slate-500/20 text-slate-400"
                  }`}
                >
                  {item.status === "active" ? "Faol" : "Nofaol"}
                </span>
              </div>

              {/* Info */}
              <div className="space-y-1.5 mb-4 text-xs">
                <Row label="Kafedra" value={item.dept_uz} color="blue" />
                <Row label="Ta'lim" value={item.education} color="gold" />
                <Row
                  label="Nashrlar"
                  value={item.pubs ? `${item.pubs} ta` : null}
                  color="purple"
                />
                {item.email && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 w-20 flex-shrink-0">
                      Email
                    </span>
                    <span className="text-amber-400 truncate">
                      {item.email}
                    </span>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(item)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-600/10 text-blue-400 text-xs font-bold hover:bg-blue-600/20 transition-colors"
                >
                  <Edit2 size={13} /> Tahrirlash
                </button>
                <button
                  onClick={() => setDeleteId(item.id)}
                  className="flex items-center justify-center w-9 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── ADD / EDIT MODAL ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center p-0 md:p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />

          <div className="relative bg-[#0f1b2d] border border-white/10 w-full max-w-2xl md:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[92vh]">
            {/* Handle */}
            <div className="md:hidden w-12 h-1 bg-white/10 rounded-full mx-auto mt-3 shrink-0" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
              <h2 className="text-white font-black text-lg">
                {editing ? "O'qituvchini Tahrirlash" : "Yangi O'qituvchi"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/10 text-white/60 hover:bg-white/20 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              {/* Lang tabs */}
              <div className="flex bg-white/5 p-1 rounded-2xl">
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLangTab(l.code)}
                    className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${langTab === l.code ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              {/* Ko'p tilli maydonlar */}
              <div className="space-y-4">
                <Field label={`Ism (${langTab.toUpperCase()}) *`}>
                  {langTab === "uz" ? (
                    <input
                      className="admin-input"
                      value={form.name_uz}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Prof. Ism Familiya"
                    />
                  ) : (
                    <input
                      className="admin-input"
                      value={form[`name_${langTab}`] || ""}
                      onChange={(e) => set(`name_${langTab}`, e.target.value)}
                      placeholder="Prof. Name Surname"
                    />
                  )}
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label={`Lavozim (${langTab.toUpperCase()})`}>
                    {langTab === "uz" ? (
                      <select
                        className="admin-input"
                        value={form.role_uz}
                        onChange={(e) => set("role_uz", e.target.value)}
                      >
                        {ROLES.map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        className="admin-input"
                        value={form[`role_${langTab}`] || ""}
                        onChange={(e) => set(`role_${langTab}`, e.target.value)}
                        placeholder="Professor"
                      />
                    )}
                  </Field>

                  <Field label={`Kafedra (${langTab.toUpperCase()})`}>
                    <input
                      className="admin-input"
                      value={form[`dept_${langTab}`] || ""}
                      onChange={(e) => set(`dept_${langTab}`, e.target.value)}
                      placeholder="Sun'iy Intellekt"
                    />
                  </Field>
                </div>

                <Field label={`Tadqiqot yo'nalishi (${langTab.toUpperCase()})`}>
                  <input
                    className="admin-input"
                    value={form[`research_${langTab}`] || ""}
                    onChange={(e) => set(`research_${langTab}`, e.target.value)}
                    placeholder="Machine Learning, NLP..."
                  />
                </Field>

                <Field label={`Tarjimayi hol (${langTab.toUpperCase()})`}>
                  <textarea
                    className="admin-input resize-none"
                    rows={3}
                    value={form[`bio_${langTab}`] || ""}
                    onChange={(e) => set(`bio_${langTab}`, e.target.value)}
                    placeholder="Professor haqida qisqacha ma'lumot..."
                  />
                </Field>
              </div>

              {/* Umumiy maydonlar */}
              <div className="border-t border-white/10 pt-6 space-y-4">
                <p className="text-xs text-slate-400 font-black uppercase tracking-widest">
                  Umumiy Ma'lumotlar
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Ta'lim (Education)">
                    <input
                      className="admin-input"
                      value={form.education}
                      onChange={(e) => set("education", e.target.value)}
                      placeholder="PhD in CS, MIT"
                    />
                  </Field>
                  <Field label="Nashrlar soni">
                    <input
                      className="admin-input"
                      type="number"
                      min={0}
                      value={form.pubs}
                      onChange={(e) => set("pubs", e.target.value)}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Holat">
                    <select
                      className="admin-input"
                      value={form.status}
                      onChange={(e) => set("status", e.target.value)}
                    >
                      <option value="active">Faol</option>
                      <option value="inactive">Nofaol</option>
                    </select>
                  </Field>
                  <Field label="Avatar rangi">
                    <div className="flex gap-2 flex-wrap pt-1">
                      {AVATAR_COLORS.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => set("avatar_color", c.value)}
                          title={c.label}
                          className={`w-7 h-7 rounded-lg border-2 transition-transform hover:scale-110 ${form.avatar_color === c.value ? "border-white scale-110" : "border-transparent"}`}
                          style={{ backgroundColor: c.value }}
                        />
                      ))}
                    </div>
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Initials (masalan: AT)">
                    <input
                      className="admin-input uppercase"
                      maxLength={2}
                      value={form.initials}
                      onChange={(e) =>
                        set("initials", e.target.value.toUpperCase())
                      }
                    />
                  </Field>
                  <Field label="Rasm URL (ixtiyoriy)">
                    <input
                      className="admin-input"
                      value={form.image_url}
                      onChange={(e) => set("image_url", e.target.value)}
                      placeholder="https://..."
                    />
                  </Field>
                </div>
              </div>

              {/* Kontakt */}
              <div className="border-t border-white/10 pt-6 space-y-4">
                <p className="text-xs text-slate-400 font-black uppercase tracking-widest">
                  Kontakt
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Email" icon={<Mail size={13} />}>
                    <input
                      className="admin-input"
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="ism@univ.uz"
                    />
                  </Field>
                  <Field label="Telefon" icon={<Phone size={13} />}>
                    <input
                      className="admin-input"
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      placeholder="+998 90 123 45 67"
                    />
                  </Field>
                  <Field label="Telegram" icon={<Send size={13} />}>
                    <input
                      className="admin-input"
                      value={form.telegram}
                      onChange={(e) => set("telegram", e.target.value)}
                      placeholder="https://t.me/..."
                    />
                  </Field>
                  <Field label="Instagram" icon={<Instagram size={13} />}>
                    <input
                      className="admin-input"
                      value={form.instagram}
                      onChange={(e) => set("instagram", e.target.value)}
                      placeholder="https://instagram.com/..."
                    />
                  </Field>
                  <Field label="Facebook" icon={<Facebook size={13} />}>
                    <input
                      className="admin-input"
                      value={form.facebook}
                      onChange={(e) => set("facebook", e.target.value)}
                      placeholder="https://facebook.com/..."
                    />
                  </Field>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-5 border-t border-white/10 shrink-0">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 py-3.5 rounded-2xl bg-white/10 text-white/60 font-bold text-sm hover:bg-white/15 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-3.5 rounded-2xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />{" "}
                    Saqlanmoqda...
                  </>
                ) : (
                  "💾 Saqlash"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteId && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteId(null)}
          />
          <div className="relative bg-[#0f1b2d] border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-white font-black text-lg mb-2">
              O'chirishni tasdiqlang
            </h3>
            <p className="text-slate-400 text-sm mb-8">
              Bu o'qituvchini o'chirmoqchimisiz? Bu amal qaytarib bo'lmaydi.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-3 rounded-2xl bg-white/10 text-white/60 font-bold text-sm hover:bg-white/15 transition-colors"
              >
                Qolsin
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 rounded-2xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-colors"
              >
                🗑 O'chirilsin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Yordamchi komponentlar ──────────────────────────────────
function Field({ label, icon, children }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
        {icon} {label}
      </label>
      {children}
    </div>
  );
}

function Row({ label, value, color }) {
  if (!value) return null;
  const colorMap = {
    blue: "bg-blue-500/20 text-blue-300",
    gold: "bg-amber-500/20 text-amber-300",
    purple: "bg-violet-500/20 text-violet-300",
  };
  return (
    <div className="flex items-center gap-2">
      <span className="text-slate-600 w-20 flex-shrink-0">{label}</span>
      <span
        className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${colorMap[color] || ""}`}
      >
        {value}
      </span>
    </div>
  );
}
