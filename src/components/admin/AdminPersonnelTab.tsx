"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { UserCog, Plus, Trash2, Edit, UserSquare2, BriefcaseMedical, CheckCircle2, Users } from "lucide-react";
import { PersonnelProfileModal } from "../shared/PersonnelProfileModal";

export function AdminPersonnelTab({ token }: { token: string }) {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [staffs, setStaffs] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [specialties, setSpecialties] = useState<any[]>([]);
  
  const [activeSubTab, setActiveSubTab] = useState("doctors"); // doctors or staffs
  const [msg, setMsg] = useState("");
  const [viewingProfile, setViewingProfile] = useState<any>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Doctor states
  const [newDoctor, setNewDoctor] = useState({ MaTaiKhoan: "", MaChuyenKhoa: "", HoTen: "", HocVi: "BS", SDT: "" });
  
  // Staff states
  const [newStaff, setNewStaff] = useState({ MaTaiKhoan: "", HoTen: "", ChucVu: "Lễ tân", SDT: "" });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const resDocs = await axios.get("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/doctors", { headers: { Authorization: `Bearer ${token}` } });
      const resStaffs = await axios.get("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/staffs", { headers: { Authorization: `Bearer ${token}` } });
      const resAccs = await axios.get("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/accounts", { headers: { Authorization: `Bearer ${token}` } });
      const resSpecs = await axios.get("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/specialties");
      
      setDoctors(resDocs.data);
      setStaffs(resStaffs.data);
      setAccounts(resAccs.data);
      setSpecialties(resSpecs.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async () => {
    try {
      if (activeSubTab === "doctors") {
        if (!newDoctor.MaTaiKhoan || !newDoctor.HoTen || !newDoctor.MaChuyenKhoa) return setMsg("Vui lòng điền đủ thông tin bắt buộc.");
        await axios.post("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/doctors", newDoctor, { headers: { Authorization: `Bearer ${token}` } });
        setNewDoctor({ MaTaiKhoan: "", MaChuyenKhoa: "", HoTen: "", HocVi: "BS", SDT: "" });
      } else {
        if (!newStaff.MaTaiKhoan || !newStaff.HoTen) return setMsg("Vui lòng điền đủ thông tin.");
        await axios.post("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/staffs", newStaff, { headers: { Authorization: `Bearer ${token}` } });
        setNewStaff({ MaTaiKhoan: "", HoTen: "", ChucVu: "Lễ tân", SDT: "" });
      }
      setMsg("Thêm nhân sự thành công!");
      setShowForm(false);
      fetchData();
    } catch (e: any) {
      setMsg("Lỗi: " + (e.response?.data?.detail || e.message));
    }
  };

  const handleUpdate = async () => {
    try {
      if (activeSubTab === "doctors") {
        await axios.put(`https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/doctors/${editingId}`, newDoctor, { headers: { Authorization: `Bearer ${token}` } });
        setNewDoctor({ MaTaiKhoan: "", MaChuyenKhoa: "", HoTen: "", HocVi: "BS", SDT: "" });
      } else {
        await axios.put(`https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/staffs/${editingId}`, newStaff, { headers: { Authorization: `Bearer ${token}` } });
        setNewStaff({ MaTaiKhoan: "", HoTen: "", ChucVu: "Lễ tân", SDT: "" });
      }
      setMsg("Sửa nhân sự thành công!");
      setEditingId(null);
      fetchData();
    } catch (e: any) {
      setMsg("Lỗi: " + (e.response?.data?.detail || e.message));
    }
  };

  const openEdit = (item: any) => {
    if (activeSubTab === "doctors") {
      setEditingId(item.MaBacSi);
      setNewDoctor({ MaTaiKhoan: item.MaTaiKhoan, MaChuyenKhoa: item.MaChuyenKhoa, HoTen: item.HoTen, HocVi: item.HocVi, SDT: item.SDT });
    } else {
      setEditingId(item.MaNhanVien);
      setNewStaff({ MaTaiKhoan: item.MaTaiKhoan, HoTen: item.HoTen, ChucVu: item.ChucVu, SDT: item.SDT });
    }
  };

  const handleDelete = async (type: string, id: string) => {
    if (!confirm('Xóa vĩnh viễn nhân sự này? Thao tác không thể phục hồi và sẽ bị chặn nếu có dữ liệu liên kết.')) return;
    try {
      await axios.delete(`https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/${type}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      alert('Đã xóa thành công!');
      fetchData();
    } catch (e: any) {
      alert("Lỗi: " + (e.response?.data?.detail || e.message));
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <UserCog className="text-purple-500" /> Quản lý Nhân sự
        </h2>
        <button 
          onClick={() => { setShowForm(true); setMsg(""); }}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" /> Thêm Nhân Sự
        </button>
      </div>

      {msg && <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/> {msg}</div>}

      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6">
        <button onClick={() => setActiveSubTab("doctors")} className={`px-4 py-2 font-medium border-b-2 transition-colors flex items-center gap-2 ${activeSubTab === "doctors" ? "border-purple-500 text-purple-600 dark:text-purple-400" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}><BriefcaseMedical className="w-4 h-4"/> Bác sĩ</button>
        <button onClick={() => setActiveSubTab("staffs")} className={`px-4 py-2 font-medium border-b-2 transition-colors flex items-center gap-2 ${activeSubTab === "staffs" ? "border-purple-500 text-purple-600 dark:text-purple-400" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}><UserSquare2 className="w-4 h-4"/> Nhân viên</button>
      </div>

      {(showForm || editingId) && (
        <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 max-w-4xl">
          <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4">{editingId ? "Sửa" : "Thêm"} {activeSubTab === "doctors" ? "Bác Sĩ" : "Nhân Viên"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Tài khoản liên kết</label>
              <select value={activeSubTab === "doctors" ? newDoctor.MaTaiKhoan : newStaff.MaTaiKhoan} onChange={e => activeSubTab === "doctors" ? setNewDoctor({...newDoctor, MaTaiKhoan: e.target.value}) : setNewStaff({...newStaff, MaTaiKhoan: e.target.value})} className="w-full p-2 border dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 outline-none focus:border-purple-500 text-slate-900 dark:text-slate-200">
                <option value="">-- Chọn tài khoản --</option>
                {accounts.filter(a => activeSubTab === "doctors" ? a.VaiTro === "BACSI" : a.VaiTro === "NHANVIEN").map(a => <option key={a.MaTaiKhoan} value={a.MaTaiKhoan}>{a.TenDangNhap} ({a.Email})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Họ tên</label>
              <input type="text" value={activeSubTab === "doctors" ? newDoctor.HoTen : newStaff.HoTen} onChange={e => activeSubTab === "doctors" ? setNewDoctor({...newDoctor, HoTen: e.target.value}) : setNewStaff({...newStaff, HoTen: e.target.value})} className="w-full p-2 border dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 outline-none focus:border-purple-500 text-slate-900 dark:text-slate-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Số điện thoại</label>
              <input type="text" value={activeSubTab === "doctors" ? newDoctor.SDT : newStaff.SDT} onChange={e => activeSubTab === "doctors" ? setNewDoctor({...newDoctor, SDT: e.target.value}) : setNewStaff({...newStaff, SDT: e.target.value})} className="w-full p-2 border dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 outline-none focus:border-purple-500 text-slate-900 dark:text-slate-200" />
            </div>

            {activeSubTab === "doctors" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Học vị</label>
                  <input type="text" value={newDoctor.HocVi} onChange={e => setNewDoctor({...newDoctor, HocVi: e.target.value})} placeholder="VD: ThS.BS, TS.BS..." className="w-full p-2 border dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 outline-none focus:border-purple-500 text-slate-900 dark:text-slate-200" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Chuyên khoa</label>
                  <select value={newDoctor.MaChuyenKhoa} onChange={e => setNewDoctor({...newDoctor, MaChuyenKhoa: e.target.value})} className="w-full p-2 border dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 outline-none focus:border-purple-500 text-slate-900 dark:text-slate-200">
                    <option value="">-- Chọn --</option>
                    {specialties.map(s => <option key={s.MaChuyenKhoa} value={s.MaChuyenKhoa}>{s.TenChuyenKhoa}</option>)}
                  </select>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Chức vụ</label>
                <input type="text" value={newStaff.ChucVu} onChange={e => setNewStaff({...newStaff, ChucVu: e.target.value})} placeholder="VD: Lễ tân, Y tá..." className="w-full p-2 border dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 outline-none focus:border-purple-500 text-slate-900 dark:text-slate-200" />
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={editingId ? handleUpdate : handleCreate} className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700">Lưu</button>
            <button onClick={() => { setShowForm(false); setEditingId(null); setNewDoctor({ MaTaiKhoan: "", MaChuyenKhoa: "", HoTen: "", HocVi: "BS", SDT: "" }); setNewStaff({ MaTaiKhoan: "", HoTen: "", ChucVu: "Lễ tân", SDT: "" }); setMsg(""); }} className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-700">Hủy</button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm border-b border-slate-200 dark:border-slate-800">
              <th className="p-4 font-medium">Mã</th>
              <th className="p-4 font-medium">Họ Tên</th>
              <th className="p-4 font-medium">SĐT</th>
              {activeSubTab === "doctors" ? (
                <>
                  <th className="p-4 font-medium">Học vị</th>
                  <th className="p-4 font-medium">Chuyên khoa</th>
                </>
              ) : (
                <th className="p-4 font-medium">Chức vụ</th>
              )}
              <th className="p-4 font-medium">Tài khoản</th>
              <th className="p-4 font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
            {(activeSubTab === "doctors" ? doctors : staffs).map(item => (
              <tr key={item.MaBacSi || item.MaNhanVien} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 cursor-pointer" onClick={() => setViewingProfile(item)}>
                <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{item.MaBacSi || item.MaNhanVien}</td>
                <td className="p-4 font-bold text-slate-700 dark:text-slate-300">{item.HoTen}</td>
                <td className="p-4 text-slate-600 dark:text-slate-400">{item.SDT}</td>
                {activeSubTab === "doctors" ? (
                  <>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{item.HocVi}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{specialties.find(s => s.MaChuyenKhoa === item.MaChuyenKhoa)?.TenChuyenKhoa}</td>
                  </>
                ) : (
                  <td className="p-4 text-slate-600 dark:text-slate-400">{item.ChucVu}</td>
                )}
                <td className="p-4 text-slate-500 dark:text-slate-500 font-mono text-xs">{item.MaTaiKhoan}</td>
                <td className="p-4">
                  <button onClick={(e) => { e.stopPropagation(); openEdit(item); }} className="text-emerald-600 hover:text-emerald-800 text-sm font-medium flex items-center gap-1 inline-flex mr-3">
                    <Edit className="w-4 h-4" /> Sửa
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(activeSubTab === "doctors" ? "doctors" : "staffs", item.MaBacSi || item.MaNhanVien); }} className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 inline-flex">
                    <Trash2 className="w-4 h-4" /> Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewingProfile && (
        <PersonnelProfileModal 
          person={viewingProfile} 
          type={activeSubTab === "doctors" ? "doctor" : "staff"} 
          onClose={() => setViewingProfile(null)} 
        />
      )}
    </div>
  );
}
