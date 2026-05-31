"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Users, Save, CheckCircle2 } from "lucide-react";

export function PatientFamilyTab({ token }: { token: string }) {
  const [family, setFamily] = useState({
    HoTen: "",
    SDT: "",
    CCCD: "",
    QuanHe: "",
    DiaChi: ""
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFamily();
  }, []);

  const fetchFamily = async () => {
    try {
      const res = await axios.get("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/patient/family", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data) {
        setFamily(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    if (!family.HoTen || !family.SDT) return setMsg("Vui lòng nhập Họ tên và SĐT người nhà");
    setLoading(true);
    try {
      await axios.post("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/patient/family", family, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg("Cập nhật thông tin người nhà thành công!");
      setTimeout(() => setMsg(""), 3000);
    } catch (e) {
      setMsg("Lỗi khi lưu thông tin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-2">
        <Users className="text-cyan-500" /> Hồ sơ Người nhà / Liên hệ khẩn cấp
      </h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8">Cập nhật thông tin người nhà để nhận thông báo hoặc đặt khám thay.</p>
      
      {msg && <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl font-medium border border-emerald-100 dark:border-emerald-800/50 flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/> {msg}</div>}

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Họ và tên người nhà (*)</label>
          <input 
            type="text" 
            value={family.HoTen} 
            onChange={e => setFamily({...family, HoTen: e.target.value})} 
            className="w-full p-4 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:border-cyan-500 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors" 
            placeholder="Ví dụ: Nguyễn Văn A"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Số điện thoại (*)</label>
            <input 
              type="text" 
              value={family.SDT} 
              onChange={e => setFamily({...family, SDT: e.target.value})} 
              className="w-full p-4 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:border-cyan-500 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Mối quan hệ</label>
            <input 
              type="text" 
              value={family.QuanHe} 
              onChange={e => setFamily({...family, QuanHe: e.target.value})} 
              className="w-full p-4 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:border-cyan-500 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors" 
              placeholder="Ví dụ: Cha, Mẹ, Con cái, Vợ chồng"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">CCCD / CMND (Tuỳ chọn)</label>
          <input 
            type="text" 
            value={family.CCCD} 
            onChange={e => setFamily({...family, CCCD: e.target.value})} 
            className="w-full p-4 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:border-cyan-500 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors" 
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Địa chỉ liên hệ</label>
          <input 
            type="text" 
            value={family.DiaChi} 
            onChange={e => setFamily({...family, DiaChi: e.target.value})} 
            className="w-full p-4 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:border-cyan-500 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors" 
          />
        </div>

        <button 
          onClick={handleSave}
          disabled={loading}
          className="w-full mt-6 bg-cyan-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-cyan-700 transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" /> Lưu Hồ Sơ
        </button>
      </div>
    </div>
  );
}
