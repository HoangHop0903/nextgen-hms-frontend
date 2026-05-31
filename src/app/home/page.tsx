"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/providers/LanguageProvider";
import { useRouter } from "next/navigation";
import { BookingTab } from "@/components/patient/BookingTab";
import { ServicePricingTab } from "@/components/patient/ServicePricingTab";
import { HospitalTab } from "@/components/patient/HospitalTab";
import axios from "axios";
import { Search, Calendar, Stethoscope, Smile, Activity, HeartPulse, Hospital, FileText, Handshake, ChevronLeft, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("home"); // home, booking, services, hospitals
  const [guestSuccessMsg, setGuestSuccessMsg] = useState("");

  // Search state
  const [globalSearch, setGlobalSearch] = useState("");
  const [allDoctors, setAllDoctors] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [doctorMenuOpen, setDoctorMenuOpen] = useState(false);
  const [initialSelectedDoctor, setInitialSelectedDoctor] = useState<any>(null);
  const [initialSearchQuery, setInitialSearchQuery] = useState("");

  useEffect(() => {
    fetchAllDoctors();
    
    // Support redirect from VNPay callback
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("guest_vnpay_return") === "true") {
      setGuestSuccessMsg(t("common.success_booking"));
      // Clean url
      window.history.replaceState({}, document.title, "/home");
    }
  }, []);

  const fetchAllDoctors = async () => {
    try {
      const res = await axios.get("https://nextgen-hms-backend-8r2z.onrender.com/api/v1/patient/doctors");
      setAllDoctors(res.data);
    } catch (e) {
      console.error("Lỗi lấy danh sách bác sĩ", e);
    }
  };

  // Extract unique specialties from doctors
  const specialties = Array.from(new Set(allDoctors.map(d => d.TenChuyenKhoa).filter(Boolean)));

  const filteredDoctors = allDoctors.filter(d => d.HoTen?.toLowerCase().includes(globalSearch.toLowerCase()));
  const filteredSpecialties = specialties.filter(s => (s as string).toLowerCase().includes(globalSearch.toLowerCase()));

  const handleSelectDoctor = (doc: any) => {
    setInitialSelectedDoctor(doc);
    setInitialSearchQuery("");
    setGlobalSearch("");
    setShowDropdown(false);
    setActiveTab("booking");
  };

  const handleSelectSpecialty = (spec: string) => {
    setInitialSelectedDoctor(null);
    setInitialSearchQuery(spec);
    setGlobalSearch("");
    setShowDropdown(false);
    setActiveTab("booking");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100" onClick={() => { setShowDropdown(false); setDoctorMenuOpen(false); }}>
      {/* Toast Notification Area */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-3">
        {guestSuccessMsg && (
          <div className="bg-emerald-50 dark:bg-emerald-900/30 border-l-4 border-emerald-500 p-4 rounded shadow-lg w-96 animate-in slide-in-from-right-8 fade-in flex gap-3 relative">
            <div className="text-emerald-500 dark:text-emerald-400 mt-0.5"><CheckCircle2 className="w-5 h-5" /></div>
            <div className="flex-1 pr-6">
              <h4 className="font-bold text-emerald-800 dark:text-emerald-200 text-sm">{t("common.success")}</h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1 leading-relaxed">{guestSuccessMsg}</p>
            </div>
            <button onClick={() => setGuestSuccessMsg("")} className="absolute top-2 right-2 text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 text-lg font-bold">×</button>
          </div>
        )}
      </div>
      
      {/* Top Header Navigation */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-black text-cyan-500 dark:text-cyan-400 flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
              <HeartPulse className="w-8 h-8 text-cyan-400" /> NextGen Care
            </h1>
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
              <button onClick={() => setActiveTab('home')} className="hover:text-cyan-600 dark:hover:text-cyan-400 text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30 px-3 py-1 rounded-full">{t("nav.specialty")}</button>
              <button onClick={() => setActiveTab('hospitals')} className="hover:text-cyan-600 dark:hover:text-cyan-400">{t("nav.hospital")}</button>
              
              <div className="relative">
                <button onClick={(e) => { e.stopPropagation(); setDoctorMenuOpen(!doctorMenuOpen); }} className="hover:text-cyan-600 dark:hover:text-cyan-400">{t("nav.doctor")}</button>
                {doctorMenuOpen && (
                  <div className="absolute top-full mt-4 -left-16 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 z-50 max-h-[60vh] overflow-y-auto">
                    {allDoctors.length === 0 ? (
                      <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-sm">{t("nav.no_doctor")}</div>
                    ) : (
                      allDoctors.map(doc => (
                        <div 
                          key={doc.MaBacSi} 
                          onClick={() => { setDoctorMenuOpen(false); handleSelectDoctor(doc); }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors border-b border-slate-50 dark:border-slate-800/50 last:border-0"
                        >
                          <img src={doc.AnhDaiDien || `https://i.pravatar.cc/150?u=${doc.MaBacSi}`} alt={doc.HoTen} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{doc.HocVi} {doc.HoTen}</p>
                            <p className="text-xs text-cyan-600 dark:text-cyan-400">{doc.TenChuyenKhoa}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <button onClick={() => setActiveTab('services')} className="hover:text-cyan-600 dark:hover:text-cyan-400">{t("nav.package")}</button>
            </nav>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 border-r border-slate-200 dark:border-slate-700 pr-4">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => router.push("/login")}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-full font-bold text-sm transition-colors shadow-sm"
              >
                {t("nav.login")}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      {activeTab === "home" ? (
        <div className="animate-in fade-in duration-500">
          {/* Hero Section */}
          <section className="bg-gradient-to-b from-cyan-100 to-cyan-50 dark:from-cyan-900/40 dark:to-slate-950 pt-16 pb-24 px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-8 leading-tight">
                {t("home.hero_title_1")} <br className="hidden md:block" /> {t("home.hero_title_2")}
              </h2>
              
              <div className="relative max-w-2xl mx-auto mb-16 shadow-lg rounded-full z-30" onClick={(e) => e.stopPropagation()}>
                <input 
                  type="text" 
                  value={globalSearch}
                  onChange={(e) => { setGlobalSearch(e.target.value); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder={t("home.search_placeholder")} 
                  className="w-full pl-6 pr-12 py-4 rounded-full outline-none text-lg border-2 border-transparent focus:border-cyan-300 dark:focus:border-cyan-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition-colors">
                  <Search className="w-5 h-5" />
                </button>

                {/* Dropdown Results */}
                {showDropdown && globalSearch.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden text-left max-h-[60vh] overflow-y-auto">
                    {filteredSpecialties.length > 0 && (
                      <div className="p-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase px-3 py-2">{t("nav.specialty")}</h4>
                        {filteredSpecialties.slice(0, 5).map((spec: any, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => handleSelectSpecialty(spec)}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer rounded-xl transition-colors"
                          >
                            <div className="bg-cyan-50 dark:bg-cyan-900/30 p-2 rounded-lg text-cyan-600 dark:text-cyan-400"><Stethoscope className="w-4 h-4" /></div>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{spec}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {filteredDoctors.length > 0 && (
                      <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                        <h4 className="text-xs font-bold text-slate-400 uppercase px-3 py-2">{t("nav.doctor")}</h4>
                        {filteredDoctors.slice(0, 5).map(doc => (
                          <div 
                            key={doc.MaBacSi} 
                            onClick={() => handleSelectDoctor(doc)}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer rounded-xl transition-colors"
                          >
                            <img src={doc.AnhDaiDien || `https://i.pravatar.cc/150?u=${doc.MaBacSi}`} alt={doc.HoTen} className="w-10 h-10 rounded-full object-cover" />
                            <div>
                              <p className="font-semibold text-slate-800 dark:text-slate-200">{doc.HocVi} {doc.HoTen}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{doc.TenChuyenKhoa}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {filteredSpecialties.length === 0 && filteredDoctors.length === 0 && (
                      <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                        {t("home.no_results")} "{globalSearch}"
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="text-left mb-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t("home.ai_products")}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                <div onClick={() => alert(t("common.dev_feature"))} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-slate-100 dark:border-slate-800 hover:border-cyan-200 dark:hover:border-cyan-700">
                  <div className="flex gap-3">
                    <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-xl h-fit text-amber-500"><Calendar className="w-6 h-6" /></div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">{t("home.ai_assistant")}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{t("home.ai_assistant_desc")}</p>
                    </div>
                  </div>
                </div>
                <div onClick={() => setActiveTab('booking')} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-slate-100 dark:border-slate-800 hover:border-cyan-200 dark:hover:border-cyan-700">
                  <div className="flex gap-3">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl h-fit text-blue-500 dark:text-blue-400"><Search className="w-6 h-6" /></div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">{t("home.ai_search")}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{t("home.ai_search_desc")}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-slate-100 dark:border-slate-800 hover:border-cyan-200 dark:hover:border-cyan-700">
                  <div className="flex gap-3">
                    <div className="bg-rose-50 dark:bg-rose-900/30 p-3 rounded-xl h-fit text-rose-400"><Smile className="w-6 h-6" /></div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">{t("home.ai_beauty")}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{t("home.ai_beauty_desc")}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-slate-100 dark:border-slate-800 hover:border-cyan-200 dark:hover:border-cyan-700">
                  <div className="flex gap-3">
                    <div className="bg-teal-50 dark:bg-teal-900/30 p-3 rounded-xl h-fit text-teal-500 dark:text-teal-400"><Activity className="w-6 h-6" /></div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">{t("home.ai_treatment")}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{t("home.ai_treatment_desc")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Dịch vụ toàn diện */}
          <section className="py-16 px-4 bg-white dark:bg-slate-950">
            <div className="max-w-6xl mx-auto">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8">{t("home.comprehensive_services")}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[
                  { name: t("home.serv_specialty"), icon: <Hospital className="w-8 h-8 text-blue-500" />, tab: "booking" },
                  { name: t("home.serv_remote"), icon: <Activity className="w-8 h-8 text-emerald-500" />, tab: "empty" },
                  { name: t("home.serv_general"), icon: <FileText className="w-8 h-8 text-amber-500" />, tab: "empty" },
                  { name: t("home.serv_test"), icon: <Activity className="w-8 h-8 text-purple-500" />, tab: "empty" },
                  { name: t("home.serv_mental"), icon: <Smile className="w-8 h-8 text-rose-400" />, tab: "empty" },
                  { name: t("home.serv_dental"), icon: <Stethoscope className="w-8 h-8 text-cyan-500" />, tab: "empty" },
                  { name: t("home.serv_surgery"), icon: <HeartPulse className="w-8 h-8 text-red-500" />, tab: "empty" },
                  { name: t("home.serv_product"), icon: <Handshake className="w-8 h-8 text-indigo-500" />, tab: "empty" },
                  { name: t("home.serv_health_test"), icon: <FileText className="w-8 h-8 text-orange-500" />, tab: "empty" },
                ].map((service, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => service.tab === "empty" ? alert(t("common.dev_feature")) : setActiveTab(service.tab)}
                    className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] dark:shadow-none hover:-translate-y-1 hover:shadow-lg dark:hover:border-cyan-700 transition-all cursor-pointer group"
                  >
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                      {service.icon}
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">{service.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold mb-6 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 px-4 py-2 rounded-lg transition-colors w-fit"
          >
            <ChevronLeft className="w-5 h-5" /> {t("nav.back_home")}
          </button>
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            {activeTab === "booking" && <BookingTab token="" isGuest={true} initialSelectedDoctor={initialSelectedDoctor} initialSearchQuery={initialSearchQuery} />}
            {activeTab === "services" && <ServicePricingTab token="" />}
            {activeTab === "hospitals" && <HospitalTab />}
          </div>
        </div>
      )}
    </div>
  );
}
