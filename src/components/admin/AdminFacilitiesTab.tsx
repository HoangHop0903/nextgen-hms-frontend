"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Hospital, Layers, Plus, Edit, CheckCircle2, Ban, Trash2, X } from "lucide-react";

export function AdminFacilitiesTab({ token }: { token: string }) {
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [activeSubTab, setActiveSubTab] = useState("specialties"); // specialties or rooms

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newSpec, setNewSpec] = useState({ TenChuyenKhoa: "", MoTa: "" });
  const [newRoom, setNewRoom] = useState({ MaChuyenKhoa: "", TenPhong: "", Tang: 1, Khu: "A" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res1 = await axios.get("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/specialties");
      const res2 = await axios.get("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/rooms");
      setSpecialties(res1.data);
      setRooms(res2.data);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleStatus = async (type: string, id: string, currentStatus: boolean) => {
    try {
      await axios.put(`https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/${type}/${id}/status`, { status: !currentStatus });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (type: string, id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa vĩnh viễn mục này? Lưu ý: Không thể xóa nếu đã có dữ liệu liên kết.')) return;
    try {
      await axios.delete(`https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/${type}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      alert('Đã xóa thành công!');
    } catch (e: any) {
      alert('Lỗi: ' + (e.response?.data?.detail || e.message));
    }
  };

  const handleUpdateSpecialty = async () => {
    try {
      await axios.put(`https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/specialties/${editingItem.MaChuyenKhoa}`, newSpec, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg("Sửa chuyên khoa thành công");
      setEditingItem(null);
      setNewSpec({ TenChuyenKhoa: "", MoTa: "" });
      fetchData();
    } catch (e) {
      setMsg("Lỗi khi sửa");
    }
  };

  const handleUpdateRoom = async () => {
    try {
      await axios.put(`https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/rooms/${editingItem.MaPhong}`, newRoom, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg("Sửa phòng khám thành công");
      setEditingItem(null);
      setNewRoom({ MaChuyenKhoa: "", TenPhong: "", Tang: 1, Khu: "A" });
      fetchData();
    } catch (e) {
      setMsg("Lỗi khi sửa");
    }
  };

  const openEditSpecialty = (item: any) => {
    setEditingItem(item);
    setNewSpec({ TenChuyenKhoa: item.TenChuyenKhoa, MoTa: item.MoTa });
    setActiveSubTab("specialties");
  };

  const openEditRoom = (item: any) => {
    setEditingItem(item);
    setNewRoom({ MaChuyenKhoa: item.MaChuyenKhoa, TenPhong: item.TenPhong, Tang: item.Tang, Khu: item.Khu });
    setActiveSubTab("rooms");
  };

  const handleCreateSpecialty = async () => {
    if (!newSpec.TenChuyenKhoa) return setMsg("Vui lòng nhập tên chuyên khoa");
    try {
      await axios.post("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/specialties", newSpec);
      setMsg("Thêm chuyên khoa thành công");
      setShowForm(false);
      setNewSpec({ TenChuyenKhoa: "", MoTa: "" });
      fetchData();
    } catch (e) {
      setMsg("Lỗi khi thêm");
    }
  };

  const handleCreateRoom = async () => {
    if (!newRoom.MaChuyenKhoa || !newRoom.TenPhong) return setMsg("Vui lòng nhập đủ thông tin");
    try {
      await axios.post("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/rooms", newRoom);
      setMsg("Thêm phòng khám thành công");
      setShowForm(false);
      setNewRoom({ MaChuyenKhoa: "", TenPhong: "", Tang: 1, Khu: "A" });
      fetchData();
    } catch (e) {
      setMsg("Lỗi khi thêm");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Hospital className="text-blue-500" /> Quản lý Cơ sở vật chất
        </h2>
        <button 
          onClick={() => { setShowForm(true); setMsg(""); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" /> Thêm Mới
        </button>
      </div>

      {msg && <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg">{msg}</div>}

      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6">
        <button onClick={() => setActiveSubTab("specialties")} className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeSubTab === "specialties" ? "border-blue-500 text-blue-600 dark:text-blue-400" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}>Chuyên khoa</button>
        <button onClick={() => setActiveSubTab("rooms")} className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeSubTab === "rooms" ? "border-blue-500 text-blue-600 dark:text-blue-400" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}>Phòng khám</button>
      </div>

      {/* --- FORM THÊM MỚI / SỬA (MODAL) --- */}
      {(showForm || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl w-full max-w-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                {editingItem ? "Sửa" : "Thêm"} {activeSubTab === "specialties" ? "Chuyên Khoa" : "Phòng Khám"} {editingItem ? (editingItem.TenChuyenKhoa || editingItem.TenPhong) : "Mới"}
              </h3>
              <button 
                onClick={() => { setShowForm(false); setEditingItem(null); setNewSpec({TenChuyenKhoa:'', MoTa:''}); setNewRoom({MaChuyenKhoa:'', TenPhong:'', Tang:1, Khu:'A'}); setMsg(""); }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {activeSubTab === "specialties" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Tên chuyên khoa</label>
                    <input type="text" value={newSpec.TenChuyenKhoa} onChange={e => setNewSpec({...newSpec, TenChuyenKhoa: e.target.value})} className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-800 dark:text-slate-200 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Mô tả</label>
                    <input type="text" value={newSpec.MoTa} onChange={e => setNewSpec({...newSpec, MoTa: e.target.value})} className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-800 dark:text-slate-200 transition-all" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Tên phòng</label>
                    <input type="text" value={newRoom.TenPhong} onChange={e => setNewRoom({...newRoom, TenPhong: e.target.value})} className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-800 dark:text-slate-200 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Chuyên khoa</label>
                    <select value={newRoom.MaChuyenKhoa} onChange={e => setNewRoom({...newRoom, MaChuyenKhoa: e.target.value})} className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-800 dark:text-slate-200 transition-all">
                      <option value="">-- Chọn --</option>
                      {specialties.map(s => <option key={s.MaChuyenKhoa} value={s.MaChuyenKhoa}>{s.TenChuyenKhoa}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Tầng</label>
                    <input type="number" value={newRoom.Tang} onChange={e => setNewRoom({...newRoom, Tang: parseInt(e.target.value)})} className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-800 dark:text-slate-200 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Khu</label>
                    <input type="text" value={newRoom.Khu} onChange={e => setNewRoom({...newRoom, Khu: e.target.value})} className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-800 dark:text-slate-200 transition-all" />
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                  onClick={() => { setShowForm(false); setEditingItem(null); setNewSpec({TenChuyenKhoa:'', MoTa:''}); setNewRoom({MaChuyenKhoa:'', TenPhong:'', Tang:1, Khu:'A'}); setMsg(""); }} 
                  className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Hủy
                </button>
                <button 
                  onClick={() => {
                    if (editingItem) {
                      activeSubTab === "specialties" ? handleUpdateSpecialty() : handleUpdateRoom();
                    } else {
                      activeSubTab === "specialties" ? handleCreateSpecialty() : handleCreateRoom();
                    }
                  }} 
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  {editingItem ? "Lưu thay đổi" : "Tạo mới"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- DANH SÁCH --- */}
      <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              {activeSubTab === "specialties" ? (
                <>
                  <th className="px-4 py-3">Mã CK</th>
                  <th className="px-4 py-3">Tên chuyên khoa</th>
                  <th className="px-4 py-3">Mô tả</th>
                  <th className="px-4 py-3 text-center">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Hành động</th>
                </>
              ) : (
                <>
                  <th className="px-4 py-3">Mã Phòng</th>
                  <th className="px-4 py-3">Tên phòng</th>
                  <th className="px-4 py-3">Chuyên khoa</th>
                  <th className="px-4 py-3">Vị trí</th>
                  <th className="px-4 py-3 text-center">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Hành động</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-slate-700 dark:text-slate-300">
            {activeSubTab === "specialties" ? specialties.map(item => (
              <tr key={item.MaChuyenKhoa} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{item.MaChuyenKhoa}</td>
                <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200">{item.TenChuyenKhoa}</td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400 max-w-xs truncate" title={item.MoTa}>{item.MoTa}</td>
                <td className="px-4 py-3 text-center">
                  {item.TrangThai ? <span className="inline-flex items-center gap-1 px-2 py-1 rounded-sm text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"><CheckCircle2 className="w-3 h-3" /> Hoạt động</span> : <span className="inline-flex items-center gap-1 px-2 py-1 rounded-sm text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800"><Ban className="w-3 h-3" /> Tạm ngưng</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => toggleStatus("specialties", item.MaChuyenKhoa, item.TrangThai)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium mr-4 text-xs">
                    Đổi TT
                  </button>
                  <button onClick={() => openEditSpecialty(item)} className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium mr-4 text-xs">
                    Sửa
                  </button>
                  <button onClick={() => handleDelete("specialties", item.MaChuyenKhoa)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium text-xs">
                    Xóa
                  </button>
                </td>
              </tr>
            )) : rooms.map(item => (
              <tr key={item.MaPhong} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{item.MaPhong}</td>
                <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200">{item.TenPhong}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">{specialties.find(s => s.MaChuyenKhoa === item.MaChuyenKhoa)?.TenChuyenKhoa || item.MaChuyenKhoa}</td>
                <td className="px-4 py-3">Tầng {item.Tang} - Khu {item.Khu}</td>
                <td className="px-4 py-3 text-center">
                  {item.TrangThai ? <span className="inline-flex items-center gap-1 px-2 py-1 rounded-sm text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"><CheckCircle2 className="w-3 h-3" /> Hoạt động</span> : <span className="inline-flex items-center gap-1 px-2 py-1 rounded-sm text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800"><Ban className="w-3 h-3" /> Tạm ngưng</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => toggleStatus("rooms", item.MaPhong, item.TrangThai)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium mr-4 text-xs">
                    Đổi TT
                  </button>
                  <button onClick={() => openEditRoom(item)} className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium mr-4 text-xs">
                    Sửa
                  </button>
                  <button onClick={() => handleDelete("rooms", item.MaPhong)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium text-xs">
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
