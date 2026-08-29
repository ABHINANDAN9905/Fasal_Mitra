import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMerchant } from '../context/MerchantContext';
import { CROPS } from '../constants/crop';
import { ALL_MANDIS } from '../constants/location';
import { formatPrice } from '../utils/formatPrice';
import * as merchantService from '../services/merchantService';

import {
  Store,
  Building2,
  Edit3,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Wheat,
  Scale,
  Megaphone,
  Mail,
  MapPin,
  KeyRound,
  LogOut,
  Eye,
  EyeOff
} from 'lucide-react';

const DEMO_MERCHANT_PRESETS = [
  {
    id: 'merchant-2',
    name: 'Haryana Grain Merchants',
    email: 'haryana.grains@apmc.in',
    region: 'Gurugram, Haryana',
    pin: '123456',
    mandi: 'Gurugram APMC Grain Market',
    primaryCrop: 'Wheat',
    avatar: '🌾'
  },
  {
    id: 'merchant-1',
    name: 'Kisan Agro Traders',
    email: 'kisan.agro@lasalgaon.in',
    region: 'Nashik, Maharashtra',
    pin: '234567',
    mandi: 'Lasalgaon APMC Market Yard',
    primaryCrop: 'Onion',
    avatar: '🧅'
  },
  {
    id: 'merchant-3',
    name: 'Punjab Foodgrain Corp',
    email: 'punjab.royal@khannamandi.in',
    region: 'Khanna, Punjab',
    pin: '345678',
    mandi: 'Khanna Grain Mandi',
    primaryCrop: 'Wheat & Paddy',
    avatar: '🚜'
  },
  {
    id: 'merchant-4',
    name: 'Kolar Tomato & Veg Traders',
    email: 'kolar.tomato@apmc.in',
    region: 'Kolar, Karnataka',
    pin: '456789',
    mandi: 'Kolar APMC Market Yard',
    primaryCrop: 'Tomato',
    avatar: '🍅'
  }
];

export const MerchantPortal = ({ onSwitchToFarmerView }) => {
  const { t } = useLanguage();
  const { merchant, isMerchantAuthenticated, login, logout, loading: authLoading } = useMerchant();

  // Login Form State: Email, Region, 6-digit PIN
  const [merchantEmail, setMerchantEmail] = useState('haryana.grains@apmc.in');
  const [merchantRegion, setMerchantRegion] = useState('Gurugram, Haryana');
  const [merchantPin, setMerchantPin] = useState('123456');
  const [showPin, setShowPin] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Mandi & Price Edit State
  const [activeMandi, setActiveMandi] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(CROPS[2]); // Wheat
  const [modalPrice, setModalPrice] = useState(2650);
  const [minPrice, setMinPrice] = useState(2450);
  const [maxPrice, setMaxPrice] = useState(2800);
  const [arrivalsTonnes, setArrivalsTonnes] = useState(200);
  const [grade, setGrade] = useState('Grade A (Sharbati)');
  const [priceReason, setPriceReason] = useState('High demand from local flour mills & fresh dry arrivals');
  const [buyingStatus, setBuyingStatus] = useState('Active Buying');

  // Bulletins List
  const [bulletins, setBulletins] = useState([]);
  const [publishing, setPublishing] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Match Mandi when authenticated
  useEffect(() => {
    if (merchant) {
      const matched = ALL_MANDIS.find(m =>
        m.id === merchant.mandiId ||
        m.district?.toLowerCase() === merchant.district?.toLowerCase() ||
        merchant.region?.toLowerCase().includes(m.district?.toLowerCase())
      ) || ALL_MANDIS[0];
      setActiveMandi(matched);
    }
  }, [merchant]);

  // Load Published Bulletins
  const loadBulletins = async () => {
    try {
      const list = await merchantService.getMerchantBulletins();
      setBulletins(list);
    } catch (err) {
      console.error('Failed to load bulletins:', err);
    }
  };

  useEffect(() => {
    if (isMerchantAuthenticated) {
      loadBulletins();
    }
  }, [isMerchantAuthenticated]);

  // Merchant Login Submit (Email, Region, 6-digit PIN)
  const handleMerchantLogin = async (e) => {
    if (e) e.preventDefault();
    setAuthError(null);

    if (!merchantEmail.trim()) {
      setAuthError('Please enter your Merchant Email address');
      return;
    }
    if (!merchantPin.trim() || merchantPin.trim().length !== 6) {
      setAuthError('Security PIN must be exactly 6 digits (e.g. 123456)');
      return;
    }

    try {
      await login(merchantEmail.trim(), merchantRegion.trim(), merchantPin.trim());
    } catch (err) {
      setAuthError(err.message || 'Authentication failed. Please verify credentials.');
    }
  };

  // Quick 1-Click Demo Merchant Login
  const handleQuickTraderLogin = async (preset) => {
    setMerchantEmail(preset.email);
    setMerchantRegion(preset.region);
    setMerchantPin(preset.pin);
    setAuthError(null);

    try {
      await login(preset.email, preset.region, preset.pin);
    } catch (err) {
      console.warn('Quick login fallback:', err.message);
    }
  };

  // When crop changes, update initial price values
  const handleCropSelect = (crop) => {
    setSelectedCrop(crop);
    const baseModal = crop.basePriceRange.modal;
    setModalPrice(baseModal);
    setMinPrice(Math.round(baseModal * 0.93));
    setMaxPrice(Math.round(baseModal * 1.07));
    setFeedback(null);
  };

  const handlePriceOffset = (delta) => {
    const newModal = Math.max(100, modalPrice + delta);
    setModalPrice(newModal);
    setMinPrice(Math.round(newModal * 0.93));
    setMaxPrice(Math.round(newModal * 1.07));
  };

  // Publish / Update Mandi Price Handler
  const handlePublishPrice = async (e) => {
    if (e) e.preventDefault();
    setPublishing(true);
    setFeedback(null);

    try {
      const targetMandiName = activeMandi?.name || merchant?.mandiName || 'Gurugram APMC Grain Market';
      const targetDistrict = activeMandi?.district || merchant?.district || 'Gurugram';
      const targetState = activeMandi?.state || merchant?.state || 'Haryana';

      const payload = {
        merchantId: merchant?.id || 'merchant-2',
        merchantName: merchant?.name || 'APMC Merchant',
        apmcLicense: merchant?.apmcLicense || 'APMC-VERIFIED-2024',
        mandiId: activeMandi?.id || 'gurugram-grain-mandi',
        mandiName: targetMandiName,
        district: targetDistrict,
        state: targetState,
        cropId: selectedCrop.id,
        cropName: selectedCrop.name,
        modalPrice: Number(modalPrice),
        minPrice: Number(minPrice),
        maxPrice: Number(maxPrice),
        arrivalsTonnes: Number(arrivalsTonnes),
        grade,
        reason: priceReason,
        status: buyingStatus
      };

      const res = await merchantService.updateMandiPrice(payload);
      if (res && res.success) {
        setFeedback({
          type: 'success',
          message: `Live rate published! ${selectedCrop.name} is now updated to ₹${formatPrice(modalPrice)}/Q in ${targetMandiName}. Visible immediately on farmer page!`
        });
        await loadBulletins();
      } else {
        throw new Error(res?.message || 'Failed to update price');
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to publish price update. Please try again.'
      });
    } finally {
      setPublishing(false);
    }
  };

  // =========================================================================
  // VIEW 1: MERCHANT EMAIL + REGION + 6-DIGIT PIN AUTHENTICATION SCREEN
  // =========================================================================
  if (!isMerchantAuthenticated || !merchant) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="text-xs font-black uppercase tracking-widest text-amber-300">
                APMC Mandi Merchant Authentication
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Merchant Login (Email, Region & 6-Digit PIN)
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Log in with your verified merchant email, operating region, and 6-digit security PIN.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Error Banner */}
            {authError && (
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Quick 1-Click Verified Trader Logins */}
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  1-Click Verified Merchant Desks:
                </span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 dark:bg-amber-900 px-2 py-0.5 rounded-full">
                  PIN Included
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DEMO_MERCHANT_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleQuickTraderLogin(preset)}
                    className="p-3 rounded-2xl bg-white dark:bg-slate-800 hover:bg-amber-50/80 dark:hover:bg-slate-700 border border-amber-200 dark:border-slate-700 text-left transition-all hover:border-amber-400 group active:scale-95 shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{preset.avatar}</span>
                      <div className="flex-1 min-w-0">
                        <span className="font-extrabold text-xs text-slate-900 dark:text-white block truncate group-hover:text-amber-700 dark:group-hover:text-amber-300">
                          {preset.name}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                          {preset.email} • PIN: {preset.pin}
                        </span>
                        <span className="text-[9px] text-amber-700 dark:text-amber-400 font-bold block">
                          📍 {preset.region}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Login Form: Email, Region, 6-Digit PIN */}
            <form onSubmit={handleMerchantLogin} className="space-y-4">
              {/* 1. Merchant Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Merchant Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={merchantEmail}
                    onChange={(e) => setMerchantEmail(e.target.value)}
                    placeholder="e.g. haryana.grains@apmc.in"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* 2. Region / Mandi Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Operating Region / State & District *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={merchantRegion}
                    onChange={(e) => setMerchantRegion(e.target.value)}
                    placeholder="e.g. Gurugram, Haryana or Nashik, Maharashtra"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* 3. 6-Digit Security PIN */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    6-Digit Security PIN *
                  </label>
                  <span className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
                    Demo PIN: 123456
                  </span>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPin ? 'text' : 'password'}
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                    value={merchantPin}
                    onChange={(e) => setMerchantPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit PIN (e.g. 123456)"
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-base font-black tracking-widest text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full sm:flex-1 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {authLoading ? 'Verifying PIN...' : 'Login to Merchant Portal'}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onSwitchToFarmerView}
                  className="w-full sm:w-auto px-5 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-xs transition-colors"
                >
                  Cancel / Farmer View
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED MERCHANT WORKING PLATFORM (Session is Permanently Active)
  // =========================================================================
  return (
    <div className="space-y-6">
      {/* Merchant Desk Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
              <Store className="w-3.5 h-3.5" />
              <span>APMC Verified Trader Desk • Live Rate Broadcasting Active</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {merchant.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                Email: <strong className="text-white">{merchant.email}</strong>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Region: <strong className="text-white">{merchant.region || merchant.district}</strong>
              </span>
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                Mandi: <strong className="text-white">{activeMandi?.name || merchant.mandiName}</strong>
              </span>
            </div>
          </div>

          {/* Actions: View as Farmer & Log Out */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onSwitchToFarmerView}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-700/30 transition-all flex items-center gap-2 active:scale-95"
              title="Switch back to farmer view to see updated prices in real time"
            >
              <span>🌾 Test on Farmer Page</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={logout}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-red-500/20 border border-white/15 text-white hover:text-red-300 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5"
              title="Log out from Merchant Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Desk</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Merchant Working Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Crop Price Editor (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handlePublishPrice} className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-amber-600" />
                  Mandi Crop Price & Arrival Editor
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Publish today's buying rates and arrival reasons — will reflect in real time on the farmer comparison page!
                </p>
              </div>
              <span className="px-3 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-full text-xs font-bold">
                Live Broadcast Active
              </span>
            </div>

            {/* Feedback Alert */}
            {feedback && (
              <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-200'
                  : 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950/60 dark:border-red-800 dark:text-red-200'
              }`}>
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            {/* 1. Crop Selection Pill Buttons */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Wheat className="w-4 h-4 text-emerald-600" />
                Select Commodity / Crop to Price:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CROPS.map((crop) => {
                  const isSelected = selectedCrop.id === crop.id;
                  return (
                    <button
                      key={crop.id}
                      type="button"
                      onClick={() => handleCropSelect(crop)}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 ring-2 ring-amber-500/20 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <span className="font-extrabold text-xs text-slate-900 dark:text-white block">
                          {crop.name}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {crop.hindiName || crop.category}
                        </span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Price Inputs Grid: Modal, Min, Max */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-amber-600" />
                  Mandi Rate Setting (₹ per Quintal / 100 kg)
                </span>
                <span className="text-[11px] font-bold text-slate-500">
                  Base: ₹{selectedCrop.basePriceRange.modal}/Q
                </span>
              </div>

              {/* Modal Price Highlight Box */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                    Primary Modal Rate (मुख्य मॉडल भाव) *
                  </label>
                  <div className="flex items-center gap-1">
                    {[-100, -50, +50, +100].map((delta) => (
                      <button
                        key={delta}
                        type="button"
                        onClick={() => handlePriceOffset(delta)}
                        className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 text-slate-700 dark:text-slate-300 text-[11px] font-bold rounded-lg transition-colors"
                      >
                        {delta > 0 ? `+₹${delta}` : `-₹${Math.abs(delta)}`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="100"
                    max="50000"
                    step="10"
                    required
                    value={modalPrice}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setModalPrice(v);
                      setMinPrice(Math.round(v * 0.93));
                      setMaxPrice(Math.round(v * 1.07));
                    }}
                    className="w-full pl-9 pr-24 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xl font-black text-amber-700 dark:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    per Quintal
                  </span>
                </div>
              </div>

              {/* Min & Max Range Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Minimum Rate (न्यूनतम भाव ₹/Q)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Maximum Rate (अधिकतम भाव ₹/Q)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Market Arrivals & Produce Grade */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Today's Arrivals (आवक)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="5000"
                    value={arrivalsTonnes}
                    onChange={(e) => setArrivalsTonnes(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                    Tonnes
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Produce Quality / Grade
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
                >
                  <option value="FAQ">FAQ (Fair Average Quality)</option>
                  <option value="Grade A (Sharbati/Super)">Grade A (Super Quality)</option>
                  <option value="Export Quality (45mm+)">Export Quality</option>
                  <option value="Grade B (Regular)">Grade B (Regular)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Buying Status
                </label>
                <select
                  value={buyingStatus}
                  onChange={(e) => setBuyingStatus(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
                >
                  <option value="Active Buying">🟢 Active Buying (खुला व्यापार)</option>
                  <option value="Price Revised">🟡 Price Revised (भाव संशोधित)</option>
                  <option value="Target Quota Met">🔴 Target Quota Full (कोटा पूर्ण)</option>
                </select>
              </div>
            </div>

            {/* 4. Reason for Price Change / Market Commentary */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-amber-600" />
                Reason for Price / Market Trend Notes (कारण / बाजार टिप्पणी):
              </label>
              <textarea
                rows={2}
                value={priceReason}
                onChange={(e) => setPriceReason(e.target.value)}
                placeholder="e.g. High demand from flour mills, fresh dry arrivals from local farms"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Submit & Publish Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={publishing}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl text-sm font-black shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {publishing ? (
                  <span>Publishing Live Rate to Mandi...</span>
                ) : (
                  <>
                    <Megaphone className="w-4 h-4" />
                    <span>Publish Live {selectedCrop.name} Price (₹{formatPrice(modalPrice)}/Q)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Mandi Yard Details & Live Broadcast Feed (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          {/* APMC Mandi Yard Info Card */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 text-amber-700 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {activeMandi?.name || merchant?.mandiName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {activeMandi?.district || merchant?.district}, {activeMandi?.state || merchant?.state}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">e-NAM Terminal:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  {activeMandi?.isEnamLinked ? 'Connected (Live Broadcast)' : 'APMC Yard'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">APMC Cess:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {activeMandi?.marketFeePercent || 1.05}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Weighing / Unloading:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  ₹{(activeMandi?.weighingFeePerQuintal || 4) + (activeMandi?.unloadingFeePerQuintal || 8)}/Q
                </span>
              </div>
            </div>
          </div>

          {/* Published Bulletins Feed */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-600" />
                Active Published Rates ({bulletins.length})
              </h4>
              <button
                type="button"
                onClick={loadBulletins}
                className="p-1 rounded-lg text-slate-400 hover:text-amber-600"
                title="Refresh Bulletins"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {bulletins.length > 0 ? (
                bulletins.map((b) => (
                  <div
                    key={b.id || `${b.mandiName}-${b.cropName}`}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Wheat className="w-3.5 h-3.5 text-emerald-600" />
                        {b.cropName}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                        {b.status}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <span className="text-base font-black text-amber-700 dark:text-amber-400">
                        ₹{formatPrice(b.modalPrice)}/Q
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Range: ₹{formatPrice(b.minPrice)}–₹{formatPrice(b.maxPrice)}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 italic">
                      "{b.reason}"
                    </p>

                    <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-200/60 dark:border-slate-700/60">
                      <span>{b.mandiName}</span>
                      <span>{b.arrivalsTonnes} Tonnes</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  No active bulletins published yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantPortal;
