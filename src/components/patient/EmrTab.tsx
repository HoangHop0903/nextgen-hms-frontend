"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FileText, Activity, AlertCircle } from "lucide-react";

export function EmrTab({ token }: { token: string }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/patient/medical-records", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  if (!data) return <div className="p-8 text-center text-slate-500">Đang tải hồ sơ...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-slate-100"><Activity className="text-indigo-500" /> Tổng quan hồ sơ bệnh án</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-indigo-50/50 dark:bg-indigo-900/10 p-6 rounded-xl">
          <div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> Tiền sử bệnh</h3>
            <p className="text-slate-600 dark:text-slate-400">{data.HoSo.TienSuBenh || "Không có ghi nhận"}</p>
          </div>
          <div>
             <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-1">Kết quả gần nhất</h3>
             <p className="text-slate-600 dark:text-slate-400">{data.HoSo.KetQuaGanNhat || "Chưa có kết quả"}</p>
          </div>
          <div className="col-span-full">
             <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-1">Ghi chú thêm</h3>
             <p className="text-slate-600 dark:text-slate-400">{data.HoSo.GhiChu || "Không có"}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-slate-100"><FileText className="text-indigo-500" /> Lịch sử khám bệnh</h2>
        
        {data.PhieuKham.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-8">Chưa có lịch sử khám bệnh nào.</p>
        ) : (
          <div className="space-y-4">
            {data.PhieuKham.map((pk: any) => (
              <div key={pk.MaPhieuKham} className="border border-slate-100 dark:border-slate-800 rounded-xl p-5 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors">
                <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400 text-xs font-bold px-2.5 py-0.5 rounded">Phiếu Khám: {pk.MaPhieuKham}</span>
                    <p className="font-bold text-slate-900 dark:text-slate-100 mt-2">Bác sĩ khám: {pk.TenBacSi}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">{pk.NgayKham ? new Date(pk.NgayKham).toLocaleDateString('vi-VN') : "Đang chờ"}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Triệu chứng</h4>
                    <p className="text-sm text-slate-800 dark:text-slate-300">{pk.TrieuChung || "-"}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Chẩn đoán</h4>
                    <p className="text-sm text-slate-800 dark:text-slate-300">{pk.ChanDoan || "-"}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Kết luận</h4>
                    <p className="text-sm font-medium text-indigo-700 dark:text-indigo-400">{pk.KetLuan || "-"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
