import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe, Volume2, ShieldCheck } from 'lucide-react';


export const Navbar = ({ onSelectQuickScenario, currentScenario }) => {
  const { language, setLanguage, t, speakText } = useLanguage();

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'mr', label: 'मराठी (Marathi)' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white p-1 shadow-md shadow-emerald-700/10 border border-emerald-100 flex items-center justify-center transition-transform group-hover:scale-105 overflow-hidden">
                <img src="/logo.png" alt="Fasal Mitra Logo" className="w-full h-full object-contain rounded-xl" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900">
                    Fasal<span className="text-emerald-600">Mitra</span>
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                    2.0
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs font-medium text-slate-500 hidden sm:block">
                  {t('tagline')}
                </p>
              </div>
            </a>
          </div>

          {/* Right Action Controls: Language Switcher, Audio Guide, Agmarknet Badge */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Live Data Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Agmarknet & e-NAM Verified</span>
            </div>

            {/* Audio Read-Out Button */}
            <button
              onClick={() => speakText(t('heroTitle') + '. ' + t('heroSubtitle'))}
              title={t('audioReadOut')}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition-colors flex items-center gap-1.5 text-xs font-medium"
            >
              <Volume2 className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline">{t('audioReadOut')}</span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <Globe className="w-4 h-4 text-slate-500 ml-1.5 mr-1 hidden xs:block" />
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    language === lang.code
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {lang.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;