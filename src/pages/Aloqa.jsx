import { useState, useEffect } from "react";
import request from "../api";
import {
  Mail,
  User,
  Trash2,
  Calendar,
  MessageSquare,
  Tag,
  Loader2,
} from "lucide-react";

export default function ContactAdmin() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      // Supabase sorting: ?order=created_at.desc
      const res = await request.get("/contact_messages?order=created_at.desc");
      setMessages(res.data || []);
    } catch (e) {
      console.error("Xabarlarni yuklashda xatolik:", e);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    if (
      !window.confirm("Haqiqatan ham ushbu xabarni o'chirib tashlamoqchimisiz?")
    )
      return;
    try {
      await request.delete(`/contact_messages?id=eq.${id}`);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (e) {
      alert("O'chirishda xatolik yuz berdi");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-amber-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Xabarlar Markazi
            </h1>
            <p className="text-slate-500">
              Mijozlar va foydalanuvchilar murojaatlari ro'yxati
            </p>
          </div>
          <div className="rounded-2xl bg-white border px-6 py-2 shadow-sm font-black text-slate-600">
            Jami: {messages.length}
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[3rem] border-4 border-dashed border-slate-200 bg-white py-20">
            <MessageSquare size={64} className="mb-4 text-slate-200" />
            <p className="text-xl font-bold text-slate-400 italic text-center">
              Hozircha hech qanday xabar mavjud emas.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="group relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-amber-500 shadow-lg group-hover:bg-amber-500 group-hover:text-white transition-colors">
                    <User size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">
                      {msg.name}
                    </h3>
                    <p className="flex items-center gap-1.5 text-sm font-bold text-slate-400">
                      <Mail size={14} /> {msg.email}
                    </p>
                  </div>
                </div>

                <div className="mb-6 space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-amber-600">
                    <Tag size={12} /> {msg.subject || "Mavzusiz"}
                  </div>
                  <div className="relative rounded-3xl border border-slate-100 bg-slate-50 p-5">
                    <p className="text-sm italic leading-relaxed text-slate-600 font-medium">
                      "{msg.message}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                    <Calendar size={14} />{" "}
                    {new Date(msg.created_at).toLocaleDateString("uz-UZ")}
                  </div>
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="rounded-2xl bg-red-50 p-3 text-red-400 shadow-sm transition-all hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
