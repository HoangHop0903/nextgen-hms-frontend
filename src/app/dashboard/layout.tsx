'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Home, Calendar, FileText, UserCircle } from 'lucide-react';
import axios from 'axios';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    axios.get('http://localhost:8888/api/v1/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setUser(res.data.data);
      setLoading(false);
    })
    .catch(() => {
      localStorage.removeItem('token');
      router.push('/');
    });
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div></div>;
  }

  const navs = [
    { name: 'Home', icon: Home, active: true },
    { name: 'Visits', icon: Calendar, active: false },
    { name: 'Records', icon: FileText, active: false },
    { name: 'Profile', icon: UserCircle, active: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-white shadow-sm px-6 py-4 flex justify-between items-center z-10">
        <h1 className="font-bold text-lg text-emerald-700">MyHealth</h1>
        <button onClick={() => { localStorage.removeItem('token'); router.push('/'); }} className="text-slate-400 hover:text-red-500">
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Sidebar (Desktop) / Bottom Nav (Mobile) */}
      <nav className="fixed bottom-0 w-full md:relative md:w-64 bg-white border-t md:border-t-0 md:border-r border-slate-200 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:shadow-none">
        <div className="hidden md:flex p-6 border-b border-slate-100 flex-col">
          <h2 className="text-2xl font-bold text-emerald-600">MyHealth</h2>
          <p className="text-xs text-slate-400 uppercase mt-1 tracking-wider">Patient Portal</p>
        </div>
        
        <div className="flex md:flex-col justify-around md:justify-start md:mt-6 p-2 md:p-4 gap-1">
          {navs.map((nav, i) => (
            <div key={i} className={`flex flex-col md:flex-row items-center md:px-4 py-3 rounded-xl cursor-pointer transition-all ${nav.active ? 'text-emerald-600 md:bg-emerald-50' : 'text-slate-400 hover:text-emerald-500 hover:bg-slate-50'}`}>
              <nav.icon className="w-6 h-6 md:w-5 md:h-5 md:mr-3 mb-1 md:mb-0" />
              <span className="text-[10px] md:text-sm font-semibold">{nav.name}</span>
            </div>
          ))}
          
          <div className="hidden md:flex flex-row items-center px-4 py-3 mt-auto mb-4 rounded-xl cursor-pointer text-red-500 hover:bg-red-50 transition-all absolute bottom-4 w-[85%]" onClick={() => { localStorage.removeItem('token'); router.push('/'); }}>
             <LogOut className="w-5 h-5 mr-3" />
             <span className="text-sm font-semibold">Sign Out</span>
          </div>
        </div>
      </nav>

      {/* Main Area */}
      <main className="flex-1 pb-24 md:pb-0 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
