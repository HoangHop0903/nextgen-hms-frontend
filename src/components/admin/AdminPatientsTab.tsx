"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Users, Trash2, CalendarCheck, CheckCircle2, Edit, FileText, X } from "lucide-react";
import { PatientDetailsModal } from "../doctor/PatientDetailsModal";

export function AdminPatientsTab({ token }: { token: string }) {
  const [patients, setPatients] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  
  const [activeSubTab, setActiveSubTab] = useState("patients"); // patients or bookings
  const [bookingFilter, setBookingFilter] = useState("Tất cả"); // filter for bookings
  const [msg, setMsg] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  
  // Patient edit state
  const [editPatient, setEditPatient] = useState({ HoTen: "", NgaySinh: "", GioiTinh: "", DienThoai: "" });
  
  // Booking edit state
  const [editBooking, setEditBooking] = useState({ TrangThai: "" });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const resPat = await axios.get("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/patients", { headers: { Authorization: `Bearer ${token}` } });
      const resBook = await axios.get("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/bookings", { headers: { Authorization: `Bearer ${token}` } });
      const resAccs = await axios.get("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/accounts", { headers: { Authorization: `Bearer ${token}` } });
      
      setPatients(resPat.data);
      setBookings(resBook.data);
      setAccounts(resAccs.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (type: string, id: string) => {
    if (!confirm('Xóa vĩnh viễn mục này? Lưu ý: Không thể xóa nếu đã có dữ liệu liên kết.')) return;
    try {
      await axios.delete(`https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/${type}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      alert('Đã xóa thành công!');
      fetchData();
    } catch (e: any) {
      alert("Lỗi: " + (e.response?.data?.detail || e.message));
    }
  };

  const handleUpdate = async () => {
    try {
      if (activeSubTab === "patients") {
        await axios.put(`https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/patients/${editingId}`, editPatient, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.put(`https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/bookings/${editingId}`, editBooking, { headers: { Authorization: `Bearer ${token}` } });
      }
      setMsg("Sửa thông tin thành công!");
      setEditingId(null);
      fetchData();
    } catch (e: any) {
      setMsg("Lỗi: " + (e.response?.data?.detail || e.message));
    }
  };

  const openEdit = (item: any) => {
    if (activeSubTab === "patients") {
      setEditingId(item.MaBenhNhan);
      setEditPatient({ HoTen: item.HoTen, NgaySinh: item.NgaySinh, GioiTinh: item.GioiTinh, DienThoai: item.DienThoai });
    } else {
      setEditingId(item.MaDatLich);
      setEditBooking({ TrangThai: item.TrangThai });
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Users className="text-teal-500" /> Quản lý Bệnh nhân
        </h2>
      </div>

      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6">
        <button onClick={() => setActiveSubTab("patients")} className={`px-4 py-2 font-medium border-b-2 transition-colors flex items-center gap-2 ${activeSubTab === "patients" ? "border-teal-500 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}><Users className="w-4 h-4"/> Bệnh nhân</button>
        <button onClick={() => setActiveSubTab("bookings")} className={`px-4 py-2 font-medium border-b-2 transition-colors flex items-center gap-2 ${activeSubTab === "bookings" ? "border-teal-500 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}><CalendarCheck className="w-4 h-4"/> Lịch sử đặt khám</button>
      </div>

      {activeSubTab === "bookings" && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
          {["Tất cả", "Chờ xác nhận", "Đã xác nhận", "Hoàn thành", "Đã hủy"].map(status => {
            const count = status === "Tất cả" ? bookings.length : bookings.filter(b => b.TrangThai === status).length;
            return (
              <button 
                key={status}
                onClick={() => setBookingFilter(status)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border flex items-center gap-1.5 ${
                  bookingFilter === status 
                    ? "bg-slate-800 text-white border-slate-800 dark:bg-slate-100 dark:text-slate-900 shadow-sm" 
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800 dark:hover:border-slate-600"
                }`}
              >
                {status} <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${bookingFilter === status ? "bg-white/20 dark:bg-black/10" : "bg-slate-100 dark:bg-slate-800"}`}>{count}</span>
              </button>
            );
          })}
        </div>
      )}

      {msg && <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/> {msg}</div>}

      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl w-full max-w-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                Sửa {activeSubTab === "patients" ? "Thông Tin Bệnh Nhân" : "Trạng Thái Đặt Lịch"}
              </h3>
              <button 
                onClick={() => setEditingId(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {activeSubTab === "patients" ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Họ Tên</label>
                      <input type="text" value={editPatient.HoTen} onChange={e => setEditPatient({...editPatient, HoTen: e.target.value})} className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-slate-200 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Ngày Sinh</label>
                      <input type="date" value={editPatient.NgaySinh} onChange={e => setEditPatient({...editPatient, NgaySinh: e.target.value})} className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-slate-200 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Giới Tính</label>
                      <select value={editPatient.GioiTinh} onChange={e => setEditPatient({...editPatient, GioiTinh: e.target.value})} className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-slate-200 transition-all">
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Điện Thoại</label>
                      <input type="text" value={editPatient.DienThoai} onChange={e => setEditPatient({...editPatient, DienThoai: e.target.value})} className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-slate-200 transition-all" />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Trạng Thái</label>
                    <select value={editBooking.TrangThai} onChange={e => setEditBooking({...editBooking, TrangThai: e.target.value})} className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-slate-200 transition-all">
                      <option value="Chờ xác nhận">Chờ xác nhận</option>
                      <option value="Đã xác nhận">Đã xác nhận</option>
                      <option value="Hoàn thành">Hoàn thành</option>
                      <option value="Đã hủy">Đã hủy</option>
                    </select>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button onClick={() => setEditingId(null)} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Hủy</button>
                <button onClick={handleUpdate} className="bg-teal-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-teal-700 transition-colors shadow-sm">Lưu thay đổi</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- DANH SÁCH --- */}
      {activeSubTab === "patients" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {patients.map(item => (
            <div key={item.MaBenhNhan} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm shadow-sm p-5 flex flex-col group hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-md transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-lg font-bold text-slate-500 dark:text-slate-400 uppercase flex-shrink-0">
                  {item.HoTen.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base leading-tight mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate" title={item.HoTen}>{item.HoTen}</h4>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-2 py-0.5 rounded-sm inline-block">
                    {item.MaBenhNhan}
                  </span>
                </div>
              </div>
              <div className="space-y-1.5 mb-5 flex-1">
                <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <span className="opacity-60 w-4">🎂</span> {item.NgaySinh} <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-sm">{item.GioiTinh}</span>
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <span className="opacity-60 w-4">📞</span> {item.DienThoai || 'Chưa cập nhật SĐT'}
                </p>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                <button onClick={() => setSelectedPatient(item.MaBenhNhan)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-[11px] font-bold flex items-center gap-1 uppercase tracking-wider bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-sm border border-blue-100 dark:border-blue-800/50">
                  <FileText className="w-3 h-3" /> Hồ sơ
                </button>
                <div className="flex gap-3">
                  <button onClick={() => openEdit(item)} className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 text-xs font-bold flex items-center gap-1 uppercase tracking-wider">
                    <Edit className="w-3 h-3" /> Sửa
                  </button>
                  <button onClick={() => handleDelete("patients", item.MaBenhNhan)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-xs font-bold flex items-center gap-1 uppercase tracking-wider">
                    <Trash2 className="w-3 h-3" /> Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(bookingFilter === "Tất cả" ? bookings : bookings.filter(b => b.TrangThai === bookingFilter))
            .sort((a, b) => new Date(b.NgayKham).getTime() - new Date(a.NgayKham).getTime())
            .map(item => {
            const statusColor = item.TrangThai === 'Đã xác nhận' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                               item.TrangThai === 'Chờ xác nhận' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                               item.TrangThai === 'Hoàn thành' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                               'bg-rose-50 text-rose-700 border-rose-200';
            const leftBorder = item.TrangThai === 'Đã xác nhận' ? 'border-l-blue-500' :
                               item.TrangThai === 'Chờ xác nhận' ? 'border-l-amber-500' : 
                               item.TrangThai === 'Hoàn thành' ? 'border-l-emerald-500' : 
                               'border-l-rose-500';

            return (
              <div key={item.MaDatLich} className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm shadow-sm p-4 flex flex-col border-l-4 ${leftBorder} hover:shadow-md transition-shadow`}>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-2 py-0.5 rounded-sm">
                    {item.MaDatLich}
                  </span>
                  <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider border ${statusColor} dark:bg-opacity-20`}>
                    {item.TrangThai}
                  </span>
                </div>
                
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-1 truncate" title={item.TenBenhNhan}>{item.TenBenhNhan}</h4>
                
                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-sm p-2 mb-4 mt-2">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{item.NgayKham}</p>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">{item.KhungGio ? `${item.KhungGio} (${item.CaKham})` : item.CaKham}</p>
                </div>
                
                <div className="flex justify-end gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 mt-auto">
                  <button onClick={() => openEdit(item)} className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 text-xs font-bold flex items-center gap-1 uppercase tracking-wider">
                    <Edit className="w-3 h-3" /> Sửa
                  </button>
                  <button onClick={() => handleDelete("bookings", item.MaDatLich)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-xs font-bold flex items-center gap-1 uppercase tracking-wider">
                    <Trash2 className="w-3 h-3" /> Xóa
                  </button>
                </div>
              </div>
            );
          })}
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
