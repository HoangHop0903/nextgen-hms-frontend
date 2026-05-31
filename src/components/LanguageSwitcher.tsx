"use client";

import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/providers/LanguageProvider";

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const changeLanguage = (langCode: string) => {
    setLang(langCode);
    setOpen(false);
  };

  const languages = [
    { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
  ];
  
  const currentLang = languages.find(l => l.code === lang) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 font-medium text-sm"
      >
        <Globe className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
        <span className="hidden md:inline">{currentLang.flag} {currentLang.label}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-900 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
          {languages.map(l => (
            <button
              key={l.code}
              onClick={() => changeLanguage(l.code)}
              className={`w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-3 text-sm transition-colors ${lang === l.code ? 'text-cyan-600 dark:text-cyan-400 font-bold bg-cyan-50/50 dark:bg-cyan-900/10' : 'text-slate-700 dark:text-slate-300'}`}
            >
              <span>{l.flag}</span> <span>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
