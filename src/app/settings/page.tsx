'use client';

import { User, Bell, Shield, Key, Smartphone, LogOut, ChevronRight } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="w-full max-w-5xl mx-auto py-10 px-4 md:px-8 bg-[#f4f7f6] min-h-[calc(100vh-80px)]">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Cài Đặt</h1>
        <p className="text-slate-500 font-medium mt-1">Quản lý hồ sơ cá nhân và tùy chọn bảo mật.</p>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        {/* Left Nav */}
        <div className="md:col-span-4">
           <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-2 sticky top-28">
              <button className="w-full flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-brand-primary font-bold transition-colors">
                 <User className="h-5 w-5" /> Hồ Sơ Cá Nhân
              </button>
              <button className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-slate-50 text-slate-600 font-semibold transition-colors">
                 <Bell className="h-5 w-5 text-slate-400" /> Thông Báo
              </button>
              <button className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-slate-50 text-slate-600 font-semibold transition-colors">
                 <Shield className="h-5 w-5 text-slate-400" /> Quyền Riêng Tư
              </button>
              <button className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-slate-50 text-slate-600 font-semibold transition-colors">
                 <Key className="h-5 w-5 text-slate-400" /> Đổi Mật Khẩu
              </button>
              
              <div className="h-px bg-slate-100 my-4 mx-2"></div>
              
              <button className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-red-50 text-red-500 font-bold transition-colors group">
                 <LogOut className="h-5 w-5 text-red-400 group-hover:text-red-500" /> Đăng Xuất
              </button>
           </div>
        </div>

        {/* Right Content */}
        <div className="md:col-span-8 flex flex-col gap-6">
           <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
              <div className="flex items-center gap-6 mb-8">
                 <div className="h-24 w-24 rounded-full bg-brand-primary-light/10 border-4 border-white shadow-md flex items-center justify-center relative">
                    <User className="h-10 w-10 text-brand-primary" />
                    <button className="absolute bottom-0 right-0 bg-slate-900 border-2 border-white rounded-full p-2 hover:bg-slate-800 transition-colors">
                       <Smartphone className="h-3 w-3 text-white" />
                    </button>
                 </div>
                 <div>
                    <h2 className="text-2xl font-bold text-slate-800">Minh Ngô</h2>
                    <p className="text-slate-500 font-medium">Bệnh nhân nội trú • Khách hàng VIP</p>
                 </div>
              </div>

              <div className="space-y-6">
                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Họ và Tên</label>
                    <input type="text" defaultValue="Ngô Nhật Minh" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-800 outline-none focus:border-brand-primary transition-colors" />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div>
                       <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Số Điện Thoại</label>
                       <input type="text" defaultValue="0988 123 456" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-800 outline-none focus:border-brand-primary transition-colors" />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ngày Sinh</label>
                       <input type="text" defaultValue="15/08/1995" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-800 outline-none focus:border-brand-primary transition-colors" />
                    </div>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Địa Chỉ Email</label>
                    <input type="email" defaultValue="minh.ngo@example.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-800 outline-none focus:border-brand-primary transition-colors" />
                 </div>
              </div>

               <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                  <button className="bg-brand-primary hover:bg-[#11b09b] text-white font-bold py-3 px-8 rounded-xl shadow-sm transition-colors">
                     Lưu Thay Đổi
                  </button>
               </div>
           </div>

           <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 text-white">
              <h3 className="font-bold text-lg mb-2">Liên kết thiết bị IoT</h3>
              <p className="text-slate-400 text-sm font-medium mb-6">Đồng bộ Apple Health hoặc Garmin Connect để hệ thống tự động theo dõi nhịp tim 24/7.</p>
              
              <button className="w-full flex items-center justify-between bg-slate-800 hover:bg-slate-700 border border-slate-700 p-4 rounded-2xl transition-colors">
                 <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-emerald-400" />
                    <span className="font-bold">Apple Watch (Đã kết nối)</span>
                 </div>
                 <ChevronRight className="h-5 w-5 text-slate-500" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
