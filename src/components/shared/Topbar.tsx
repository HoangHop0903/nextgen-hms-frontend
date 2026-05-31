'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeartPulse, Bell, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export function Topbar() {
  const [role, setRole] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    if (savedRole) {
      setRole(savedRole);
    }
    
    if (token) {
      axios.get("http://localhost:8000/api/v1/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        if (res.data && res.data.HoTen) {
          setUserName(res.data.HoTen);
        }
      }).catch(err => console.error("Error fetching user info:", err));
    }
  }, []);

  return (
    <header className="h-20 w-full bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-30 transition-colors">
      
      {/* Brand */}
      <Link href="/" className="flex items-center gap-2">
        <HeartPulse className="h-6 w-6 text-brand-primary dark:text-cyan-400" />
        <span className="font-extrabold text-xl text-brand-primary dark:text-cyan-400 tracking-tight">NextGen <span className="text-slate-700 dark:text-slate-300">HMS</span></span>
      </Link>
      
      {/* Center Nav Layout - Hidden to simplify */}
      <nav className="hidden lg:flex items-center gap-10">
      </nav>
      
      {/* Right User Actions */}
      <div className="flex items-center gap-5">
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
        
        <div className="flex items-center gap-3 cursor-pointer group">
           <div className="flex flex-col items-end">
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-none">{userName || "Tài khoản"}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-1">{role || "Khách"}</span>
           </div>
           <div className="h-10 w-10 rounded-full bg-brand-primary-light/20 dark:bg-cyan-900/30 flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm group-hover:border-brand-primary dark:group-hover:border-cyan-400 transition-colors">
             <User className="w-5 h-5 text-brand-primary dark:text-cyan-400" />
           </div>
        </div>
      </div>
    </header>
  );
}
