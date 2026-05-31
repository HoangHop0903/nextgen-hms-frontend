"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Tag, CheckCircle2, ShieldCheck } from "lucide-react";

export function ServicePricingTab({ token }: { token: string }) {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/patient/services", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setServices(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [token]);

  // Group services by specialty
  const groupedServices = services.reduce((acc, svc) => {
    if (!acc[svc.TenChuyenKhoa]) acc[svc.TenChuyenKhoa] = [];
    acc[svc.TenChuyenKhoa].push(svc);
    return acc;
  }, {});

  const filteredSpecialties = Object.keys(groupedServices).filter(spec => {
    return (
      spec.toLowerCase().includes(search.toLowerCase()) ||
      groupedServices[spec].some((svc: any) => svc.TenDichVu.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-4 flex items-center justify-center gap-3">
          <ShieldCheck className="w-8 h-8 text-cyan-500" /> Bảng Giá Dịch Vụ Khám
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          NextGen Care cam kết minh bạch về giá cả dịch vụ y tế. Tất cả các mức giá dưới đây đều là giá niêm yết chính thức áp dụng tại hệ thống của chúng tôi.
        </p>
      </div>
      
      <div className="relative max-w-lg mx-auto mb-10">
        <input 
          type="text" 
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm kiếm dịch vụ, chuyên khoa..." 
          className="w-full pl-10 pr-4 py-3 rounded-full border-2 border-slate-200 dark:border-slate-700 outline-none focus:border-cyan-400 dark:focus:border-cyan-500 focus:shadow-md transition-all text-slate-700 dark:text-slate-100 bg-white dark:bg-slate-900"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">Đang tải bảng giá...</div>
      ) : (
        <div className="space-y-8">
          {filteredSpecialties.map(spec => (
            <div key={spec} className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-cyan-800 dark:text-cyan-400 mb-6 flex items-center gap-2 border-b border-cyan-100 dark:border-cyan-900/30 pb-3">
                <Tag className="w-5 h-5 text-cyan-500" /> Chuyên khoa {spec}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupedServices[spec]
                  .filter((svc: any) => svc.TenDichVu.toLowerCase().includes(search.toLowerCase()) || spec.toLowerCase().includes(search.toLowerCase()))
                  .map((svc: any) => (
                  <div key={svc.MaBangGia} className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between hover:shadow-md dark:hover:shadow-cyan-900/20 transition-shadow group">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{svc.TenDichVu}</h4>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Mã DV: {svc.MaBangGia}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <span className="text-lg font-extrabold text-amber-500 dark:text-amber-400">
                        {svc.GiaKham.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {filteredSpecialties.length === 0 && (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-900/50 rounded-xl">
              Không tìm thấy dịch vụ nào phù hợp với từ khoá "{search}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
