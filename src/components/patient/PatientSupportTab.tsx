"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { MessageSquare, Clock, CheckCircle2, Reply, Send } from "lucide-react";

export function PatientSupportTab({ token }: { token: string }) {
  const [requests, setRequests] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/patient/support", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    try {
      await axios.post("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/patient/support", 
        { NoiDung: content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("Đã gửi yêu cầu hỗ trợ thành công!");
      setContent("");
      fetchRequests();
      setTimeout(() => setMsg(""), 3000);
    } catch (e) {
      setMsg("Lỗi khi gửi yêu cầu");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-6">
        <MessageSquare className="text-cyan-500" /> Trung tâm Hỗ trợ & Hỏi đáp
      </h2>

      {msg && <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl font-medium border border-emerald-100 dark:border-emerald-800/50">{msg}</div>}

      <div className="mb-10 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4">Gửi Yêu cầu mới</h3>
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Nhập nội dung cần hỗ trợ, hỏi đáp chuyên môn hoặc góp ý..."
          className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-cyan-500 min-h-[120px] mb-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
        />
        <button 
          onClick={handleSubmit}
          disabled={!content.trim()}
          className="bg-cyan-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-cyan-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <Send className="w-5 h-5" /> Gửi Yêu Cầu
        </button>
      </div>

      <div>
        <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">Lịch sử Yêu cầu ({requests.length})</h3>
        
        <div className="space-y-6">
          {requests.map(req => (
            <div key={req.MaYeuCau} className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-md transition-shadow bg-white dark:bg-slate-900">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{new Date(req.NgayGui).toLocaleString('vi-VN')}</span>
                {req.TrangThai === 'DaPhanHoi' ? 
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Đã trả lời</span> : 
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-500 bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-full flex items-center gap-1"><Clock className="w-4 h-4"/> Chờ xử lý</span>
                }
              </div>
              <p className="text-slate-800 dark:text-slate-300 font-medium mb-4">{req.NoiDung}</p>
              
              {req.TrangThai === 'DaPhanHoi' && (
                <div className="bg-cyan-50 dark:bg-cyan-900/20 p-5 rounded-xl border border-cyan-100 dark:border-cyan-900/50 mt-4 relative">
                  <div className="absolute -top-3 left-6 bg-white dark:bg-slate-900 px-2 text-xs font-bold text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-800 rounded-full flex items-center gap-1">
                    <Reply className="w-3 h-3" /> Bệnh viện phản hồi
                  </div>
                  <p className="text-cyan-900 dark:text-cyan-100 mt-2">{req.PhanHoi}</p>
                  <p className="text-xs text-cyan-600 dark:text-cyan-500 mt-3 font-medium">{new Date(req.NgayPhanHoi).toLocaleString('vi-VN')}</p>
                </div>
              )}
            </div>
          ))}
          {requests.length === 0 && <p className="text-slate-500 dark:text-slate-400 text-center py-8">Bạn chưa gửi yêu cầu hỗ trợ nào.</p>}
        </div>
      </div>
    </div>
  );
}
