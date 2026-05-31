"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Pill, DollarSign, Plus, CheckCircle2, Ban, Trash2, Edit } from "lucide-react";

export function AdminPharmacyTab({ token }: { token: string }) {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [prices, setPrices] = useState<any[]>([]);
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [activeSubTab, setActiveSubTab] = useState("medicines"); // medicines or prices

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newMed, setNewMed] = useState({ TenThuoc: "", DonViTinh: "Viên", GiaThuoc: 0, CachDung: "" });
  const [newPrice, setNewPrice] = useState({ MaChuyenKhoa: "", TenDichVu: "", GiaKham: 0 });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res1 = await axios.get("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/medicines");
      const res2 = await axios.get("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/prices");
      const res3 = await axios.get("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/specialties");
      setMedicines(res1.data);
      setPrices(res2.data);
      setSpecialties(res3.data);
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

  const handleUpdateMed = async () => {
    try {
      await axios.put(`https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/medicines/${editingItem.MaThuoc}`, newMed, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg("Sửa thuốc thành công");
      setEditingItem(null);
      setNewMed({ TenThuoc: "", DonViTinh: "Viên", GiaThuoc: 0, CachDung: "" });
      fetchData();
    } catch (e) {
      setMsg("Lỗi khi sửa");
    }
  };

  const handleUpdatePrice = async () => {
    try {
      await axios.put(`https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/prices/${editingItem.MaBangGia}`, newPrice, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg("Sửa dịch vụ thành công");
      setEditingItem(null);
      setNewPrice({ MaChuyenKhoa: "", TenDichVu: "", GiaKham: 0 });
      fetchData();
    } catch (e) {
      setMsg("Lỗi khi sửa");
    }
  };

  const openEditMed = (item: any) => {
    setEditingItem(item);
    setNewMed({ TenThuoc: item.TenThuoc, DonViTinh: item.DonViTinh, GiaThuoc: item.GiaThuoc, CachDung: item.CachDung });
    setActiveSubTab("medicines");
  };

  const openEditPrice = (item: any) => {
    setEditingItem(item);
    setNewPrice({ MaChuyenKhoa: item.MaChuyenKhoa, TenDichVu: item.TenDichVu, GiaKham: item.GiaKham });
    setActiveSubTab("prices");
  };

  const handleCreateMed = async () => {
    if (!newMed.TenThuoc || newMed.GiaThuoc <= 0) return setMsg("Vui lòng nhập tên thuốc và giá hợp lệ");
    try {
      await axios.post("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/medicines", newMed);
      setMsg("Thêm thuốc thành công");
      setShowForm(false);
      setNewMed({ TenThuoc: "", DonViTinh: "Viên", GiaThuoc: 0, CachDung: "" });
      fetchData();
    } catch (e) {
      setMsg("Lỗi khi thêm");
    }
  };

  const handleCreatePrice = async () => {
    if (!newPrice.MaChuyenKhoa || !newPrice.TenDichVu || newPrice.GiaKham <= 0) return setMsg("Vui lòng nhập đủ thông tin");
    try {
      await axios.post("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/prices", newPrice);
      setMsg("Thêm dịch vụ thành công");
      setShowForm(false);
      setNewPrice({ MaChuyenKhoa: "", TenDichVu: "", GiaKham: 0 });
      fetchData();
    } catch (e) {
      setMsg("Lỗi khi thêm");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Pill className="text-indigo-500" /> Quản lý Dược & Dịch vụ
        </h2>
        <button 
          onClick={() => { setShowForm(true); setMsg(""); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" /> Thêm Mới
        </button>
      </div>

      {msg && <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg">{msg}</div>}

      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6">
        <button onClick={() => setActiveSubTab("medicines")} className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeSubTab === "medicines" ? "border-indigo-500 text-indigo-600 dark:text-indigo-400" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}>Danh mục Thuốc</button>
        <button onClick={() => setActiveSubTab("prices")} className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeSubTab === "prices" ? "border-indigo-500 text-indigo-600 dark:text-indigo-400" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}>Bảng giá Dịch vụ</button>
      </div>

      {/* --- FORM THÊM MỚI / SỬA --- */}
      {(showForm || editingItem) && (
        <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4">{editingItem ? "Sửa" : "Thêm"} {activeSubTab === "medicines" ? "Thuốc" : "Dịch Vụ"} {editingItem ? (editingItem.TenThuoc || editingItem.TenDichVu) : "Mới"}</h3>
          
          {activeSubTab === "medicines" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Tên thuốc</label>
                <input type="text" value={newMed.TenThuoc} onChange={e => setNewMed({...newMed, TenThuoc: e.target.value})} className="w-full p-2 border dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 dark:bg-slate-800 dark:text-slate-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Đơn vị tính</label>
                <select value={newMed.DonViTinh} onChange={e => setNewMed({...newMed, DonViTinh: e.target.value})} className="w-full p-2 border dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 dark:bg-slate-800 dark:text-slate-200">
                  <option value="Viên">Viên</option>
                  <option value="Vỉ">Vỉ</option>
                  <option value="Hộp">Hộp</option>
                  <option value="Lọ">Lọ</option>
                  <option value="Ống">Ống</option>
                  <option value="Gói">Gói</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Giá thuốc (VNĐ)</label>
                <input type="number" value={newMed.GiaThuoc} onChange={e => setNewMed({...newMed, GiaThuoc: parseFloat(e.target.value)})} className="w-full p-2 border dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 dark:bg-slate-800 dark:text-slate-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Cách dùng (Ghi chú)</label>
                <input type="text" value={newMed.CachDung} onChange={e => setNewMed({...newMed, CachDung: e.target.value})} className="w-full p-2 border dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 dark:bg-slate-800 dark:text-slate-200" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Chuyên khoa</label>
                <select value={newPrice.MaChuyenKhoa} onChange={e => setNewPrice({...newPrice, MaChuyenKhoa: e.target.value})} className="w-full p-2 border dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 dark:bg-slate-800 dark:text-slate-200">
                  <option value="">-- Chọn chuyên khoa --</option>
                  {specialties.map(s => <option key={s.MaChuyenKhoa} value={s.MaChuyenKhoa}>{s.TenChuyenKhoa}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Tên dịch vụ</label>
                <input type="text" value={newPrice.TenDichVu} onChange={e => setNewPrice({...newPrice, TenDichVu: e.target.value})} className="w-full p-2 border dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 dark:bg-slate-800 dark:text-slate-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Giá khám (VNĐ)</label>
                <input type="number" value={newPrice.GiaKham} onChange={e => setNewPrice({...newPrice, GiaKham: parseFloat(e.target.value)})} className="w-full p-2 border dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 dark:bg-slate-800 dark:text-slate-200" />
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={() => {
              if (editingItem) {
                activeSubTab === "medicines" ? handleUpdateMed() : handleUpdatePrice();
              } else {
                activeSubTab === "medicines" ? handleCreateMed() : handleCreatePrice();
              }
            }} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700">Lưu thông tin</button>
            <button onClick={() => { setShowForm(false); setEditingItem(null); setNewMed({TenThuoc:'', DonViTinh:'Viên', GiaThuoc:0, CachDung:''}); setNewPrice({MaChuyenKhoa:'', TenDichVu:'', GiaKham:0}); setMsg(""); }} className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-700">Hủy</button>
          </div>
        </div>
      )}

      {/* --- DANH SÁCH --- */}
      <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm border-b border-slate-200 dark:border-slate-800">
              {activeSubTab === "medicines" ? (
                <>
                  <th className="p-4 font-medium rounded-tl-xl">Mã Thuốc</th>
                  <th className="p-4 font-medium">Tên thuốc</th>
                  <th className="p-4 font-medium">Đơn vị</th>
                  <th className="p-4 font-medium">Đơn giá (VNĐ)</th>
                  <th className="p-4 font-medium">Cách dùng</th>
                  <th className="p-4 font-medium">Trạng thái</th>
                  <th className="p-4 font-medium rounded-tr-xl">Hành động</th>
                </>
              ) : (
                <>
                  <th className="p-4 font-medium rounded-tl-xl">Mã DV</th>
                  <th className="p-4 font-medium">Tên dịch vụ</th>
                  <th className="p-4 font-medium">Chuyên khoa</th>
                  <th className="p-4 font-medium">Giá khám (VNĐ)</th>
                  <th className="p-4 font-medium">Trạng thái</th>
                  <th className="p-4 font-medium rounded-tr-xl">Hành động</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
            {activeSubTab === "medicines" ? medicines.map(item => (
              <tr key={item.MaThuoc} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{item.MaThuoc}</td>
                <td className="p-4 font-bold text-slate-900 dark:text-slate-100">{item.TenThuoc}</td>
                <td className="p-4 text-slate-500 dark:text-slate-400">{item.DonViTinh}</td>
                <td className="p-4 text-rose-600 dark:text-rose-400 font-medium">{item.GiaThuoc.toLocaleString()} ₫</td>
                <td className="p-4 text-slate-500 dark:text-slate-400 text-sm max-w-[200px] truncate">{item.CachDung}</td>
                <td className="p-4">
                  {item.TrangThai ? <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700"><CheckCircle2 className="w-3 h-3" /> Khả dụng</span> : <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700"><Ban className="w-3 h-3" /> Hết hàng</span>}
                </td>
                <td className="p-4">
                  <button onClick={() => toggleStatus("medicines", item.MaThuoc, item.TrangThai)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mr-3">
                    Đổi TT
                  </button>
                  <button onClick={() => openEditMed(item)} className="text-emerald-600 hover:text-emerald-800 text-sm font-medium mr-3 flex items-center gap-1 inline-flex">
                    <Edit className="w-4 h-4" /> Sửa
                  </button>
                  <button onClick={() => handleDelete("medicines", item.MaThuoc)} className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 inline-flex">
                    <Trash2 className="w-4 h-4" /> Xóa
                  </button>
                </td>
              </tr>
            )) : prices.map(item => (
              <tr key={item.MaBangGia} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{item.MaBangGia}</td>
                <td className="p-4 font-bold text-slate-900 dark:text-slate-100">{item.TenDichVu}</td>
                <td className="p-4 text-slate-500 dark:text-slate-400">{specialties.find(s => s.MaChuyenKhoa === item.MaChuyenKhoa)?.TenChuyenKhoa || item.MaChuyenKhoa}</td>
                <td className="p-4 text-rose-600 dark:text-rose-400 font-medium">{item.GiaKham.toLocaleString()} ₫</td>
                <td className="p-4">
                  {item.TrangThai ? <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700"><CheckCircle2 className="w-3 h-3" /> Mở bán</span> : <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700"><Ban className="w-3 h-3" /> Tạm ngưng</span>}
                </td>
                <td className="p-4">
                  <button onClick={() => toggleStatus("prices", item.MaBangGia, item.TrangThai)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mr-3">
                    Đổi TT
                  </button>
                  <button onClick={() => openEditPrice(item)} className="text-emerald-600 hover:text-emerald-800 text-sm font-medium mr-3 flex items-center gap-1 inline-flex">
                    <Edit className="w-4 h-4" /> Sửa
                  </button>
                  <button onClick={() => handleDelete("prices", item.MaBangGia)} className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 inline-flex">
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
