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

  return (
    <>
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-24 h-screen overflow-y-auto">
        <Topbar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </>
  );
}
