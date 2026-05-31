"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Pill, CalendarDays } from "lucide-react";

export function PrescriptionTab({ token }: { token: string }) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/patient/prescriptions", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  if (!data) return <div className="p-8 text-center text-slate-500">Đang tải đơn thuốc...</div>;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-slate-100"><Pill className="text-teal-500" /> Đơn thuốc của tôi</h2>
      
      {data.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
             <Pill className="w-8 h-8 text-slate-300 dark:text-slate-600" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Bạn chưa có đơn thuốc nào.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {data.map((dt: any) => (
            <div key={dt.MaDonThuoc} className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">Mã đơn: {dt.MaDonThuoc}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Bác sĩ kê: {dt.TenBacSi}</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-3 py-1.5 rounded-lg">
                  <CalendarDays className="w-4 h-4" />
                  {dt.NgayKe ? new Date(dt.NgayKe).toLocaleDateString('vi-VN') : "-"}
                </div>
              </div>
              
              <div className="p-4 bg-white dark:bg-slate-900">
                {dt.GhiChu && <p className="text-sm text-slate-600 dark:text-slate-400 italic mb-4">" {dt.GhiChu} "</p>}
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                    <thead className="text-xs text-slate-500 dark:text-slate-500 uppercase bg-slate-50/50 dark:bg-slate-800/50">
                      <tr>
                        <th className="px-4 py-3 font-semibold rounded-l-lg">Tên Thuốc</th>
                        <th className="px-4 py-3 font-semibold text-center">Số lượng</th>
                        <th className="px-4 py-3 font-semibold">Liều dùng</th>
                        <th className="px-4 py-3 font-semibold text-center rounded-r-lg">Số ngày</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dt.ChiTiet.map((ct: any, idx: number) => (
                        <tr key={idx} className="border-b border-slate-50 dark:border-slate-800 last:border-0">
                          <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-700 dark:text-teal-400 text-xs"><Pill className="w-3 h-3" /></div>
                             {ct.TenThuoc} <span className="text-xs font-normal text-slate-400 dark:text-slate-500">({ct.DonViTinh})</span>
                          </td>
                          <td className="px-4 py-3 text-center font-semibold">{ct.SoLuong}</td>
                          <td className="px-4 py-3">{ct.LieuDung}</td>
                          <td className="px-4 py-3 text-center">{ct.SoNgayDung}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
