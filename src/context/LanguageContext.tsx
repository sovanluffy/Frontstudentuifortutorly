"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "EN" | "KH";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (kh: string, en: string) => string; // មុខងារជំនួយសម្រាប់បកប្រែងាយៗ
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  // ទាញយកភាសាដែលអ្នកប្រើបានរើសទុកពីមុន (LocalStorage)
  const [language, setLanguageState] = useState<Language>("KH");

  useEffect(() => {
    const savedLang = localStorage.getItem("app_lang") as Language;
    if (savedLang) setLanguageState(savedLang);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app_lang", lang);
  };

  // មុខងារសម្រាប់ជ្រើសរើសពាក្យតាមភាសា
  const t = (kh: string, en: string) => (language === "KH" ? kh : en);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};