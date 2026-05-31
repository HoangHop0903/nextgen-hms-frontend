"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Users, Ticket } from "lucide-react";

export function ReceptionTab({ token }: { token: string }) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchApprovedBookings();
  }, []);

  const fetchApprovedBookings = async () => {
    try {
      const res = await axios.get("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/staff/bookings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data.filter((b: any) => b.TrangThai === "DaDuyet"));
    } catch (e) {
      console.error(e);
    }
  };

  const handleReception = async (id: string) => {
    setLoading(true);
    setMsg("");
    try {
      const res = await axios.post(`https://nextgen-hms-backend-8r2z.onrender.com/api/v1/staff/reception`, { MaDatLich: id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg(`Đã tiếp nhận ${id}. Số thứ tự: ${res.data.SoThuTu}`);
      fetchApprovedBookings();
    } catch (e: any) {
      setMsg(e.response?.data?.detail || "Lỗi tiếp nhận");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Users className="text-blue-500" /> Tiếp nhận bệnh nhân ({bookings.length})</h2>
      
      {msg && (
        <div className={`p-4 mb-6 rounded-lg font-medium bg-emerald-50 text-emerald-700`}>
          {msg}
        </div>
      )}

      {bookings.length === 0 ? (
        <p className="text-slate-500 text-center py-8">Không có bệnh nhân nào chờ tiếp nhận.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map((b) => (
            <div key={b.MaDatLich} className="border border-slate-200 p-5 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">Mã: {b.MaDatLich}</span>
                <span className="text-xs font-semibold text-slate-500">{b.NgayKham}</span>
              </div>
              <h3 className="font-bold text-lg text-slate-900">{b.TenBenhNhan}</h3>
              <p className="text-sm text-slate-600 mb-4">SĐT: {b.SDT}</p>
              
              <div className="bg-slate-50 p-3 rounded-lg mb-4 text-sm">
                 <p><span className="font-semibold">Bác sĩ:</span> {b.BacSi}</p>
                 <p><span className="font-semibold">Ca khám:</span> <span className="text-indigo-600 font-bold">{b.CaKham}</span></p>
              </div>
              
              <button 
                disabled={loading}
                onClick={() => handleReception(b.MaDatLich)}
                className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                <Ticket className="w-4 h-4" /> Cấp số & Tiếp nhận
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
