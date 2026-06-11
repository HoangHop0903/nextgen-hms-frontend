"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide sidebar and topbar on login page, patient portal, and home page
  if (pathname === "/login" || pathname === "/patient" || pathname === "/home") {
    return <main className="flex-1 h-screen overflow-y-auto">{children}</main>;
  }

  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  return (
    <>
      {!isAdmin && <Sidebar />}
      <div className={`flex-1 flex flex-col h-screen overflow-y-auto ${isAdmin ? 'md:ml-64' : 'md:ml-24'}`}>
        <Topbar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </>
  );
}
