import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { STATES_AND_DISTRICTS } from '../../constants/location';
import { CROPS } from '../../constants/crop';
import {
  X,
  User,
  Lock,
  Phone,
  Mail,
  MapPin,
  Wheat,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Edit3
} from 'lucide-react';

export const AuthModal = () => {
  const {
    isAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    closeAuthModal,
    login,
    signup,
    demoLogin,
    loading
  } = useAuth();

  const { language } = useLanguage();

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('9876543210');
  const [loginPassword, setLoginPassword] = useState('farmer123');
  const [showPassword, setShowPassword] = useState(false);

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupState, setSignupState] = useState('Maharashtra');
  const [signupDistrict, setSignupDistrict] = useState('Nashik');
  const [signupVillage, setSignupVillage] = useState('');
  const [signupCrop, setSignupCrop] = useState('onion');

  // Error & Success feedback
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isAuthModalOpen) return null;

  // Selected state districts
  const currentStateObj = STATES_AND_DISTRICTS.find(s => s.state.toLowerCase() === signupState.toLowerCase()) || STATES_AND_DISTRICTS[0];

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setSignupState(newState);
    const stateObj = STATES_AND_DISTRICTS.find(s => s.state.toLowerCase() === newState.toLowerCase());
    if (stateObj && stateObj.districts.length > 0) {
      setSignupDistrict(stateObj.districts[0].name);
    }
  };

  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    try {
      await login(loginIdentifier, loginPassword);
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleSignupSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    if (!signupName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!signupPhone.trim() || signupPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!signupPassword || signupPassword.length < 4) {
      setErrorMsg('Password must be at least 4 characters');
      return;
    }

    try {
      await signup({
        name: signupName.trim(),
        phone: signupPhone.trim(),
        email: signupEmail.trim(),
        password: signupPassword,
        state: signupState,
        district: signupDistrict,
        village: signupVillage.trim() || 'Farm Node',
        preferredCrop: signupCrop
      });
    } catch (err) {
      setErrorMsg(err.message || 'Signup failed. Please try again.');
    }
  };

  const handleQuickDemoLogin = async (farmerId) => {
    setErrorMsg(null);
    try {
      await demoLogin(farmerId);
    } catch (err) {
      setErrorMsg(err.message || 'Demo login failed');
    }
  };

  const handleFillSampleSignup = () => {
    setSignupName('Anand Kumar');
    setSignupPhone('9876500000');
    setSignupEmail('anand.kumar@fasalmitra.in');
    setSignupState('Haryana');
    setSignupDistrict('Gurugram');
    setSignupVillage('Sohna');
    setSignupCrop('wheat');
    setSignupPassword('farmer123');
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        {/* Header Gradient */}
        <div className="p-6 bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-900 text-white relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-200">
              Fasal Mitra Farmer Portal
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            {authModalTab === 'login' ? 'Welcome Back, Kisan Bhai!' : 'Create Farmer Account'}
          </h2>
          <p className="text-xs text-emerald-100/80 mt-1">
            {authModalTab === 'login'
              ? 'Login to access personalized mandi rates, saved crops & trade alerts'
              : 'Join thousands of farmers making smart crop selling decisions'}
          </p>

          {/* Tab Switcher */}
          <div className="flex items-center gap-2 mt-4 p-1 bg-black/20 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setAuthModalTab('login');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
                authModalTab === 'login'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Farmer Login
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthModalTab('signup');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
                authModalTab === 'signup'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              New Registration
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Demo 1-Click Login Box */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Quick 1-Click Test Accounts:
              </span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                For Judges & Farmers
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('farmer-1')}
                className="p-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-amber-200 text-left transition-all hover:border-emerald-400 group active:scale-95 shadow-2xs"
              >
                <div className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-700 flex items-center gap-1">
                  <span>👨‍🌾 Ramesh Patil</span>
                </div>
                <span className="text-[10px] text-slate-500 block">Nashik, MH • Onion</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('farmer-2')}
                className="p-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-amber-200 text-left transition-all hover:border-emerald-400 group active:scale-95 shadow-2xs"
              >
                <div className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-700 flex items-center gap-1">
                  <span>🌾 Balwinder Singh</span>
                </div>
                <span className="text-[10px] text-slate-500 block">Khanna, PB • Wheat</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('farmer-4')}
                className="p-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-amber-200 text-left transition-all hover:border-emerald-400 group active:scale-95 shadow-2xs"
              >
                <div className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-700 flex items-center gap-1">
                  <span>🚜 Virender Yadav</span>
                </div>
                <span className="text-[10px] text-slate-500 block">Gurugram, HR • Wheat</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('farmer-3')}
                className="p-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-amber-200 text-left transition-all hover:border-emerald-400 group active:scale-95 shadow-2xs"
              >
                <div className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-700 flex items-center gap-1">
                  <span>🍅 Venkatesh Rao</span>
                </div>
                <span className="text-[10px] text-slate-500 block">Kolar, KA • Tomato</span>
              </button>
            </div>
          </div>

          {/* TAB 1: LOGIN FORM */}
          {authModalTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Mobile / Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Mobile Number or Email
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="Enter 10-digit mobile number or email"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Password
                  </label>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    Demo: farmer123
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Logging In...' : 'Login to Fasal Mitra'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* TAB 2: SIGNUP FORM */
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              {/* Quick Fill Helper */}
              <div className="flex items-center justify-between pb-1">
                <span className="text-[11px] text-slate-500 font-semibold">Fill farmer details or:</span>
                <button
                  type="button"
                  onClick={handleFillSampleSignup}
                  className="text-[11px] text-emerald-700 font-bold hover:underline flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
                >
                  <Edit3 className="w-3 h-3" /> Fill Sample Details
                </button>
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Farmer Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. Anand Kumar"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Mobile & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="10-digit number"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Email (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* State & District Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    State *
                  </label>
                  <select
                    value={signupState}
                    onChange={handleStateChange}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    {STATES_AND_DISTRICTS.map((s) => (
                      <option key={s.state} value={s.state}>
                        {s.state}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    District *
                  </label>
                  <select
                    value={signupDistrict}
                    onChange={(e) => setSignupDistrict(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    {currentStateObj.districts.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Primary Crop & Village Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Primary Crop
                  </label>
                  <select
                    value={signupCrop}
                    onChange={(e) => setSignupCrop(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    {CROPS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.hindiName || ''})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Village / Block
                  </label>
                  <input
                    type="text"
                    value={signupVillage}
                    onChange={(e) => setSignupVillage(e.target.value)}
                    placeholder="e.g. Niphad / Sohna"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Registering Account...' : 'Complete Registration'}
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Privacy & Security Note */}
          <div className="pt-2 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Fasal Mitra secure agritech login • Encrypted & Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
