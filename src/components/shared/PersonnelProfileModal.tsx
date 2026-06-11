"use client";

import { X, Phone, User, Award, Stethoscope, Briefcase, Mail, MapPin } from "lucide-react";

export function PersonnelProfileModal({ person, type, onClose }: { person: any, type: "doctor" | "staff", onClose: () => void }) {
  if (!person) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative" onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md">
                <X className="w-5 h-5" />
            </button>
            
            {/* Header/Banner Image */}
            <div className="h-48 bg-gradient-to-r from-blue-600 to-cyan-500 relative">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            </div>
            
            <div className="px-8 pb-8 pt-0 relative">
                {/* Avatar */}
                <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 overflow-hidden bg-white -mt-16 relative shadow-lg mx-auto md:mx-0">
                    <img src={person.AnhDaiDien || `https://i.pravatar.cc/150?u=${person.MaBacSi || person.MaNhanVien}`} alt={person.HoTen} className="w-full h-full object-cover" />
                </div>
                
                {/* Info block */}
                <div className="mt-4 text-center md:text-left">
                    <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white flex items-center justify-center md:justify-start gap-2">
                        {type === "doctor" ? `${person.HocVi || "BS"}. ${person.HoTen}` : person.HoTen}
                        {type === "doctor" && <div className="bg-blue-100 text-blue-600 p-1 rounded-full"><Award className="w-4 h-4"/></div>}
                    </h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400 font-medium mt-1">
                        {type === "doctor" ? `Chuyên khoa: ${person.TenChuyenKhoa || 'Đa khoa'}` : `Chức vụ: ${person.ChucVu || 'Nhân viên'}`}
                    </p>
                </div>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl flex items-center gap-4 border border-slate-100 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center"><Phone className="w-5 h-5"/></div>
                        <div>
                           <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Số điện thoại</p>
                           <p className="text-slate-800 dark:text-slate-200 font-medium">{person.SDT || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl flex items-center gap-4 border border-slate-100 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                            {type === "doctor" ? <Stethoscope className="w-5 h-5"/> : <Briefcase className="w-5 h-5"/>}
                        </div>
                        <div>
                           <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{type === "doctor" ? "Mã Bác sĩ" : "Mã Nhân viên"}</p>
                           <p className="text-slate-800 dark:text-slate-200 font-medium">{person.MaBacSi || person.MaNhanVien}</p>
                        </div>
                    </div>
                </div>
                
                <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-6">
                    <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2"><User className="w-5 h-5 text-blue-500"/> Giới thiệu sơ lược</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                        {type === "doctor" 
                          ? `Bác sĩ ${person.HoTen} là một chuyên gia tận tâm tại khoa ${person.TenChuyenKhoa || 'khám bệnh'}. Với kinh nghiệm lâm sàng phong phú, bác sĩ luôn đặt sức khỏe và sự an toàn của bệnh nhân lên hàng đầu.` 
                          : `${person.HoTen} đảm nhận vai trò ${person.ChucVu || 'nhân viên'} tại NextGen HMS, đóng góp quan trọng vào quy trình vận hành và mang lại trải nghiệm tốt nhất cho người bệnh.`}
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
}
