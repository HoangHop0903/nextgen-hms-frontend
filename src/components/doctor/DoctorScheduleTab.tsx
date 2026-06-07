"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, User } from "lucide-react";
import { PatientDetailsModal } from "./PatientDetailsModal";

export function DoctorScheduleTab({ token }: { token: string }) {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const res = await axios.get("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/doctor/schedule", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSchedule(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Calendar className="text-blue-500" /> Danh sách bệnh nhân chờ khám</h2>
      
      {schedule.length === 0 ? (
        <p className="text-slate-500 text-center py-8">Chưa có bệnh nhân nào đặt lịch hoặc được tiếp nhận.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-semibold">Mã Bệnh nhân</th>
                <th className="px-4 py-3 font-semibold">Họ tên</th>
                <th className="px-4 py-3 font-semibold">Ngày khám</th>
                <th className="px-4 py-3 font-semibold">Ca khám</th>
                <th className="px-4 py-3 font-semibold">Triệu chứng (Lý do)</th>
                <th className="px-4 py-3 font-semibold text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((s, idx) => (
                <tr key={idx} 
                    className="border-b border-slate-100 hover:bg-indigo-50/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedPatient(s.MaBenhNhan)}
                >
                  <td className="px-4 py-3 font-medium text-slate-900">{s.MaBenhNhan}</td>
                  <td className="px-4 py-3 font-bold text-slate-800">{s.TenBenhNhan}</td>
                  <td className="px-4 py-3">{s.NgayKham}</td>
                  <td className="px-4 py-3 text-indigo-600 font-bold">{s.KhungGio ? `${s.KhungGio} (${s.CaKham})` : s.CaKham}</td>
                  <td className="px-4 py-3">{s.LyDoKham}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      s.TrangThai === "DaTiepNhan" ? "bg-amber-100 text-amber-800" :
                      s.TrangThai === "HoanThanh" ? "bg-emerald-100 text-emerald-800" :
                      "bg-blue-100 text-blue-800"
                    }`}>
                      {s.TrangThai}
                    </span>
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
