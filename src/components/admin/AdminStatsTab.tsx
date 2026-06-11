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

  async function fetchStats() {
    try {
      const res = await axios.get("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  async function fetchRecentBookings() {
    try {
      const res = await axios.get("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/admin/bookings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Get the 10 most recent bookings for the activity feed
      const sorted = res.data.sort((a: any, b: any) => new Date(b.NgayKham).getTime() - new Date(a.NgayKham).getTime());
      setRecentBookings(sorted.slice(0, 10));
    } catch (e) {
      console.error("Lỗi lấy danh sách đặt lịch: ", e);
    }
  };

  if (!stats) return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
      <p className="font-medium">Đang tải dữ liệu tổng quan...</p>
    </div>
  );

  const statCards = [
    { title: "Bệnh Nhân", value: stats.total_patients, icon: <Users className="w-5 h-5 text-blue-600" /> },
    { title: "Bác Sĩ", value: stats.total_doctors, icon: <Activity className="w-5 h-5 text-indigo-600" /> },
    { title: "Nhân Viên", value: stats.total_staffs, icon: <UserPlus className="w-5 h-5 text-emerald-600" /> },
    { title: "Chờ Duyệt", value: stats.pending_bookings, icon: <CalendarCheck className="w-5 h-5 text-amber-600" /> },
  ];

  // Real data from backend
  const monthlyData: any[] = stats.monthly_data || [];
  const pieData: any[] = stats.pie_data || [];
  const COLORS = ['#4f46e5', '#2563eb', '#059669', '#d97706', '#7c3aed', '#db2777', '#e11d48', '#ea580c'];

  return (
    <div className="space-y-6 max-w-full">
      {/* Top Section: Main Activity Feed & Secondary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Central Activity Feed */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col rounded-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Hoạt động hệ thống
            </h3>
            <span className="text-xs font-semibold px-2 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-sm">Cập nhật trực tiếp</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 uppercase text-[11px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-semibold">Thời gian</th>
                  <th className="px-4 py-3 font-semibold">Hoạt động</th>
                  <th className="px-4 py-3 font-semibold">Chi tiết</th>
                  <th className="px-4 py-3 font-semibold text-right">Mã</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">Chưa có dữ liệu hoạt động</td>
                  </tr>
                ) : (
                  recentBookings.map((b, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                        {new Date(b.NgayKham).toLocaleDateString('vi-VN')} {b.KhungGio && ` - ${b.KhungGio}`}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm text-[11px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                          <CalendarCheck className="w-3 h-3" />
                          Đặt Lịch Khám
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                        <span className="font-semibold">{b.TenBenhNhan || 'Bệnh nhân'}</span> đăng ký khám với BS <span className="font-semibold">{b.BacSi || 'Không rõ'}</span>
                      </td>
                      <td className="px-4 py-3 text-right text-xs font-mono text-slate-400">{b.MaDatLich || `#${i+1}`}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Mini Stats & Pie Chart */}
        <div className="flex flex-col gap-6">
          {/* Compact Stat Cards */}
          <div className="grid grid-cols-2 gap-4">
            {statCards.map((card, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-sm shadow-sm flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-sm border border-slate-100 dark:border-slate-700">
                    {card.icon}
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-800 dark:text-slate-100 leading-none">{card.value}</p>
                  <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{card.title}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pie Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex-1 rounded-sm flex flex-col">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Tỷ Lệ Đặt Khám Theo Khoa
            </h3>
            <div className="h-[180px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '2px', border: '1px solid #e2e8f0', boxShadow: 'none' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-xl font-black text-slate-800 dark:text-white">{stats.total_bookings || pieData.reduce((acc, curr) => acc + curr.value, 0)}</span>
                <span className="text-[9px] uppercase font-bold text-slate-400">Lượt khám</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-y-2 gap-x-1 mt-4">
              {pieData.map((item, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-400 truncate">
                  <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Main Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-5 rounded-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Thống Kê Lượt Khám (7 Tháng Gần Nhất)
            </h3>
          </div>
        </div>
        
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 600}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 600}} />
              <Tooltip 
                contentStyle={{ borderRadius: '2px', border: '1px solid #e2e8f0', boxShadow: 'none', backgroundColor: 'var(--tooltip-bg, #fff)' }}
                itemStyle={{ fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="LượtKhám" stroke="#4f46e5" strokeWidth={2} fillOpacity={0.1} fill="#4f46e5" activeDot={{ r: 6, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Ensure tooltip text is visible in dark mode via global CSS or inline styles if needed */}
      <style dangerouslySetInnerHTML={{__html: `
        .recharts-tooltip-wrapper {
          outline: none !important;
        }
        .dark .recharts-default-tooltip {
          background-color: #0f172a !important;
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
