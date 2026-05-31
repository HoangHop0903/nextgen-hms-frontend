"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Users, UserPlus, FileText, CalendarCheck, Activity, TrendingUp, BarChart3, Clock, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts";

export function AdminStatsTab({ token }: { token: string }) {
  const [stats, setStats] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchRecentBookings();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRecentBookings = async () => {
    try {
      const res = await axios.get("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/bookings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Get the 5 most recent bookings for the activity feed
      const sorted = res.data.sort((a: any, b: any) => new Date(b.NgayKham).getTime() - new Date(a.NgayKham).getTime());
      setRecentBookings(sorted.slice(0, 5));
    } catch (e) {
      console.error("Lỗi lấy danh sách đặt lịch: ", e);
    }
  };

  if (!stats) return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
      <p className="font-medium">Đang tải dữ liệu tổng quan hệ thống...</p>
    </div>
  );

  const statCards = [
    { title: "Tổng số Bệnh Nhân", value: stats.total_patients, icon: <Users className="w-7 h-7 text-blue-500" />, bg: "bg-blue-50", trend: "+12.5%" },
    { title: "Số lượng Bác Sĩ", value: stats.total_doctors, icon: <Activity className="w-7 h-7 text-indigo-500" />, bg: "bg-indigo-50", trend: "+4.1%" },
    { title: "Số lượng Nhân Viên", value: stats.total_staffs, icon: <UserPlus className="w-7 h-7 text-emerald-500" />, bg: "bg-emerald-50", trend: "+2.4%" },
    { title: "Lịch đang chờ duyệt", value: stats.pending_bookings, icon: <CalendarCheck className="w-7 h-7 text-amber-500" />, bg: "bg-amber-50", trend: "Cần chú ý" },
  ];

  // Real data from backend
  const monthlyData = stats.monthly_data || [];
  const pieData = stats.pie_data || [];
  const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316'];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className={`${card.bg} dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-white/50 dark:border-slate-700`}>
                {card.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${card.trend.includes('+') ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                {card.trend}
              </span>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900 dark:text-white mb-1">{card.value}</p>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-500" /> Thống Kê Lượt Khám
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Biểu đồ tổng quan số lượt khám trong 7 tháng gần nhất</p>
            </div>
            <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm font-semibold px-3 py-1.5 outline-none text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <option>Năm 2026</option>
              <option>Năm 2025</option>
            </select>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', backgroundColor: 'var(--tooltip-bg, #fff)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="LượtKhám" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Info */}
        <div className="space-y-6">
          {/* Pie Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" /> Tỷ Lệ Chuyên Khoa
            </h3>
            <div className="h-[200px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-black text-slate-800 dark:text-white">1.2K</span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Tổng</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {pieData.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  {item.name}
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6 flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Clock className="w-5 h-5 text-rose-500" /> Hoạt Động Gần Đây
              </h3>
            </div>
            
            <div className="space-y-4 flex-1">
              {recentBookings.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">Chưa có lịch khám nào</p>
              ) : (
                recentBookings.map((b, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 flex items-center justify-center text-blue-500 z-10 group-hover:scale-110 transition-transform">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      {i !== recentBookings.length - 1 && <div className="w-px h-full bg-slate-100 dark:bg-slate-800 my-1"></div>}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {b.TenBenhNhan || 'Bệnh nhân'} <span className="font-normal text-slate-500 dark:text-slate-400">đặt lịch</span> {b.BacSi || 'Bác sĩ'}
                      </p>
                      <p className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 mt-1">{b.KhungGio ? `${b.KhungGio} (${b.CaKham})` : b.CaKham} - {new Date(b.NgayKham).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Ensure tooltip text is visible in dark mode via global CSS or inline styles if needed */}
      <style dangerouslySetInnerHTML={{__html: `
        .recharts-tooltip-wrapper {
          outline: none !important;
        }
        .dark .recharts-default-tooltip {
          background-color: #1e293b !important;
          border: 1px solid #334155 !important;
          color: #f8fafc !important;
        }
        .dark .recharts-tooltip-item {
          color: #f8fafc !important;
        }
      `}} />
    </div>
  );
}
