"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Hospital, Layers, Plus, Edit, CheckCircle2, Ban, Trash2 } from "lucide-react";

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

  const fetchData = async () => {
    try {
      const res1 = await axios.get("http://localhost:8000/api/v1/admin/specialties");
      const res2 = await axios.get("http://localhost:8000/api/v1/admin/rooms");
      setSpecialties(res1.data);
      setRooms(res2.data);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleStatus = async (type: string, id: string, currentStatus: boolean) => {
    try {
      await axios.put(`http://localhost:8000/api/v1/admin/${type}/${id}/status`, { status: !currentStatus });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (type: string, id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa vĩnh viễn mục này? Lưu ý: Không thể xóa nếu đã có dữ liệu liên kết.')) return;
    try {
      await axios.delete(`http://localhost:8000/api/v1/admin/${type}/${id}`, {
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
      await axios.put(`http://localhost:8000/api/v1/admin/specialties/${editingItem.MaChuyenKhoa}`, newSpec, {
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
      await axios.put(`http://localhost:8000/api/v1/admin/rooms/${editingItem.MaPhong}`, newRoom, {
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
      await axios.post("http://localhost:8000/api/v1/admin/specialties", newSpec);
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
      await axios.post("http://localhost:8000/api/v1/admin/rooms", newRoom);
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

      {/* --- FORM THÊM MỚI / SỬA --- */}
      {(showForm || editingItem) && (
        <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4">{editingItem ? "Sửa" : "Thêm"} {activeSubTab === "specialties" ? "Chuyên Khoa" : "Phòng Khám"} {editingItem ? (editingItem.TenChuyenKhoa || editingItem.TenPhong) : "Mới"}</h3>
          
          {activeSubTab === "specialties" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Tên chuyên khoa</label>
                <input type="text" value={newSpec.TenChuyenKhoa} onChange={e => setNewSpec({...newSpec, TenChuyenKhoa: e.target.value})} className="w-full p-2 border dark:border-slate-700 rounded-lg outline-none focus:border-blue-500 dark:bg-slate-800 dark:text-slate-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Mô tả</label>
                <input type="text" value={newSpec.MoTa} onChange={e => setNewSpec({...newSpec, MoTa: e.target.value})} className="w-full p-2 border dark:border-slate-700 rounded-lg outline-none focus:border-blue-500 dark:bg-slate-800 dark:text-slate-200" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Tên phòng</label>
                <input type="text" value={newRoom.TenPhong} onChange={e => setNewRoom({...newRoom, TenPhong: e.target.value})} className="w-full p-2 border dark:border-slate-700 rounded-lg outline-none focus:border-blue-500 dark:bg-slate-800 dark:text-slate-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Chuyên khoa</label>
                <select value={newRoom.MaChuyenKhoa} onChange={e => setNewRoom({...newRoom, MaChuyenKhoa: e.target.value})} className="w-full p-2 border dark:border-slate-700 rounded-lg outline-none focus:border-blue-500 dark:bg-slate-800 dark:text-slate-200">
                  <option value="">-- Chọn --</option>
                  {specialties.map(s => <option key={s.MaChuyenKhoa} value={s.MaChuyenKhoa}>{s.TenChuyenKhoa}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Tầng</label>
                <input type="number" value={newRoom.Tang} onChange={e => setNewRoom({...newRoom, Tang: parseInt(e.target.value)})} className="w-full p-2 border dark:border-slate-700 rounded-lg outline-none focus:border-blue-500 dark:bg-slate-800 dark:text-slate-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Khu</label>
                <input type="text" value={newRoom.Khu} onChange={e => setNewRoom({...newRoom, Khu: e.target.value})} className="w-full p-2 border dark:border-slate-700 rounded-lg outline-none focus:border-blue-500 dark:bg-slate-800 dark:text-slate-200" />
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={() => {
              if (editingItem) {
                activeSubTab === "specialties" ? handleUpdateSpecialty() : handleUpdateRoom();
              } else {
                activeSubTab === "specialties" ? handleCreateSpecialty() : handleCreateRoom();
              }
            }} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">Lưu thông tin</button>
            <button onClick={() => { setShowForm(false); setEditingItem(null); setNewSpec({TenChuyenKhoa:'', MoTa:''}); setNewRoom({MaChuyenKhoa:'', TenPhong:'', Tang:1, Khu:'A'}); setMsg(""); }} className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-700">Hủy</button>
          </div>
        </div>
      )}

      {/* --- DANH SÁCH --- */}
      <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm border-b border-slate-200 dark:border-slate-800">
              {activeSubTab === "specialties" ? (
                <>
                  <th className="p-4 font-medium rounded-tl-xl">Mã CK</th>
                  <th className="p-4 font-medium">Tên chuyên khoa</th>
                  <th className="p-4 font-medium">Mô tả</th>
                  <th className="p-4 font-medium">Trạng thái</th>
                  <th className="p-4 font-medium rounded-tr-xl">Hành động</th>
                </>
              ) : (
                <>
                  <th className="p-4 font-medium rounded-tl-xl">Mã Phòng</th>
                  <th className="p-4 font-medium">Tên phòng</th>
                  <th className="p-4 font-medium">Chuyên khoa</th>
                  <th className="p-4 font-medium">Vị trí</th>
                  <th className="p-4 font-medium">Trạng thái</th>
                  <th className="p-4 font-medium rounded-tr-xl">Hành động</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
            {activeSubTab === "specialties" ? specialties.map(item => (
              <tr key={item.MaChuyenKhoa} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{item.MaChuyenKhoa}</td>
                <td className="p-4 font-medium">{item.TenChuyenKhoa}</td>
                <td className="p-4 text-slate-500 dark:text-slate-400">{item.MoTa}</td>
                <td className="p-4">
                  {item.TrangThai ? <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700"><CheckCircle2 className="w-3 h-3" /> Hoạt động</span> : <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700"><Ban className="w-3 h-3" /> Tạm ngưng</span>}
                </td>
                <td className="p-4">
                  <button onClick={() => toggleStatus("specialties", item.MaChuyenKhoa, item.TrangThai)} className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3">
                    Đổi TT
                  </button>
                  <button onClick={() => openEditSpecialty(item)} className="text-emerald-600 hover:text-emerald-800 text-sm font-medium mr-3 flex items-center gap-1 inline-flex">
                    <Edit className="w-4 h-4" /> Sửa
                  </button>
                  <button onClick={() => handleDelete("specialties", item.MaChuyenKhoa)} className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 inline-flex">
                    <Trash2 className="w-4 h-4" /> Xóa
                  </button>
                </td>
              </tr>
            )) : rooms.map(item => (
              <tr key={item.MaPhong} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{item.MaPhong}</td>
                <td className="p-4 font-bold text-slate-900 dark:text-slate-100">{item.TenPhong}</td>
                <td className="p-4 text-slate-500 dark:text-slate-400">{specialties.find(s => s.MaChuyenKhoa === item.MaChuyenKhoa)?.TenChuyenKhoa || item.MaChuyenKhoa}</td>
                <td className="p-4">Tầng {item.Tang} - Khu {item.Khu}</td>
                <td className="p-4">
                  {item.TrangThai ? <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700"><CheckCircle2 className="w-3 h-3" /> Hoạt động</span> : <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700"><Ban className="w-3 h-3" /> Tạm ngưng</span>}
                </td>
                <td className="p-4">
                  <button onClick={() => toggleStatus("rooms", item.MaPhong, item.TrangThai)} className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3">
                    Đổi TT
                  </button>
                  <button onClick={() => openEditRoom(item)} className="text-emerald-600 hover:text-emerald-800 text-sm font-medium mr-3 flex items-center gap-1 inline-flex">
                    <Edit className="w-4 h-4" /> Sửa
                  </button>
                  <button onClick={() => handleDelete("rooms", item.MaPhong)} className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 inline-flex">
                    <Trash2 className="w-4 h-4" /> Xóa
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
