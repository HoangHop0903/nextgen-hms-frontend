"use client";

import { useState } from "react";
import axios from "axios";
import { X, Save, Camera } from "lucide-react";

export function UpdateProfileModal({ token, initialData, onClose }: { token: string, initialData?: any, onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hoTen, setHoTen] = useState(initialData?.HoTen || "");
  const [sdt, setSdt] = useState(initialData?.SDT || "");
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(initialData?.AnhDaiDien || "");
  
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      let finalAvatarUrl = initialData?.AnhDaiDien || "";

      // Upload image first if changed
      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        const uploadRes = await axios.post("http://localhost:8000/api/v1/auth/upload-avatar", formData, {
          headers: { 
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}` 
          }
        });
        finalAvatarUrl = uploadRes.data.url;
      }

      const payload: any = {};
      if (email) payload.email = email;
      if (password) payload.mat_khau = password;
      if (hoTen !== initialData?.HoTen) payload.ho_ten = hoTen;
      if (sdt !== initialData?.SDT) payload.sdt = sdt;
      if (finalAvatarUrl !== initialData?.AnhDaiDien) payload.anh_dai_dien = finalAvatarUrl;
      
      await axios.put("http://localhost:8000/api/v1/auth/profile", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg("Cập nhật thành công! Đang tải lại...");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (e: any) {
      setMsg("Lỗi: " + (e.response?.data?.detail || e.message));
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Cập nhật hồ sơ</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          {msg && (
            <div className={`p-3 rounded-lg mb-4 text-sm font-medium ${msg.includes("thành công") ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"}`}>
              {msg}
            </div>
          )}
          
          <form id="profile-form" onSubmit={handleSave} className="space-y-4">
            
            {/* Avatar Upload */}
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full border-4 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-slate-300 dark:text-slate-600">{hoTen?.charAt(0) || "U"}</span>
                  )}
                </div>
                <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-6 h-6 text-white" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">Click vào ảnh để thay đổi</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">Họ và Tên</label>
              <input type="text" value={hoTen} onChange={e => setHoTen(e.target.value)} placeholder="Nhập họ tên" className="w-full px-3 py-2 border dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg outline-none text-sm focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">Số điện thoại</label>
              <input type="text" value={sdt} onChange={e => setSdt(e.target.value)} placeholder="Nhập số điện thoại" className="w-full px-3 py-2 border dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg outline-none text-sm focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all" />
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">Tài khoản bảo mật</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">Email (Đổi email đăng nhập)</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Để trống nếu không đổi" className="w-full px-3 py-2 border dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg outline-none text-sm focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">Mật khẩu mới</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Để trống nếu không đổi" className="w-full px-3 py-2 border dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg outline-none text-sm focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all" />
                </div>
              </div>
            </div>
          </form>
        </div>
        
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-b-xl">
          <button form="profile-form" disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg shadow-blue-600/20">
            <Save className="w-4 h-4" /> {loading ? "Đang lưu..." : "Lưu Thay Đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}
