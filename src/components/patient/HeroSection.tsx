'use client';

import { Calendar, User, PhoneCall, CreditCard, ChevronRight, Activity, MapPin, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative w-full pt-8 pb-12 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-brand-primary-light/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-300/10 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center lg:items-start pt-6">
        
        {/* Left Content - Welcome & Appointment */}
        <div className="flex flex-col gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
             <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
               Chào buổi sáng, <br/><span className="text-brand-primary">Minh Ngô 👋</span>
             </h1>
             <p className="text-slate-500 font-medium mt-3 text-lg">Chúc bạn một ngày tràn đầy năng lượng và sức khỏe.</p>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.1 }}
             className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-brand-primary transition-colors cursor-pointer"
          >
             {/* Decorative element */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110" />

             <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold tracking-wide uppercase mb-3">
                     <span className="relative flex h-2 w-2">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                     </span>
                     Lịch sắp diễn ra
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Khám tái khám Ngoại Trú</h3>
                </div>
                <div className="bg-white border-2 border-slate-100 rounded-2xl p-2 text-center shadow-sm w-[72px]">
                   <span className="block text-xs font-bold text-red-500 uppercase">Tháng 4</span>
                   <span className="block text-2xl font-black text-slate-800 leading-none mt-1">20</span>
                </div>
             </div>

             <div className="space-y-4">
                <div className="flex items-center gap-4 text-slate-600">
                   <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center shrink-0">
                      <Calendar className="h-5 w-5 text-slate-400" />
                   </div>
                   <div>
                      <p className="font-bold text-slate-900">14:30 - Chờ 15 phút nữa</p>
                      <p className="text-sm font-medium">Bạn có thể check-in online ngay bây giờ</p>
                   </div>
                </div>
                
                <div className="flex items-center gap-4 text-slate-600">
                   <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center shrink-0">
                      <User className="h-5 w-5 text-slate-400" />
                   </div>
                   <div>
                      <p className="font-bold text-slate-900">PGS. TS. Trần Nga</p>
                      <p className="text-sm font-medium">Chuyên khoa Nội tiết - Mạch máu</p>
                   </div>
                </div>

                <div className="flex items-center gap-4 text-slate-600">
                   <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-slate-400" />
                   </div>
                   <div>
                      <p className="font-bold text-slate-900">Phòng 204 - Lầu 2</p>
                      <p className="text-sm font-medium">Tòa khu B, Điểm đón số 3</p>
                   </div>
                </div>
             </div>

             <div className="mt-8 pt-6 border-t border-slate-100 flex gap-3">
                <Link href="/telemed" className="flex-1">
                  <button className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center justify-center gap-2 transition-colors">
                     <PhoneCall className="h-4 w-4" /> Check-in Video
                  </button>
                </Link>
                <button className="w-12 h-12 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors">
                   <ChevronRight className="h-5 w-5" />
                </button>
             </div>
          </motion.div>
        </div>

        {/* Right Content - Membership Card & Stats */}
        <div className="flex flex-col gap-6 pt-4 lg:pt-0">
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.6, delay: 0.2 }}
             className="relative"
           >
              {/* Membership Card - Premium Glassmorphism */}
              <div className="relative w-full aspect-[1.58] rounded-4xl overflow-hidden p-8 flex flex-col justify-between text-white shadow-2xl transition-transform hover:scale-[1.02] duration-500" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
                 {/* Card Background Effects */}
                 <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary-light/30 rounded-full blur-[80px] mix-blend-screen" />
                 <div className="absolute bottom-[-20px] left-[-20px] w-48 h-48 bg-amber-400/20 rounded-full blur-[60px] mix-blend-screen" />
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
                 
                 <div className="relative z-10 flex justify-between items-start">
                    <div>
                       <h4 className="text-xl font-bold tracking-widest text-slate-100 flex items-center gap-2">NEXT<span className="text-brand-primary-light font-black">GEN</span></h4>
                       <p className="text-xs uppercase tracking-widest text-slate-400 mt-1 font-semibold">Thành Viên Hạng Sang</p>
                    </div>
                    <div className="px-3 py-1.5 bg-linear-to-r from-amber-200 to-yellow-500 rounded-lg shadow-sm">
                       <span className="text-xs font-black text-amber-900 tracking-wider flex items-center gap-1"><Sparkles className="h-3 w-3" /> DIAMOND</span>
                    </div>
                 </div>

                 <div className="relative z-10">
                    <div className="font-mono text-lg tracking-widest text-slate-300 mb-2 font-medium">9989 • 2026 • 1508</div>
                    <div className="flex justify-between items-end">
                       <div>
                          <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1 font-semibold">Tên Chủ Thẻ</p>
                          <h2 className="text-2xl font-black tracking-widest uppercase">Ngô Nhật Minh</h2>
                       </div>
                       <CreditCard className="h-8 w-8 text-slate-400/50" />
                    </div>
                 </div>
              </div>
           </motion.div>

           {/* Small Health Status Card */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.3 }}
             className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 flex items-center justify-between shadow-sm cursor-pointer hover:bg-emerald-100/50 transition-colors"
           >
              <div className="flex items-center gap-4">
                 <div className="h-12 w-12 bg-white rounded-full shadow-sm flex items-center justify-center border border-emerald-100">
                    <Activity className="h-6 w-6 text-emerald-500" />
                 </div>
                 <div>
                    <h4 className="font-bold text-emerald-900">Sức Khỏe Kép Hoàn Hảo</h4>
                    <p className="text-sm font-medium text-emerald-700 mt-0.5">Các chỉ số sinh tồn của bạn rất ổn định.</p>
                 </div>
              </div>
              <ChevronRight className="h-5 w-5 text-emerald-400" />
           </motion.div>
        </div>
        
      </div>
    </section>
  );
}
