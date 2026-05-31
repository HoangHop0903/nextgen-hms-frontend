import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { HeartPulse, ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-20 mt-auto border-t border-slate-900 overflow-hidden relative">
      {/* Decorative Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-linear-to- from-transparent via-brand-primary-dark to-transparent" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-4">
            <Link href="/" className="flex">
              <div className="h-10 w-10 rounded-xl bg-brand-primary/20 text-brand-primary-light border border-brand-primary/30 flex items-center justify-center">
                <HeartPulse className="h-6 w-6" />
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">NextGen HM<span className="text-brand-primary">S</span></span>
            </Link>
            <p className="text-slate-400 font-medium leading-relaxed mb-6 max-w-sm">
              Kiến tạo nền tảng Y Tế số đạt chuẩn quốc tế. Cung cấp dịch vụ chăm sóc sức khỏe toàn diện, minh bạch và đẳng cấp.
            </p>
          </div>
          
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="text-white font-bold mb-6 text-lg tracking-wide">Khám Phá</h4>
            <ul className="space-y-4 font-medium">
              <li><Link href="/booking" className="hover:text-brand-primary-light transition-colors flex items-center group">Đặt lịch khám <ArrowRight className="h-3 w-3 ml-1 opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all" /></Link></li>
              <li><Link href="/doctors" className="hover:text-brand-primary-light transition-colors flex items-center group">Đội ngũ bác sĩ <ArrowRight className="h-3 w-3 ml-1 opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all" /></Link></li>
              <li><Link href="/emr" className="hover:text-brand-primary-light transition-colors flex items-center group">Hồ sơ bệnh án <ArrowRight className="h-3 w-3 ml-1 opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all" /></Link></li>
            </ul>
          </div>
          
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 text-lg tracking-wide">Hỗ Trợ</h4>
            <ul className="space-y-4 font-medium">
              <li><Link href="/faq" className="hover:text-brand-primary-light transition-colors">Tư vấn 24/7</Link></li>
              <li><Link href="/terms" className="hover:text-brand-primary-light transition-colors">Điều khoản dịch vụ</Link></li>
              <li><Link href="/privacy" className="hover:text-brand-primary-light transition-colors">Bảo mật dữ liệu</Link></li>
            </ul>
          </div>
          
          <div className="lg:col-span-3 lg:col-start-10">
            <h4 className="text-white font-bold mb-6 text-lg tracking-wide">Trải Nghiệm Toàn Diện</h4>
            <p className="text-sm font-medium mb-6 text-slate-500">Tải ứng dụng NextGen để sử dụng tính năng theo dõi sức khỏe IoT từ thiết bị đeo tay.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="bg-slate-900 border-slate-700 hover:bg-slate-800 hover:text-white hover:border-slate-600 rounded-xl">App Store</Button>
              <Button variant="outline" className="bg-slate-900 border-slate-700 hover:bg-slate-800 hover:text-white hover:border-slate-600 rounded-xl">Google Play</Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-medium text-sm">© 2026 NextGen Hospital Management System.</p>
          <div className="flex gap-4 text-sm font-medium">
             <Link href="#" className="hover:text-white transition-colors">Facebook</Link>
             <Link href="#" className="hover:text-white transition-colors">LinkedIn</Link>
             <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
