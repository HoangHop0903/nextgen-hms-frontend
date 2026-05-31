"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Stethoscope, Pill, Plus, Trash2, CheckCircle } from "lucide-react";

export function ConsultationTab({ token }: { token: string }) {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<string>("");
  
  // Form Khám
  const [trieuChung, setTrieuChung] = useState("");
  const [chanDoan, setChanDoan] = useState("");
  const [ketLuan, setKetLuan] = useState("");
  const [isConsulted, setIsConsulted] = useState(false);
  const [phieuKhamId, setPhieuKhamId] = useState("");
  
  // Form Thuốc
  const [prescription, setPrescription] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Tạo thuốc mới
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [newMedName, setNewMedName] = useState("");
  const [newMedUnit, setNewMedUnit] = useState("Viên");
  const [newMedPrice, setNewMedPrice] = useState(0);
  const [newMedUsage, setNewMedUsage] = useState("");

  useEffect(() => {
    fetchSchedule();
    fetchMedicines();
  }, []);

  const fetchSchedule = async () => {
    try {
      const res = await axios.get("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/doctor/schedule", {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Chỉ lấy bệnh nhân chưa khám xong
      setSchedule(res.data.filter((s: any) => s.TrangThai !== "HoanThanh"));
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMedicines = async () => {
    try {
      const res = await axios.get("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/doctor/medicines", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMedicines(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateConsultation = async () => {
    if (!selectedBooking || !chanDoan) {
      setMsg("Vui lòng chọn bệnh nhân và điền chẩn đoán.");
      return;
    }
    setLoading(true);
    setMsg("");
    try {
      const res = await axios.post("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/doctor/consultation", {
        MaDatLich: selectedBooking,
        TrieuChung: trieuChung,
        ChanDoan: chanDoan,
        KetLuan: ketLuan
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      setPhieuKhamId(res.data.MaPhieuKham);
      setIsConsulted(true);
      setMsg("Lưu phiếu khám thành công! Bạn có thể kê đơn thuốc bên dưới.");
    } catch (e: any) {
      setMsg(e.response?.data?.detail || "Lỗi tạo phiếu khám");
    } finally {
      setLoading(false);
    }
  };

  const addMedicine = () => {
    if (medicines.length > 0) {
      setPrescription([...prescription, { MaThuoc: medicines[0].MaThuoc, SoLuong: 1, LieuDung: "", SoNgayDung: 1 }]);
    }
  };

  const removeMedicine = (index: number) => {
    const newP = [...prescription];
    newP.splice(index, 1);
    setPrescription(newP);
  };

  const updateMedicine = (index: number, field: string, value: any) => {
    const newP = [...prescription];
    newP[index][field] = value;
    setPrescription(newP);
  };

  const handleCreatePrescription = async () => {
    if (prescription.length === 0) {
      setMsg("Vui lòng thêm ít nhất 1 loại thuốc để kê đơn.");
      return;
    }
    setLoading(true);
    setMsg("");
    try {
      const res = await axios.post("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/doctor/prescription", {
        MaPhieuKham: phieuKhamId,
        GhiChu: "Kê đơn theo Cổng Bác sĩ",
        ChiTiet: prescription
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      setMsg("Kê đơn thuốc thành công! (Mã: " + res.data.MaDonThuoc + "). Quy trình khám hoàn tất.");
      
      // Reset form
      setTimeout(() => {
        setIsConsulted(false);
        setSelectedBooking("");
        setTrieuChung(""); setChanDoan(""); setKetLuan("");
        setPrescription([]);
        setPhieuKhamId("");
        setMsg("");
        fetchSchedule();
      }, 3000);

    } catch (e: any) {
      setMsg(e.response?.data?.detail || "Lỗi tạo đơn thuốc");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName) return;
    setLoading(true);
    try {
      const res = await axios.post("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/doctor/medicines", {
        TenThuoc: newMedName,
        DonViTinh: newMedUnit,
        GiaThuoc: newMedPrice,
        CachDung: newMedUsage
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      const newMed = res.data.Thuoc;
      setMedicines([...medicines, newMed]);
      setShowAddMedicine(false);
      setNewMedName(""); setNewMedUnit("Viên"); setNewMedPrice(0); setNewMedUsage("");
      
      // Add the new medicine to the prescription automatically
      setPrescription([...prescription, { MaThuoc: newMed.MaThuoc, SoLuong: 1, LieuDung: newMedUsage, SoNgayDung: 1 }]);
      setMsg("Đã thêm thuốc mới vào hệ thống và đơn thuốc.");
    } catch (e: any) {
      alert("Lỗi: " + (e.response?.data?.detail || e.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {msg && (
        <div className={`p-4 rounded-xl font-medium shadow-sm ${msg.includes("thành công") || msg.includes("Đã thêm") ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800" : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800"}`}>
          {msg}
        </div>
      )}

      {/* Bước 1: Khám Bệnh */}
      <div className={`bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-opacity ${isConsulted ? 'opacity-60 pointer-events-none' : ''}`}>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-slate-100"><Stethoscope className="text-indigo-500" /> Nhập Phiếu Khám</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Chọn Bệnh Nhân (Hôm nay)</label>
            <select 
              value={selectedBooking} 
              onChange={e => setSelectedBooking(e.target.value)}
              className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value="">-- Chọn bệnh nhân --</option>
              {schedule.map(s => (
                <option key={s.MaDatLich} value={s.MaDatLich}>
                  {s.TenBenhNhan} (Mã Lịch: {s.MaDatLich}) - Trạng thái: {s.TrangThai}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Triệu chứng</label>
            <textarea 
              value={trieuChung} onChange={e => setTrieuChung(e.target.value)} 
              className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500" rows={2} 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Chẩn đoán <span className="text-red-500">*</span></label>
            <textarea 
              value={chanDoan} onChange={e => setChanDoan(e.target.value)} 
              className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" rows={2} 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Kết luận hướng xử lý</label>
            <textarea 
              value={ketLuan} onChange={e => setKetLuan(e.target.value)} 
              className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500" rows={2} 
            />
          </div>
        </div>
        
        {!isConsulted && (
          <div className="flex justify-end">
            <button 
              disabled={loading} onClick={handleCreateConsultation}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold transition-colors shadow-[0_4px_14px_0_rgba(79,70,229,0.2)] disabled:bg-slate-400"
            >
              Lưu Phiếu Khám
            </button>
          </div>
        )}
      </div>

      {/* Bước 2: Kê đơn (Chỉ hiện khi đã lưu phiếu khám) */}
      {isConsulted && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 border-l-4 border-l-teal-500 dark:border-l-teal-600">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100"><Pill className="text-teal-500" /> Kê Đơn Thuốc</h2>
            <div className="flex gap-2">
              <button onClick={() => setShowAddMedicine(true)} className="flex items-center gap-1 text-sm bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-3 py-1.5 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 font-bold transition-colors">
                <Plus className="w-4 h-4" /> Tạo thuốc mới
              </button>
              <button onClick={addMedicine} className="flex items-center gap-1 text-sm bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 px-3 py-1.5 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/50 font-bold transition-colors">
                <Plus className="w-4 h-4" /> Chọn thuốc
              </button>
            </div>
          </div>

          {prescription.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-center py-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl font-medium">Nhấn "Chọn thuốc" để bắt đầu kê đơn.</p>
          ) : (
            <div className="space-y-4 mb-6">
              {prescription.map((p, index) => (
                <div key={index} className="flex flex-col md:flex-row items-end gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="w-full md:w-1/3">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Tên Thuốc</label>
                    <select 
                      value={p.MaThuoc} onChange={(e) => updateMedicine(index, "MaThuoc", e.target.value)}
                      className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    >
                      <option value="">- Chọn thuốc -</option>
                      {medicines.map(m => (
                        <option key={m.MaThuoc} value={m.MaThuoc}>{m.TenThuoc} ({m.DonViTinh})</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full md:w-1/6">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Số lượng</label>
                    <input 
                      type="number" min="1" value={p.SoLuong} onChange={(e) => updateMedicine(index, "SoLuong", parseInt(e.target.value) || 1)}
                      className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                  <div className="w-full md:w-1/3">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Liều dùng (Cách dùng)</label>
                    <input 
                      type="text" value={p.LieuDung} onChange={(e) => updateMedicine(index, "LieuDung", e.target.value)}
                      placeholder="VD: Ngày 2 lần, mỗi lần 1 viên"
                      className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                  <div className="w-full md:w-1/6">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Số ngày</label>
                    <input 
                      type="number" min="1" value={p.SoNgayDung} onChange={(e) => updateMedicine(index, "SoNgayDung", parseInt(e.target.value) || 1)}
                      className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg outline-none text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                  <div className="w-full md:w-auto flex justify-end shrink-0">
                    <button onClick={() => removeMedicine(index)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-2.5 rounded-lg transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-800">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-slate-800">
            <button 
              disabled={loading || prescription.length === 0} onClick={handleCreatePrescription}
              className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 disabled:shadow-none text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_4px_14px_0_rgba(13,148,136,0.2)] hover:-translate-y-0.5 flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" /> Hoàn tất Kê đơn & Khám
            </button>
          </div>
        </div>
      )}

      {/* Modal Thêm Thuốc Mới */}
      {showAddMedicine && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Thêm Thuốc Mới</h3>
              <button onClick={() => setShowAddMedicine(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-xl">&times;</button>
            </div>
            <form onSubmit={handleCreateNewMedicine} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Tên Thuốc</label>
                <input required type="text" value={newMedName} onChange={e => setNewMedName(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500" placeholder="VD: Paracetamol 500mg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Đơn vị tính</label>
                  <select value={newMedUnit} onChange={e => setNewMedUnit(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500">
                    <option value="Viên">Viên</option>
                    <option value="Vỉ">Vỉ</option>
                    <option value="Hộp">Hộp</option>
                    <option value="Lọ">Lọ</option>
                    <option value="Chai">Chai</option>
                    <option value="Tuýp">Tuýp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Đơn giá (VNĐ)</label>
                  <input type="number" min="0" value={newMedPrice} onChange={e => setNewMedPrice(parseFloat(e.target.value) || 0)} className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Cách dùng mặc định</label>
                <input type="text" value={newMedUsage} onChange={e => setNewMedUsage(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500" placeholder="VD: Uống sau ăn..." />
              </div>
              
              <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setShowAddMedicine(false)} className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm">Huỷ</button>
                <button type="submit" disabled={loading} className="px-4 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 rounded-lg transition-colors text-sm shadow-[0_4px_10px_0_rgba(79,70,229,0.2)]">Tạo thuốc mới</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
