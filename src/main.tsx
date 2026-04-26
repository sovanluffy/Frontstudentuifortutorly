import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/routes';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext'; // ១. Import LanguageProvider
import '@/styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      {/* ២. រុំ LanguageProvider នៅខាងក្នុង AuthProvider ដើម្បីឱ្យគ្រប់ Component អាចប្រើ useLanguage បាន */}
      <LanguageProvider>
        <RouterProvider router={router} />
      </LanguageProvider>
    </AuthProvider>
  </React.StrictMode>
);