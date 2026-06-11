"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Users, Trash2, CalendarCheck, CheckCircle2, Edit, FileText } from "lucide-react";
import { PatientDetailsModal } from "../doctor/PatientDetailsModal";

export function AdminPatientsTab({ token }: { token: string }) {
  const [patients, setPatients] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  
  const [activeSubTab, setActiveSubTab] = useState("patients"); // patients or bookings
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
        <button onClick={() => {setActiveSubTab("patients"); setEditingId(null);}} className={`px-4 py-2 font-medium border-b-2 transition-colors flex items-center gap-2 ${activeSubTab === "patients" ? "border-teal-500 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}><Users className="w-4 h-4"/> Hồ sơ Bệnh nhân</button>
        <button onClick={() => {setActiveSubTab("bookings"); setEditingId(null);}} className={`px-4 py-2 font-medium border-b-2 transition-colors flex items-center gap-2 ${activeSubTab === "bookings" ? "border-teal-500 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}><CalendarCheck className="w-4 h-4"/> Lịch sử Đặt khám</button>
      </div>

      {msg && <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/> {msg}</div>}

      {editingId && (
        <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 max-w-4xl">
          <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4">Sửa {activeSubTab === "patients" ? "Thông Tin Bệnh Nhân" : "Trạng Thái Đặt Lịch"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {activeSubTab === "patients" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Họ Tên</label>
                  <input type="text" value={editPatient.HoTen} onChange={e => setEditPatient({...editPatient, HoTen: e.target.value})} className="w-full p-2 border dark:border-slate-700 rounded-lg outline-none focus:border-teal-500 dark:bg-slate-800 dark:text-slate-200" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Ngày Sinh</label>
                  <input type="date" value={editPatient.NgaySinh} onChange={e => setEditPatient({...editPatient, NgaySinh: e.target.value})} className="w-full p-2 border dark:border-slate-700 rounded-lg outline-none focus:border-teal-500 dark:bg-slate-800 dark:text-slate-200" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Giới Tính</label>
                  <select value={editPatient.GioiTinh} onChange={e => setEditPatient({...editPatient, GioiTinh: e.target.value})} className="w-full p-2 border dark:border-slate-700 rounded-lg outline-none focus:border-teal-500 dark:bg-slate-800 dark:text-slate-200">
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Điện Thoại</label>
                  <input type="text" value={editPatient.DienThoai} onChange={e => setEditPatient({...editPatient, DienThoai: e.target.value})} className="w-full p-2 border dark:border-slate-700 rounded-lg outline-none focus:border-teal-500 dark:bg-slate-800 dark:text-slate-200" />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Trạng Thái</label>
                <select value={editBooking.TrangThai} onChange={e => setEditBooking({...editBooking, TrangThai: e.target.value})} className="w-full p-2 border dark:border-slate-700 rounded-lg outline-none focus:border-teal-500 dark:bg-slate-800 dark:text-slate-200">
                  <option value="Chờ xác nhận">Chờ xác nhận</option>
                  <option value="Đã xác nhận">Đã xác nhận</option>
                  <option value="Hoàn thành">Hoàn thành</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={handleUpdate} className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700">Lưu thay đổi</button>
            <button onClick={() => setEditingId(null)} className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-700">Hủy</button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm border-b border-slate-200 dark:border-slate-800">
              {activeSubTab === "patients" ? (
                <>
                  <th className="p-4 font-medium">Mã BN</th>
                  <th className="p-4 font-medium">Họ Tên</th>
                  <th className="p-4 font-medium">Ngày Sinh</th>
                  <th className="p-4 font-medium">Giới Tính</th>
                  <th className="p-4 font-medium">Điện Thoại</th>
                  <th className="p-4 font-medium">Hành động</th>
                </>
              ) : (
                <>
                  <th className="p-4 font-medium">Mã Lịch</th>
                  <th className="p-4 font-medium">Bệnh Nhân</th>
                  <th className="p-4 font-medium">Ca Khám</th>
                  <th className="p-4 font-medium">Ngày Khám</th>
                  <th className="p-4 font-medium">Trạng Thái</th>
                  <th className="p-4 font-medium">Hành động</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
            {activeSubTab === "patients" ? patients.map(item => (
              <tr key={item.MaBenhNhan} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{item.MaBenhNhan}</td>
                <td className="p-4 font-bold text-slate-700 dark:text-slate-300">{item.HoTen}</td>
                <td className="p-4 text-slate-600 dark:text-slate-400">{item.NgaySinh}</td>
                <td className="p-4 text-slate-600 dark:text-slate-400">{item.GioiTinh}</td>
                <td className="p-4 text-slate-600 dark:text-slate-400">{item.DienThoai}</td>
                <td className="p-4">
                  <button onClick={() => setSelectedPatient(item.MaBenhNhan)} className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 inline-flex mr-3">
                    <FileText className="w-4 h-4" /> Chi tiết
                  </button>
                  <button onClick={() => openEdit(item)} className="text-emerald-600 hover:text-emerald-800 text-sm font-medium flex items-center gap-1 inline-flex mr-3">
                    <Edit className="w-4 h-4" /> Sửa
                  </button>
                  <button onClick={() => handleDelete("patients", item.MaBenhNhan)} className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 inline-flex">
                    <Trash2 className="w-4 h-4" /> Xóa
                  </button>
                </td>
              </tr>
            )) : bookings.map(item => (
              <tr key={item.MaDatLich} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{item.MaDatLich}</td>
                <td className="p-4 text-slate-700 dark:text-slate-300 font-medium">{item.TenBenhNhan}</td>
                <td className="p-4 text-slate-600 dark:text-slate-400 font-mono text-xs">{item.KhungGio ? `${item.KhungGio} (${item.CaKham})` : item.CaKham}</td>
                <td className="p-4 text-slate-600 dark:text-slate-400">{item.NgayKham}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    item.TrangThai === 'Đã xác nhận' ? 'bg-blue-100 text-blue-700' :
                    item.TrangThai === 'Chờ xác nhận' ? 'bg-amber-100 text-amber-700' : 
                    item.TrangThai === 'Hoàn thành' ? 'bg-emerald-100 text-emerald-700' : 
                    'bg-rose-100 text-rose-700'
                  }`}>
                    {item.TrangThai}
                  </span>
                </td>
                <td className="p-4">
                  <button onClick={() => openEdit(item)} className="text-emerald-600 hover:text-emerald-800 text-sm font-medium flex items-center gap-1 inline-flex mr-3">
                    <Edit className="w-4 h-4" /> Sửa
                  </button>
                  <button onClick={() => handleDelete("bookings", item.MaDatLich)} className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 inline-flex">
                    <Trash2 className="w-4 h-4" /> Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
