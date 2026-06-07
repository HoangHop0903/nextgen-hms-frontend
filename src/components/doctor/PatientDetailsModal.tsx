"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { X, User, Activity, Clock, AlertCircle } from "lucide-react";

export function PatientDetailsModal({ token, maBenhNhan, onClose }: { token: string; maBenhNhan: string; onClose: () => void }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientData();
  }, [maBenhNhan]);

  const fetchPatientData = async () => {
    try {
      const res = await axios.get(`https://nextgen-hms-backend-8r2z.onrender.com/api/v1/doctor/patient/${maBenhNhan}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 flex items-center justify-center shadow-xl">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const bn = data.BenhNhan;
  const hsba = data.HoSoBenhAn;
  const history = data.LichSuKham;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-4xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 rounded-t-2xl z-10">
          <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <User className="text-indigo-500" /> Hồ Sơ Chi Tiết Bệnh Nhân
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Column: Patient Info */}
            <div className="col-span-1 space-y-6">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl flex flex-col items-center text-center border border-indigo-100 dark:border-indigo-800/50">
                <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-indigo-500 font-bold text-3xl mb-4 overflow-hidden shadow-sm border-2 border-indigo-200 dark:border-indigo-700">
                  {bn.AnhDaiDien ? (
                    <img src={bn.AnhDaiDien} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    bn.HoTen.charAt(0)
                  )}
                </div>
                <h4 className="font-bold text-xl text-slate-900 dark:text-slate-100">{bn.HoTen}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{bn.MaBenhNhan} • {bn.GioiTinh}</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50 space-y-4">
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Ngày Sinh</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{bn.NgaySinh || "Chưa cập nhật"}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Số Điện Thoại</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{bn.SDT || "Chưa cập nhật"}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Địa Chỉ</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{bn.DiaChi || "Chưa cập nhật"}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Số BHYT</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{bn.SoBHYT || "Không có"}</p>
                </div>
              </div>

              {(bn.TienSuDiUng || hsba.TienSuBenh) && (
                <div className="bg-red-50 dark:bg-red-900/10 p-5 rounded-2xl border border-red-100 dark:border-red-900/30">
                  <h5 className="font-bold text-red-700 dark:text-red-400 flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4" /> Lưu Ý Y Tế
                  </h5>
                  {bn.TienSuDiUng && (
                    <div className="mb-2">
                      <p className="text-xs font-bold text-red-600/70 dark:text-red-400/70 uppercase">Dị ứng</p>
                      <p className="text-sm font-medium text-red-800 dark:text-red-300">{bn.TienSuDiUng}</p>
                    </div>
                  )}
                  {hsba.TienSuBenh && (
                    <div>
                      <p className="text-xs font-bold text-red-600/70 dark:text-red-400/70 uppercase">Tiền sử bệnh</p>
                      <p className="text-sm font-medium text-red-800 dark:text-red-300">{hsba.TienSuBenh}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Medical History */}
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                <Activity className="text-teal-500" />
                <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100">Lịch Sử Khám Bệnh</h4>
              </div>

              {history.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                  <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400 font-medium">Bệnh nhân chưa có lịch sử khám.</p>
                </div>
              ) : (
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:ml-[1.2rem] md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
                  {history.map((h: any, idx: number) => (
                    <div key={idx} className="relative pl-12 md:pl-16">
                      {/* Timeline dot */}
                      <div className="absolute left-2.5 md:left-2 w-6 h-6 bg-white dark:bg-slate-900 border-4 border-indigo-500 rounded-full flex items-center justify-center shadow-sm"></div>
                      
                      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-full">{new Date(h.NgayKham).toLocaleDateString('vi-VN')}</span>
                            <h5 className="font-bold text-lg text-slate-800 dark:text-slate-100 mt-2">{h.ChanDoan || "Chưa có chẩn đoán"}</h5>
                          </div>
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Mã: {h.MaPhieuKham}</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Bác sĩ khám</p>
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{h.BacSiKham}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Triệu chứng</p>
                            <p className="text-sm text-slate-700 dark:text-slate-300">{h.TrieuChung || "Không ghi nhận"}</p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Kết luận / Xử lý</p>
                            <p className="text-sm text-slate-700 dark:text-slate-300">{h.KetLuan || "Không có"}</p>
                          </div>
                        </div>

                        {h.DonThuoc && h.DonThuoc.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3">Đơn thuốc đã kê</p>
                            <ul className="space-y-2">
                              {h.DonThuoc.map((thuoc: any, tIdx: number) => (
                                <li key={tIdx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg text-sm border border-slate-100 dark:border-slate-800">
                                  <div className="flex items-center gap-2 mb-1 sm:mb-0">
                                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                                    <span className="font-bold text-slate-800 dark:text-slate-200">{thuoc.TenThuoc}</span>
                                    <span className="text-teal-600 dark:text-teal-400 font-bold bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 rounded text-xs">SL: {thuoc.SoLuong}</span>
                                  </div>
                                  <span className="text-slate-600 dark:text-slate-400 text-xs ml-3 sm:ml-0">{thuoc.LieuDung} ({thuoc.SoNgayDung} ngày)</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
