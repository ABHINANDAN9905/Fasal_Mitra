import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Globe,
  Volume2,
  ShieldCheck,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  MapPin,
  Wheat,
  Sun,
  Moon,
  Store,
  ArrowRightLeft
} from 'lucide-react';

export const Navbar = ({
  viewMode = 'farmer',
  onToggleViewMode,
  onSelectQuickScenario,
  currentScenario
}) => {
  const { language, setLanguage, t, speakText } = useLanguage();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'mr', label: 'मराठी (Marathi)' }
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white dark:bg-slate-800 p-1 shadow-md shadow-emerald-700/10 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center transition-transform group-hover:scale-105 overflow-hidden">
                <img src="/logo.png" alt="Fasal Mitra Logo" className="w-full h-full object-contain rounded-xl" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-white">
                    Fasal<span className="text-emerald-600 dark:text-emerald-400">Mitra</span>
                  </span>
                  <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                    2.0
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
                  {t('tagline')}
                </p>
              </div>
            </a>
          </div>

          {/* Right Action Controls: Mode Switcher, Theme, Language, Audio, Auth */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* 🌟 MERCHANT / FARMER PORTAL TOP-RIGHT SWITCHER 🌟 */}
            {viewMode === 'farmer' ? (
              <button
                type="button"
                onClick={() => onToggleViewMode && onToggleViewMode('merchant')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all active:scale-95 border border-amber-400"
                title="Open Merchant & APMC Trader Platform"
              >
                <Store className="w-4 h-4 text-slate-950" />
                <span className="hidden sm:inline">Merchant Portal</span>
                <span className="sm:hidden">Merchant</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onToggleViewMode && onToggleViewMode('farmer')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-700/20 transition-all active:scale-95 border border-emerald-500"
                title="Switch back to Farmer Price Comparison"
              >
                <Wheat className="w-4 h-4 text-amber-300" />
                <span className="hidden sm:inline">Farmer View</span>
                <span className="sm:hidden">Farmer</span>
              </button>
            )}

            {/* Live Data Badge */}
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Agmarknet & e-NAM Verified</span>
            </div>

            {/* Theme Change Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-600 dark:text-amber-300 transition-all flex items-center justify-center shadow-2xs active:scale-95"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Audio Read-Out Button */}
            <button
              onClick={() => speakText(t('heroTitle') + '. ' + t('heroSubtitle'))}
              title={t('audioReadOut')}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 dark:hover:text-emerald-300 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-medium shadow-2xs"
            >
              <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden lg:inline">{t('audioReadOut')}</span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <Globe className="w-4 h-4 text-slate-500 dark:text-slate-400 ml-1.5 mr-1 hidden xs:block" />
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    language === lang.code
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                  }`}
                >
                  {lang.label.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* AUTHENTICATION BUTTON & PROFILE MENU */}
            {isAuthenticated && user ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800/80 text-slate-800 dark:text-slate-100 transition-all shadow-2xs"
                >
                  <span className="text-lg">{user.avatar || '👨‍🌾'}</span>
                  <div className="text-left hidden sm:block">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 block leading-tight">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold block leading-tight">
                      {user.district || user.state}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 hidden sm:block" />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-4 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
                    {/* User Info Header */}
                    <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{user.avatar || '👨‍🌾'}</span>
                        <div>
                          <p className="text-xs font-extrabold text-slate-900 dark:text-slate-100">{user.name}</p>
                          <p className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">{user.role || 'Farmer'}</p>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>{user.village ? `${user.village}, ` : ''}{user.district}, {user.state}</span>
                        </div>
                        {user.preferredCrop && (
                          <div className="flex items-center gap-1.5">
                            <Wheat className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Primary Crop: <strong className="text-slate-800 dark:text-slate-100 capitalize">{user.preferredCrop}</strong></span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Switch Account */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        openAuthModal('login');
                      }}
                      className="w-full py-2 px-3 text-left rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        Switch / Demo Login
                      </span>
                    </button>

                    {/* Logout Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        logout();
                      }}
                      className="w-full py-2 px-3 text-left rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition-all active:scale-95 shrink-0"
              >
                <User className="w-4 h-4" />
                <span>Login / Sign Up</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;