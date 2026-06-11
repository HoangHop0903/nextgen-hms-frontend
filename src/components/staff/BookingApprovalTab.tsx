"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle2, XCircle, Clock, FileText } from "lucide-react";
import { PatientDetailsModal } from "../doctor/PatientDetailsModal";

export function BookingApprovalTab({ token }: { token: string }) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/staff/bookings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data.filter((b: any) => b.TrangThai === "Chờ xác nhận"));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    setLoading(true);
    try {
      await axios.put(`https://nextgen-hms-backend-8r2z.onrender.com/api/v1/staff/bookings/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBookings();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Clock className="text-amber-500" /> Chờ duyệt ({bookings.length})</h2>
      
      {bookings.length === 0 ? (
        <p className="text-slate-500 text-center py-8">Không có lịch khám nào đang chờ duyệt.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-semibold">Mã ĐL</th>
                <th className="px-4 py-3 font-semibold">Bệnh nhân</th>
                <th className="px-4 py-3 font-semibold">Bác sĩ</th>
                <th className="px-4 py-3 font-semibold">Thời gian khám</th>
                <th className="px-4 py-3 font-semibold">Lý do</th>
                <th className="px-4 py-3 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.MaDatLich} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{b.MaDatLich}</td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-800 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => setSelectedPatient(b.MaBenhNhan)}>
                      {b.TenBenhNhan} <FileText className="w-3 h-3 inline ml-1 text-slate-400" />
                    </p>
                    <p className="text-xs">{b.SDT}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-800">{b.BacSi}</td>
                  <td className="px-4 py-3">
                    <p>{b.NgayKham}</p>
                    <p className="text-xs font-bold text-indigo-600">{b.KhungGio ? `${b.KhungGio} (${b.CaKham})` : b.CaKham}</p>
                  </td>
                  <td className="px-4 py-3 max-w-[200px] truncate" title={b.LyDoKham}>{b.LyDoKham}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        disabled={loading}
                        onClick={() => handleUpdateStatus(b.MaDatLich, "Đã xác nhận")}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Duyệt"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                      <button 
                        disabled={loading}
                        onClick={() => handleUpdateStatus(b.MaDatLich, "Đã hủy")}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Từ chối"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedPatient && (
        <PatientDetailsModal 
          token={token} 
          maBenhNhan={selectedPatient} 
          onClose={() => setSelectedPatient(null)} 
        />
      )}
    </div>
  );
}
