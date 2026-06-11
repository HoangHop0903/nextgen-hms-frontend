"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminStatsTab } from "@/components/admin/AdminStatsTab";
import { AdminAccountsTab } from "@/components/admin/AdminAccountsTab";
import { AdminFacilitiesTab } from "@/components/admin/AdminFacilitiesTab";
import { AdminPharmacyTab } from "@/components/admin/AdminPharmacyTab";
import { AdminScheduleTab } from "@/components/admin/AdminScheduleTab";
import { AdminPersonnelTab } from "@/components/admin/AdminPersonnelTab";
import { AdminPatientsTab } from "@/components/admin/AdminPatientsTab";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LayoutDashboard, Users, LogOut, Settings, Hospital, Pill, CalendarDays, Contact, HeartPulse } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [activeTab, setActiveTab] = useState("stats");

  useEffect(() => {
    const role = localStorage.getItem("role");
    const storedToken = localStorage.getItem("token");
    const normalizedRole = role
        ? role.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, "")
        : "";
        
    if (!normalizedRole.includes("admin") && !normalizedRole.includes("quantri")) {
      router.push("/login");
      return;
    }
    
    if (storedToken) {
      setToken(storedToken);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  if (!token) return <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium">Đang xác thực quyền Quản trị viên...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 dark:bg-slate-950 border-r dark:border-slate-800 text-slate-300 flex flex-col fixed left-0 top-0 h-full shadow-xl z-40 transition-colors duration-300">
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 text-white mb-2">
            <div className="bg-indigo-500 p-2 rounded-lg">
              <Settings className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold">Admin Portal</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider ml-11">NextGen HMS</p>
        </div>
        
        <div className="mt-8 px-4 flex-1 min-h-0 space-y-2 overflow-y-auto hide-scrollbar">
          <button 
            onClick={() => setActiveTab("stats")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'stats' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5" /> Tổng quan
          </button>
          <button 
            onClick={() => setActiveTab("accounts")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'accounts' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <Users className="w-5 h-5" /> Quản lý Tài khoản
          </button>
          <button 
            onClick={() => setActiveTab("facilities")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'facilities' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <Hospital className="w-5 h-5" /> Cơ sở vật chất
          </button>
          <button 
            onClick={() => setActiveTab("pharmacy")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'pharmacy' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <Pill className="w-5 h-5" /> Dược & Dịch vụ
          </button>
          <button 
            onClick={() => setActiveTab("schedule")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'schedule' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <CalendarDays className="w-5 h-5" /> Phân công Lịch
          </button>
          <button 
            onClick={() => setActiveTab("personnel")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'personnel' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <Contact className="w-5 h-5" /> Quản lý Nhân sự
          </button>
          <button 
            onClick={() => setActiveTab("patients")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'patients' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <HeartPulse className="w-5 h-5" /> Quản lý Bệnh nhân
          </button>
        </div>
        
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-rose-400 hover:bg-slate-800 hover:text-rose-300 rounded-xl transition-colors">
            <LogOut className="w-5 h-5" /> Đăng xuất
          </button>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}} />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white transition-colors duration-300">
              {activeTab === 'stats' ? 'Bảng Điều Khiển' : 'Quản Lý Hệ Thống'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-300">
              {activeTab === 'stats' ? 'Theo dõi các chỉ số và hoạt động của phòng khám' : 'Kiểm soát quyền truy cập và thông tin tài khoản'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === "stats" && <AdminStatsTab token={token} />}
          {activeTab === "accounts" && <AdminAccountsTab token={token} />}
          {activeTab === "facilities" && <AdminFacilitiesTab token={token} />}
          {activeTab === "pharmacy" && <AdminPharmacyTab token={token} />}
          {activeTab === "schedule" && <AdminScheduleTab token={token} />}
          {activeTab === "personnel" && <AdminPersonnelTab token={token} />}
          {activeTab === "patients" && <AdminPatientsTab token={token} />}
        </div>
      </div>
    </div>
  );
}
