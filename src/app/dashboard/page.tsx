'use client';

import { Award, Clock, FileWarning, HeartPulse, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export default function DashboardPage() {
    const user_id = typeof window !== 'undefined' ? localStorage.getItem('hms-patient-id') : null;

    const { data: profileData, isLoading: isLoadingProfile } = useQuery<any>({
        queryKey: ['my-profile', user_id],
        queryFn: async () => {
            if (!user_id) return null;
            const res = await apiClient.get(`/auth/me/${user_id}`);
            return res.data;
        },
        enabled: !!user_id
    });

    const patient_id = profileData?.profile?.id;

    // 1. Fetch Danh sách cuộc hẹn (Appointments) từ API
    const { data: appointments = [], isLoading: isLoadingAppointments } = useQuery<any[]>({
        queryKey: ['my-appointments', patient_id],
        queryFn: async () => {
            if (!patient_id) return [];
            const res = await apiClient.get(`/patients/appointments/all?patient_id=${patient_id}`);
            return res.data;
        },
        enabled: !!patient_id
    });

    const userProfile = profileData?.profile || { full_name: "Bệnh Nhân Demo" };
    const loyalty = profileData?.loyalty || { tier: 'STANDARD', points: 0 };
    const isVip = loyalty.tier; // e.g. "PLATINUM"

    // Filter next appointments (PENDING/IN_PROGRESS)
    const upcomingSchedule = appointments.filter(app => app.status === 'PENDING' || app.status === 'IN_PROGRESS');
    // Filter completed
    const pastAppointments = appointments.filter(app => app.status === 'COMPLETED');

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto p-4 md:p-8">
            {/* Header Greeting */}
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Xin Chào, {userProfile?.full_name || 'Guest'}</h1>
                <p className="text-slate-500 mt-1">Đây là tổng quan sức khỏe và lịch trình của bạn hôm nay. Bảng dữ liệu này đang tải Load Live từ Database!</p>
            </div>

            {/* Loyalty Card Engine */}
            <div className={`relative overflow-hidden rounded-3xl p-8 shadow-xl transition-all duration-500 ${
                isVip === 'PLATINUM' 
                ? 'bg-linear-to-br from-slate-900 via-slate-800 to-black text-white shadow-blue-500/20' 
                : 'bg-white border border-slate-200 text-slate-800'
            }`}>
               {isVip === 'PLATINUM' && (
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-screen filter blur-[80px] opacity-40 animate-pulse"></div>
               )}
               
               <div className="relative z-10 flex justify-between items-start">
                   <div>
                       <p className={`text-sm font-semibold uppercase tracking-widest ${isVip === 'PLATINUM' ? 'text-blue-400' : 'text-emerald-600'}`}>
                           Thẻ Bệnh Nhân NEXTGEN
                       </p>
                       <h2 className="text-4xl font-bold mt-2 font-mono drop-shadow-sm">
                           {isVip || "STANDARD"}
                       </h2>
                       <p className={`mt-4 flex items-center ${isVip === 'PLATINUM' ? 'text-slate-300' : 'text-slate-500'}`}>
                           <Award className="w-5 h-5 mr-2" />
                           {loyalty.points} Điểm thưởng
                       </p>
                   </div>
                   
                   <div className="hidden sm:block text-right">
                       <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-slate-100 border border-slate-200">
                           <HeartPulse className="h-8 w-8 text-brand-primary" />
                       </div>
                   </div>
               </div>
            </div>

            {/* Timetable / DB Load */}
            <h3 className="text-xl font-bold text-slate-800 mt-10 mb-4 border-b pb-2">Lịch Khám Ngắn Hạn Đang Chờ</h3>
            
            {isLoadingAppointments ? (
               <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                  <RefreshCw className="h-8 w-8 animate-spin mb-4" />
                  <p>Đang đồng bộ dữ liệu từ bệnh viện...</p>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {upcomingSchedule.length === 0 && (
                      <div className="col-span-2 p-6 bg-slate-50 border border-slate-200 border-dashed rounded-xl text-center text-slate-500">
                         Hiện tại bạn không có lịch hẹn tiếp theo.
                      </div>
                   )}
                   {upcomingSchedule.map((app) => (
                      <div key={app.id} className="bg-white p-6 rounded-2xl border border-blue-200 flex items-start shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
                              <Clock className="w-6 h-6 text-blue-500" />
                          </div>
                          <div className="ml-4 flex-1">
                              <h4 className="font-bold text-slate-800">Lịch Khám Tại Viện</h4>
                              <p className="text-sm text-slate-500 mt-1">Ngày: {app.appointment_date}</p>
                              <div className="mt-2 flex items-center gap-2">
                                 <span className="text-xs font-bold text-blue-700 bg-blue-100 uppercase tracking-widest inline-block px-2 py-1 rounded-md">{app.status}</span>
                                 <span className="text-xs text-slate-400 italic">#{app.id.slice(0,8)}</span>
                              </div>
                          </div>
                      </div>
                   ))}
               </div>
            )}
            
            <h3 className="text-xl font-bold text-slate-800 mt-10 mb-4 border-b pb-2">Kết Quả Mới Gần Đây</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {pastAppointments.slice(0,2).map(app => (
                    <div key={app.id} className="bg-white p-6 rounded-2xl border border-slate-200 flex items-start shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 shrink-0">
                            <FileWarning className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div className="ml-4">
                            <h4 className="font-bold text-slate-800">Hồ sơ khám đã hoàn tất</h4>
                            <p className="text-sm text-slate-500 mt-1">Ngày hoàn tất: {app.appointment_date}</p>
                            <p className="text-xs font-medium text-emerald-600 bg-emerald-50 inline-block px-2 py-1 rounded-md mt-2">Đã nạp vào EMR</p>
                        </div>
                    </div>
                 ))}
                 {!isLoadingAppointments && pastAppointments.length === 0 && (
                    <div className="col-span-2 p-6 text-slate-500 italic">Chưa có kết quả khám gần đây.</div>
                 )}
            </div>
        </div>
    );
}
