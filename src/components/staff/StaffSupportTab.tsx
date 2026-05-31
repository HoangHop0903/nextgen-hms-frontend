"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { MessageSquare, CheckCircle2, Reply, Clock } from "lucide-react";

export function StaffSupportTab({ token }: { token: string }) {
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedReq, setSelectedReq] = useState<any>(null);
  const [replyContent, setReplyContent] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/staff/support-requests", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleReply = async () => {
    if (!replyContent) return;
    try {
      await axios.post(`https://nextgen-hms-backend-8r2z.onrender.com/api/v1/staff/support-requests/${selectedReq.MaYeuCau}/reply`, 
      { NoiDung: replyContent },
      { headers: { Authorization: `Bearer ${token}` } });
      
      setMsg("Phản hồi thành công!");
      setReplyContent("");
      setSelectedReq(null);
      fetchRequests();
      
      setTimeout(() => setMsg(""), 3000);
    } catch (e) {
      setMsg("Lỗi khi phản hồi");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
        <MessageSquare className="text-blue-500" /> Quản lý Yêu cầu hỗ trợ
      </h2>

      {msg && <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg">{msg}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 border-r border-slate-200 pr-4 max-h-[600px] overflow-y-auto">
          {requests.map(req => (
            <div 
              key={req.MaYeuCau} 
              onClick={() => setSelectedReq(req)}
              className={`p-4 rounded-xl border mb-3 cursor-pointer transition-all ${selectedReq?.MaYeuCau === req.MaYeuCau ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-slate-800">{req.TenBenhNhan}</span>
                {req.TrangThai === 'DaPhanHoi' ? 
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Đã trả lời</span> : 
                  <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full flex items-center gap-1"><Clock className="w-3 h-3"/> Chờ xử lý</span>
                }
              </div>
              <p className="text-sm text-slate-600 line-clamp-2">{req.NoiDung}</p>
              <div className="text-xs text-slate-400 mt-2">
                {new Date(req.NgayGui).toLocaleString('vi-VN')}
              </div>
            </div>
          ))}
          {requests.length === 0 && <p className="text-slate-500 text-center py-4">Chưa có yêu cầu nào.</p>}
        </div>

        <div className="lg:col-span-2">
          {selectedReq ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-bold text-lg text-slate-800 mb-4 border-b pb-2">Chi tiết Yêu cầu</h3>
              
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-slate-700">Người gửi: {selectedReq.TenBenhNhan}</span>
                  <span className="text-sm text-slate-500">{new Date(selectedReq.NgayGui).toLocaleString('vi-VN')}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg text-slate-700">
                  {selectedReq.NoiDung}
                </div>
              </div>

              {selectedReq.TrangThai === 'DaPhanHoi' ? (
                <div>
                  <h4 className="font-medium text-slate-700 mb-2 flex items-center gap-2"><Reply className="w-4 h-4 text-emerald-600"/> Phản hồi của Bệnh viện</h4>
                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-lg text-emerald-800">
                    {selectedReq.PhanHoi}
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="font-medium text-slate-700 mb-2 flex items-center gap-2"><Reply className="w-4 h-4 text-blue-600"/> Soạn phản hồi</h4>
                  <textarea 
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Nhập nội dung phản hồi cho bệnh nhân..."
                    className="w-full p-4 border rounded-lg outline-none focus:border-blue-500 min-h-[120px] mb-4"
                  />
                  <button 
                    onClick={handleReply}
                    disabled={!replyContent}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    Gửi Phản hồi
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
              Chọn một yêu cầu để xem chi tiết và phản hồi
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
