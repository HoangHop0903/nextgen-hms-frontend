"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { CreditCard, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

export default function BillingTab({ token }: { token: string }) {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  const status = searchParams.get("status");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/patient/invoices", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvoices(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (invoiceId: string) => {
    try {
      const res = await axios.post(
        "https://nextgen-hms-backend-8r2z.onrender.com/api/v1/patient/payment/create_url",
        { MaHoaDon: invoiceId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.payment_url) {
        window.location.href = res.data.payment_url;
      }
    } catch (error) {
      alert("Lỗi khi tạo giao dịch VNPay");
    }
  };

  const clearStatus = () => {
    router.replace("/patient?tab=billing");
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Đang tải danh sách hoá đơn...</div>;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
        <CreditCard className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        Thanh toán & Hoá đơn
      </h2>

      {status === "success" && (
        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
          <p>Thanh toán thành công! Cảm ơn bạn đã sử dụng dịch vụ.</p>
          <button onClick={clearStatus} className="ml-auto text-sm underline hover:text-emerald-800 dark:hover:text-emerald-200">Đóng</button>
        </div>
      )}
      {status === "failed" && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
          <p>Thanh toán thất bại hoặc đã bị huỷ.</p>
          <button onClick={clearStatus} className="ml-auto text-sm underline hover:text-red-800 dark:hover:text-red-200">Đóng</button>
        </div>
      )}

      {invoices.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-slate-50 dark:bg-slate-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-slate-300 dark:text-slate-600" />
          </div>
          <p className="text-slate-500 dark:text-slate-400">Bạn chưa có hoá đơn nào.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((inv) => (
            <div key={inv.MaHoaDon} className="border border-slate-200 dark:border-slate-800 p-5 rounded-xl hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">Mã HĐ: {inv.MaHoaDon}</h3>
                  <div className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <p><span className="font-medium text-slate-700 dark:text-slate-300">Bác sĩ:</span> {inv.TenBacSi}</p>
                    <p><span className="font-medium text-slate-700 dark:text-slate-300">Ngày lập:</span> {new Date(inv.NgayLap).toLocaleString("vi-VN")}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-start md:items-end gap-2">
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(inv.TongTien)}
                  </div>
                  
                  {inv.TrangThai === "Đã thanh toán" ? (
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 rounded-full text-sm">
                      <CheckCircle2 className="w-4 h-4" /> Đã thanh toán ({inv.PhuongThucThanhToan})
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-500 font-medium px-3 py-1 bg-amber-50 dark:bg-amber-900/30 rounded-full text-sm">
                        <Clock className="w-4 h-4" /> Chưa thanh toán
                      </span>
                      <button
                        onClick={() => handlePay(inv.MaHoaDon)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm shadow-indigo-200 dark:shadow-none text-sm"
                      >
                        Thanh toán VNPay
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
