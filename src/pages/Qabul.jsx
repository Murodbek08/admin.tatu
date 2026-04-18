import { useState, useEffect } from "react";
import {
  Download,
  Trash2,
  User,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  FileCheck,
} from "lucide-react";
import request from "../api";

export default function AdmissionsAdmin() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await request.get("/admissions?order=created_at.desc");
      setData(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Arizani o'chirmoqchimisiz?")) return;
    try {
      await request.delete(`/admissions?id=eq.${id}`);
      setData(data.filter((d) => d.id !== id));
    } catch (e) {
      alert("O'chirishda xatolik yuz berdi");
    }
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header qismi */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Qabul Arizalari
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Barcha kelib tushgan arizalarni boshqarish va ko'rish
            </p>
          </div>
          <div className="bg-amber-500 text-white px-6 py-2.5 rounded-2xl text-sm font-black shadow-lg shadow-amber-500/20">
            Jami: {data.length} ta
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {data.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-amber-200 transition-all duration-300 group relative overflow-hidden"
              >
                {/* Status Badge */}
                <div className="absolute top-0 right-0 bg-slate-100 px-4 py-1.5 rounded-bl-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Yangi
                </div>

                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/20">
                    {item.full_name[0]}
                  </div>
                  <div className="flex-1 pr-10">
                    <h3 className="font-extrabold text-slate-900 text-lg leading-tight mb-1">
                      {item.full_name}
                    </h3>
                    <div className="flex flex-wrap gap-y-1 gap-x-3">
                      <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <Calendar size={12} className="text-amber-500" />
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-amber-500">
                      <BookOpen size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">
                        Yo'nalish
                      </p>
                      <p className="text-sm font-bold text-slate-700">
                        {item.program}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-2">
                      <div className="text-slate-400">
                        <Mail size={16} />
                      </div>
                      <p className="text-xs font-bold text-slate-600 truncate">
                        {item.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 p-2">
                      <div className="text-slate-400">
                        <Phone size={16} />
                      </div>
                      <p className="text-xs font-bold text-slate-600">
                        {item.phone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                  <div className="flex gap-2">
                    <a
                      href={item.passport_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black hover:bg-amber-500 transition-colors shadow-md"
                    >
                      <FileCheck size={14} /> PASSPORT
                    </a>
                    <a
                      href={item.diploma_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black hover:bg-slate-50 transition-colors shadow-sm"
                    >
                      <Download size={14} /> DIPLOM
                    </a>
                  </div>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="O'chirish"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {data.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4">
              <User size={40} />
            </div>
            <p className="text-slate-400 font-bold text-lg italic">
              Hozircha arizalar mavjud emas
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
