'use client';

import { Calendar, FileText, CreditCard, Activity, Droplet, Phone } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function QuickActions() {
  const actions = [
    {
      title: "Đặt lịch khám",
      href: "/booking",
      icon: <Calendar className="h-7 w-7" />,
      colorClass: "bg-blue-50 text-blue-600 border-blue-100",
      hoverClass: "group-hover:bg-blue-100 group-hover:scale-110",
    },
    {
      title: "Kết quả EMR",
      href: "/records",
      icon: <FileText className="h-7 w-7" />,
      colorClass: "bg-emerald-50 text-emerald-600 border-emerald-100",
      hoverClass: "group-hover:bg-emerald-100 group-hover:scale-110",
    },
    {
      title: "Thanh toán",
      href: "/billing",
      icon: <CreditCard className="h-7 w-7" />,
      colorClass: "bg-amber-50 text-amber-600 border-amber-100",
      hoverClass: "group-hover:bg-amber-100 group-hover:scale-110",
    },
    {
      title: "Sức khoẻ",
      href: "/health",
      icon: <Activity className="h-7 w-7" />,
      colorClass: "bg-cyan-50 text-cyan-600 border-cyan-100",
      hoverClass: "group-hover:bg-cyan-100 group-hover:scale-110",
    },
    {
      title: "Hiến máu",
      href: "/blood",
      icon: <Droplet className="h-7 w-7" />,
      colorClass: "bg-red-50 text-red-600 border-red-100",
      hoverClass: "group-hover:bg-red-100 group-hover:scale-110",
    },
    {
      title: "Telemed",
      href: "/telemed",
      icon: <Phone className="h-7 w-7" />,
      colorClass: "bg-purple-50 text-purple-600 border-purple-100",
      hoverClass: "group-hover:bg-purple-100 group-hover:scale-110",
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <section className="container mx-auto px-4 z-20 relative -mt-8 mb-8 pb-4">
      <h3 className="text-xl font-bold text-slate-800 mb-6 px-2">Thao tác nhanh</h3>
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="flex flex-wrap md:grid md:grid-cols-6 gap-4 md:gap-6 justify-center"
      >
        {actions.map((action, idx) => (
          <motion.div variants={item} key={idx} className="w-[100px] md:w-auto">
            <Link href={action.href} className="group flex flex-col items-center gap-3">
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-3xl flex items-center justify-center transition-all duration-300 border shadow-sm ${action.colorClass}`}>
                <div className={`transition-transform duration-300 ${action.hoverClass}`}>
                  {action.icon}
                </div>
              </div>
              <span className="text-slate-700 font-semibold text-sm text-center">
                {action.title}
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
