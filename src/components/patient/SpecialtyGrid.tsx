'use client';

import { Specialty } from "@/types/home.types";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Stethoscope, HeartCrack, ChevronRight } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Props {
  data?: Specialty[];
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
}

export function SpecialtyGrid({ data, isLoading, error, onRetry }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 py-16 container mx-auto px-4 z-10 relative">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-3xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 z-10 relative">
         <Alert variant="destructive" className="rounded-2xl border-red-200 bg-red-50 text-red-900 absolute left-1/2 -translate-x-1/2 w-[90%] max-w-lg shadow-lg">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertTitle className="text-lg font-bold">Oops!</AlertTitle>
          <AlertDescription className="text-base mt-2 flex justify-between items-center">
            Hệ thống đang tải dữ liệu. Xin chờ một chút.
            <Button variant="outline" size="sm" onClick={onRetry} className="ml-4 bg-white hover:bg-red-50 text-red-700 border-red-200 shadow-sm rounded-xl">Thử lại</Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center container mx-auto z-10 relative">
        <HeartCrack className="h-20 w-20 text-slate-200 mb-6" />
        <h3 className="text-2xl font-bold text-slate-700">Chưa có dữ liệu</h3>
        <p className="text-slate-500 mt-2 font-medium">Hệ thống đang cập nhật chuyên khoa khám bệnh.</p>
        <Button variant="outline" onClick={onRetry} className="mt-6 rounded-xl border-slate-200">Tải lại</Button>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <section className="container mx-auto px-4 py-24 relative z-10 w-full">
      <div className="text-center mb-16 max-w-3xl mx-auto">
         <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-slate-900">
           Khám Mọi Bệnh Lý <br className="md:hidden" />
           <span className="text-brand-primary">Chuẩn Y Khoa</span>
         </h2>
         <p className="text-lg text-slate-500 font-medium leading-relaxed">
           Quy tụ đội ngũ chuyên gia đầu ngành trong và ngoài nước, NextGen mang đến các dịch vụ y tế toàn diện nhất.
         </p>
      </div>
      
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {data.map((specialty) => (
          <motion.div 
            variants={item}
            key={specialty.id} 
            className="group flex flex-col items-center justify-center p-8 bg-white border border-slate-100/50 rounded-4xl shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(15,118,110,0.15)] hover:-translate-y-2 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-4 ring-brand-primary/20 relative overflow-hidden" 
            tabIndex={0} 
            role="button" 
            aria-label={`Chuyên khoa ${specialty.name}`}
          >
            {/* Subtle shiny glow */}
            <div className="absolute inset-0 bg-linear-to- from-brand-primary/0 via-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="h-16 w-16 bg-brand-surface group-hover:bg-brand-primary text-brand-primary group-hover:text-white rounded-[1.25rem] flex items-center justify-center mb-6 transition-colors shadow-inner drop-shadow-sm">
              <Stethoscope className="h-8 w-8" aria-hidden="true" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg group-hover:text-brand-primary transition-colors mb-2 text-center">{specialty.name}</h3>
            
            <div className="flex items-center text-sm font-semibold text-slate-400 group-hover:text-brand-primary-light transition-colors">
               <span>{specialty.doctorCount} Chuyên gia</span>
               <ChevronRight className="h-4 w-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
