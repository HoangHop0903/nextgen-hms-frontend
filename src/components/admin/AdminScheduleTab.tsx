"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { CalendarDays, Plus, CheckCircle2, Clock, Trash2, Edit } from "lucide-react";

export function AdminScheduleTab({ token }: { token: string }) {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);
  
  const [activeSubTab, setActiveSubTab] = useState("assign"); // assign or shifts
  const [msg, setMsg] = useState("");

  // Assign Schedule states
  const [newSchedule, setNewSchedule] = useState({ 
    MaBacSi: "", 
    MaPhong: "", 
    MaCaKham: "", 
    NgayKham: "", 
    SoLuongToiDa: 20 
  });

  // Shifts states
  const [showShiftForm, setShowShiftForm] = useState(false);
  const [editingShiftId, setEditingShiftId] = useState<string | null>(null);
  const [newShift, setNewShift] = useState({ TenCa: "", GioBatDau: "07:00:00", GioKetThuc: "11:00:00" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const resDocs = await axios.get("http://localhost:8000/api/v1/patient/doctors");
      setDoctors(resDocs.data);
      
      const resRooms = await axios.get("http://localhost:8000/api/v1/admin/rooms");
      setRooms(resRooms.data.filter((r: any) => r.TrangThai));

      const resShifts = await axios.get("http://localhost:8000/api/v1/admin/shifts");
      setShifts(resShifts.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateSchedule = async () => {
    if (!newSchedule.MaBacSi || !newSchedule.MaPhong || !newSchedule.MaCaKham || !newSchedule.NgayKham) {
      return setMsg("Vui lòng nhập đủ thông tin");
    }
    try {
      await axios.post("http://localhost:8000/api/v1/admin/schedule", newSchedule);
      setMsg("Phân công lịch làm việc thành công!");
      setNewSchedule({ MaBacSi: "", MaPhong: "", MaCaKham: "", NgayKham: "", SoLuongToiDa: 20 });
    } catch (e) {
      setMsg("Lỗi khi phân công");
    }
  };

  const handleCreateShift = async () => {
    if (!newShift.TenCa) return setMsg("Vui lòng nhập tên ca");
    try {
      await axios.post("http://localhost:8000/api/v1/admin/shifts", newShift, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg("Tạo ca khám thành công");
      setShowShiftForm(false);
      setNewShift({ TenCa: "", GioBatDau: "07:00:00", GioKetThuc: "11:00:00" });
      fetchData();
    } catch (e) {
      setMsg("Lỗi tạo ca khám");
    }
  };

  const handleUpdateShift = async () => {
    if (!newShift.TenCa) return setMsg("Vui lòng nhập tên ca");
    try {
      await axios.put(`http://localhost:8000/api/v1/admin/shifts/${editingShiftId}`, newShift, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg("Sửa ca khám thành công");
      setEditingShiftId(null);
      setNewShift({ TenCa: "", GioBatDau: "07:00:00", GioKetThuc: "11:00:00" });
      fetchData();
    } catch (e) {
      setMsg("Lỗi khi sửa ca khám");
    }
  };

  const openEditShift = (item: any) => {
    setEditingShiftId(item.MaCaKham);
    setNewShift({ TenCa: item.TenCa, GioBatDau: item.ThoiGianBatDau, GioKetThuc: item.ThoiGianKetThuc });
  };

  const handleDeleteShift = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa vĩnh viễn ca khám này?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/v1/admin/shifts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      alert('Đã xóa thành công!');
    } catch (e: any) {
      alert('Lỗi: ' + (e.response?.data?.detail || e.message));
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <CalendarDays className="text-orange-500" /> Quản lý Lịch & Ca khám
        </h2>
        {activeSubTab === "shifts" && (
          <button 
            onClick={() => { setShowShiftForm(true); setMsg(""); }}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" /> Thêm Ca Khám
          </button>
        )}
      </div>

      {msg && <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/> {msg}</div>}

      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6">
        <button onClick={() => setActiveSubTab("assign")} className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeSubTab === "assign" ? "border-orange-500 text-orange-600 dark:text-orange-400" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}>Phân công lịch</button>
        <button onClick={() => setActiveSubTab("shifts")} className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeSubTab === "shifts" ? "border-orange-500 text-orange-600 dark:text-orange-400" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}>Danh mục Ca khám</button>
      </div>

      {activeSubTab === "assign" ? (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-4xl">
          <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-6">Tạo Lịch Khám Mới</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Chọn Bác sĩ</label>
              <select value={newSchedule.MaBacSi} onChange={e => setNewSchedule({...newSchedule, MaBacSi: e.target.value})} className="w-full p-3 border dark:border-slate-700 rounded-lg outline-none focus:border-orange-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-200">
                <option value="">-- Chọn bác sĩ --</option>
                {doctors.map(d => <option key={d.MaBacSi} value={d.MaBacSi}>{d.HocVi} {d.HoTen}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Chọn Phòng khám</label>
              <select value={newSchedule.MaPhong} onChange={e => setNewSchedule({...newSchedule, MaPhong: e.target.value})} className="w-full p-3 border dark:border-slate-700 rounded-lg outline-none focus:border-orange-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-200">
                <option value="">-- Chọn phòng --</option>
                {rooms.map(r => <option key={r.MaPhong} value={r.MaPhong}>{r.TenPhong} (Tầng {r.Tang} - Khu {r.Khu})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Ngày khám</label>
              <input type="date" value={newSchedule.NgayKham} onChange={e => setNewSchedule({...newSchedule, NgayKham: e.target.value})} className="w-full p-3 border dark:border-slate-700 rounded-lg outline-none focus:border-orange-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Ca khám</label>
              <select value={newSchedule.MaCaKham} onChange={e => setNewSchedule({...newSchedule, MaCaKham: e.target.value})} className="w-full p-3 border dark:border-slate-700 rounded-lg outline-none focus:border-orange-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-200">
                <option value="">-- Chọn ca --</option>
                {shifts.map(s => <option key={s.MaCaKham} value={s.MaCaKham}>{s.TenCa} ({s.ThoiGianBatDau} - {s.ThoiGianKetThuc})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Số bệnh nhân tối đa</label>
              <input type="number" value={Number.isNaN(newSchedule.SoLuongToiDa) ? "" : newSchedule.SoLuongToiDa} onChange={e => setNewSchedule({...newSchedule, SoLuongToiDa: e.target.value === "" ? ("" as any) : parseInt(e.target.value)})} className="w-full p-3 border dark:border-slate-700 rounded-lg outline-none focus:border-orange-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-200" />
            </div>
          </div>
          <button onClick={handleCreateSchedule} className="w-full md:w-auto bg-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> Phân Công Lịch
          </button>
        </div>
      ) : (
        <div>
          {(showShiftForm || editingShiftId) && (
            <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 max-w-4xl">
              <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4">{editingShiftId ? "Sửa" : "Thêm"} Ca Khám {editingShiftId ? newShift.TenCa : "Mới"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Tên ca</label>
                  <input type="text" value={newShift.TenCa} onChange={e => setNewShift({...newShift, TenCa: e.target.value})} placeholder="VD: Ca Sáng" className="w-full p-2 border dark:border-slate-700 rounded-lg outline-none focus:border-orange-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Giờ bắt đầu</label>
                  <input type="time" value={newShift.GioBatDau} onChange={e => setNewShift({...newShift, GioBatDau: e.target.value})} step="1" className="w-full p-2 border dark:border-slate-700 rounded-lg outline-none focus:border-orange-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Giờ kết thúc</label>
                  <input type="time" value={newShift.GioKetThuc} onChange={e => setNewShift({...newShift, GioKetThuc: e.target.value})} step="1" className="w-full p-2 border dark:border-slate-700 rounded-lg outline-none focus:border-orange-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={editingShiftId ? handleUpdateShift : handleCreateShift} className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700">Lưu</button>
                <button onClick={() => { setShowShiftForm(false); setEditingShiftId(null); setNewShift({ TenCa: "", GioBatDau: "07:00:00", GioKetThuc: "11:00:00" }); setMsg(""); }} className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-700">Hủy</button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm border-b border-slate-200 dark:border-slate-800">
                  <th className="p-4 font-medium">Mã Ca</th>
                  <th className="p-4 font-medium">Tên Ca Khám</th>
                  <th className="p-4 font-medium">Giờ bắt đầu</th>
                  <th className="p-4 font-medium">Giờ kết thúc</th>
                  <th className="p-4 font-medium">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                {shifts.map(item => (
                  <tr key={item.MaCaKham} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{item.MaCaKham}</td>
                    <td className="p-4 font-bold text-orange-700 dark:text-orange-500">{item.TenCa}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400"><Clock className="inline w-4 h-4 mr-1 text-slate-400 dark:text-slate-500" />{item.ThoiGianBatDau}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400"><Clock className="inline w-4 h-4 mr-1 text-slate-400 dark:text-slate-500" />{item.ThoiGianKetThuc}</td>
                    <td className="p-4">
                      <button onClick={() => openEditShift(item)} className="text-emerald-600 hover:text-emerald-800 text-sm font-medium flex items-center gap-1 inline-flex mr-3">
                        <Edit className="w-4 h-4" /> Sửa
                      </button>
                      <button onClick={() => handleDeleteShift(item.MaCaKham)} className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 inline-flex">
                        <Trash2 className="w-4 h-4" /> Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
