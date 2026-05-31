"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookingApprovalTab } from "@/components/staff/BookingApprovalTab";
import { ReceptionTab } from "@/components/staff/ReceptionTab";
import { StaffSupportTab } from "@/components/staff/StaffSupportTab";
import { Settings } from "lucide-react";
import { UpdateProfileModal } from "@/components/shared/UpdateProfileModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import axios from "axios";

export default function StaffDashboard() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [activeTab, setActiveTab] = useState("approval");
  const [staffInfo, setStaffInfo] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const storedToken = localStorage.getItem("token");
    const normalizedRole = role
        ? role.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, "")
        : "";
        
    if (!normalizedRole.includes("nhanvien")) {
      router.push("/login");
      return;
    }
    
    if (storedToken) {
      setToken(storedToken);
      fetchStaffInfo(storedToken);
    }
  }, [router]);

  const fetchStaffInfo = async (t: string) => {
    try {
      const res = await axios.get("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/staff/me", {
        headers: { Authorization: `Bearer ${t}` }
      });
      setStaffInfo(res.data);
    } catch (e) {
      console.error("Lỗi lấy thông tin", e);
    }
  };

  if (!token) return <div className="p-8 text-center">Đang kiểm tra đăng nhập...</div>;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {showProfile && <UpdateProfileModal token={token} initialData={staffInfo} onClose={() => setShowProfile(false)} />}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xl overflow-hidden shadow-inner">
            {staffInfo?.AnhDaiDien ? (
              <img src={staffInfo.AnhDaiDien} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              staffInfo?.HoTen ? staffInfo.HoTen.charAt(0) : "N"
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Cổng Thông Tin Nhân Viên</h1>
            {staffInfo && (
              <p className="text-slate-500 dark:text-slate-400">Xin chào, <span className="font-bold text-emerald-600 dark:text-emerald-400">{staffInfo.HoTen}</span> ({staffInfo.ChucVu || "Lễ tân"})</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
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
          onClick={() => setActiveTab("approval")}
          className={`px-6 py-3 font-semibold text-sm whitespace-nowrap transition-colors border-b-2 ${activeTab === 'approval' ? 'border-amber-500 text-amber-600 dark:text-amber-500' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          Duyệt Lịch Khám
        </button>
        <button 
          onClick={() => setActiveTab("reception")}
          className={`px-6 py-3 font-semibold text-sm whitespace-nowrap transition-colors border-b-2 ${activeTab === 'reception' ? 'border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          Tiếp Nhận Bệnh Nhân
        </button>
        <button 
          onClick={() => setActiveTab("support")}
          className={`px-6 py-3 font-semibold text-sm whitespace-nowrap transition-colors border-b-2 ${activeTab === 'support' ? 'border-emerald-600 dark:border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          Hỗ Trợ & CSKH
        </button>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === "approval" && <BookingApprovalTab token={token} />}
        {activeTab === "reception" && <ReceptionTab token={token} />}
        {activeTab === "support" && <StaffSupportTab token={token} />}
      </div>
    </div>
  );
}
