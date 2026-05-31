"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DoctorScheduleTab } from "@/components/doctor/DoctorScheduleTab";
import { ConsultationTab } from "@/components/doctor/ConsultationTab";
import { Settings } from "lucide-react";
import { UpdateProfileModal } from "@/components/shared/UpdateProfileModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import axios from "axios";

export default function DoctorDashboard() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [activeTab, setActiveTab] = useState("schedule");
  const [doctorInfo, setDoctorInfo] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const storedToken = localStorage.getItem("token");
    const normalizedRole = role
        ? role.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, "")
        : "";
        
    if (!normalizedRole.includes("bacsi")) {
      router.push("/login");
      return;
    }
    
    if (storedToken) {
      setToken(storedToken);
      fetchDoctorInfo(storedToken);
    }
  }, [router]);

  const fetchDoctorInfo = async (t: string) => {
    try {
      const res = await axios.get("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/doctor/me", {
        headers: { Authorization: `Bearer ${t}` }
      });
      setDoctorInfo(res.data);
    } catch (e) {
      console.error("Lỗi lấy thông tin", e);
    }
  };

  if (!token) return <div className="p-8 text-center">Đang kiểm tra đăng nhập...</div>;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {showProfile && <UpdateProfileModal token={token} initialData={doctorInfo} onClose={() => setShowProfile(false)} />}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl overflow-hidden shadow-inner">
            {doctorInfo?.AnhDaiDien ? (
              <img src={doctorInfo.AnhDaiDien} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              doctorInfo?.HoTen ? doctorInfo.HoTen.charAt(0) : "B"
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Cổng Thông Tin Bác Sĩ</h1>
            {doctorInfo && (
              <p className="text-slate-500 dark:text-slate-400">Xin chào, <span className="font-bold text-blue-600 dark:text-blue-400">{doctorInfo.HocVi} {doctorInfo.HoTen}</span></p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border-r border-slate-200 dark:border-slate-700 pr-4">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <button 
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            <Settings className="w-5 h-5" /> Sửa Hồ Sơ
          </button>
        </div>
      </div>

      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto hide-scrollbar">
        <button 
          onClick={() => setActiveTab("schedule")}
          className={`px-6 py-3 font-semibold text-sm whitespace-nowrap transition-colors border-b-2 ${activeTab === 'schedule' ? 'border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          Lịch Khám Hôm Nay
        </button>
        <button 
          onClick={() => setActiveTab("consultation")}
          className={`px-6 py-3 font-semibold text-sm whitespace-nowrap transition-colors border-b-2 ${activeTab === 'consultation' ? 'border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          Khám & Kê Đơn
        </button>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === "schedule" && <DoctorScheduleTab token={token} />}
        {activeTab === "consultation" && <ConsultationTab token={token} />}
      </div>
    </div>
  );
}
