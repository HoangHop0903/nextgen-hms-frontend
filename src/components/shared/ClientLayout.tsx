"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  // Hide sidebar and topbar on login page, patient portal, home page, and admin dashboard
  if (pathname === "/login" || pathname === "/patient" || pathname === "/home" || isAdmin) {
    return <main className="flex-1 h-screen overflow-y-auto bg-slate-50 dark:bg-slate-950">{children}</main>;
  }

  return (
    <>
      {!isAdmin && <Sidebar />}
      <div className={`flex-1 flex flex-col h-screen overflow-y-auto ${isAdmin ? 'ml-0' : 'md:ml-24'}`}>
        <Topbar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </>
  );
}
