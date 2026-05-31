'use client';
import { motion } from "framer-motion";
import { Search, CalendarDays, KeyRound } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      title: "Tìm Kiếm Chuyên Gia",
      desc: "Lựa chọn bác sĩ theo đúng chuyên khoa và lịch sử bệnh lý của bạn.",
      icon: <Search className="w-6 h-6" />,
      color: "bg-teal-50 text-teal-600 border-teal-100"
    },
    {
      title: "Chốt Lịch Nhanh Chóng",
      desc: "Xem ngay lịch trống thời gian thực, không cần gọi điện thoại.",
      icon: <CalendarDays className="w-6 h-6" />,
      color: "bg-indigo-50 text-indigo-600 border-indigo-100"
    },
    {
      title: "Mở Khóa Đặc Quyền",
      desc: "Đến viện và quét mã QR. Không cần chờ đợi, khám bệnh tận tâm.",
      icon: <KeyRound className="w-6 h-6" />,
      color: "bg-amber-50 text-amber-600 border-amber-100"
    }
  ];

  return (
    <section className="py-24 container mx-auto px-4 lg:px-8 relative z-10 w-full mb-10">
      <div className="text-center md:text-left mb-16 max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
           <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Quy trình Y Tế <br /> Không Cảm Giác</h2>
           <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-lg">Bỏ qua mọi hàng chờ. NextGen tối ưu hóa trải nghiệm y tế của bạn chỉ qua 3 bước chạm đơn giản.</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 relative max-w-6xl mx-auto">
        {/* Background Connection Line */}
        <div className="hidden md:block absolute top-18 left-[15%] right-[15%] h-px bg-linear-to- from-transparent via-slate-300 to-transparent z-0"></div>
        
        {steps.map((step, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2, duration: 0.6 }}
            viewport={{ once: true, margin: "-50px" }}
            key={idx} 
            className="flex flex-col relative z-10 bg-white rounded-4xl p-8 border border-slate-100 shadow-sm hover:shadow-premium transition-all duration-300 group"
          >
            <div className={`h-16 w-16 md:h-20 md:w-20 rounded-2xl flex items-center justify-center font-bold mb-8 shadow-sm border group-hover:scale-110 transition-transform ${step.color}`}>
              {step.icon}
            </div>
            
            <span className="text-xs font-black text-slate-300 mb-2 tracking-widest uppercase">BƯỚC 0{idx + 1}</span>
            <h3 className="font-bold text-xl mb-3 text-slate-900 group-hover:text-brand-primary transition-colors">{step.title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
