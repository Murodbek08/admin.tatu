import { useState } from "react";
import {
  Card,
  Badge,
  Button,
  Modal,
  FormField,
  EmptyState,
} from "../components/Ui";

const initialTeachers = [
  {
    id: 1,
    name: "Prof. Akbar Toshmatov",
    position: "Kafedra mudiri",
    department: "Sun'iy Intellekt",
    degree: "PhD",
    courses: "Machine Learning, Deep Learning",
    email: "a.toshmatov@tatu.uz",
    status: "active",
  },
  {
    id: 2,
    name: "Dots. Mohira Yusupova",
    position: "Dotsent",
    department: "Kompyuter Muhandisligi",
    degree: "PhD",
    courses: "Algoritmlar, Ma'lumotlar Tuzilmasi",
    email: "m.yusupova@tatu.uz",
    status: "active",
  },
  {
    id: 3,
    name: "O'q. Jasur Raximov",
    position: "O'qituvchi",
    department: "Kiberxavfsizlik",
    degree: "MSc",
    courses: "Kriptografiya, Network Security",
    email: "j.rahimov@tatu.uz",
    status: "active",
  },
  {
    id: 4,
    name: "Prof. Dilnoza Karimova",
    position: "Professor",
    department: "Ma'lumotlar Fani",
    degree: "PhD",
    courses: "Big Data, Data Mining",
    email: "d.karimova@tatu.uz",
    status: "inactive",
  },
];

const emptyForm = {
  name: "",
  position: "O'qituvchi",
  department: "",
  degree: "MSc",
  courses: "",
  email: "",
  status: "active",
};

export default function Oqituvchilar() {
  const [data, setData] = useState(initialTeachers);
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

  const filtered = data.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.department.toLowerCase().includes(search.toLowerCase()),
  );

  const getInitials = (name) =>
    name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("");
  const avatarColors = [
    "var(--gold-500)",
    "#3b5bdb",
    "#06b6d4",
    "#8b5cf6",
    "#10b981",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <p className="text-sm text-slate-500">{data.length} ta o'qituvchi</p>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            className="admin-input w-48"
            placeholder="Qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={openAdd}>+ O'qituvchi Qo'shish</Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState icon="👨‍🏫" title="O'qituvchi topilmadi" />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((item, idx) => (
            <Card key={item.id} className="p-5">
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-black flex-shrink-0"
                  style={{
                    background: avatarColors[idx % avatarColors.length],
                  }}
                >
                  {getInitials(item.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500">{item.position}</p>
                </div>
                <Badge color={item.status === "active" ? "green" : "slate"}>
                  {item.status === "active" ? "Faol" : "Nofahol"}
                </Badge>
              </div>

              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 w-20">Kafedra</span>
                  <Badge color="blue">{item.department}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 w-20">Daraja</span>
                  <Badge color="gold">{item.degree}</Badge>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs text-slate-600 w-20 flex-shrink-0">
                    Fanlar
                  </span>
                  <span className="text-xs text-slate-400 leading-relaxed">
                    {item.courses}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 w-20">Email</span>
                  <span
                    className="text-xs truncate"
                    style={{ color: "var(--gold-400)" }}
                  >
                    {item.email}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => openEdit(item)}
                >
                  ✏️ Tahrirlash
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setDeleteId(item.id)}
                >
                  🗑
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "O'qituvchini Tahrirlash" : "O'qituvchi Qo'shish"}
      >
        <div className="space-y-4">
          <FormField label="To'liq ism" required>
            <input
              className="admin-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Prof. Ismi Familiya"
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Lavozim">
              <select
                className="admin-input"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
              >
                {[
                  "O'qituvchi",
                  "Dotsent",
                  "Professor",
                  "Kafedra mudiri",
                  "Assistent",
                ].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Ilmiy daraja">
              <select
                className="admin-input"
                value={form.degree}
                onChange={(e) => setForm({ ...form, degree: e.target.value })}
              >
                {["BSc", "MSc", "PhD", "Professor"].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </FormField>
          </div>
          <FormField label="Kafedra" required>
            <input
              className="admin-input"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              placeholder="Sun'iy Intellekt"
            />
          </FormField>
          <FormField label="O'qitiladigan fanlar">
            <input
              className="admin-input"
              value={form.courses}
              onChange={(e) => setForm({ ...form, courses: e.target.value })}
              placeholder="Machine Learning, Deep Learning"
            />
          </FormField>
          <FormField label="Email">
            <input
              className="admin-input"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="ism@tatu.uz"
            />
          </FormField>
          <FormField label="Holat">
            <select
              className="admin-input"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="active">Faol</option>
              <option value="inactive">Nofahol</option>
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
          Bu o'qituvchini o'chirmoqchimisiz?
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
