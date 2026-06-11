"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Pill, DollarSign, Plus, CheckCircle2, Ban, Trash2, Edit, X } from "lucide-react";

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

  async function fetchData() {
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

      {/* --- FORM THÊM MỚI / SỬA (MODAL) --- */}
      {(showForm || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl w-full max-w-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                {editingItem ? "Sửa" : "Thêm"} {activeSubTab === "medicines" ? "Thuốc" : "Dịch Vụ"} {editingItem ? (editingItem.TenThuoc || editingItem.TenDichVu) : "Mới"}
              </h3>
              <button 
                onClick={() => { setShowForm(false); setEditingItem(null); setNewMed({TenThuoc:'', DonViTinh:'Viên', GiaThuoc:0, CachDung:''}); setNewPrice({MaChuyenKhoa:'', TenDichVu:'', GiaKham:0}); setMsg(""); }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {activeSubTab === "medicines" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Tên thuốc</label>
                    <input type="text" value={newMed.TenThuoc} onChange={e => setNewMed({...newMed, TenThuoc: e.target.value})} className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white dark:bg-slate-800 dark:text-slate-200 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Đơn vị tính</label>
                    <select value={newMed.DonViTinh} onChange={e => setNewMed({...newMed, DonViTinh: e.target.value})} className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white dark:bg-slate-800 dark:text-slate-200 transition-all">
                      <option value="Viên">Viên</option>
                      <option value="Vỉ">Vỉ</option>
                      <option value="Hộp">Hộp</option>
                      <option value="Lọ">Lọ</option>
                      <option value="Ống">Ống</option>
                      <option value="Gói">Gói</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Giá thuốc (VNĐ)</label>
                    <input type="number" value={newMed.GiaThuoc} onChange={e => setNewMed({...newMed, GiaThuoc: parseFloat(e.target.value)})} className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white dark:bg-slate-800 dark:text-slate-200 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Cách dùng (Ghi chú)</label>
                    <input type="text" value={newMed.CachDung} onChange={e => setNewMed({...newMed, CachDung: e.target.value})} className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white dark:bg-slate-800 dark:text-slate-200 transition-all" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Chuyên khoa</label>
                    <select value={newPrice.MaChuyenKhoa} onChange={e => setNewPrice({...newPrice, MaChuyenKhoa: e.target.value})} className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white dark:bg-slate-800 dark:text-slate-200 transition-all">
                      <option value="">-- Chọn chuyên khoa --</option>
                      {specialties.map(s => <option key={s.MaChuyenKhoa} value={s.MaChuyenKhoa}>{s.TenChuyenKhoa}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Tên dịch vụ</label>
                    <input type="text" value={newPrice.TenDichVu} onChange={e => setNewPrice({...newPrice, TenDichVu: e.target.value})} className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white dark:bg-slate-800 dark:text-slate-200 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Giá khám (VNĐ)</label>
                    <input type="number" value={newPrice.GiaKham} onChange={e => setNewPrice({...newPrice, GiaKham: parseFloat(e.target.value)})} className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white dark:bg-slate-800 dark:text-slate-200 transition-all" />
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                  onClick={() => { setShowForm(false); setEditingItem(null); setNewMed({TenThuoc:'', DonViTinh:'Viên', GiaThuoc:0, CachDung:''}); setNewPrice({MaChuyenKhoa:'', TenDichVu:'', GiaKham:0}); setMsg(""); }} 
                  className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Hủy
                </button>
                <button 
                  onClick={() => {
                    if (editingItem) {
                      activeSubTab === "medicines" ? handleUpdateMed() : handleUpdatePrice();
                    } else {
                      activeSubTab === "medicines" ? handleCreateMed() : handleCreatePrice();
                    }
                  }} 
                  className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  {editingItem ? "Lưu thay đổi" : "Tạo mới"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- DANH SÁCH --- */}
      {activeSubTab === "medicines" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {medicines.map(item => (
            <div key={item.MaThuoc} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm shadow-sm p-4 flex flex-col group hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-mono text-slate-500 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-2 py-0.5 rounded-sm">
                  {item.MaThuoc}
                </span>
                {item.TrangThai ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50 px-2 py-0.5 rounded-sm uppercase tracking-wider">Còn thuốc</span>
                ) : (
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50 px-2 py-0.5 rounded-sm uppercase tracking-wider">Hết thuốc</span>
                )}
              </div>
              
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate" title={item.TenThuoc}>{item.TenThuoc}</h4>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1">
                Đơn vị: <strong className="text-slate-700 dark:text-slate-300">{item.DonViTinh}</strong>
              </p>
              
              <div className="mt-auto bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-sm p-3 mb-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Đơn giá:</span>
                  <span className="text-sm font-black text-rose-600 dark:text-rose-400">{item.GiaThuoc.toLocaleString()} ₫</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate" title={item.CachDung}><span className="font-semibold opacity-70">HD:</span> {item.CachDung || 'Chưa có'}</p>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => toggleStatus("medicines", item.MaThuoc, item.TrangThai)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-[11px] font-bold uppercase tracking-wider">
                  Đổi TT
                </button>
                <div className="flex gap-3">
                  <button onClick={() => openEditMed(item)} className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 text-[11px] font-bold flex items-center gap-1 uppercase tracking-wider">
                    <Edit className="w-3 h-3" /> Sửa
                  </button>
                  <button onClick={() => handleDelete("medicines", item.MaThuoc)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-[11px] font-bold flex items-center gap-1 uppercase tracking-wider">
                    <Trash2 className="w-3 h-3" /> Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm">
          <table className="w-full text-left text-sm whitespace-nowrap table-auto">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3 w-24">Mã DV</th>
                <th className="px-4 py-3">Tên dịch vụ</th>
                <th className="px-4 py-3 min-w-[150px]">Chuyên khoa</th>
                <th className="px-4 py-3 text-right">Giá khám (VNĐ)</th>
                <th className="px-4 py-3 text-center w-36">Trạng thái</th>
                <th className="px-4 py-3 text-right w-48">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-slate-700 dark:text-slate-300">
              {prices.map(item => (
                <tr key={item.MaBangGia} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{item.MaBangGia}</td>
                  <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200 truncate max-w-[300px]" title={item.TenDichVu}>{item.TenDichVu}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-medium truncate max-w-[200px]" title={specialties.find(s => s.MaChuyenKhoa === item.MaChuyenKhoa)?.TenChuyenKhoa || item.MaChuyenKhoa}>{specialties.find(s => s.MaChuyenKhoa === item.MaChuyenKhoa)?.TenChuyenKhoa || item.MaChuyenKhoa}</td>
                  <td className="px-4 py-3 text-rose-600 dark:text-rose-400 font-bold text-right">{item.GiaKham.toLocaleString()} ₫</td>
                  <td className="px-4 py-3 text-center">
                    {item.TrangThai ? <span className="inline-flex items-center gap-1 px-2 py-1 rounded-sm text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 uppercase tracking-wider"><CheckCircle2 className="w-3 h-3" /> Hoạt động</span> : <span className="inline-flex items-center gap-1 px-2 py-1 rounded-sm text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800 uppercase tracking-wider"><Ban className="w-3 h-3" /> Tạm ngưng</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => toggleStatus("prices", item.MaBangGia, item.TrangThai)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium mr-4 text-xs uppercase tracking-wider inline-flex items-center">
                      Đổi TT
                    </button>
                    <button onClick={() => openEditPrice(item)} className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium mr-4 text-xs uppercase tracking-wider inline-flex items-center">
                      Sửa
                    </button>
                    <button onClick={() => handleDelete("prices", item.MaBangGia)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium text-xs uppercase tracking-wider inline-flex items-center">
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
