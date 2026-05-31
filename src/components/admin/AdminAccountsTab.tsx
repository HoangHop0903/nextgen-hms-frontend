"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { UserCog, Plus, Shield, Ban, CheckCircle2, Edit } from "lucide-react";

export function AdminAccountsTab({ token }: { token: string }) {
  const [accounts, setAccounts] = useState<any[]>([]);
  
  // Create state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("BACSI");
  const [loading, setLoading] = useState(false);

  // Edit State
  const [editingAcc, setEditingAcc] = useState<any>(null);
  const [editPassword, setEditPassword] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("");

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await axios.get("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/accounts", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAccounts(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/accounts", {
        TenDangNhap: username,
        MatKhau: password,
        Email: email,
        VaiTro: role
      }, { headers: { Authorization: `Bearer ${token}` } });
      fetchAccounts();
      setUsername(""); setPassword(""); setEmail("");
      alert("Tạo tài khoản thành công!");
    } catch (e: any) {
      alert("Lỗi: " + (e.response?.data?.detail || e.message));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (ma_tk: string, currentStatus: boolean) => {
    try {
      await axios.put(`https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/accounts/${ma_tk}/status`, {
        status: !currentStatus
      }, { headers: { Authorization: `Bearer ${token}` } });
      fetchAccounts();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {};
      if (editPassword) payload.mat_khau = editPassword;
      if (editEmail) payload.email = editEmail;
      if (editRole) payload.vai_tro = editRole;

      await axios.put(`https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/accounts/${editingAcc.MaTaiKhoan}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingAcc(null);
      fetchAccounts();
    } catch (e: any) {
      alert("Lỗi sửa tài khoản: " + (e.response?.data?.detail || e.message));
    }
  };

  const openEditModal = (acc: any) => {
    setEditingAcc(acc);
    setEditEmail(acc.Email || "");
    setEditRole(acc.VaiTro);
    setEditPassword("");
  };

  return (
    <div className="space-y-8">
      {/* Create Form */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-100"><UserCog className="w-5 h-5 text-indigo-500" /> Tạo tài khoản nội bộ</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Tên đăng nhập</label>
            <input required type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-3 py-2 border dark:border-slate-700 rounded-lg outline-none text-sm dark:bg-slate-800 dark:text-slate-200" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Mật khẩu</label>
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 border dark:border-slate-700 rounded-lg outline-none text-sm dark:bg-slate-800 dark:text-slate-200" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Email</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border dark:border-slate-700 rounded-lg outline-none text-sm dark:bg-slate-800 dark:text-slate-200" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Vai trò</label>
            <select value={role} onChange={e => setRole(e.target.value)} className="w-full px-3 py-2 border dark:border-slate-700 rounded-lg outline-none text-sm dark:bg-slate-800 dark:text-slate-200">
              <option value="BACSI">Bác Sĩ</option>
              <option value="NHANVIEN">Nhân Viên</option>
              <option value="ADMIN">Quản Trị Viên</option>
            </select>
          </div>
          <button disabled={loading} type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-1 h-[38px]">
            <Plus className="w-4 h-4" /> Tạo Mới
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-100"><Shield className="w-5 h-5 text-emerald-500" /> Danh sách Tài khoản</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3 font-semibold rounded-tl-lg">Mã TK</th>
                <th className="px-4 py-3 font-semibold">Username</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Vai trò</th>
                <th className="px-4 py-3 font-semibold text-center">Trạng thái</th>
                <th className="px-4 py-3 font-semibold text-center rounded-tr-lg">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(acc => (
                <tr key={acc.MaTaiKhoan} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-200">{acc.MaTaiKhoan}</td>
                  <td className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">{acc.TenDangNhap}</td>
                  <td className="px-4 py-3">{acc.Email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      acc.VaiTro === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                      acc.VaiTro === 'BACSI' ? 'bg-blue-100 text-blue-700' : 
                      acc.VaiTro === 'NHANVIEN' ? 'bg-amber-100 text-amber-700' : 
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {acc.VaiTro}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {acc.TrangThai ? <span className="text-emerald-500 font-medium text-xs border border-emerald-200 bg-emerald-50 px-2 py-1 rounded-full">Hoạt động</span> : <span className="text-red-500 font-medium text-xs border border-red-200 bg-red-50 px-2 py-1 rounded-full">Bị khoá</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button 
                        onClick={() => openEditModal(acc)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Sửa"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(acc.MaTaiKhoan, acc.TrangThai)}
                        className={`p-1.5 rounded-lg transition-colors ${acc.TrangThai ? 'text-red-500 hover:bg-red-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                        title={acc.TrangThai ? "Khoá tài khoản" : "Mở khoá"}
                      >
                        {acc.TrangThai ? <Ban className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingAcc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4 dark:text-slate-100">Sửa tài khoản {editingAcc.TenDangNhap}</h2>
            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1 dark:text-slate-400">Email</label>
                <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} className="w-full px-3 py-2 border dark:border-slate-700 rounded-lg text-sm dark:bg-slate-800 dark:text-slate-200" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 dark:text-slate-400">Đổi mật khẩu (Bỏ trống nếu không đổi)</label>
                <input type="password" value={editPassword} onChange={e => setEditPassword(e.target.value)} className="w-full px-3 py-2 border dark:border-slate-700 rounded-lg text-sm dark:bg-slate-800 dark:text-slate-200" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 dark:text-slate-400">Vai trò</label>
                <select value={editRole} onChange={e => setEditRole(e.target.value)} className="w-full px-3 py-2 border dark:border-slate-700 rounded-lg text-sm dark:bg-slate-800 dark:text-slate-200">
                  <option value="BENHNHAN">Bệnh Nhân</option>
                  <option value="BACSI">Bác Sĩ</option>
                  <option value="NHANVIEN">Nhân Viên</option>
                  <option value="ADMIN">Quản Trị Viên</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setEditingAcc(null)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold">Huỷ</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
