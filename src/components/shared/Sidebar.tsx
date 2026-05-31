'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { HeartPulse, Home, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [roleUrl, setRoleUrl] = useState("/");

  useEffect(() => {
    const role = localStorage.getItem("role");
    const normalizedRole = role
      ? role.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, "")
      : "";

    if (normalizedRole === "benhnhan") setRoleUrl("/patient");
    else if (normalizedRole === "bacsi") setRoleUrl("/doctor");
    else if (normalizedRole === "nhanvien") setRoleUrl("/staff");
  }, []);

  const links = [
    { href: roleUrl, label: 'Trang chủ', icon: <Home className="h-6 w-6 mb-1" /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <aside className="w-24 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col items-center py-6 fixed left-0 top-0 z-40 shrink-0 transition-colors">
      <Link href={roleUrl} className="mb-10 text-brand-primary">
        <div className="h-12 w-12 rounded-full bg-brand-primary-light/10 flex items-center justify-center">
           <HeartPulse className="h-7 w-7" />
        </div>
      </Link>
      
      <nav className="flex flex-col gap-4 w-full h-full overflow-y-auto hide-scrollbar">
        {links.map((link) => {
          const isActive = pathname === link.href;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex flex-col items-center justify-center w-full py-4 transition-colors group
                ${isActive ? 'text-brand-primary dark:text-cyan-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}
              `}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-brand-primary rounded-r-md" />
              )}
              {isActive && (
                 <div className="absolute inset-0 bg-brand-primary/5 border-l-4 border-brand-primary" />
              )}
              <div className="relative z-10 flex flex-col items-center">
                 {link.icon}
                 <span className="text-[10px] font-bold text-center tracking-wide">{link.label}</span>
              </div>
            </Link>
          );
        })}
        
        <div className="mt-auto w-full px-4">
           <button onClick={handleLogout} className="flex flex-col items-center justify-center w-full py-4 text-slate-400 hover:text-rose-500 transition-colors">
              <LogOut className="h-6 w-6 mb-1" />
           </button>
        </div>
      </nav>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </aside>
  );
}
