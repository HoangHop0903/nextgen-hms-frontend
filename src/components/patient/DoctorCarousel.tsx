'use client';

import { Doctor } from "@/types/home.types";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, UserX, Star, ArrowRight, Stethoscope } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface Props {
  data?: Doctor[];
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
}

export function DoctorCarousel({ data, isLoading, error, onRetry }: Props) {
  if (isLoading) {
    return (
      <div className="flex gap-6 overflow-hidden py-16 container mx-auto px-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="min-w-[320px] h-[440px] rounded-[2.5rem]" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
         <Alert variant="destructive" className="rounded-2xl border-red-200">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="text-lg">Ops! Đã có lỗi xảy ra</AlertTitle>
          <AlertDescription>
             <Button variant="outline" size="sm" onClick={onRetry} className="mt-4 rounded-xl font-medium">Tải lại danh sách</Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center container mx-auto">
        <UserX className="h-20 w-20 text-slate-200 mb-6" />
        <h3 className="text-2xl font-bold text-slate-600">Đang cập nhật đội ngũ</h3>
      </div>
    );
  }

  return (
    <section className="bg-slate-50 relative py-28 border-y border-slate-200/50 overflow-hidden">
      
      {/* Background Decorators */}
      <div className="absolute top-0 right-0 w-[800px] h-full bg-linear-to- from-white/90 to-transparent z-10 pointer-events-none hidden lg:block" />
      <div className="absolute top-0 left-0 w-[400px] h-full bg-linear-to- from-slate-50 to-transparent z-10 pointer-events-none hidden lg:block" />

      <div className="container mx-auto px-4 md:px-8 relative z-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">Các Chuyên Gia<br /><span className="text-brand-primary">Hàng Đầu Nước</span></h2>
            <p className="text-slate-500 font-medium text-lg">Gặp gỡ những bàn tay vàng, trái tim vàng sẽ đồng hành cùng sức khỏe của bạn.</p>
          </div>
          <Button variant="ghost" className="hidden md:flex mt-4 md:mt-0 items-center text-brand-primary font-bold hover:bg-brand-primary/10 rounded-full px-6 py-6" asChild>
             <Link href="/booking">Xem trọn bộ <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>

        {/* Carousel */}
        <div className="flex gap-8 overflow-x-auto pb-12 pt-4 snap-x snap-mandatory focus-visible:outline-none hide-scrollbar px-4 -mx-4" tabIndex={0}>
          {data.map((doc, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              viewport={{ once: true, margin: "-50px" }}
              key={doc.id} 
              className="min-w-[85vw] sm:min-w-[340px] bg-white rounded-[2.5rem] shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col snap-center group"
            >
              <div className="relative h-72 w-full bg-[#e2e8f0] flex items-center justify-center text-slate-400 overflow-hidden">
                 {/* Fallback */}
                 <UserX className="h-20 w-20 opacity-30" />
                 {/* Image */}
                 {doc.avatarUrl && (
                   <Image 
                     src={doc.avatarUrl} 
                     alt={`Avatar ${doc.fullName}`} 
                     fill 
                     className="object-cover transition-transform duration-700 group-hover:scale-105" 
                     sizes="(max-width: 768px) 100vw, 340px" 
                   />
                 )}
                 {/* Overlay Gradient */}
                 <div className="absolute inset-0 bg-linear-to- from-black/60 via-black/0 to-transparent" />
                 <div className="absolute bottom-4 left-5 flex gap-1">
                   {Array.from({length: 5}).map((_,i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                 </div>
              </div>
              
              <div className="p-7 flex-1 flex flex-col relative bg-white">
                <div className="absolute -top-6 right-6 h-12 w-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-brand-primary rotate-3 group-hover:rotate-12 transition-transform">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <h3 className="font-extrabold text-2xl text-slate-900 mb-1 leading-tight">{doc.fullName}</h3>
                <p className="text-brand-primary-light font-bold text-sm mb-5 uppercase tracking-wide">{doc.specialtyName}</p>
                <div className="mt-auto">
                  <Button className="w-full rounded-[1.25rem] py-6 text-base font-semibold border-none shadow-[0_4px_14px_0_rgba(15,118,110,0.15)]" aria-label={`Đặt lịch khám với ${doc.fullName}`}>
                    Gặp Bác sĩ
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <Button variant="outline" className="w-full flex md:hidden mt-2 border-slate-200 rounded-full py-6 text-slate-700 font-bold" asChild>
           <Link href="/booking">Khám phá tất cả y bác sĩ</Link>
        </Button>
      </div>
      
      {/* Hide scrollbar injected style */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </section>
  );
}
