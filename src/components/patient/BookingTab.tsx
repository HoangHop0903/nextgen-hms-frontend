"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, User, Stethoscope, Clock, Search, CheckCircle2 } from "lucide-react";

export function BookingTab({ token, isGuest, initialSelectedDoctor, initialSearchQuery }: { token: string, isGuest?: boolean, initialSelectedDoctor?: any, initialSearchQuery?: string }) {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [localSearch, setLocalSearch] = useState(initialSearchQuery || "");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [guestInfo, setGuestInfo] = useState({ HoTen: "", SDT: "", NgaySinh: "", GioiTinh: "Nam", CCCD: "", DiaChi: "" });
  const [paymentMethod, setPaymentMethod] = useState("Tiền mặt");
  const [selectedSlot, setSelectedSlot] = useState<{ scheduleId: string; time: string } | null>(null);
  const [vnpayUrl, setVnpayUrl] = useState("");
  const [newAccountInfo, setNewAccountInfo] = useState<{username: string, pass: string} | null>(null);

  const showSpecialties = !selectedSpecialty && !selectedDoctor && localSearch === "";
  const specialties = Array.from(new Set(doctors.map(d => d.TenChuyenKhoa).filter(Boolean)));

  useEffect(() => {
    fetchDoctors();
    if (initialSelectedDoctor) {
      handleSelectDoctor(initialSelectedDoctor);
    }
  }, [initialSelectedDoctor]);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/patient/doctors", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredDoctors = doctors.filter(d => {
    const matchesSearch = d.HoTen?.toLowerCase().includes(localSearch.toLowerCase()) || 
                          d.TenChuyenKhoa?.toLowerCase().includes(localSearch.toLowerCase());
    const matchesSpecialty = selectedSpecialty ? d.TenChuyenKhoa === selectedSpecialty : true;
    return matchesSearch && matchesSpecialty;
  });

  const handleSelectDoctor = async (doc: any) => {
    setSelectedDoctor(doc);
    setSchedules([]);
    setMsg("");
    setBookingSuccess(false);
    setSelectedSlot(null);
    try {
      const res = await axios.get(`https://nextgen-hms-backend-8r2z.onrender.com/api/v1/patient/doctors/${doc.MaBacSi}/schedule`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSchedules(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleBook = async () => {
    if (!selectedSlot) {
      setMsg("Vui lòng chọn khung giờ khám");
      return;
    }
    if (!reason) {
      setMsg("Vui lòng nhập lý do khám");
      return;
    }
    
    if (isGuest) {
      if (!guestInfo.HoTen || !guestInfo.SDT || !guestInfo.NgaySinh) {
        setMsg("Vui lòng nhập đầy đủ Họ tên, SĐT và Ngày sinh");
        return;
      }
      setLoading(true);
      try {
        const res = await axios.post("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/patient/guest-booking", {
          ...guestInfo,
          MaLichLamViec: selectedSlot.scheduleId,
          KhungGio: selectedSlot.time,
          LyDoKham: reason,
          PhuongThucThanhToan: paymentMethod
        });
        if (res.data.is_new_account) {
          setNewAccountInfo({ username: res.data.username, pass: res.data.password });
        }

        if (paymentMethod === "VNPay" && res.data.payment_url) {
          setVnpayUrl(res.data.payment_url);
        } else {
          setMsg("Đặt lịch thành công! Vui lòng thanh toán tại quầy khi đến khám.");
        }
        setBookingSuccess(true);
      } catch (e: any) {
        setMsg(e.response?.data?.detail || "Lỗi đặt lịch");
        // Refresh slots if conflict
        if (e.response?.status === 409 && selectedDoctor) {
          handleSelectDoctor(selectedDoctor);
          setSelectedSlot(null);
        }
      } finally {
        setLoading(false);
      }
      return;
    }
    
    setLoading(true);
    try {
      const res = await axios.post("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/patient/book", {
        MaLichLamViec: selectedSlot.scheduleId,
        KhungGio: selectedSlot.time,
        LyDoKham: reason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg(`Đặt lịch thành công! Mã Đặt Lịch: ${res.data.MaDatLich} - Khung giờ: ${res.data.KhungGio}`);
      setBookingSuccess(true);
    } catch (e: any) {
      setMsg(e.response?.data?.detail || "Lỗi đặt lịch");
      if (e.response?.status === 409 && selectedDoctor) {
        handleSelectDoctor(selectedDoctor);
        setSelectedSlot(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const days = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    return `${days[d.getDay()]}, ${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-slate-100"><Calendar className="text-blue-500" /> Đặt lịch khám</h2>
      
      {msg && (
        <div className={`p-4 mb-6 rounded-lg font-medium ${msg.includes("thành công") ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400"}`}>
          {msg}
        </div>
      )}

      {!selectedDoctor ? (
        showSpecialties ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-slate-700 dark:text-slate-200">Chọn chuyên khoa</h3>
              <div className="relative">
                <input type="text" placeholder="Tìm chuyên khoa, bác sĩ..." value={localSearch} onChange={e => setLocalSearch(e.target.value)} className="pl-8 pr-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-blue-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" />
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {specialties.map((spec, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedSpecialty(spec as string)}
                  className="border border-slate-200 dark:border-slate-800 p-4 rounded-xl cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center gap-3 bg-white dark:bg-slate-900 group text-center"
                >
                  <div className="bg-cyan-50 dark:bg-cyan-900/30 p-3 rounded-full text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform"><Stethoscope className="w-6 h-6" /></div>
                  <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">{spec as string}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <button onClick={() => { setSelectedSpecialty(null); setLocalSearch(""); }} className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1">
                ← Quay lại {selectedSpecialty ? "chuyên khoa" : ""}
              </button>
              <div className="relative">
                <input type="text" placeholder="Lọc bác sĩ..." value={localSearch} onChange={e => setLocalSearch(e.target.value)} className="pl-8 pr-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-blue-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" />
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-4">{selectedSpecialty ? `Bác sĩ chuyên khoa ${selectedSpecialty}` : "Kết quả tìm kiếm"}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map(doc => (
                <div key={doc.MaBacSi} onClick={() => handleSelectDoctor(doc)} className="border border-slate-100 dark:border-slate-800 p-4 rounded-xl cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all group flex items-center gap-4 bg-white dark:bg-slate-900">
                  <img src={doc.AnhDaiDien || `https://i.pravatar.cc/150?u=${doc.MaBacSi}`} alt={doc.HoTen} className="w-16 h-16 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{doc.HocVi} {doc.HoTen}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1"><Stethoscope className="w-3 h-3" /> {doc.TenChuyenKhoa}</p>
                  </div>
                </div>
              ))}
              {filteredDoctors.length === 0 && <p className="text-slate-500 dark:text-slate-400 italic col-span-full">Không tìm thấy bác sĩ nào phù hợp.</p>}
            </div>
          </div>
        )
      ) : (
        <div>
          <button onClick={() => { setSelectedDoctor(null); setSelectedSlot(null); }} className="text-blue-600 dark:text-blue-400 font-medium mb-6 hover:underline">← Quay lại danh sách bác sĩ</button>
          
          <div className="flex items-center gap-6 mb-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
             <img src={selectedDoctor.AnhDaiDien || `https://i.pravatar.cc/150?u=${selectedDoctor.MaBacSi}`} alt={selectedDoctor.HoTen} className="w-24 h-24 rounded-full object-cover shadow-sm" />
             <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{selectedDoctor.HocVi} {selectedDoctor.HoTen}</h3>
                <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2 mt-1"><Stethoscope className="w-4 h-4" /> Chuyên khoa: {selectedDoctor.TenChuyenKhoa}</p>
             </div>
          </div>

          {bookingSuccess ? (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Đã gửi yêu cầu đặt lịch!</h3>
              
              {newAccountInfo && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg text-left max-w-md mx-auto">
                  <p className="text-blue-800 dark:text-blue-300 font-medium mb-2">Hệ thống đã tự động tạo tài khoản cho bạn:</p>
                  <ul className="text-blue-700 dark:text-blue-400 text-sm list-disc pl-5">
                    <li>Tên đăng nhập: <b>{newAccountInfo.username}</b></li>
                    <li>Mật khẩu mặc định: <b>{newAccountInfo.pass}</b></li>
                  </ul>
                  <p className="text-blue-600 dark:text-blue-400 text-xs mt-2 italic">Bạn có thể đổi lại mật khẩu ở trang cá nhân sau khi đăng nhập.</p>
                </div>
              )}

              {vnpayUrl ? (
                <div className="mb-6">
                  <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-4">
                    Vui lòng quét mã QR dưới đây để thanh toán qua VNPay.
                  </p>
                  <div className="flex justify-center mb-4">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(vnpayUrl)}`} alt="VNPay QR" className="border-4 border-white shadow-lg rounded-xl" />
                  </div>
                  <a href={vnpayUrl} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 text-sm hover:underline font-medium">Hoặc bấm vào đây để chuyển đến VNPay</a>
                </div>
              ) : (
                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
                  Bạn đã đăng ký lịch khám thành công. Vui lòng đến đúng giờ và thanh toán chi phí tại quầy.
                </p>
              )}

              <button 
                onClick={() => { setSelectedDoctor(null); setBookingSuccess(false); setReason(""); setSelectedSlot(null); setVnpayUrl(""); setNewAccountInfo(null); }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors mt-4"
              >
                Trở về danh sách bác sĩ
              </button>
            </div>
          ) : (
            <>
              {/* LỊCH KHÁM - KHUNG GIỜ */}
              <h3 className="font-semibold mb-4 text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" /> Chọn khung giờ khám
              </h3>

              {schedules.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 italic mb-6">Bác sĩ chưa có lịch làm việc sắp tới.</p>
              ) : (
                <div className="space-y-6 mb-8">
                  {schedules.map(sch => (
                    <div key={sch.MaLichLamViec} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                      {/* Header ngày */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 px-5 py-3 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-500 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg">
                              {new Date(sch.NgayKham).getDate()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 dark:text-slate-100">{formatDate(sch.NgayKham)}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {sch.TenCa} ({sch.GioBatDau} - {sch.GioKetThuc})
                              </p>
                            </div>
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {sch.slots.filter((s: any) => !s.booked).length} khung giờ trống
                          </div>
                        </div>
                      </div>
                      
                      {/* Grid khung giờ */}
                      <div className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {sch.slots.map((slot: any) => {
                            const isSelected = selectedSlot?.scheduleId === sch.MaLichLamViec && selectedSlot?.time === slot.time;
                            return (
                              <button
                                key={slot.time}
                                disabled={slot.booked}
                                onClick={() => {
                                  setSelectedSlot({ scheduleId: sch.MaLichLamViec, time: slot.time });
                                  setMsg("");
                                }}
                                className={`
                                  px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 min-w-[80px]
                                  ${slot.booked 
                                    ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed line-through" 
                                    : isSelected
                                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105 ring-2 ring-blue-300 dark:ring-blue-800"
                                      : "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:shadow-md"
                                  }
                                `}
                              >
                                {slot.time}
                              </button>
                            );
                          })}
                        </div>
                        {sch.slots.every((s: any) => s.booked) && (
                          <p className="text-sm text-slate-400 dark:text-slate-500 italic mt-3">Tất cả khung giờ đã được đặt hết.</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Slot đã chọn */}
              {selectedSlot && (
                <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-xl flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <p className="text-blue-800 dark:text-blue-300 font-medium">
                    Khung giờ đã chọn: <span className="font-bold text-lg">{selectedSlot.time}</span>
                    {" "}— Ngày: {schedules.find(s => s.MaLichLamViec === selectedSlot.scheduleId)?.NgayKham}
                  </p>
                </div>
              )}

              {/* Guest info form */}
              {isGuest && (
                <div className="mb-6 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-500" /> Thông tin bệnh nhân (Khách)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Họ tên *</label>
                      <input type="text" value={guestInfo.HoTen} onChange={e => setGuestInfo({...guestInfo, HoTen: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" placeholder="VD: Nguyễn Văn A" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Số điện thoại *</label>
                      <input type="text" value={guestInfo.SDT} onChange={e => setGuestInfo({...guestInfo, SDT: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" placeholder="VD: 0901234567" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ngày sinh *</label>
                      <input type="date" value={guestInfo.NgaySinh} onChange={e => setGuestInfo({...guestInfo, NgaySinh: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Giới tính</label>
                      <select value={guestInfo.GioiTinh} onChange={e => setGuestInfo({...guestInfo, GioiTinh: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">CCCD (Tùy chọn)</label>
                      <input type="text" value={guestInfo.CCCD} onChange={e => setGuestInfo({...guestInfo, CCCD: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Địa chỉ (Tùy chọn)</label>
                      <input type="text" value={guestInfo.DiaChi} onChange={e => setGuestInfo({...guestInfo, DiaChi: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" />
                    </div>
                  </div>
                </div>
              )}

              {/* Lý do khám */}
              <div className="mb-6">
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Lý do khám (Triệu chứng) *</label>
                 <textarea 
                   value={reason} 
                   onChange={e => setReason(e.target.value)} 
                   placeholder="Mô tả các triệu chứng bạn đang gặp phải..."
                   className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" 
                   rows={3} 
                 />
              </div>

              {/* Payment method - guest only */}
              {isGuest && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Hình thức thanh toán</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="payment" value="Tiền mặt" checked={paymentMethod === "Tiền mặt"} onChange={() => setPaymentMethod("Tiền mặt")} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                      <span className="text-slate-700 dark:text-slate-200 font-medium">Tiền mặt</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="payment" value="VNPay" checked={paymentMethod === "VNPay"} onChange={() => setPaymentMethod("VNPay")} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                      <span className="text-slate-700 dark:text-slate-200 font-medium">Thanh toán QR Pay (VNPay)</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Nút Xác nhận đặt lịch */}
              <button
                disabled={loading || !selectedSlot}
                onClick={handleBook}
                className={`w-full py-3 rounded-xl font-bold text-lg transition-all duration-200 ${
                  selectedSlot 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30" 
                    : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                }`}
              >
                {loading ? "Đang xử lý..." : selectedSlot ? `Xác nhận đặt lịch lúc ${selectedSlot.time}` : "Vui lòng chọn khung giờ"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
